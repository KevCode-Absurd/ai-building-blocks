// Fixed reference fixtures calculated independently of the production formula engine.
// Each example supplies every input, with zero, boundary and simple cross-check cases.
export default [
  {
    "name": "Illustrative figures with the default inputs",
    "inputs": {
      "video": 20,
      "audio": 192,
      "minutes": 10,
      "files": 12
    },
    "expect": {
      "combined": 20.192,
      "perFile": 1.5144000000000002,
      "total": 18.172800000000002
    }
  },
  {
    "name": "Alternative plan",
    "inputs": {
      "video": 20,
      "audio": 192,
      "minutes": 10,
      "files": 0
    },
    "expect": {
      "combined": 20.192,
      "perFile": 1.5144000000000002,
      "total": 0
    }
  },
  {
    "name": "Zero or limiting case",
    "inputs": {
      "video": 0,
      "audio": 0,
      "minutes": 10,
      "files": 12
    },
    "expect": {
      "combined": 0,
      "perFile": 0,
      "total": 0
    }
  },
  {
    "name": "Boundary case",
    "inputs": {
      "video": 20,
      "audio": 192,
      "minutes": 0,
      "files": 12
    },
    "expect": {
      "combined": 20.192,
      "perFile": 0,
      "total": 0
    }
  },
  {
    "name": "Simple cross-check",
    "inputs": {
      "video": 8,
      "audio": 0,
      "minutes": 1,
      "files": 1
    },
    "expect": {
      "combined": 8,
      "perFile": 0.06,
      "total": 0.06
    }
  }
];
