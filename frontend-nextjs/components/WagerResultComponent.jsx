import { YouWonButton, YouLostButton, DrawButton } from "./WagerPageButtons";
import { useWeaveDBContext } from "../providers/WeaveDBContext";
import { useEffect, useState } from "react";
import { useAccount } from "wagmi";

export default function WagerResultComponent({ wager_id }) {
  const [result, setResult] = useState(null);
  const db = useWeaveDBContext();
  const { address } = useAccount();

  useEffect(() => {
    async function getWagerResult() {
      try {
        if (db.weaveDB && wager_id) {
          const fetchedWinners = await db.weaveDB.get(
            "winners",
            ["wager_id"],
            ["wager_id", "==", wager_id]
          );

          setResult(fetchedWinners[0]);
        }
      } catch (e) {
        console.log(e);
      }
    }
    getWagerResult();
  }, [db.weaveDB, wager_id]);

  let button;

  if (result && result?.winners.lenght > 0) {
    if (result?.winners.lenght.includes(address)) {
      button = <YouWonButton />;
    } else {
      button = <YouLostButton />;
    }
  } else if (result?.winners.lenght === 0) {
    button = <DrawButton />;
  } else if (!result) {
    button = <p>Winners Anounced Soon!</p>;
  }

  return (
    <div className="flex flex-col gap-4">
      {button}

      {result?.winners.lenght > 0 ? (
        <div className="flex flex-col justify-center items-center text-center">
          <p className="text-lg">Winners</p>

          <div className="flex flex-col gap-4 border rounded-xl">
            {result?.winners.map((winner) => {
              <p key={winner}>{winner}</p>;
            })}
          </div>
        </div>
      ) : null}
    </div>
  );
}
