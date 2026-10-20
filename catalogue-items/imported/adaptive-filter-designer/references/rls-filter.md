# dsp.RLSFilter

## When to use dsp.RLSFilter

- Fast convergence required — Converges in ~*N* samples (vs ~10*N* for LMS)
- Tracking time-varying systems — Lower ForgettingFactor enables faster tracking
- Inverse system identification / equalization — Well suited for learning inverse models that compensate system distortion
- Computational cost — Requires O(N²) operations per sample

## Methods (5 variants)

| Method | Algorithm | Numerical Properties |
|--------|-----------|---------------------|
| `'Conventional RLS'` | Direct matrix inversion lemma | Standard |
| `'Householder RLS'` | Householder transformations | Improved numerical stability |
| `'QR-decomposition RLS'` | QR-based square-root method | Best numerical stability |
| `'Sliding-window RLS'` | Finite-memory RLS (bounded window) | Tracks abrupt changes; requires `SlidingWindowBlockLength` |
| `'Householder sliding-window RLS'` | Householder + sliding window | Best stability for non-stationary systems |

## Construction

```matlab
rls = dsp.RLSFilter( ...
    Length=32, ...
    Method="Conventional RLS", ...
    ForgettingFactor=0.99, ...
    InitialInverseCovariance=100);
```

## Key Properties

| Property | Purpose | Typical Values |
|----------|---------|----------------|
| `ForgettingFactor` | Exponential weighting of past data (λ) | 0.95-1.0 |
| `InitialInverseCovariance` | Scalar δ for P₀ = δ·I initialization | 10-1000 |

**ForgettingFactor tuning:**
- `1.0` — Infinite memory; best for stationary systems (lowest steady-state error, no tracking)
- `0.99` — Good default; slow tracking with low misadjustment
- `0.95-0.98` — Faster tracking of time-varying systems (higher misadjustment)
- `< 0.95` — Aggressive tracking; increased misadjustment and potential numerical instability

**InitialInverseCovariance tuning:**
- Default (`100`) — Good for most cases; fast initial convergence
- Larger (>= 1000) — Faster initial transient, but may overshoot early
- Too small (e.g., 0.001) — Very slow startup; filter appears "stuck" for first *N* samples
- Sliding-window methods — Set `SlidingWindowBlockLength` >= `Length`

## Weight Extraction

RLS has a `.Coefficients` property (unlike LMS):

```matlab
[y, err] = rls(x, d);
w = rls.Coefficients;  % 1×L row vector
```

**Note:** `.Coefficients` updates after each sample or frame call. Read it after the final call to obtain the converged weights.

## Inverse System Identification Pattern

Signal routing for inverse topology:
- **Filter input** — Output of the unknown system
- **Desired signal** — Delayed original input
  - The delay compensates for filter causality.

```matlab
sysOrder = 12;
b_sys = fir1(sysOrder, 0.55);
delay = sysOrder / 2;

x = randn(3000, 1);
sysOutput = filter(b_sys, 1, x);
xDelayed = [zeros(delay, 1); x(1:end-delay)];

rls = dsp.RLSFilter(Length=32, ForgettingFactor=1.0);
[y, err] = rls(sysOutput, xDelayed);
invCoeffs = rls.Coefficients;

% Validate: Cascade should approximate an allpass response
[H_inv, f] = freqz(invCoeffs, 1, 1024);
[H_sys, ~] = freqz(b_sys, 1, 1024);
H_cascade = H_sys .* H_inv;  % Magnitude should be approximately flat
```

## No maxstep() Support

- RLS does not use a step size. Instead, it uses `ForgettingFactor` property.
- Calling `maxstep()` on `dsp.RLSFilter` throws: "Undefined function 'maxstep' for input arguments of type 'dsp.RLSFilter'".

----

Copyright 2026 The MathWorks, Inc.

----
