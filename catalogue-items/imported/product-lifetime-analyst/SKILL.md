---
name: matlab-analyze-reliability
description: Use this skill when fitting accelerated life models, computing mean time to failure (MTTF), B10 life and similar quantities, fitting life distributions like Weibull for reliability analysis, comparing distribution fits, computing confidence intervals on reliability quantities with bootstrapping, performing lifetime prediction, computing failure rates, plotting Kaplan-Meier curves, computing survival functions, or doing reliability analysis.
license: https://www.mathworks.com/content/dam/mathworks/license/pmrl/license.md
metadata:
  author: MathWorks
  version: "1.0"
---

# matlab-analyze-reliability

Fit and evaluate probability distributions for use in reliability workflows in MATLAB using the recommended APIs and probability distribution framework 
(`fitdist`, `makedist`, `pdf`, `icdf`, `cdf`, `probplot`, `bootci`, `fitacclife`, `meanfailtime`).

<!-- needs: written by tools/add-needs.mjs for AI Blocks; not part of the original skill. Edit that tool, not this section. -->
## Before you start
Use the material below to do this job. If facts or tool access are missing, explain what you can finish and what must wait.

**What you need** (use your own material or the linked skill):
- **A spreadsheet** (yours): a spreadsheet with its data, formulas and charts.

How to start:
1. **Look first.** Use what they've already attached, pasted or put in their about-me note. In a coding assistant with file access, look in the project too for these by name.
2. **Check what's missing.** Look for a spreadsheet. They can attach files, paste the details, or share a file path your assistant can read. Ask only for missing facts that change the result. If they ask you to start with what they have, complete the parts you can and mark the gaps.
3. **Do the job.** Follow the skill below with the facts and tools you have. Mark each gap with `MISSING:` where it belongs and never invent a fact to fill it.

**Tools that do this best:**
- **MATLAB with the Statistics and Machine Learning Toolbox:** This is paid software, and it runs the code. Accelerated life models need R2026a or later.
- **Claude Code or Codex:** They can run MATLAB on your computer if it is set up, so you do not copy code by hand.
- **Any good chat AI:** It writes the code and explains the results. You run the code yourself.
<!-- /needs -->

## What you need

- Failure or test times, one per unit, in one unit of time (hours, cycles, days). Say which.
- Which units had not failed when the test or observation ended (optional). These are "censored" and must be marked, or the life estimate comes out too short.
- Stress levels per unit, for accelerated tests (optional), such as temperature or voltage, and the normal operating level you want to predict for.
- MATLAB with the Statistics and Machine Learning Toolbox (paid software). `fitacclife` and `meanfailtime` need MATLAB R2026a or later. Everything else here needs an earlier release.

MATLAB has to run the code. If you are in a chat that cannot run MATLAB, write the code, say it is untested, and ask the user to run it and paste back the numbers and any error.

If the failure times are missing, ask once. If it is still unclear which units were censored, ask once, then write `MISSING: censoring flags` and treat all units as failed only if the user says so. Never invent failure times or sample data for the user's answer.

## Steps

1. Check the data: number of units, number failed, number censored, and the time unit. Say so back in one line.
2. Fit the candidate distributions (Weibull, lognormal, exponential at least) with `fitdist`, passing `Censoring=cens` when any unit is censored.
3. Compare the fits with AIC (and BIC if asked), then probability plots, PDF and CDF overlays. Run goodness-of-fit tests only on uncensored data.
4. Pick the best fit and say why in one or two sentences. If two fits are close, say so and show both.
5. Compute the figures asked for: mean time to failure (MTTF), B10 life (time by which 10 percent have failed), failure rate, survival curve. Use bootstrap intervals (`bootci`) for each, refitting with the censoring flags.
6. For accelerated tests, fit with `fitacclife`, then report mean life at the normal operating level with `meanfailtime`.
7. Save the code as a script file the user can rerun.

## Output

Return, in this order:

1. **Data check**: units, failed, censored, time unit.
2. **Fit comparison table**: distribution, number of parameters, AIC, fitted parameters, sorted by AIC. A one-line pick and the reason.
3. **Life figures table**: MTTF and B10 (and any others asked for), each with a bootstrap confidence interval and the number of resamples used.
4. **Plots**: probability plots, a survival curve (Kaplan-Meier when censored), and the PDF or CDF overlay. Name each figure.
5. **Script**: the MATLAB code, ready to rerun.
6. **Cautions**: for example few failures, heavy censoring, or fits that are close.

