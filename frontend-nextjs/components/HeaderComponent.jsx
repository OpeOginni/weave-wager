import { ConnectButton } from '@rainbow-me/rainbowkit';
import { Gamepad2 } from 'lucide-react';

export default function HeaderComponent() {
  return (
    <div className="flex w-full py-6 px-8 justify-between items-center">
      <Gamepad2 className="w-10 h-10 text-purple-800" />
      <ConnectButton />
    </div>
  );
}
