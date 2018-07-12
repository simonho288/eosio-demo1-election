'use strict'

let fetch = require('node-fetch')

let { Keystore, Keygen } = require('eosjs-keygen')
const EOSJS = require('eosjs')
const ecc = require('eosjs-ecc')

const NODEOS_URL = 'http://127.0.0.1:8888'
const DEFAULT_WALLET_PWD = 'PW5K1UDpYnN2CG96M27sP7Sjab4JMu3mHrnSPdcog8UiJJwy33NaG'

async function createWallet() {
  return new Promise(async (resolve, reject) => {
    let opts = {
      method: 'POST',
      body: '"default"'
    }
    let res = await fetch(NODEOS_URL + '/v1/wallet/create', opts)
    let json = await res.json()
    // console.log(json)
    if (json.error) {
      reject(json.error)
    } else {
      resolve(json)
    }
  })
}

async function openWallet() {
  return new Promise(async (resolve, reject) => {
    let opts = {
      method: 'POST',
      body: '"default"'
    }
    let res = await fetch(NODEOS_URL + '/v1/wallet/open', opts)
    let json = await res.json()
    // console.log(json)
    if (json.error) {
      reject(json.error)
    } else {
      resolve(json)
    }
  })
}

async function unlockWallet() {
  return new Promise(async (resolve, reject) => {
    let opts = {
      method: 'POST',
      body: JSON.stringify([
        "default",
        DEFAULT_WALLET_PWD
      ])
    }
    let res = await fetch(NODEOS_URL + '/v1/wallet/unlock', opts)
    let json = await res.json()
    // console.log(json)
    if (json.error) {
      reject(json.error)
    } else {
      resolve(json)
    }
  })
}

async function listWallet() {
  return new Promise(async (resolve, reject) => {
    let res = await fetch(NODEOS_URL + '/v1/wallet/list_wallets')
    let json = await res.json()
    // console.log(json)
    if (json.error) {
      reject(json.error)
    } else {
      resolve(json)
    }
  })
}

async function setWalletTimeout() {
  return new Promise(async (resolve, reject) => {
    let opts = {
      method: 'POST',
      body: '30' // 10 seconds
    }
    let res = await fetch(NODEOS_URL + '/v1/wallet/set_timeout', opts)
    let json = await res.json()
    // console.log(json)
    if (json.error) {
      reject(json.error)
    } else {
      resolve(json)
    }
  })
}

async function walletImportKeys(ownerKey, activeKey) {
  let param = JSON.stringify([
    "default",
    ownerKey,
    activeKey
  ])
  console.log('param: ' + param)
  return new Promise(async (resolve, reject) => {
    let opts = {
      method: 'POST',
      body: param
    }
    let res = await fetch(NODEOS_URL + '/v1/wallet/import_key', opts)
    let json = await res.json()
    // console.log(json)
    if (json.error) {
      reject(json.error)
    } else {
      resolve(json)
    }
  })
}

async function genKeys() {
  return new Promise(async (resolve, reject) => {
    let keys = await Keygen.generateMasterKeys()
    console.log(keys)
    let result = await walletImportKeys(keys.privateKeys.owner, keys.privateKeys.active)
    const ACCOUNT_NAME = 'myaccount'

    let sessionConfig = {
      timeoutInMin: 30,
      uriRules: {
        'owner' : '/account_recovery',
        'active': '/(transfer|contracts)',
        'active/**': '/producers'
      }
    }

    let keystore = Keystore(ACCOUNT_NAME, sessionConfig)
    let eosConfig = {
      // chainId: null, // 32 byte (64 char) hex string
      keyProvider: [
        // keys.masterPrivateKey,
        keys.privateKeys.owner,
        keys.privateKeys.active
      ],
      httpEndpoint: NODEOS_URL,
      expireInSeconds: 60,
      verbose: false, // API activity
      logger: { error: null }
    }

    let eos = EOSJS(eosConfig)
    // resolve(keys)

    eos.getAccount(ACCOUNT_NAME).then(account => {
      console.log(account)
      // keystore.deriveKeys({
      //   parent: keys.masterPrivateKey,
      //   accountPermissions: account.permissions
      // })
    })
  })
}

async function main() {
  let result
  try {
    result = await createWallet()
    console.log(result)
  } catch (exp) {
    // console.log('*** Exception ***')
    // console.log(exp)
  }

  try {
    result = await openWallet()
    console.log(result)
    result = await unlockWallet()
    console.log(result)
    result = await listWallet()
    console.log(result)
    result = await setWalletTimeout()
    console.log(result)
    result = await genKeys()
    console.log(result)
    // result = await walletImportKeys(result.privateKeys.owner, result.privateKeys.active)

    // keystore = Keystore('myaccount', sessionConfig)
  } catch (exp) {
    console.log('*** Exception ***')
    console.log(exp)
  }
}

main()