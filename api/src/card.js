// [[[ Model
function Card (s, n) {
  var suit = s
  var numb = n
  
  return {n, s}
}

Suits = ['S', 'D', 'C', 'H']

function CardValueToText(value) {
  value = value & 0xf
  if (value > 10){
    switch(value){
    case 11:
        return "Jack"
    case 12:
        return "Queen"
    case 13:
        return "King"
    case 14:
        return "Ace"
    }
  }
  return "" + value
}
  

module.exports = { Card, Suits, CardValueToText }
// ]]]

