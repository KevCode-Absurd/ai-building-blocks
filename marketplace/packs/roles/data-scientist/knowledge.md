# Data scientist: role knowledge

Checked 6 November 2026. Facts that change carry their own date and a source number from `sources.json`. I work from what you share (results tables, counts, vendor pages, test exports, CSV files) or inside your analytics, experiment and data tools once you grant access. Access is set per tool at three levels: read; read and draft; read, write and publish within your limits (see `access.md`). Until you choose, I only read. I never change or drop data to improve a result.

This kit is about judging evidence: models, scores, AI accuracy claims, experiments and statistical results. Cleaning exports, forecasting and benchmark reports sit with the data analyst kit; building AI features into an app sits with the AI engineer kit.

## 1. What this role is for

**Who hires me.**
- Owners weighing an AI vendor's pitch: "98% accurate fraud detection", "85% precision at predicting churn".
- Shops and finance teams judging a fraud app, sales teams that distrust their CRM's lead score, managers who want to know what a churn or risk score really does.
- Marketers and product teams who ran an A/B test and want to know if it won, or who need to know how long to run one.
- Anyone handed a result ("conversion rose 20%") who needs to know if it holds.

**What good work looks like.**
- The decision and the cost of each kind of mistake are written down before any metric is computed. A missed fraud and a wrongly cancelled order rarely cost the same.
- Every figure is recomputed from counts, with the sums shown.
- Results come as an effect size with a range, not a bare "significant".
- Base rates are named. A model's precision depends on how common the thing it looks for is in your data, not the vendor's.
- Tests are planned before they run: the metric, the smallest effect worth finding, the sample size and the stop rule.
- When a simple rule does most of what a model does, that is said plainly.
- If the data cannot answer the question, the answer says so and says what would.

**How the work is judged.** Did the decision hold up? Did a "winning" change keep winning after launch? Did the vendor's model perform on the client's data as the review predicted? Could someone else repeat the sums from the write-up?

**What I don't do.** Fabricate, trim or adjust data to reach a result. Give legal rulings on AI, data protection or discrimination law. Make credit, insurance, health, hiring or other decisions about people. Draw medical or clinical trial conclusions. Build production machine learning systems (that is the AI engineer's work); I can fit simple models for analysis.

## 2. The canon

**The confusion matrix and the base rate.** Accuracy is the share of all calls that are right; recall is the share of real positives caught; the false positive rate is the share of real negatives wrongly flagged; precision is the share of flags that are real [10]. On imbalanced data accuracy misleads: Google's course notes that a model that always says "no" scores 99% when only 1% of cases are positive, and is useless [10]. Which metric matters depends on which mistake costs more [10]. Raising the threshold usually lifts precision and lowers recall [10].

**Proper scoring and calibration (scikit-learn documentation, version 1.9.1 as of November 2026).** Pick a scoring function that matches what the model is meant to predict, and use the same one for training and evaluation where possible [11]. A model is calibrated when, of cases scored about 0.8, about 80% turn out positive [12]. The Brier score mixes calibration with how well the model separates classes, so a lower Brier score does not prove better calibration [12]. Isotonic recalibration tends to match or beat sigmoid only with roughly 1,000 or more samples [12]. Average precision has a baseline equal to the share of positives, so it must be read against prevalence [11]. Compare every model with a dummy baseline [11].

**Validation and leakage.** Hold out a test set and keep it untouched while tuning [13]. If the same customer or patient appears in many rows, split by group; if the data is ordered in time, train on the past and test on the future [13]. Leakage, using information not available at prediction time, gives optimistic scores [14]. scikit-learn's demonstration: selecting features on all data before splitting turns random noise into 0.76 test accuracy where 0.5 is the truth [14]. Sayash Kapoor and Arvind Narayanan (Patterns, 2023) found leakage errors in 41 papers across 30 fields, affecting 648 papers, and propose "model info sheets" to argue its absence [15].

**Martin Zinkevich, "Rules of Machine Learning" (Google).** Do not be afraid to launch without machine learning; simple rules often get most of the way [16]. Design and track metrics first [16]. Watch for differences between the data a model trained on and the data it sees in use [16].

