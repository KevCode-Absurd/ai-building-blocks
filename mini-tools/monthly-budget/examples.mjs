// Fixed reference fixtures calculated independently of the production formula engine.
// Each example supplies every input, with zero, boundary and simple cross-check cases.
export default [
  {
    "name": "Illustrative figures with the default inputs",
    "inputs": {
      "income": 4000,
      "fixed": 1800,
      "variable": 1000,
      "saving": 600
    },
    "expect": {
      "allocated": 3400,
      "balance": 600,
      "savingShare": 15
    }
  },
  {
    "name": "Alternative plan",
    "inputs": {
      "income": 0,
      "fixed": 1800,
      "variable": 1000,
      "saving": 600
    },
    "expect": {
      "allocated": 3400,
      "balance": -3400,
      "savingShare": null
    }
  },
  {
    "name": "Zero or limiting case",
    "inputs": {
      "income": 4000,
      "fixed": 0,
      "variable": 0,
      "saving": 0
    },
    "expect": {
      "allocated": 0,
      "balance": 4000,
      "savingShare": 0
    }
  },
  {
    "name": "Boundary case",
    "inputs": {
      "income": 2000,
      "fixed": 1500,
      "variable": 1000,
      "saving": 0
    },
    "expect": {
      "allocated": 2500,
      "balance": -500,
      "savingShare": 0
    }
  },
  {
    "name": "Simple cross-check",
    "inputs": {
      "income": 1000,
      "fixed": 500,
      "variable": 250,
      "saving": 250
    },
    "expect": {
      "allocated": 1000,
      "balance": 0,
      "savingShare": 25
    }
  }
];
