import React, { useState, useEffect } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './services/AuthContext';
import { useAuth } from './services/useAuth';
import './App.css';

// Pages
import LoginPage from './pages/LoginPage';
import SignupPage from './pages/SignupPage';
import DashboardPage from './pages/DashboardPage';
import ProjectsPage from './pages/ProjectsPage';
import ProjectDetailPage from './pages/ProjectDetailPage';

// Protected Route Component
const ProtectedRoute = ({ element }) => {
  const { isAuthenticated, authReady } = useAuth();

  if (!authReady) {
    return <div className="loading">Checking session...</div>;
  }

  return isAuthenticated ? element : <Navigate to="/login" replace />;
};

// Auth Routes
const AuthRoutes = () => {
  const { isAuthenticated, authReady } = useAuth();

  if (!authReady) {
    return <div className="loading">Loading...</div>;
  }

  return isAuthenticated ? <Navigate to="/dashboard" replace /> : <Navigate to="/login" replace />;
};

function AppContent() {
  return (
    <Routes>
      <Route path="/" element={<AuthRoutes />} />
      <Route path="/login" element={<LoginPage />} />
      <Route path="/signup" element={<SignupPage />} />
      <Route path="/dashboard" element={<ProtectedRoute element={<DashboardPage />} />} />
      <Route path="/projects" element={<ProtectedRoute element={<ProjectsPage />} />} />
      <Route path="/projects/:id" element={<ProtectedRoute element={<ProjectDetailPage />} />} />
    </Routes>
  );
}

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <AppContent />
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;
