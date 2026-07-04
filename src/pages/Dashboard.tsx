import { motion } from 'framer-motion';
import {
  CurrentAQICard,
  ForecastCard,
  WeatherCard,
  AlertsCard,
  MonitoringStations,
  QuickActions,
} from '../components/dashboard';
import { AQITrendChart, PollutionSourceChart } from '../components/charts';
import {
  mockCurrentAQI,
  mockWeather,
  mockAlerts,
  mockStations,
  mockAQITrend,
  mockPollutionSources,
  mockForecastResponse,
} from '../data/mockData';

const Dashboard = () => {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="space-y-6"
    >
      {/* Quick Actions */}
      <QuickActions />

      {/* Main Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column - AQI & Forecast */}
        <div className="lg:col-span-2 space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <CurrentAQICard
              aqi={mockCurrentAQI.aqi}
              pm25={mockCurrentAQI.pm25}
              pm10={mockCurrentAQI.pm10}
              o3={mockCurrentAQI.o3}
              location={mockCurrentAQI.location}
            />
            <WeatherCard
              temperature={mockWeather.temperature}
              humidity={mockWeather.humidity}
              windSpeed={mockWeather.wind_speed}
              windDirection={mockWeather.wind_direction}
              condition={mockWeather.condition}
            />
          </div>

          <AQITrendChart data={mockAQITrend} />

          <AlertsCard alerts={mockAlerts} />
        </div>

        {/* Right Column - Forecast & Stations */}
        <div className="space-y-6">
          <ForecastCard forecast={mockForecastResponse.forecast_24h || []} />
          <PollutionSourceChart data={mockPollutionSources} />
          <MonitoringStations stations={mockStations} />
        </div>
      </div>
    </motion.div>
  );
};

export default Dashboard;
