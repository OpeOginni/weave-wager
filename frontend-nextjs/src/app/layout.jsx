import { Inter } from "next/font/google";
import "./globals.css";
import "@rainbow-me/rainbowkit/styles.css";
import { Providers } from "../providers/RainbowWalletProvider";
import HeaderComponent from "@/components/HeaderComponent";

const inter = Inter({ subsets: ["latin"] });

export const metadata = {
  title: "Weave Wager",
  description: "Create Secure Wagers with Friends on Arbtiturm",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        <Providers>
          <main>
            <HeaderComponent />
            {children}
          </main>
        </Providers>
      </body>
    </html>
  );
}
