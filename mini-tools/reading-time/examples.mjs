// Fixed reference fixtures calculated independently of the production formula engine.
// Each example supplies every input, with zero, boundary and simple cross-check cases.
export default [
  {
    "name": "Illustrative figures with the default inputs",
    "inputs": {
      "words": 1200,
      "pace": 200,
      "pause": 2
    },
    "expect": {
      "textMinutes": 6,
      "totalMinutes": 8,
      "hourTotal": 0.13333333333333333
    }
  },
  {
    "name": "Alternative plan",
    "inputs": {
      "words": 0,
      "pace": 200,
      "pause": 0
    },
    "expect": {
      "textMinutes": 0,
      "totalMinutes": 0,
      "hourTotal": 0
    }
  },
  {
    "name": "Zero or limiting case",
    "inputs": {
      "words": 1200,
      "pace": 100,
      "pause": 2
    },
    "expect": {
      "textMinutes": 12,
      "totalMinutes": 14,
      "hourTotal": 0.23333333333333334
    }
  },
  {
    "name": "Boundary case",
    "inputs": {
      "words": 100,
      "pace": 100,
      "pause": 0
    },
    "expect": {
      "textMinutes": 1,
      "totalMinutes": 1,
      "hourTotal": 0.016666666666666666
    }
  },
  {
    "name": "Simple cross-check",
    "inputs": {
      "words": 6000,
      "pace": 120,
      "pause": 10
    },
    "expect": {
      "textMinutes": 50,
      "totalMinutes": 60,
      "hourTotal": 1
    }
  }
];
