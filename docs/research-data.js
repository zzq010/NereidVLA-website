// Numerical results transcribed from the project homepage and arXiv:2611.24864v1, Tables 1–4.
const researchData = {
  "understanding": {
    "headers": [
      "Model",
      "TGA",
      "SRA",
      "TSA",
      "TPA",
      "TUA",
      "LADA"
    ],
    "models": [
      {
        "name": "Qwen3-VL-8B-Instruct",
        "values": [
          63.18,
          53.38,
          66.75,
          64.76,
          38.82,
          16.35
        ],
        "ours": false
      },
      {
        "name": "Sea2Know (8B)",
        "values": [
          67.66,
          75.21,
          78.3,
          77.83,
          67.79,
          31.61
        ],
        "ours": true
      }
    ]
  },
  "offline": {
    "headers": [
      "Model",
      "ADE",
      "FDE",
      "Z MAE",
      "ADE P95",
      "FDE P95"
    ],
    "models": [
      {
        "name": "InternVLA-N1",
        "values": [
          0.20008,
          0.39498,
          0.05735,
          0.67412,
          1.26874
        ],
        "ours": false
      },
      {
        "name": "Qwen3-VL-4B",
        "values": [
          0.23568,
          0.45514,
          0.0619,
          0.74359,
          1.37255
        ],
        "ours": false
      },
      {
        "name": "Qwen3-VL-2B",
        "values": [
          0.28983,
          0.53348,
          0.06178,
          0.91908,
          1.65784
        ],
        "ours": false
      },
      {
        "name": "Qwen3-VL-8B",
        "values": [
          0.29121,
          0.55396,
          0.06181,
          0.91134,
          1.66065
        ],
        "ours": false
      },
      {
        "name": "Qwen3-VL-32B",
        "values": [
          0.19766,
          0.38996,
          0.05219,
          0.64042,
          1.20181
        ],
        "ours": false
      },
      {
        "name": "NAUTILUS (7B)",
        "values": [
          0.21748,
          0.42234,
          0.0523,
          0.74137,
          1.37125
        ],
        "ours": false
      },
      {
        "name": "SimpleVLN (8B)",
        "values": [
          0.18501,
          0.37259,
          0.05424,
          0.57398,
          1.09097
        ],
        "ours": false
      },
      {
        "name": "NereidVLA (8B)",
        "values": [
          0.18082,
          0.3497,
          0.04658,
          0.59726,
          1.06058
        ],
        "ours": true
      }
    ]
  },
  "simulation": {
    "headers": [
      "Model",
      "Obstacle avoidance",
      "Target search / approach",
      "Pipeline",
      "Cave",
      "Overall SR (%)",
      "Jerk RMS (m/s³)",
      "Grid-SPL (%)"
    ],
    "models": [
      {
        "name": "U0 †",
        "values": [
          5.6,
          19.2,
          10.4,
          13.6,
          12.2,
          4.1906,
          10.71
        ],
        "ours": false
      },
      {
        "name": "π₀.₅-USIM †",
        "values": [
          0.8,
          8.0,
          4.8,
          0.8,
          3.6,
          1.7826,
          3.09
        ],
        "ours": false
      },
      {
        "name": "Qwen3-VL-8B",
        "values": [
          84.0,
          52.0,
          71.2,
          82.4,
          72.4,
          1.1247,
          71.52
        ],
        "ours": false
      },
      {
        "name": "Qwen3-VL-32B",
        "values": [
          76.0,
          44.0,
          59.2,
          65.6,
          61.2,
          1.4338,
          59.47
        ],
        "ours": false
      },
      {
        "name": "SimpleVLN (8B)",
        "values": [
          74.4,
          38.4,
          52.0,
          41.6,
          51.6,
          1.9478,
          49.82
        ],
        "ours": false
      },
      {
        "name": "InternVLA-N1",
        "values": [
          83.2,
          46.4,
          87.2,
          76.0,
          73.2,
          1.3986,
          70.91
        ],
        "ours": false
      },
      {
        "name": "NAUTILUS (7B)",
        "values": [
          79.2,
          47.2,
          83.2,
          61.6,
          67.8,
          1.3621,
          65.62
        ],
        "ours": false
      },
      {
        "name": "NereidVLA",
        "values": [
          85.6,
          81.6,
          86.4,
          84.0,
          84.4,
          1.0658,
          81.85
        ],
        "ours": true
      }
    ]
  },
  "real": {
    "headers": [
      "Model",
      "Target approach",
      "Obstacle avoidance",
      "Goal approach with obstacles",
      "Narrow passage",
      "Overall"
    ],
    "models": [
      {
        "name": "Qwen3-VL-8B",
        "values": [
          35.0,
          80.0,
          15.0,
          10.0,
          35.0
        ],
        "ours": false
      },
      {
        "name": "InternVLA-N1",
        "values": [
          60.0,
          85.0,
          30.0,
          15.0,
          47.5
        ],
        "ours": false
      },
      {
        "name": "NereidVLA",
        "values": [
          90.0,
          95.0,
          70.0,
          60.0,
          78.75
        ],
        "ours": true
      }
    ]
  }
};
