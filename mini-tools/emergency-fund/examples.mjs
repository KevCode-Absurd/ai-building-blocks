// Fixed reference fixtures calculated independently of the production formula engine.
// Each example supplies every input, with zero, boundary and simple cross-check cases.
export default [
  {
    "name": "Illustrative figures with the default inputs",
    "inputs": {
      "essential": 2000,
      "months": 4,
      "saved": 3000,
      "monthly": 500
    },
    "expect": {
      "target": 8000,
      "gap": 5000,
      "time": 10
    }
  },
  {
    "name": "Alternative plan",
    "inputs": {
      "essential": 2000,
      "months": 4,
      "saved": 10000,
      "monthly": 500
    },
    "expect": {
      "target": 8000,
      "gap": 0,
      "time": 0
    }
  },
  {
    "name": "Zero or limiting case",
    "inputs": {
      "essential": 2000,
      "months": 4,
      "saved": 3000,
      "monthly": 0
    },
    "expect": {
      "target": 8000,
      "gap": 5000,
      "time": null
    }
  },
  {
    "name": "Boundary case",
    "inputs": {
      "essential": 0,
      "months": 4,
      "saved": 3000,
      "monthly": 500
    },
    "expect": {
      "target": 0,
      "gap": 0,
      "time": 0
    }
  },
  {
    "name": "Simple cross-check",
    "inputs": {
      "essential": 1000,
      "months": 3,
      "saved": 0,
      "monthly": 1000
    },
    "expect": {
      "target": 3000,
      "gap": 3000,
      "time": 3
    }
  }
];
