import SDK from "weavedb-sdk";
import dotenv from "dotenv";
import { writeContract } from "@wagmi/core";
import { http, createConfig } from "@wagmi/core";
import { arbitrumSepolia } from "@wagmi/core/chains";
import { resolveWagerAbi } from "../../../abi/weaveWager";

export const config = createConfig({
  chains: [arbitrumSepolia],
  transports: {
    [arbitrumSepolia.id]: http(),
  },
});

dotenv.config();
const CONTRACT_TX_ID = process.env.NEXT_PUBLIC_CONTRACT_TX_ID;
const CONTRACT_ADDRESS = process.env.NEXT_PUBLIC_CONTRACT_ADDRESS;
const ADMIN_PRIVATE_KEY = prcoess.env.ADMIN_PRIVATE_KEY;

export default async function handler(req, res) {
  if (req.method === "POST") {
    try {
      const db = new SDK({ contractTxId: CONTRACT_TX_ID });
      await db.init();

      const body = {
        wager_id: req.body.wager_id,
      };

      const winners = db.get("winners", body.wager_id);

      const result = await writeContract({
        config,
        abi: resolveWagerAbi,
        address: CONTRACT_ADDRESS,
        args: [body.wager_id, winners.user_address],
      });

      res.status(200).json({ message: "Wager Resolved", result });
    } catch (e) {
      res.status(500).json({ message: e.message });
    }
  } else {
    res.status(404);
  }
}
