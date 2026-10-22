import { useEffect, useRef, useState } from "react";
import { LIMITS } from "./lib/composer-core";
type Recognition = { continuous: boolean; interimResults: boolean; lang: string; start(): void; stop(): void; abort(): void; onresult: ((event: { results: ArrayLike<ArrayLike<{ transcript: string }>> }) => void) | null; onend: (() => void) | null; onerror: ((event: { error: string }) => void) | null };
type VoiceWindow = Window & { SpeechRecognition?: new () => Recognition; webkitSpeechRecognition?: new () => Recognition };
const MAX_MS = 5 * 60 * 1000;
export default function VoiceRequest({ value, onChange, disabled, onListeningChange }: { value: string; onChange(value: string): void; disabled: boolean; onListeningChange(value: boolean): void }) {
  const [listening, setListening] = useState(false), [seconds, setSeconds] = useState(300), [message, setMessage] = useState("");
  const ref = useRef<Recognition | null>(null), elapsed = useRef(0), started = useRef(0), active = useRef(false), timeout = useRef<ReturnType<typeof setTimeout>>(), ticker = useRef<ReturnType<typeof setInterval>>();
  const supported = !!((window as VoiceWindow).SpeechRecognition || (window as VoiceWindow).webkitSpeechRecognition);
  const finish = () => { if (active.current) { elapsed.current = Math.min(MAX_MS, elapsed.current + performance.now() - started.current); active.current = false; } clearTimeout(timeout.current); clearInterval(ticker.current); setSeconds(Math.max(0, Math.ceil((MAX_MS - elapsed.current) / 1000))); setListening(false); onListeningChange(false); };
  const stop = () => { ref.current?.stop(); finish(); };
  useEffect(() => {
    const hide = () => { if (document.hidden && active.current) stop(); };
    document.addEventListener("visibilitychange", hide);
    return () => { document.removeEventListener("visibilitychange", hide); clearTimeout(timeout.current); clearInterval(ticker.current); if (ref.current) { ref.current.onresult = null; ref.current.onend = null; ref.current.onerror = null; ref.current.abort(); } };
  }, []);
  const start = () => {
    const Constructor = (window as VoiceWindow).SpeechRecognition || (window as VoiceWindow).webkitSpeechRecognition;
    if (!Constructor || disabled || active.current || elapsed.current >= MAX_MS || value.length >= LIMITS.request) return;
    const recognition = new Constructor(), base = value.trim(); ref.current = recognition;
    recognition.lang = "en-IN"; recognition.continuous = true; recognition.interimResults = true;
    recognition.onresult = event => {
      if (ref.current !== recognition) return;
      const transcript = Array.from(event.results).map(result => result[0]?.transcript ?? "").join(" ");
      const combined = [base, transcript].filter(Boolean).join(" "); onChange(combined.slice(0, LIMITS.request));
      if (combined.length >= LIMITS.request) { setMessage("The 10,000-character limit is reached. Edit your request before creating a workflow."); stop(); }
    };
    recognition.onend = () => { if (ref.current === recognition) finish(); };
    recognition.onerror = event => { if (ref.current !== recognition) return; setMessage(event.error === "not-allowed" ? "Microphone permission was denied. You can still type your request." : "Voice input stopped. Your text is kept; you can type or try again."); recognition.abort(); finish(); };
    try {
      setMessage(""); started.current = performance.now(); active.current = true; setListening(true); onListeningChange(true); recognition.start();
      const remaining = MAX_MS - elapsed.current;
      timeout.current = setTimeout(() => { setMessage("Five-minute voice limit reached. Review your text before creating a workflow."); stop(); }, remaining);
      ticker.current = setInterval(() => setSeconds(Math.max(0, Math.ceil((MAX_MS - elapsed.current - (performance.now() - started.current)) / 1000))), 250);
    } catch { setMessage("Voice input could not start. You can still type your request."); finish(); }
  };
  return <div className="compose-voice">
    <div className="compose-voice-controls"><button type="button" className="btn btn-dark" data-testid="compose-voice" onClick={listening ? stop : start} disabled={disabled || !supported || seconds === 0 || !listening && value.length >= LIMITS.request}>{listening ? "Stop recording" : "Speak your request"}</button><span className="small" role="timer" aria-label="Voice time remaining">{Math.floor(seconds / 60)}:{String(seconds % 60).padStart(2, "0")} remaining</span></div>
    <p className="small">{supported ? "Voice input is included, with no transcription API charge from this app. Up to five minutes total per visit. Your browser may send audio to its speech service; we receive text only when you create an AI workflow. Review the transcript before submitting." : "Voice input is unavailable in this browser. Type your request or use a browser with speech recognition."}</p>
    {message && <p role="status" className="small">{message}</p>}
  </div>;
}
