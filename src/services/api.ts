import axios from 'axios';
import type {
  ForecastRequest,
  ForecastResponse,
  SourceAttributionResponse,
  CitizenAdvisoryRequest,
  CitizenAdvisoryResponse,
  EnforcementResponse,
} from '../types';

const DEFAULT_BASE_URL = 'http://127.0.0.1:8000';

const api = axios.create({
  baseURL: DEFAULT_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 30000,
});

export const setApiBaseUrl = (url: string) => {
  api.defaults.baseURL = url;
};

export const forecastApi = {
  predict: async (data: ForecastRequest): Promise<ForecastResponse> => {
    const response = await api.post<ForecastResponse>('/forecast', data);
    return response.data;
  },
};

export const sourceAttributionApi = {
  getAttribution: async (): Promise<SourceAttributionResponse> => {
    const response = await api.post<SourceAttributionResponse>(
      '/source-attribution',
      {
        pm25: 50,
        pm10: 80,
        no2: 30,
        traffic_density: 60,
        construction_index: 20,
        industrial_index: 40,
      }
    );

    return response.data;
  },
};

export const citizenAdvisoryApi = {
  getAdvisory: async (data: CitizenAdvisoryRequest): Promise<CitizenAdvisoryResponse> => {
    const response = await api.post<CitizenAdvisoryResponse>('/citizen-advisory', data);
    return response.data;
  },
};

export const enforcementApi = {
  getEnforcement: async (): Promise<EnforcementResponse> => {
    const response = await api.post<EnforcementResponse>(
      '/enforcement',
      {
        aqi: 180,
        traffic_pct: 45,
        construction_pct: 30,
        industry_pct: 25,
      }
    );

    return response.data;
  },
};

export const healthCheck = async (): Promise<boolean> => {
  try {
    await api.get('/health');
    return true;
  } catch {
    return false;
  }
};

export default api;
