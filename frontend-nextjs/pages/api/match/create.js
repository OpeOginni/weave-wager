// import WeaveDB from "weavedb-sdk-node";

const WeaveDB = require("weavedb-sdk-node");
const dotenv = require("dotenv");
import { ethers } from "ethers";

dotenv.config();
const CONTRACT_TX_ID = process.env.NEXT_PUBLIC_CONTRACT_TX_ID;
const ADMIN_PRIVATE_KEY = process.env.ADMIN_PRIVATE_KEY;

export default async function handler(req, res) {
  if (req.method === "POST") {
    try {
      const db = new WeaveDB({ contractTxId: CONTRACT_TX_ID });

      await db.init();

      const body = {
        match_id: req.body.match_id,
        home_team: req.body.home_team,
        away_team: req.body.away_team,
        match_timestamp: req.body.match_timestamp,
      };

      const match = await db.get("matches", body.match_id);

      if (match) return res.status(400).json({ message: "Match_ID Exists" });

      await db.set(body, "matches", body.match_id, {
        privateKey: ADMIN_PRIVATE_KEY,
      });

      res.status(200).json({ message: "Match Created" });
    } catch (e) {
      console.log(e);
      res.status(500).json({ message: e.message });
    }
  } else {
    res.status(404);
  }
}
