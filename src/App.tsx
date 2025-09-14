import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import { Toaster } from 'react-hot-toast';
import { ThemeProvider } from './hooks/useTheme';
import { Layout } from './components/ui/Layout';
import { Login } from './pages/Login';
import { Dashboard } from './pages/Dashboard';
import { Users } from './pages/Users';
import { useAuthStore } from './stores/authStore';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 5 * 60 * 1000, // 5 minutes
      cacheTime: 10 * 60 * 1000, // 10 minutes
      retry: 1,
      refetchOnWindowFocus: false,
    },
  },
});

function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const isAuthenticated = useAuthStore(state => state.isAuthenticated);
  
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }
  
  return <>{children}</>;
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider>
        <Router>
          <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
            <Routes>
              <Route path="/login" element={<Login />} />
              <Route
                path="/*"
                element={
                  <ProtectedRoute>
                    <Layout>
                      <Routes>
                        <Route path="/" element={<Navigate to="/dashboard" replace />} />
                        <Route path="/dashboard" element={<Dashboard />} />
                        <Route path="/users" element={<Users />} />
                        {/* Add more protected routes here */}
                        <Route path="/loans" element={<div>Loans Page (Coming Soon)</div>} />
                        <Route path="/savings" element={<div>Savings Page (Coming Soon)</div>} />
                        <Route path="/transactions" element={<div>Transactions Page (Coming Soon)</div>} />
                        <Route path="/admins" element={<div>Admins Page (Coming Soon)</div>} />
                        <Route path="/activity" element={<div>Activity Logs Page (Coming Soon)</div>} />
                        <Route path="/settings" element={<div>Settings Page (Coming Soon)</div>} />
                      </Routes>
                    </Layout>
                  </ProtectedRoute>
                }
              />
            </Routes>
          </div>
        </Router>
        
        <Toaster
          position="top-right"
          toastOptions={{
            duration: 4000,
            style: {
              background: 'var(--toast-bg)',
              color: 'var(--toast-color)',
            },
          }}
        />
        
        <ReactQueryDevtools initialIsOpen={false} />
      </ThemeProvider>
    </QueryClientProvider>
  );
}

export default App;