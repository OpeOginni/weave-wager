import { getDefaultConfig } from "@rainbow-me/rainbowkit";
import { arbitrum, arbitrumSepolia, hardhat } from "wagmi/chains";
const dotenv = require("dotenv");

dotenv.config();

export const config = getDefaultConfig({
  appName: "Weave Wager",
  projectId: process.env.NEXT_PUBLIC_WALLET_CONNECT_ID,
  chains: [
    arbitrumSepolia,
  ],
  // transports: {
  //   [hardhat.id] : http("")
  // }
  ssr: true,
});
