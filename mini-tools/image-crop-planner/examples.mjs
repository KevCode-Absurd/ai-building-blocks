// Fixed reference fixtures calculated independently of the production formula engine.
// Each example supplies every input, with zero, boundary and simple cross-check cases.
export default [
  {
    "name": "Illustrative figures with the default inputs",
    "inputs": {
      "width": 4000,
      "height": 3000,
      "ratioW": 16,
      "ratioH": 9
    },
    "expect": {
      "cropW": 4000,
      "cropH": 2250,
      "removed": 25
    }
  },
  {
    "name": "Alternative plan",
    "inputs": {
      "width": 4000,
      "height": 3000,
      "ratioW": 1,
      "ratioH": 1
    },
    "expect": {
      "cropW": 3000,
      "cropH": 3000,
      "removed": 25
    }
  },
  {
    "name": "Zero or limiting case",
    "inputs": {
      "width": 1000,
      "height": 1000,
      "ratioW": 1,
      "ratioH": 1
    },
    "expect": {
      "cropW": 1000,
      "cropH": 1000,
      "removed": 0
    }
  },
  {
    "name": "Boundary case",
    "inputs": {
      "width": 1000,
      "height": 2000,
      "ratioW": 2,
      "ratioH": 1
    },
    "expect": {
      "cropW": 1000,
      "cropH": 500,
      "removed": 75
    }
  },
  {
    "name": "Simple cross-check",
    "inputs": {
      "width": 1,
      "height": 1,
      "ratioW": 1,
      "ratioH": 1
    },
    "expect": {
      "cropW": 1,
      "cropH": 1,
      "removed": 0
    }
  }
];
