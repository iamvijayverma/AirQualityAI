import { useState } from 'react';
import { motion } from 'framer-motion';
import { Heart, Shield, Wind, AlertTriangle, CheckCircle } from 'lucide-react';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';
import { Select } from '../components/ui/Select';
import { Slider } from '../components/ui/Slider';
import { Card, CardHeader } from '../components/ui/Card';
import { Badge } from '../components/ui/Badge';
import { LoadingOverlay } from '../components/ui/Loading';
import { citizenAdvisoryApi } from '../services/api';
import { mockCitizenAdvisory } from '../data/mockData';
import type { CitizenAdvisoryRequest, CitizenAdvisoryResponse } from '../types';

const languages = [
  { value: 'english', label: 'English' },
  { value: 'hindi', label: 'Hindi' },
  { value: 'spanish', label: 'Spanish' },
  { value: 'french', label: 'French' },
];

const medicalConditions = [
  { value: 'none', label: 'None' },
  { value: 'asthma', label: 'Asthma' },
  { value: 'copd', label: 'COPD' },
  { value: 'heart_disease', label: 'Heart Disease' },
  { value: 'diabetes', label: 'Diabetes' },
  { value: 'allergies', label: 'Respiratory Allergies' },
];

const riskStyles = {
  low: { bg: 'bg-aqi-good', text: 'text-white', badge: 'success' as const },
  moderate: { bg: 'bg-aqi-moderate', text: 'text-white', badge: 'warning' as const },
  high: { bg: 'bg-aqi-unhealthy', text: 'text-white', badge: 'danger' as const },
  very_high: { bg: 'bg-aqi-hazardous', text: 'text-white', badge: 'danger' as const },
};

