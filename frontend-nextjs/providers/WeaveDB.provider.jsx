import { useEffect, useState } from "react";
import SDK from "weavedb-sdk";
import { useAccount } from "wagmi";
const CONTRACT_TX_ID = process.env.NEXT_PUBLIC_CONTRACT_TX_ID;

export default function useWeaveDB() {
  const { account, isConnected } = useAccount();

  const [weaveDB, setWeaveDB] = useState(null);
  const [tempIdenity, setTempIdentity] = useState(null);

  useEffect(() => {
    async function init() {
      const db = new SDK({ contractTxId: CONTRACT_TX_ID, nocache: true });
      await db.init();
      if (isConnected) {
        const expiry = 60 * 60 * 24 * 7; // set expiry to a week
        // Only create an identity WHEN wallet is connected
        const { identity } = await db.createTempAddress(null, expiry);
        setTempIdentity(identity);
      }
      setWeaveDB(db);
    }

    init();
  }, [isConnected]);

  return { weaveDB, tempIdenity };
}
