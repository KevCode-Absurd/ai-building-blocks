// Fixed reference fixtures calculated independently of the production formula engine.
// Each example supplies every input, with zero, boundary and simple cross-check cases.
export default [
  {
    "name": "Illustrative figures with the default inputs",
    "inputs": {
      "width": 3600,
      "height": 2400,
      "density": 300
    },
    "expect": {
      "widthIn": 12,
      "heightIn": 8,
      "widthCm": 30.48,
      "heightCm": 20.32
    }
  },
  {
    "name": "Alternative plan",
    "inputs": {
      "width": 3600,
      "height": 2400,
      "density": 150
    },
    "expect": {
      "widthIn": 24,
      "heightIn": 16,
      "widthCm": 60.96,
      "heightCm": 40.64
    }
  },
  {
    "name": "Zero or limiting case",
    "inputs": {
      "width": 1,
      "height": 1,
      "density": 1
    },
    "expect": {
      "widthIn": 1,
      "heightIn": 1,
      "widthCm": 2.54,
      "heightCm": 2.54
    }
  },
  {
    "name": "Boundary case",
    "inputs": {
      "width": 6000,
      "height": 4000,
      "density": 200
    },
    "expect": {
      "widthIn": 30,
      "heightIn": 20,
      "widthCm": 76.2,
      "heightCm": 50.8
    }
  },
  {
    "name": "Simple cross-check",
    "inputs": {
      "width": 1920,
      "height": 1080,
      "density": 300
    },
    "expect": {
      "widthIn": 6.4,
      "heightIn": 3.6,
      "widthCm": 16.256,
      "heightCm": 9.144
    }
  }
];
