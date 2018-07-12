'use strict'

const EOSJS = require('eosjs')

const NODEOS_URL = 'http://127.0.0.1:8888'
const OWNER_KEY = 'EOS6G2Lhi7zvrDLQSW1Yyp4orTNTzB5HJLBWsQ6VZ5DHVQP33ZUh4'
const ACTIVE_KEY = 'EOS6mRVucgY4np6kw5YDEUpEnEhXLfGadMxrWmjUCZkjbFuWWtF2T'

// Default configuration (additional options below)
let eosConfig = {
  chainId: null, // 32 byte (64 char) hex string
  keyProvider: [
    '5KRVYUrZcmB1qoeFAvpp2a85SAm3XmMSqgnLESYmd84JwiAqxW2',
    '5JEB7rnBLjgrSqDWd2FgGkMXb5Bv8c7ZFCakPHunUUWU2Dh2UPc'
  ], // WIF string or array of keys..
  httpEndpoint: NODEOS_URL,
  expireInSeconds: 60,
  verbose: false, // API activity
  logger: { error: null }
}

module.exports = class EosObj {
  constructor() {
    this._eosJs = EOSJS(eosConfig)
  }

  async init() {
    return new Promise(async (resolve, reject) => {
      let info = await this._eosJs.getInfo({}) // Obtain the chainId
      // console.log(info)
      eosConfig.chainId = info.chain_id
      this._eosJs = EOSJS(eosConfig)
      resolve(true)
    })
  }

  async loadContract() {
    return new Promise(async (resolve, reject) => {
      this._contract = await this._eosJs.contract('election')
      resolve(true)
    })
  }

  async version() {
    return new Promise(async (resolve, reject) => {
      let result = await this._contract.version({authorization: ['election']})
      resolve(result)
    })
  }

  async resetElection() {
    return new Promise(async (resolve, reject) => {
      let result = await this._contract.reset({authorization: ['election']})
      resolve(result)
    })
  }

  async createCandidates() {
    return new Promise(async (resolve, reject) => {
      let result = await this._contract.addc('Hillary Clinton', {authorization: ['election']})
      result = await this._contract.addc('Donald J. Trump', {authorization: ['election']})
      resolve(result)
    })
  }

  async getCandidateTable() {
    return new Promise(async (resolve, reject) => {
      let result = await this._eosJs.getTableRows(true, 'election', 'election', 'candidate')
      resolve(result)
    })
  }

  async createAccountByName(name) {
    return new Promise(async (resolve, reject) => {
      // Create a new account, which the name is current time
      let accountName = Date.now().toString()
      // EOS allows 12 characters only. So here get the last 12 chars
      accountName = accountName.substring(1, accountName.length)
      // Numeric to alphabetic chars
      let accountName2 = ''
      for (let i = 0; i < accountName.length; ++i) {
        let n = accountName.charCodeAt(i) - 48
        accountName2 += String.fromCharCode(n + 97)
      }
      this._eosJs.newaccount({
        creator: 'eosio',
        name: accountName2,
        authorization: [{
          actor: 'eosio',
          permission: 'active'
        }],
        owner: {
          threshold: 1,
          keys: [{
            key: OWNER_KEY,
            weight: 1
          }],
          accounts: [],
          waits: []
        },
        active: {
          threshold: 1,
          keys: [{
            key: ACTIVE_KEY,
            weight: 1
          }],
          accounts: [],
          waits: []
        }
      })
      resolve(accountName2)
    })
  }
}
