import { motion } from 'framer-motion';
import { AlertTriangle, Info, AlertCircle, Bell, ChevronRight } from 'lucide-react';
import { Card } from '../ui/Card';
import { Badge } from '../ui/Badge';
import type { Alert } from '../../types';

interface AlertsCardProps {
  alerts: Alert[];
}

const alertIcons = {
  critical: AlertTriangle,
  warning: AlertCircle,
  info: Info,
};

const alertStyles = {
  critical: 'border-l-red-500 bg-red-500/5',
  warning: 'border-l-amber-500 bg-amber-500/5',
  info: 'border-l-primary-500 bg-primary-500/5',
};

const alertBadgeVariants = {
  critical: 'danger' as const,
  warning: 'warning' as const,
  info: 'info' as const,
};

export const AlertsCard = ({ alerts }: AlertsCardProps) => {
  return (
    <Card>
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-xl bg-red-500/10">
            <Bell className="w-5 h-5 text-red-500" />
          </div>
          <div>
            <h3 className="font-semibold text-secondary-900 dark:text-white">Active Alerts</h3>
            <p className="text-xs text-secondary-500 dark:text-secondary-400">{alerts.length} active alerts</p>
          </div>
        </div>
        <button className="text-primary-500 hover:text-primary-600 text-sm font-medium flex items-center gap-1">
          View all <ChevronRight className="w-4 h-4" />
        </button>
      </div>

      <div className="space-y-3">
        {alerts.map((alert, index) => {
          const Icon = alertIcons[alert.type];
          return (
            <motion.div
              key={alert.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.1 }}
              className={`p-3 rounded-xl border-l-4 ${alertStyles[alert.type]}`}
            >
              <div className="flex items-start justify-between gap-3">
                <div className="flex items-start gap-3">
                  <Icon className={`w-5 h-5 mt-0.5 ${
                    alert.type === 'critical' ? 'text-red-500' :
                    alert.type === 'warning' ? 'text-amber-500' : 'text-primary-500'
                  }`} />
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <p className="font-medium text-sm text-secondary-900 dark:text-white">{alert.title}</p>
                      <Badge variant={alertBadgeVariants[alert.type]} size="sm">
                        {alert.type}
                      </Badge>
                    </div>
                    <p className="text-xs text-secondary-500 dark:text-secondary-400">{alert.message}</p>
                    <p className="text-xs text-secondary-400 dark:text-secondary-500 mt-1">{alert.location}</p>
                  </div>
                </div>
              </div>
            </motion.div>
          );
        })}
      </div>
    </Card>
  );
};
