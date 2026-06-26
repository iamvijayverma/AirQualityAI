import { motion } from 'framer-motion';

interface ProgressProps {
  value: number;
  max?: number;
  color?: string;
  showLabel?: boolean;
  size?: 'sm' | 'md' | 'lg';
}

const sizeStyles = {
  sm: 'h-1.5',
  md: 'h-2.5',
  lg: 'h-4',
};

export const Progress = ({ value, max = 100, color = 'primary', showLabel, size = 'md' }: ProgressProps) => {
  const percentage = Math.min((value / max) * 100, 100);

  const colorStyles: Record<string, string> = {
    primary: 'bg-primary-500',
    accent: 'bg-accent-500',
    warning: 'bg-amber-500',
    danger: 'bg-red-500',
    good: 'bg-aqi-good',
    moderate: 'bg-aqi-moderate',
    unhealthy: 'bg-aqi-unhealthy',
  };

  return (
    <div className="w-full">
      {showLabel && (
        <div className="flex justify-between mb-1">
          <span className="text-xs text-secondary-500 dark:text-secondary-400">Progress</span>
          <span className="text-xs font-medium text-secondary-700 dark:text-secondary-300">
            {Math.round(percentage)}%
          </span>
        </div>
      )}
      <div className={`w-full rounded-full bg-secondary-200 dark:bg-secondary-700 overflow-hidden ${sizeStyles[size]}`}>
        <motion.div
          initial={{ width: 0 }}
          animate={{ width: `${percentage}%` }}
          transition={{ duration: 0.5, ease: 'easeOut' }}
          className={`h-full rounded-full ${colorStyles[color] || colorStyles.primary}`}
        />
      </div>
    </div>
  );
};
