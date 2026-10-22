// Fixed reference fixtures calculated independently of the production formula engine.
// Each example supplies every input, with zero, boundary and simple cross-check cases.
export default [
  {
    "name": "Illustrative figures with the default inputs",
    "inputs": {
      "target": 1000,
      "rate": 3,
      "fixed": 0.3
    },
    "expect": {
      "charge": 1031.24,
      "fee": 31.237200000000005,
      "net": 1000.0028
    }
  },
  {
    "name": "Alternative plan",
    "inputs": {
      "target": 1000,
      "rate": 0,
      "fixed": 0
    },
    "expect": {
      "charge": 1000,
      "fee": 0,
      "net": 1000
    }
  },
  {
    "name": "Zero or limiting case",
    "inputs": {
      "target": 0,
      "rate": 3,
      "fixed": 0.3
    },
    "expect": {
      "charge": 0.31,
      "fee": 0.30929999999999996,
      "net": 0.0007000000000000339
    }
  },
  {
    "name": "Boundary case",
    "inputs": {
      "target": 100,
      "rate": 0,
      "fixed": 1
    },
    "expect": {
      "charge": 101,
      "fee": 1,
      "net": 100
    }
  },
  {
    "name": "Simple cross-check",
    "inputs": {
      "target": 100,
      "rate": 20,
      "fixed": 0
    },
    "expect": {
      "charge": 125,
      "fee": 25,
      "net": 100
    }
  }
];
