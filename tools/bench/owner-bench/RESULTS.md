# Owner-judged bench: results (13 Nov 2026)

We compared our agents with plain Opus 5.5. Twenty blind judges scored each pair: 5 each from Claude (Opus 5.5 and Sonnet 5.5), OpenAI (GPT-5.5 and 5.4), DeepSeek (chat and reasoner) and Gemini (pro and flash latest). The judges used the owner rubric: nine things a business owner cares about, with an e-commerce or general job layer on top. Each judge also had the owner's private notes, which list the signals hidden in the data.

Plain Opus outputs were made once and reused, so only our agents changed between "pre" and "post". The rubric is in `../rubrics/`. The plan behind the changes is in `PRD-TOP10.md` and `TICKETS.md`.

## Headline

| Set | Pre: agents–plain | Pre share | Post: agents–plain | Post share | Change |
|---|---|---|---|---|---|
| E-commerce, 12 jobs | 186–49 | 79.1% | **200–35** | **85.1%** | +6.0 pts |
| General, 10 jobs | 111–88 | 55.8% | **151–45** | **77.0%** | +21.2 pts |
| Held-out, 6 unseen jobs | 73–43 | 62.9% | 70–45 | 60.9% | flat (noise) |

Share counts decided verdicts only. Ties: 0 in every set except general post, which had 1. Pre e-commerce and pre general include a Gemini top-up after a model-name fix.

## By job

E-commerce, pre to post:
- J01 Meta budget: 11–7 to 10–8
- J02 TikTok: 20–0 to 15–4
- J03 concepts: 18–2 to 19–1
- J04 UGC: 14–6 to 15–5
- J05 ad copy: 18–2 to 17–3
- J06 product page: 13–7 to **19–1**
- J07 welcome series: 20–0 to 20–0
- J08 win-back: 14–5 to **19–1**
- J09 growth plan: 17–3 to 15–5
- J10 offers: 15–3 to 18–0
- J11 test plan: **7–13 to 14–6**
- J12 WhatsApp: 19–1 to 19–1

General, pre to post:
- G01 SEO: 17–3 to 15–5
- G02 landing page: 16–4 to 16–3
- G03 investor update: 10–10 to **20–0**
- G04 outbound: 10–10 to **8–12**
- G05 hiring: 10–10 to **7–13**
- G06 competitor: 17–3 to 18–2
- G07 launch: 16–4 to 19–1
- G08 pricing: **4–16 to 14–4**
- G09 content: **8–11 to 15–4**
- G10 onboarding: **3–17 to 19–1**

Held-out, pre to post:
- H01 stock plan: 12–7 to 7–11
- H02 Shopping and Performance Max: 12–6 to 10–8
- H03 returns and "where is my order": 4–16 to 4–16
- H04 cancel flow: 15–5 to 18–2
- H05 help centre: 13–7 to 19–1
- H06 affiliates: 17–2 to 12–7

## Owner dimensions, agent average (pre to post; plain in brackets at post)

| Dimension | E-commerce | General | Held-out |
|---|---|---|---|
| Fit to my case | 9.15 to 9.26 (8.52) | 8.81 to 9.18 (8.85) | 9.08 to 9.09 (8.86) |
| New insight | 8.73 to 8.93 (7.85) | 8.29 to 8.82 (8.14) | 8.66 to 8.90 (8.17) |
| Priorities | 8.94 to 9.03 (8.11) | 8.49 to 8.98 (8.38) | 8.93 to 9.09 (8.59) |
| Reasoning | 8.99 to 8.93 (8.00) | 8.51 to 8.77 (8.49) | 8.77 to 8.71 (8.20) |
| Correct | 8.83 to **8.69** (8.18) | 8.72 to 8.81 (8.65) | 8.72 to **8.47** (8.36) |
| Clear | 8.58 to **8.53** (8.74) | 8.74 to 8.76 (8.76) | 8.84 to **8.62** (8.90) |
| Voice and audience | 8.46 to 8.66 (8.36) | 8.69 to 8.86 (8.67) | 8.62 to **8.50** (8.70) |
| Range | 8.04 to **8.53** (7.65) | 7.77 to **8.31** (7.53) | 7.73 to **8.34** (7.83) |
| Ready to use | 8.62 to 8.79 (8.20) | 8.46 to 8.76 (8.15) | 8.65 to 8.57 (8.57) |
| Overall | 8.76 to 8.82 (7.96) | 8.34 to 8.76 (8.17) | 8.64 to 8.63 (8.23) |

## What this tells us

1. **The targeted fixes worked.** Every job the PRD targeted improved or flipped: G08, G10, G09, G03, J11, J06 and J08. Range rose in all three sets. New insight and priorities rose everywhere, and that includes the held-out jobs.
2. **The gains did not carry over to unseen jobs.** The held-out share was flat. The big swings came from fixing the specific cards and skills these jobs use, not from method changes alone. Expect the same lift elsewhere only after each family's cards and skills get the same owner pass.
3. **Three regressions to fix next.**
   - Clarity and correctness slipped a little on e-commerce and held-out. "Correct" fell 0.14 on e-commerce, just past the PRD's 0.1 guardrail.
   - Customer copy got heavier. G04 judges cited multi-ask emails and high-friction calls to action; G05 cited the hiring post; held-out voice fell. "Act fully on the signal" and "one bolder idea" are leaking extra content into customer-facing copy.
   - H01 and H06 slipped. They are worth a read before the next round.
4. **Noise.** There is one output per arm per job, so a single job can swing by a few votes. Plain Opus's own scores also moved between panels even though its outputs were identical: 8.04 to 7.96 in e-commerce, 8.32 to 8.17 in general.

## Files

- `ecom/`, `general/`, `heldout/`: briefs and owner notes.
- `out-*-pre/`, `out-*-post/`: the outputs.
- `judge-*/`: per-run `tally.json`, `reasons.txt`, `feedback.jsonl` and `raw/` verdicts.
- `../owner-judge.mjs`: the multi-provider runner.
- `scripts/`: theme counts, word limits, the signal-hit scorer and the bench-leak guard.
