import { motion } from 'framer-motion';
import { Loader2 } from 'lucide-react';

interface LoadingProps {
  size?: 'sm' | 'md' | 'lg';
  text?: string;
  fullScreen?: boolean;
}

const sizeMap = {
  sm: 'w-4 h-4',
  md: 'w-8 h-8',
  lg: 'w-12 h-12',
};

export const Loading = ({ size = 'md', text, fullScreen }: LoadingProps) => {
  if (fullScreen) {
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="fixed inset-0 bg-secondary-50/80 dark:bg-secondary-950/80 backdrop-blur-sm z-50 flex items-center justify-center"
      >
        <div className="flex flex-col items-center gap-4">
          <Loader2 className={`${sizeMap[size]} text-primary-500 animate-spin`} />
          {text && (
            <p className="text-secondary-600 dark:text-secondary-400 font-medium">{text}</p>
          )}
        </div>
      </motion.div>
    );
  }

  return (
    <div className="flex items-center justify-center gap-3">
      <Loader2 className={`${sizeMap[size]} text-primary-500 animate-spin`} />
      {text && (
        <p className="text-secondary-600 dark:text-secondary-400">{text}</p>
      )}
    </div>
  );
};

export const LoadingOverlay = ({ text }: { text?: string }) => {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="absolute inset-0 bg-white/50 dark:bg-secondary-900/50 backdrop-blur-sm rounded-2xl flex items-center justify-center z-10"
    >
      <div className="flex flex-col items-center gap-3">
        <Loader2 className="w-8 h-8 text-primary-500 animate-spin" />
        {text && (
          <p className="text-sm text-secondary-600 dark:text-secondary-400">{text}</p>
        )}
      </div>
    </motion.div>
  );
};
