// Fixed reference fixtures calculated independently of the production formula engine.
// Each example supplies every input, with zero, boundary and simple cross-check cases.
export default [
  {
    "name": "Illustrative figures with the default inputs",
    "inputs": {
      "candidates": 20,
      "minutes": 60,
      "panel": 2,
      "available": 32
    },
    "expect": {
      "needed": 40,
      "gap": 8,
      "capacity": 16
    }
  },
  {
    "name": "Alternative plan",
    "inputs": {
      "candidates": 0,
      "minutes": 60,
      "panel": 2,
      "available": 32
    },
    "expect": {
      "needed": 0,
      "gap": 0,
      "capacity": 16
    }
  },
  {
    "name": "Zero or limiting case",
    "inputs": {
      "candidates": 20,
      "minutes": 60,
      "panel": 2,
      "available": 0
    },
    "expect": {
      "needed": 40,
      "gap": 40,
      "capacity": 0
    }
  },
  {
    "name": "Boundary case",
    "inputs": {
      "candidates": 20,
      "minutes": 0,
      "panel": 2,
      "available": 32
    },
    "expect": {
      "needed": 0,
      "gap": 0,
      "capacity": null
    }
  },
  {
    "name": "Simple cross-check",
    "inputs": {
      "candidates": 10,
      "minutes": 30,
      "panel": 1,
      "available": 5
    },
    "expect": {
      "needed": 5,
      "gap": 0,
      "capacity": 10
    }
  }
];
