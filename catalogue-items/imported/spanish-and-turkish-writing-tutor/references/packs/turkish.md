# Pack: Turkish

## 1. Metadata

```yaml
language: Turkish (Türkçe)
typology: agglutinative, SOV, head-final, vowel harmony, rigid suffix order
script: Latin, near-phonemic
script_module: false
tone: false
varieties: [standard Istanbul Turkish]
confidence: medium
frameworks: [CEFR]
verified: false    # spine drafted from standard TÖMER/Yedi İklim progression; wants a native review
```

Near-phonemic orthography means spelling correction is meaningful and pronunciation risk is low — unusual, and it makes Turkish unusually well-suited to a text-based tutor.

## 2. Error taxonomy

| Tag | What it means |
|---|---|
| `[CASE]` | wrong case suffix (-i/-e/-de/-den/-in) |
| `[POSS]` | possessive / izafet chain, incl. missing genitive on an embedded subject |
| `[NOMIN]` | -DIK/-AcAK/-mA noun clause: formation or choice between them |
| `[REL]` | relative clause: -An vs -DIK/-AcAK selection |
| `[CONVERB]` | -ken, -IncA, -ArAk, -DIkçE, -mAdAn |
| `[SUFFIX-ORDER]` | morphemes in the wrong sequence |
| `[VOWEL-HARM]` | 2-way (e/a) or 4-way (ı/i/u/ü) harmony |
| `[BUFFER]` | buffer consonant y/n/s, and k→ğ / t→d softening |
| `[TENSE]` | tense selection |
| `[ASPECT-mIş]` | inferential/evidential -mIş misuse |
| `[MODAL]` | -Abil, -mAlI, -mAlIydI |
| `[COND]` | -sA, -sAydI, -DIğI takdirde |
| `[VOICE]` | causative -DIr / passive -Il |
| `[POSTPOS]` | postposition + the case it governs (ile, için, göre, kadar) |
| `[CONNECTOR]` | discourse connectors, and over-use of `ki` |
| `[WORDORDER]` | verb-final violations, misplaced focus position |
| `[VOCAB]` / `[COLLOC]` | wrong word / wrong verb-noun pairing (*karar vermek*, not *karar yapmak*) |
| `[REGISTER]` | spoken forms in formal writing. Includes optional 3pl agreement: with a plural animate subject both *öğrenciler geldi* and *öğrenciler geldiler* are correct, the bare form reading slightly more written — do **not** flag it as an error. Inanimate plural subjects never take *-lAr* on the verb (*kitaplar düştü*, never *düştüler*) |

## 3. Grammar spine

**A2 consolidation** — case system, present/past/future, *var/yok*, basic izafet. Fix before proceeding; everything below stacks on cases.

