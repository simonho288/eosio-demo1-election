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

## Run the Webapp At Your Local PC

In addition to the above prerequisites, you'll need below software installed to run the webapp:

- Python 3.6+
- Pip3 9.0+
- (Virtualenv)[https://virtualenv.pypa.io/en/stable/installation/] 16+
- Npm 3.5+

Install the python3 & pip3

```bash
$ sudo apt-get update
$ sudo apt-get install python3.6
$ sudo apt-get -y install python3-pip
$ sudo pip install virtualenv
$ sudo apt-get install nodejs
$ sudo apt-get install npm
```

### Setup EOSIO

Start the EOSIO services

```bash
$ nodeos -e -p eosio --plugin eosio::wallet_api_plugin --plugin eosio::chain_api_plugin --plugin eosio::history_api_plugin --access-control-allow-origin=* --contracts-console
# Start a new Terminal session
$ keosd --http-server-address=localhost:8899
# Start a new Terminal session
$ alias cleos='~/eos/build/programs/cleos/cleos --wallet-url=http://localhost:8899'
```

### Create the default Wallet, Keypairs and Accounts

You'll required to create the wallet, keypairs and account At the first time. Type below commands:

```bash
$ cleos wallet create
# You must record the password
$ cleos create key
# You must record this owner key
$ cleos create key
# You must record this active key
$ cleos wallet import ${private_owner_key}
$ cleos wallet import ${private_active_key}
```

Import eosio account's private key

```bash
$ find ~ -name config.ini
$ nano ~/.local/share/eosio/nodeos/config/config.ini
# find the private key at the end of setting signature-provider
$ cleos wallet import ${private_eosio_key}
```

Create the `election` account

```bash
$ cleos create account eosio election ${public_owner_key} ${public_active_key}
```

### Config and run the WebApp

Before run the webapp, you'll need to create an EOSIO config file `webapp/eosio-config.ini`. Then put your EOSIO keys & passwords in there:

```ini
[DEFAULT]
WALLET_PASSWORD = ${your_default_wallet_password}
PUBLIC_OWNER_KEY = ${your_public_owner_key}
PUBLIC_ACTIVE_KEY = ${your_public_active_key}
```

Run the local Testnet (nodeos):

```bash
$ nodeos -e -p eosio --plugin eosio::wallet_api_plugin --plugin eosio::chain_api_plugin --plugin eosio::history_api_plugin --access-control-allow-origin=* --contracts-console
```

Install the python dependencies in the first time:

```bash
$ git clone https://github.com/simonho288/eosio-demo1-election
$ cd webapp
$ source venv/bin/activate
$ pip install -r requirements.txt
```

Start the web server:

```bash
$ npm start
```

Browse the `http://localhost:5000` to run the demo.

## License

The MIT License (MIT)

Copyright (c) 2018 Simon Ho

Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the "Software"), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
