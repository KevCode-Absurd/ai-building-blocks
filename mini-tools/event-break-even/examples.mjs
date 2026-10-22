// Fixed reference fixtures calculated independently of the production formula engine.
// Each example supplies every input, with zero, boundary and simple cross-check cases.
export default [
  {
    "name": "Illustrative figures with the default inputs",
    "inputs": {
      "fixed": 3000,
      "price": 50,
      "fees": 5,
      "variable": 15,
      "attendees": 100
    },
    "expect": {
      "contribution": 32.5,
      "breakEven": 93,
      "profit": 250
    }
  },
  {
    "name": "Alternative plan",
    "inputs": {
      "fixed": 3000,
      "price": 50,
      "fees": 5,
      "variable": 15,
      "attendees": 0
    },
    "expect": {
      "contribution": 32.5,
      "breakEven": 93,
      "profit": -3000
    }
  },
  {
    "name": "Zero or limiting case",
    "inputs": {
      "fixed": 3000,
      "price": 10,
      "fees": 5,
      "variable": 15,
      "attendees": 100
    },
    "expect": {
      "contribution": -5.5,
      "breakEven": null,
      "profit": -3550
    }
  },
  {
    "name": "Boundary case",
    "inputs": {
      "fixed": 0,
      "price": 0,
      "fees": 0,
      "variable": 0,
      "attendees": 100
    },
    "expect": {
      "contribution": 0,
      "breakEven": 0,
      "profit": 0
    }
  },
  {
    "name": "Simple cross-check",
    "inputs": {
      "fixed": 1000,
      "price": 25,
      "fees": 0,
      "variable": 5,
      "attendees": 50
    },
    "expect": {
      "contribution": 20,
      "breakEven": 50,
      "profit": 0
    }
  }
];
