const cityInput = document.querySelector(".city-input");
const searchButton = document.querySelector(".search-btn");
const currentWeatherDiv = document.querySelector(".current-weather");
const weatherCardsDiv = document.querySelector(".weather-cards");

const API_KEY = "fc12dd7814da64e2126aff11ebb18429";

const createWeatherCard = (cityName, weatherItem, index) => {
    if(index === 0) {
        return `<h2> ${cityName} ${weatherItem.dt_txt.split(" ")[0]}</h2>
                <h4>Temperature: ${(weatherItem.main.temp - 273.15).toFixed(2)}&deg;C</h4>
                <h4>Wind: ${weatherItem.wind.speed}M/S</h4>
                <h4>Humidity: ${weatherItem.main.humidity}</h4>
                </div>
                <div class="icon">
                <img src="Weather.png" alt="Weather">
                <h4>${weatherItem.weather[0].description}</h4>
                </div>`;

                

    } else{
        return `<li class="card">
            <h3>${weatherItem.dt_txt.split(" ")[0]}</h3>
            <img src="Weather.png" alt="Weather">
            <h4>Temp: ${(weatherItem.main.temp - 273.15).toFixed(2)}&deg;C</h4>
            <h4>Wind: ${weatherItem.wind.speed}M/S</h4>
            <h4>Humidity: ${weatherItem.main.humidity}</h4>
            </li>`;

    }
    
}

const getWeatherDetails = (cityName, lat, lon) => {
    const WEATHER_API_URL = `https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&appid=${API_KEY}`;

    fetch(WEATHER_API_URL).then(res => res.json()).then(data => {
                
        // filtering the forecasts per day
        const uniqueForecastDays = [];
        const fiveDaysForecast = data.list.filter(forecast => {
            const forecastDate = new Date(forecast.dt_txt).getDate();
            if(!uniqueForecastDays.includes(forecastDate)) {
                return uniqueForecastDays.push(forecastDate);
            }
        });

        cityInput.value = "";
        currentWeatherDiv.innerHTML = "";
        weatherCardsDiv.innerHTML = "";
        
        
        
        fiveDaysForecast.forEach((weatherItem, index) => {
            if(index === 0){
                currentWeatherDiv.insertAdjacentHTML("beforeend", createWeatherCard(cityName, weatherItem, index));
            } else {
                weatherCardsDiv.insertAdjacentHTML("beforeend", createWeatherCard(cityName, weatherItem, index));
            }
                       
            
        });


    }).catch(() => {
        alert("An error occurred while fetching the weather forecast!");
    });
}

const getCityCoordinates = () => {
    const cityName = cityInput.value.trim();
    if(!cityName) return;
    const GEOCODING_API_URL = `https://api.openweathermap.org/geo/1.0/direct?q=${cityName}&limit=1&appid=${API_KEY}`;

    
    // Getting city coordinates details like latitude, longitude and name from the API response

    fetch(GEOCODING_API_URL).then(res => res.json()).then(data => {
        if(!data.length) return alert('No coordinates found for ${cityName}');
        const { name, lat, lon} = data[0];
        getWeatherDetails(name, lat, lon);
    }).catch(() => {
        alert("An error occurred while fetching the coordinates!");
    });

}

searchButton.addEventListener("click", getCityCoordinates);
