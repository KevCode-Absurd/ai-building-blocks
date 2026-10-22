import type { Page } from '@playwright/test';
// Deterministic Web Audio microphone fixture. The separate release canary uses
// Chrome's actual media device pipeline and real OpenAI transcription.
export async function mockVoiceCapture(page: Page) {
  await page.route('**/api/security', route => route.fulfill({ json: { required: false } }));
  await page.route('**/api/transcribe', route => route.fulfill({ json: { text: 'a landing page from scratch' } }));
  await page.addInitScript(() => {
    const state = window as any;
    state.__micStops = 0;
    Object.defineProperty(navigator, 'mediaDevices', { configurable: true, value: { getUserMedia: async () => {
      if (state.__denyMic) throw new DOMException('Denied', 'NotAllowedError');
      return { getTracks: () => [{ stop: () => state.__micStops++ }] };
    } } });
    state.AudioContext = class {
      sampleRate = 16000; destination = {}; node: any; timer: any;
      async resume() {}
      createMediaStreamSource() { return { disconnect() {}, connect: () => { this.timer = setInterval(() => this.node?.onaudioprocess?.({ inputBuffer: { getChannelData: () => new Float32Array(16000).fill(.1) } }), 1000); } }; }
      createScriptProcessor() { this.node = { disconnect() {}, connect() {} }; return this.node; }
      async close() { clearInterval(this.timer); }
    };
  });
}
