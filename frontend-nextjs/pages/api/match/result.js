import WeaveDB from "weavedb-sdk-node";

const CONTRACT_TX_ID = process.env.NEXT_PUBLIC_CONTRACT_TX_ID;

export default async function handler(req, res) {
  if (req.method === "PATCH") {
    try {
      const db = new WeaveDB({ contractTxId: CONTRACT_TX_ID });
      await db.init();
      const { identity } = await db.createTempAddress();

      const body = {
        match_id: req.body.match_id,
        result: req.body.result,
      };

      await db.update({ result: body.result }, "matches", match_id, identity);

      res.status(200).json({ message: "Match Result Updated" });
    } catch (e) {
      res.status(500).json({ message: e.message });
    }
  } else {
    res.status(404);
  }
}
