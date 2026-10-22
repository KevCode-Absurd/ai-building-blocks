// Fixed reference fixtures calculated independently of the production formula engine.
// Each example supplies every input, with zero, boundary and simple cross-check cases.
export default [
  {
    "name": "Illustrative figures with the default inputs",
    "inputs": {
      "lessons": 24,
      "minutes": 30,
      "practice": 45,
      "weeks": 8,
      "available": 4
    },
    "expect": {
      "total": 30,
      "weekly": 3.75,
      "gap": 0
    }
  },
  {
    "name": "Alternative plan",
    "inputs": {
      "lessons": 0,
      "minutes": 30,
      "practice": 45,
      "weeks": 8,
      "available": 4
    },
    "expect": {
      "total": 0,
      "weekly": 0,
      "gap": 0
    }
  },
  {
    "name": "Zero or limiting case",
    "inputs": {
      "lessons": 24,
      "minutes": 30,
      "practice": 45,
      "weeks": 8,
      "available": 0
    },
    "expect": {
      "total": 30,
      "weekly": 3.75,
      "gap": 3.75
    }
  },
  {
    "name": "Boundary case",
    "inputs": {
      "lessons": 24,
      "minutes": 30,
      "practice": 45,
      "weeks": 1,
      "available": 4
    },
    "expect": {
      "total": 30,
      "weekly": 30,
      "gap": 26
    }
  },
  {
    "name": "Simple cross-check",
    "inputs": {
      "lessons": 4,
      "minutes": 30,
      "practice": 30,
      "weeks": 2,
      "available": 2
    },
    "expect": {
      "total": 4,
      "weekly": 2,
      "gap": 0
    }
  }
];
