// JS Code
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
