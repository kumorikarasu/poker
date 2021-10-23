
var groupBy = function(xs, key) {
  return xs.reduce(function(rv, x) {
    (rv[x[key]] = rv[x[key]] || []).push(x);
    return rv;
  }, []).filter(x => x);
};

function calcHand(cards) {
  
  if (cards.length != 5) return 0; //5 cards are required to give a hand any worth

	// bitshift abunch to ensure out value has much higher value, and its easy to revert back
  value = (calcOuterValue(cards) << 20) // each card takes 4 bits, 5 cards means we shift 20 times
  value += calcInnerValue(cards)

  return value;
}

// calcOuterValue

// High Card : 12
// Pair 		 : 20
// 2 Pair    : 24
// 3 Set     : 28
// Straight  : 30
// Flush     : 31
// Full House: 32
// 4 Set     : 36
// Straight F: 41
function calcOuterValue(cards) {
	// Sort descending
  cards.sort((a,b) => b.n - a.n) 

  // grouby to find pairs, and sort by longest array
  cardGroups = groupBy(cards, "n").sort((a, b) => b.length - a.length );
  
  // We will always have atleast 2 groups with 5 cards
  outerval = (cardGroups[0].length * 2 + cardGroups[1].length) << 2
  
  // fold the array to calc a flush, if a single suit doesn't match, the resulting string will 
  // be greater then 1. We use the first bit as a flush flag
  outerval |= cards.reduce((a, n) => {
    return n.s === a ? n.s : n.s + a
  }, "").length == 1
  
  // If flush flag is set, add 18
  outerval += (outerval & 1) * 18

  // calculate straight. Includes edge case of Ace High/Low. Add 18 if straight
  outerval += cards[0].n - cards[4].n == 4 ? 18 
		: (cards[0].n == 14 && cards[1].n == 5) ? 18 : 0
 
  return outerval
}

// The Inner value only takes actual card values into account, by making the outer value
// a very large number, the inner value would only matter in tie breaker situations
function calcInnerValue(cards) {
	// Sort descending
  cards.sort((a,b) => b.n - a.n);
  
  var inner = cards.reduce((total, next) => {
    console.log(next)
    // 14 = 4 bits. we bitshift to ensure each set of 4 is larger then the previous
    return ((total << 4) + next.n)
	}, 0);

	return inner;
}

// [[[ Controller
var express = require('express'),
    app = require('./app.js'),
    router = express.Router();
    
router
  .get('/', (req, res) => {
    deck = req.app.locals.deck
    res.send(deck.cards());
  })
  // Add a binding to handle '/tests'
  .post('/worth', (req, res) => {
    deck = req.app.locals.deck
    res.send("" + calcHand(req.body));
  })

module.exports = router;
/// ]]]
