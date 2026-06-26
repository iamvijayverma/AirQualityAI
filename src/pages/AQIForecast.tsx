import { useState } from 'react';
import { motion } from 'framer-motion';
import { TrendingUp, Activity, BarChart3, PieChart } from 'lucide-react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart as RechartsPie, Pie, Cell } from 'recharts';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';
import { Card, CardHeader } from '../components/ui/Card';
import { Badge } from '../components/ui/Badge';
import { LoadingOverlay } from '../components/ui/Loading';
import { forecastApi } from '../services/api';
import { mockForecastResponse } from '../data/mockData';
import type { ForecastRequest } from '../types';

const AQIForecast = () => {
  const [formData, setFormData] = useState<ForecastRequest>({
    aqi_1: 150,
    aqi_6: 145,
    aqi_24: 138,
  });
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(mockForecastResponse);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const response = await forecastApi.predict(formData);
      setResult(response);
    } catch {
      setError('Failed to get forecast. Using simulated data.');
      setResult(mockForecastResponse);
    } finally {
      setLoading(false);
    }
  };

  const getTrendIcon = (trend: string) => {
    switch (trend) {
      case 'increasing':
        return <TrendingUp className="w-5 h-5 text-red-500" />;
      case 'decreasing':
        return <TrendingUp className="w-5 h-5 text-accent-500 rotate-180" />;
      default:
        return <Activity className="w-5 h-5 text-primary-500" />;
    }
  };

  const COLORS = ['#3b82f6', '#f59e0b', '#ef4444', '#8b5cf6'];

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="space-y-6"
    >
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-secondary-900 dark:text-white">AQI Forecast</h1>
          <p className="text-secondary-500 dark:text-secondary-400 mt-1">
            Predict air quality using AI-powered analysis
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Input Form */}
        <Card className="lg:col-span-1 relative">
          {loading && <LoadingOverlay text="Analyzing..." />}
          <CardHeader
            title="Input Parameters"
            subtitle="Enter recent AQI readings"
            icon={<BarChart3 className="w-5 h-5" />}
          />

          <form onSubmit={handleSubmit} className="space-y-5">
            <Input
              label="AQI (Last 1 Hour)"
              type="number"
              value={formData.aqi_1}
              onChange={(e) => setFormData({ ...formData, aqi_1: Number(e.target.value) })}
              min={0}
              max={500}
            />
            <Input
              label="AQI (6 Hour Average)"
              type="number"
              value={formData.aqi_6}
              onChange={(e) => setFormData({ ...formData, aqi_6: Number(e.target.value) })}
              min={0}
              max={500}
            />
            <Input
              label="AQI (24 Hour Average)"
              type="number"
              value={formData.aqi_24}
              onChange={(e) => setFormData({ ...formData, aqi_24: Number(e.target.value) })}
              min={0}
              max={500}
            />

            {error && (
              <div className="p-3 rounded-xl bg-red-500/10 text-red-600 dark:text-red-400 text-sm">
                {error}
              </div>
            )}

            <Button type="submit" variant="primary" size="lg" className="w-full" loading={loading}>
              Generate Forecast
            </Button>
          </form>
        </Card>

        {/* Results */}
        <div className="lg:col-span-2 space-y-6">
          {/* Prediction Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Card>
              <div className="text-center">
                <p className="text-sm text-secondary-500 dark:text-secondary-400 mb-2">Predicted AQI</p>
                <motion.p
                  key={result.predicted_aqi}
                  initial={{ scale: 0.5, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  className="text-4xl font-bold text-secondary-900 dark:text-white"
                >
                  {result.predicted_aqi}
                </motion.p>
                <Badge
                  variant={result.predicted_aqi <= 100 ? 'success' : result.predicted_aqi <= 200 ? 'warning' : 'danger'}
                  className="mt-2"
                >
                  {result.predicted_aqi <= 50 ? 'Good' :
                   result.predicted_aqi <= 100 ? 'Moderate' :
                   result.predicted_aqi <= 150 ? 'Unhealthy for Sensitive' :
                   result.predicted_aqi <= 200 ? 'Unhealthy' : 'Very Unhealthy'}
                </Badge>
              </div>
            </Card>

            <Card>
              <div className="text-center">
                <p className="text-sm text-secondary-500 dark:text-secondary-400 mb-2">Confidence</p>
                <motion.p
                  key={result.confidence}
                  initial={{ scale: 0.5, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  className="text-4xl font-bold text-primary-500"
                >
                  {(result.confidence * 100).toFixed(0)}%
                </motion.p>
                <p className="text-xs text-secondary-400 mt-2">Model accuracy</p>
              </div>
            </Card>

            <Card>
              <div className="text-center">
                <p className="text-sm text-secondary-500 dark:text-secondary-400 mb-2">Trend</p>
                <div className="flex items-center justify-center gap-2">
                  {getTrendIcon(result.trend)}
                  <motion.p
                    key={result.trend}
                    initial={{ y: 10, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    className="text-xl font-bold capitalize text-secondary-900 dark:text-white"
                  >
                    {result.trend}
                  </motion.p>
                </div>
                <p className="text-xs text-secondary-400 mt-2">Expected direction</p>
              </div>
            </Card>
          </div>

          {/* Trend Chart */}
          <Card>
            <CardHeader
              title="24-Hour Forecast Trend"
              subtitle="Predicted AQI values"
              icon={<TrendingUp className="w-5 h-5" />}
            />
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={result.forecast_24h}>
                  <defs>
                    <linearGradient id="forecastGradient" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3} />
                      <stop offset="95%" stopColor="#3b82f6" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" opacity={0.5} />
                  <XAxis dataKey="hour" stroke="#94a3b8" fontSize={12} tickFormatter={(v) => `${v}h`} />
                  <YAxis stroke="#94a3b8" fontSize={12} />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: 'rgba(255,255,255,0.9)',
                      border: 'none',
                      borderRadius: '12px',
                      boxShadow: '0 8px 32px rgba(0,0,0,0.1)',
                    }}
                    formatter={(value: number) => [`AQI: ${value}`, 'Forecast']}
                  />
                  <Area
                    type="monotone"
                    dataKey="aqi"
                    stroke="#3b82f6"
                    strokeWidth={2}
                    fill="url(#forecastGradient)"
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </Card>

          {/* Sources */}
          <Card>
            <CardHeader
              title="Source Attribution"
              subtitle="Predicted pollution sources"
              icon={<PieChart className="w-5 h-5" />}
            />
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="h-48">
                <ResponsiveContainer width="100%" height="100%">
                  <RechartsPie>
                    <Pie
                      data={result.sources}
                      cx="50%"
                      cy="50%"
                      innerRadius={40}
                      outerRadius={70}
                      paddingAngle={2}
                      dataKey="percentage"
                    >
                      {result.sources.map((_, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </RechartsPie>
                </ResponsiveContainer>
              </div>
              <div className="flex flex-col justify-center gap-3">
                {result.sources.map((source, index) => (
                  <div key={source.name} className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div
                        className="w-3 h-3 rounded-full"
                        style={{ backgroundColor: COLORS[index] }}
                      />
                      <span className="text-sm text-secondary-700 dark:text-secondary-300">
                        {source.name}
                      </span>
                    </div>
                    <span className="text-sm font-medium text-secondary-900 dark:text-white">
                      {source.percentage}%
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </Card>
        </div>
      </div>
    </motion.div>
  );
};

export default AQIForecast;
