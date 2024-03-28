import { useWeaveDBContext } from "../providers/WeaveDBContext";
import { Minus } from "lucide-react";
import { useEffect, useState } from "react";
import { useConnectModal } from "@rainbow-me/rainbowkit";
import { GhostIcon } from "lucide-react";
import { useAccount } from "wagmi";
import { useRouter } from "next/router";

export default function MatchesDisplay() {
  const router = useRouter();

  const { openConnectModal } = useConnectModal();
  const { status } = useAccount();

  const weaveDB = useWeaveDBContext();

  const [matches, setMatches] = useState(null);

  useEffect(() => {
    async function init() {
      if (weaveDB) {
        const fectedMatches = await weaveDB.get("matches");

        setMatches(fectedMatches);
      }
    }

    init();
  }, [weaveDB]);

  const handleCreateWager = (matchId) => {
    if (status !== "connected") {
      openConnectModal();
    }
    router.push(`/create/${matchId}`);
  };

  return (
    <div className="grid grid-cols-3 px-9 py-5 gap-5">
      {!matches || matches.length === 0 ? (
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
            <div className="flex items-center justify-center pt-6 pb-2">
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
