document.addEventListener("DOMContentLoaded", function () {
    const weather = {
        apiKey: "a4c012dd31b5bb5b3c2a78f87eff0621",

        fetchWeather: function (city) {
            fetch(
                "https://api.openweathermap.org/data/2.5/weather?q=" +
                city +
                "&units=metric&appid=" +
                this.apiKey
            )
                .then(response => {
                    if (!response.ok) {
                        alert("No weather found.");
                        throw new Error("No weather found.");
                    }
                    return response.json();
                })
                .then(data => {
                    this.displayWeather(data);
                    this.fetchUVIndex(data.coord.lat, data.coord.lon);
                });
        },

        fetchUVIndex: function (lat, lon) {
            const url = `https://api.openweathermap.org/data/3.0/onecall?lat=${lat}&lon=${lon}&exclude=minutely,hourly,daily,alerts&appid=${this.apiKey}`;
          
            fetch(url)
              .then(response => response.json())
              .then(data => {
                if (data.current && 'uvi' in data.current) {
                  const uvIndex = data.current.uvi;
                  document.querySelector(".title-uvvalue").innerText = uvIndex.toFixed(1) + " of 10";
                } else {
                  console.error('UV Index not available in the data response.');
                }
              })
              .catch(error => console.error('Error fetching UV Index:', error));
          },
          

        displayWeather: function (data) {
            const { name } = data;
            const { icon, description } = data.weather[0];
            const { temp, humidity, pressure } = data.main;
            const { speed: windSpeed } = data.wind;
            const dewPoint = calculateDewPoint(temp, humidity);

            document.querySelector(".city").innerText = "Weather in " + name;
            document.querySelector(".icon").src = "https://openweathermap.org/img/wn/" + icon + "@2x.png";
            document.querySelector(".description").innerText = description;
            document.querySelector(".temp").innerText = temp + "°C";

            const currentTime = new Date();
            document.querySelector(".time").innerText = currentTime.toLocaleTimeString();
            document.querySelector(".date").innerText = currentTime.toLocaleDateString();

            // Update Today's Forecast Section (.child-1)
            document.querySelector(".title-humivalue").innerText = humidity + "%";
            document.querySelector(".title-visivalue").innerText = (data.visibility / 1000).toFixed(1) + " km";
            document.querySelector(".title-pressurevalue").innerText = pressure + " mb";
            document.querySelector(".title-windvalue").innerText = windSpeed + " km/h";
            document.querySelector(".title-dewvalue").innerText = dewPoint + "°C";

            // Update Today's Weather Section (.child-2)
            const weatherWrappers = document.querySelectorAll(".weather-wrapper .title-1");
            const morningTemperature = Math.floor(temp - 2);
            const afternoonTemperature = Math.floor(temp + 2);
            const eveningTemperature = Math.floor(temp - 4);

            weatherWrappers[0].innerText = morningTemperature + "°C"; // Morning
            weatherWrappers[1].innerText = afternoonTemperature + "°C"; // Afternoon
            weatherWrappers[2].innerText = eveningTemperature + "°C"; // Evening
        },

        search: function () {
            this.fetchWeather(document.querySelector(".search-bar").value.trim());
        }
    };

    document.querySelector(".search button").addEventListener("click", function () {
        weather.search();
    });

    document.querySelector(".search-bar").addEventListener("keyup", function (event) {
        if (event.key === "Enter") {
            weather.search();
        }
    });

    weather.fetchWeather("Ahmedabad");

    function calculateDewPoint(temp, humidity) {
        const a = 17.27;
        const b = 237.7;
        const alpha = ((a * temp) / (b + temp)) + Math.log(humidity / 100);
        const dewPoint = (b * alpha) / (a - alpha);
        return parseFloat(dewPoint.toFixed(2)); // Ensures a numerical return value, formatted to 2 decimal places
    }
});
