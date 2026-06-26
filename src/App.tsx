import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AnimatePresence } from 'framer-motion';
import { ThemeProvider } from './context/ThemeContext';
import { AuthProvider } from './context/AuthContext';
import { Layout } from './components/layout/Layout';
import { ProtectedRoute } from './components/ProtectedRoute';
import {
  Dashboard,
  Login,
  AQIForecast,
  SourceAttribution,
  CitizenAdvisory,
  Enforcement,
  Heatmap,
  CityAnalytics,
  Settings,
} from './pages';

function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <BrowserRouter>
          <AnimatePresence mode="wait">
            <Routes>
              {/* Public Route */}
              <Route path="/login" element={<Login />} />

              {/* Protected Routes */}
              <Route
                element={
                  <ProtectedRoute>
                    <Layout />
                  </ProtectedRoute>
                }
              >
                <Route path="/dashboard" element={<Dashboard />} />
                <Route path="/forecast" element={<AQIForecast />} />
                <Route path="/source-attribution" element={<SourceAttribution />} />
                <Route path="/heatmap" element={<Heatmap />} />
                <Route path="/citizen-advisory" element={<CitizenAdvisory />} />
                <Route path="/enforcement" element={<Enforcement />} />
                <Route path="/city-analytics" element={<CityAnalytics />} />
                <Route path="/settings" element={<Settings />} />
              </Route>

              {/* Default Redirect */}
              <Route path="/" element={<Navigate to="/dashboard" replace />} />
              <Route path="*" element={<Navigate to="/dashboard" replace />} />
            </Routes>
          </AnimatePresence>
        </BrowserRouter>
      </AuthProvider>
    </ThemeProvider>
  );
}

export default App;
