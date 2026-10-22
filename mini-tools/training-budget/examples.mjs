// Fixed reference fixtures calculated independently of the production formula engine.
// Each example supplies every input, with zero, boundary and simple cross-check cases.
export default [
  {
    "name": "Illustrative figures with the default inputs",
    "inputs": {
      "learners": 10,
      "fee": 200,
      "hours": 8,
      "hourly": 30,
      "shared": 300
    },
    "expect": {
      "cash": 2300,
      "timeValue": 2400,
      "total": 4700
    }
  },
  {
    "name": "Alternative plan",
    "inputs": {
      "learners": 0,
      "fee": 200,
      "hours": 8,
      "hourly": 30,
      "shared": 0
    },
    "expect": {
      "cash": 0,
      "timeValue": 0,
      "total": 0
    }
  },
  {
    "name": "Zero or limiting case",
    "inputs": {
      "learners": 10,
      "fee": 0,
      "hours": 8,
      "hourly": 30,
      "shared": 300
    },
    "expect": {
      "cash": 300,
      "timeValue": 2400,
      "total": 2700
    }
  },
  {
    "name": "Boundary case",
    "inputs": {
      "learners": 10,
      "fee": 200,
      "hours": 0,
      "hourly": 30,
      "shared": 300
    },
    "expect": {
      "cash": 2300,
      "timeValue": 0,
      "total": 2300
    }
  },
  {
    "name": "Simple cross-check",
    "inputs": {
      "learners": 1,
      "fee": 100,
      "hours": 2,
      "hourly": 25,
      "shared": 0
    },
    "expect": {
      "cash": 100,
      "timeValue": 50,
      "total": 150
    }
  }
];
