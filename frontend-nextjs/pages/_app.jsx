import "../styles/globals.css";
import "@rainbow-me/rainbowkit/styles.css";

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { WagmiProvider } from "wagmi";
import { arbitrum, arbitrumSepolia } from "wagmi/chains";
import { getDefaultConfig, RainbowKitProvider } from "@rainbow-me/rainbowkit";
import { WeaveDBProvider } from "../providers/WeaveDBContext";
import HeaderComponent from "../components/HeaderComponent";
const config = getDefaultConfig({
  appName: "Weave Wager",
  projectId: "YOUR_PROJECT_ID",
  chains: [
    arbitrum,
    ...(process.env.NEXT_PUBLIC_ENABLE_TESTNETS === "true"
      ? [arbitrumSepolia]
      : []),
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
          </WeaveDBProvider>
        </RainbowKitProvider>
      </QueryClientProvider>
    </WagmiProvider>
  );
}

export default MyApp;
