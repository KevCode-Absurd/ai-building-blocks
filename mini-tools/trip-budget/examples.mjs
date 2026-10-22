// Fixed reference fixtures calculated independently of the production formula engine.
// Each example supplies every input, with zero, boundary and simple cross-check cases.
export default [
  {
    "name": "Illustrative figures with the default inputs",
    "inputs": {
      "people": 2,
      "days": 5,
      "nights": 4,
      "room": 120,
      "daily": 50,
      "transport": 400,
      "buffer": 10
    },
    "expect": {
      "base": 1380,
      "total": 1518.0000000000002,
      "each": 759.0000000000001
    }
  },
  {
    "name": "Alternative plan",
    "inputs": {
      "people": 1,
      "days": 5,
      "nights": 4,
      "room": 120,
      "daily": 50,
      "transport": 400,
      "buffer": 10
    },
    "expect": {
      "base": 1130,
      "total": 1243,
      "each": 1243
    }
  },
  {
    "name": "Zero or limiting case",
    "inputs": {
      "people": 2,
      "days": 0,
      "nights": 0,
      "room": 120,
      "daily": 50,
      "transport": 0,
      "buffer": 10
    },
    "expect": {
      "base": 0,
      "total": 0,
      "each": 0
    }
  },
  {
    "name": "Boundary case",
    "inputs": {
      "people": 2,
      "days": 5,
      "nights": 4,
      "room": 120,
      "daily": 50,
      "transport": 400,
      "buffer": 0
    },
    "expect": {
      "base": 1380,
      "total": 1380,
      "each": 690
    }
  },
  {
    "name": "Simple cross-check",
    "inputs": {
      "people": 4,
      "days": 2,
      "nights": 1,
      "room": 200,
      "daily": 25,
      "transport": 0,
      "buffer": 0
    },
    "expect": {
      "base": 400,
      "total": 400,
      "each": 100
    }
  }
];
