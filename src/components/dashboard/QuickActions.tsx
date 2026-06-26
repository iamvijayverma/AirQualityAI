import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import {
  TrendingUp,
  Factory,
  Users,
  Shield,
  Map,
  Building2,
  ArrowRight,
} from 'lucide-react';

const actions = [
  {
    title: 'AQI Forecast',
    description: 'Predict air quality trends',
    icon: TrendingUp,
    path: '/forecast',
    gradient: 'from-primary-500 to-primary-600',
    bgLight: 'bg-primary-500/10',
  },
  {
    title: 'Source Attribution',
    description: 'Analyze pollution sources',
    icon: Factory,
    path: '/source-attribution',
    gradient: 'from-amber-500 to-orange-500',
    bgLight: 'bg-amber-500/10',
  },
  {
    title: 'Citizen Advisory',
    description: 'Get health recommendations',
    icon: Users,
    path: '/citizen-advisory',
    gradient: 'from-accent-500 to-emerald-500',
    bgLight: 'bg-accent-500/10',
  },
  {
    title: 'Heatmap',
    description: 'View pollution hotspots',
    icon: Map,
    path: '/heatmap',
    gradient: 'from-rose-500 to-pink-500',
    bgLight: 'bg-rose-500/10',
  },
  {
    title: 'Enforcement',
    description: 'Priority actions needed',
    icon: Shield,
    path: '/enforcement',
    gradient: 'from-red-500 to-red-600',
    bgLight: 'bg-red-500/10',
  },
  {
    title: 'City Analytics',
    description: 'Compare city metrics',
    icon: Building2,
    path: '/city-analytics',
    gradient: 'from-violet-500 to-purple-500',
    bgLight: 'bg-violet-500/10',
  },
];

export const QuickActions = () => {
  const navigate = useNavigate();

  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
      {actions.map((action, index) => (
        <motion.button
          key={action.path}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: index * 0.05 }}
          whileHover={{ scale: 1.02, y: -4 }}
          whileTap={{ scale: 0.98 }}
          onClick={() => navigate(action.path)}
          className="group glass-card text-left p-4 cursor-pointer hover:shadow-lg transition-all"
        >
          <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${action.gradient} flex items-center justify-center mb-3 group-hover:scale-110 transition-transform`}>
            <action.icon className="w-6 h-6 text-white" />
          </div>
          <h3 className="font-semibold text-secondary-900 dark:text-white mb-1">{action.title}</h3>
          <p className="text-xs text-secondary-500 dark:text-secondary-400">{action.description}</p>
          <div className="mt-3 flex items-center gap-1 text-primary-500 opacity-0 group-hover:opacity-100 transition-opacity">
            <span className="text-xs font-medium">Open</span>
            <ArrowRight className="w-3 h-3" />
          </div>
        </motion.button>
      ))}
    </div>
  );
};
