import { type ChangeEvent } from 'react';
import { motion } from 'framer-motion';

interface SliderProps {
  value: number;
  min?: number;
  max?: number;
  step?: number;
  onChange?: (value: number) => void;
  label?: string;
  showValue?: boolean;
  unit?: string;
}

export const Slider = ({
  value,
  min = 0,
  max = 100,
  step = 1,
  onChange,
  label,
  showValue = true,
  unit = '',
}: SliderProps) => {
  const percentage = ((value - min) / (max - min)) * 100;

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const newValue = parseFloat(e.target.value);
    onChange?.(newValue);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="w-full"
    >
      {(label || showValue) && (
        <div className="flex justify-between mb-2">
          {label && (
            <label className="text-sm font-medium text-secondary-700 dark:text-secondary-300">
              {label}
            </label>
          )}
          {showValue && (
            <span className="text-sm font-semibold text-primary-500">
              {value}{unit}
            </span>
          )}
        </div>
      )}
      <div className="relative h-5">
        <div className="absolute top-1/2 -translate-y-1/2 w-full h-2 bg-secondary-200 dark:bg-secondary-700 rounded-full">
          <div
            className="h-full bg-primary-500 rounded-full transition-all duration-100"
            style={{ width: `${percentage}%` }}
          />
        </div>
        <input
          type="range"
          min={min}
          max={max}
          step={step}
          value={value}
          onChange={handleChange}
          className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
          style={{
            WebkitAppearance: 'none',
          }}
        />
        <div
          className="absolute top-1/2 -translate-y-1/2 w-5 h-5 bg-white shadow-lg rounded-full border-2 border-primary-500 pointer-events-none transition-all duration-100"
          style={{ left: `calc(${percentage}% - 10px)` }}
        />
      </div>
    </motion.div>
  );
};
