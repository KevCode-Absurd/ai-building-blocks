// Fixed reference fixtures calculated independently of the production formula engine.
// Each example supplies every input, with zero, boundary and simple cross-check cases.
export default [
  {
    "name": "Illustrative figures with the default inputs",
    "inputs": {
      "tickets": 1000,
      "minutes": 12,
      "hours": 160,
      "productive": 70
    },
    "expect": {
      "work": 200,
      "perPerson": 112,
      "staff": 1.7857142857142858
    }
  },
  {
    "name": "Alternative plan",
    "inputs": {
      "tickets": 0,
      "minutes": 12,
      "hours": 160,
      "productive": 0
    },
    "expect": {
      "work": 0,
      "perPerson": 0,
      "staff": 0
    }
  },
  {
    "name": "Zero or limiting case",
    "inputs": {
      "tickets": 1000,
      "minutes": 12,
      "hours": 160,
      "productive": 0
    },
    "expect": {
      "work": 200,
      "perPerson": 0,
      "staff": null
    }
  },
  {
    "name": "Boundary case",
    "inputs": {
      "tickets": 1000,
      "minutes": 12,
      "hours": 160,
      "productive": 100
    },
    "expect": {
      "work": 200,
      "perPerson": 160,
      "staff": 1.25
    }
  },
  {
    "name": "Simple cross-check",
    "inputs": {
      "tickets": 100,
      "minutes": 6,
      "hours": 20,
      "productive": 50
    },
    "expect": {
      "work": 10,
      "perPerson": 10,
      "staff": 1
    }
  }
];
