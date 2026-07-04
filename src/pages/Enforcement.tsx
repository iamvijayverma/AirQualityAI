import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Shield, Target, AlertTriangle, CheckCircle, TrendingUp, BarChart2, RefreshCw } from 'lucide-react';
import { Button } from '../components/ui/Button';
import { Card, CardHeader } from '../components/ui/Card';
import { Badge } from '../components/ui/Badge';
import { Progress } from '../components/ui/Progress';
import { LoadingOverlay } from '../components/ui/Loading';
import { enforcementApi } from '../services/api';
import { mockEnforcement } from '../data/mockData';
import type { EnforcementResponse } from '../types';

const priorityStyles = {
  high: { bg: 'bg-red-500/10', text: 'text-red-600 dark:text-red-400', badge: 'danger' as const },
  medium: { bg: 'bg-amber-500/10', text: 'text-amber-600 dark:text-amber-400', badge: 'warning' as const },
  low: { bg: 'bg-accent-500/10', text: 'text-accent-600 dark:text-accent-400', badge: 'success' as const },
};

const Enforcement = () => {
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState<EnforcementResponse>(mockEnforcement);
  const [error, setError] = useState('');

  const fetchData = async () => {
    setLoading(true);
    setError('');
    try {
      const response = await enforcementApi.getEnforcement();
      setData({
        priority_actions: response.priority_actions ?? mockEnforcement.priority_actions,
        aqi_reduction: response.aqi_reduction ?? mockEnforcement.aqi_reduction,
        expected_aqi_reduction: response.expected_aqi_reduction ?? mockEnforcement.expected_aqi_reduction,
        risk_level: response.risk_level ?? mockEnforcement.risk_level,
        enforcement_score: response.enforcement_score ?? mockEnforcement.enforcement_score,
        zones: response.zones ?? mockEnforcement.zones,
      });
    } catch {
      setError('Failed to fetch data. Using simulated data.');
      setData(mockEnforcement);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="space-y-6"
    >
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-secondary-900 dark:text-white">Enforcement Intelligence</h1>
          <p className="text-secondary-500 dark:text-secondary-400 mt-1">
            Priority actions and enforcement recommendations
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

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="relative">
          {loading && <LoadingOverlay />}
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-secondary-500 dark:text-secondary-400">Enforcement Score</p>
              <motion.p
                key={data.enforcement_score}
                initial={{ scale: 0.5, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                className="text-4xl font-bold text-secondary-900 dark:text-white mt-2"
              >
                {data.enforcement_score}
              </motion.p>
              <p className="text-xs text-secondary-400 mt-1">out of 100</p>
            </div>
            <div className="w-16 h-16 rounded-2xl bg-primary-500/10 flex items-center justify-center">
              <Target className="w-8 h-8 text-primary-500" />
            </div>
          </div>
          <div className="mt-4">
            <Progress value={data.enforcement_score} color="primary" />
          </div>
        </Card>

        <Card className="relative">
          {loading && <LoadingOverlay />}
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-secondary-500 dark:text-secondary-400">Estimated AQI Reduction</p>
              <motion.p
                key={data.expected_aqi_reduction || data.aqi_reduction}
                initial={{ scale: 0.5, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                className="text-4xl font-bold text-accent-500 mt-2"
              >
                {data.expected_aqi_reduction || `-${data.aqi_reduction}%`}
              </motion.p>
              <p className="text-xs text-secondary-400 mt-1">with recommended actions</p>
            </div>
            <div className="w-16 h-16 rounded-2xl bg-accent-500/10 flex items-center justify-center">
              <TrendingUp className="w-8 h-8 text-accent-500 rotate-180" />
            </div>
          </div>
        </Card>

        <Card className="relative">
          {loading && <LoadingOverlay />}
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-secondary-500 dark:text-secondary-400">Risk Level</p>
              <motion.div
                key={data.risk_level}
                initial={{ scale: 0.5, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                className="mt-2"
              >
                <Badge
                  variant={data.risk_level === 'High' ? 'danger' : data.risk_level === 'Medium' ? 'warning' : 'success'}
                  size="lg"
                >
                  {data.risk_level}
                </Badge>
              </motion.div>
              <p className="text-xs text-secondary-400 mt-2">overall system risk</p>
            </div>
            <div className={`w-16 h-16 rounded-2xl ${
              data.risk_level === 'High' ? 'bg-red-500/10' :
              data.risk_level === 'Medium' ? 'bg-amber-500/10' : 'bg-accent-500/10'
            } flex items-center justify-center`}>
              <AlertTriangle className={`w-8 h-8 ${
                data.risk_level === 'High' ? 'text-red-500' :
                data.risk_level === 'Medium' ? 'text-amber-500' : 'text-accent-500'
              }`} />
            </div>
          </div>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Priority Actions */}
        <Card className="lg:col-span-2 relative">
          {loading && <LoadingOverlay />}
          <CardHeader
            title="Priority Actions"
            subtitle="Immediate enforcement recommendations"
            icon={<Shield className="w-5 h-5" />}
          />
          <div className="space-y-3 mt-4">
            {data.priority_actions.map((action, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.05 }}
                className="flex items-start gap-3 p-4 rounded-xl bg-secondary-50/50 dark:bg-secondary-800/50 hover:bg-secondary-100/50 dark:hover:bg-secondary-700/50 transition-colors"
              >
                <div className="w-8 h-8 rounded-lg bg-primary-500/10 flex items-center justify-center flex-shrink-0">
                  <span className="text-sm font-bold text-primary-500">{index + 1}</span>
                </div>
                <p className="text-sm text-secondary-700 dark:text-secondary-300">{action}</p>
              </motion.div>
            ))}
          </div>
        </Card>

        {/* Zone Status */}
        <Card className="relative">
          {loading && <LoadingOverlay />}
          <CardHeader
            title="Zone Status"
            subtitle="Area-wise enforcement"
            icon={<BarChart2 className="w-5 h-5" />}
          />
          <div className="space-y-3 mt-4">
            {(data.zones || []).map((zone, index) => {
              const priorityKey = (zone.priority || 'low').toLowerCase() as keyof typeof priorityStyles;
              const style = priorityStyles[priorityKey] || priorityStyles.low;
              return (
                <motion.div
                  key={zone.name}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className={`p-3 rounded-xl ${style.bg}`}
                >
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-medium text-secondary-900 dark:text-white">{zone.name}</span>
                    <Badge variant={style.badge} size="sm">
                      {zone.priority}
                    </Badge>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className={`${style.text}`}>AQI: {zone.aqi}</span>
                    <span className="text-secondary-600 dark:text-secondary-400">{zone.action}</span>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </Card>
      </div>

      {/* Action Timeline */}
      <Card>
        <CardHeader
          title="Recommended Action Timeline"
          subtitle="Prioritized sequence of enforcement actions"
          icon={<CheckCircle className="w-5 h-5" />}
        />
        <div className="relative mt-6">
          <div className="absolute left-4 top-0 bottom-0 w-0.5 bg-secondary-200 dark:bg-secondary-700" />
          <div className="space-y-6">
            {[
              { time: 'Immediate', action: 'Deploy water sprinklers and activate smog towers in critical zones', completed: true },
              { time: 'Within 1 hour', action: 'Issue traffic restrictions and divert heavy vehicles', completed: true },
              { time: 'Within 2 hours', action: 'Notify industrial units to reduce operations by 50%', completed: false },
              { time: 'Within 4 hours', action: 'Deploy enforcement teams to construction sites', completed: false },
              { time: 'Within 6 hours', action: 'Review and update environmental clearances', completed: false },
            ].map((item, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.3 + index * 0.1 }}
                className="relative flex gap-4"
              >
                <div className={`w-8 h-8 rounded-full flex items-center justify-center z-10 ${
                  item.completed ? 'bg-accent-500' : 'bg-secondary-200 dark:bg-secondary-700'
                }`}>
                  {item.completed ? (
                    <CheckCircle className="w-5 h-5 text-white" />
                  ) : (
                    <span className="text-sm font-medium text-secondary-600 dark:text-secondary-300">{index + 1}</span>
                  )}
                </div>
                <div className={`flex-1 p-3 rounded-xl ${
                  item.completed ? 'bg-accent-500/10' : 'bg-secondary-50/50 dark:bg-secondary-800/50'
                }`}>
                  <div className="flex items-center justify-between mb-1">
                    <span className={`text-xs font-medium ${
                      item.completed ? 'text-accent-600 dark:text-accent-400' : 'text-secondary-500'
                    }`}>
                      {item.time}
                    </span>
                    {item.completed && (
                      <Badge variant="success" size="sm">Completed</Badge>
                    )}
                  </div>
                  <p className="text-sm text-secondary-700 dark:text-secondary-300">{item.action}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </Card>
    </motion.div>
  );
};

export default Enforcement;
