// state
let currCity = "norway";
let units = "metric";
// console.log("YSH");
let city = document.querySelector(".weather__searchform");
let datetime = document.querySelector(".weather__datetime");
let weather__forecast = document.querySelector('.weather__forecast');
let weather__temperature = document.querySelector(".weather__temperature");
let weather__icon = document.querySelector(".weather__icon");
let weather__minmax = document.getElementById('mimax')
let weather__realfeel = document.getElementById('realfeel');
let weather__humidity = document.getElementById('humidity');
let weather__wind = document.getElementById('wind');
let weather__pressure = document.getElementById('preassure');
const options = {
    weekday: "short",
    day: "numeric",
    // month: "short",
    // year: "numeric",
    hour: "numeric",
    minute: "numeric",
    second: "numeric",
    hour12: true,
};
// search
document.querySelector(".weather__search").addEventListener('submit', e => {
    let search = document.querySelector(".weather__search");
    e.preventDefault(); // prevent default reload
    currCity = search.value;
    currCity=document.getElementById('searchme').value;
    if (/\d/.test(currCity)) {
        alert('Numbers not allowed');
        document.querySelector(".weather__search").value = "";
        return false;
    }
    getWeather();
    search.value = ""
})

function convertTimeStamp(timestamp, timezone) {
    // Converting the time from seconds to milliseconds
    const date = new Date((timestamp + timezone) * 1000); // Adjust timestamp by adding timezone in seconds
    console.log(date.toDateString("en-US",options));
    return date.toDateString("en-US", options);
}



// convert country code to name
function convertCountryCode(country) {
    let regionNames = new Intl.DisplayNames(["en"], { 
        type: "region", 
        style: "narrow" 
      });
          return regionNames.of(country)
}

async function getWeather() {
    const API_KEY = '3ba0e5eedae49070b51c85ad8c30def0';
    // currCity=document.getElementById('searchme').value;

    try {

        const res = await fetch(`https://api.openweathermap.org/data/2.5/weather?q=${currCity}&units=metric&appid=${API_KEY}`);

        if (!res.ok) {
            throw new Error(`Failed to fetch weather data: ${res.statusText}`);
        }

        const data = await res.json();
        // console.log(data);
        // console.log(data);

        // Populate the DOM with the weather data
        city.innerHTML = `${data.name}, ${convertCountryCode(data.sys.country)}<img src="./icons/pin.png" alt="humidity">`;
        datetime.innerHTML = convertTimeStamp(data.dt, data.timezone);
        weather__forecast.innerHTML = `<p>${data.weather[0].main}`;
        document.getElementById('citynames').innerText=`${data.name},${convertCountryCode(data.sys.country)}`;
        const weatherf = data.weather[0].main;
        weather__temperature.innerHTML = `${data.main.temp.toFixed()}&#176C`;
        // console.log(data.main.temp);
        weather__icon.innerHTML = `<img src="http://openweathermap.org/img/wn/${data.weather[0].icon}@4x.png" style="height:250px; width:250px" />`;
        weather__minmax.innerHTML = `<span>Min-Temp: ${data.main.temp_min.toFixed()}&#176C</span> <br><span>Max-Temp: ${data.main.temp_max.toFixed()}&#176C</span>`;
        weather__realfeel.innerHTML = `Real Feel <br>${data.main.feels_like}&#176C`;
        weather__humidity.innerHTML = `Humidity <br>${data.main.humidity}%`;
        weather__wind.innerHTML = `Wind Speed <br>${data.wind.speed} ${units === "imperial" ? "mph" : "m/s"}`;
        weather__pressure.innerHTML = `Pressure<br>${data.main.pressure} hPa`;
        // console.log(data.visibility);
        document.getElementById('vis').innerHTML = `Visibility<br>${(data.visibility) / 1000} KM/HR`;

        // Function to change background image with a fade effect
        function changeBackground(imageUrl) {
            const background = document.getElementById('background');
            background.style.opacity = 0; // Start fade-out

            setTimeout(() => {
                background.style.backgroundImage = `url(${imageUrl})`;
                background.style.opacity = 1; // Fade back in with the new image
            }, 500); // Wait for fade-out to finish before changing image
        }

        // Example conditions for changing the background based on weather
        if (weatherf === "Clear") {
            changeBackground('./weathers/clear.jpg');
        } else if (weatherf === "Clouds") {
            changeBackground('./weathers/clouds.jpg');
        } else if (weatherf === "Sunny") {
            changeBackground('./weathers/sunny.jpg');
        } else if (weatherf === "Haze") {
            changeBackground('./weathers/haze.jpg');
        } else if (weatherf === "Smoke") {
            changeBackground('./weathers/smoky.jpeg');
        } else if (weatherf === "Rain") {
            changeBackground('./weathers/rain.jpg')
        }

    } catch (error) {
        alert('City Not Found..!')
        console.log("Error fetching weather data:", error);
    }
}


document.body.addEventListener('load', getWeather())
setInterval(function () { var dat = new Date(); datetime.innerHTML = dat.toLocaleString("en-US", options); }, 1000)
