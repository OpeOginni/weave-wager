# Weave Wager - Place Wagers on Sport Matches Safely and Securely

## Introduction

Weave Wager is a decentralized application built on the [Arbitrum Layer 1 Ecosystem](https://arbitrum.io/) and using [WeaveDB](https://weavedb.dev/) as a decentralized Databse Solution.

## Features

- **Creation of Wagers**: Users can create wagers on Upcomming games easily, and choose the stake amount and max number of participants.
- **Sharing of Created Wagers**: Users can share their wagers with friends who they want to wager with, all they have to do is copy and share the wager link.
- **Private Predictions**: All predictions are kept private since they are sent to the WeaveDB Decentralized Databse.
- **Secure Winning Distributions**: After Matches are completed WeaveDB CRON jobs update the winners of each wager depending on the actual score of the match and the different predictions made. Then a backend endpoint calls the `resolveWager` function and sends all the winnings to the correct winner addresses.

### Tech Used

- Solidity
- Hardhat
- NextJS
- WeaveDB
- NodeJS
