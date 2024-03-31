import WeaveDB from "weavedb-sdk-node";

const CONTRACT_TX_ID = process.env.NEXT_PUBLIC_CONTRACT_TX_ID;

export default async function handler(req, res) {
  if (req.method === "POST") {
    try {
      const db = new WeaveDB({ contractTxId: CONTRACT_TX_ID });
      await db.init();
      const completedMatches = await db.get(
        "matches",
        ["result"],
        ["result", "!=", ""]
      );

      for (const match of completedMatches) {
        const wagers = await db.get(
          "wagers",
          ["match_id"],
          ["match_id", "==", match.match_id]
        );

        for (const wager of wagers) {
          const wagerPredictions = await db.get(
            "predictions",
            ["wager_id"],
            ["wager_id", "==", wager.wager_id]
          );

          const wagerWinners = [];
          for (const prediction of wagerPredictions) {
            if (prediction.predicted_score === match.result) {
              wagerWinners.push(prediction.user_address);
            }
          }

          await db.set(
            { wager_id: wager.wager_id, winners: wagerWinners },
            "winners",
            wager.wager_id
          );
        }
      }

      res
        .status(200)
        .json({ message: "Winning Predictions have been Obtained" });
    } catch (e) {
      res.status(500).json({ message: e.message });
    }
  } else {
    res.status(404);
  }
}
