import { useEffect, useState } from "react";

import "./MainWidget.css";
import { apiCall } from "../services/apiCall";

interface WeatherData {
  main: {
    temp: number;
    feels_like: number;
    temp_min: number;
    temp_max: number;
    pressure: number;
    humidity: number;
  };
  weather: {
    description: string;
    icon: string;
  }[];
  name: string;
  sys: {
    country: string;
    sunrise: number;
    sunset: number;
  };
  dt: number;
  timezone: number;
}

interface props {
  location: {
    lat: number;
    lon: number;
  };
  error: string;
}

const MainWidget: React.FC<props> = ({
  location = { lat: 0, lon: 0 },
  error,
}) => {
  const [loader, setLoader] = useState(false);
  const [fetchedWeather, setfetchedWeather] = useState<WeatherData>();

  // Fetch weather data
  const fetchWeather = async () => {
    setLoader(true);

    let response;

    response = await apiCall(
      `https://api.openweathermap.org/data/2.5/weather?lat=${location?.lat}&lon=${location?.lon}`,
      "get"
    );

    if (response?.status === 200) {
      setfetchedWeather(response?.data);

      setLoader(false);
    } else {
      setLoader(false);
    }
  };

  const convertTimestampToDate = (timestamp: number) => {
    const date = new Date(timestamp * 1000);
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  const convertTimestampToTime = (timestamp: number) => {
    const date = new Date(timestamp * 1000);
    return date.toLocaleTimeString("en-US", {
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const convertKelvinToCelsius = (kelvin: number) => {
    return (kelvin - 273.15).toFixed(2);
  };

  useEffect(() => {
    if (location.lat && location.lon) fetchWeather();
  }, [location]);

  return (
    <div className="main-widget-div bg-primary rounded-main p-9 flex flex-col items-center gap-8 lg:justify-between lg:gap-6">
      <button className="flex w-full justify-center items-center">
        <span className="text-textPrimary text-xl font-medium">Today</span>
        <img
          src="images/arrow.png"
          alt="arrow"
          aria-hidden="true"
          className="ml-2"
        />
      </button>
      {/* Main weather */}
      {loader ? (
        <>
          <p className="text-green-600">Loading...</p>
        </>
      ) : error ? (
        <>
          <p className="text-red-600">{error}</p>
        </>
      ) : (
        <>
          <div className="flex flex-col gap-4 items-center">
            <div className="flex justify-center gap-2 items-center">
              <img
                src={`https://openweathermap.org/img/w/${
                  fetchedWeather && fetchedWeather.weather[0].icon
                }.png`}
                alt="icon"
              />
              <h1 className="text-6xl degree text-textPrimary font-medium">
                {fetchedWeather &&
                  convertKelvinToCelsius(fetchedWeather.main.temp)}
              </h1>
            </div>
            <h4 className="text-xl text-textPrimary font-medium">
              {fetchedWeather && fetchedWeather.weather[0].description}
            </h4>
          </div>
        </>
      )}
      {/* Other infos */}
      <div className="text-lg text-textPrimary text-center font-medium">
        <h4 className="mb-3">{fetchedWeather && fetchedWeather.sys.country}</h4>
        <h4 className="mb-3">
          {fetchedWeather?.dt
            ? convertTimestampToDate(fetchedWeather.dt)
            : "Unknown Date"}
        </h4>
        <h4>
          Feels like{" "}
          {fetchedWeather &&
            convertKelvinToCelsius(fetchedWeather.main.feels_like)}{" "}
          | Sunset&nbsp;
          {fetchedWeather?.dt
            ? convertTimestampToTime(fetchedWeather.sys.sunset)
            : "Unknown Date"}
        </h4>
      </div>
    </div>
  );
};

export default MainWidget;
