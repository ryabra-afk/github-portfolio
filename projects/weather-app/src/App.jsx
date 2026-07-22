import { useState } from 'react'; //import useState from react.js so can store and update city input later on

function App() {
  const [city, setCity] = useState(''); //create a state variable called city and a function to update it called setCity, initialized to an empty string
  const [weather, setWeather] = useState(null); //create a state variable called weather and a function to update it called setWeather, initialized to null]
  const apiKey = import.meta.env.VITE_WEATHER_API_KEY; //get the API key from the .env file

  //runs when user clicks search button
  async function handleSearch() {
    //send request to openWeather API with the city name and API key, and get the response in JSON format
    const response = await fetch(`https://api.openweathermap.org/data/2.5/weather?q=${city}&units=metric&appid=${apiKey}`);
    const data = await response.json();
    console.log(data);
    setWeather(data);
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
        </div>
      )}
    </div>
  );
}




//exports app component so it can be used by other files
export default App;