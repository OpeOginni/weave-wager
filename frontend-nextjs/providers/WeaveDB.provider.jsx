import { useEffect, useState } from "react";
import SDK from "weavedb-sdk";

const CONTRACT_TX_ID = process.env.NEXT_PUBLIC_CONTRACT_TX_ID;

export default function useWeaveDB() {
  const [weaveDB, setWeaveDB] = useState(null);

  useEffect(() => {
    async function init() {
      const db = new SDK({ contractTxId: CONTRACT_TX_ID });
      await db.init();
      setWeaveDB(db);
    }

    init();
  }, []);

  return weaveDB;
}
