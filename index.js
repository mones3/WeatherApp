import * as dotenv from 'dotenv'
dotenv.config()
import express from 'express';
import fetch from 'node-fetch';
import queryString from 'query-string';
import moment from 'moment';


const app = express();
const port = 3000;

app.use(express.static('public'));
app.use(express.json({ limit: '1mb' }));

app.listen(port, () => {
    console.log(`Listening at http://localhost:${port}`);
});

//city name
var city = '';
//longitude of city
var longitude = '';
//latitude of city
var latitude = '';


app.post('/userLocation', async (request, response) => {
  city = request.body.userLocation;
  //console.log(city);
  response.end();
}); 



//Retreives data from Geocoding API. Parses and assigns longitude and latitude variables
app.get('/location', async (request, response) => {
  const fetchInfo = await fetch('https://api.api-ninjas.com/v1/geocoding?city=' + city,
  {
  method: 'GET',
  headers: {
    'X-Api-Key': process.env.API_KEY_LOCATION
  },
  });

  const locationInfo = await fetchInfo.json();
  longitude = locationInfo[0].longitude;
  latitude = locationInfo[0].latitude;
  //console.log(locationInfo);
  //console.log(longitude)
  response.json(locationInfo)
});

//Retreives data from Tomorrow.io API and sends data to client
app.get('/dataResult', async(request, response) => {

// set the Timelines GET endpoint as the target URL
const getTimelineURL = "https://api.tomorrow.io/v4/timelines";

// get your key from app.tomorrow.io/development/keys
const apikey = process.env.API_KEY_WEATHER;

// pick the location, as a latlong pair
let location = [latitude, longitude];

// list the fields
const fields = [
  "precipitationIntensity",
  "precipitationType",
  "windSpeed",
  "windGust",
  "humidity",
  "windDirection",
  "temperature",
  "temperatureApparent",
  "weatherCode"
];

// choose the unit system, either metric or imperial
const units = "imperial";

// set the timesteps, like "current", "1h" and "1d"
const timesteps = ["1d"];

// configure the time frame up to 6 hours back and 15 days out
const now = moment.utc();
const startTime = moment.utc(now).add(0, "minutes").toISOString();
const endTime = moment.utc(now).add(2, "days").toISOString();

// specify the timezone, using standard IANA timezone format
const timezone = "America/New_York";

// request the timelines with all the query string parameters as options
const getTimelineParameters =  queryString.stringify({
    apikey,
    location,
    fields,
    units,
    timesteps,
    startTime,
    endTime,            
    timezone,
}, {arrayFormat: "comma"});

//Sending data to client
const fetchApi = await fetch(getTimelineURL + "?" + getTimelineParameters, {method: "GET", compress: false})
  .catch((error) => console.error("error: " + err));
  const weatherData = await fetchApi.json();
  response.json(weatherData);
  });
  
