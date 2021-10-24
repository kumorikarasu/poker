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
  var apiUrl = '/api/hand/worth';
  fetch(apiUrl, {
      method: "post",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(hand[handNumber])
  }).then(response => {
    console.log(response)
    return response.json();
  }).then(data => {
    console.log(data)
    hand[handNumber].worth = data
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
    GetHandValue(handNumber, (hand) => {
      $("#" + handNumber + "msg").html(hand.msg);
    })
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

  var apiUrl = '/api/hand/comp';
  fetch(apiUrl, {
      method: "post",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify([hand["tc"], hand["bc"]])
  }).then(response => {
    return response.json();
  }).then(data => {
    if (data[0].handNumber == 0)
        $("#winner").html("Top Wins! \nwith " + data[0].msg);
    else
        $("#winner").html("Bottom Wins! \nwith " + data[0].msg);
    $("#winnerdbg").html(data);
  }).catch(err => {
  });

  return 0;
}

GetDeck()
