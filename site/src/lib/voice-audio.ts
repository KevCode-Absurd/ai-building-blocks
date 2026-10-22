// Canonical 16 kHz mono PCM: duration is verifiable from the sample count.
export function pcmWav(samples: Float32Array, sampleRate: number, maxSeconds = 300): Blob {
  const length = Math.min(Math.floor(samples.length * 16000 / sampleRate), Math.floor(maxSeconds * 16000));
  const buffer = new ArrayBuffer(44 + length * 2), view = new DataView(buffer);
  const tag = (at: number, value: string) => [...value].forEach((c, i) => view.setUint8(at + i, c.charCodeAt(0)));
  tag(0, "RIFF"); view.setUint32(4, buffer.byteLength - 8, true); tag(8, "WAVEfmt "); view.setUint32(16, 16, true); view.setUint16(20, 1, true); view.setUint16(22, 1, true); view.setUint32(24, 16000, true); view.setUint32(28, 32000, true); view.setUint16(32, 2, true); view.setUint16(34, 16, true); tag(36, "data"); view.setUint32(40, length * 2, true);
  for (let i = 0; i < length; i++) {
    const start = Math.floor(i * sampleRate / 16000), end = Math.max(start + 1, Math.floor((i + 1) * sampleRate / 16000));
    let value = 0; for (let j = start; j < Math.min(end, samples.length); j++) value += samples[j];
    value = Math.max(-1, Math.min(1, value / (end - start))); view.setInt16(44 + i * 2, value < 0 ? value * 32768 : value * 32767, true);
  }
  return new Blob([buffer], { type: "audio/wav" });
}
