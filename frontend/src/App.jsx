/**
 * FMS - Main App Component
 * Routes aur Layouts - Vipin Chaturvedi
 */

import { Routes, Route, Navigate } from 'react-router-dom';
import ProtectedRoute from './components/ProtectedRoute.jsx';
import Navbar from './components/Navbar.jsx';
import LanguageToggle from './components/LanguageToggle.jsx';
import Login from './pages/Login.jsx';
import Register from './pages/Register.jsx';
import Dashboard from './pages/Dashboard.jsx';
import Crop from './pages/Crop.jsx';
import Expense from './pages/Expense.jsx';
import Labor from './pages/Labor.jsx';
import Stock from './pages/Stock.jsx';
import Reports from './pages/Reports.jsx';

export default function App() {
  return (
    <Routes>
      <Route path="/login" element={<AuthLayout><Login/></AuthLayout>} />
      <Route path="/register" element={<AuthLayout><Register/></AuthLayout>} />
      <Route path="/" element={<ProtectedRoute><MainLayout><Dashboard/></MainLayout></ProtectedRoute>} />
      <Route path="/crops" element={<ProtectedRoute><MainLayout><Crop/></MainLayout></ProtectedRoute>} />
      <Route path="/expenses" element={<ProtectedRoute><MainLayout><Expense/></MainLayout></ProtectedRoute>} />
      <Route path="/labor" element={<ProtectedRoute><MainLayout><Labor/></MainLayout></ProtectedRoute>} />
      <Route path="/stock" element={<ProtectedRoute><MainLayout><Stock/></MainLayout></ProtectedRoute>} />
      <Route path="/reports" element={<ProtectedRoute><MainLayout><Reports/></MainLayout></ProtectedRoute>} />
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}

function AuthLayout({ children }) {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center relative overflow-hidden">
      {/* Modern gradient background */}
      <div className="absolute inset-0 bg-gradient-to-br from-slate-50 via-emerald-50/30 to-teal-50" />
      {/* Subtle grid pattern */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#94a3b8_0.5px,transparent_0.5px),linear-gradient(to_bottom,#94a3b8_0.5px,transparent_0.5px)] bg-[size:24px_24px] opacity-[0.15]" />
      {/* Soft orbs */}
      <div className="absolute -top-32 -right-32 w-96 h-96 bg-emerald-300/20 rounded-full blur-3xl" />
      <div className="absolute -bottom-32 -left-32 w-96 h-96 bg-teal-300/20 rounded-full blur-3xl" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-emerald-200/10 rounded-full blur-3xl" />
      <div className="absolute top-6 right-6 z-10">
        <LanguageToggle variant="light" />
      </div>
      <div className="relative z-10 w-full max-w-md px-6">{children}</div>
    </div>
  );
}

function MainLayout({ children }) {
  return (
    <div className="min-h-screen bg-slate-50/80">
      <Navbar/>
      <div className="max-w-6xl mx-auto px-4 py-6 md:py-8">{children}</div>
    </div>
  );
}


