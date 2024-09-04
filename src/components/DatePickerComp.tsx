import { useEffect, useState } from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { apiCall } from "../services/apiCall";

const DatePickerComp = () => {
  const [weatherData, setWeatherData] = useState<any>(null);
  const [startDate, setStartDate] = useState<Date | null>(null);
  const [endDate, setEndDate] = useState<Date | null>(null);
  const [selectedOption, setSelectedOption] = useState<string>("");
  const [error, setError] = useState<string>("");
  const [loader, setLoader] = useState(false);

  // Handler function for select change
  const handleSelectChange = (e: any) => {
    e.preventDefault();
    setSelectedOption(e.target.value);
  };

  const submitHandler = async () => {
    setLoader(true);

    if (!startDate || !endDate) {
      setLoader(false);
      setError("Select start and end dates");
      return;
    }

    const diffTime = Math.abs(endDate.getTime() - startDate.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays > 30) {
      // If the difference is more than 30 days, show an error or prevent action
      setLoader(false);
      setError("The date range shouldn't exceed 30 days");
      return;
    }

    const start = new Date(startDate);
    const end = new Date(endDate);

    const fetchedData = [];

    try {
      const geocodeResponse = await apiCall(
        `https://api.openweathermap.org/data/2.5/weather?id=${selectedOption}`,
        "get"
      );
      const { lat, lon } = geocodeResponse?.data.coord;

      for (let date = start; date <= end; date.setDate(date.getDate() + 1)) {
        console.log(date);

        const response = await apiCall(
          `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&start=${Math.floor(
            date.getTime() / 1000
          )}&end=${Math.floor(date.getTime() / 1000)}`,
          "get"
        );
        // https://api.openweathermap.org/data/3.0/onecall/timemachine?lat={lat}&lon={lon}&dt={time}&appid={API_KEY}

        fetchedData.push(response && response.data);
      }
    } catch (error) {
      setError("Error fetching weather data");
      setLoader(false);
      return;
    }

    setWeatherData(fetchedData);
    setLoader(false);
    console.log(fetchedData);
  };

  const convertKelvinToCelsius = (kelvin: number) => {
    return (kelvin - 273.15).toFixed(2);
  };

  const convertTimestampToDate = (timestamp: number) => {
    const date = new Date(timestamp * 1000);
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  useEffect(() => {
    if (error != "") {
      setTimeout(() => {
        setError("");
      }, 2000);
    }
  }, [error]);

  return (
    <div className="rounded-lg flex flex-col justify-center">
      <div className="flex gap-2">
        <DatePicker
          selected={startDate}
          onChange={(date: Date | null) => setStartDate(date)}
          className="border p-2 rounded-md w-full text-gray-700"
          placeholderText="Select start date"
        />
        <DatePicker
          selected={endDate}
          onChange={(date: Date | null) => setEndDate(date)}
          className="border p-2 rounded-md w-full text-gray-700"
          placeholderText="Select end date"
        />
      </div>
      <div className="mt-2 gap-2 flex justify-center">
        <select
          id="options"
          value={selectedOption}
          onChange={handleSelectChange}
          className="p-2 rounded-md text-gray-700"
        >
          <option value="" disabled>
            Select city
          </option>
          <option value="1261481">Delhi</option>
          <option value="524894">Moscow</option>
          <option value="6618607">Paris</option>
          <option value="2147714">Sydney</option>
          <option value="108410">Riyadh</option>
        </select>
      </div>
      <div className="flex justify-center">
        <button
          type="submit"
          className="p-2 rounded-md bg-white text-black mt-2 flex justify-center font-medium w-20 hover:bg-slate-300"
          onClick={submitHandler}
        >
          Submit
        </button>
      </div>
      {loader ? (
        <>Loading...</>
      ) : error ? (
        <>{error}</>
      ) : weatherData ? (
        weatherData.map((fetchedWeather: any, idx: number) => (
          <div key={idx}>
            <div className="divider"></div>
            <div className="flex flex-col items-center">
              <h4>
                {fetchedWeather?.dt
                  ? convertTimestampToDate(fetchedWeather.dt)
                  : "Unknown Date"}
              </h4>
              <div className="flex items-center">
                <img
                  src={`https://openweathermap.org/img/w/${
                    fetchedWeather && fetchedWeather.weather[0].icon
                  }.png`}
                  alt="icon"
                />
                <h1 className="text-xl degree font-medium">
                  {fetchedWeather &&
                    convertKelvinToCelsius(fetchedWeather.main.temp)}
                </h1>
              </div>
              <h4 className="text-lg font-medium">
                {fetchedWeather && fetchedWeather.weather[0].description}
              </h4>
            </div>
          </div>
        ))
      ) : (
        <></>
      )}
    </div>
  );
};

export default DatePickerComp;
