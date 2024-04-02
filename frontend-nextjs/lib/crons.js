export const weaveDBCron = (matchweek_start, matchweek_end, interval) => {
  return {
    start: Date.now() / 1000,
    end: (Date.now() + 1000 * 60 * 60 * 4) / 1000, // 4 hours
    span: (Date.now() + 1000 * 60 * 30) / 1000, // 30 mins,
    do: true,
    times: 1,
    jobs: [
      [
        "get",
        "completedMatches",
        ["matches", ["result"], ["result", "!=", ""]],
      ],
      [
        "do",
        [
          "forEach",
          [
            "pipe",
            ["let", "match"],
            [
              "get",
              "wagers",
              [
                "wagers",
                ["match_id"],
                ["match_id", "==", ["prop", "match_id", { var: "match" }]],
              ],
            ],
            ["let", "wagers"],
            [
              "do",
              [
                "forEach",
                [
                  "pipe",
                  ["let", "wager"],
                  [
                    "get",
                    "wagerPredictions",
                    [
                      "predictions",
                      ["wager_id"],
                      [
                        "wager_id",
                        "==",
                        ["prop", "wager_id", { var: "wager" }],
                      ],
                    ],
                  ],
                  ["let", "wagerPredictions"],
                  [
                    "let",
                    "wagerWinners",
                    [
                      "filter",
                      [
                        "pipe",
                        ["prop", "predicted_score", { var: "prediction" }],
                        ["eq", ["prop", "result", { var: "match" }]],
                      ],
                      { var: "wagerPredictions" },
                    ],
                  ],
                  [
                    "add",
                    {
                      wager_id: ["prop", "wager_id", { var: "wager" }],
                      winners: [
                        "prop",
                        "user_address",
                        { var: "wagerWinners" },
                      ],
                    },
                    "winners",
                  ],
                ],
                { var: "wagers" },
              ],
            ],
          ],
          { var: "completedMatches" },
        ],
      ],
    ],
  };
};
