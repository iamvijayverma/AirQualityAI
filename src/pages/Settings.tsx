import { useState } from 'react';
import { motion } from 'framer-motion';
import {
  Sun,
  Moon,
  Monitor,
  Bell,
  Globe,
  Server,
  Save,
  CheckCircle,
} from 'lucide-react';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';
import { Select } from '../components/ui/Select';
import { Card, CardHeader } from '../components/ui/Card';
import { useTheme } from '../context/ThemeContext';
import { setApiBaseUrl } from '../services/api';

const languages = [
  { value: 'english', label: 'English' },
  { value: 'hindi', label: 'Hindi' },
  { value: 'spanish', label: 'Spanish' },
  { value: 'french', label: 'French' },
];

const Settings = () => {
  const { theme, setTheme, resolvedTheme } = useTheme();
  const [notifications, setNotifications] = useState(true);
  const [language, setLanguage] = useState('english');
  const [apiBaseUrl, setApiBaseUrlLocal] = useState('http://127.0.0.1:8000');
  const [saved, setSaved] = useState(false);

  const handleSave = () => {
    setApiBaseUrl(apiBaseUrl);
    localStorage.setItem('settings', JSON.stringify({
      notifications,
      language,
      apiBaseUrl,
    }));
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="space-y-6 max-w-4xl mx-auto"
    >
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-secondary-900 dark:text-white">Settings</h1>
          <p className="text-secondary-500 dark:text-secondary-400 mt-1">
            Customize your application preferences
          </p>
        </div>
        <Button
          variant="primary"
          icon={saved ? <CheckCircle className="w-4 h-4" /> : <Save className="w-4 h-4" />}
          onClick={handleSave}
        >
          {saved ? 'Saved!' : 'Save Changes'}
        </Button>
      </div>

      {/* Theme Settings */}
      <Card>
        <CardHeader
          title="Appearance"
          subtitle="Choose your preferred theme"
          icon={<Sun className="w-5 h-5" />}
        />
        <div className="grid grid-cols-3 gap-4 mt-4">
          {[
            { value: 'light', label: 'Light', icon: Sun },
            { value: 'dark', label: 'Dark', icon: Moon },
            { value: 'system', label: 'System', icon: Monitor },
          ].map((option) => (
            <motion.button
              key={option.value}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => setTheme(option.value as 'light' | 'dark' | 'system')}
              className={`relative p-6 rounded-xl border-2 transition-all flex flex-col items-center gap-3 ${
                theme === option.value
                  ? 'border-primary-500 bg-primary-50 dark:bg-primary-500/10'
                  : 'border-secondary-200 dark:border-secondary-700 hover:border-primary-300 dark:hover:border-primary-600'
              }`}
            >
              <option.icon
                className={`w-8 h-8 ${
                  theme === option.value ? 'text-primary-500' : 'text-secondary-400'
                }`}
              />
              <span
                className={`font-medium ${
                  theme === option.value
                    ? 'text-primary-600 dark:text-primary-400'
                    : 'text-secondary-700 dark:text-secondary-300'
                }`}
              >
                {option.label}
              </span>
              {theme === option.value && (
                <motion.div
                  layoutId="themeCheck"
                  className="absolute top-2 right-2 w-5 h-5 rounded-full bg-primary-500 flex items-center justify-center"
                >
                  <CheckCircle className="w-3 h-3 text-white" />
                </motion.div>
              )}
            </motion.button>
          ))}
        </div>
        <p className="text-sm text-secondary-500 dark:text-secondary-400 mt-4">
          Current active theme: <span className="font-medium capitalize">{resolvedTheme}</span>
        </p>
      </Card>

      {/* Notification Settings */}
      <Card>
        <CardHeader
          title="Notifications"
          subtitle="Manage alert preferences"
          icon={<Bell className="w-5 h-5" />}
        />
        <div className="space-y-4 mt-4">
          <div className="flex items-center justify-between p-4 rounded-xl bg-secondary-50/50 dark:bg-secondary-800/50">
            <div>
              <p className="font-medium text-secondary-900 dark:text-white">Push Notifications</p>
              <p className="text-sm text-secondary-500 dark:text-secondary-400">
                Receive alerts for critical AQI changes
              </p>
            </div>
            <button
              onClick={() => setNotifications(!notifications)}
              className={`relative w-14 h-8 rounded-full transition-colors ${
                notifications ? 'bg-primary-500' : 'bg-secondary-300 dark:bg-secondary-600'
              }`}
            >
              <motion.div
                animate={{ x: notifications ? 22 : 2 }}
                className="absolute top-1 w-6 h-6 rounded-full bg-white shadow"
              />
            </button>
          </div>

          <div className="flex items-center justify-between p-4 rounded-xl bg-secondary-50/50 dark:bg-secondary-800/50">
            <div>
              <p className="font-medium text-secondary-900 dark:text-white">Email Alerts</p>
              <p className="text-sm text-secondary-500 dark:text-secondary-400">
                Daily summary sent to your email
              </p>
            </div>
            <button className="relative w-14 h-8 rounded-full bg-primary-500">
              <motion.div
                animate={{ x: 22 }}
                className="absolute top-1 w-6 h-6 rounded-full bg-white shadow"
              />
            </button>
          </div>

          <div className="flex items-center justify-between p-4 rounded-xl bg-secondary-50/50 dark:bg-secondary-800/50">
            <div>
              <p className="font-medium text-secondary-900 dark:text-white">SMS Alerts</p>
              <p className="text-sm text-secondary-500 dark:text-secondary-400">
                Critical alerts via SMS
              </p>
            </div>
            <button className="relative w-14 h-8 rounded-full bg-secondary-300 dark:bg-secondary-600">
              <motion.div
                animate={{ x: 2 }}
                className="absolute top-1 w-6 h-6 rounded-full bg-white shadow"
              />
            </button>
          </div>
        </div>
      </Card>

      {/* Language Settings */}
      <Card>
        <CardHeader
          title="Language"
          subtitle="Select your preferred language"
          icon={<Globe className="w-5 h-5" />}
        />
        <div className="mt-4 max-w-sm">
          <Select
            value={language}
            onChange={(e) => setLanguage(e.target.value)}
            options={languages}
          />
        </div>
      </Card>

      {/* API Settings */}
      <Card>
        <CardHeader
          title="API Configuration"
          subtitle="Backend connection settings"
          icon={<Server className="w-5 h-5" />}
        />
        <div className="space-y-4 mt-4">
          <div className="max-w-lg">
            <Input
              label="API Base URL"
              value={apiBaseUrl}
              onChange={(e) => setApiBaseUrlLocal(e.target.value)}
              placeholder="http://127.0.0.1:8000"
            />
          </div>
          <div className="p-4 rounded-xl bg-secondary-50/50 dark:bg-secondary-800/50">
            <p className="text-sm text-secondary-600 dark:text-secondary-400">
              <span className="font-medium">Status:</span>{' '}
              <span className="text-amber-500">Connecting to backend...</span>
            </p>
            <p className="text-xs text-secondary-500 dark:text-secondary-500 mt-1">
              The backend API should be running at the specified URL
            </p>
          </div>
        </div>
      </Card>

      {/* About Section */}
      <Card>
        <CardHeader title="About" subtitle="Application information" />
        <div className="mt-4 space-y-3">
          <div className="flex items-center justify-between py-2">
            <span className="text-secondary-500 dark:text-secondary-400">Version</span>
            <span className="text-secondary-900 dark:text-white font-medium">1.0.0</span>
          </div>
          <div className="flex items-center justify-between py-2">
            <span className="text-secondary-500 dark:text-secondary-400">Framework</span>
            <span className="text-secondary-900 dark:text-white font-medium">React 19 + Vite</span>
          </div>
          <div className="flex items-center justify-between py-2">
            <span className="text-secondary-500 dark:text-secondary-400">Backend</span>
            <span className="text-secondary-900 dark:text-white font-medium">FastAPI</span>
          </div>
          <div className="flex items-center justify-between py-2">
            <span className="text-secondary-500 dark:text-secondary-400">Database</span>
            <span className="text-secondary-900 dark:text-white font-medium">Supabase</span>
          </div>
        </div>
      </Card>
    </motion.div>
  );
};

export default Settings;
