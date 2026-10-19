// Worked examples, each checked by hand. Prices are the ones in tool.mjs (checked 2026-10-19) unless an example sets its own.
import { MODELS } from "./tool.mjs";

const prices = Object.fromEntries(MODELS.flatMap((m) => [[`${m.id}In`, m.in], [`${m.id}Out`, m.out]]));

export default [
  {
    name: "A 3,000-token job, 500 times a month",
    inputs: { inTokens: 3000, outTokens: 1000, runs: 500, ...prices },
    // Opus 5.5: (3,000 x 4 + 1,000 x 20) / 1,000,000 = 0.032 a run; x 500 = 16 a month.
    // Fable 5.1: (30,000 + 50,000) / 1,000,000 = 0.08; 40 a month. Haiku 5.5: (300 + 500) / 1,000,000 = 0.0008; 0.40.
    // DeepSeek V4 Pro: (3,960 + 3,960) / 1,000,000 = 0.00792; 3.96. Gemini 3.5 Flash-Lite: (900 + 2,500) / 1,000,000 = 0.0034; 1.70.
    expect: { opus55Run: 0.032, opus55Month: 16, fable51Run: 0.08, fable51Month: 40, haiku55Run: 0.0008, haiku55Month: 0.4, gpt6lunaMonth: 0.4, deepseekproRun: 0.00792, deepseekproMonth: 3.96, gemini35liteRun: 0.0034, gemini35liteMonth: 1.7, cheapestMonth: 0.4, dearestMonth: 40 },
    says: "the cheapest model here costs $0.40 a month",
  },
  {
    name: "A long document, 30 times a month",
    inputs: { inTokens: 200000, outTokens: 8000, runs: 30, ...prices },
    // Opus 5.5: (800,000 + 160,000) / 1,000,000 = 0.96; x 30 = 28.80. Sonnet 5.5: (400,000 + 80,000) / 1,000,000 = 0.48; 14.40.
    expect: { opus55Run: 0.96, opus55Month: 28.8, sonnet55Run: 0.48, sonnet55Month: 14.4 },
  },
  {
    name: "No runs yet",
    inputs: { inTokens: 3000, outTokens: 1000, runs: 0, ...prices },
    expect: { opus55Run: 0.032, opus55Month: 0, cheapestMonth: 0, dearestMonth: 0 },
    says: "costs nothing yet",
  },
  {
    name: "Nothing in or out",
    inputs: { inTokens: 0, outTokens: 0, runs: 100, ...prices },
    expect: { opus55Run: 0, fable51Month: 0, dearestMonth: 0 },
  },
  {
    name: "Your own, newer price",
    inputs: { inTokens: 3000, outTokens: 1000, runs: 500, ...prices, opus55In: 15, opus55Out: 75 },
    // (45,000 + 75,000) / 1,000,000 = 0.12 a run; 60 a month, now the dearest.
    expect: { opus55Run: 0.12, opus55Month: 60, dearestMonth: 60 },
  },
];
