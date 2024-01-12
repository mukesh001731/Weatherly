// JS Code Complelete it ASAP Mukesh, To start creating Content from 22nd Jan 
// Get the elements
const form = document.getElementById('search-form');
const cityInput = document.getElementById('city-input');
const button = document.getElementById('location-button');
const weatherData = document.getElementById('weather-data');

// Fetching function
function fetchWeather(city) {
    fetch(`http://api.openweathermap.org/data/2.5/forecast?q=${city}&appid=YOUR_API_KEY`)
    .then(response => response.json())
    .then(data => {
        if (data.cod == '404') {
            weatherData.innerHTML = 'Invalid city name';
            return;
        }
        displayWeather(data);
    })
    .catch(() => {
      weatherData.innerHTML = 'An error occurred';
    });
}

// Display data
function displayWeather(data) {
    const { city: { name }, list } = data;
    let output = `<h2>${name}</h2>`;
    output += list.slice(0,5).map(day => 
        `<p>
          Temp: ${day.main.temp} F<br>
          Humidity: ${day.main.humidity}<br>
          Wind: ${day.wind.speed} m/s
         </p>`
    ).join('');
    weatherData.innerHTML = output;
}

// Event listeners
form.addEventListener('submit', event => {
    event.preventDefault();
    fetchWeather(cityInput.value);
});

button.addEventListener('click', () => {
    if (!navigator.geolocation) {
      weatherData.innerHTML = 'Geolocation is not supported by your browser';
    } else {
      weatherData.innerHTML = 'Locating…';
      navigator.geolocation.getCurrentPosition(success, error);
    }
});

function success(position) {
    const { coords: { latitude, longitude } } = position;
    fetch(`http://api.openweathermap.org/data/2.5/forecast?lat=${latitude}&lon=${longitude}&appid=YOUR_API_KEY`)
    .then(response => response.json())
    .then(data => displayWeather(data))
    .catch(() => {
      weatherData.innerHTML = 'An error occurred';
    });
}

function error() {
  weatherData.innerHTML = 'Unable to retrieve your location';
}




// JS Code used for Real Project || Complelete it ASAP Mukesh, To start creating Content from 22nd Jan
document.getElementById('search-btn').addEventListener('click', function() {
  const city = document.getElementById('city').value;

  if (city === '') {
      alert('Please enter a city name or "current" for current location.');
      return;
  }

  fetchWeather(city);
});

function fetchWeather(city) {
  const apiKey = 'YOUR_API_KEY'; // Replace with your OpenWeatherMap API key
  const apiUrl = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}&units=metric`;

  fetch(apiUrl)
      .then(response => response.json())
      .then(data => displayWeather(data))
      .catch(error => console.error('Error:', error));
}

function displayWeather(data) {
  const { name } = data;
  const { temp, humidity } = data.main;
  const { description, icon } = data.weather[0];

  const weatherResults = `
      <h2>${name}</h2>
      <h3>${temp}°C</h3>
      <h4>${description}</h4>
      <h4>Humidity: ${humidity}%</h4>
      <img src="https://openweathermap.org/img/wn/${icon}@2x.png" alt="${description}">
  `;

  document.getElementById('weather-results').innerHTML = weatherResults;
}
