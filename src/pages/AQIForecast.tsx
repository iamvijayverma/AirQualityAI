import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { TrendingUp, Activity, BarChart3, PieChart } from 'lucide-react';
import { 
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, 
  ResponsiveContainer, PieChart as RechartsPie, Pie, Cell 
} from 'recharts';

import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';
import { Card, CardHeader } from '../components/ui/Card';
import { Badge } from '../components/ui/Badge';
import { LoadingOverlay } from '../components/ui/Loading';
import { forecastApi } from '../services/api';
import { mockForecastResponse } from '../data/mockData';
import type { ForecastRequest, ForecastResponse } from '../types';

export default function AQIForecast() {
  const [formData, setFormData] = useState<ForecastRequest>({
    aqi_1: 150,
    aqi_6: 145,
    aqi_24: 138,
  });
  
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<ForecastResponse>(mockForecastResponse);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const response = await forecastApi.predict(formData);
      setResult({
        predicted_aqi: response.predicted_aqi ?? mockForecastResponse.predicted_aqi,
        confidence: response.confidence ?? mockForecastResponse.confidence,
        trend: response.trend ?? mockForecastResponse.trend,
        forecast_24h: response.forecast_24h ?? mockForecastResponse.forecast_24h,
        sources: response.sources ?? mockForecastResponse.sources,
      });
    } catch {
      setError('Backend unavailable. Showing demo forecast.');
      setResult(mockForecastResponse);
    } finally {
      setLoading(false);
    }
  };

  const getTrendIcon = (trend?: string) => {
    switch (trend) {
      case 'increasing':
        return <TrendingUp className="w-6 h-6 text-red-500" />;
      case 'decreasing':
        return <TrendingUp className="w-6 h-6 text-green-500 rotate-180" />;
      default:
        return <Activity className="w-6 h-6 text-blue-500" />;
    }
  };

  const COLORS = ['#3b82f6', '#f59e0b', '#ef4444', '#8b5cf6'];

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 p-6 md:p-12 font-sans">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-6xl mx-auto space-y-6"
      >
        {/* Header Section */}
        <div className="flex flex-col mb-8 text-left">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
            <Activity className="text-blue-600" /> AQI Forecast Engine
          </h1>
          <p className="text-gray-500 dark:text-gray-400 mt-2 text-lg">
            Predict air quality degradation using temporal analysis
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Input Form */}
          <Card className="lg:col-span-1 relative h-fit">
            {loading && <LoadingOverlay text="Analyzing temporal data..." />}
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
                onChange={(e: any) => setFormData({ ...formData, aqi_1: Number(e.target.value) })}
                min={0}
                max={500}
              />
              <Input
                label="AQI (6 Hour Average)"
                type="number"
                value={formData.aqi_6}
                onChange={(e: any) => setFormData({ ...formData, aqi_6: Number(e.target.value) })}
                min={0}
                max={500}
              />
              <Input
                label="AQI (24 Hour Average)"
                type="number"
                value={formData.aqi_24}
                onChange={(e: any) => setFormData({ ...formData, aqi_24: Number(e.target.value) })}
                min={0}
                max={500}
              />

              {error && (
                <div className="p-3 rounded-lg bg-red-500/10 text-red-600 dark:text-red-400 text-sm font-medium">
                  {error}
                </div>
              )}

              <Button type="submit" className="w-full mt-4" loading={loading}>
                Generate Forecast
              </Button>
            </form>
          </Card>

          {/* Results Dashboard */}
          <div className="lg:col-span-2 space-y-6">
            
            {/* Top Stat Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Card className="flex flex-col items-center justify-center py-8">
                <p className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-3">Predicted AQI (+1H)</p>
                <motion.p
                  key={result.predicted_aqi}
                  initial={{ scale: 0.5, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  className="text-5xl font-black text-gray-900 dark:text-white"
                >
                  {result.predicted_aqi}
                </motion.p>
                <Badge
                  variant={result.predicted_aqi <= 100 ? 'success' : result.predicted_aqi <= 200 ? 'warning' : 'danger'}
                  className="mt-4"
                >
                  {result.predicted_aqi <= 50 ? 'Good' :
                   result.predicted_aqi <= 100 ? 'Moderate' :
                   result.predicted_aqi <= 150 ? 'Unhealthy (Sensitive)' :
                   result.predicted_aqi <= 200 ? 'Unhealthy' : 'Severe'}
                </Badge>
              </Card>

              <Card className="flex flex-col items-center justify-center py-8">
                <p className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-3">Model Confidence</p>
                <motion.p
                  key={result.confidence}
                  initial={{ scale: 0.5, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  className="text-5xl font-black text-blue-600 dark:text-blue-400"
                >
                  {(((result.confidence) ?? 0) * 100).toFixed(0)}%
                </motion.p>
                <p className="text-xs text-gray-400 mt-4 font-medium uppercase tracking-widest">Ensemble Accuracy</p>
              </Card>

              <Card className="flex flex-col items-center justify-center py-8">
                <p className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-3">Trajectory</p>
                <div className="flex items-center justify-center gap-3">
                  {getTrendIcon(result.trend)}
                  <motion.p
                    key={result.trend}
                    initial={{ y: 10, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    className="text-2xl font-bold capitalize text-gray-900 dark:text-white"
                  >
                    {result.trend ?? 'stable'}
                  </motion.p>
                </div>
                <p className="text-xs text-gray-400 mt-4 font-medium uppercase tracking-widest">Expected Shift</p>
              </Card>
            </div>

            {/* Trend Chart */}
            <Card>
              <CardHeader
                title="24-Hour Forecast Trend"
                subtitle="Predicted AQI temporal trajectory"
                icon={<TrendingUp className="w-5 h-5" />}
              />
              <div className="h-72 mt-4">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={result.forecast_24h || []} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                    <defs>
                      <linearGradient id="forecastGradient" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.4} />
                        <stop offset="95%" stopColor="#3b82f6" stopOpacity={0} />
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" opacity={0.4} vertical={false} />
                    <XAxis 
                      dataKey="hour" 
                      stroke="#94a3b8" 
                      fontSize={12} 
                      tickFormatter={(v) => `+${v}h`} 
                      tickLine={false}
                      axisLine={false}
                    />
                    <YAxis 
                      stroke="#94a3b8" 
                      fontSize={12} 
                      tickLine={false}
                      axisLine={false}
                    />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: '#1f2937',
                        border: 'none',
                        borderRadius: '8px',
                        color: '#fff',
                        boxShadow: '0 10px 15px -3px rgba(0,0,0,0.1)',
                      }}
                      itemStyle={{ color: '#fff' }}
                      formatter={(value: any) => [`${value} AQI`, 'Projection']}
                      labelFormatter={(label) => `Target Hour: +${label}h`}
                    />
                    <Area
                      type="monotone"
                      dataKey="aqi"
                      stroke="#3b82f6"
                      strokeWidth={3}
                      fill="url(#forecastGradient)"
                      activeDot={{ r: 6, strokeWidth: 0, fill: '#3b82f6' }}
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </Card>

            {/* Sources Breakdown */}
            <Card>
              <CardHeader
                title="Source Apportionment"
                subtitle="Predicted sector contribution percentages"
                icon={<PieChart className="w-5 h-5" />}
              />
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mt-4">
                <div className="h-56">
                  <ResponsiveContainer width="100%" height="100%">
                    <RechartsPie>
                      <Pie
                        data={result.sources || []}
                        cx="50%"
                        cy="50%"
                        innerRadius={60}
                        outerRadius={85}
                        paddingAngle={5}
                        dataKey="percentage"
                        stroke="none"
                      >
                        {(result.sources || []).map((_, index) => (
                          <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                        ))}
                      </Pie>
                      <Tooltip 
                        contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.1)' }}
                        formatter={(value: any) => [`${value}%`, 'Contribution']}
                      />
                    </RechartsPie>
                  </ResponsiveContainer>
                </div>
                
                <div className="flex flex-col justify-center gap-4 px-4">
                  {(result.sources || []).map((source, index) => (
                    <div key={source.name} className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div
                          className="w-4 h-4 rounded-full shadow-sm"
                          style={{ backgroundColor: COLORS[index % COLORS.length] }}
                        />
                        <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                          {source.name}
                        </span>
                      </div>
                      <span className="text-lg font-bold text-gray-900 dark:text-white">
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
    </div>
  );
}