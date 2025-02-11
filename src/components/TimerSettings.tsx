import React from 'react';
import { Clock, Coffee, Moon } from 'lucide-react';
import type { PomodoroSettings } from '../types';

interface TimerSettingsProps {
  settings: PomodoroSettings;
  onUpdate: (settings: PomodoroSettings) => void;
}

export function TimerSettings({ settings, onUpdate }: TimerSettingsProps) {
  const handleChange = (key: keyof PomodoroSettings, value: number) => {
    onUpdate({ ...settings, [key]: value });
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-3 mb-2">
        <Clock className="w-5 h-5 text-blue-500" />
        <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100">Timer Settings</h3>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="relative group">
          <div className="absolute inset-0 bg-gradient-to-r from-blue-500 to-purple-500 rounded-lg blur opacity-25 group-hover:opacity-40 transition-opacity" />
          <div className="relative bg-white dark:bg-gray-800 p-4 rounded-lg border border-gray-200 dark:border-gray-700">
            <div className="flex items-center gap-2 mb-2">
              <Clock className="w-4 h-4 text-blue-500" />
              <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Work Duration</span>
            </div>
            <input
              type="range"
              min="1"
              max="60"
              value={settings.workDuration}
              onChange={(e) => handleChange('workDuration', parseInt(e.target.value))}
              className="w-full h-2 bg-gray-200 dark:bg-gray-700 rounded-lg appearance-none cursor-pointer"
            />
            <div className="mt-2 text-center text-sm font-medium text-gray-900 dark:text-gray-100">
              {settings.workDuration} minutes
            </div>
          </div>
        </div>

        <div className="relative group">
          <div className="absolute inset-0 bg-gradient-to-r from-green-500 to-teal-500 rounded-lg blur opacity-25 group-hover:opacity-40 transition-opacity" />
          <div className="relative bg-white dark:bg-gray-800 p-4 rounded-lg border border-gray-200 dark:border-gray-700">
            <div className="flex items-center gap-2 mb-2">
              <Coffee className="w-4 h-4 text-green-500" />
              <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Short Break</span>
            </div>
            <input
              type="range"
              min="1"
              max="15"
              value={settings.shortBreakDuration}
              onChange={(e) => handleChange('shortBreakDuration', parseInt(e.target.value))}
              className="w-full h-2 bg-gray-200 dark:bg-gray-700 rounded-lg appearance-none cursor-pointer"
            />
            <div className="mt-2 text-center text-sm font-medium text-gray-900 dark:text-gray-100">
              {settings.shortBreakDuration} minutes
            </div>
          </div>
        </div>

        <div className="relative group">
          <div className="absolute inset-0 bg-gradient-to-r from-purple-500 to-pink-500 rounded-lg blur opacity-25 group-hover:opacity-40 transition-opacity" />
          <div className="relative bg-white dark:bg-gray-800 p-4 rounded-lg border border-gray-200 dark:border-gray-700">
            <div className="flex items-center gap-2 mb-2">
              <Moon className="w-4 h-4 text-purple-500" />
              <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Long Break</span>
            </div>
            <input
              type="range"
              min="5"
              max="30"
              value={settings.longBreakDuration}
              onChange={(e) => handleChange('longBreakDuration', parseInt(e.target.value))}
              className="w-full h-2 bg-gray-200 dark:bg-gray-700 rounded-lg appearance-none cursor-pointer"
            />
            <div className="mt-2 text-center text-sm font-medium text-gray-900 dark:text-gray-100">
              {settings.longBreakDuration} minutes
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}