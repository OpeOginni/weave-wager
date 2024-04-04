import {
  WagerButton,
  ShareWagerButton,
  JoinedWagerButton,
  ResolveWagerButton,
  CancelWagerButton,
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
import { parseEther, formatEther } from "viem";
import WagerResultComponent from "../../components/WagerResultComponent";

import { Skeleton } from "../../components/ui/skeleton";

const dotenv = require("dotenv");

dotenv.config();
const montserrat = Montserrat({ subsets: ["latin"] });

export default function WagerPage() {
  const router = useRouter();
  const { address, isConnected } = useAccount();

  const [match, setMatch] = useState(null);
  const [prediction, setPrediction] = useState(null);
  const [winners, setWinners] = useState(null);

  const [isFetchingPrediction, setIsFetchingPrediction] = useState(false);

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
        setIsFetchingPrediction(true);
        if (db.weaveDB && wager) {
          const fecthedMatch = await db.weaveDB.get(
            "matches",
            ["match_id"],
            ["match_id", "==", Number(wager.result.matchId).toString()]
          );

          if (fecthedMatch.length === 0) return router.push("/");

          setMatch(fecthedMatch[0]);

          const fetchedWinners = await db.weaveDB.get(
            "winners",
            Number(wager.result.id).toString()
          );

          setWinners(fetchedWinners);
        }

        if (db.weaveDB && isParticipant?.result) {
          const fetchedPrediction = await db.weaveDB.get(
            "predictions",
            `${Number(wager.result.id)}-${address}`
          );

          setPrediction(fetchedPrediction);
          setIsFetchingPrediction(false);
        }
      } catch (e) {
        console.log(e);
      }
    }

    getMatch();
  }, [wager?.result.matchId, db.weaveDB, isParticipant?.result]);

  const renderer = ({ days, hours, minutes, seconds, completed }) => {
    return (
      <span
        className={cn(
          " text-xl font-bold",
          days === 0 && hours === 0 && minutes === 0 && seconds <= 5
            ? "text-red-800"
            : days === 0 &&
              hours === 0 &&
              minutes === 0 &&
              minutes === 0 &&
              seconds <= 30
            ? "text-orange-600"
            : "text-black"
        )}
      >
        {zeroPad(days)}:{zeroPad(hours)}:{zeroPad(minutes)}:{zeroPad(seconds)}
      </span>
    );
  };

  let button;

  if (match?.match_timestamp * 1000 < Date.now()) {
    button = <p>Match has ended</p>;
  } else if (wager?.result.creator === address) {
    button = <ShareWagerButton wager_id={wagerId} />;
  } else if (isParticipant?.result) {
    button = <JoinedWagerButton />;
  } else if (wager?.result.stake) {
    button = <WagerButton wager_stake={wager.result.stake} />;
  } else {
    button = <p>Loading...</p>;
  }

  if (isPending) return <div>Loading...</div>;

  if (error) return <div>Error: {error.shortMessage || error.message}</div>;

  if (!isConnected) return <div>Connect Your Wallet To Join Wager</div>;
  return (
    <div className="flex flex-col min-h-screen">
      <div className="flex flex-col gap-3 text-center py-4 text-md">
        <p className={montserrat.className}>Wager by {wager.result.creator}</p>

        <p className={montserrat.className}>
          No of Participants: {Number(wager.result.totalEntries)}
        </p>
      </div>
      <div className="flex flex-col text-center border border-black rounded-xl mx-[15rem] lg:mx-[30rem] my-7 py-14">
        <p className={cn(montserrat.className, "font-extrabold")}>
          STAKE: {Number(formatEther(wager.result.stake))} ETH
        </p>
        <div className="flex justify-between gap-6 items-center px-7 py-3">
          <div
            id="home-team"
            className="border rounded-xl text-center px-5 py-3"
          >
            {match ? (
              <p className="text-2xl font-bold">{match.home_team}</p>
            ) : (
              // Render a loading message or spinner here
              <Skeleton className="h-[50px] w-[100px] bg-gray-300" />
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
              <Skeleton className="h-[50px] w-[100px] bg-gray-300" />
            )}
          </div>
        </div>

        <div className="flex justify-between gap-6 items-center px-14 py-3">
          <div
            id="home-team-prediction"
            className="border rounded-xl text-center px-5 py-3"
          >
            {isParticipant?.result ? (
              prediction ? (
                <p className="text-xl font-bold">
                  {prediction.predicted_score.split("-")[0]}
                </p>
              ) : (
                <Skeleton className="h-[28px] w-[13px] bg-gray-300" />
              )
            ) : (
              <p className="text-xl font-bold">--</p>
            )}
          </div>

          <p className="text-center font-extrabold text-purple-800">
            Your Prediction
          </p>

          <div
            id="away-team-prediction"
            className="border rounded-xl text-center px-5 py-3"
          >
            {isParticipant?.result ? (
              prediction ? (
                <p className="text-xl font-bold">
                  {prediction.predicted_score.split("-")[1]}
                </p>
              ) : (
                <Skeleton className="h-[28px] w-[13px] bg-gray-300" />
              )
            ) : (
              <p className="text-xl font-bold">--</p>
            )}
          </div>
        </div>

        <div className="flex items-center justify-center text-center pt-5 pb-2">
          {match ? (
            <Countdown
              date={match.match_timestamp * 1000}
              renderer={renderer}
            />
          ) : (
            // Render a loading message or spinner here
            <p>Loading...</p>
          )}
        </div>
      </div>
      <div className="flex flex-col gap-3 justify-center items-center py-24">
        {/* {match?.status === "COMPLETED" &&
        !match.resolved &&
        wager.result.winners_choosen ? (
          <ResolveWagerButton />
        ) : null} */}
        {!wager?.result.resolved &&
        Number(wager?.result.totalEntries) < 2 &&
        isParticipant?.result ? (
          <CancelWagerButton wager_id={wagerId} />
        ) : !wager?.result.resolved &&
          match?.match_timestamp * 1000 < Date.now() &&
          isParticipant?.result &&
          !wager?.result.resolved ? (
          <ResolveWagerButton wager_id={wagerId} />
        ) : null}

        {/* {!wager.resolved && match?.match_timestamp * 1000 < Date.now() ? (
          <ResolveWagerButton wager_id={wagerId} />
        ) : null} */}

        {match?.status === "COMPLETED" ? (
          <WagerResultComponent wager_id={wagerId} />
        ) : (
          <div>{button}</div>
        )}
      </div>
    </div>
  );
}
