import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { ProtectedRoute } from './components/ProtectedRoute';
import LoginPage      from './pages/LoginPage';
import RegisterPage   from './pages/RegisterPage';
import DashboardPage  from './pages/DashboardPage';

import './App.css'
import ProjectsPage from './pages/ProjectsPage';
import ProjectDetailPage from './pages/ProjectDetailPage';

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <Routes>
          <Route path="/login"    element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />

          {/* Rutas protegidas: usan <Outlet /> dentro de ProtectedRoute */}
          <Route element={<ProtectedRoute />}>
            <Route path="/dashboard" element={<DashboardPage />}/>
            <Route path="/projects" element={<ProjectsPage />} />
            <Route path="/projects/:id" element={<ProjectDetailPage />} />
          </Route>

          {/* Raiz -> dashboard (si no autenticado, ProtectedRoute va a /login) */}
          <Route path="/" element={<Navigate to="/dashboard" replace />} />

          {/* Cualquier ruta desconocida -> login */}
          <Route path="*" element={<Navigate to="/login" replace />} />
        </Routes>
      </AuthProvider>
    </BrowserRouter>
  );
}