const CitizenAdvisory = () => {
  const [formData, setFormData] = useState<CitizenAdvisoryRequest>({
    aqi: 156,
    age: 35,
    medical_condition: 'none',
    language: 'english',
  });
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<CitizenAdvisoryResponse>(mockCitizenAdvisory);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const response = await citizenAdvisoryApi.getAdvisory(formData);
      setResult(response);
    } catch {
      setError('Failed to get advisory. Using simulated data.');
      setResult(mockCitizenAdvisory);
    } finally {
      setLoading(false);
    }
  };

  const currentRiskStyle = riskStyles[result.risk_level];

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="space-y-6"
    >
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-secondary-900 dark:text-white">Citizen Advisory</h1>
          <p className="text-secondary-500 dark:text-secondary-400 mt-1">
            Get personalized health recommendations based on air quality
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Input Form */}
        <Card className="lg:col-span-1 relative">
          {loading && <LoadingOverlay text="Analyzing..." />}
          <CardHeader
            title="Personal Details"
            subtitle="Enter your information"
            icon={<Heart className="w-5 h-5" />}
          />

          <form onSubmit={handleSubmit} className="space-y-5 mt-4">
            <div className="space-y-1">
              <label className="text-sm font-medium text-secondary-700 dark:text-secondary-300">
                Current AQI: {formData.aqi}
              </label>
              <div className={`w-full h-3 rounded-full ${riskStyles[
                formData.aqi <= 50 ? 'low' :
                formData.aqi <= 100 ? 'moderate' :
                formData.aqi <= 200 ? 'high' : 'very_high'
              ].bg}`} />
            </div>

            <Slider
              value={formData.age}
              min={1}
              max={100}
              onChange={(value) => setFormData({ ...formData, age: value })}
              label="Age"
              unit=" years"
            />

            <Select
              label="Medical Condition"
              value={formData.medical_condition}
              onChange={(e) => setFormData({ ...formData, medical_condition: e.target.value })}
              options={medicalConditions}
            />

            <Select
              label="Language"
              value={formData.language}
              onChange={(e) => setFormData({ ...formData, language: e.target.value })}
              options={languages}
            />

            {error && (
              <div className="p-3 rounded-xl bg-red-500/10 text-red-600 dark:text-red-400 text-sm">
                {error}
              </div>
            )}

            <Button type="submit" variant="primary" size="lg" className="w-full" loading={loading}>
              Get Advisory
            </Button>
          </form>
        </Card>

        {/* Results */}
        <div className="lg:col-span-2 space-y-6">
          {/* Risk Level Card */}
          <Card className="relative overflow-hidden">
            <div className={`absolute top-0 right-0 w-48 h-48 ${currentRiskStyle.bg} opacity-10 rounded-full -translate-y-1/2 translate-x-1/2`} />
            <div className="relative">
              <div className="flex items-start justify-between mb-6">
                <div>
                  <p className="text-sm text-secondary-500 dark:text-secondary-400 mb-1">Risk Level</p>
                  <div className="flex items-center gap-3">
                    <motion.div
                      key={result.risk_level}
                      initial={{ scale: 0.5, opacity: 0 }}
                      animate={{ scale: 1, opacity: 1 }}
                      className={`px-4 py-2 rounded-xl ${currentRiskStyle.bg}`}
                    >
                      <span className={`text-xl font-bold ${currentRiskStyle.text} capitalize`}>
                        {result.risk_level.replace('_', ' ')}
                      </span>
                    </motion.div>
                    <Badge variant={currentRiskStyle.badge}>
                      {result.risk_level === 'low' ? 'Safe for outdoor activities' :
                       result.risk_level === 'moderate' ? 'Caution advised' :
                       result.risk_level === 'high' ? 'Limit outdoor exposure' : 'Stay indoors'}
                    </Badge>
                  </div>
                </div>
                <AlertTriangle className={`w-12 h-12 ${
                  result.risk_level === 'low' ? 'text-accent-500' :
                  result.risk_level === 'moderate' ? 'text-amber-500' :
                  'text-red-500'
                }`} />
              </div>

              <div className="p-4 rounded-xl bg-secondary-100/50 dark:bg-secondary-800/50 mb-6">
                <div className="flex items-start gap-3">
                  <Shield className="w-5 h-5 text-primary-500 flex-shrink-0 mt-0.5" />
                  <div>
                    <p className="font-medium text-secondary-900 dark:text-white mb-1">Health Advisory</p>
                    <p className="text-sm text-secondary-600 dark:text-secondary-400">{result.health_advisory}</p>
                  </div>
                </div>
              </div>

              <div className="p-4 rounded-xl bg-secondary-100/50 dark:bg-secondary-800/50">
                <div className="flex items-start gap-3">
                  <Wind className="w-5 h-5 text-primary-500 flex-shrink-0 mt-0.5" />
                  <div>
                    <p className="font-medium text-secondary-900 dark:text-white mb-1">Outdoor Activity</p>
                    <p className="text-sm text-secondary-600 dark:text-secondary-400">{result.outdoor_activity}</p>
                  </div>
                </div>
              </div>
            </div>
          </Card>

          {/* Precautions */}
          <Card>
            <CardHeader
              title="Recommended Precautions"
              subtitle="Steps to protect your health"
              icon={<CheckCircle className="w-5 h-5" />}
            />
            <div className="space-y-3 mt-4">
              {result.precautions.map((precaution, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="flex items-start gap-3 p-3 rounded-xl bg-secondary-50/50 dark:bg-secondary-800/50"
                >
                  <div className="w-6 h-6 rounded-full bg-accent-500/20 flex items-center justify-center flex-shrink-0">
                    <CheckCircle className="w-4 h-4 text-accent-500" />
                  </div>
                  <p className="text-sm text-secondary-700 dark:text-secondary-300">{precaution}</p>
                </motion.div>
              ))}
            </div>
          </Card>

          {/* Mask Recommendation */}
          <Card className="bg-gradient-to-r from-primary-500/10 to-accent-500/10 dark:from-primary-500/5 dark:to-accent-500/5">
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 rounded-xl bg-primary-500/20 flex items-center justify-center">
                <Shield className="w-7 h-7 text-primary-500" />
              </div>
              <div>
                <p className="text-sm text-secondary-500 dark:text-secondary-400 mb-1">Mask Recommendation</p>
                <p className="font-semibold text-secondary-900 dark:text-white">{result.mask_recommendation}</p>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </motion.div>
  );
};

export default CitizenAdvisory;
