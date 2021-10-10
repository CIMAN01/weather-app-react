import React from "react";

export default function WeatherDay(props) {
    return (
        <div className="weather_today">      
            <div className="weather_details">         
                <h2 className="weather_city">{props.city}</h2>  
                <p className="weather_day">{props.day}</p>       
                <div className="weather_current">
                    <p className="weather_indicator weather_indicator-humidity"><span className="value">{props.humidity}</span> %</p>
                    <p className="weather_indicator weather_indicator-wind"><span className="value">{props.windVector}</span></p>
                    <p className="weather_indicator weather_indicator-pressure"><span className="value">{props.pressure}</span> hPa</p>                 
                </div>
            </div>
            <img src={props.imgUrl} alt="Clear Sky" className="weather_image" />            
            <div className="weather_temperature">
                <span className="value">{props.weatherTemperature}</span>&deg; <span id="units">{props.tempUnit}</span>
            </div>  
        </div>
    ); 
}
