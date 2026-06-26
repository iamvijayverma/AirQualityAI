export interface AQIData {
  aqi: number;
  pm25: number;
  pm10: number;
  o3: number;
  no2: number;
  so2: number;
  co: number;
  timestamp: string;
  location: string;
}

export interface ForecastRequest {
  aqi_1: number;
  aqi_6: number;
  aqi_24: number;
}

export interface ForecastResponse {
  predicted_aqi: number;
  confidence: number;
  trend: 'increasing' | 'decreasing' | 'stable';
  forecast_24h: { hour: number; aqi: number }[];
  sources: PollutionSource[];
}

export interface PollutionSource {
  name: string;
  percentage: number;
  color: string;
}

export interface SourceAttributionResponse {
  traffic: number;
  industry: number;
  construction: number;
  mixed_source: number;
  timestamp: string;
}

export interface CitizenAdvisoryRequest {
  aqi: number;
  age: number;
  medical_condition: string;
  language: string;
}

export interface CitizenAdvisoryResponse {
  risk_level: 'low' | 'moderate' | 'high' | 'very_high';
  health_advisory: string;
  precautions: string[];
  mask_recommendation: string;
  outdoor_activity: string;
}

export interface EnforcementResponse {
  priority_actions: string[];
  aqi_reduction: number;
  risk_level: string;
  enforcement_score: number;
  zones: EnforcementZone[];
}

export interface EnforcementZone {
  name: string;
  aqi: number;
  action: string;
  priority: 'high' | 'medium' | 'low';
}

export interface WeatherData {
  temperature: number;
  humidity: number;
  wind_speed: number;
  wind_direction: string;
  condition: string;
  icon: string;
}

export interface Alert {
  id: string;
  type: 'critical' | 'warning' | 'info';
  title: string;
  message: string;
  timestamp: string;
  location: string;
}

export interface MonitoringStation {
  id: string;
  name: string;
  location: { lat: number; lng: number };
  aqi: number;
  status: 'active' | 'inactive' | 'maintenance';
}

export interface CityData {
  name: string;
  aqi: number;
  pm25: number;
  pm10: number;
  trend: 'improving' | 'declining' | 'stable';
  forecast: number[];
}

export interface UserSettings {
  theme: 'light' | 'dark' | 'system';
  notifications: boolean;
  language: string;
  apiBaseUrl: string;
}
