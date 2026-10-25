# Pack: Spanish

## 1. Metadata

```yaml
language: Spanish (Español)
typology: fusional, SVO, pro-drop, gendered
script: Latin, largely phonemic (accents mark stress and disambiguate)
script_module: false
tone: false
varieties: [peninsular, latinamerican, rioplatense]
confidence: high
frameworks: [CEFR]
verified: false
```

**The variety must be set before the first correction.** *Vosotros* vs *ustedes*, *vos*, *seseo*, and preterite-vs-present-perfect preference all differ, and marking a valid regional form as an error destroys trust fast. Ask, and record it in `PROFILE.md`.

## 2. Error taxonomy

| Tag | What it means |
|---|---|
| `[GENDER]` | noun gender, incl. *el agua*-type exceptions |
| `[AGREEMENT]` | adjective/article/number agreement chains |
| `[SER/ESTAR]` | copula choice, incl. meaning-changing pairs (*es listo* / *está listo*) |
| `[PRET/IMPF]` | preterite vs imperfect aspect |
| `[PERFECT]` | present perfect vs preterite (regionally variable — check variety) |
| `[SUBJ-FORM]` | subjunctive morphology |
| `[SUBJ-TRIGGER]` | failure to recognize a context that requires subjunctive |
| `[CLITIC]` | object pronoun choice, placement, ordering, doubling |
| `[POR/PARA]` | |
| `[PREP]` | other prepositions, incl. verbs governing *a/de/en/con* |
| `[ACCENT]` | written accents: stress rules and disambiguators (*el/él*, *si/sí*) |
| `[MOOD-SEQ]` | sequence of tenses in subordinate clauses |
| `[FALSE-FRIEND]` | *actualmente*, *asistir*, *embarazada*, *realizar* |
| `[COLLOC]` | *tomar una decisión*, *hacer una pregunta* |
| `[REGISTER]` | tú/usted, spoken forms in formal writing |

## 3. Grammar spine

**A2 consolidation** — present indicative incl. stem changes, gender/number agreement, *ser/estar* basics, reflexives, *gustar*-type verbs.

**★ A2→B1 UNLOCK — preterite vs imperfect.** The aspectual contrast has no English equivalent, so learners transfer nothing and narration stays broken until it clicks. It gates every past narrative, which is most of B1 production. Teach as a contrast from day one — never the two tenses separately. Reliable error: treating it as a duration rule instead of a framing choice.

**B1 core**
- **Present subjunctive: form, then triggers.** Triggers are the real content — volition, emotion, doubt, impersonal expressions, unrealized time clauses (*cuando venga*), *para que*. Learners who drill only forms still never deploy it.
- **Clitics** — *le/lo/la*, ordering (*se lo*), placement with infinitives/gerunds/imperatives, and doubling. Dense and high-frequency.
- **Por vs para** — treat as a discrete lesson; it recurs forever otherwise.
- **Present perfect vs preterite** — genuinely regional. Peninsular uses the perfect for today's events; much of Latin America doesn't.
- **Commands** — affirmative/negative asymmetry plus clitic attachment.

**B1→B2**
- **Imperfect subjunctive & *si*-clauses** — the three conditional types, especially *si tuviera... tendría*.
- **★ B2 unlock — connectors and impersonal constructions.** *Sin embargo, no obstante, por lo tanto, dado que, a pesar de que, en cuanto a*, plus impersonal *se* and passive *se*. Same effect as in every language: the cheapest visible register jump in exam writing.
- **Sequence of tenses** — matching subordinate mood/tense to the matrix verb.
- **Relative pronouns** — *que, quien, el cual, cuyo*, and the prepositional forms.
- **Nuance verbs** — *quedar(se)*, *llevar*, *dejar*, *poner(se)*, and periphrases (*ir a, acabar de, volver a, seguir + gerundio*).

## 4. Drill types

**Primary: minimal-pair choice with justification.** Fusional languages fail at *selection*, not construction — so present the choice and demand the reason.
> *Cuando (llegó / llegaba), yo (cenaba / cené).* — pick, then say why.

**Trigger recognition** — a matrix clause, learner says whether it forces subjunctive and completes it. Trains deployment rather than conjugation.
> *No creo que...* / *Es evidente que...*

**Paradigm completion** — timed conjugation grids for irregulars. Boring, necessary, cheap to auto-check.

**Clitic rewriting** — replace full noun phrases with pronouns, then move them around an infinitive or gerund.

**Agreement-chain repair** — a sentence with one gender error propagated through articles and adjectives; learner fixes the chain.

**Register upgrade** — colloquial → formal written, adding connectors and impersonal *se*.

## 5. Exam profiles

### DELE (Instituto Cervantes)
Level-specific exams — you sit DELE B2, not a single graded test. Four papers: reading, listening, writing, speaking, grouped into two blocks. **Both blocks must be passed independently** (a per-skill floor of exactly the kind that forbids trading skills off). Writing includes a task based on an input text or audio, so summarizing is a tested sub-skill.

### SIELE
Multilevel and adaptive, reports A1–C1 per skill rather than pass/fail, computer-based, results in ~3 weeks. Better when the learner needs a number fast or is unsure of their band; DELE is the more recognized certificate and doesn't expire.

Verify current formats against the Instituto Cervantes site before building mocks — task types are revised periodically.

## 6. Input sources

- **Gramática de uso del español** (SM) and **Aula Internacional** — standard reference and course series.
- **RTVE** and **Radio Ambulante** — the latter is Latin American, long-form, transcript-available.
- **News in Slow Spanish** / graded readers for the A2→B1 gap where authentic audio is still too fast.
- Instituto Cervantes **official DELE sample papers**, free per level, with audio.
- Set the variety and then keep input consistent with it; mixing accents at A2–B1 slows comprehension.

## 7. Known failure modes

- **The agent defaults to peninsular norms** unless told otherwise — *vosotros*, present perfect for recent past, *coger*. Set the variety explicitly.
- **Regional forms mislabeled as errors**: *leísmo* is standard in much of Spain, *voseo* is standard in Rioplatense, *seseo* is the majority norm. The agent flags these as mistakes. Gate on the variety field.
- **Over-correction toward the subjunctive** where the indicative is fine or both are acceptable with a meaning difference (*aunque*, *quizás*, *el hecho de que*).
- **False friends** in the learner's direction go undetected when the sentence is grammatical (*actualmente* for *actually*).
- **Accents** are silently normalized in reading, so accent errors get under-flagged; check them explicitly.
- **High confidence, so hedging is rarer** — which cuts both ways: corrections are reliable, and the occasional wrong one is stated just as firmly.
