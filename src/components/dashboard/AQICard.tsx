import { motion } from 'framer-motion';
import { Wind, Droplets, Thermometer, Gauge } from 'lucide-react';
import { Card } from '../ui/Card';

interface CurrentAQICardProps {
  aqi: number;
  pm25: number;
  pm10: number;
  o3: number;
  location: string;
}

const getAQICategory = (aqi: number) => {
  if (aqi <= 50) return { label: 'Good', color: 'bg-aqi-good', textColor: 'text-aqi-good', bgLight: 'bg-aqi-good/10' };
  if (aqi <= 100) return { label: 'Moderate', color: 'bg-aqi-moderate', textColor: 'text-aqi-moderate', bgLight: 'bg-aqi-moderate/10' };
  if (aqi <= 150) return { label: 'Unhealthy for Sensitive', color: 'bg-aqi-unhealthy', textColor: 'text-aqi-unhealthy', bgLight: 'bg-aqi-unhealthy/10' };
  if (aqi <= 200) return { label: 'Unhealthy', color: 'bg-aqi-veryUnhealthy', textColor: 'text-aqi-veryUnhealthy', bgLight: 'bg-aqi-veryUnhealthy/10' };
  return { label: 'Hazardous', color: 'bg-aqi-hazardous', textColor: 'text-aqi-hazardous', bgLight: 'bg-aqi-hazardous/10' };
};

export const CurrentAQICard = ({ aqi, pm25, pm10, o3, location }: CurrentAQICardProps) => {
  const category = getAQICategory(aqi);

  return (
    <Card className="relative overflow-hidden">
      <div className="flex items-start justify-between mb-4">
        <div>
          <p className="text-sm font-medium text-secondary-500 dark:text-secondary-400">Current AQI</p>
          <p className="text-xs text-secondary-400 dark:text-secondary-500 mt-0.5">{location}</p>
        </div>
        <div className={`px-3 py-1 rounded-full ${category.bgLight}`}>
          <span className={`text-sm font-medium ${category.textColor}`}>{category.label}</span>
        </div>
      </div>

      <div className="flex items-end gap-4 mb-6">
        <div className="relative">
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: 'spring', stiffness: 200, damping: 20 }}
            className={`w-32 h-32 rounded-full ${category.color} flex items-center justify-center`}
          >
            <span className="text-5xl font-bold text-white">{aqi}</span>
          </motion.div>
          <motion.div
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 0.3 }}
            transition={{ delay: 0.2 }}
            className={`absolute inset-0 rounded-full ${category.color} animate-ping`}
          />
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div className="p-3 rounded-xl bg-secondary-100/50 dark:bg-secondary-800/50">
            <div className="flex items-center gap-2 mb-1">
              <Wind className="w-4 h-4 text-primary-500" />
              <span className="text-xs text-secondary-500">PM2.5</span>
            </div>
            <p className="text-lg font-bold text-secondary-900 dark:text-white">{pm25}</p>
          </div>
          <div className="p-3 rounded-xl bg-secondary-100/50 dark:bg-secondary-800/50">
            <div className="flex items-center gap-2 mb-1">
              <Droplets className="w-4 h-4 text-primary-500" />
              <span className="text-xs text-secondary-500">PM10</span>
            </div>
            <p className="text-lg font-bold text-secondary-900 dark:text-white">{pm10}</p>
          </div>
          <div className="p-3 rounded-xl bg-secondary-100/50 dark:bg-secondary-800/50 col-span-2">
            <div className="flex items-center gap-2 mb-1">
              <Thermometer className="w-4 h-4 text-primary-500" />
              <span className="text-xs text-secondary-500">O3</span>
            </div>
            <p className="text-lg font-bold text-secondary-900 dark:text-white">{o3} ppb</p>
          </div>
        </div>
      </div>

      <div className="flex items-center gap-2 text-xs text-secondary-500 dark:text-secondary-400">
        <div className="w-2 h-2 rounded-full bg-accent-500 animate-pulse" />
        Live data from monitoring stations
      </div>
    </Card>
  );
};

interface ForecastCardProps {
  forecast: { hour: number; aqi: number }[];
}

export const ForecastCard = ({ forecast }: ForecastCardProps) => {
  const next6 = forecast.slice(0, 6);

  return (
    <Card>
      <div className="flex items-center justify-between mb-4">
        <h3 className="font-semibold text-secondary-900 dark:text-white">AQI Forecast</h3>
        <span className="text-xs text-secondary-500 dark:text-secondary-400">Next 6 hours</span>
      </div>

      <div className="grid grid-cols-6 gap-2">
        {next6.map((item, index) => {
          const category = getAQICategory(item.aqi);
          return (
            <motion.div
              key={item.hour}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="text-center"
            >
              <div className={`mx-auto w-12 h-12 rounded-xl ${category.bgLight} flex items-center justify-center mb-2`}>
                <span className={`font-bold ${category.textColor}`}>{item.aqi}</span>
              </div>
              <p className="text-xs text-secondary-500 dark:text-secondary-400">
                {item.hour === 0 ? 'Now' : `+${item.hour}h`}
              </p>
            </motion.div>
          );
        })}
      </div>
    </Card>
  );
};

interface WeatherCardProps {
  temperature: number;
  humidity: number;
  windSpeed: number;
  windDirection: string;
  condition: string;
}

export const WeatherCard = ({ temperature, humidity, windSpeed, windDirection, condition }: WeatherCardProps) => {
  return (
    <Card className="bg-gradient-to-br from-primary-500/10 to-accent-500/10 dark:from-primary-500/5 dark:to-accent-500/5">
      <div className="flex items-start justify-between mb-4">
        <div>
          <h3 className="font-semibold text-secondary-900 dark:text-white">Weather</h3>
          <p className="text-sm text-secondary-500 dark:text-secondary-400">{condition}</p>
        </div>
        <div className="text-right">
          <p className="text-3xl font-bold text-secondary-900 dark:text-white">{temperature}°C</p>
        </div>
      </div>

      <div className="grid grid-cols-3 gap-3">
        <div className="p-3 rounded-xl bg-white/50 dark:bg-secondary-800/50">
          <div className="flex items-center gap-2 mb-1">
            <Droplets className="w-4 h-4 text-primary-500" />
            <span className="text-xs text-secondary-500">Humidity</span>
          </div>
          <p className="text-lg font-bold text-secondary-900 dark:text-white">{humidity}%</p>
        </div>
        <div className="p-3 rounded-xl bg-white/50 dark:bg-secondary-800/50">
          <div className="flex items-center gap-2 mb-1">
            <Wind className="w-4 h-4 text-primary-500" />
            <span className="text-xs text-secondary-500">Wind</span>
          </div>
          <p className="text-lg font-bold text-secondary-900 dark:text-white">{windSpeed} km/h</p>
        </div>
        <div className="p-3 rounded-xl bg-white/50 dark:bg-secondary-800/50">
          <div className="flex items-center gap-2 mb-1">
            <Gauge className="w-4 h-4 text-primary-500" />
            <span className="text-xs text-secondary-500">Direction</span>
          </div>
          <p className="text-lg font-bold text-secondary-900 dark:text-white">{windDirection}</p>
        </div>
      </div>
    </Card>
  );
};
