---
name: pytensor-workflows
description: Build, differentiate, compile, and debug PyTensor symbolic computations for models. Use for symbolic tensor shape or dtype errors, named dimensions, indexing and broadcasting, vectorization and scan, numerical or sparse operations, symbolic RNG state, graph transformations and profiling, or custom differentiable Ops and backend lowering.
---

# PyTensor workflows

Express the intended calculation, then verify its values, shapes, derivatives,
and state transitions.

<!-- needs: written by tools/add-needs.mjs for AI Blocks; not part of the original skill. Edit that tool, not this section. -->
## Before you start
Use the material below to do this job. If facts or tool access are missing, explain what you can finish and what must wait.

**What you need** (use your own material or the linked skill):
- **A codebase** (yours): a project's code, in a folder or repo the AI can open.

How to start:
1. **Look first.** Use what they've already attached, pasted or put in their about-me note. In a coding assistant with file access, look in the project too for these by name.
2. **Check what's missing.** Look for a codebase. They can attach files, paste the details, or share a file path your assistant can read. Ask only for missing facts that change the result. If they ask you to start with what they have, complete the parts you can and mark the gaps.
3. **Do the job.** Follow the skill below with the facts and tools you have. Mark each gap with `MISSING:` where it belongs and never invent a fact to fill it.
<!-- /needs -->

## Establish the contract

1. Use the project's existing environment. Check installed PyTensor and relevant
   backend versions before choosing an API; development builds may differ.
2. State input/output shapes, axis meanings, dtypes, support, and mutable or
   random state. Named axes are not automatically coordinate-indexed arrays.
3. Choose the simplest supported graph operation. Prefer existing tensor
   primitives to an unnecessary custom Op. Preserve the scientific calculation
   when diagnosing compiler or backend limitations.
4. Check version-appropriate [official documentation](https://pytensor.readthedocs.io/)
   and installed source when a signature or backend limitation is uncertain.
5. Define an independent numerical or analytic reference and meaningful failure
   cases before executing the example.

## Select the relevant workflow

- [Shapes and structured computation](references/shapes.md): dimensions,
  broadcasting, indexing, vectorization, arithmetic/reductions, and control flow.
- [Numerical, sparse, and spectral computation](references/numerics.md): stable
  numerical formulations, sparse structure, special functions, and spectral
  operations with explicit restrictions.
- [Symbolic randomness](references/random.md): seeds, RNG state updates,
  shape semantics, reproducibility, and accidental repeated draws.
- [Graph compilation and profiling](references/compilation.md): graph/state
  inspection, transformations, modes, real failures, and evidence-led fixes.
- [Custom Ops and differentiation](references/custom-ops.md): type/shape
  contracts, forward/reverse differentiation, numerical derivative checks, and
  supported lowering interfaces.
- [Optional backend lowering](references/custom-backends.md): native JAX,
  PyTorch, and MLX representation, differentiation, and device restrictions.

Read only the references needed for the calculation. This skill is independently
installable; no other skill, host adapter, or service is required. If the graph
belongs to a probabilistic model, numerical correctness does not replace its
formulation, prior checks, inference diagnostics, or predictive criticism.

## Verify the calculation

- Compare compiled values to the declared reference over representative inputs,
  including relevant boundaries. Check shape and dtype as well as values.
- For differentiable computations, check the required Jacobian/vector products
  or gradients independently. Explain nondifferentiable inputs and boundaries;
  never return fabricated zero gradients merely to make inference run.
- For stateful computations, demonstrate both intended progression and
  reproducibility under a reconstructed initial state. Do not assume identical
  random numbers across different backend implementations.
- Reproduce a compiler failure before fixing it. Correct the graph, input
  contract, or supported implementation rather than hiding the exception.
- Separate compilation cost from repeated execution when profiling. Preserve
  existing compiler caches and report measurements rather than universal speed
  claims.
- Record the exact modes/backends exercised. Missing optional dependencies,
  unsupported operations, and untested hardware are different states. Linux
  execution does not establish macOS or accelerator support.

### Minimal runnable graph

This float64 vector example compiles a squared norm and its gradient, checks
both against independent references, and exercises the rank contract.

```python
import numpy as np
import pytensor
import pytensor.tensor as pt
from pytensor.gradient import grad

x = pt.vector("x", dtype="float64")
energy = pt.sqr(x).sum()
evaluate = pytensor.function([x], [energy, grad(energy, x)])

values = np.array([1.0, -2.0, 3.0], dtype="float64")
value, derivative = evaluate(values)
np.testing.assert_allclose(value, np.square(values).sum(), rtol=1e-12)
np.testing.assert_allclose(derivative, 2 * values, rtol=1e-12)
print("Squared norm:", float(value))  # 14.0
print("Gradient:", derivative)  # [ 2. -4.  6.]

try:
    evaluate(values.reshape(1, -1))
except TypeError as error:
    print("Rank-two input rejected:", error)
else:
    raise AssertionError("A vector input accepted a rank-two array")
```

## Optional implementation examples

Prefer built-in operations for ordinary models. The reusable
[BinomialLogpOp](scripts/binomial_logp_op.py) illustrates a pointwise likelihood
with explicit shape, support, and derivative contracts; it requires PyTensor,
NumPy, and SciPy. Keep the modules in this skill's `scripts/` directory together
on the Python import path when using an example.

Import only the lowering needed **before** compiling for that backend:

- [Numba](scripts/binomial_logp_numba.py) requires Numba.
- [JAX](scripts/binomial_logp_jax.py) requires JAX/jaxlib with x64 enabled.
- [PyTorch](scripts/binomial_logp_pytorch.py) requires PyTorch; this example is CPU-only.
- [MLX](scripts/binomial_logp_mlx.py) requires MLX with CPU float64 support.

These dependencies are optional and needed only for the corresponding examples.
Importing the base Op does not register optional lowerings. Check values,
derivatives, state, and unsupported inputs on the actual backend before using
an extension in a model; a working forward calculation does not establish
support for every shape-only, derivative, or accelerator graph.

<!-- next: written by tools/add-needs.mjs for AI Blocks; not part of the original skill. Edit that tool, not this section. -->
## After this
When you've handed it back, suggest what they could do next in one short question. It's a suggestion: if they're done, that's fine. Offer these, and say they can type their own:
- The [Persistent bug debugger](https://useaiblocks.com/skills/fix-loop-breaker). It takes the code change.
If they pick one and that skill is added here, carry straight on with what you just made. If not, give the link and say what to bring.
<!-- /next -->
