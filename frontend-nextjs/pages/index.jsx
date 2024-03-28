import { Montserrat } from "next/font/google";
import MatchesDisplay from "../components/MatchesDisplayComponent";

const montserrat = Montserrat({ subsets: ["latin"] });

export default function Home() {
  return (
    <main className="flex flex-col min-h-screen">
      <div className="w-full py-24 text-center text-purple-800 text-4xl">
        <h1 className={montserrat.className}>Weave Wager</h1>
      </div>
      <MatchesDisplay />
    </main>
  );
}
