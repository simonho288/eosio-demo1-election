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

## License

The MIT License (MIT)

Copyright (c) 2018 Simon Ho

Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the "Software"), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
