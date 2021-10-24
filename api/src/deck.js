var Cards = require("./card.js")

// [[[ Model
function Deck() {
  var cards = [];

  let deck = {
    order: () => {
      cards = [];
      Cards.Suits.forEach(x => {
        var start = 1, end = 13, a = 0
        if (x === 'C' || x === 'H'){
          start = -13, end = -1
        }

        for(var i=start; i <= end; i++){
          Math.abs(i) === 1 ? a = 13 : a = 0 // Aces we want first in a new deck, but last in value
          cards.push(Cards.Card(x, Math.abs(i)+a))
        }
      })

      return deck
    },

    shuffle: () => {
      for (let i = cards.length - 1; i > 0; i--) {
        // Note: Insecure random, not hack proof
        const j = Math.floor(Math.random() * (i + 1)); 
        [cards[i], cards[j]] = [cards[j], cards[i]];
      }

      return deck
    },

    //get
    cards: () => { return cards}
  }
  return deck
}
// ]]]

// [[[ Controller
var express = require('express'),
    app = require('./app.js'),
    router = express.Router();

// [ WARNING LOCAL STATE - This is only temporary for the example of this app
// This must be moved to a database if future work is to be done
app.locals.deck = Deck().order();
// ]


router
  // Add a binding to handle '/tests'
  .get('/shuffle', (req, res) => {
    deck = req.app.locals.deck
    res.send(deck.shuffle().cards());
  })

  .get('/new', (req, res) => {
    deck = req.app.locals.deck
    res.send(deck.order().cards());
  })

  .get('/', (req, res) => {
    deck = req.app.locals.deck
    res.send(deck.cards());
  })

  .get('/length', (req, res) => {
    deck = req.app.locals.deck
    res.send("" + deck.cards().length);
  })

  // Note: Draw functions will not work if there are no cards left, it will not give an error, it will just return nothing
  .get('/draw/:amount', (req, res) => {
    deck = req.app.locals.deck
    res.send(deck.cards().splice(0, req.params.amount));
  })

  .get('/draw', (req, res) => {
    deck = req.app.locals.deck
    res.send(deck.cards().pop());
  })

 
module.exports = router;

// ]]]
