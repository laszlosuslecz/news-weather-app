//API keys
const newsApiKey = '';
const darkSkyApiKey = '';

//methods for DOM manipulation
const createNode = (element) => document.createElement(element);
const appendChild = (parent, child) => parent.appendChild(child);

//methods used in fetch()
const json = (response) => {  
  return response.json()  
};


//--> NEWS

//e.g. mySource = 'reuters';
let mySource = 'cnn';

//HTML target
const ul = document.getElementById('news');

//fetching news and pushing to the DOM
const getNews = () => {
  ul.innerHTML = '';    
  fetch(`https://newsapi.org/v1/articles?source=${mySource}&sortBy=top&apiKey=${newsApiKey}`)
    .then(json)
    .then((data) => {
      const news = data.articles;
      news.forEach ((e) => { 
        let li = createNode('li'); 
        let h4 = createNode('h4');    
        let p = createNode('p');
        let a = createNode('a');
        h4.innerHTML = `${e.title}.<br>`; 
        p.innerHTML = `Published at: ${e.publishedAt}.`;
        a.innerHTML = `${e.url}`;
        a.setAttribute('href', `${e.url}`);
        a.setAttribute('target', '_blank')
        appendChild(ul, li);
        appendChild(li, h4);
        appendChild(li, p);
        appendChild(li, a);
      })
    })
    .catch((error) => {
      h4.innerHTML = 'I cannot reach the server. Please try it later!';
      appendChild(ul, h4);
    })    
};


//--> GEOCODE AND WEATHER

//empty geocode array. pushed latitude and longitude values used in fetch()
const geocode = [];

//Fahrenheit to Celsius
const getCelsius = (temp) => ((temp - 32) / (9/5)).toFixed(2);

//HTML target
const div = document.querySelector('.weather-results');

//new DOM elements
let p = createNode('p'); 
let h4 = createNode('h4');

//fetching geocode and weather data and pushing to the DOM
const getGeoLocation = () => {    
  let addressInput = document.getElementById('city-input');  
  fetch(`https://maps.googleapis.com/maps/api/geocode/json?address=${addressInput.value}`)
    .then(status)
    .then(json)
    .then ((data) => {
      geocode.push(data.results[0].geometry.location.lat, data.results[0].geometry.location.lng);
      fetch(`https://crossorigin.me/https://api.darksky.net/forecast/${darkSkyApiKey}/${geocode[0]},${geocode[1]}`)
        .then(json)
        .then((data) => {  
        let temperature = getCelsius(data.currently.temperature);   
        p.innerHTML = `${temperature} °C <br> ${data.currently.summary}`;
        appendChild(div, p);  
      })
      geocode.splice(0, 2);
      addressInput.value = '';
    })
    .catch((error) => {
      h4.innerHTML = 'Ooops. No data from server. Please check your input!';
      appendChild(div, h4);;
      addressInput.value = '';
    })
};

//user input form 
const form = document.getElementById('city-form');

//event listener for user input (click or enter)
form.addEventListener('submit', (e) => {
  e.preventDefault();    
  getGeoLocation();
  p.innerHTML = '';
  h4.innerHTML = '';    
}) 