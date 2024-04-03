import "../styles/globals.css";
import "@rainbow-me/rainbowkit/styles.css";
const dotenv = require("dotenv");

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { WagmiProvider, http } from "wagmi";
import { arbitrum, arbitrumSepolia, hardhat } from "wagmi/chains";
import { getDefaultConfig, RainbowKitProvider } from "@rainbow-me/rainbowkit";
import { WeaveDBProvider } from "../providers/WeaveDBContext";
import HeaderComponent from "../components/HeaderComponent";
import { Toaster } from "../components/ui/toaster";

dotenv.config();

const config = getDefaultConfig({
  appName: "Weave Wager",
  projectId: process.env.NEXT_PUBLIC_WALLET_CONNECT_ID,
  chains: [
    arbitrumSepolia,
  ],
  ssr: true,
});

const client = new QueryClient();

function MyApp({ Component, pageProps }) {
  return (
    <WagmiProvider config={config}>
      <QueryClientProvider client={client}>
        <RainbowKitProvider>
          <WeaveDBProvider>
            <HeaderComponent />
            <Component {...pageProps} />
            <Toaster />
          </WeaveDBProvider>
        </RainbowKitProvider>
      </QueryClientProvider>
    </WagmiProvider>
  );
}

export default MyApp;
