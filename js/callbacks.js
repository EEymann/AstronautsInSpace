const astrosUrl = 'http://api.open-notify.org/astros.json';
const wikiUrl = 'https://en.wikipedia.org/api/rest_v1/page/summary/';
const peopleList = document.getElementById('people');
const btn = document.querySelector('button');

// Make an AJAX request
function getJSON(url, callback) {
  const xhr = new XMLHttpRequest();
  xhr.open('GET', url);
  xhr.onload = () => {
    if(xhr.status === 200) {
      let data = JSON.parse(xhr.responseText);
      return callback(data);
    }
  };
  xhr.send();
}

// Generate the markup for each profile
function generateHTML(data) {
  const section = document.createElement('section');
  peopleList.appendChild(section);
  section.innerHTML = `
    <img src=${data.thumbnail.source}>
    <h2>${data.title}</h2>
    <p>${data.description}</p>
    <p>${data.extract}</p>
  `;
}

btn.addEventListener('click', () => getJSON(astrosUrl));

//Call the getJSON function and pass it the URL to the open notify API.
getJSON(astrosUrl);

//Create an event listener for the button to invoke the getJSON function
btn.addEventListener('click', (event) => {
  getJSON(astrosUrl, (json) => {
    json.people.map( person => {
      getJSON(wikiUrl + person.name, generateHTML);
    });
  });
  event.target.remove();
});
