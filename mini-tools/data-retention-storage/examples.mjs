// Fixed reference fixtures calculated independently of the production formula engine.
// Each example supplies every input, with zero, boundary and simple cross-check cases.
export default [
  {
    "name": "Illustrative figures with the default inputs",
    "inputs": {
      "records": 10000,
      "size": 20,
      "days": 365,
      "copies": 3,
      "price": 0.02
    },
    "expect": {
      "one": 73,
      "total": 219,
      "monthly": 4.38
    }
  },
  {
    "name": "Alternative plan",
    "inputs": {
      "records": 0,
      "size": 20,
      "days": 365,
      "copies": 3,
      "price": 0.02
    },
    "expect": {
      "one": 0,
      "total": 0,
      "monthly": 0
    }
  },
  {
    "name": "Zero or limiting case",
    "inputs": {
      "records": 10000,
      "size": 20,
      "days": 0,
      "copies": 3,
      "price": 0.02
    },
    "expect": {
      "one": 0,
      "total": 0,
      "monthly": 0
    }
  },
  {
    "name": "Boundary case",
    "inputs": {
      "records": 10000,
      "size": 20,
      "days": 365,
      "copies": 1,
      "price": 0.02
    },
    "expect": {
      "one": 73,
      "total": 73,
      "monthly": 1.46
    }
  },
  {
    "name": "Simple cross-check",
    "inputs": {
      "records": 1000,
      "size": 100,
      "days": 10,
      "copies": 2,
      "price": 1
    },
    "expect": {
      "one": 1,
      "total": 2,
      "monthly": 2
    }
  }
];
