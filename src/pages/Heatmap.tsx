import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { Layers, MapPin, RefreshCw, ZoomIn, ZoomOut } from 'lucide-react';
import { Button } from '../components/ui/Button';
import { Card, CardHeader } from '../components/ui/Card';
import { Badge } from '../components/ui/Badge';
import { mockStations } from '../data/mockData';
import type { MonitoringStation } from '../types';

const getAQIColor = (aqi: number) => {
  if (aqi <= 50) return '#10b981';
  if (aqi <= 100) return '#f59e0b';
  if (aqi <= 150) return '#f97316';
  if (aqi <= 200) return '#ef4444';
  return '#7c2d12';
};

const getAQILabel = (aqi: number) => {
  if (aqi <= 50) return 'Good';
  if (aqi <= 100) return 'Moderate';
  if (aqi <= 150) return 'Unhealthy for Sensitive';
  if (aqi <= 200) return 'Unhealthy';
  return 'Hazardous';
};

const createCustomIcon = (aqi: number) => {
  const color = getAQIColor(aqi);
  const size = Math.max(30, Math.min(50, aqi / 4));

  return L.divIcon({
    className: 'custom-marker',
    html: `
      <div style="
        width: ${size}px;
        height: ${size}px;
        background: ${color};
        border-radius: 50%;
        border: 3px solid white;
        box-shadow: 0 4px 12px rgba(0,0,0,0.3);
        display: flex;
        align-items: center;
        justify-content: center;
        color: white;
        font-weight: bold;
        font-size: ${size > 35 ? '12px' : '10px'};
      ">
        ${aqi}
      </div>
    `,
    iconSize: [size, size],
    iconAnchor: [size / 2, size / 2],
  });
};

const MapControls = () => {
  const map = useMap();

  return (
    <div className="absolute bottom-4 right-4 z-[1000] flex flex-col gap-2">
      <Button
        variant="secondary"
        size="sm"
        className="!p-2"
        onClick={() => map.zoomIn()}
      >
        <ZoomIn className="w-4 h-4" />
      </Button>
      <Button
        variant="secondary"
        size="sm"
        className="!p-2"
        onClick={() => map.zoomOut()}
      >
        <ZoomOut className="w-4 h-4" />
      </Button>
    </div>
  );
};

interface StationWithHeat extends MonitoringStation {
  heatIntensity: number;
}

