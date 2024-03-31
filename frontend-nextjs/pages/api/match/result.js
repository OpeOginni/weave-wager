import SDK from "weavedb-sdk";

const CONTRACT_TX_ID = process.env.NEXT_PUBLIC_CONTRACT_TX_ID;

export default async function handler(req, res) {
  if (req.method === "POST") {
    try {
      const db = new SDK({ contractTxId: CONTRACT_TX_ID });
      await db.init();

      const body = {
        match_id: req.body.match_id,
        result: req.body.result,
      };

      await db.update({ result: body.result }, "matches", match_id);

      res.status(200).json({ message: "Match Result Updated" });
    } catch (e) {
      res.status(500).json({ message: e.message });
    }
  } else {
    res.status(404);
  }
}
