// Fixed reference fixtures calculated independently of the production formula engine.
// Each example supplies every input, with zero, boundary and simple cross-check cases.
export default [
  {
    "name": "Illustrative figures with the default inputs",
    "inputs": {
      "bill": 180,
      "charges": 20,
      "tip": 10,
      "people": 6
    },
    "expect": {
      "tipAmount": 18,
      "total": 218,
      "perPerson": 36.34,
      "extra": 0.040000000000020464
    }
  },
  {
    "name": "Alternative plan",
    "inputs": {
      "bill": 0,
      "charges": 0,
      "tip": 0,
      "people": 6
    },
    "expect": {
      "tipAmount": 0,
      "total": 0,
      "perPerson": 0,
      "extra": 0
    }
  },
  {
    "name": "Zero or limiting case",
    "inputs": {
      "bill": 180,
      "charges": 20,
      "tip": 10,
      "people": 1
    },
    "expect": {
      "tipAmount": 18,
      "total": 218,
      "perPerson": 218,
      "extra": 0
    }
  },
  {
    "name": "Boundary case",
    "inputs": {
      "bill": 100,
      "charges": 0,
      "tip": 0,
      "people": 3
    },
    "expect": {
      "tipAmount": 0,
      "total": 100,
      "perPerson": 33.34,
      "extra": 0.020000000000010232
    }
  },
  {
    "name": "Simple cross-check",
    "inputs": {
      "bill": 10,
      "charges": 1,
      "tip": 0,
      "people": 2
    },
    "expect": {
      "tipAmount": 0,
      "total": 11,
      "perPerson": 5.5,
      "extra": 0
    }
  }
];
