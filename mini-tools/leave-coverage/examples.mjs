// Fixed reference fixtures calculated independently of the production formula engine.
// Each example supplies every input, with zero, boundary and simple cross-check cases.
export default [
  {
    "name": "Illustrative figures with the default inputs",
    "inputs": {
      "team": 12,
      "away": 3,
      "minimum": 8
    },
    "expect": {
      "present": 9,
      "spare": 1,
      "shortage": 0
    }
  },
  {
    "name": "Alternative plan",
    "inputs": {
      "team": 12,
      "away": 0,
      "minimum": 8
    },
    "expect": {
      "present": 12,
      "spare": 4,
      "shortage": 0
    }
  },
  {
    "name": "Zero or limiting case",
    "inputs": {
      "team": 12,
      "away": 6,
      "minimum": 8
    },
    "expect": {
      "present": 6,
      "spare": 0,
      "shortage": 2
    }
  },
  {
    "name": "Boundary case",
    "inputs": {
      "team": 12,
      "away": 12,
      "minimum": 0
    },
    "expect": {
      "present": 0,
      "spare": 0,
      "shortage": 0
    }
  },
  {
    "name": "Simple cross-check",
    "inputs": {
      "team": 5,
      "away": 6,
      "minimum": 8
    },
    "expect": {
      "present": null,
      "spare": null,
      "shortage": null
    }
  }
];
