// Fixed reference fixtures calculated independently of the production formula engine.
// Each example supplies every input, with zero, boundary and simple cross-check cases.
export default [
  {
    "name": "Illustrative figures with the default inputs",
    "inputs": {
      "documents": 120,
      "minutes": 15,
      "rework": 20,
      "second": 10,
      "available": 30
    },
    "expect": {
      "extra": 24,
      "needed": 34,
      "gap": 4
    }
  },
  {
    "name": "Alternative plan",
    "inputs": {
      "documents": 0,
      "minutes": 15,
      "rework": 20,
      "second": 10,
      "available": 30
    },
    "expect": {
      "extra": 0,
      "needed": 0,
      "gap": 0
    }
  },
  {
    "name": "Zero or limiting case",
    "inputs": {
      "documents": 120,
      "minutes": 15,
      "rework": 0,
      "second": 10,
      "available": 30
    },
    "expect": {
      "extra": 0,
      "needed": 30,
      "gap": 0
    }
  },
  {
    "name": "Boundary case",
    "inputs": {
      "documents": 120,
      "minutes": 15,
      "rework": 100,
      "second": 10,
      "available": 0
    },
    "expect": {
      "extra": 120,
      "needed": 50,
      "gap": 50
    }
  },
  {
    "name": "Simple cross-check",
    "inputs": {
      "documents": 10,
      "minutes": 6,
      "rework": 50,
      "second": 12,
      "available": 1
    },
    "expect": {
      "extra": 5,
      "needed": 2,
      "gap": 1
    }
  }
];