const Heatmap = () => {
  const [stations, setStations] = useState<StationWithHeat[]>([]);
  const [selectedStation, setSelectedStation] = useState<StationWithHeat | null>(null);
  const [layerType, setLayerType] = useState<'aqi' | 'pm25' | 'temperature'>('aqi');

  useEffect(() => {
    const stationsWithHeat = mockStations.map((station) => ({
      ...station,
      heatIntensity: station.aqi / 200,
    }));
    setStations(stationsWithHeat);
  }, []);

  const center: [number, number] = [26.9124, 75.7873];

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="space-y-6"
    >
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-secondary-900 dark:text-white">Heatmap Intelligence</h1>
          <p className="text-secondary-500 dark:text-secondary-400 mt-1">
            Interactive pollution visualization across monitoring stations
          </p>
        </div>
        <div className="flex items-center gap-3">
          <div className="flex items-center p-1 rounded-xl bg-secondary-100 dark:bg-secondary-800">
            {(['aqi', 'pm25', 'temperature'] as const).map((type) => (
              <button
                key={type}
                onClick={() => setLayerType(type)}
                className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-all ${
                  layerType === type
                    ? 'bg-white dark:bg-secondary-700 text-secondary-900 dark:text-white shadow'
                    : 'text-secondary-600 dark:text-secondary-400 hover:text-secondary-900 dark:hover:text-white'
                }`}
              >
                {type.toUpperCase()}
              </button>
            ))}
          </div>
          <Button variant="secondary" icon={<RefreshCw className="w-4 h-4" />}>
            Refresh
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Map */}
        <Card className="lg:col-span-3 !p-0 overflow-hidden h-[600px]">
          <MapContainer
            center={center}
            zoom={13}
            style={{ height: '100%', width: '100%' }}
            zoomControl={false}
          >
            <TileLayer
              attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />
            {stations.map((station) => (
              <Marker
                key={station.id}
                position={[station.location.lat, station.location.lng]}
                icon={createCustomIcon(station.aqi)}
                eventHandlers={{
                  click: () => setSelectedStation(station),
                }}
              >
                <Popup>
                  <div className="p-2">
                    <h3 className="font-semibold text-gray-900">{station.name}</h3>
                    <p className="text-sm text-gray-600">AQI: {station.aqi}</p>
                    <p className="text-xs text-gray-500">{getAQILabel(station.aqi)}</p>
                  </div>
                </Popup>
              </Marker>
            ))}
            <MapControls />
          </MapContainer>
        </Card>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Legend */}
          <Card>
            <CardHeader title="AQI Legend" subtitle="Color-coded scale" />
            <div className="space-y-2 mt-4">
              {[
                { range: '0-50', label: 'Good', color: '#10b981' },
                { range: '51-100', label: 'Moderate', color: '#f59e0b' },
                { range: '101-150', label: 'Unhealthy for Sensitive', color: '#f97316' },
                { range: '151-200', label: 'Unhealthy', color: '#ef4444' },
                { range: '201+', label: 'Hazardous', color: '#7c2d12' },
              ].map((item) => (
                <div key={item.range} className="flex items-center gap-3">
                  <div
                    className="w-4 h-4 rounded-full"
                    style={{ backgroundColor: item.color }}
                  />
                  <div className="flex-1">
                    <span className="text-sm text-secondary-700 dark:text-secondary-300">{item.range}</span>
                    <span className="text-xs text-secondary-500 ml-2">{item.label}</span>
                  </div>
                </div>
              ))}
            </div>
          </Card>

          {/* Selected Station Details */}
          {selectedStation && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
            >
              <Card className="bg-primary-500/5 border border-primary-500/20">
                <div className="flex items-center gap-3 mb-4">
                  <MapPin className="w-5 h-5 text-primary-500" />
                  <h3 className="font-semibold text-secondary-900 dark:text-white">
                    {selectedStation.name}
                  </h3>
                </div>
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-secondary-500">AQI</span>
                    <span
                      className="text-xl font-bold"
                      style={{ color: getAQIColor(selectedStation.aqi) }}
                    >
                      {selectedStation.aqi}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-secondary-500">Status</span>
                    <Badge
                      variant={selectedStation.status === 'active' ? 'success' : 'warning'}
                    >
                      {selectedStation.status}
                    </Badge>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-secondary-500">Air Quality</span>
                    <Badge
                      variant={
                        selectedStation.aqi <= 50 ? 'success' :
                        selectedStation.aqi <= 100 ? 'warning' : 'danger'
                      }
                    >
                      {getAQILabel(selectedStation.aqi)}
                    </Badge>
                  </div>
                </div>
              </Card>
            </motion.div>
          )}

          {/* Layer Controls */}
          <Card>
            <CardHeader title="Layer Options" subtitle="Toggle map layers" icon={<Layers className="w-5 h-5" />} />
            <div className="space-y-3 mt-4">
              <label className="flex items-center gap-3 cursor-pointer">
                <input
                  type="checkbox"
                  defaultChecked
                  className="w-4 h-4 rounded border-secondary-300 text-primary-500 focus:ring-primary-500"
                />
                <span className="text-sm text-secondary-700 dark:text-secondary-300">Monitoring Stations</span>
              </label>
              <label className="flex items-center gap-3 cursor-pointer">
                <input
                  type="checkbox"
                  defaultChecked
                  className="w-4 h-4 rounded border-secondary-300 text-primary-500 focus:ring-primary-500"
                />
                <span className="text-sm text-secondary-700 dark:text-secondary-300">Heat Overlay</span>
              </label>
              <label className="flex items-center gap-3 cursor-pointer">
                <input
                  type="checkbox"
                  className="w-4 h-4 rounded border-secondary-300 text-primary-500 focus:ring-primary-500"
                />
                <span className="text-sm text-secondary-700 dark:text-secondary-300">Traffic Data</span>
              </label>
              <label className="flex items-center gap-3 cursor-pointer">
                <input
                  type="checkbox"
                  className="w-4 h-4 rounded border-secondary-300 text-primary-500 focus:ring-primary-500"
                />
                <span className="text-sm text-secondary-700 dark:text-secondary-300">Weather Overlay</span>
              </label>
            </div>
          </Card>
        </div>
      </div>
    </motion.div>
  );
};

export default Heatmap;
