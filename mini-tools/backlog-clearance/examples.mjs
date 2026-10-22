// Fixed reference fixtures calculated independently of the production formula engine.
// Each example supplies every input, with zero, boundary and simple cross-check cases.
export default [
  {
    "name": "Illustrative figures with the default inputs",
    "inputs": {
      "backlog": 300,
      "incoming": 40,
      "done": 60
    },
    "expect": {
      "net": 20,
      "days": 15,
      "growth": 0
    }
  },
  {
    "name": "Alternative plan",
    "inputs": {
      "backlog": 300,
      "incoming": 40,
      "done": 40
    },
    "expect": {
      "net": 0,
      "days": null,
      "growth": 0
    }
  },
  {
    "name": "Zero or limiting case",
    "inputs": {
      "backlog": 300,
      "incoming": 40,
      "done": 20
    },
    "expect": {
      "net": -20,
      "days": null,
      "growth": 20
    }
  },
  {
    "name": "Boundary case",
    "inputs": {
      "backlog": 0,
      "incoming": 40,
      "done": 20
    },
    "expect": {
      "net": -20,
      "days": null,
      "growth": 20
    }
  },
  {
    "name": "Simple cross-check",
    "inputs": {
      "backlog": 100,
      "incoming": 0,
      "done": 25
    },
    "expect": {
      "net": 25,
      "days": 4,
      "growth": 0
    }
  }
];
