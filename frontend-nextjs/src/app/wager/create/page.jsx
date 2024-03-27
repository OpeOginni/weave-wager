import CreateWagerForm from '@/components/CreateWagerForm';
import { Minus } from 'lucide-react';

export default function CreateWagerPage() {
  return (
    <div className="flex flex-col min-h-screen">
      <div className="flex flex-col border border-black rounded-xl mx-[15rem] my-7 py-14">
        <div className="flex justify-between gap-6 items-center px-7">
          <div id="home-team" className="border rounded-xl text-center px-5 py-3">
            <p className="text-2xl font-bold">Man Utd</p>
          </div>

          <Minus className="w-10 h-10 font-extrabold text-purple-800" />

          <div id="away-team" className="border rounded-xl text-center px-5 py-3">
            <p className="text-2xl font-bold">Man City</p>
          </div>
        </div>

        <div className="text-center pt-5 pb-2">
          <p className="text-xl">24 : 00 : 00</p>
        </div>
      </div>
      <div className="py-8 mx-[25rem]">
        <CreateWagerForm />
      </div>
    </div>
  );
}
