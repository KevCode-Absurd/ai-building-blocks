import { useEffect, useRef, useState } from "react";
import { LIMITS } from "./lib/composer-request";
import { protectedHeaders } from "./lib/turnstile";
import { pcmWav } from "./lib/voice-audio";
const MAX_MS = 300000;
export default function VoiceRequest({ value, onChange, disabled, onListeningChange }: { value: string; onChange(value: string): void; disabled: boolean; onListeningChange(value: boolean): void }) {
  const [phase, setPhase] = useState<"idle" | "starting" | "recording" | "transcribing">("idle"), [seconds, setSeconds] = useState(300), [message, setMessage] = useState("");
  const mounted = useRef(true), elapsed = useRef(0), started = useRef(0), active = useRef(false), stream = useRef<MediaStream>(), audio = useRef<AudioContext>(), processor = useRef<ScriptProcessorNode>(), source = useRef<MediaStreamAudioSourceNode>(), chunks = useRef<Float32Array[]>([]), frames = useRef(0), base = useRef(""), timer = useRef<ReturnType<typeof setInterval>>(), limit = useRef<ReturnType<typeof setTimeout>>(), request = useRef<AbortController>();
  const supported = !!navigator.mediaDevices?.getUserMedia && typeof AudioContext !== "undefined";
  const release = () => { clearInterval(timer.current); clearTimeout(limit.current); processor.current?.disconnect(); source.current?.disconnect(); stream.current?.getTracks().forEach(track => track.stop()); void audio.current?.close().catch(() => {}); };
  const finish = () => { if (!mounted.current) return; setPhase("idle"); onListeningChange(false); };
  const stop = async (exhausted = false) => {
    if (!active.current) return;
    active.current = false; elapsed.current = exhausted ? MAX_MS : Math.min(MAX_MS, elapsed.current + performance.now() - started.current);
    const rate = audio.current!.sampleRate; release(); setSeconds(Math.max(0, Math.ceil((MAX_MS - elapsed.current) / 1000))); setPhase("transcribing");
    try {
      if (frames.current < rate) throw Error("Please speak for at least one second, then stop recording.");
      const samples = new Float32Array(frames.current); let at = 0; for (const chunk of chunks.current) { samples.set(chunk, at); at += chunk.length; } chunks.current = [];
      let energy = 0; for (const sample of samples) energy += sample * sample;
      if (Math.sqrt(energy / samples.length) < .001) throw Error("No speech was heard. Check your microphone and try again.");
      const wav = pcmWav(samples, rate);
      const verification = await protectedHeaders("transcribe"); if (!mounted.current) return;
      request.current = new AbortController();
      const response = await fetch("/api/transcribe", { method: "POST", headers: { ...verification, "content-type": "audio/wav", "idempotency-key": crypto.randomUUID() }, body: wav, signal: AbortSignal.any([request.current.signal, AbortSignal.timeout(75000)]) });
      const data = await response.json().catch(() => ({ error: "Voice input could not finish. Please try again." })); if (!response.ok) throw Error(data.error || "Voice input could not finish. Please try again.");
      if (!mounted.current) return;
      if (typeof data.text !== "string" || !data.text.trim()) throw Error("No speech was heard. Please try again.");
      const combined = [base.current, data.text.trim()].filter(Boolean).join(" "); onChange(combined.slice(0, LIMITS.request));
      setMessage(combined.length >= LIMITS.request ? "The 10,000-character limit is reached." : elapsed.current >= MAX_MS ? "Five-minute voice limit reached. Your text is ready to review." : "Your recording has been added. You can edit the text.");
    } catch (error) { if (mounted.current) setMessage((error as Error).message || "Voice input could not finish. Please try again."); }
    finally { chunks.current = []; finish(); }
  };
  useEffect(() => {
    mounted.current = true;
    const hide = () => { if (document.hidden && active.current) void stop(); };
    document.addEventListener("visibilitychange", hide);
    return () => { mounted.current = false; active.current = false; document.removeEventListener("visibilitychange", hide); release(); request.current?.abort(); chunks.current = []; };
  }, []);
  const start = async () => {
    if (!supported || disabled || phase !== "idle" || elapsed.current >= MAX_MS || value.length >= LIMITS.request) return;
    setMessage(""); setPhase("starting"); onListeningChange(true); base.current = value.trim();
    try {
      const context = new AudioContext(); audio.current = context; await context.resume();
      const media = await navigator.mediaDevices.getUserMedia({ audio: { channelCount: 1, echoCancellation: true, noiseSuppression: true }, video: false });
      if (!mounted.current) { media.getTracks().forEach(t => t.stop()); void context.close().catch(() => {}); return; }
      stream.current = media; source.current = context.createMediaStreamSource(media);
      processor.current = context.createScriptProcessor(4096, 1, 1); chunks.current = []; frames.current = 0;
      const remaining = MAX_MS - elapsed.current, maxFrames = Math.floor(remaining / 1000 * context.sampleRate);
      processor.current.onaudioprocess = event => {
        if (!active.current) return;
        const input = event.inputBuffer.getChannelData(0), count = Math.min(input.length, maxFrames - frames.current);
        if (count > 0) { chunks.current.push(input.slice(0, count)); frames.current += count; }
        if (frames.current >= maxFrames) void stop(true);
      };
      source.current.connect(processor.current); processor.current.connect(context.destination);
      started.current = performance.now(); active.current = true; setPhase("recording");
      limit.current = setTimeout(() => void stop(true), remaining);
      timer.current = setInterval(() => setSeconds(Math.max(0, Math.ceil((MAX_MS - elapsed.current - (performance.now() - started.current)) / 1000))), 250);
    } catch (error) { release(); setMessage((error as Error).name === "NotAllowedError" ? "Microphone permission was denied. Allow microphone access in your browser and try again." : "Your microphone could not start. Check that it is connected and try again."); finish(); }
  };
  const label = phase === "recording" ? "Stop recording" : phase === "transcribing" ? "Transcribing recording" : phase === "starting" ? "Opening microphone" : "Record voice request";
  const processing = phase === "starting" || phase === "transcribing";
  return <div className="compose-voice">
    <div className="compose-voice-controls"><button type="button" className="btn btn-dark compose-voice-icon" data-testid="compose-voice" aria-label={label} title={phase === "idle" ? "Record with OpenAI Whisper" : label} aria-pressed={phase === "recording"} aria-busy={processing} onClick={() => phase === "recording" ? void stop() : void start()} disabled={disabled || !supported || processing || phase === "idle" && (seconds === 0 || value.length >= LIMITS.request)}>
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" className={processing ? "compose-voice-spinner" : undefined}>
        {processing ? <path d="M20 12a8 8 0 1 1-8-8" /> : phase === "recording" ? <rect x="6" y="6" width="12" height="12" rx="2" fill="currentColor" stroke="none" /> : <><rect x="9" y="2" width="6" height="12" rx="3" /><path d="M5 10v2a7 7 0 0 0 14 0v-2M12 19v3M8 22h8" /></>}
      </svg>
    </button><span className="small" role="timer" aria-label="Voice time remaining">{Math.floor(seconds / 60)}:{String(seconds % 60).padStart(2, "0")} remaining</span></div>
    {(!supported || message) && <p role="status" className="small">{message || "This browser cannot access a microphone. You can type your request."}</p>}
  </div>;
}
