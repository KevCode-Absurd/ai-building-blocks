// Fixed reference fixtures calculated independently of the production formula engine.
// Each example supplies every input, with zero, boundary and simple cross-check cases.
export default [
  {
    "name": "Illustrative figures with the default inputs",
    "inputs": {
      "people": 4,
      "weekly": 40,
      "weeks": 6,
      "share": 60,
      "estimate": 500,
      "buffer": 20
    },
    "expect": {
      "capacity": 576,
      "required": 600,
      "gap": 24,
      "spare": 0
    }
  },
  {
    "name": "Alternative plan",
    "inputs": {
      "people": 0,
      "weekly": 40,
      "weeks": 6,
      "share": 60,
      "estimate": 500,
      "buffer": 20
    },
    "expect": {
      "capacity": 0,
      "required": 600,
      "gap": 600,
      "spare": 0
    }
  },
  {
    "name": "Zero or limiting case",
    "inputs": {
      "people": 4,
      "weekly": 40,
      "weeks": 6,
      "share": 60,
      "estimate": 0,
      "buffer": 20
    },
    "expect": {
      "capacity": 576,
      "required": 0,
      "gap": 0,
      "spare": 576
    }
  },
  {
    "name": "Boundary case",
    "inputs": {
      "people": 4,
      "weekly": 40,
      "weeks": 6,
      "share": 0,
      "estimate": 500,
      "buffer": 20
    },
    "expect": {
      "capacity": 0,
      "required": 600,
      "gap": 600,
      "spare": 0
    }
  },
  {
    "name": "Simple cross-check",
    "inputs": {
      "people": 2,
      "weekly": 20,
      "weeks": 5,
      "share": 50,
      "estimate": 100,
      "buffer": 0
    },
    "expect": {
      "capacity": 100,
      "required": 100,
      "gap": 0,
      "spare": 0
    }
  }
];
