import { useState } from 'react'; //import useState from react.js so can store and update city input later on

function App() {
  const [city, setCity] = useState(''); //create a state variable called city and a function to update it called setCity, initialised to an empty string
  const [weather, setWeather] = useState(null); //create a state variable called weather and a function to update it called setWeather, initialised to null]
  const [error, setError] = useState(''); //Create a state variable called error and a function to update it called setError, initialised to an empty string
  const [forecast, setForecast] = useState([]); //create a state variable called forecast and a function to update it called setForecast, initialised to an empty array
  //array of matching city suggestions returned by geocoding API
  const [searchSuggestions, setSearchSuggestions] = useState([]);
  //controls whether the dropdown should be visible
  const [loadSuggestions, setLoadSuggestions] = useState(false);
  
  const apiKey = import.meta.env.VITE_WEATHER_API_KEY; //get the API key from the .env file

  async function fetchSearchSuggestions(query) {
    //if user typed less than 2 characters - reset suggestions and return to not fetch suggestions
    if (query.length < 2) {
      setSearchSuggestions([]);
      setLoadSuggestions(false);
      return;
    }
    //fetch city suggestions from OpenWeather Geocoding API - max 5
    const suggestionResponse = await fetch(`https://api.openweathermap.org/geo/1.0/direct?q=${query}&limit=5&appid=${apiKey}`);
    const suggestionData = await suggestionResponse.json();
    setSearchSuggestions(suggestionData);
    setLoadSuggestions(true);
    setLoadSuggestions(suggestionData.length > 0);
  }

  //runs when user clicks search button
  async function handleSearch() {
    setError(''); //reset error message to empty string
    setWeather(null); //reset weather variable to null to remove old weather data
    setForecast([]);   //clear old forecast
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
      <h1>Weather</h1>

       {/* div container for input box and search button, with class name for styling */}
      <div className = "search-container">

        {/* wrapper keeps dropdown aligned directly under the input box */}
        <div className = "input-wrapper">

          <input className = "city-input" type = "text" 
          placeholder = "Enter city..." 
          value = {city} //input value is set to the city state varaible so that it can be updated and displayed in the input field
          //updates city variable whenever user types in the input box
          onChange={(e) => {
            setCity(e.target.value); // update input text
            fetchSearchSuggestions(e.target.value); // fetch matching cities
          }}
          //allow search with enter key as well
          onKeyDown={(e) => {
            if (e.key === 'Enter') {
              handleSearch();
            }
          }}/>

          {/* if loadSuggestions is true display the suggestions dropdown */}
          {loadSuggestions && (
            <div className="suggestions-dropdown">
              {searchSuggestions.map((item, index) => (
                <div
                  key={index}
                  className="suggestion-item"
                  onClick={() => {
                    setCity(item.name); //put selected city into the input
                    setLoadSuggestions(false); //hide dropdown
                    setSearchSuggestions([]); //clear suggestion list

                    //search immediately using selected city
                    handleSearch(item.name);
                  }}
                >
                  {item.name}, {item.country}
                </div>
              ))}
            </div>
          )}

        </div>

        <button className="search-button" onClick={handleSearch}>Search</button>

      </div>

      {/* if error variable is not empty, display the error message in a p element with red color */}
      {error && <p style={{ color: 'red' }}>{error}</p>} 
      <p>You typed: {city}</p>
      
      {/*if weather variable is not null, display the weather information in a div element*/}
      {weather && (
        <div className="current-weather-card">

          {/* URL retrieves weather icon image 2x size*/}
          <img
            src={`https://openweathermap.org/img/wn/${weather.weather[0].icon}@2x.png`}
            className="weather-icon"
          />

          {/* display city name and country code returned by API */}
          <h2>{weather.name}, {weather.sys.country}</h2>

          <div className="metrics-grid">

            <div className="metric-card">
              {/* display temperature returned by API in celsius */}
              <p>Temperature</p>
              <h3>{weather.main.temp}°C</h3>
            </div>

            <div className="metric-card">
              {/* display main weather condition returned by API */}
              <p>Condition</p>
              <h3>{weather.weather[0].main}</h3>
            </div>

            <div className="metric-card">
              {/* display what the temperature feels like to the human body */}
              <p>Feels like</p>
              <h3>{weather.main.feels_like}°C</h3>
            </div>

            <div className="metric-card">
              {/* display humidity percentage */}
              <p>Humidity</p>
              <h3>{weather.main.humidity}%</h3>
            </div>

            <div className="metric-card">
              {/* display wind speed in metres per second */}
              <p>Wind speed</p>
              <h3>{weather.wind.speed} m/s</h3>
            </div>

            <div className="metric-card">
              {/* display atmospheric pressure in hPa */}
              <p>Pressure</p>
              <h3>{weather.main.pressure} hPa</h3>
            </div>

            <div className="metric-card">
              {/* display visibility in kilometres */}
              <p>Visibility</p>
              <h3>{weather.visibility / 1000} km</h3>
            </div>

          </div>
        </div>
      )}

      {forecast.length > 0 && (
      <div>
        <h2>5-Day Forecast</h2>
        {/* .map creates a new UI element (div) for each day item in the forecast array using indexes */}
        <div className="forecast-grid">
          {forecast.map((day, index) => (
            // give each div a unique key based on the index of the day's forecast so react can  update the UI when forecast array changes
            <div key={index} className="forecast-card">
              {/* extract daate in day month format from YYYY-MM-DD HH:MM:SS format */}
              <p>
                <strong>
                  {new Date(day.dt_txt).toLocaleDateString('en-GB', {day: 'numeric', month: 'long'})}
                </strong>
              </p>

              {/* URL retrieves weather icon image from API 2x size*/}
              <img
                src={`https://openweathermap.org/img/wn/${day.weather[0].icon}@2x.png`}
                className="forecast-icon"
              />

              {/* forecast temperature */}
              <p>{Math.round(day.main.temp)}°C</p>

              {/* day.weather[0].main to get main forecast weather condition */}
              <p>{day.weather[0].main}</p>

              {/* display humidity percentage */}
              <p>Humidity: {day.main.humidity}%</p>

            </div>
          ))}
        </div>
      </div>
    )}
    </div>
  );
}

//exports app component so it can be used by other files
export default App;