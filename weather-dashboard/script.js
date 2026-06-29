const cityInput = document.getElementById("cityInput");
const searchBtn = document.getElementById("searchBtn");

const cityName = document.getElementById("cityName");
const temperature = document.getElementById("temperature");
const humidity = document.getElementById("humidity");
const windSpeed = document.getElementById("windSpeed");

const weatherCard = document.getElementById("weatherCard");
const loader = document.getElementById("loader");
const errorMessage = document.getElementById("errorMessage");

searchBtn.addEventListener("click", searchWeather);

cityInput.addEventListener("keydown", (event) => {
    if (event.key === "Enter") {
        searchWeather();
    }
});

async function searchWeather() {

    const city = cityInput.value.trim();

    if (!city) {
        showError("Please enter a city name.");
        return;
    }

    loader.classList.remove("hidden");
    weatherCard.classList.add("hidden");
    errorMessage.textContent = "";

    try {

        const locationResponse = await fetch(
            `https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(city)}&count=1`
        );

        if (!locationResponse.ok) {
            throw new Error("Unable to connect to the location service.");
        }

        const locationData = await locationResponse.json();

        if (!locationData.results || locationData.results.length === 0) {
            throw new Error("City not found.");
        }

        const location = locationData.results[0];

        const weatherResponse = await fetch(
            `https://api.open-meteo.com/v1/forecast?latitude=${location.latitude}&longitude=${location.longitude}&current=temperature_2m,relative_humidity_2m,wind_speed_10m`
        );

        if (!weatherResponse.ok) {
            throw new Error("Unable to retrieve weather data.");
        }

        const weatherData = await weatherResponse.json();

        displayWeather(location, weatherData.current);

    } catch (error) {

        showError(error.message);

    } finally {

        loader.classList.add("hidden");

    }

}

function displayWeather(location, current) {

    cityName.textContent = `${location.name}, ${location.country}`;

    temperature.textContent = `${Math.round(current.temperature_2m)} °C`;

    humidity.textContent = `${current.relative_humidity_2m}%`;

    windSpeed.textContent = `${current.wind_speed_10m} km/h`;

    weatherCard.classList.remove("hidden");

}

function showError(message) {

    weatherCard.classList.add("hidden");
    errorMessage.textContent = message;

}
