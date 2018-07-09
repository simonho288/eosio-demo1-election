const express = require('express')
const app = express()
const EosObj = require("./eos_obj.js")

let eosWrapper = new EosObj()

// Serving static files (html, js, css)
app.use(express.static('frontend'))

// RESTful API
app.get('/api/version', async (req, res) => {
  res.setHeader('Content-Type', 'application/json')
  let status = await eosWrapper.version()
  res.json(status)
})

app.get('/api/candidates', async (req, res) => {
  res.setHeader('Content-Type', 'application/json')
  let result = await eosWrapper.getCandidateTable()
  res.json(result.rows)
})

async function main() {
  let status = await eosWrapper.init()
  if (!status) {
    throw new Error('EosObj initialize failed!')
  }

  status = await eosWrapper.loadContract()
  if (!status) {
    throw new Error('EosObj contract load failed!')
  }

  status = await eosWrapper.resetElection()
  if (!status) {
    throw new Error('Candidates create failed!')
  }

  status = await eosWrapper.createCandidates()
  if (!status) {
    throw new Error('Candidates create failed!')
  }

  const PORT = 8080
  app.listen(PORT, () => {
    console.log('Server running on port', PORT)
  })
}

main();
