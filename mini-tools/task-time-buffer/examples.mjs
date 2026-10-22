// Fixed reference fixtures calculated independently of the production formula engine.
// Each example supplies every input, with zero, boundary and simple cross-check cases.
export default [
  {
    "name": "Illustrative figures with the default inputs",
    "inputs": {
      "minutes": 45,
      "tasks": 12,
      "buffer": 25
    },
    "expect": {
      "base": 9,
      "extra": 2.25,
      "total": 11.25
    }
  },
  {
    "name": "Alternative plan",
    "inputs": {
      "minutes": 45,
      "tasks": 0,
      "buffer": 25
    },
    "expect": {
      "base": 0,
      "extra": 0,
      "total": 0
    }
  },
  {
    "name": "Zero or limiting case",
    "inputs": {
      "minutes": 45,
      "tasks": 12,
      "buffer": 0
    },
    "expect": {
      "base": 9,
      "extra": 0,
      "total": 9
    }
  },
  {
    "name": "Boundary case",
    "inputs": {
      "minutes": 45,
      "tasks": 12,
      "buffer": 100
    },
    "expect": {
      "base": 9,
      "extra": 9,
      "total": 18
    }
  },
  {
    "name": "Simple cross-check",
    "inputs": {
      "minutes": 30,
      "tasks": 4,
      "buffer": 50
    },
    "expect": {
      "base": 2,
      "extra": 1,
      "total": 3
    }
  }
];
