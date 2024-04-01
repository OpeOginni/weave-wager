import {
  WagerButton,
  ShareWagerButton,
  JoinedWagerButton,
  YouWonButton,
  YouLostButton,
  DrawButton,
} from "../../components/WagerPageButtons";
import { Minus } from "lucide-react";
import { useWeaveDBContext } from "../../providers/WeaveDBContext";
import { Montserrat } from "next/font/google";
import { useRouter } from "next/router";
import { useAccount, useReadContracts } from "wagmi";
import { getWagerAbi, isParticipantAbi } from "../../abi/weaveWager";
import { useEffect, useState } from "react";
import Countdown, { zeroPad } from "react-countdown";
import { cn } from "../../lib/utils";

const dotenv = require("dotenv");

dotenv.config();
const montserrat = Montserrat({ subsets: ["latin"] });

export default function WagerPage() {
  const router = useRouter();
  const { address } = useAccount();

  const [match, setMatch] = useState(null);
  const [prediction, setPrediction] = useState(null);

  const wagerId = router.query.wager_id;
  const db = useWeaveDBContext();

  const { data, isPending, error } = useReadContracts({
    contracts: [
      {
        address: process.env.NEXT_PUBLIC_CONTRACT_ADDRESS,
        abi: getWagerAbi,
        functionName: "getWager",
        args: [BigInt(Number(wagerId || 0))],
      },
      {
        address: process.env.NEXT_PUBLIC_CONTRACT_ADDRESS,
        abi: isParticipantAbi,
        functionName: "isParticipant",
        args: [BigInt(Number(wagerId || 0)), address],
      },
    ],
    enabled: !!router.query.wager_id,
  });

  const [wager, isParticipant] = data || [];

  // biome-ignore lint/correctness/useExhaustiveDependencies: <explanation>
  useEffect(() => {
    async function getMatch() {
      try {
        if (db.weaveDB && wager) {
          console.log(isParticipant);
          console.log("wager");

          console.log(wager);

          const fecthedMatch = await db.weaveDB.get(
            "matches",
            ["match_id"],
            ["match_id", "==", Number(wager.result.matchId).toString()]
          );

          console.log("fecthedMatch");
          console.log(fecthedMatch);

          if (fecthedMatch.length === 0) return router.push("/");

          setMatch(fecthedMatch[0]);
        }

        if (db.weaveDB && isParticipant.result) {
          console.log(`${Number(wager.result.id)}-${address}`);
          const fetchedPrediction = await db.weaveDB.get(
            "predictions",
            `${Number(wager.result.id)}-${address}`
          );

          console.log("fetchedPrediction");
          console.log(fetchedPrediction);

          setPrediction(fetchedPrediction);
        }
      } catch (e) {
        console.log(e);
      }
    }

    getMatch();
  }, [wager?.result.matchId, db.weaveDB, isParticipant?.result]);

  const renderer = ({ hours, minutes, seconds, completed }) => {
    return (
      <span
        className={cn(
          " text-xl font-bold",
          minutes === 0 && seconds <= 5
            ? "text-red-800"
            : minutes === 0 && seconds <= 30
            ? "text-orange-600"
            : "text-black"
        )}
      >
        {zeroPad(hours)}:{zeroPad(minutes)}:{zeroPad(seconds)}
      </span>
    );
  };

  if (isPending) return <div>Loading...</div>;

  if (error) return <div>Error: {error.shortMessage || error.message}</div>;

  return (
    <div className="flex flex-col min-h-screen">
      <div className="flex flex-col gap-3 text-center py-4 text-md">
        <p className={montserrat.className}>Wager by {wager.result.creator}</p>

        <p className={montserrat.className}>
          No of Participants: {Number(wager.result.totalEntries)}
        </p>
      </div>
      <div className="flex flex-col border border-black rounded-xl mx-[15rem] my-7 py-14">
        <div className="flex justify-between gap-6 items-center px-7 py-3">
          <div
            id="home-team"
            className="border rounded-xl text-center px-5 py-3"
          >
            {match ? (
              <p className="text-2xl font-bold">{match.home_team}</p>
            ) : (
              // Render a loading message or spinner here
              <p>Loading...</p>
            )}
          </div>

          <Minus className="w-10 h-10 font-extrabold text-purple-800" />

          <div
            id="away-team"
            className="border rounded-xl text-center px-5 py-3"
          >
            {match ? (
              <p className="text-2xl font-bold">{match.away_team}</p>
            ) : (
              // Render a loading message or spinner here
              <p>Loading...</p>
            )}
          </div>
        </div>

        <div className="flex justify-between gap-6 items-center px-14 py-3">
          <div
            id="home-team-prediction"
            className="border rounded-xl text-center px-5 py-3"
          >
            {prediction ? (
              <p className="text-xl font-bold">
                {prediction.predicted_score.split("-")[0]}
              </p>
            ) : (
              <p className="text-xl font-bold">--</p>
            )}
          </div>

          <p className="text-center font-extrabold text-purple-800">
            Prediction
          </p>

          <div
            id="away-team-prediction"
            className="border rounded-xl text-center px-5 py-3"
          >
            {prediction ? (
              <p className="text-xl font-bold">
                {prediction.predicted_score.split("-")[1]}
              </p>
            ) : (
              <p className="text-xl font-bold">--</p>
            )}{" "}
          </div>
        </div>

        <div className="flex items-center justify-center text-center pt-5 pb-2">
          <Countdown date={match.match_timestamp * 1000} renderer={renderer} />
        </div>
      </div>
      <div className="flex justify-center items-center py-24">
        {wager.result.creator === address ? (
          <ShareWagerButton wager_id={wagerId} />
        ) : isParticipant.result ? (
          <JoinedWagerButton />
        ) : (
          <WagerButton />
        )}

        {/* <ShareWagerButton /> */}
        {/* <YouWonButton /> */}
        {/* <YouLostButton /> */}
        {/* <DrawButton /> */}
      </div>
    </div>
  );
}
