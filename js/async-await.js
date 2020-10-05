const astrosUrl = 'http://api.open-notify.org/astros.json';
const wikiUrl = 'https://en.wikipedia.org/api/rest_v1/page/summary/';
const peopleList = document.getElementById('people');
const btn = document.querySelector('button');

// Handle all fetch requests


// Generate the markup for each profile
function generateHTML(data) {
  data.map( person => {
    const section = document.createElement('section');
    peopleList.appendChild(section);
    section.innerHTML = `
      <img src=${person.thumbnail.source}>
      <span>${person.craft}</span>
      <h2>${person.title}</h2>
      <p>${person.description}</p>
      <p>${person.extract}</p>
    `;
  });
}

btn.addEventListener('click', (event) => {
  event.target.textContent = "Loading...";

});