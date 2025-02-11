import React, { useState } from 'react';
import { LogOut, Lock, RotateCcw, AlertCircle } from 'lucide-react';

interface SettingsProps {
  onLogout: () => void;
  onResetAnalytics: () => void;
}

export function Settings({ onLogout, onResetAnalytics }: SettingsProps) {
  const [showResetConfirm, setShowResetConfirm] = useState(false);
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [passwordError, setPasswordError] = useState('');

  const handleChangePassword = (e: React.FormEvent) => {
    e.preventDefault();
    if (newPassword !== confirmPassword) {
      setPasswordError('New passwords do not match');
      return;
    }
    if (newPassword.length < 8) {
      setPasswordError('Password must be at least 8 characters long');
      return;
    }
    // Handle password change logic here
    setPasswordError('');
    setCurrentPassword('');
    setNewPassword('');
    setConfirmPassword('');
  };

  return (
    <div className="space-y-6">
      {/* Change Password */}
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 transition-all duration-300">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4 flex items-center gap-2">
          <Lock className="w-5 h-5" />
          Change Password
        </h3>
        <form onSubmit={handleChangePassword} className="space-y-4">
          <div>
            <input
              type="password"
              placeholder="Current Password"
              value={currentPassword}
              onChange={(e) => setCurrentPassword(e.target.value)}
              className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 transition-all duration-300"
            />
          </div>
          <div>
            <input
              type="password"
              placeholder="New Password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 transition-all duration-300"
            />
          </div>
          <div>
            <input
              type="password"
              placeholder="Confirm New Password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 transition-all duration-300"
            />
          </div>
          {passwordError && (
            <p className="text-red-500 dark:text-red-400 text-sm">{passwordError}</p>
          )}
          <button
            type="submit"
            className="w-full px-4 py-2 bg-blue-600 dark:bg-blue-500 text-white rounded-lg transition-all duration-300 hover:bg-blue-700 dark:hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 dark:focus:ring-offset-gray-800"
          >
            Update Password
          </button>
        </form>
      </div>

      {/* Reset Analytics */}
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 transition-all duration-300">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4 flex items-center gap-2">
          <RotateCcw className="w-5 h-5" />
          Reset Analytics
        </h3>
        {!showResetConfirm ? (
          <button
            onClick={() => setShowResetConfirm(true)}
            className="w-full px-4 py-2 bg-red-600 dark:bg-red-500 text-white rounded-lg transition-all duration-300 hover:bg-red-700 dark:hover:bg-red-600 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 dark:focus:ring-offset-gray-800"
          >
            Reset All Analytics Data
          </button>
        ) : (
          <div className="space-y-4">
            <div className="flex items-start gap-3 p-4 bg-red-50 dark:bg-red-900/20 rounded-lg">
              <AlertCircle className="w-5 h-5 text-red-600 dark:text-red-400 flex-shrink-0 mt-0.5" />
              <p className="text-sm text-red-600 dark:text-red-400">
                This action cannot be undone. All your analytics data, including task history, focus sessions, and virtual garden progress will be permanently deleted.
              </p>
            </div>
            <div className="flex gap-4">
              <button
                onClick={() => {
                  onResetAnalytics();
                  setShowResetConfirm(false);
                }}
                className="flex-1 px-4 py-2 bg-red-600 dark:bg-red-500 text-white rounded-lg transition-all duration-300 hover:bg-red-700 dark:hover:bg-red-600 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 dark:focus:ring-offset-gray-800"
              >
                Yes, Reset Everything
              </button>
              <button
                onClick={() => setShowResetConfirm(false)}
                className="flex-1 px-4 py-2 bg-gray-200 dark:bg-gray-700 text-gray-900 dark:text-gray-100 rounded-lg transition-all duration-300 hover:bg-gray-300 dark:hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 dark:focus:ring-offset-gray-800"
              >
                Cancel
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Logout */}
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 transition-all duration-300">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4 flex items-center gap-2">
          <LogOut className="w-5 h-5" />
          Logout
        </h3>
        <button
          onClick={onLogout}
          className="w-full px-4 py-2 bg-gray-200 dark:bg-gray-700 text-gray-900 dark:text-gray-100 rounded-lg transition-all duration-300 hover:bg-gray-300 dark:hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 dark:focus:ring-offset-gray-800"
        >
          Sign Out
        </button>
      </div>

      {/* Attribution */}
      <div className="text-center text-sm text-gray-500 dark:text-gray-400">
        Made with <span className="text-red-500">❤️</span> by 1enMap
      </div>
    </div>
  );
}