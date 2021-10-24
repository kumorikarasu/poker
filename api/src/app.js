const bodyParser = require('body-parser');
const express = require("express")
const app = module.exports = express();
const port = 3000

// Middleware to handle json payloads
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

// Add controller
app.use('/deck', require('./deck'));
app.use('/hand', require('./hand'));

app.listen(port, () => {
  console.log("Poker API server running")
})

