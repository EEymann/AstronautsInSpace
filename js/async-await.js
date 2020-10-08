const astrosUrl = 'http://api.open-notify.org/astros.json';
const wikiUrl = 'https://en.wikipedia.org/api/rest_v1/page/summary/';
const peopleList = document.getElementById('people');
const btn = document.querySelector('button');

// Handle all fetch requests
// This function is going to first make a fetch request to the open notify API,
// then use those results to make fetch requests to the Wikipedia API.
//The function takes the parameter URL, for the url to fetch.
//In the body of the function, we'll start by making the first network request using the fetch method.
//It will be to the open notify API to get the names of the people in space.
//Fetch returns a promise. The await keyword waits for a resolved promise returned by fetch.
//Then it's going to get the fulfillment value out of the promise and assign it to peopleResponse.
// const peopleJSON = peopleResponse.json();  parses the response from Fetch to JSON.
async function getPeopleInSpace(url) { //fetches url
  const peopleResponse = await fetch(url); //await the response,
  const peopleJSON = await peopleResponse.json(); //read the response and await the JSON.

  const profiles = peopleJSON.people.map( async person => {
    const craft = person.craft;
    const profileResponse = await fetch(wikiUrl + person.name);
    const profileJSON = await profileResponse.json();

    return { ...profileJSON, craft};
  });
    return Promise.all(profiles);
}

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

btn.addEventListener('click', async (event) => {
  event.target.textContent = "Loading...";

  const astros = await getPeopleInSpace(astrosUrl);
  generateHTML(astros);
  event.target.remove();
});
