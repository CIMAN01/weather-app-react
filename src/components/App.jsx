import React, { useState, useEffect } from "react";
import WeatherDay from "./WeatherDay";
import Forecast from "./Forecast";
import LocationSearch from "./LocationSearch";
import Footer from "./Footer";


function App() {
  
    const [city, setCity] = useState('Las Vegas');
    const [day, setDay] = useState('');
    const [weatherTemperature, setWeatherTemperature] = useState('');
    const [tempUnit, setTempUnit] = useState('C');
    const [humidity, setHumidity] = useState('');
    const [pressure, setPressure] = useState('');
    const [windVector, setWindVector] = useState('');
    const [imgUrl, setImgUrl] = useState('');
    const [forecastBlock, setForecastBlock] = useState([]);
    
    let forecastTempUnit = '';
    let windUnit = '';

    const privateAPIKey  = process.env.REACT_APP_WEATHER_API_KEY; 
    
    // endpoints
    let weatherBaseEndpoint = 'https://api.openweathermap.org/data/2.5/weather?units=metric&appid=' + privateAPIKey;
    let weatherBaseEndpointImperial = 'https://api.openweathermap.org/data/2.5/weather?units=imperial&';
    let forecastBaseEndpoint = 'https://api.openweathermap.org/data/2.5/forecast?q=';

    // weather icon-images
    const weatherImages = [
        {
            url: '/images/clear-sky.png',
            ids: [800] // weather condition code
        },
        {
            url: '/images/broken-clouds.png',
            ids: [803, 804] 
        },
        {
            url: '/images/few-clouds.png',
            ids: [801] 
        },
        {
            url: '/images/mist.png',
            ids: [701, 711, 721, 731, 741, 751, 761, 762, 771, 781] 
        }, 
        {
            url: '/images/rain.png',
            ids: [500, 501, 502, 503, 504] 
        },
        {
            url: '/images/scattered-clouds.png',
            ids: [802] 
        },
        {
            url: '/images/shower-rain.png',
            ids: [520, 521, 522, 531, 300, 301, 302, 310, 311, 312, 313, 314, 321] 
        },
        {
            url: '/images/snow.png',
            ids: [511, 600, 601, 602, 611, 612, 613, 615, 616, 620, 621, 622] 
        },
        {
            url: '/images/thunderstorm.png',
            ids: [200, 201, 202, 210, 211, 212, 221, 230, 231, 232] 
        }
    ]   

    // get weather via API
    const getWeather = async (cityName) => { 
        
        let request = '';
        let city = '';

        if (cityName.length === 5 && Number.parseInt(cityName) + '' === cityName) {
            city = cityName;
            request =  weatherBaseEndpointImperial + 'zip=' + city + ',us&appid=' + privateAPIKey;
            setTempUnit('F'); // isImperial = true;
            forecastTempUnit = 'F';
            windUnit = 'mph'; 
        }
        else {
            if (cityName.includes(',')) {
                city = cityName.substring(0, cityName.indexOf(',')); 
                request = weatherBaseEndpoint + '&q=' + city;
            }
            else {
                city = cityName;
                request = weatherBaseEndpoint + '&q=' + city;
            }
            setTempUnit('C'); 
            forecastTempUnit = 'C';
            windUnit = 'm/s'; 
        }

        let response = await fetch(request); 
    
        if(response.status !== 200) { 
            alert('City not found, try again!');
            return;
        }

        let weather = await response.json();

        return weather;
    }

    
    const getWindDirection = (degree) => {
        let windDirection;
        
        if(degree > 45 && degree <= 135) { 
            windDirection = 'East';
        } 
        else if(degree > 135 && degree <= 225) {
            windDirection = 'South';
        } 
        else if(degree > 225 && degree <= 315) {
            windDirection = 'West';
        } 
        else {
            windDirection = 'North';
        }
        return windDirection;
    }
    

    const updateCurrentWeather = data => {
        // weather day details
        setCity(data.name + ', ' + data.sys.country); // store the city name and country 
        setDay(dayOfWeek()); // call the function and store the day of the week
        setHumidity(data.main.humidity); // update humidity data
        setPressure(data.main.pressure); // update pressure data
       
        let degree = data.wind.degree; 
        let windDirection = getWindDirection(degree); 
        let windSpeed;
        
        // check if a zip-code is entered
        if(windUnit === 'mph') {
            windSpeed = Math.round(data.wind.speed * 2.23694); // use imperial
        } 
        else {
            windSpeed = Math.round(data.wind.speed); // use metric
        }
        setWindVector(windDirection + ', ' + windSpeed + ' ' + windUnit); 
        // store the temperature and a minus sign in front if it's a negative number (use Math.round to get an integer value)
        setWeatherTemperature(data.main.temp > 0 ? Math.round(data.main.temp) : '-' + Math.round(data.main.temp));  
        // get the image ID from the API data
        let imgID = data.weather[0].id;
        // cycle thru the weatherImages array 
        weatherImages.forEach(obj => {
            // check for a match -> if the current object's ID matches the image ID that we get from the API
            if(obj.ids.includes(imgID)) {
                // use the corresponding image url to display the correct image icon  
                setImgUrl(obj.url); //image.src = obj.url; 
            }
        })
    }


    const getForecast = async cityName => {
        let request;
        let unit = forecastTempUnit //tempUnit;
        // chose metric or imperial
        if(unit === 'F') {
            request = forecastBaseEndpoint + cityName + '&units=imperial&appid=' + privateAPIKey;
        }
        else {
            request = forecastBaseEndpoint + cityName + '&units=metric&appid=' + privateAPIKey;
        }
        let fiveDayForecast = []; 
        // make an api request
        let response = await fetch(request).then(response => response.json()).catch(e => console.log('Error', e));
        let forecastList = response.list; // store the json list that contains an array (40 element array)  
        // check every element in the array (40 items)
        forecastList.forEach(day => {
            // replace the empty space with the letter T to get the proper formatting for the date syntax
            let date = new Date(day.dt_txt.replace(' ', 'T')); 
            let hours = date.getHours(); // get the time from the date 
            // if the time is 12:00, then the object has to be added to the fiveDayForecast array (needed to get only 5 objects instead of the 40!)
            if(hours === 12) {  
                fiveDayForecast.push(day); 
            }
        })
        return fiveDayForecast;
    }

    
    const updateForecast = forecast => {
        // create an article for each day of the array called forecast 
        setForecastBlock(forecast.map(day => {
                return {
                    iconUrl: 'http://openweathermap.org/img/wn/' + day.weather[0].icon + '@2x.png', // '@2x.png' -> increases the resolution of the pgn 
                    weatherDescription: day.weather[0].description,
                    dayName: dayOfWeek(day.dt * 1000), // convert seconds into milliseconds (1 sec = 1000 ms)
                    temp: day.main.temp_max > 0 ? '' + Math.round(day.main.temp_max) : '-' + Math.round(day.main.temp_max),
                    forecastTempUnit: forecastTempUnit  
                }
        }));
    } 

   
    const dayOfWeek = (dt = new Date().getTime()) => { 
        // convert object to the local date string 
        return new Date(dt).toLocaleDateString('en-EN', {'weekday': 'long'}); // en-EN -> English and long -> the whole name of the weekday
    }


    // main flow chart logic for app 
    const weatherForCity = async (city) => { 
        const weather = await getWeather(city);

        if(!weather) {
            return; 
        }

        updateCurrentWeather(weather);
        
        const forecast = await getForecast(city);
        updateForecast(forecast);
    }


    // init()
    useEffect(() => {
        weatherForCity(city).then(() => document.body.style.filter = 'blur(0)');
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    
    // using extra function to avoid calling weatherForCity directly from <LocationSearch/> which makes app crashes
    function weatherForSearchedCity(searchedLocation) {
        weatherForCity(searchedLocation);
    }


    return (
       
        <div className="weather">
        
            <LocationSearch 
                weatherForSearchedCity={weatherForSearchedCity}
            />
            
            <WeatherDay 
                city={city} 
                day={day}
                humidity={humidity} 
                windVector={windVector} 
                pressure={pressure}
                imgUrl={imgUrl} 
                weatherTemperature={weatherTemperature}
                tempUnit={tempUnit}
            />

            <div className="weather_forecast">
        
            {forecastBlock.map((forecastItem, index) => {     
                return (    
                    <Forecast
                        key={index}
                        iconUrl={forecastItem.iconUrl} 
                        weatherDescription={forecastItem.weatherDescription} 
                        dayName={forecastItem.dayName} 		
                        temp={forecastItem.temp}   
                        forecastTempUnit={forecastItem.forecastTempUnit}  
                    />
                );
            })}

            </div>

            <Footer/>

        </div>
    );   
        
}

export default App;
