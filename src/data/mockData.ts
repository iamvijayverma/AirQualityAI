import type {
  AQIData,
  Alert,
  MonitoringStation,
  WeatherData,
  ForecastResponse,
  SourceAttributionResponse,
  CitizenAdvisoryResponse,
  EnforcementResponse,
  CityData,
} from '../types';

export const mockCurrentAQI: AQIData = {
  aqi: 156,
  pm25: 78,
  pm10: 95,
  o3: 45,
  no2: 32,
  so2: 18,
  co: 0.8,
  timestamp: new Date().toISOString(),
  location: 'Jaipur, Rajasthan',
};

export const mockWeather: WeatherData = {
  temperature: 34,
  humidity: 45,
  wind_speed: 12,
  wind_direction: 'NW',
  condition: 'Partly Cloudy',
  icon: 'cloud-sun',
};

export const mockAlerts: Alert[] = [
  {
    id: '1',
    type: 'critical',
    title: 'High PM2.5 Levels Detected',
    message: 'PM2.5 levels exceed safe limits in Industrial Area Zone. Immediate action recommended.',
    timestamp: new Date().toISOString(),
    location: 'Industrial Area',
  },
  {
    id: '2',
    type: 'warning',
    title: 'Ozone Rising',
    message: 'Ozone concentration increasing. Expected to peak at 3 PM.',
    timestamp: new Date(Date.now() - 3600000).toISOString(),
    location: 'City Center',
  },
  {
    id: '3',
    type: 'info',
    title: 'Construction Activity Alert',
    message: 'Multiple construction sites active in North Zone. Dust mitigation required.',
    timestamp: new Date(Date.now() - 7200000).toISOString(),
    location: 'North Zone',
  },
];

export const mockStations: MonitoringStation[] = [
  { id: '1', name: 'City Center', location: { lat: 26.9124, lng: 75.7873 }, aqi: 156, status: 'active' },
  { id: '2', name: 'Industrial Area', location: { lat: 26.9234, lng: 75.7689 }, aqi: 198, status: 'active' },
  { id: '3', name: 'Residential Zone', location: { lat: 26.8976, lng: 75.8012 }, aqi: 112, status: 'active' },
  { id: '4', name: 'University Area', location: { lat: 26.8845, lng: 75.7456 }, aqi: 98, status: 'active' },
  { id: '5', name: 'Transport Hub', location: { lat: 26.9156, lng: 75.8234 }, aqi: 178, status: 'maintenance' },
];

export const mockAQITrend = Array.from({ length: 24 }, (_, i) => ({
  hour: i,
  aqi: Math.floor(100 + Math.sin(i / 3) * 40 + Math.random() * 20),
}));

export const mockPollutionSources = [
  { name: 'Traffic', value: 35, color: '#3b82f6' },
  { name: 'Industry', value: 28, color: '#f59e0b' },
  { name: 'Construction', value: 22, color: '#ef4444' },
  { name: 'Domestic', value: 10, color: '#10b981' },
  { name: 'Other', value: 5, color: '#8b5cf6' },
];

export const mockForecastResponse: ForecastResponse = {
  predicted_aqi: 168,
  confidence: 0.87,
  trend: 'increasing',
  forecast_24h: Array.from({ length: 24 }, (_, i) => ({
    hour: i,
    aqi: Math.floor(140 + Math.sin(i / 4) * 30 + i * 2),
  })),
  sources: [
    { name: 'Traffic', percentage: 40, color: '#3b82f6' },
    { name: 'Industry', percentage: 32, color: '#f59e0b' },
    { name: 'Construction', percentage: 18, color: '#ef4444' },
    { name: 'Other', percentage: 10, color: '#8b5cf6' },
  ],
};

export const mockSourceAttribution: SourceAttributionResponse = {
  traffic: 35,
  industry: 28,
  construction: 22,
  mixed_source: 15,
  timestamp: new Date().toISOString(),
};

export const mockCitizenAdvisory: CitizenAdvisoryResponse = {
  risk_level: 'high',
  health_advisory: 'Air quality is unhealthy for sensitive groups. People with respiratory conditions should limit outdoor exposure.',
  precautions: [
    'Stay indoors during peak pollution hours (8-10 AM, 5-7 PM)',
    'Keep windows closed during high pollution periods',
    'Use air purifiers if available',
    'Avoid strenuous outdoor activities',
    'Keep rescue inhalers accessible if you have asthma',
  ],
  mask_recommendation: 'N95 or KN95 mask recommended for outdoor activities',
  outdoor_activity: 'Limit outdoor activities. Essential travel only.',
};

export const mockEnforcement: EnforcementResponse = {
  priority_actions: [
    'Deploy water sprinklers in Industrial Area Zone',
    'Restrict heavy vehicle movement from 8 AM - 12 PM',
    'Issue stop-work orders for non-compliant construction sites',
    'Increase traffic management at congestion hotspots',
    'Activate smog towers in critical zones',
  ],
  aqi_reduction: 23,
  risk_level: 'High',
  enforcement_score: 78,
  zones: [
    { name: 'Industrial Area', aqi: 198, action: 'Deploy sprinklers', priority: 'high' },
    { name: 'Transport Hub', aqi: 178, action: 'Traffic restriction', priority: 'high' },
    { name: 'City Center', aqi: 156, action: 'Monitor closely', priority: 'medium' },
    { name: 'Residential Zone', aqi: 112, action: 'No action needed', priority: 'low' },
  ],
};

export const mockCities: CityData[] = [
  {
    name: 'Jaipur',
    aqi: 156,
    pm25: 78,
    pm10: 95,
    trend: 'declining',
    forecast: [160, 165, 170, 175, 168, 162],
  },
  {
    name: 'Delhi',
    aqi: 245,
    pm25: 125,
    pm10: 145,
    trend: 'stable',
    forecast: [250, 248, 252, 246, 240, 238],
  },
  {
    name: 'Mumbai',
    aqi: 128,
    pm25: 58,
    pm10: 72,
    trend: 'improving',
    forecast: [130, 125, 118, 115, 110, 105],
  },
  {
    name: 'Bengaluru',
    aqi: 85,
    pm25: 38,
    pm10: 52,
    trend: 'improving',
    forecast: [88, 82, 78, 75, 72, 68],
  },
];
