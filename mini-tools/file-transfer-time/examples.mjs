// Fixed reference fixtures calculated independently of the production formula engine.
// Each example supplies every input, with zero, boundary and simple cross-check cases.
export default [
  {
    "name": "Illustrative figures with the default inputs",
    "inputs": {
      "size": 50,
      "speed": 100,
      "efficiency": 80
    },
    "expect": {
      "effective": 80,
      "minutes": 83.33333333333333,
      "hours": 1.3888888888888888
    }
  },
  {
    "name": "Alternative plan",
    "inputs": {
      "size": 0,
      "speed": 100,
      "efficiency": 80
    },
    "expect": {
      "effective": 80,
      "minutes": 0,
      "hours": 0
    }
  },
  {
    "name": "Zero or limiting case",
    "inputs": {
      "size": 50,
      "speed": 100,
      "efficiency": 100
    },
    "expect": {
      "effective": 100,
      "minutes": 66.66666666666667,
      "hours": 1.1111111111111112
    }
  },
  {
    "name": "Boundary case",
    "inputs": {
      "size": 1,
      "speed": 8,
      "efficiency": 100
    },
    "expect": {
      "effective": 8,
      "minutes": 16.666666666666668,
      "hours": 0.2777777777777778
    }
  },
  {
    "name": "Simple cross-check",
    "inputs": {
      "size": 100,
      "speed": 1000,
      "efficiency": 50
    },
    "expect": {
      "effective": 500,
      "minutes": 26.666666666666668,
      "hours": 0.4444444444444445
    }
  }
];
