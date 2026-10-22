// Fixed reference fixtures calculated independently of the production formula engine.
// Each example supplies every input, with zero, boundary and simple cross-check cases.
export default [
  {
    "name": "Illustrative figures with the default inputs",
    "inputs": {
      "hiring": 3000,
      "cover": 2000,
      "onboard": 40,
      "hourly": 40,
      "ramp": 1500
    },
    "expect": {
      "support": 1600,
      "cash": 5000,
      "total": 8100
    }
  },
  {
    "name": "Alternative plan",
    "inputs": {
      "hiring": 0,
      "cover": 0,
      "onboard": 0,
      "hourly": 40,
      "ramp": 0
    },
    "expect": {
      "support": 0,
      "cash": 0,
      "total": 0
    }
  },
  {
    "name": "Zero or limiting case",
    "inputs": {
      "hiring": 3000,
      "cover": 2000,
      "onboard": 40,
      "hourly": 40,
      "ramp": 0
    },
    "expect": {
      "support": 1600,
      "cash": 5000,
      "total": 6600
    }
  },
  {
    "name": "Boundary case",
    "inputs": {
      "hiring": 3000,
      "cover": 2000,
      "onboard": 0,
      "hourly": 40,
      "ramp": 1500
    },
    "expect": {
      "support": 0,
      "cash": 5000,
      "total": 6500
    }
  },
  {
    "name": "Simple cross-check",
    "inputs": {
      "hiring": 500,
      "cover": 0,
      "onboard": 10,
      "hourly": 25,
      "ramp": 250
    },
    "expect": {
      "support": 250,
      "cash": 500,
      "total": 1000
    }
  }
];
