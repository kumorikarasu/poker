// Disclamer, I am not a frontend developer, this is as basic as it could be

var deck = []
var hand = {}

function NewDeck () {
  var apiUrl = '/api/deck/new';
  fetch(apiUrl).then(response => {
    return response.json();
  }).then(data => {
    deck = data;
    $('#cards').html(deck.length)
  }).catch(err => {
  });
}

function GetDeck() {
  var apiUrl = '/api/deck';
  fetch(apiUrl).then(response => {
    return response.json();
  }).then(data => {
    deck = data;
    $('#cards').html(deck.length)
  }).catch(err => {
  });
}

function ShuffleDeck () {
  var apiUrl = '/api/deck/shuffle';
  fetch(apiUrl).then(response => {
    return response.json();
  }).then(data => {
    deck = data;
    $('#cards').html(deck.length)
  }).catch(err => {
  });
}

function GetHandValue(handNumber, cb) {
  console.log(hand[handNumber]);

  var apiUrl = '/api/hand/worth';
  fetch(apiUrl, {
      method: "post",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(hand[handNumber])
  }).then(response => {
    return response.json();
  }).then(data => {
    hand[handNumber].worth = data
    console.log(hand)
    cb(data)
  }).catch(err => {
  });
}

function Hand(handNumber) {
  var apiUrl = '/api/deck/draw/5';
  fetch(apiUrl).then(response => {
    return response.json();
  }).then(data => {
    hand[handNumber] = data
    for(var i = 0; i < 5; i++){
      $("#" + handNumber + i).attr('src', "img/" + hand[handNumber][i].n + hand[handNumber][i].s + ".png");
    }
    console.log(hand)
    GetDeck()
  }).catch(err => {
  });
}

function ShowWinner() {
  if (hand["tc"] === undefined || hand["bc"] === undefined) {
    $("#winner").html("Missing Hands!")
    return 0;
  }

  GetHandValue("tc", (top) => {
    GetHandValue("bc", (bottom) => {
      $("#winnerdbg").html(top + " VS " + bottom);
      if (top > bottom) {
        $("#winner").html("Top Wins!");
      } else {
        $("#winner").html("Bottom Wins!");
      }

    })
  })

}

GetDeck()
