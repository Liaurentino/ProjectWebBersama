import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';

import Login from './pages/Login';
import Register from './pages/Register'; // Pastikan nama file & import sudah kapital 'R'
import Dashboard from './pages/Dashboard';
import Roadmap from './pages/Roadmap';
import AIChat from './pages/AIChat';
import CareerAnalysis from './pages/CareerAnalysis';
import ForgotPassword from './pages/ForgotPassword';
import OnboardingStep1 from './pages/OnboardingStep1';
import OnboardingStep2 from './pages/OnboardingStep2';

import ProtectedRoute from './components/ProtectedRoute';
import MainLayout from './components/MainLayout';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* 1. Alihan rute utama */}
        <Route path="/" element={<Navigate to="/login" replace />} />
        
        {/* 2. RUTE PUBLIK (Bisa diakses tanpa login - taruh di sini) */}
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} /> 
        <Route path="/forgotpassword" element={<ForgotPassword />} /> 
        <Route path="/onboarding/step-1" element={<OnboardingStep1 />} />
        <Route path="/onboarding/step-2" element={<OnboardingStep2 />} />
        
        {/* 3. RUTE TERPROTEKSI (Hanya bisa diakses jika sudah login) */}
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

        {/* 4. Fallback jika URL tidak ditemukan */}
        <Route path="*" element={<Navigate to="/login" replace />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;