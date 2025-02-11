import React, { useState } from 'react';
import { Menu as MenuIcon, Timer, BarChart2, Settings, Sun, Moon, X } from 'lucide-react';
import { useTheme } from '../context/ThemeContext';

interface LayoutProps {
  children: React.ReactNode;
  currentView: 'tasks' | 'timer' | 'analytics' | 'settings';
  onViewChange: (view: 'tasks' | 'timer' | 'analytics' | 'settings') => void;
}

export function Layout({ children, currentView, onViewChange }: LayoutProps) {
  const { theme, toggleTheme } = useTheme();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const getNavItemClasses = (view: typeof currentView) => {
    const baseClasses = "flex items-center space-x-3 px-3 py-2 rounded-lg transition-all duration-300 hover:scale-[1.02] group";
    const activeClasses = "bg-gradient-to-r from-blue-500/10 to-purple-500/10 text-blue-600 dark:text-blue-400 hover:from-blue-500/20 hover:to-purple-500/20";
    const inactiveClasses = "text-gray-700 dark:text-gray-300 hover:bg-gradient-to-r hover:from-blue-500/10 hover:to-purple-500/10 hover:text-blue-600 dark:hover:text-blue-400";
    
    return `${baseClasses} ${currentView === view ? activeClasses : inactiveClasses}`;
  };

  const handleNavClick = (view: typeof currentView) => {
    onViewChange(view);
    setIsSidebarOpen(false); // Close sidebar on mobile after navigation
  };

  return (
    <div className="min-h-screen flex bg-gradient-to-br from-gray-50 to-white dark:from-gray-900 dark:to-gray-800 transition-colors duration-500">
      {/* Mobile Overlay */}
      {isSidebarOpen && (
        <div 
          className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40 md:hidden"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside className={`fixed inset-y-0 left-0 w-64 bg-white/90 dark:bg-gray-800/90 backdrop-blur-lg border-r border-gray-200 dark:border-gray-700 transition-all duration-300 hover:bg-white dark:hover:bg-gray-800 z-50 transform md:translate-x-0 ${
        isSidebarOpen ? 'translate-x-0' : '-translate-x-full'
      }`}>
        <div className="h-16 flex items-center justify-between px-6 border-b border-gray-200 dark:border-gray-700">
          <h1 className="text-xl font-semibold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent transition-all duration-300 cursor-default hover:scale-105">
            FocusFlow
          </h1>
          <div className="flex items-center gap-2">
            <button
              onClick={toggleTheme}
              className="p-2 rounded-lg bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 transition-all duration-300 hover:scale-110 hover:rotate-12 active:scale-95"
              aria-label={`Switch to ${theme === 'light' ? 'dark' : 'light'} mode`}
            >
              {theme === 'light' ? <Moon className="w-5 h-5" /> : <Sun className="w-5 h-5" />}
            </button>
            <button
              onClick={() => setIsSidebarOpen(false)}
              className="p-2 rounded-lg bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 transition-all duration-300 hover:scale-110 md:hidden"
              aria-label="Close sidebar"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>
        <nav className="p-4 space-y-2">
          <button
            onClick={() => handleNavClick('tasks')}
            className={getNavItemClasses('tasks')}
          >
            <MenuIcon className="w-5 h-5 transition-transform duration-300 group-hover:rotate-12" />
            <span className="transition-transform duration-300 group-hover:translate-x-0.5">Tasks</span>
          </button>
          <button
            onClick={() => handleNavClick('timer')}
            className={getNavItemClasses('timer')}
          >
            <Timer className="w-5 h-5 transition-transform duration-300 group-hover:rotate-12" />
            <span className="transition-transform duration-300 group-hover:translate-x-0.5">Focus Timer</span>
          </button>
          <button
            onClick={() => handleNavClick('analytics')}
            className={getNavItemClasses('analytics')}
          >
            <BarChart2 className="w-5 h-5 transition-transform duration-300 group-hover:rotate-12" />
            <span className="transition-transform duration-300 group-hover:translate-x-0.5">Analytics</span>
          </button>
          <button
            onClick={() => handleNavClick('settings')}
            className={getNavItemClasses('settings')}
          >
            <Settings className="w-5 h-5 transition-transform duration-300 group-hover:rotate-12" />
            <span className="transition-transform duration-300 group-hover:translate-x-0.5">Settings</span>
          </button>
        </nav>
      </aside>

      {/* Main content */}
      <main className="flex-1 md:ml-64">
        <div className="sticky top-0 z-40 h-16 border-b border-gray-200 dark:border-gray-700 bg-white/90 dark:bg-gray-800/90 backdrop-blur-lg flex items-center justify-between px-6 transition-all duration-300">
          <div className="flex items-center gap-4">
            <button
              onClick={() => setIsSidebarOpen(true)}
              className="p-2 rounded-lg bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 transition-all duration-300 hover:scale-110 md:hidden"
              aria-label="Open sidebar"
            >
              <MenuIcon className="w-5 h-5" />
            </button>
            <h2 className="text-lg font-medium bg-gradient-to-r from-blue-600 to-purple-600 dark:from-blue-400 dark:to-purple-400 bg-clip-text text-transparent transition-all duration-300 cursor-default">
              {currentView.charAt(0).toUpperCase() + currentView.slice(1)}
            </h2>
          </div>
        </div>
        <div className="relative">
          {children}
        </div>
      </main>
    </div>
  );
}