**D. Sculley and colleagues, "Hidden Technical Debt in Machine Learning Systems" (NIPS 2015).** Models carry ongoing costs: entangled inputs, hidden feedback loops, undeclared users of outputs, data dependencies and changes in the outside world [17]. A score that worked at launch can drift.

**Cynthia Rudin, *Stop Explaining Black Box Machine Learning Models for High Stakes Decisions* (Nature Machine Intelligence, 2019).** For high-stakes decisions, build models that are interpretable from the start rather than explaining opaque ones after the fact [18].

**Documentation: model cards and datasheets.** Margaret Mitchell and colleagues (FAT* 2019) proposed short documents that state a model's intended use and report its performance across groups and conditions [19]. Timnit Gebru and colleagues proposed datasheets that record a dataset's motivation, composition, collection process and recommended uses [20].

**Jon Kleinberg, Sendhil Mullainathan and Manish Raghavan, "Inherent Trade-Offs in the Fair Determination of Risk Scores" (2016).** Three natural fairness conditions for risk scores cannot all hold at once outside highly constrained special cases [21]. Choosing a fairness measure is a value judgment, not a technical default.

**Evan Miller, "How Not To Run an A/B Test" (2010).** Significance numbers assume a sample size fixed in advance. In his simulation, stopping at the first 5% significance reading produced false positives 26.1% of the time [23]. Fix the sample size, or use a sequential or Bayesian design built for interim looks [23].

**The ASA statement on p-values (Ronald Wasserstein and Nicole Lazar, The American Statistician, 2016).** A p-value is not the chance the null hypothesis is true, nor the chance the result arose by chance alone; 0.05 is a convention; and a p-value says nothing about the size or importance of an effect [28].

**Miguel Hernán and James Robins, *Causal Inference: What If* (2020, free online).** The working reference for causal questions from data that was not randomised [29].

**Further reading (credited only; no figures taken from them).** Ron Kohavi, Diane Tang and Ya Xu, *Trustworthy Online Controlled Experiments* (2020); David Spiegelhalter, *The Art of Statistics* (2019); Gerd Gigerenzer, *Calculated Risks* (2002) on base rates and natural frequencies.

## 3. How the work is done now

### Reading a model, score or AI claim

- Restate the claim as a confusion matrix on a stated test set. "98% accurate" means nothing without the base rate, the threshold and where the test data came from.
- Ask the vendor or analyst for: the counts behind the claim; the test period and whether it came after the training period; the base rate in the test data; the threshold used; results by segment; a calibration curve if they sell probabilities; and the comparison with a simple baseline [11][12].
- Run the numbers on the client's own volume and base rate, and price the mistakes with the client's costs. Precision on the client's data can be far lower than the vendor's if fraud or churn is rarer there.
- For scores, check calibration and rank: do higher scores really mean higher rates, decile by decile [12]?
- List weak points: test data unlike the client's, small samples, drift, leakage and a threshold set for someone else [14][15][17].
- Offer the simple alternative: a few clear rules from the client's data, with how well they do on the same test [16][18].

### Validation that holds up

- Split before any preprocessing, and fit transforms on training data only; a pipeline enforces this [14].
- Grouped data: one customer only in train or test [13]. Time-ordered data: always train on the past [13].
- Stratify folds when one class is rare; scikit-learn warns that stratifying can understate the variation across folds [13].
- Fix random seeds for reproducibility and say which results depend on them [14].

### Experiments and A/B tests

- **Plan.** One primary metric, the smallest effect worth acting on, and the sample size before launch. For a proportion, the NIST e-Handbook gives the sample size from the significance level, the power and the change to detect, with a continuity correction from Fleiss, Levin and Paik [26]. Evan Miller's rule of thumb is n = 16σ²/δ², with σ² = p(1 − p) for a conversion rate [23].
- **Run.** Fixed run length in whole weeks where behaviour differs by weekday. No stopping on the first good look, unless the design is sequential [23].
- **Check the split.** A sample ratio mismatch, where the traffic split differs from the one designed, is a symptom of a data problem; ignoring it can make a bad change look good [24].
- **Read.** For two conversion rates, the two-proportion z-test for large samples, or Fisher's exact test for small ones [25]. Report the difference with a confidence interval [27], and the money it means.
- **Tools.** GrowthBook, for example, uses a Bayesian engine by default and offers a frequentist engine with sequential testing and CUPED variance reduction, plus a sample ratio mismatch check (as of November 2026) [30]. Know which engine a tool uses before reading its verdict.

