import HourlyWeatherComp from "./HourlyWeatherComp";

const HourlyWeatherWidget = () => {
  return (
    <div className="glass-effect p-3 lg:p-10">
      <div className="flex justify-between">
        <HourlyWeatherComp />
        <HourlyWeatherComp />
        <HourlyWeatherComp />
        <HourlyWeatherComp />
        <HourlyWeatherComp />
      </div>
      <div className="divider"></div>
      <div className="flex justify-between">
        <HourlyWeatherComp />
        <HourlyWeatherComp />
        <HourlyWeatherComp />
        <HourlyWeatherComp />
        <HourlyWeatherComp />
      </div>
    </div>
  );
};

export default HourlyWeatherWidget;
