import { useWeaveDBContext } from "../providers/WeaveDBContext";
import { Minus } from "lucide-react";
import { useEffect, useState } from "react";
import { useConnectModal } from "@rainbow-me/rainbowkit";
import { GhostIcon } from "lucide-react";
import { useAccount } from "wagmi";
import { useRouter } from "next/router";
import { Skeleton } from "./ui/skeleton";
import { useToast } from "./ui/use-toast";
import Countdown, { zeroPad } from "react-countdown";
import { cn } from "../lib/utils";

export default function MatchesDisplay() {
  const router = useRouter();
  const [isPending, setIsPending] = useState();
  const { toast } = useToast();

  const { openConnectModal } = useConnectModal();
  const { isConnected } = useAccount();

  const db = useWeaveDBContext();

  const [matches, setMatches] = useState(null);

  useEffect(() => {
    async function init() {
      setIsPending(true);
      if (db.weaveDB) {
        const fectedMatches = await db.weaveDB.get("matches");

        setMatches(fectedMatches);
      }
      setIsPending(false);
    }

    init();
  }, [db.weaveDB]);

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

  const handleCreateWager = (matchId) => {
    if (!isConnected) {
      return toast({
        title: "Please Connect A Wallet",
      });
    }
    router.push(`/create/${matchId}`);
  };

  if (isPending || !matches) {
    return (
      <div className="grid grid-cols-3 px-9 py-5 gap-5">
        <Skeleton className="h-[182px] bg-gray-300" />
        <Skeleton className="h-[182px] bg-gray-300" />
        <Skeleton className="h-[182px] bg-gray-300" />
        <Skeleton className="h-[182px] bg-gray-300" />
        <Skeleton className="h-[182px] bg-gray-300" />
        <Skeleton className="h-[182px] bg-gray-300" />
      </div>
    );
  }

  return (
    <div className="grid grid-cols-2 px-9 py-5 gap-5 lg:grid-cols-3">
      {matches.length === 0 ? (
        <div className="flex flex-col col-span-3 items-center justify-center">
          <GhostIcon className="w-10 h-10 text-gray-500" />
          <p>No matches yet, check back later</p>
        </div>
      ) : (
        matches.map((match) => (
          <div
            key={match.match_id}
            className="flex flex-col border-2 border-black rounded-xl"
          >
            <div className="flex justify-between items-center px-6 py-4">
              <div
                id="home-team"
                className="border rounded-xl text-center px-5 py-3"
              >
                <p>{match.home_team}</p>
              </div>

              <Minus className="w-10 h-10 font-extrabold text-purple-800" />

              <div
                id="away-team"
                className="border rounded-xl text-center px-5 py-3"
              >
                <p>{match.away_team}</p>
              </div>
            </div>
            <div className="flex items-center justify-center py-2">
              <Countdown
                date={match.match_timestamp * 1000}
                renderer={renderer}
              />
            </div>

            <div className="flex items-center justify-center pt-3 pb-2">
              <button
                type="button"
                className="text-center font-bold px-4 py-2 rounded-xl bg-purple-800 text-white"
                onClick={() => handleCreateWager(match.match_id)}
              >
                Create Wager
              </button>
            </div>
          </div>
        ))
      )}
    </div>
  );
}
