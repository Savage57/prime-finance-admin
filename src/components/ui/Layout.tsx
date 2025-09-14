import React, { useState } from 'react';
import { Outlet, Link, useLocation, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  LayoutDashboard,
  Users,
  CreditCard,
  PiggyBank,
  ArrowLeftRight,
  Settings,
  Activity,
  Shield,
  Menu,
  X,
  LogOut,
  User,
  Bell,
  Sun,
  Moon,
  ChevronDown,
} from 'lucide-react';
import { useAuth } from '../../hooks/useAuth';
import { useTheme } from '../../hooks/useTheme';
import { Button } from './Button';

const navigation = [
  { name: 'Dashboard', href: '/dashboard', icon: LayoutDashboard },
  { name: 'Users', href: '/users', icon: Users },
  { name: 'Loans', href: '/loans', icon: CreditCard },
  { name: 'Savings', href: '/savings', icon: PiggyBank },
  { name: 'Transactions', href: '/transactions', icon: ArrowLeftRight },
  { name: 'Admins', href: '/admins', icon: Shield },
  { name: 'Activity Logs', href: '/activity', icon: Activity },
  { name: 'Settings', href: '/settings', icon: Settings },
];

export function Layout() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [profileDropdownOpen, setProfileDropdownOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const { admin, logout } = useAuth();
  const { theme, toggleTheme } = useTheme();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Mobile sidebar backdrop */}
      <AnimatePresence>
        {sidebarOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-40 lg:hidden"
            onClick={() => setSidebarOpen(false)}
          >
            <div className="absolute inset-0 bg-gray-600 opacity-75" />
          </motion.div>
        )}
      </AnimatePresence>

      {/* Sidebar */}
      <motion.div
        initial={false}
        animate={{ x: sidebarOpen ? 0 : '-100%' }}
        className="fixed inset-y-0 left-0 z-50 w-64 bg-white dark:bg-gray-800 shadow-lg lg:translate-x-0 lg:static lg:inset-0"
      >
        <div className="flex items-center justify-between h-16 px-6 border-b border-gray-200 dark:border-gray-700">
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-gradient-to-br from-brand-500 to-brand-600 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-sm">MP</span>
            </div>
            <span className="text-xl font-bold text-gray-900 dark:text-white">Admin</span>
          </div>
          <button
            onClick={() => setSidebarOpen(false)}
            className="lg:hidden p-2 rounded-md text-gray-400 hover:text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-700"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <nav className="mt-6 px-3">
          <div className="space-y-1">
            {navigation.map((item) => {
              const isActive = location.pathname.startsWith(item.href);
              return (
                <Link
                  key={item.name}
                  to={item.href}
                  className={`group flex items-center px-3 py-2 text-sm font-medium rounded-lg transition-colors ${
                    isActive
                      ? 'bg-brand-100 dark:bg-brand-900/20 text-brand-600 dark:text-brand-400'
                      : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
                  }`}
                >
                  <item.icon
                    className={`mr-3 h-5 w-5 ${
                      isActive ? 'text-brand-600 dark:text-brand-400' : 'text-gray-400'
                    }`}
                  />
                  {item.name}
                </Link>
              );
            })}
          </div>
        </nav>
      </motion.div>

      {/* Main content */}
      <div className="lg:pl-64">
        {/* Top navbar */}
        <div className="sticky top-0 z-30 bg-white dark:bg-gray-800 shadow-sm border-b border-gray-200 dark:border-gray-700">
          <div className="flex items-center justify-between h-16 px-6">
            <div className="flex items-center">
              <button
                onClick={() => setSidebarOpen(true)}
                className="lg:hidden p-2 rounded-md text-gray-400 hover:text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-700"
              >
                <Menu className="h-5 w-5" />
              </button>
              <h1 className="ml-4 text-2xl font-semibold text-gray-900 dark:text-white lg:ml-0">
                {navigation.find(item => location.pathname.startsWith(item.href))?.name || 'Dashboard'}
              </h1>
            </div>

            <div className="flex items-center space-x-4">
              {/* Theme toggle */}
              <button
                onClick={toggleTheme}
                className="p-2 rounded-lg text-gray-400 hover:text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-700"
              >
                {theme === 'light' ? <Moon className="h-5 w-5" /> : <Sun className="h-5 w-5" />}
              </button>

              {/* Notifications */}
              <button className="p-2 rounded-lg text-gray-400 hover:text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-700 relative">
                <Bell className="h-5 w-5" />
                <span className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full"></span>
              </button>

              {/* Profile dropdown */}
              <div className="relative">
                <button
                  onClick={() => setProfileDropdownOpen(!profileDropdownOpen)}
                  className="flex items-center space-x-3 p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700"
                >
                  <div className="w-8 h-8 bg-brand-500 rounded-full flex items-center justify-center">
                    <span className="text-white text-sm font-medium">
                      {admin?.firstName?.[0]}{admin?.lastName?.[0]}
                    </span>
                  </div>
                  <div className="hidden md:block text-left">
                    <div className="text-sm font-medium text-gray-900 dark:text-white">
                      {admin?.firstName} {admin?.lastName}
                    </div>
                    <div className="text-xs text-gray-500 dark:text-gray-400">
                      {admin?.role}
                    </div>
                  </div>
                  <ChevronDown className="h-4 w-4 text-gray-400" />
                </button>

                <AnimatePresence>
                  {profileDropdownOpen && (
                    <motion.div
                      initial={{ opacity: 0, scale: 0.95 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.95 }}
                      className="absolute right-0 mt-2 w-48 bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700 py-1"
                    >
                      <Link
                        to="/profile"
                        className="flex items-center px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
                        onClick={() => setProfileDropdownOpen(false)}
                      >
                        <User className="mr-3 h-4 w-4" />
                        Profile
                      </Link>
                      <button
                        onClick={handleLogout}
                        className="flex items-center w-full px-4 py-2 text-sm text-red-600 hover:bg-gray-100 dark:hover:bg-gray-700"
                      >
                        <LogOut className="mr-3 h-4 w-4" />
                        Sign out
                      </button>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </div>
          </div>
        </div>

        {/* Page content */}
        <main className="p-6">
          <Outlet />
        </main>
      </div>
    </div>
  );
}