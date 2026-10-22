// Fixed reference fixtures calculated independently of the production formula engine.
// Each example supplies every input, with zero, boundary and simple cross-check cases.
export default [
  {
    "name": "Illustrative figures with the default inputs",
    "inputs": {
      "days": 5,
      "hours": 8,
      "meetings": 12,
      "admin": 1,
      "block": 90
    },
    "expect": {
      "available": 23,
      "blocks": 15,
      "overbooked": 0
    }
  },
  {
    "name": "Alternative plan",
    "inputs": {
      "days": 0,
      "hours": 8,
      "meetings": 0,
      "admin": 1,
      "block": 90
    },
    "expect": {
      "available": 0,
      "blocks": 0,
      "overbooked": 0
    }
  },
  {
    "name": "Zero or limiting case",
    "inputs": {
      "days": 5,
      "hours": 8,
      "meetings": 50,
      "admin": 1,
      "block": 90
    },
    "expect": {
      "available": 0,
      "blocks": 0,
      "overbooked": 15
    }
  },
  {
    "name": "Boundary case",
    "inputs": {
      "days": 5,
      "hours": 8,
      "meetings": 12,
      "admin": 1,
      "block": 30
    },
    "expect": {
      "available": 23,
      "blocks": 46,
      "overbooked": 0
    }
  },
  {
    "name": "Simple cross-check",
    "inputs": {
      "days": 1,
      "hours": 8,
      "meetings": 1,
      "admin": 1,
      "block": 60
    },
    "expect": {
      "available": 6,
      "blocks": 6,
      "overbooked": 0
    }
  }
];
