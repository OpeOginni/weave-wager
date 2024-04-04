import { Montserrat } from "next/font/google";
import MatchesDisplay from "../components/MatchesDisplayComponent";
import Link from "next/link";

const montserrat = Montserrat({ subsets: ["latin"] });

export default function Home() {
  return (
    <main className="flex flex-col min-h-screen">
      <div className="w-full py-24 text-center text-purple-800 text-4xl">
        <Link href="/admin">
          <h1 className={montserrat.className}>Weave Wager</h1>
        </Link>
      </div>
      <MatchesDisplay />
    </main>
  );
}
