import { type ReactNode } from 'react';

type BadgeVariant = 'default' | 'success' | 'warning' | 'danger' | 'info' | 'primary';
type BadgeSize = 'sm' | 'md' | 'lg';

interface BadgeProps {
  variant?: BadgeVariant;
  size?: BadgeSize;
  children: ReactNode;
  icon?: ReactNode;
  className?: string;
}

const variantStyles: Record<BadgeVariant, string> = {
  default: 'bg-secondary-100 dark:bg-secondary-800 text-secondary-700 dark:text-secondary-300',
  success: 'bg-accent-500/20 text-accent-600 dark:text-accent-400',
  warning: 'bg-amber-500/20 text-amber-600 dark:text-amber-400',
  danger: 'bg-red-500/20 text-red-600 dark:text-red-400',
  info: 'bg-primary-500/20 text-primary-600 dark:text-primary-400',
  primary: 'bg-primary-500 text-white',
};

const sizeStyles: Record<BadgeSize, string> = {
  sm: 'px-2 py-0.5 text-xs',
  md: 'px-2.5 py-1 text-sm',
  lg: 'px-3 py-1.5 text-base',
};

export const Badge = ({ variant = 'default', size = 'md', children, icon, className = '' }: BadgeProps) => {
  return (
    <span
      className={`
        inline-flex items-center gap-1.5 font-medium rounded-lg
        ${variantStyles[variant]} ${sizeStyles[size]} ${className}
      `}
    >
      {icon}
      {children}
    </span>
  );
};