**★ A2→B1 UNLOCK — -DIK / -AcAK nominalization.** The single highest-leverage structure in Turkish. Learners plateau at A2 because they chain everything with *ve/ama*; nominalization is what makes subordination possible at all, and it feeds relative clauses, reported speech, and nearly every complex sentence in the language. Three steps: **embed → nominalize (-DIK/-AcAK + possessive) → case-mark for the main verb.** Reliable errors: missing genitive on a different subject (*Kosova**'nın** ... olduğunu*), negation placed on the main verb instead of inside the clause, and retreat to `ki`-clauses.

**B1 core**
- **Relative clauses** — `-An` for subject participles (*gelen adam*), `-DIK/-AcAK` + possessive for everything else (*okuduğum kitap*). The selection rule is the error, not the forms.
- **Converbs** — *-ken, -IncA, -DIğIndA, -ArAk, -mAdAn önce / -DIktAn sonra, -DIkçE*. Turkish subordinates with morphology where English uses conjunctions; this is the register jump.
- **Cause & concession** — *-DIğI için, -DIğIndAn, -mAsInA rağmen, -DIğI halde*.
- **Modality** — *-Abil, -mAlI, -mAlIydI*.
- **-DIK vs -mA** — *gittiğini biliyorum* / *gitmesini istiyorum*. Governed by the matrix verb. Genuinely hard, and the agent gets it wrong (see §7).

**B1→B2**
- **Causative & passive** — *yaptırmak, yapılmak*. Passive is the marker of formal written Turkish; essays without it read as spoken.
- **Conditionals** — *-sA, -sAydI, -DIğI takdirde, -mAsI hâlinde*.
- **★ B2 unlock — discourse connectors** — *ancak, oysa(ki), dolayısıyla, bununla birlikte, öte yandan, üstelik, ne var ki, kaldı ki*. Cheapest available band jump in writing: the ideas need not improve, only the joins.
- **Evidential -mIş** and reported speech.
- **Academic register** — *-DIğI takdirde*, *... açısından/bakımından*, *söz konusu*, and verbs like *kaynaklanmak, ileri sürmek, vurgulamak, neden olmak*.

## 4. Drill types

**Primary: sentence-combining.** Give two simple sentences plus a matrix verb; the learner embeds. Directly trains the embed → nominalize → case-mark pipeline.
> "Bu web sitesi çok yavaş." + *fark ettim* → *Bu web sitesinin çok yavaş olduğunu fark ettim.*

**Suffix-stack completion** — supply root, target morphemes, and person; learner produces the stacked form with correct harmony and buffers.
> *öğren- / -AcAK / o / accusative* → *öğreneceğini*

**Harmony & buffer repair** — a sentence with correct morpheme choices but broken harmony; learner fixes only the phonology.

**Selection minimal pairs** — *-DIK* vs *-mA*; *-An* vs *-DIK*; *-IncA* vs *-DIğIndA*. Present the pair, learner picks and justifies.

**Register upgrade** — rewrite a spoken sentence in formal written Turkish (passive, connectors, no `ki`). Trains the B2 jump directly.

**Dictation** — useful but secondary; orthography is phonemic, so it tests listening rather than exposing hidden errors.

## 5. Exam profiles

### University TÖMER / Türkçe Dil Yeterlik Sınavı (TDYS)
Each university runs its own; formats vary in item counts but share the shape. **Always get the specific university's *örnek sınav*.** Four skills: Okuma, Dinleme, Yazma, Konuşma. Representative timings: reading 50 min, listening 30 min, writing 40 min (choose 1 of 3 prompts), speaking ~10 min split between a monologue and an interactive part. Degree programs taught in Turkish typically require **B2**.

### Yunus Emre Enstitüsü TYS
The national standard, co-designed with the Ankara, Ege, Gazi and Hacettepe TÖMERs — so it's a good proxy when a university's own sample isn't available. Canonical shape: 40 reading items, 30 listening, 2 writing tasks, 1 independent + 7 interactive speaking, 80 items total, across three sessions. **Per-skill minimum of 50%**, then 55–70 = B2, 71–88 = C1, 89–100 = C2. The floor is strategically decisive: strong reading cannot compensate for a weak speaking score.

Writing prompts run to civic/abstract essay topics — environment, art and psychology, a figure the candidate admires. Practice opinion essays with a thesis, connectors, and passive register rather than personal narrative.

## 6. Input sources

- **Yedi İklim Türkçe** (Yunus Emre Enstitüsü) and **İstanbul Yabancılar İçin Türkçe** — the two standard graded series; most university TÖMER curricula track one of them.
- **TRT** broadcast audio and news for authentic listening; news Turkish is close to exam register.
- Official **TYS sample questions** from the YEE exam site — includes audio, the hardest input to source otherwise.
- The learner's own course PDFs, if they have them, outrank everything above: they define what their institution will actually test.
- Turkish subtitles on Turkish content — not translated subtitles, which teach nothing.

## 7. Known failure modes

- **-DIK vs -mA selection is the agent's weakest point.** The choice is lexically governed by the matrix verb and the agent guesses plausibly. Verify against a grammar or a native speaker before logging a correction here.
- **`ki`-clauses get over-accepted.** They're grammatical but Persian-influenced and stylistically weak in exam writing; the agent often lets them pass instead of pushing the nominalized form.
- **Mid-resource confidence gap.** Corrections are usually right and occasionally confidently wrong — worse than random error, because the ledger drills them. Challenge anything surprising.
- **Colloquial vs written register** is under-flagged; the agent accepts spoken forms in essays.
- **Optional 3pl agreement gets falsely corrected.** *Öğrenciler geldi* is not an error, and inanimate subjects must not take *-lAr* on the verb — see the `[REGISTER]` row in section 2 before flagging either.
- **Vowel harmony in loanwords and proper nouns** is irregular and the agent over-applies the rule.
- **Low pronunciation risk** — phonemic orthography means text corrections transfer to speech better than in most languages. The usual "can't hear you" caveat is milder here than for French or Mandarin.
