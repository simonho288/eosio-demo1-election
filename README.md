# EOSIO Blockchain dApp Steps-by-Steps

## Introduction

This repo hosts the source codes for [my blog post](https://blog.simonho.net/eosio-dapp-blockchain-2/). This includes the source code of the EOSIO Smart Contract mentioned in the blog post which to simulate an election.

## Prerequisites

You'll need to setup the EOSIO development environment before compiling the smart contract. Please refer [this blog post](https://blog.simonho.net/eosio-dapp-blockchain-1/) for the steps-by-steps setup.

### Compile the Smart Contract

Type below commands to generate the WAST & ABI file:

```bash
$ eosiocpp -o election.wast election.cpp
$ eosiocpp -g election.abi election.cpp
```

### Deploy and run the Smart Contract

This requires several steps to create keypairs and accounts before deploying the Smart Contract. Please refer to [the blog post](https://blog.simonho.net/eosio-dapp-blockchain-2/) for steps-by-steps description. It guides you to run the smart contract on your machine successfully.

