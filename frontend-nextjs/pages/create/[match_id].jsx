import { useWeaveDBContext } from "../../providers/WeaveDBContext";
import CreateWagerForm from "../../components/CreateWagerForm";
import { Minus } from "lucide-react";
import { useRouter } from "next/router";
import { useReadContract, useAccount } from "wagmi";
import { useEffect, useState } from "react";
import { hasCreatedMatchWagerAbi } from "../../abi/weaveWager";

export default function CreateWagerPage() {
  const router = useRouter();
  const { address } = useAccount();

  const [match, setMatch] = useState(null);

  const matchId = router.query.match_id;
  const weaveDB = useWeaveDBContext();

  const { data, isPending, error } = useReadContract({
    address: process.env.NEXT_PUBLIC_CONTRACT_ADDRESS,
    abi: hasCreatedMatchWagerAbi,
    functionName: "hasCreatedMatchWager",
    args: [BigInt(Number(matchId || 0)), address],
    query: { enabled: !!matchId },
  });

  // biome-ignore lint/correctness/useExhaustiveDependencies: <explanation>
  useEffect(() => {
    async function getMatch() {
      if (weaveDB && data.result) {
        if (data.result === true) {
          const fetchedWager = await weaveDB.get(
            "wagers",
            `${matchId}-${address}`
          );

          return router.push(`/wager/${fetchedWager.wager_id}`);
        }

        const fecthedMatch = await weaveDB.get(
          "matches",
          ["match_id"],
          ["match_id", "==", router.query.match_id]
        );

        console.log("fecthedMatch");
        console.log(fecthedMatch);

        if (fecthedMatch.length === 0) return router.push("/");

        setMatch(fecthedMatch[0]);
      }
    }

    getMatch();
  }, [matchId, weaveDB, data?.result]);
  return (
    <div className="flex flex-col min-h-screen">
      <div className="flex flex-col border border-black rounded-xl mx-[15rem] my-7 py-14">
        <div className="flex justify-between gap-6 items-center px-7">
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

        <div className="text-center pt-5 pb-2">
          {match ? (
            <p className="text-xl">{match.match_timestamp}</p>
          ) : (
            // Render a loading message or spinner here
            <p>Loading...</p>
          )}
        </div>
      </div>
      <div className="py-8 mx-[25rem]">
        {match ? (
          <CreateWagerForm match_timestamp={match.match_timestamp} />
        ) : (
          // Render a loading message or spinner here
          <p>Loading...</p>
        )}
      </div>
    </div>
  );
}
