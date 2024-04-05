// Api key and url
const apiKey = "4c07c4c445c79be39d62b142835b41b4";
const apiUrl = "https://api.openweathermap.org/data/2.5/weather?units=metric";

// DOM selectors
const searchBtn = document.querySelector(".btn");
const searchInput = document.querySelector("#search");
const weatherDisplay = document.querySelector(".weather");
const errorDisplay = document.querySelector(".error");
const geolocationBtn = document.getElementById("gpsBtn"); // Updated

// Function to fetch weather data by city name and API
async function fetchWeatherData(city) {
  const url = `${apiUrl}&appid=${apiKey}&q=${city}`;
  const response = await fetch(url);
  if (!response.ok) {
    throw new Error("City not found");
  }
  return response.json();
}

// Function to fetch weather data by coordinates
async function fetchWeatherDataByCoords(latitude, longitude) {
  const url = `${apiUrl}&appid=${apiKey}&lat=${latitude}&lon=${longitude}`;
  const response = await fetch(url);
  if (!response.ok) {
    throw new Error("Weather data not available for your location.");
  }
  return response.json();
}

// Function to handle display weather info
function displayWeatherData(data) {
  const iconCode = data.weather[0].icon;
  weatherDisplay.style.display = "block";
  errorDisplay.style.display = "none";

  document.querySelector(".temp").innerHTML =
    Math.round(data.main.temp) + "&deg;C";
  document.querySelector(".city").innerHTML = data.name;
  document.querySelector(".humidity").innerHTML = data.main.humidity + "%";
  document.querySelector(".wind").innerHTML = data.wind.speed + " km/h";
  document.querySelector("#desc").innerHTML = data.weather[0].description;
  document.querySelector("#status").innerHTML = data.weather[0].main;

  const iconSrc = `https://openweathermap.org/img/wn/${iconCode}@4x.png`;
  document.querySelector(".weather-icon").src = iconSrc;
}

// Function to handle errors
function displayError(msg) {
  errorDisplay.style.display = "block";
  weatherDisplay.style.display = "none";
  errorDisplay.textContent = msg;
}

// Function to handle search value
async function weatherSearch() {
  const city = searchInput.value.trim();
  if (city) {
    try {
      const weatherData = await fetchWeatherData(city);
      displayWeatherData(weatherData);
    } catch (error) {
      displayError(error.message);
    }
  } else {
    displayError("Please enter a city name");
  }
}

// Function to get user's location and fetch weather data
function getUserLocation() {
  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(
      async function (position) {
        const latitude = position.coords.latitude;
        const longitude = position.coords.longitude;
        try {
          const weatherData = await fetchWeatherDataByCoords(
            latitude,
            longitude
          );
          displayWeatherData(weatherData);
        } catch (error) {
          displayError("Error fetching weather data based on your location.");
        }
      },
      function (error) {
        displayError("Error getting your location. Please try again later.");
      }
    );
  } else {
    displayError("Geolocation is not supported by your browser.");
  }
}

// Event listener for search button
searchBtn.addEventListener("click", weatherSearch);

// Event listener for enter key in search input
searchInput.addEventListener("keypress", function (event) {
  if (event.key === "Enter") {
    weatherSearch();
  }
});

// Event listener for actively searching by typing
searchInput.addEventListener("input", weatherSearch);

// Event listener for geolocation button
geolocationBtn.addEventListener("click", getUserLocation);
