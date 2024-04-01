import WeaveDB from "weavedb-sdk-node";
import dotenv from "dotenv";

import { resolveWagerAbi } from "../../../abi/weaveWager";
import { ethers } from "ethers";

dotenv.config();
const CONTRACT_TX_ID = process.env.NEXT_PUBLIC_CONTRACT_TX_ID;
const CONTRACT_ADDRESS = process.env.NEXT_PUBLIC_CONTRACT_ADDRESS;
const ADMIN_PRIVATE_KEY = process.env.ADMIN_PRIVATE_KEY;
const JSON_RPC_PROVIDER = process.env.JSON_RPC_PROVIDER;

const provider = new ethers.JsonRpcProvider(JSON_RPC_PROVIDER);

const signer = new ethers.Wallet(ADMIN_PRIVATE_KEY, provider);

const weaveWagerContract = new ethers.Contract(
  CONTRACT_ADDRESS,
  resolveWagerAbi,
  signer
);

export default async function handler(req, res) {
  if (req.method === "POST") {
    try {
      const db = new WeaveDB({ contractTxId: CONTRACT_TX_ID });
      await db.init();

      const body = {
        wager_id: req.body.wager_id,
      };

      const winners = db.get("winners", body.wager_id);

      const tx = await weaveWagerContract.resolveWager(body.wager_id, winners);

      await tx.wait();

      res.status(200).json({ message: "Wager Resolved", tx });
    } catch (e) {
      res.status(500).json({ message: e.message });
    }
  } else {
    res.status(404);
  }
}
