import { WagerButton, ShareWagerButton, JoinedWagerButton, YouWonButton, YouLostButton, DrawButton } from '../../components/WagerPageButtons';
import { Minus } from 'lucide-react';
import { Montserrat } from 'next/font/google';

const montserrat = Montserrat({ subsets: ['latin'] });

export default function WagerPage() {
  return (
    <div className="flex flex-col min-h-screen">
      <div className="flex flex-col gap-3 text-center py-4 text-md">
        <p className={montserrat.className}>Wager by 0x...</p>

        <p className={montserrat.className}>No of Participants: 4</p>
      </div>
      <div className="flex flex-col border border-black rounded-xl mx-[15rem] my-7 py-14">
        <div className="flex justify-between gap-6 items-center px-7 py-3">
          <div id="home-team" className="border rounded-xl text-center px-5 py-3">
            <p className="text-2xl font-bold">Man Utd</p>
          </div>

          <Minus className="w-10 h-10 font-extrabold text-purple-800" />

          <div id="away-team" className="border rounded-xl text-center px-5 py-3">
            <p className="text-2xl font-bold">Man City</p>
          </div>
        </div>

        <div className="flex justify-between gap-6 items-center px-14 py-3">
          <div id="home-team-prediction" className="border rounded-xl text-center px-5 py-3">
            <p className="text-xl font-bold">--</p>
          </div>

          <p className="text-center font-extrabold text-purple-800">Prediction</p>

          <div id="away-team-prediction" className="border rounded-xl text-center px-5 py-3">
            <p className="text-xl font-bold">--</p>
          </div>
        </div>

        <div className="text-center pt-5 pb-2">
          <p className="text-xl">24 : 00 : 00</p>
        </div>
      </div>
      <div className="flex justify-center items-center py-24">
        <WagerButton />
        {/* <ShareWagerButton /> */}
        {/* <JoinedWagerButton /> */}
        {/* <YouWonButton /> */}
        {/* <YouLostButton /> */}
        {/* <DrawButton /> */}
      </div>
    </div>
  );
}
