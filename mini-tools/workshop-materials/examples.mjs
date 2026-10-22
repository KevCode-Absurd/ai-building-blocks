// Fixed reference fixtures calculated independently of the production formula engine.
// Each example supplies every input, with zero, boundary and simple cross-check cases.
export default [
  {
    "name": "Illustrative figures with the default inputs",
    "inputs": {
      "people": 35,
      "each": 2,
      "spare": 10,
      "pack": 25,
      "price": 8
    },
    "expect": {
      "needed": 77,
      "packs": 4,
      "leftover": 23,
      "cost": 32
    }
  },
  {
    "name": "Alternative plan",
    "inputs": {
      "people": 0,
      "each": 2,
      "spare": 10,
      "pack": 25,
      "price": 8
    },
    "expect": {
      "needed": 0,
      "packs": 0,
      "leftover": 0,
      "cost": 0
    }
  },
  {
    "name": "Zero or limiting case",
    "inputs": {
      "people": 35,
      "each": 0,
      "spare": 10,
      "pack": 25,
      "price": 8
    },
    "expect": {
      "needed": 0,
      "packs": 0,
      "leftover": 0,
      "cost": 0
    }
  },
  {
    "name": "Boundary case",
    "inputs": {
      "people": 35,
      "each": 2,
      "spare": 0,
      "pack": 25,
      "price": 8
    },
    "expect": {
      "needed": 70,
      "packs": 3,
      "leftover": 5,
      "cost": 24
    }
  },
  {
    "name": "Simple cross-check",
    "inputs": {
      "people": 10,
      "each": 1,
      "spare": 0,
      "pack": 5,
      "price": 3
    },
    "expect": {
      "needed": 10,
      "packs": 2,
      "leftover": 0,
      "cost": 6
    }
  }
];
