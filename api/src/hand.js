//Inner Calculation Bit map
//1111000011110000111100001111
//  S1  S2  HC  4C  3C  2C  1C
//
// S1   = First set, either a pair or set
// S2   = Second set, for 2 pair
// HC   = Highest Card
// 4C.. = Rest of cards in order
//
// Outer Calculation Map
//
// High Card : 12
// Pair      : 20
// 2 Pair    : 24
// 3 Set     : 28
// Straight  : 30
// Flush     : 31
// Full House: 32
// 4 Set     : 36
// Straight F: 49
//


var Cards = require("./card.js")

// Simple groupby function used to collect pairs/sets
var groupBy = function(xs, key) {
  return xs.reduce(function(rv, x) {
    (rv[x[key]] = rv[x[key]] || []).push(x);
    return rv;
  }, []).filter(x => x);
};

function calcHand(cards) {
  
  if (cards.length != 5) return 0; //5 cards are required to give a hand any worth

  // bitshift abunch to ensure out value has much higher value, and its easy to revert back
  // each card takes 4 bits, 5 cards means we shift 20 times
  rtn = { inner: calcInnerValue(cards), outer: calcOuterValue(cards) }
  rtn.msg = HandToStr(rtn);

  return rtn;
}

function compHands(hands){
  calcHands = hands.map(x => calcHand(x) );
  calcHands.forEach((x, i) => x.handNumber = i);
  calcHands.sort((b,a) => { return a.outer - b.outer || a.inner - b.inner });

  console.log(calcHands)


  return calcHands
}

function calcOuterValue(cards) {
  // Sort descending
  cards.sort((a,b) => b.n - a.n) 

  // grouby to find pairs, and sort by longest array
  cardGroups = groupBy(cards, "n").sort((a, b) => b.length - a.length );
  
  // We will always have atleast 2 groups with 5 cards
  outerval = (cardGroups[0].length * 2 + cardGroups[1].length) << 2

  // Short circuit if we have pairs/sets
  if (outerval != 12) return outerval 
  
  // fold the array to calc a flush, if a single suit doesn't match, the resulting string will 
  // be greater then 1. We use the first bit as a flush flag
  console.log(outerval)
  outerval |= cards.reduce((a, n) => {
    return n.s === a ? n.s : n.s + a
  }, "").length == 1
  
  // If flush flag is set, add 18
  console.log(outerval)
  outerval += (outerval & 1) * 18

  // calculate straight. Includes edge case of Ace High/Low. Add 18 if straight
  outerval += cards[0].n - cards[4].n == 4 ? 18 
    : (cards[0].n == 14 && cards[1].n == 5) ? 18 : 0
  console.log(outerval)
 
  return outerval
}

// The Inner value only takes actual card values into account, by making the outer value
// a very large number, the inner value would only matter in tie breaker situations
function calcInnerValue(cards) {
  var inner = 0;
  
  // Sort descending
  cards.sort((a,b) => b.n - a.n);
  
  // Edge case for Ace Low
  if (cards[0].n == 14 && cards[1].n == 5) { cards[0].n = 1; cards.sort((a,b) => b.n - a.n);}

  // grouby to find pairs, get the first 2 sets only
  cardGroups = groupBy(cards, "n").sort((a, b) => b.length - a.length || b[0].n - a[0].n );
  console.log(cardGroups)
  cardGroups = cardGroups.splice(0, 2); 

  inner |= cardGroups.reduce((total, next) => {
    // 14 = 4 bits. we bitshift to ensure each set of 4 is larger then the previous
    // We only care about the first element in each group
    return ((total << 4) | next[0].n)
  }, 0);
  
  inner = (inner << 20) | cards.reduce((total, next) => {
    // 14 = 4 bits. we bitshift to ensure each set of 4 is larger then the previous
    return ((total << 4) | next.n)
  }, 0);

  return inner;
}

// [[[ Large function to take the numeric calculation of a hand to a text version
function HandToStr(calcHand) {
  var out = calcHand.outer
  var innerGroup = calcHand.inner >> 20 //Bitshift to groups
  console.log(calcHand)

  switch(out) {
    case 12:
      return Cards.CardValueToText(innerGroup >> 4) + " High"
    case 20:
      return "Pair of " + Cards.CardValueToText(innerGroup >> 4) + "s"
    case 24:
      return "Pair of " + Cards.CardValueToText(innerGroup >> 4) +
             "s and " + Cards.CardValueToText(innerGroup) + "s";
    case 28:
      return "Set of " + Cards.CardValueToText(innerGroup >> 4) + "s"
    case 30:
      return "Straight " + Cards.CardValueToText(calcHand.inner >> 16) + " High"
    case 31:
      return "Flush"
    case 32:
      return "Set of " + Cards.CardValueToText(innerGroup >> 4) +
             "s and Pair of " + Cards.CardValueToText(innerGroup) + "s";
    case 36:
      return "Four " + Cards.CardValueToText(innerGroup >> 4) + "s"
    case 49:
      return "Straight Flush " + Cards.CardValueToText(calcHand.inner >> 16) + " High"
  }

  //Should never get here
  return "Unkown Hand"
}
// ]]]



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
    res.send("" + JSON.stringify(calcHand(req.body)));
  })

  .post('/comp', (req, res) => {
    res.send("" + JSON.stringify(compHands(req.body)));
  })

module.exports = router;
/// ]]]
