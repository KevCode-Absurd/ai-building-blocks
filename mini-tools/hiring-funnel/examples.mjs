// Fixed reference fixtures calculated independently of the production formula engine.
// Each example supplies every input, with zero, boundary and simple cross-check cases.
export default [
  {
    "name": "Illustrative figures with the default inputs",
    "inputs": {
      "hires": 3,
      "accept": 75,
      "offer": 25,
      "interview": 20
    },
    "expect": {
      "offers": 4,
      "interviews": 16,
      "applicants": 80
    }
  },
  {
    "name": "Alternative plan",
    "inputs": {
      "hires": 0,
      "accept": 0,
      "offer": 0,
      "interview": 0
    },
    "expect": {
      "offers": 0,
      "interviews": 0,
      "applicants": 0
    }
  },
  {
    "name": "Zero or limiting case",
    "inputs": {
      "hires": 3,
      "accept": 0,
      "offer": 25,
      "interview": 20
    },
    "expect": {
      "offers": null,
      "interviews": null,
      "applicants": null
    }
  },
  {
    "name": "Boundary case",
    "inputs": {
      "hires": 1,
      "accept": 100,
      "offer": 100,
      "interview": 100
    },
    "expect": {
      "offers": 1,
      "interviews": 1,
      "applicants": 1
    }
  },
  {
    "name": "Simple cross-check",
    "inputs": {
      "hires": 2,
      "accept": 50,
      "offer": 50,
      "interview": 50
    },
    "expect": {
      "offers": 4,
      "interviews": 8,
      "applicants": 16
    }
  }
];
