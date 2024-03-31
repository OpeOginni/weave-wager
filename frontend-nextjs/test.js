import useWeaveDB from "./providers/WeaveDB.provider";

async function Main() {
  const weaveDB = useWeaveDB();

  const completedMatches = await weaveDB.get(
    "matches",
    ["result"],
    ["result", "!=", ""]
  );

  for (const match of completedMatches) {
    const wagers = await weaveDB.get(
      "wagers",
      ["match_id"],
      ["match_id", "==", match.match_id]
    );

    for (const wager of wagers) {
      const wagerPredictions = await weaveDB.get(
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

      await weaveDB.add(
        { wager_id: wager.wager_id, winners: wagerWinners },
        "winners"
      );
    }
  }
  // loop through the matchIds and the wagers in each match
}
