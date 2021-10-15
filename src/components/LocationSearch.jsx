import React, { useState } from "react";


const LocationSearch = (props) => {

    const [location, setLocation] = useState('');
    const [suggestions, setSuggestions] = useState([]);
           
    const handleKey = async (event) => {
        if(event.keyCode === 13) { // 13 is the key code for the enter key (keyboard event)
            props.weatherForSearchedCity(location); // make a call to the function that returns weather data by city locanlocation 
            setLocation(''); // clear city value
            setSuggestions([]);  // clear suggestions
        }
    }

    const handleClick = async () => {
        props.weatherForSearchedCity(location); // make a call to the function that returns weather data by city location
        setLocation('');
        setLocation(''); // clear city value
        setSuggestions([]);  // clear suggestions
    }

    // Teleport public API @ developers.teleport.org/api
    let cityBaseEndpoint = 'https://api.teleport.org/api/cities/?search='; 


    const handleSuggestions = async (event) => {
        // create an endpoint
        let endpoint = cityBaseEndpoint + event.target.value;
        // make a request to the url and get the response back in the form of a json object
        let response = await (await fetch(endpoint)).json(); // use json function after fetching the response
        
        // delete all previous suggested cities before adding new ones
        setSuggestions([]);
        
        // https://api.teleport.org/api/...
        let cities = response._embedded['city:search-results']; // use [] instead of . since the column symbol is used inside the name of the key 
        // only display the first 5 suggested cities (only up to 5 cities will be shown) 
        let length = cities.length > 5 ? 5 : cities.length;    
        // cycle through the number of cities 
        for(let i = 0; i < length; i++) {
            let city = cities[i].matching_full_name;
            setSuggestions(prevCity => [...prevCity, city]); 
        }
        event.preventDefault();
    }    

    return (

        <div className="search_area">
        
            <input 
                className="weather_search" 
                type="search" // type="text"             
                placeholder="Your City"
                value={location} 
                list="suggestions"
                onInput={e => handleSuggestions(e)}
                onChange={e => setLocation(e.target.value)}
                onKeyDown={handleKey} 
            />
        
            <button className="search_button" onClick={handleClick}>
            
                <svg stroke="currentColor" fill="currentColor" strokeWidth="0" viewBox="0 0 16 16" height="2em" width="2em" xmlns="http://www.w3.org/2000/svg">
                    <path fillRule="evenodd" d="M10.442 10.442a1 1 0 011.415 0l3.85 3.85a1 1 0 01-1.414 1.415l-3.85-3.85a1 1 0 010-1.415z" clipRule="evenodd"></path>
                    <path fillRule="evenodd" d="M6.5 12a5.5 5.5 0 100-11 5.5 5.5 0 000 11zM13 6.5a6.5 6.5 0 11-13 0 6.5 6.5 0 0113 0z" clipRule="evenodd"></path>
                </svg>
            
            </button>
            
            <datalist id="suggestions">
    
                {suggestions.map((suggestedCityItem, index) => 
                    <option value={suggestedCityItem} key={index}/>
                )}

            </datalist>

        </div>

    );    
    
}    
    
export default LocationSearch;
