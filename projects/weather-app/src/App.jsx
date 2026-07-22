import { useState } from 'react'; //import useState from react.js so can store and update city input later on

function App() {
  const [city, setCity] = useState(''); //create a state variable called city and a function to update it called setCity, initialized to an empty string
  return(
    <div>
      <h1>Weather App</h1>
      <input type = "text" 
      placeholder = "Enter city..." 
      value = {city} //input value is set to the city state varaible so that it can be updated and displayed in the input field
      //updates city variable whenever user types in the input box
      onChange={(e) => setCity(e.target.value)} /> 

      <p>You typed: {city}</p>
    </div>
  );
}

//exports app component so it can be used by other files
export default App;