// Fixed reference fixtures calculated independently of the production formula engine.
// Each example supplies every input, with zero, boundary and simple cross-check cases.
export default [
  {
    "name": "Illustrative figures with the default inputs",
    "inputs": {
      "monthly": 20,
      "annual": 180,
      "months": 8
    },
    "expect": {
      "payMonthly": 160,
      "saving": -20,
      "breakEven": 9
    }
  },
  {
    "name": "Alternative plan",
    "inputs": {
      "monthly": 20,
      "annual": 180,
      "months": 12
    },
    "expect": {
      "payMonthly": 240,
      "saving": 60,
      "breakEven": 9
    }
  },
  {
    "name": "Zero or limiting case",
    "inputs": {
      "monthly": 0,
      "annual": 180,
      "months": 8
    },
    "expect": {
      "payMonthly": 0,
      "saving": -180,
      "breakEven": null
    }
  },
  {
    "name": "Boundary case",
    "inputs": {
      "monthly": 20,
      "annual": 180,
      "months": 0
    },
    "expect": {
      "payMonthly": 0,
      "saving": -180,
      "breakEven": 9
    }
  },
  {
    "name": "Simple cross-check",
    "inputs": {
      "monthly": 10,
      "annual": 120,
      "months": 12
    },
    "expect": {
      "payMonthly": 120,
      "saving": 0,
      "breakEven": 12
    }
  }
];
