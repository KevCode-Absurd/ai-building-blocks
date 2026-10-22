// Fixed reference fixtures calculated independently of the production formula engine.
// Each example supplies every input, with zero, boundary and simple cross-check cases.
export default [
  {
    "name": "Illustrative figures with the default inputs",
    "inputs": {
      "target": 6000,
      "saved": 1200,
      "months": 12,
      "budget": 300
    },
    "expect": {
      "gap": 4800,
      "required": 400,
      "projected": 4800,
      "shortfall": 1200
    }
  },
  {
    "name": "Alternative plan",
    "inputs": {
      "target": 6000,
      "saved": 1200,
      "months": 0,
      "budget": 300
    },
    "expect": {
      "gap": 4800,
      "required": null,
      "projected": 1200,
      "shortfall": 4800
    }
  },
  {
    "name": "Zero or limiting case",
    "inputs": {
      "target": 6000,
      "saved": 7000,
      "months": 0,
      "budget": 300
    },
    "expect": {
      "gap": 0,
      "required": 0,
      "projected": 7000,
      "shortfall": 0
    }
  },
  {
    "name": "Boundary case",
    "inputs": {
      "target": 6000,
      "saved": 1200,
      "months": 12,
      "budget": 400
    },
    "expect": {
      "gap": 4800,
      "required": 400,
      "projected": 6000,
      "shortfall": 0
    }
  },
  {
    "name": "Simple cross-check",
    "inputs": {
      "target": 1000,
      "saved": 0,
      "months": 4,
      "budget": 250
    },
    "expect": {
      "gap": 1000,
      "required": 250,
      "projected": 1000,
      "shortfall": 0
    }
  }
];
