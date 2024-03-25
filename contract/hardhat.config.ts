import type { HardhatUserConfig } from 'hardhat/config';
import '@nomicfoundation/hardhat-toolbox';
import dotenv from 'dotenv';

dotenv.config();

const SEPOLIA_TESTNET_PRIVATE_KEY = process.env.Sepolia_TESTNET_PRIVATE_KEY as string;
const ARBITRUM_MAINNET_TEMPORARY_PRIVATE_KEY = process.env.ARBITRUM_MAINNET_TEMPORARY_PRIVATE_KEY as string;

const ALCHEMY_API_KEY = process.env.ALCHEMY_API_KEY as string;
const ETHERSCAN_API_KEY = process.env.ETHERSCAN_API_KEY as string;

const config: HardhatUserConfig = {
  solidity: '0.8.25',
  networks: {
    hardhat: {
      chainId: 1337,
    },
    arbitrumSepolia: {
      url: 'https://sepolia-rollup.arbitrum.io/rpc',
      chainId: 421614,
      // accounts: [SEPOLIA_TESTNET_PRIVATE_KEY],
    },
    arbitrumOne: {
      url: 'https://arb1.arbitrum.io/rpc',
      // accounts: [ARBITRUM_MAINNET_TEMPORARY_PRIVATE_KEY],
    },
  },
  etherscan: {
    apiKey: {
      // arbitrumSepolia: ETHERSCAN_API_KEY,
      // arbitrumOne: ETHERSCAN_API_KEY
    },
  },
  ignition: {
    blockPollingInterval: 1_000,
    timeBeforeBumpingFees: 3 * 60 * 1_000,
    maxFeeBumps: 4,
    requiredConfirmations: 5,
  },
};

export default config;
