
import React, { useState, useEffect } from "react";
import { BrowserRouter, Route, Routes, Navigate, useLocation, useNavigate } from "react-router-dom";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "sonner";
import { TooltipProvider } from "@radix-ui/react-tooltip";
import { AuthProvider, useAuth } from "./context/AuthContext";
import { MetricsProvider } from "./context/MetricsContext";
import { NotificationProvider } from "./context/NotificationContext";

// Import pages
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import Complaints from "./pages/Complaints";
import CustomerService from "./pages/CustomerService";
import DataEntry from "./pages/DataEntry";
import Index from "./pages/Index";
import Maintenance from "./pages/Maintenance";
import NotFound from "./pages/NotFound";
import Reports from "./pages/Reports";
import Settings from "./pages/Settings";
// Import new pages
import CustomerServiceDashboard from "./pages/CustomerServiceDashboard";
import MaintenanceSatisfaction from "./pages/MaintenanceSatisfaction";

import "./App.css";

// Create a client
const queryClient = new QueryClient();

interface ProtectedRouteProps {
  children: React.ReactNode;
}

const ProtectedRoute = ({ children }: ProtectedRouteProps) => {
  const { isAuthenticated } = useAuth();
  const location = useLocation();

  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  return <>{children}</>;
};

const AppRoutes = () => {
  return (
    <Routes>
      <Route path="/" element={<Index />} />
      <Route path="/login" element={<Login />} />
      <Route
        path="/dashboard"
        element={
          <ProtectedRoute>
            <Dashboard />
          </ProtectedRoute>
        }
      />
      <Route
        path="/complaints"
        element={
          <ProtectedRoute>
            <Complaints />
          </ProtectedRoute>
        }
      />
      <Route
        path="/customer-service"
        element={
          <ProtectedRoute>
            <CustomerService />
          </ProtectedRoute>
        }
      />
      <Route
        path="/data-entry"
        element={
          <ProtectedRoute>
            <DataEntry />
          </ProtectedRoute>
        }
      />
      <Route
        path="/maintenance"
        element={
          <ProtectedRoute>
            <Maintenance />
          </ProtectedRoute>
        }
      />
      <Route
        path="/reports"
        element={
          <ProtectedRoute>
            <Reports />
          </ProtectedRoute>
        }
      />
      <Route
        path="/settings"
        element={
          <ProtectedRoute>
            <Settings />
          </ProtectedRoute>
        }
      />
      {/* Add new routes */}
      <Route
        path="/customer-service-dashboard"
        element={
          <ProtectedRoute>
            <CustomerServiceDashboard />
          </ProtectedRoute>
        }
      />
      <Route
        path="/maintenance-satisfaction"
        element={
          <ProtectedRoute>
            <MaintenanceSatisfaction />
          </ProtectedRoute>
        }
      />
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
};

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <NotificationProvider>
          <MetricsProvider>
            <TooltipProvider>
              <BrowserRouter>
                <AppRoutes />
                <Toaster richColors position="top-center" />
              </BrowserRouter>
            </TooltipProvider>
          </MetricsProvider>
        </NotificationProvider>
      </AuthProvider>
    </QueryClientProvider>
  );
}

export default App;
