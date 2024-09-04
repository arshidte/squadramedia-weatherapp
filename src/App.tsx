import { useEffect, useState } from "react";
import "./App.css";
import HourlyWeatherWidget from "./components/HourlyWeatherWidget";
import MainWidget from "./components/MainWidget";
import CityDataWidget from "./components/CityDataWidget";

function App() {
  const [location, setLocation] = useState<{ lat: number; lon: number }>({
    lat: 0,
    lon: 0,
  });
  const [error, setError] = useState("");

  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const lat = position.coords.latitude;
          const lon = position.coords.longitude;
          setLocation({ lat, lon });
        },
        (error) => {
          setError(`Error fetching location: ${error.message}`);
        }
      );
    } else {
      setError("Geolocation is not supported by your browser.");
    }
  }, []);

  return (
    <div className="p-6 lg:p-9">
      <div className="grid grid-cols-7 gap-8">
        <div className="col-span-full lg:col-span-2">
          <MainWidget location={location} error={error} />
        </div>
        <div className="col-span-full lg:col-span-3">
          <HourlyWeatherWidget />
          <div className="text-white mt-10">
            <h4 className="text-xl font-semibold">Random Text</h4>
            <p className="mt-4">
              Improve him believe opinion offered met and end cheered forbade.
              Friendly as stronger speedily by recurred. Son interest wandered
              sir addition end say. Manners beloved affixed picture men ask.
            </p>
          </div>
        </div>
        <div className="col-span-full lg:col-span-2">
          <CityDataWidget />
        </div>
      </div>
    </div>
  );
}

export default App;
