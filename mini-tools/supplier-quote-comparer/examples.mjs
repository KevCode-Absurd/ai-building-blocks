// Fixed reference fixtures calculated independently of the production formula engine.
// Each example supplies every input, with zero, boundary and simple cross-check cases.
export default [
  {
    "name": "Illustrative figures with the default inputs",
    "inputs": {
      "quantity": 500,
      "unitA": 8,
      "fixedA": 200,
      "unitB": 7.5,
      "fixedB": 600
    },
    "expect": {
      "totalA": 4200,
      "totalB": 4350,
      "difference": 150,
      "perUnit": 0.3
    }
  },
  {
    "name": "Alternative plan",
    "inputs": {
      "quantity": 1,
      "unitA": 8,
      "fixedA": 200,
      "unitB": 7.5,
      "fixedB": 600
    },
    "expect": {
      "totalA": 208,
      "totalB": 607.5,
      "difference": 399.5,
      "perUnit": 399.5
    }
  },
  {
    "name": "Zero or limiting case",
    "inputs": {
      "quantity": 500,
      "unitA": 8,
      "fixedA": 0,
      "unitB": 7.5,
      "fixedB": 0
    },
    "expect": {
      "totalA": 4000,
      "totalB": 3750,
      "difference": -250,
      "perUnit": -0.5
    }
  },
  {
    "name": "Boundary case",
    "inputs": {
      "quantity": 500,
      "unitA": 10,
      "fixedA": 100,
      "unitB": 10,
      "fixedB": 100
    },
    "expect": {
      "totalA": 5100,
      "totalB": 5100,
      "difference": 0,
      "perUnit": 0
    }
  },
  {
    "name": "Simple cross-check",
    "inputs": {
      "quantity": 1000,
      "unitA": 8,
      "fixedA": 200,
      "unitB": 7.5,
      "fixedB": 600
    },
    "expect": {
      "totalA": 8200,
      "totalB": 8100,
      "difference": -100,
      "perUnit": -0.1
    }
  }
];
