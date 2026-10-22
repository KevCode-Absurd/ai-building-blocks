// Fixed reference fixtures calculated independently of the production formula engine.
// Each example supplies every input, with zero, boundary and simple cross-check cases.
export default [
  {
    "name": "Illustrative figures with the default inputs",
    "inputs": {
      "page": 1200,
      "margin": 48,
      "columns": 12,
      "gap": 24
    },
    "expect": {
      "usable": 1104,
      "gaps": 264,
      "column": 70
    }
  },
  {
    "name": "Alternative plan",
    "inputs": {
      "page": 1200,
      "margin": 48,
      "columns": 1,
      "gap": 24
    },
    "expect": {
      "usable": 1104,
      "gaps": 0,
      "column": 1104
    }
  },
  {
    "name": "Zero or limiting case",
    "inputs": {
      "page": 100,
      "margin": 60,
      "columns": 12,
      "gap": 24
    },
    "expect": {
      "usable": 0,
      "gaps": 264,
      "column": null
    }
  },
  {
    "name": "Boundary case",
    "inputs": {
      "page": 100,
      "margin": 0,
      "columns": 2,
      "gap": 100
    },
    "expect": {
      "usable": 100,
      "gaps": 100,
      "column": null
    }
  },
  {
    "name": "Simple cross-check",
    "inputs": {
      "page": 1000,
      "margin": 0,
      "columns": 4,
      "gap": 0
    },
    "expect": {
      "usable": 1000,
      "gaps": 0,
      "column": 250
    }
  }
];
