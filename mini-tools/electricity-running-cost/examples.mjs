// Fixed reference fixtures calculated independently of the production formula engine.
// Each example supplies every input, with zero, boundary and simple cross-check cases.
export default [
  {
    "name": "Illustrative figures with the default inputs",
    "inputs": {
      "watts": 1000,
      "hours": 2,
      "days": 30,
      "price": 0.2
    },
    "expect": {
      "daily": 2,
      "energy": 60,
      "cost": 12
    }
  },
  {
    "name": "Alternative plan",
    "inputs": {
      "watts": 0,
      "hours": 2,
      "days": 30,
      "price": 0.2
    },
    "expect": {
      "daily": 0,
      "energy": 0,
      "cost": 0
    }
  },
  {
    "name": "Zero or limiting case",
    "inputs": {
      "watts": 1000,
      "hours": 0,
      "days": 30,
      "price": 0.2
    },
    "expect": {
      "daily": 0,
      "energy": 0,
      "cost": 0
    }
  },
  {
    "name": "Boundary case",
    "inputs": {
      "watts": 1000,
      "hours": 2,
      "days": 0,
      "price": 0.2
    },
    "expect": {
      "daily": 2,
      "energy": 0,
      "cost": 0
    }
  },
  {
    "name": "Simple cross-check",
    "inputs": {
      "watts": 500,
      "hours": 4,
      "days": 10,
      "price": 0.25
    },
    "expect": {
      "daily": 2,
      "energy": 20,
      "cost": 5
    }
  }
];
