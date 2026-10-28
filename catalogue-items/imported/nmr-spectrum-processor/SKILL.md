---
name: nmrglue
description: Processes calibrated one-dimensional complex NMR free-induction decays with nmrglue into phased spectra, peak candidates, and signed integration regions. Use for raw 1D NMR processing, ppm-axis verification, apodization, Fourier transformation, manual phasing, baseline correction, or reproducible spectral integration.
license: MIT
compatibility: Requires Python 3.12+, nmrglue, NumPy 2+, and SciPy. Installation needs network access; processing is local and needs no credentials.
metadata:
  version: "1.1"
  skill-author: K-Dense Inc.
  tested-package-version: "0.12"
  last-reviewed: "2026-10-01"
---

# nmrglue: calibrated 1D FID processing

<!-- needs: written by tools/add-needs.mjs for AI Blocks; not part of the original skill. Edit that tool, not this section. -->
## Before you start
Use the material below to do this job. If facts or tool access are missing, explain what you can finish and what must wait.

**What you need** (use your own material or the linked skill):
- **Signal data** (yours): the recorded signal or time series, with its sample rate.

How to start:
1. **Look first.** Use what they've already attached, pasted or put in their about-me note. In a coding assistant with file access, look in the project too for these by name.
2. **Check what's missing.** Look for signal data. They can attach files, paste the details, or share a file path your assistant can read. Ask only for missing facts that change the result. If they ask you to start with what they have, complete the parts you can and mark the gaps.
3. **Do the job.** Follow the skill below with the facts and tools you have. Mark each gap with `MISSING:` where it belongs and never invent a fact to fill it.
<!-- /needs -->

## When to use

Use for a uniformly sampled complex 1D FID whose acquisition parameters and complex
frequency convention are available. The helper produces a descending ppm spectrum,
positive peak candidates, signed region integrals, and a reproducible processing report.
It does not identify compounds or assign resonances.

The executable accepts a NumPy `.npz` containing exactly one complex `fid` array or a
canonical 1D complex time-domain NMRPipe file. NMRPipe reading is tested with a synthetic
write/read round trip, known-spectrum recovery, and a small upstream NMRPipe-generated
binary fixture. Experimental Bruker, Varian, and JEOL
imports are **not verified by this suite**. For those formats, first inspect the relevant
nmrglue reader and acquisition metadata. Opening a converted file does not validate the
original acquisition decoding.
Read [references/acquisition-and-validation.md](references/acquisition-and-validation.md)
for conversion boundaries, axis calibration, and quantitative limits.

## Workflow

1. Preserve the raw FID. Establish spectral width in Hz, positive observation frequency
   in MHz, carrier in ppm, observed nucleus, and the sign convention from the acquisition
   or a known reference. Determine whether digital-filter/group-delay removal has already
   occurred. Do not infer these from array length or typical instrument defaults.
2. Copy [assets/processing.json](assets/processing.json) and replace its synthetic example
   values with the measured parameters and explicit processing choices. Its sign `-i`
   means a resonance at offset `f = (ppm - carrier_ppm) * observation_mhz` has time
   dependence `exp(-2*pi*i*f*t)`. Select `+i` only for the opposite convention; the helper
   conjugates it before processing. Validate with a known reference peak.
3. Choose nonnegative exponential line broadening (Hz), an even zero-filled size at
   least as large as the acquired FID, first-point scaling, and phase angles.
   Zero filling improves interpolation, not acquired spectral resolution.
   First-point scaling `0.5` is suitable for the supplied causal synthetic example;
   acquisition and prior preprocessing may require another value.
4. Run the helper, inspect the real and imaginary spectra, and revise manual phase if
   needed. `phase0_deg + phase1_deg * index / zero_fill_points` is applied after FT;
   index zero is the high-ppm edge. There is no implicit pivot or automatic phase estimate.
5. Only fit a linear baseline when explicitly supplied ppm regions are signal-free.
   Set `baseline` to `linear` and add `baseline_regions_ppm` containing at least two
   regions. Inspect residuals and broad peaks; fitting through signals biases integrals.
6. Compare peak positions with references, inspect peak candidates for artifacts, and
   integrate specified regions. Report overlapped peaks as overlapped. Preserve negative
   areas as diagnostic evidence of phase/baseline problems instead of taking absolute values.

## Execute

Tested with Python 3.12, nmrglue 0.12, NumPy 2.5.3, and SciPy 1.18.1:

```bash
uv run --no-project --python 3.12 --with nmrglue==0.12 --with numpy==2.5.3 --with scipy==1.18.1 \
  python skills/nmrglue/scripts/process_1d.py fid.npz processing.json nmr-result
```

Paths assume the collection root. Adjust them when installed elsewhere. The output
directory must be new, so repeated processing keeps previous results reviewable.

