import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';

import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import Roadmap from './pages/Roadmap';
import AIChat from './pages/AIChat';
import CareerAnalysis from './pages/CareerAnalysis';
import ForgotPassword from './pages/ForgotPassword';
import OnboardingStep1 from './pages/OnboardingStep1';
import OnboardingStep2 from './pages/OnboardingStep2';
import ResetPassword from './pages/ResetPassword';
import ProtectedRoute from './components/ProtectedRoute';
import OnboardingRoute from './components/OnboardingRoute';
import MainLayout from './components/MainLayout';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* 1. Alihan rute utama */}
        <Route path="/" element={<Navigate to="/login" replace />} />
        
        {/* 2. RUTE PUBLIK */}
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/forgotpassword" element={<ForgotPassword />} />
        <Route path="/reset-password" element={<ResetPassword />} />

        {/* 3. RUTE ONBOARDING (Harus login, tapi belum onboarding) */}
        <Route
          path="/onboarding/step-1"
          element={
            <OnboardingRoute>
              <OnboardingStep1 />
            </OnboardingRoute>
          }
        />
        <Route
          path="/onboarding/step-2"
          element={
            <OnboardingRoute>
              <OnboardingStep2 />
            </OnboardingRoute>
          }
        />
        
        {/* 4. RUTE TERPROTEKSI (Harus login + sudah onboarding) */}
        <Route
          element={
            <ProtectedRoute>
              <MainLayout />
            </ProtectedRoute>
          }
        >
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/roadmap" element={<Roadmap />} />
          <Route path="/chat" element={<AIChat />} />
          <Route path="/career-analysis" element={<CareerAnalysis />} />
        </Route>

        {/* 5. Fallback */}
        <Route path="*" element={<Navigate to="/login" replace />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;