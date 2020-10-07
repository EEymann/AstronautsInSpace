const astrosUrl = 'http://api.open-notify.org/astros.json';
const wikiUrl = 'https://en.wikipedia.org/api/rest_v1/page/summary/';
const peopleList = document.getElementById('people');
const btn = document.querySelector('button');

//We can get rid of the getJSON function entirely because the single fetch method is going to handle most of the tasks for us.

// function getJSON(url) {
//   return new Promise((resolve, reject) => {
//     const xhr = new XMLHttpRequest();
//     xhr.open('GET', url);
//     xhr.onload = () => {
//       if(xhr.status === 200) {
//         let data = JSON.parse(xhr.responseText);
//         resolve(data);
//       } else {
//         reject( Error(xhr.statusText) );
//       }
//     };
//     xhr.onerror = () => reject( Error('A network error occured'))
//     xhr.send();
//   });
// }

function getProfiles(json) {
  const profiles = json.people.map( person => {
    const craft = person.craft;
    return fetch(wikiUrl + person.name)
      .then(response => response.json())
      .then(profile => {
        return {...profile, craft};
    })
      .catch(err => console.log('Error Fetching Wiki: ', err))
  });
  return Promise.allSettled(profiles); //Promise.all waits on all the individual promise objects then joins them into one and returns a value when all specified promises are fulfilled.
}

function generateHTML(data) {
  data.map(person => {
    const section = document.createElement('section');
    peopleList.appendChild(section);
    if (person.value.type === "standard") {
      section.innerHTML = `
      <img src=${person.value.thumbnail.source}>
      <span>${person.value.craft}</span>
      <h2>${person.value.title}</h2>
      <p>${person.value.description}</p>
      <p>${person.value.extract}</p>`;
    } else {
      section.innerHTML = `
      <h2>${person.title}</h2>
      <p>No description available</p>`;
    }
  })
}



btn.addEventListener('click', (event) => {
  event.target.textContent = 'Loading...'

  //The fetch method itself returns a promise, and once fetch makes the request and the data finishes loading, the fetch promise is fulfilled.
  //It also returns a response object containing info about the response like the status code and the corresponding status message.
  //In order to access and use the data, we need to parse it to JSON first.
  fetch(astrosUrl)
    .then(response => response.json()) //returns a promise and gets passed on to getProfiles.
    .then(getProfiles)
    .then(generateHTML)
    .catch(err => {
      peopleList.innerHTML = '<h3>Something went wrong! Please reload the page and try again.</h3>';
      console.log(err);
    })
    .finally(() => event.target.remove());
});