For an existing 1D NMRPipe FID, add `--input-format nmrpipe` and supply its path in place
of `fid.npz`. The helper requires the canonical FDF2 direct dimension, complex quadrature,
a time-domain flag, and agreement between header and JSON spectral width, observation
frequency, and carrier. JSON settings remain explicit; a mismatch fails instead of silently
recalibrating. `FDF2TDSIZE` must equal the stored complex-point count, and `FDF2CENTER` /
`FDF2ORIG` must describe a canonical centered axis. Previously zero-filled, truncated,
or recentered files need a separate acquisition-aware workflow. The nucleus/complex sign
and previous digital-filter corrections still need acquisition evidence. A time-domain
flag alone does not establish an unprocessed FID.

This executable synthetic example matches the supplied settings, generates resonances
at 3 and 7 ppm in a 1:2 amplitude ratio, and does not represent an experimental sample:

```python
import numpy as np

t = np.arange(8192) / 4000.0
fid = sum(a * np.exp(-np.pi * 2.0 * t)
          * np.exp(-2j * np.pi * (ppm - 5.0) * 400.0 * t)
          for ppm, a in [(3.0, 1.0), (7.0, 2.0)])
np.savez("fid.npz", fid=fid)
```

Run it with `assets/processing.json` as the settings argument. The repository suite
executes this signal and the CLI, checks both peak locations within 0.001 ppm, checks
integral ratio and analytic area, and checks phase and baseline recovery. The NMRPipe
round-trip test writes this FID using `ng.pipe.create_dic`/`ng.pipe.write`, reads it through
the CLI, and verifies the recovered peaks and integral ratio. Processed frequency-domain
files and conflicting calibration metadata are rejected.

The 2,176-byte upstream fixture checks complex sample order and header calibration using
a file generated by NMRPipe's `simTimeND` / `SET` tools. Those native tools were not run
in this review; this is fixture compatibility, not a live NMRPipe processing comparison.

## Deliverables and interpretation

- `spectrum.csv`: descending ppm, real signal after baseline correction, phased imaginary
  signal, and the fitted real baseline. Plot NMR with the high-ppm end on the left.
- `report.json`: input/settings SHA-256, package versions, all settings, acquired duration,
  zero-filled digital spacing, positive peak candidates, and signed region areas.

Integrals use endpoint interpolation and trapezoidal integration along increasing ppm;
area units are arbitrary signal times ppm, independent of display direction. Regions
outside the sampled ppm axis fail rather than being silently clipped. Peak prominence
is a fraction of the largest positive real intensity; it is not a noise-derived detection
limit. Strong solvent signals can obscure weak candidates at the default threshold.

For quantitative NMR, additionally establish relaxation delay, pulse angle, saturation,
receiver behavior, internal/external reference amount, and integration uncertainty.
The helper does not calculate concentrations or correct unequal relaxation. Preserve
these limits with the result rather than converting arbitrary areas to molecule counts.

<!-- next: written by tools/add-needs.mjs for AI Blocks; not part of the original skill. Edit that tool, not this section. -->
## After this
When you've handed it back, suggest what they could do next in one short question. It's a suggestion: if they're done, that's fine. Offer these, and say they can type their own:
- The [16S microbiome read processor](https://useaiblocks.com/skills/16s-microbiome-read-processor).
If they pick one and that skill is added here, carry straight on with what you just made. If not, give the link and say what to bring.
<!-- /next -->

## Upstream contracts

- [Processing functions](https://nmrglue.readthedocs.io/en/latest/reference/proc_base.html):
  exponential apodization, zero filling, FFT, and phase operations.
- [File and axis utilities](https://nmrglue.readthedocs.io/en/latest/reference/fileiobase.html):
  unit conversion uses spectral width in Hz, observation frequency in MHz, carrier in Hz.
- [NMRPipe reader/writer](https://nmrglue.readthedocs.io/en/latest/reference/pipe.html):
  the validated ingestion path is a synthetic canonical 1D time-domain round trip.
- [nmrglue project](https://github.com/jjhelmus/nmrglue): upstream source and format readers.

The hosted `latest` documentation identified itself as 0.9-dev when checked; the actual
0.12 package APIs and numerical behavior were tested. Its `proc_base.fft` uses the
negative-exponent NumPy FFT followed by `fftshift`; NMRPipe's FT convention corresponds
to `fft_positive`, so do not substitute it without revisiting the FID sign and phase.
See the [v0.12 processing source](https://github.com/jjhelmus/nmrglue/blob/v0.12/nmrglue/process/proc_base.py).
Multidimensional processing, nonuniform sampling, automated assignment, and experimental vendor imports remain outside
this helper's validated scope.
