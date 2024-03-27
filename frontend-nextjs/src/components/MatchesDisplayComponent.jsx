import { Minus } from "lucide-react";

const matches = [
  {
    id: 1,
    home: "Man Utd",
    away: "Man City",
    matchTime: Date.now() + 1000 * 60 * 60 * 24,
  },
  {
    id: 2,

    home: "Tottenham",
    away: "Chelsea",
    matchTime: Date.now() + 1000 * 60 * 60 * 24,
  },
  {
    id: 3,

    home: "Brentford",
    away: "Coventry",
    matchTime: Date.now() + 1000 * 60 * 60 * 24,
  },
  {
    id: 4,

    home: "Liverpool",
    away: "Everton",
    matchTime: Date.now() + 1000 * 60 * 60 * 24,
  },
  {
    id: 5,
    home: "France",
    away: "England",
    matchTime: Date.now() + 1000 * 60 * 60 * 24,
  },
];
export default function MatchesDisplay() {
  return (
    <div className="grid grid-cols-3 px-9 py-5 gap-5">
      {matches.map((match) => (
        <div
          key={match.id}
          className="flex flex-col border-2 border-black rounded-xl"
        >
          <div className="flex justify-between items-center px-6 py-4">
            <div
              id="home-team"
              className="border rounded-xl text-center px-5 py-3"
            >
              <p>{match.home}</p>
            </div>

            <Minus className="w-10 h-10 font-extrabold text-purple-800" />

            <div
              id="away-team"
              className="border rounded-xl text-center px-5 py-3"
            >
              <p>{match.away}</p>
            </div>
          </div>
          <div className="flex items-center justify-center pt-6 pb-2">
            <button
              type="button"
              className="text-center font-bold px-4 py-2 rounded-xl bg-purple-800 text-white"
            >
              Create Wager
            </button>
          </div>
        </div>
      ))}
    </div>
  );
}