## Checks

- The code uses the distribution objects and the functions named below, and uses `cdf(pd, x, "upper")` for survival, never `1 - cdf(...)`.
- Censoring is passed to every fit and every bootstrap refit when the data has censored units.
- No figure is quoted that the code did not produce. If the user has not run the code, label numbers as not yet computed.

## When to Use

Activate this skill when a user asks to:

- Fit an accelerated life model
- Compute standard quantities in a reliability analysis, such as mean time to failure (MTTF) or B10
- Fit life distributions, such as Weibull, for determining the lifetime/reliability of something
- Compare multiple distribution fits to determine the best model for failure data
- Estimate product reliability using lifetime/failure data
- Compute a survival/survivor function
- Plot a Kaplan-Meier curve or compute an empirical CDF of failure data
- Fit a distribution to censored failure data

## When NOT to Use

Do not activate this skill when:

- Fitting probability distributions for general statistical analysis without a reliability or lifetime context
- Performing hypothesis testing, ANOVA, or regression
- Computing capability indices (Cpk) or control charts for statistical process control as a standalone workflow
- Running simulation-based reliability analysis (Monte Carlo, fault trees)

<!-- next: written by tools/add-needs.mjs for AI Blocks; not part of the original skill. Edit that tool, not this section. -->
## After this
When you've handed it back, suggest what they could do next in one short question. It's a suggestion: if they're done, that's fine. Offer these, and say they can type their own:
- The [Pull request writer](https://useaiblocks.com/skills/pull-request-writer). It takes the test report and code change.
- The [Session to script exporter](https://useaiblocks.com/skills/session-to-script-exporter). It takes the code change.
- The [MATLAB audio plugin builder](https://useaiblocks.com/skills/audio-plugin-writer). It takes the code change.
- The [Code change test coverage reviewer](https://useaiblocks.com/skills/test-gap-finder). It takes the test report and code change.
- The [Test results analyst](https://useaiblocks.com/skills/agency-testing-test-results-analyzer). It takes the test report.
If they pick one and that skill is added here, carry straight on with what you just made. If not, give the link and say what to bring.
<!-- /next -->

## Key Functions

| Function | Purpose | Toolbox | Available From |
|----------|---------|---------|----------------|
| `fitdist` | Fit probability distribution to data | Statistics and Machine Learning Toolbox | R2009a |
| `makedist` | Create probability distribution from parameters | Statistics and Machine Learning Toolbox | R2013a |
| `bootci` | Bootstrap confidence intervals | Statistics and Machine Learning Toolbox | R2006a |
| `fitacclife` | Fit accelerated life model | Statistics and Machine Learning Toolbox | R2026a |
| `meanfailtime` | Compute mean failure time from accelerated life model | Statistics and Machine Learning Toolbox | R2026a |
| `ecdf` | Empirical CDF and Kaplan-Meier survival estimation | Statistics and Machine Learning Toolbox | R2006a |

## Conventions

### Constructing distribution objects
Always create a distribution object when working with probability distributions. The object stores distribution information, eliminating duplication and repeated computation across a script.

Use `makedist` when exact distribution parameters are known. Use `fitdist` when fitting data to a named distribution — this is the more common case. `fitdist` creates a distribution object and supports censored data via the `Censoring` name-value argument:
```matlab
% Fit a Weibull distribution to right-censored failure data
% cens is a logical vector: true = still running (censored), false = failed
pd = fitdist(failureTimes, "weibull", Censoring=cens);

% Assess fit quality using a probability plot
probplot(pd)
```

Get a list of all supported distributions by executing the command
```matlab
% All supported distributions
distributions = prob.ProbabilityDistributionRegistry.list() 

% All distributions that can be fit to data via fitdist
fittableDistributions = prob.ProbabilityDistributionRegistry.list('fittable')
```
This returns a cell array where each entry is a distribution with a corresponding object.

### Comparing distribution fits

When determining the best life distribution for failure data, fit multiple candidate distributions and compare them systematically using information criteria, goodness-of-fit tests, and visual assessment.

**Step 1: Fit multiple candidates**
```matlab
% Fit candidate life distributions
% If any unit is censored, add Censoring=cens to each fitdist call below.
pdWeibull = fitdist(failureTimes, "weibull");
pdLognormal = fitdist(failureTimes, "lognormal");
pdExponential = fitdist(failureTimes, "exponential");
```

**Step 2: Compare using AIC (Akaike Information Criterion)**

AIC balances fit quality against model complexity. Lower AIC is better. Compute AIC from the negative log-likelihood (`negloglik`) and number of parameters (`NumParameters`):
```matlab
% Compute AIC for each fit: AIC = 2*k + 2*NLL
distributions = {pdWeibull, pdLognormal, pdExponential};
distNames = ["Weibull", "Lognormal", "Exponential"];
aic = zeros(1, numel(distributions));
for i = 1:numel(distributions)
    nll = negloglik(distributions{i});
    k = distributions{i}.NumParameters;
    aic(i) = 2*k + 2*nll;
end

% Display comparison table
comparisonTable = table(distNames', aic', VariableNames=["Distribution", "AIC"]);
comparisonTable = sortrows(comparisonTable, "AIC");
disp(comparisonTable)
```

For BIC (Bayesian Information Criterion), use `BIC = k*log(n) + 2*NLL` where `n` is the sample size. BIC penalizes complexity more heavily than AIC.

**Step 3: Plotting**

**Step 3a: Visual comparison with probability plots**

Use `probplot` on each fitted distribution object for a qualitative visual check of fit quality. Data points appear along the straight reference line if the distribution is a good fit:
```matlab
figure
tiledlayout(1, numel(distributions))
for i = 1:numel(distributions)
    nexttile
    probplot(distributions{i})
    title(distNames(i))
end
```

**Step 3b: Overlay PDFs on a histogram**

Plot each candidate's PDF over the data histogram to visually compare how well they capture the shape of the failure time distribution:
```matlab
figure
histogram(failureTimes, Normalization="pdf")
hold on
t = linspace(min(failureTimes), max(failureTimes), 200);
for i = 1:numel(distributions)
    plot(t, pdf(distributions{i}, t), LineWidth=1.5, DisplayName=distNames(i))
end
hold off
legend
xlabel("Failure Time")
ylabel("Probability Density")
title("Distribution Fit Comparison")
```

**Step 3c: Overlay CDFs on the empirical CDF**

Compare fitted CDFs against the empirical CDF to assess fit in the tails:
```matlab
figure
ecdf(failureTimes)
hold on
for i = 1:numel(distributions)
    plot(t, cdf(distributions{i}, t), LineWidth=1.5, DisplayName=distNames(i))
end
hold off
legend
xlabel("Failure Time")
ylabel("Cumulative Probability")
title("CDF Comparison with Empirical CDF")
```

**Step 4: Goodness-of-fit tests (optional, uncensored data only)**

Use hypothesis tests for a formal statistical assessment. **These tests do not account for censoring** — apply them only to complete (uncensored) failure data. Using them on censored data produces misleading rejections.

Common choices:
- **Kolmogorov-Smirnov test** — `kstest(failureTimes, CDF=pdWeibull)` — tests whether data follows the fitted distribution
- **Chi-square test** — `chi2gof(failureTimes, CDF=pdWeibull)` — tests against the fitted CDF
- **Anderson-Darling** — available via `adtest` — more sensitive in the tails than K-S

A test returning `h = 0` means the fit is not rejected at the specified significance level. For censored data, rely on probability plots (`probplot`) and information criteria (AIC/BIC) to assess fit quality instead.

### Working with distribution objects
All distribution objects expose a standard set of methods. Execute `methods` on a constructed object for the full list. See `references/distribution-methods.md` for the complete method reference.
Key methods for reliability workflows: `cdf` (with `"upper"` for survival function), `icdf` (for quantiles like B10), `mean`, `paramci` (parameter confidence intervals), `probplot` (fit assessment), and `plot`.

Always prefer distribution object methods over manual computation. For example, use `mean(pd)` to get the mean of a fitted distribution rather than computing it from the parameters by hand. Use `icdf(pd, 0.10)` to get the B10 life rather than inverting the CDF manually.

### Computing the survival/survivor function
Always compute the survival function using the `"upper"` argument to `cdf`. Never compute it as `1 - cdf(...)` — this is numerically unstable in the tails. Use the pattern below:
```matlab
% Create a distribution
pd = makedist('normal');

% Get the survivor/survival function at 0, .2, .4, .6, .8, and 1
surv = cdf(pd, [0, .2, .4, .6, .8, 1], "upper")
```

### Computing the empirical CDF
There are two ways in which the empirical CDF can be computed:
```matlab
% Create via dedicated command line function
[F, x] = ecdf(survivalTimes)

% Create a distribution object
pd = fitdist(survivalTimes, "Empirical")
```
Either approach is valid, but the choice to use one or another depends on the end goal. The distribution object allows for computation of the PDF, CDF, etc. The ecdf function can allow for creating a quick visual, or getting a set of CDF numbers. In either case, the computation process can accomodate censored data.

If a user asks for a Kaplan-Meier or K-M curve/estimate, this is what they are referring to. The `ecdf` function can also get an estimate of the cumulative hazard function (Nelson-Aalen estimator) via `Function="cumulative hazard"`:
```matlab
% Nelson-Aalen cumulative hazard estimate
[H, x] = ecdf(survivalTimes, Censoring=cens, Function="cumulative hazard");
```

To plot a Kaplan-Meier survival curve with censored data:
```matlab
% cens is a logical vector: true = still running (censored), false = failed
% Use 'function','survivor' to plot the survival curve directly
ecdf(survivalTimes, Censoring=cens, Function="survivor")
xlabel("Time")
ylabel("Survival Probability")
title("Kaplan-Meier Survival Estimate")
```

### Fitting distributions that aren't supported by fitdist

Prefer `fitdist` for fitting distributions. If the requested distribution does not appear
in `prob.ProbabilityDistributionRegistry.list('fittable')`,
use the `mle` function instead. Provide `mle` with the data and either a PDF function handle
or a negative log-likelihood function. For example:
```matlab
% Create some sample data
x = ncx2rnd(8,3,1000,1);

% Create a function handle for the PDF. Note that this is distribution-specific
% and either you or a user should determine the correct form of this function handle
% The handle should take in a vector of data, and then one argument per parameter to fit
pdfFcn = @(x, v, d) ncx2pdf(x,v,d);

% Get the fitted parameters and confidence intervals
% A start point is required to estimate the parameters. Good values of the 
% start points should be determined based on what each of the distribution parameters represents,
% and they can be derived by data
start = [1 1];
[params, paramsCI] = mle(x, Pdf=pdfFcn, Start=start)
```

Execute `help mle` for details on specifying censoring data and other options.

### Getting confidence intervals for derived quantities

To get confidence intervals on derived quantities like mean failure time or B10,
use `bootci` with successive refitting:
```matlab
% Create some sample data
x = wblrnd(30, 10, 100, 1);

% Use bootci to successively refit data to a distribution, and get bootstrapped
% mean failure times
meanFailTime = @(x) mean(fitdist(x, "weibull"));
meanCI = bootci(500, meanFailTime, x)

% If there is censored data, make sure to refit with censoring to get an accurate result
meanFailTime = @(x, cens) mean(fitdist(x, "weibull", Censoring=cens));
meanCI = bootci(500, meanFailTime, x, cens)
```

### Fitting an accelerated life model

Use `fitacclife` (R2026a or later) to fit accelerated life models. Execute `help fitacclife` for full details. The function accepts factor data and failure times. Pass stress data in whatever units it is given — do not convert units (e.g., do not convert Celsius to Kelvin). Pass censoring data via the `Censoring` name-value argument. The default model is Arrhenius — change it with `StressModel` (built-in options include `"arrhenius"` and `"linear"`, or pass a function handle for custom models). Change the assumed life distribution with `Distribution`.

`fitacclife` returns an `AcceleratedLifeModel` object. Use `meanfailtime` on it to get mean failure times at original factor values or at specified normal operating conditions. Visualize predictions with `meanfailplot`. Other useful methods include `accelfactor`, `coefci`, `distplot`, `icdf`, and `probplot` — execute `methods` on the object for the full list.

If `fitacclife` emits convergence warnings, try providing initial parameter estimates via `InitialStressModelCoefficients` and `InitialDistributionCoefficient`, or adjust optimization settings via the `Options` argument (see `help fitacclife`).
----

Copyright 2026 The MathWorks, Inc.

----

## Credit and licence

Written by MathWorks (matlab-agentic-toolkit). The files in this folder are under the BSD 2-Clause licence in `LICENSE.md`. The front matter above points to MathWorks' own licence page for the same toolkit. Keep the credit to MathWorks when you reuse it. The MATLAB software itself is a separate paid product with its own licence.
