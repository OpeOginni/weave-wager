import type { HardhatUserConfig } from "hardhat/config";
import "@nomicfoundation/hardhat-toolbox";
import dotenv from "dotenv";

dotenv.config();

const Sepolia_TESTNET_PRIVATE_KEY = process.env
  .Sepolia_TESTNET_PRIVATE_KEY as string;
const ARBITRUM_MAINNET_TEMPORARY_PRIVATE_KEY = process.env
  .ARBITRUM_MAINNET_TEMPORARY_PRIVATE_KEY as string;

const config: HardhatUserConfig = {
  solidity: "0.8.24",
  networks: {
    hardhat: {
      chainId: 1337,
    },
    arbitrumSepolia: {
      url: "https://sepolia-rollup.arbitrum.io/rpc",
      chainId: 421614,
      accounts: [Sepolia_TESTNET_PRIVATE_KEY],
    },
    arbitrumOne: {
      url: "https://arb1.arbitrum.io/rpc",
      accounts: [ARBITRUM_MAINNET_TEMPORARY_PRIVATE_KEY],
    },
  },
};

export default config;
