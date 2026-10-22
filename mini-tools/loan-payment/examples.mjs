// Fixed reference fixtures calculated independently of the production formula engine.
// Each example supplies every input, with zero, boundary and simple cross-check cases.
// Tiny-rate reference values use Python Decimal at 80-digit precision and the
// original exact annuity formula, independently of the stable production series.
export default [
  {
    "name": "Illustrative figures with the default inputs",
    "inputs": {
      "principal": 12000,
      "annual": 12,
      "months": 24
    },
    "expect": {
      "rate": 1,
      "payment": 564.881666679176,
      "total": 13557.160000300224,
      "interest": 1557.160000300224
    }
  },
  {
    "name": "Alternative plan",
    "inputs": {
      "principal": 12000,
      "annual": 0,
      "months": 24
    },
    "expect": {
      "rate": 0,
      "payment": 500,
      "total": 12000,
      "interest": 0
    }
  },
  {
    "name": "Zero or limiting case",
    "inputs": {
      "principal": 0,
      "annual": 12,
      "months": 24
    },
    "expect": {
      "rate": 1,
      "payment": 0,
      "total": 0,
      "interest": 0
    }
  },
  {
    "name": "Boundary case",
    "inputs": {
      "principal": 12000,
      "annual": 12,
      "months": 1
    },
    "expect": {
      "rate": 1,
      "payment": 12119.999999999989,
      "total": 12119.999999999989,
      "interest": 119.99999999998909
    }
  },
  {
    "name": "Simple cross-check",
    "inputs": {
      "principal": 1000,
      "annual": 0,
      "months": 10
    },
    "expect": {
      "rate": 0,
      "payment": 100,
      "total": 1000,
      "interest": 0
    }
  },
  {
    "name": "Tiny positive rate preserves positive interest",
    "inputs": { "principal": 100000000, "annual": 1e-12, "months": 1200 },
    "expect": { "rate": 8.333333333333334e-14, "payment": 83333.33333337503, "total": 100000000.00005004, "interest": 0.000050041666666675 }
  },
  {
    "name": "Small positive rate stays numerically stable",
    "inputs": { "principal": 100000000, "annual": 1e-8, "months": 1200 },
    "expect": { "rate": 8.333333333333334e-10, "payment": 83333.33375034723, "total": 100000000.50041667, "interest": 0.5004166674999995 }
  },
  {
    "name": "Small-rate branch just below its switch",
    "inputs": { "principal": 100000000, "annual": 0.000099999, "months": 1200 },
    "expect": { "rate": 0.00000833325, "payment": 83337.50349996384, "total": 100005004.19995661, "interest": 5004.19995660532 }
  }
];
