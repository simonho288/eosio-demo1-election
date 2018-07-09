const express = require('express')
const app = express()

// Serving static files (html, js, css)
app.use(express.static('frontend'))

// RESTful API
app.get('/api/test', (req, res) => {
  res.setHeader('Content-Type', 'application/json')
  res.json({version: '1.0'})
})

const PORT = 8080
app.listen(PORT, () => {
  console.log('Server running on port', PORT)
})
