const gameWeekStartDate = new Date("2023-01-01"); // When the first match of the gameDay starts
const startTimestamp = gameDayStartDate.getTime() / 1000; // Convert to seconds

const gameWeekEndDate = new Date("2023-01-02");
const endTimestamp = gameDayEndDate.getTime() / 1000;

const span = 60 * 60 * 5; // 2 hours between every check
const weaveDBCron = {
  start: startTimestamp,
  end: endTimestamp,
  span: span,
  do: false,
  times: 1,
  jobs: [
    ["get", "completedMatches", ["matches", ["result"], ["result", "!=", ""]]],
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
                    ["wager_id", "==", ["prop", "wager_id", { var: "wager" }]],
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
                    winners: ["prop", "user_address", { var: "wagerWinners" }],
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
