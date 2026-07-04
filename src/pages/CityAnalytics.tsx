import { useState } from 'react';
import { motion } from 'framer-motion';
import { Building2, TrendingUp, TrendingDown, Minus, RefreshCw, ArrowUpDown } from 'lucide-react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar, Cell } from 'recharts';
import { Button } from '../components/ui/Button';
import { Card, CardHeader } from '../components/ui/Card';
import { Badge } from '../components/ui/Badge';
import { LoadingOverlay } from '../components/ui/Loading';
import { mockCities } from '../data/mockData';
import type { CityData } from '../types';


const trendStyles = {
  improving: { icon: TrendingDown, color: 'text-accent-500', badge: 'success' as const },
  declining: { icon: TrendingUp, color: 'text-red-500', badge: 'danger' as const },
  stable: { icon: Minus, color: 'text-amber-500', badge: 'warning' as const },
};

const getAQIColor = (aqi: number) => {
  if (aqi <= 50) return '#10b981';
  if (aqi <= 100) return '#f59e0b';
  if (aqi <= 150) return '#f97316';
  if (aqi <= 200) return '#ef4444';
  return '#7c2d12';
};

const CityAnalytics = () => {
  const [loading] = useState(false);
  const [selectedCities, setSelectedCities] = useState<string[]>(['Jaipur', 'Delhi', 'Mumbai', 'Bengaluru']);
  const [cities] = useState<CityData[]>(mockCities);
  const [sortField, setSortField] = useState<'aqi' | 'pm25' | 'pm10'>('aqi');
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('asc');

  const handleSort = (field: 'aqi' | 'pm25' | 'pm10') => {
    if (sortField === field) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('asc');
    }
  };

  const sortedCities = [...cities].sort((a, b) => {
    const multiplier = sortDirection === 'asc' ? 1 : -1;
    return (a[sortField] - b[sortField]) * multiplier;
  });

  const toggleCity = (cityName: string) => {
    if (selectedCities.includes(cityName)) {
      setSelectedCities(selectedCities.filter((c) => c !== cityName));
    } else {
      setSelectedCities([...selectedCities, cityName]);
    }
  };


  const selectedCityData = cities.filter((c) => selectedCities.includes(c.name));

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="space-y-6"
    >
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-secondary-900 dark:text-white">City Analytics</h1>
          <p className="text-secondary-500 dark:text-secondary-400 mt-1">
            Compare air quality across different cities
          </p>
        </div>
        <Button
          variant="secondary"
          icon={<RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />}
          disabled={loading}
        >
          Refresh
        </Button>
      </div>

      {/* City Selection */}
      <Card>
        <CardHeader title="Select Cities to Compare" subtitle="Click to toggle city selection" />
        <div className="flex flex-wrap gap-3 mt-4">
          {cities.map((city) => (
            <motion.button
              key={city.name}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => toggleCity(city.name)}
              className={`px-4 py-2 rounded-xl font-medium text-sm transition-all ${
                selectedCities.includes(city.name)
                  ? 'bg-primary-500 text-white shadow-lg shadow-primary-500/25'
                  : 'bg-secondary-100 dark:bg-secondary-800 text-secondary-700 dark:text-secondary-300 hover:bg-secondary-200 dark:hover:bg-secondary-700'
              }`}
            >
              {city.name}
            </motion.button>
          ))}
        </div>
      </Card>

      {/* Comparison Table */}
      <Card className="relative">
        {loading && <LoadingOverlay />}
        <CardHeader title="City Comparison" subtitle="Air quality metrics" icon={<Building2 className="w-5 h-5" />} />
        <div className="overflow-x-auto mt-4">
          <table className="w-full">
            <thead>
              <tr className="border-b border-secondary-200 dark:border-secondary-700">
                <th className="text-left py-3 px-4 text-sm font-medium text-secondary-500">City</th>
                <th
                  className="text-left py-3 px-4 text-sm font-medium text-secondary-500 cursor-pointer hover:text-secondary-700 dark:hover:text-secondary-300"
                  onClick={() => handleSort('aqi')}
                >
                  <div className="flex items-center gap-1">
                    AQI
                    {sortField === 'aqi' && <ArrowUpDown className="w-4 h-4" />}
                  </div>
                </th>
                <th
                  className="text-left py-3 px-4 text-sm font-medium text-secondary-500 cursor-pointer hover:text-secondary-700 dark:hover:text-secondary-300"
                  onClick={() => handleSort('pm25')}
                >
                  <div className="flex items-center gap-1">
                    PM2.5
                    {sortField === 'pm25' && <ArrowUpDown className="w-4 h-4" />}
                  </div>
                </th>
                <th
                  className="text-left py-3 px-4 text-sm font-medium text-secondary-500 cursor-pointer hover:text-secondary-700 dark:hover:text-secondary-300"
                  onClick={() => handleSort('pm10')}
                >
                  <div className="flex items-center gap-1">
                    PM10
                    {sortField === 'pm10' && <ArrowUpDown className="w-4 h-4" />}
                  </div>
                </th>
                <th className="text-left py-3 px-4 text-sm font-medium text-secondary-500">Trend</th>
              </tr>
            </thead>
            <tbody>
              {sortedCities.map((city, index) => {
                const trendStyle = trendStyles[city.trend];
                return (
                  <motion.tr
                    key={city.name}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.05 }}
                    className={`border-b border-secondary-100 dark:border-secondary-800 ${
                      selectedCities.includes(city.name) ? 'bg-primary-50/50 dark:bg-primary-500/5' : ''
                    }`}
                  >
                    <td className="py-4 px-4">
                      <div className="flex items-center gap-3">
                        <div
                          className="w-10 h-10 rounded-xl flex items-center justify-center text-white font-bold text-sm"
                          style={{ backgroundColor: getAQIColor(city.aqi) }}
                        >
                          {city.name.substring(0, 2).toUpperCase()}
                        </div>
                        <span className="font-medium text-secondary-900 dark:text-white">{city.name}</span>
                      </div>
                    </td>
                    <td className="py-4 px-4">
                      <span
                        className="text-xl font-bold"
                        style={{ color: getAQIColor(city.aqi) }}
                      >
                        {city.aqi}
                      </span>
                    </td>
                    <td className="py-4 px-4">
                      <span className="text-lg font-semibold text-secondary-900 dark:text-white">
                        {city.pm25}
                      </span>
                    </td>
                    <td className="py-4 px-4">
                      <span className="text-lg font-semibold text-secondary-900 dark:text-white">
                        {city.pm10}
                      </span>
                    </td>
                    <td className="py-4 px-4">
                      <div className="flex items-center gap-2">
                        <trendStyle.icon className={`w-4 h-4 ${trendStyle.color}`} />
                        <Badge variant={trendStyle.badge} size="sm">
                          {city.trend}
                        </Badge>
                      </div>
                    </td>
                  </motion.tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </Card>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* AQI Comparison Bar Chart */}
        <Card>
          <CardHeader title="AQI Comparison" subtitle="Current air quality index" />
          <div className="h-64 mt-4">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={selectedCityData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" opacity={0.5} />
                <XAxis dataKey="name" stroke="#94a3b8" fontSize={12} />
                <YAxis stroke="#94a3b8" fontSize={12} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: 'rgba(255,255,255,0.95)',
                    border: 'none',
                    borderRadius: '12px',
                    boxShadow: '0 8px 32px rgba(0,0,0,0.1)',
                  }}
                />
                <Bar dataKey="aqi" radius={[8, 8, 0, 0]}>
                  {selectedCityData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={getAQIColor(entry.aqi)} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </Card>

        {/* Forecast Comparison */}
        <Card>
          <CardHeader title="AQI Forecast Comparison" subtitle="Next 6 hours forecast" />
          <div className="h-64 mt-4">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart
                data={Array.from({ length: 6 }, (_, i) => {
                  const hourData: Record<string, number> = { hour: i };
                  selectedCityData.forEach((city) => {
                    hourData[city.name] = city.forecast[i];
                  });
                  return hourData;
                })}
              >
                <defs>
                  {selectedCityData.map((city, index) => (
                    <linearGradient key={city.name} id={`gradient-${index}`} x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor={getAQIColor(city.aqi)} stopOpacity={0.3} />
                      <stop offset="95%" stopColor={getAQIColor(city.aqi)} stopOpacity={0} />
                    </linearGradient>
                  ))}
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" opacity={0.5} />
                <XAxis dataKey="hour" stroke="#94a3b8" fontSize={12} tickFormatter={(v) => `+${v}h`} />
                <YAxis stroke="#94a3b8" fontSize={12} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: 'rgba(255,255,255,0.95)',
                    border: 'none',
                    borderRadius: '12px',
                    boxShadow: '0 8px 32px rgba(0,0,0,0.1)',
                  }}
                />
                {selectedCityData.map((city, index) => (
                  <Area
                    key={city.name}
                    type="monotone"
                    dataKey={city.name}
                    stroke={getAQIColor(city.aqi)}
                    strokeWidth={2}
                    fill={`url(#gradient-${index})`}
                  />
                ))}
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </Card>
      </div>

      {/* Detailed City Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {selectedCityData.map((city, index) => (
          <motion.div
            key={city.name}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
          >
            <Card className="relative overflow-hidden">
              <div
                className="absolute top-0 left-0 w-full h-2"
                style={{ backgroundColor: getAQIColor(city.aqi) }}
              />
              <div className="pt-2">
                <h3 className="font-semibold text-secondary-900 dark:text-white mb-4">{city.name}</h3>
                <div className="space-y-4">
                  <div>
                    <p className="text-xs text-secondary-500 dark:text-secondary-400">Current AQI</p>
                    <p
                      className="text-3xl font-bold"
                      style={{ color: getAQIColor(city.aqi) }}
                    >
                      {city.aqi}
                    </p>
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <div className="p-2 rounded-lg bg-secondary-100/50 dark:bg-secondary-800/50">
                      <p className="text-xs text-secondary-500">PM2.5</p>
                      <p className="text-lg font-bold text-secondary-900 dark:text-white">{city.pm25}</p>
                    </div>
                    <div className="p-2 rounded-lg bg-secondary-100/50 dark:bg-secondary-800/50">
                      <p className="text-xs text-secondary-500">PM10</p>
                      <p className="text-lg font-bold text-secondary-900 dark:text-white">{city.pm10}</p>
                    </div>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-secondary-500">Trend</span>
                    <div className="flex items-center gap-2">
                      {(() => {
                        const style = trendStyles[city.trend];
                        const Icon = style.icon;
                        return (
                          <>
                            <Icon className={`w-4 h-4 ${style.color}`} />
                            <span className="text-sm font-medium capitalize">{city.trend}</span>
                          </>
                        );
                      })()}
                    </div>
                  </div>
                </div>
              </div>
            </Card>
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
};

export default CityAnalytics;
