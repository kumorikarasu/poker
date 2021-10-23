// Disclamer, I am not a frontend developer, this is as basic as it could be

function NewDeck () {
    var apiUrl = '/api/deck/new';
    fetch(apiUrl).then(response => {
      return response.json();
    }).then(data => {
      // Work with JSON data here
      console.log(data);
    }).catch(err => {
      // Do something for an error here
    });
}

