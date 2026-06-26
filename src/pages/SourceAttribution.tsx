import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Factory, Car, HardHat, GitBranch, RefreshCw } from 'lucide-react';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from 'recharts';
import { Button } from '../components/ui/Button';
import { Card, CardHeader } from '../components/ui/Card';
import { LoadingOverlay } from '../components/ui/Loading';
import { sourceAttributionApi } from '../services/api';
import { mockSourceAttribution } from '../data/mockData';

const COLORS = {
  traffic: '#3b82f6',
  industry: '#f59e0b',
  construction: '#ef4444',
  mixed_source: '#8b5cf6',
};

const SourceAttribution = () => {
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState(mockSourceAttribution);
  const [error, setError] = useState('');

  const fetchData = async () => {
    setLoading(true);
    setError('');
    try {
      const response = await sourceAttributionApi.getAttribution();
      setData(response);
    } catch {
      setError('Failed to fetch data. Using simulated data.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const chartData = [
    { name: 'Traffic', value: data.traffic, color: COLORS.traffic, icon: Car },
    { name: 'Industry', value: data.industry, color: COLORS.industry, icon: Factory },
    { name: 'Construction', value: data.construction, color: COLORS.construction, icon: HardHat },
    { name: 'Mixed Source', value: data.mixed_source, color: COLORS.mixed_source, icon: GitBranch },
  ];

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="space-y-6"
    >
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-secondary-900 dark:text-white">Source Attribution</h1>
          <p className="text-secondary-500 dark:text-secondary-400 mt-1">
            Analyze pollution sources and their contributions
          </p>
        </div>
        <Button
          variant="secondary"
          icon={<RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />}
          onClick={fetchData}
          disabled={loading}
        >
          Refresh
        </Button>
      </div>

      {error && (
        <div className="p-4 rounded-xl bg-amber-500/10 border border-amber-500/20 text-amber-600 dark:text-amber-400">
          {error}
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Pie Chart */}
        <Card className="lg:col-span-2 relative">
          {loading && <LoadingOverlay text="Analyzing sources..." />}
          <CardHeader
            title="Pollution Source Distribution"
            subtitle="Current attribution analysis"
            icon={<Factory className="w-5 h-5" />}
          />
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={chartData}
                  cx="50%"
                  cy="50%"
                  innerRadius={80}
                  outerRadius={140}
                  paddingAngle={4}
                  dataKey="value"
                  animationBegin={0}
                  animationDuration={800}
                >
                  {chartData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                  <Tooltip
                    contentStyle={{
                      backgroundColor: 'rgba(255,255,255,0.95)',
                      border: 'none',
                      borderRadius: '12px',
                      boxShadow: '0 8px 32px rgba(0,0,0,0.1)',
                    }}
                    formatter={(value: number) => [`${value}%`, 'Contribution']}
                  />
                </Pie>
                <Legend
                  verticalAlign="bottom"
                  height={36}
                  formatter={(value) => (
                    <span className="text-sm text-secondary-600 dark:text-secondary-400">{value}</span>
                  )}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </Card>

        {/* Detailed Breakdown */}
        <div className="space-y-4">
          {chartData.map((item, index) => (
            <motion.div
              key={item.name}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <Card className="!p-4">
                <div className="flex items-center gap-4">
                  <div
                    className="w-12 h-12 rounded-xl flex items-center justify-center"
                    style={{ backgroundColor: `${item.color}20` }}
                  >
                    <item.icon className="w-6 h-6" style={{ color: item.color }} />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center justify-between mb-2">
                      <h4 className="font-medium text-secondary-900 dark:text-white">{item.name}</h4>
                      <span className="text-xl font-bold" style={{ color: item.color }}>
                        {item.value}%
                      </span>
                    </div>
                    <div className="w-full h-2 rounded-full bg-secondary-100 dark:bg-secondary-800 overflow-hidden">
                      <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: `${item.value}%` }}
                        transition={{ duration: 0.8, ease: 'easeOut' }}
                        className="h-full rounded-full"
                        style={{ backgroundColor: item.color }}
                      />
                    </div>
                  </div>
                </div>
              </Card>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Recommendations */}
      <Card>
        <CardHeader
          title="Source-Specific Recommendations"
          subtitle="Actions to reduce pollution from each source"
        />
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mt-4">
          {chartData.map((item, index) => (
            <motion.div
              key={item.name}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 + index * 0.1 }}
              className="p-4 rounded-xl bg-secondary-50/50 dark:bg-secondary-800/50"
            >
              <div className="flex items-center gap-3 mb-3">
                <item.icon className="w-5 h-5" style={{ color: item.color }} />
                <h4 className="font-medium text-secondary-900 dark:text-white">{item.name}</h4>
              </div>
              <ul className="space-y-2 text-sm text-secondary-600 dark:text-secondary-400">
                {item.name === 'Traffic' && (
                  <>
                    <li>Implement odd-even scheme</li>
                    <li>Increase public transport</li>
                    <li>Traffic flow optimization</li>
                  </>
                )}
                {item.name === 'Industry' && (
                  <>
                    <li>Strengthen emission norms</li>
                    <li>Regular inspections</li>
                    <li>Promote clean technology</li>
                  </>
                )}
                {item.name === 'Construction' && (
                  <>
                    <li>Mandate dust barriers</li>
                    <li>Water sprinkling</li>
                    <li>Cover material transport</li>
                  </>
                )}
                {item.name === 'Mixed Source' && (
                  <>
                    <li>Comprehensive monitoring</li>
                    <li>Multi-source mitigation</li>
                    <li>Area-based approach</li>
                  </>
                )}
              </ul>
            </motion.div>
          ))}
        </div>
      </Card>
    </motion.div>
  );
};

export default SourceAttribution;
