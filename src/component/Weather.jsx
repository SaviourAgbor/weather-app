import Search from "./Search";
import { useEffect, useState } from "react";

function Weather() {
  const [weatherData, setWeatherData] = useState(null);
  const [forecast, setForecast] = useState([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(false);
  const [loadingText, setLoadingText] = useState("");
  const [error, setError] = useState("");

  const weatherApiUrl = import.meta.env.VITE_WEATHER_API_URL;
  const weatherApiKey = import.meta.env.VITE_WEATHER_API_KEY;

  async function fetchWeatherData(city) {
    if (!city.trim()) return; // prevent empty searches

    try {
      setLoading(true);
      setLoadingText("Fetching weather data...");
      setError("");
      setSearch("");

      const response = await fetch(
        `${weatherApiUrl}q=${city}&appid=${weatherApiKey}&units=metric`
      );

      const data = await response.json();

      if (data.cod !== 200) {
        setError(data.message || "City not found!");
        setWeatherData(null);
        setForecast([]); // clear forecast if error
      } else {
        setWeatherData(data);
        // fetch forecast too
        const forecastData = await fetchForecast(city);
        setForecast(forecastData);
      }
    } catch (e) {
      console.error("An error occurred:", e);
      setError(true);
      setErrorMessage("Failed to fetch weather data.");
    } finally {
      setLoading(false);
    }
  }

  async function fetchForecast(city) {
    const forecastApiUrl = import.meta.env.VITE_FORECAST_API_URL; // e.g., "https://api.openweathermap.org/data/2.5/forecast"

    try {
      const response = await fetch(
        `${forecastApiUrl}q=${city}&appid=${weatherApiKey}&units=metric`
      );

      const data = await response.json();

      if (data.cod !== "200") {
        console.error("Error fetching forecast:", data.message);
        return [];
      }

      // Filter for 12:00 (noon) each day
      const dailyForecasts = data.list.filter((item) =>
        item.dt_txt.includes("12:00:00")
      );

      // Take only the next 4 days
      const next4Days = dailyForecasts.slice(0, 4).map((item) => ({
        date: new Date(item.dt * 1000).toLocaleDateString("en-US", {
          weekday: "short",
          month: "short",
          day: "numeric",
        }),
        temp: Math.round(item.main.temp),
        description: item.weather[0].description,
        icon: `https://openweathermap.org/img/wn/${item.weather[0].icon}@2x.png`,
      }));
      return next4Days;
    } catch (e) {
      console.error("An error occurred fetching forecast:", e);
      return [];
    }
  }

  useEffect(() => {
    fetchWeatherData("london");
  }, []);

  function getCurrentDate() {
    return new Date().toLocaleDateString("en-us", {
      weekday: "long",
      month: "long",
      day: "numeric",
      year: "numeric",
    });
  }

  const description = weatherData?.weather[0]?.description;

  function weatherImage(description) {
    description = description.toLowerCase();
    let imageSrc = "images/rain-drops.png"; // fallback

    if (description === "rain") {
      imageSrc = "/images/rain.png";
    } else if (
      description === "cloud" ||
      description === "few clouds" ||
      description === "scattered clouds"
    ) {
      imageSrc = "/images/cloud.png";
    } else if (description === "clear") {
      imageSrc = "/images/sun.png";
    } else if (description === "snow") {
      imageSrc = "/images/snow.png";
    } else if (
      description === "storm" ||
      description === "heavy intensity rain"
    ) {
      imageSrc = "/images/storm.png";
    } else if (description === "overcast clouds") {
      imageSrc = "/images/dew.png";
    }

    return <img src={imageSrc} alt={description} />;
  }

  async function handleSearch() {
    fetchWeatherData(search);
  }

  return (
    <div
      className=" bg-cover bg-center box-border max-h-dvh"
      style={{ backgroundImage: "url('/bg-weather.png') " }}
    >
      <div
        className={`${
          loading || weatherData?.cod !== 200 ? "h-dvh z-20 w-full" : ""
        } bg-gradient-to-b from-[#64AFC9]/20 to-[#3377A0] h-dvh backdrop-blur-lg p-4 md:p-8`}
      >
        <Search
          search={search}
          setSearch={setSearch}
          handleSearch={handleSearch}
          loading={loading}
          weatherData={weatherData}
        />
        {/* Error message */}
        {error && (
          <div className="w-full mt-10 bg-red-400 text-xl text-center text-white p-5 mb-4 rounded-md">
            {error}
          </div>
        )}

        {loading ? (
          <div className="w-full flex flex-col justify-center items-center h-full">
            <div className="w-20 h-20 border-4 border-t-transparent border-white rounded-full animate-spin"></div>
            <div className="text-white/60 font-bold">{loadingText}</div>
          </div>
        ) : weatherData ? (
          <div className=" main m-auto flex flex-col items-center justify-between gap-1 ">
            <div className="mt-4 z-50  w-[100px] h-full flex items-center justify-center">
              {weatherImage(description)}
            </div>

            <div className="flex z-50  flex-col justify-center items-center">
              <div className="text-4xl md:text-6xl font-bold text text-black/80">{`${weatherData?.main?.temp} °C`}</div>
              <div className="text-lg font-bold">
                {weatherData?.name}
                {`${weatherData?.sys?.country ? "," : ""}`}{" "}
                <span>{weatherData?.sys.country}</span>
              </div>
              <div className="text-lg md:text-xl font-bold text-black/70">
                {getCurrentDate()}
              </div>
              <h2 className="text-lg z-50  font-thin  capitalize">
                {weatherData?.weather[0]?.description}
              </h2>
            </div>

            <div className="flex justify-between w-full px-8 md:px-20 z-50">
              <div className="bg-orange-100/20 rounded-xl py-2 px-10">
                <h1 className="text-lg font-bold ">
                  {weatherData?.main?.humidity + "%"}
                </h1>
                <p>Humidity</p>
              </div>
              <h1 className="text-4xl text-black/10 font-bold">|</h1>
              <div className="bg-orange-100/20 rounded-xl py-2 px-10  ">
                <h1 className="text-lg font-bold">
                  {weatherData?.wind?.speed} km/h
                </h1>
                <p>Wind speed</p>
              </div>
            </div>
            <div className="grid grid-cols-2 mt-3 grid-rows-2 gap-2 w-full text-lg md:text-xl">
              {forecast.map((day, index) => (
                <div
                  key={index}
                  className="flex z-60 flex-col md:flex-row justify-center md:gap-5 items-center bg-white/15 shadow-2xl md:bg-white/40 p-2 rounded-xl"
                >
                  <div className="font-bold text-black/60 md:text-black/40">
                    {day.date}
                  </div>
                  <img
                    src={day.icon}
                    alt={day.description}
                    className="w-12 h-12"
                  />
                  <div className="font-bold">{day.temp}°C</div>
                  <div className=" capitalize font-thin md:font-light">
                    {day.description}
                  </div>
                </div>
              ))}
            </div>
          </div>
        ) : null}
      </div>
    </div>
  );
}

export default Weather;
