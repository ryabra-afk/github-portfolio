import { useState } from 'react'; //import useState from react.js so can store and update city input later on

function App() {
  const [city, setCity] = useState(''); //create a state variable called city and a function to update it called setCity, initialised to an empty string
  const [weather, setWeather] = useState(null); //create a state variable called weather and a function to update it called setWeather, initialised to null]
  const [error, setError] = useState(''); //Create a state variable called error and a function to update it called setError, initialised to an empty string
  const [forecast, setForecast] = useState([]); //create a state variable called forecast and a function to update it called setForecast, initialised to an empty array
  const apiKey = import.meta.env.VITE_WEATHER_API_KEY; //get the API key from the .env file

  //runs when user clicks search button
  async function handleSearch() {
    setError(''); //reset error message to empty string
    setWeather(null); //reset weather variable to null to remove old weather data
    //send request to openWeather API with the city name and API key, and get the response in JSON format
    const weather_Response = await fetch(`https://api.openweathermap.org/data/2.5/weather?q=${city}&units=metric&appid=${apiKey}`);
    
    // if the city does not exist, OpenWeather returns 404
    if (!weather_Response.ok) {
      setError("Error 404: City not found");
      return; // stop the function here so we don’t try to read invalid weather data
    }

    const weather_Data = await weather_Response.json(); //store results in data
    console.log(weather_Data);
    setWeather(weather_Data); //update weather variable with the data returned by the API


    //request 5-day 3-hour forecast data from OpenWeather API
    const forecast_Response = await fetch(`https://api.openweathermap.org/data/2.5/forecast?q=${city}&units=metric&appid=${apiKey}`);
    const forecast_Data = await forecast_Response.json(); //convert forecast response to JSON format for storage
    //filter the 40 forecast entries to get only one forecast per day at 12:00:00
    const daily_Forecasts = forecast_Data.list.filter((item) => item.dt_txt.includes("12:00:00"));
    //store the filtered forecast array in state variable forecast so it can be displayed in the UI
    setForecast(daily_Forecasts);
  }

  return(
    <div>
      <h1>Weather App</h1>
      <input type = "text" 
      placeholder = "Enter city..." 
      value = {city} //input value is set to the city state varaible so that it can be updated and displayed in the input field
      //updates city variable whenever user types in the input box
      onChange={(e) => setCity(e.target.value)} /> 

      <button onClick={handleSearch}>Search</button>
      {/* if error variable is not empty, display the error message in a p element with red color */}
      {error && <p style={{ color: 'red' }}>{error}</p>} 
      <p>You typed: {city}</p>
      
      {/*if weather variable is not null, display the weather information in a div element*/}
      {weather && (
        <div>
          {/* display city name returned by API */}
          <h2>{weather.name}</h2>
          {/* display temperature returned by API in celsius */}
          <p>Temperature: {weather.main.temp}°C</p>
          {/* display main weather condition returned by API */}
          <p>Condition: {weather.weather[0].main}</p>
          {/* display what the temperature feels like to the human body */}
          <p>Feels like: {weather.main.feels_like}°C</p>
          {/* display humidity percentage */}
          <p>Humidity: {weather.main.humidity}%</p>
          {/* display wind speed in metres per second */}
          <p>Wind speed: {weather.wind.speed} m/s</p>
          {/* display atmospheric pressure in hPa */}
          <p>Pressure: {weather.main.pressure} hPa</p>
          {/* display visibility in kilometres */}
          <p>Visibility: {weather.visibility / 1000} km</p>
        </div>
      )}

      {forecast.length > 0 && (
      <div>
        <h2>5-Day Forecast</h2>
        {/* .map creates a new UI element (div) for each day item in the forecast array using indexes */}
        {forecast.map((day, index) => (
          // give each div a unique key based on the index of the day's forecast so react can  update the UI when forecast array changes
          <div key={index}>
            {/* date and time of this forecast entry */}
            <p><strong>{day.dt_txt}</strong></p>

            {/* forecast temperature */}
            <p>{Math.round(day.main.temp)}°C</p>

            {/* day.weather[0].main to get main forecast weather condition */}
            <p>{day.weather[0].main}</p>

            {/* display humidity percentage */}
            <p>Humidity: {day.main.humidity}%</p>
            
            <hr />
          </div>
        ))}
      </div>
    )}
    </div>
  );
}

//exports app component so it can be used by other files
export default App;