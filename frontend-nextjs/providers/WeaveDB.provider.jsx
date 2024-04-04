import { useEffect, useState } from "react";
import SDK from "weavedb-sdk";
import { useAccount } from "wagmi";
const CONTRACT_TX_ID = process.env.NEXT_PUBLIC_CONTRACT_TX_ID;

export default function useWeaveDB() {
  const { account, isConnected } = useAccount();

  const [weaveDB, setWeaveDB] = useState(null);
  const [tempIdentity, setTempIdentity] = useState(null);
  const [hasCreatedTempAddress, setHasCreatedTempAddress] = useState(false);

  useEffect(() => {
    async function init() {
      const db = new SDK({ contractTxId: CONTRACT_TX_ID, nocache: true });
      await db.init();
      setWeaveDB(db);
      // if (!isConnected || hasCreatedTempAddress) return; // Don't create the temp address if the user is not connected or it has already been created

      // const { identity } = await db.createTempAddress();
      // setTempIdentity(identity);
      // setHasCreatedTempAddress(true); // Set this to true after the temp address has been created
    }

    init();
  }, []);

  return { weaveDB, tempIdentity };
}
