import { getDefaultConfig } from "@rainbow-me/rainbowkit";
import { arbitrum, arbitrumSepolia, hardhat } from "wagmi/chains";

export const config = getDefaultConfig({
  appName: "Weave Wager",
  projectId: "YOUR_PROJECT_ID",
  chains: [
    // arbitrum,
    hardhat,
    ...(process.env.NEXT_PUBLIC_ENABLE_TESTNETS === "true"
      ? [arbitrumSepolia]
      : []),
  ],
  // transports: {
  //   [hardhat.id] : http("")
  // }
  ssr: true,
});
