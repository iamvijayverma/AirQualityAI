import { motion } from 'framer-motion';
import { MapPin, Activity, Wifi, WifiOff, Settings } from 'lucide-react';
import { Card } from '../ui/Card';
import { Badge } from '../ui/Badge';
import type { MonitoringStation } from '../../types';

interface MonitoringStationsProps {
  stations: MonitoringStation[];
}

const getAQIStyle = (aqi: number) => {
  if (aqi <= 50) return { bg: 'bg-aqi-good', text: 'text-white', label: 'Good' };
  if (aqi <= 100) return { bg: 'bg-aqi-moderate', text: 'text-white', label: 'Moderate' };
  if (aqi <= 150) return { bg: 'bg-aqi-unhealthy', text: 'text-white', label: 'Unhealthy' };
  if (aqi <= 200) return { bg: 'bg-aqi-veryUnhealthy', text: 'text-white', label: 'Very Unhealthy' };
  return { bg: 'bg-aqi-hazardous', text: 'text-white', label: 'Hazardous' };
};

export const MonitoringStations = ({ stations }: MonitoringStationsProps) => {
  const activeStations = stations.filter((s) => s.status === 'active').length;

  return (
    <Card>
      <div className="flex items-start justify-between mb-4">
        <div>
          <h3 className="font-semibold text-secondary-900 dark:text-white">Monitoring Stations</h3>
          <p className="text-xs text-secondary-500 dark:text-secondary-400 mt-0.5">
            {activeStations} of {stations.length} stations active
          </p>
        </div>
        <div className="flex items-center gap-1 px-2 py-1 rounded-lg bg-accent-500/10">
          <Activity className="w-3 h-3 text-accent-500" />
          <span className="text-xs font-medium text-accent-600 dark:text-accent-400">Live</span>
        </div>
      </div>

      <div className="space-y-3">
        {stations.map((station, index) => {
          const aqiStyle = getAQIStyle(station.aqi);
          return (
            <motion.div
              key={station.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
              className="p-3 rounded-xl bg-secondary-50/50 dark:bg-secondary-800/50 hover:bg-secondary-100/50 dark:hover:bg-secondary-700/50 transition-colors"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className={`w-10 h-10 rounded-xl ${aqiStyle.bg} flex items-center justify-center`}>
                    <span className={`text-sm font-bold ${aqiStyle.text}`}>{station.aqi}</span>
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <MapPin className="w-3.5 h-3.5 text-secondary-400" />
                      <p className="text-sm font-medium text-secondary-900 dark:text-white">{station.name}</p>
                    </div>
                    <p className="text-xs text-secondary-500 dark:text-secondary-400">{aqiStyle.label} air quality</p>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  {station.status === 'active' ? (
                    <Wifi className="w-4 h-4 text-accent-500" />
                  ) : station.status === 'maintenance' ? (
                    <Settings className="w-4 h-4 text-amber-500" />
                  ) : (
                    <WifiOff className="w-4 h-4 text-secondary-400" />
                  )}
                  <Badge
                    variant={station.status === 'active' ? 'success' : station.status === 'maintenance' ? 'warning' : 'default'}
                    size="sm"
                  >
                    {station.status}
                  </Badge>
                </div>
              </div>
            </motion.div>
          );
        })}
      </div>
    </Card>
  );
};
