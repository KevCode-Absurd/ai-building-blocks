// Fixed reference fixtures calculated independently of the production formula engine.
// Each example supplies every input, with zero, boundary and simple cross-check cases.
export default [
  {
    "name": "Illustrative figures with the default inputs",
    "inputs": {
      "days": 20,
      "minutes": 80,
      "cost": 12,
      "reduce": 4
    },
    "expect": {
      "hours": 26.666666666666668,
      "cash": 240,
      "hoursBack": 5.333333333333333,
      "cashBack": 48
    }
  },
  {
    "name": "Alternative plan",
    "inputs": {
      "days": 0,
      "minutes": 80,
      "cost": 12,
      "reduce": 4
    },
    "expect": {
      "hours": 0,
      "cash": 0,
      "hoursBack": 0,
      "cashBack": 0
    }
  },
  {
    "name": "Zero or limiting case",
    "inputs": {
      "days": 20,
      "minutes": 80,
      "cost": 12,
      "reduce": 0
    },
    "expect": {
      "hours": 26.666666666666668,
      "cash": 240,
      "hoursBack": 0,
      "cashBack": 0
    }
  },
  {
    "name": "Boundary case",
    "inputs": {
      "days": 20,
      "minutes": 80,
      "cost": 12,
      "reduce": 31
    },
    "expect": {
      "hours": 26.666666666666668,
      "cash": 240,
      "hoursBack": 26.666666666666668,
      "cashBack": 240
    }
  },
  {
    "name": "Simple cross-check",
    "inputs": {
      "days": 10,
      "minutes": 60,
      "cost": 10,
      "reduce": 5
    },
    "expect": {
      "hours": 10,
      "cash": 100,
      "hoursBack": 5,
      "cashBack": 50
    }
  }
];
