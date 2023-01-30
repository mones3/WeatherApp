
//Need to add error check for city name
console.log('script.js loaded');

//user's location from search bar input
var locationUser = '';

/**
 * This function stores user's location(city name) in variable.
 * Sends user's location to server
 */
async function getInputValue(){
    const userLocation = await document.getElementById("location").value;  
    await fetch('/userLocation', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        body: JSON.stringify({userLocation})
      })
      .then(fetchLocationData());
      locationUser = userLocation;
    }


async function fetchLocationData() { 
    const response = await fetch('/location');
    const data = await response.json();
    fetchWeatherData(); 
 }


async function fetchWeatherData() { 
    const response = await fetch('/dataResult');
    const data = await response.json();
    parseWeatherData(data);
}

/**
 * This function parses weather data retrieved from Tomorrow.io API
 * Displays data onto interface
 * @param {} weatherData the weather details of the city
 */
function parseWeatherData(weatherData)
{  
  var today = new Date();
  var tomorrow = new Date();
  var tomorrowAfter = new Date();
  var daylist = ["Sunday", "Monday", "Tuesday", "Wednesday ", "Thursday", "Friday", "Saturday"];

  tomorrow.setDate(today.getDate() + 1);
  tomorrowAfter.setDate(tomorrow.getDate() + 1);
  
  
  document.querySelector(".city").innerText = "3-Day Weather Forecast for " + locationUser;
  
  //day 1 weather info
  document.querySelector(".day").innerText = daylist[today.getDay()]
  
  const weatherDesc = constructStatus(weatherData.data.timelines[0].intervals[0].values.weatherCode);
  document.querySelector(".temp").innerText = Math.floor(weatherData.data.timelines[0].intervals[0].values.temperature) + "°F";
  document.querySelector(".weather-icon1").src = "icons/" + weatherDesc.toLowerCase().replace(/ /g, '_') + ".svg";
  document.querySelector(".description").innerText = weatherDesc;
  document.querySelector(".wind").innerText = "Wind Speed: " + Math.floor(weatherData.data.timelines[0].intervals[0].values.windSpeed) + " mph";
  document.querySelector(".humidity").innerText = "Humidity: " + Math.floor(weatherData.data.timelines[0].intervals[0].values.humidity )+ "%";
  
  //day 2 weather info
  document.querySelector(".dayTwo").innerText = daylist[tomorrow.getDay()];

  const weatherDesc2 = constructStatus(weatherData.data.timelines[0].intervals[1].values.weatherCode);
  document.querySelector(".weather-icon2").src = "icons/" + weatherDesc2.toLowerCase().replace(/ /g, '_') + ".svg";
  document.querySelector(".temp2").innerText = Math.floor(weatherData.data.timelines[0].intervals[1].values.temperature) + "°F";
  document.querySelector(".wind2").innerText = "Wind Speed: " + Math.floor(weatherData.data.timelines[0].intervals[1].values.windSpeed) + " mph";
  document.querySelector(".humidity2").innerText = "Humidity: " + Math.floor(weatherData.data.timelines[0].intervals[1].values.humidity )+ "%";
  document.querySelector(".description2").innerText = weatherDesc2;

  //day 3 weather info
  document.querySelector(".dayThree").innerText = daylist[tomorrowAfter.getDay()];

  const weatherDesc3 = constructStatus(weatherData.data.timelines[0].intervals[2].values.weatherCode);
  document.querySelector(".weather-icon3").src = "icons/" + weatherDesc3.toLowerCase().replace(/ /g, '_') + ".svg";
  document.querySelector(".temp3").innerText = Math.floor(weatherData.data.timelines[0].intervals[2].values.temperature) + "°F";
  document.querySelector(".wind3").innerText = "Wind Speed: " + Math.floor(weatherData.data.timelines[0].intervals[2].values.windSpeed) + " mph";
  document.querySelector(".humidity3").innerText = "Humidity: " + Math.floor(weatherData.data.timelines[0].intervals[2].values.humidity )+ "%";
  document.querySelector(".description3").innerText = weatherDesc3;

  document.querySelector(".weather").classList.remove("loading");
   
}

function constructStatus(weatherCode){
  const weatherCodes = {
    0: "Unknown",
    1000: "Clear",
    1100: "Mostly Clear",
    1101: "Partly Cloudy",
    1102: "Mostly Cloudy",
    1001: "Cloudy",
    2000: "Fog",
    2100: "Light Fog",
    4000: "Drizzle",
    4001: "Rain",
    4200: "Light Rain",
    4201: "Heavy Rain",
    5000: "Snow",
    5001: "Flurries",
    5100: "Light Snow",
    5101: "Heavy Snow",
    6000: "Freezing Drizzle",
    6001: "Freezing Rain",
    6200: "Light Freezing Rain",
    6201: "Heavy Freezing Rain",
    7000: "Ice Pellets",
    7101: "Heavy Ice Pellets",
    7102: "Light Ice Pellets",
    8000: "Thunderstorm"
  };
  return weatherCodes[weatherCode];
}
    



