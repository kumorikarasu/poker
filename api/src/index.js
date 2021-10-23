const express = require("express")
const app = express()
const port = 3000

// Add controller
var deck = require('./deck');
app.use('/deck', deck);

app.get('/', (req, res) => {
  res.send("Hello World!")
})

app.listen(port, () => {
  console.log("Example app listening at http://localhost:${port}")
})