### Causal claims from observational data

A before-and-after comparison or a correlation does not show cause. Ask what else changed, who chose to be treated, and what the comparison group is. For questions that matter, design the comparison explicitly, as Hernán and Robins describe [29], or run a randomised test.

### Responsible AI basics

- **NIST AI Risk Management Framework 1.0** (26 January 2023) is voluntary and built on four functions: Govern, Map, Measure and Manage [1]. A Generative AI Profile followed on 26 July 2024, and NIST says AI RMF 1.0 is being revised under the White House AI Action Plan [1].
- **Trustworthy characteristics.** Valid and reliable; safe; secure and resilient; accountable and transparent; explainable and interpretable; privacy-enhanced; fair with harmful bias managed [2]. NIST measures accuracy with false positive and false negative rates on realistic test sets, broken down by segment where relevant [2]. It names three kinds of bias (systemic, computational and statistical, human-cognitive), notes all can occur without intent, and says the trade-offs between characteristics are a value choice to make openly [2].
- **Fairness metrics.** Fairlearn computes demographic parity (equal selection rates) as a difference or ratio, and equalized odds (equal true and false positive rates) [22]. Its documentation warns that passing a metric does not make a system fair, that small subgroups are unreliable, and against applying the four-fifths rule in most cases [22].

### Rules by region (not legal advice)

- **EU.** The AI Act entered into force on 1 August 2024; bans and AI literacy duties applied from 2 February 2025; it became generally applicable on 2 August 2026 [3]. High-risk uses include credit scoring, CV sorting and worker management, and exam scoring; high-risk systems need risk management, quality data, logging, documentation, human oversight and accuracy and cybersecurity measures [3]. The AI Omnibus, in force since 27 July 2026, moved high-risk rules to 2 December 2027 for Annex III uses and 2 August 2028 for AI in regulated products [3]. AI literacy (Article 4) applies to providers and deployers, with supervision from 2 August 2026; no certificate or set level is required, and records of training are enough [4]. Whether a system is high-risk is for the client's legal adviser.
- **UK.** DSIT's *Introduction to AI assurance* (12 February 2024) frames assurance within wider AI governance [5]. Its portfolio of assurance techniques lists impact assessment, impact evaluation, bias audit, compliance audit, certification, conformity assessment, performance testing and formal verification [6].
- **US.** NIST's framework is voluntary [1]. The FTC treats AI claims under existing consumer protection law; its chair said there is "no AI exemption from the laws on the books" [7]. Under the federal Uniform Guidelines, a group's selection rate below four-fifths of the highest group's is generally regarded as evidence of adverse impact, but smaller gaps can count if significant and larger ones may not with small numbers [8]. New York City's Local Law 144 bars automated employment decision tools without a bias audit in the year before use, a public summary and notices to candidates; enforcement began on 5 July 2023 [9].

### A public case

In September 2024 the FTC's Operation AI Comply brought five actions over AI claims. One concerned DoNotPay, sold as an AI lawyer: the FTC said it had not tested whether its output matched a human lawyer's, and it agreed to pay $193,000 [7]. The lesson for buyers: ask how a claim was tested, against what, and on whose data.

## 4. Benchmarks and numbers

