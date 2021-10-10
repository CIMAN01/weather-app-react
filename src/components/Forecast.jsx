import React from "react";

const Forecast = ({iconUrl, weatherDescription, dayName, temp, forecastTempUnit}) => {
    return (
        <article className="weather_forecast_item">
            <h3 className="weather_forecast_day">{dayName}</h3>
                <img src={iconUrl} alt={weatherDescription} className="weather_forecast_icon" />
            <h3 className="weather_forecast_temperature"><span className="value">{temp}</span>&deg; {forecastTempUnit}</h3>
        </article>
    );
}

export default Forecast;
