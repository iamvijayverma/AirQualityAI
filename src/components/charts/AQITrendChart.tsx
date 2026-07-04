import { XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Area, AreaChart } from 'recharts';
import { motion } from 'framer-motion';
import { Card, CardHeader } from '../ui/Card';

interface AQITrendChartProps {
  data: { hour: number; aqi: number }[];
  title?: string;
}

const CustomTooltip = ({ active, payload, label }: { active?: boolean; payload?: { value: number }[]; label?: number }) => {
  if (active && payload && payload.length) {
    return (
      <div className="glass-card !p-3 !rounded-lg">
        <p className="text-xs text-secondary-500 dark:text-secondary-400">Hour {label}</p>
        <p className="text-lg font-bold text-secondary-900 dark:text-white">AQI: {payload[0].value}</p>
      </div>
    );
  }
  return null;
};

export const AQITrendChart = ({ data, title = 'AQI Trend (24h)' }: AQITrendChartProps) => {
  return (
    <Card>
      <CardHeader title={title} subtitle="Air quality index over time" />
      <div className="h-64">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={data} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
            <defs>
              <linearGradient id="aqiGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3} />
                <stop offset="95%" stopColor="#3b82f6" stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" opacity={0.5} />
            <XAxis
              dataKey="hour"
              stroke="#94a3b8"
              fontSize={12}
              tickLine={false}
              axisLine={false}
              tickFormatter={(value) => `${value}:00`}
            />
            <YAxis
              stroke="#94a3b8"
              fontSize={12}
              tickLine={false}
              axisLine={false}
              domain={[0, 'auto']}
            />
            <Tooltip content={<CustomTooltip />} />
            <Area
              type="monotone"
              dataKey="aqi"
              stroke="#3b82f6"
              strokeWidth={2}
              fill="url(#aqiGradient)"
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </Card>
  );
};

interface DataSourceChartProps {
  data: { name: string; value: number; color: string }[];
}

export const PollutionSourceChart = ({ data }: DataSourceChartProps) => {
  return (
    <Card>
      <CardHeader title="Pollution Sources" subtitle="Source contribution breakdown" />
      <div className="space-y-4">
        {data.map((item, index) => (
          <div key={item.name} className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-sm text-secondary-700 dark:text-secondary-300">{item.name}</span>
              <span className="text-sm font-medium text-secondary-900 dark:text-white">{item.value}%</span>
            </div>
            <div className="w-full h-2 rounded-full bg-secondary-100 dark:bg-secondary-800 overflow-hidden">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${item.value}%` }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="h-full rounded-full"
                style={{ backgroundColor: item.color }}
              />
            </div>
          </div>
        ))}
      </div>
    </Card>
  );
};
