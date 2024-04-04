# Weave Wager - Place Wagers on Sport Matches Safely and Securely

## Introduction

Weave Wager is a decentralized application built on the [Arbitrum Layer 1 Ecosystem](https://arbitrum.io/) and using [WeaveDB](https://weavedb.dev/) as a decentralized Databse Solution.

## Features

- **Creation of Wagers**: Users can create wagers on Upcomming games easily, and choose the stake amount and max number of participants.
- **Sharing of Created Wagers**: Users can share wagers with friends who they want to wager with, all they have to do is copy and share the wager link.
- **Secure Transactions**: All transactions are secured using blockchain technology, ensuring that wagers are fair and transparent.
- **Private Predictions**: All predictions are kept private since they are sent to the WeaveDB Decentralized Database.

## Weave DB

WeaveDB is a decentralized database solution that we used extensively in this project. In an application like Weave Wager, it's crucial to keep users' predictions private. Storing these predictions on-chain would make them public, which is not ideal for our use case.

WeaveDB comes into play here. With its robust access controls, we can store users' predictions securely while still maintaining the decentralization that a blockchain provides. This ensures that while the data is secure and private, it's still transparent and verifiable, which is a key aspect of decentralized applications.

### Arbitrum

Arbitrum is an Ethereum Layer 2 scaling solution that we used to build our decentralized application (DApp). One of the main advantages of Arbitrum is that it's fully compatible with Ethereum. This means that developing a DApp on Arbitrum is as straightforward as developing one on Ethereum.

Another significant advantage of Arbitrum is its low gas fees. Ethereum's high gas fees can be a barrier to entry for many users. By using Arbitrum, we can offer our users the same functionality as an Ethereum DApp but at a fraction of the cost. This makes Weave Wager more accessible to a wider audience.

### Other Tech Used

- Solidity
- Hardhat
- NextJS
- NodeJS

### Future Considerations

- **Secure and Automated Winning Distributions**: Hopefully I can get the WeaveDB CRON Job working, to automatically update the winners of each wagers depending on if the result of that game has been updated (the game has ended), but for now users will have to resolve Wagers themselves.
- **Fees on Wagers**: Fees can be added after a wager is completed, that gives the DAPP a percentage of the total stake before winnings are distributed.

### CODE

- Contract Code in `./contract`
- Frontend Code in `./frontend-nextjs`
- WeaveDB Configurations in `weave-db`