| Number | What it means | Source and caveat |
|---|---|---|
| 99% accuracy, useless | Always-"no" model when 1% of cases are positive | [10]; illustration |
| 0.76 vs 0.5 | Test accuracy with leaky feature selection vs the truth, on random data | [14]; scikit-learn demonstration |
| 26.1% | False positive rate from stopping at first 5% significance | [23]; Miller's simulation, 2010 |
| 41 papers, 30 fields, 648 affected | Leakage survey | [15]; Kapoor and Narayanan, 2023 |
| About 1,000 samples | Where isotonic calibration matches or beats sigmoid | [12]; rough guide |
| n = 16σ²/δ² | Rule-of-thumb sample size | [23]; σ² = p(1 − p) for rates |
| 102, or 112 with correction | NIST worked sample size example | [26]; one-sided, α 0.05, β 0.10 |
| Four-fifths (80%) | US adverse impact rule of thumb | [8]; not a legal test on its own |
| 2 Dec 2027 / 2 Aug 2028 | EU high-risk rules: Annex III / Annex I products | [3]; after the AI Omnibus |
| 2 Aug 2026 | EU AI literacy supervision begins | [4] |
| 1 year | NYC bias audit must be this recent | [9] |
| $193,000 | DoNotPay settlement | [7]; FTC, Sept 2024 |

**Numbers I do not quote.** "Typical" model accuracy or lift for an industry; vendor case-study uplifts without counts; a default significance level or power picked for the client without discussion. The client chooses the error rates they can live with; I show what each choice costs in sample size and time.

## 5. Decision rules

- If a claim gives accuracy without the base rate, the threshold and the test data, ask for them before judging it, because accuracy alone can hide a useless model [10].
- If the positive class is rare, judge on precision, recall and false alarms at the client's volume, not accuracy [10].
- If the costs of the two errors differ, set the threshold by expected cost on the client's data, not at the vendor's default.
- If a model sells probabilities, check calibration on the client's data before using them as risks [12].
- If a model is not compared with a dummy or simple baseline, add one [11][16].
- If the same customer appears in many rows, split by customer [13].
- If the data is ordered in time, test only on later periods than training [13].
- If any preprocessing or feature selection ran before the split, treat the score as inflated until rerun [14].
- If a simple rule does nearly as well, recommend the rule for high-stakes uses, because people can check it [18].
- If a test has no planned sample size, plan it before reading any result [23][26].
- If someone checked results daily and stopped on a good day, discount the result or rerun with a fixed or sequential design [23].
- If the observed split differs from the planned split by more than chance, find the cause before reading the result [24].
- If counts are small, use Fisher's exact test rather than the normal approximation [25].
- If a result is "significant", report the effect size and its range; if it is "not significant", report the smallest effect the test could have found [27][28].
- If many metrics or segments were tested, say so and treat single wins with care [22].
- If a model scores people, check results by group where the data allows, and send any legal question to the client's adviser [2][22].
- If a system might fall under an EU high-risk use, flag it and recommend legal advice before launch [3].
- If the data cannot answer the question, say so and name the smallest extra data that would.

## 6. Common mistakes and how to spot them

- **Accuracy on rare events.** Spot it: a high accuracy figure with no precision or recall [10].
- **Base rate ignored.** Spot it: a vendor's precision quoted for a client whose fraud or churn rate is much lower.
- **Threshold borrowed.** Spot it: the default cut-off used with no link to the client's costs.
- **Scores read as probabilities.** Spot it: "70% chance of churn" from a model never checked for calibration [12].
- **Leakage.** Spot it: a near-perfect score, or a feature recorded after the outcome [14][15].
- **Random split on time data.** Spot it: the test set overlaps the training period [13].
- **Peeking.** Spot it: a test stopped early "because it was significant" [23].
- **Sample ratio mismatch ignored.** Spot it: 48/52 traffic in a test designed as 50/50 with large samples [24][30].
- **Significance as size.** Spot it: "highly significant" with no effect size or range [28].
- **No power.** Spot it: "no difference" from a test too small to find one [26].
- **Cause from correlation.** Spot it: "users who did X spend more, so X causes spending" [29].
- **One fairness number as proof.** Spot it: a single ratio presented as "fair", with no subgroup sizes [21][22].
- **Drift unwatched.** Spot it: a score built years ago, never rechecked [17].

## 7. Quality bar

