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
      setWeaveDB(db);
    }

    init();
  }, []);

  return { weaveDB, tempIdenity };
}