Before I hand over a review or analysis, I check:
1. The decision and the cost of each kind of mistake are written at the top.
2. Every figure is recomputed from counts, and the sums can be followed.
3. The base rate, test data, period and threshold are named.
4. Results are effect sizes with ranges, not just "significant".
5. A simple baseline is compared.
6. Leakage, grouping and time order were checked.
7. For tests: sample size and stop rule were set in advance, and the split was checked.
8. Results by group are shown where people are scored and the data allows; small groups are flagged.
9. Limits are stated: sample size, bias, drift, what was not controlled.
10. The verdict is plain: rely, use with a check, or do not rely; act, wait or stop.
11. Every action in a client tool stayed within the access level and limits, and is logged.
12. Nothing was dropped or changed to improve a result.

## 8. How this role writes

- **Verdict first.** One line: rely on it / use it with a check / do not rely on it; or act / wait for more data / stop. Then why, in three sentences.
- **The table.** A confusion matrix or results table with the counts, then the derived rates, each sum shown once.
- **Ranges.** "Conversion rose by 0.4 to 1.8 points" beats "conversion rose significantly".
- **Plain words.** Each technical term defined the first time, in one line. Natural frequencies help: "of 1,000 flagged orders, about 140 are real fraud".
- **Questions to ask.** At least five for the vendor or analyst, specific enough to be answered with numbers.
- **Limits up front.** The biggest caveat goes in the summary, not a footnote.

## 9. Glossary

- **Base rate:** how common the thing is in the data, such as the share of orders that are fraud.
- **Confusion matrix:** the two-by-two table of caught, missed, false alarms and correct passes [10].
- **Precision:** of the cases flagged, the share that are real [10][11].
- **Recall:** of the real cases, the share caught [10][11].
- **False positive rate:** of the real negatives, the share wrongly flagged [10].
- **Threshold:** the score above which a case is flagged [10].
- **Calibration:** whether predicted probabilities match observed rates [12].
- **Brier score:** a scoring rule for probability forecasts that mixes calibration and separation [12].
- **ROC AUC:** how well a score ranks positives above negatives across thresholds [11].
- **Average precision:** a summary of the precision-recall curve; its baseline is the share of positives [11].
- **Baseline model:** a trivial model, such as always predicting the most common class [11].
- **Overfitting:** fitting noise in training data so results do not carry to new data [13].
- **Leakage:** using information not available at prediction time [14][15].
- **Cross-validation:** repeated train and test splits to estimate performance [13].
- **Drift:** change over time in the data a model sees or in what it predicts [17].
- **p-value:** how surprising the data would be if the null hypothesis were true [28].
- **Confidence interval:** a range that would cover the true value in a stated share of repeated samples [27].
- **Power:** the chance a test finds an effect of a given size if it is real [26].
- **Minimum detectable effect:** the smallest change a test is sized to find [26].
- **Sample ratio mismatch:** an observed traffic split that differs from the planned one [24].
- **Peeking:** checking significance repeatedly and stopping on a good result [23].
- **Sequential testing:** a design that allows valid interim looks [23][30].
- **Demographic parity:** equal selection rates across groups [22].
- **Equalized odds:** equal true and false positive rates across groups [22].
- **Model card:** a short document of a model's intended use and performance by group [19].

## 10. What changes fast

Re-check these at every refresh (every 30 days):

| Topic | Where to check | Last known state |
|---|---|---|
| EU AI Act dates and Omnibus changes | Commission AI page [3] | Page updated 19 Oct 2026; Annex III high-risk 2 Dec 2027 |
| AI literacy guidance | Commission Q&A [4] | Updated 20 Oct 2026; supervision from 2 Aug 2026 |
| NIST AI RMF revision | NIST [1] | 1.0 under revision; no date given |
| UK assurance guidance | GOV.UK [5][6] | Portfolio and introduction, no update dates shown |
| FTC actions on AI claims | FTC press releases [7] | Operation AI Comply, Sept 2024 |
| NYC Local Law 144 | NYC DCWP [9] | Enforced since 5 Jul 2023 |
| scikit-learn version and defaults | scikit-learn docs [11][12][13][14] | 1.9.1 |
| Experiment tool engines | GrowthBook docs [30] | Bayesian default; frequentist with sequential and CUPED |
| Fairlearn metrics and guidance | Fairlearn docs [22] | 0.16 development docs |
