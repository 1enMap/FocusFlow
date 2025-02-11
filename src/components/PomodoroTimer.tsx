import React, { useState, useEffect, useCallback } from 'react';
import { Play, Pause, SkipForward, Settings as SettingsIcon } from 'lucide-react';
import { VirtualGarden } from './VirtualGarden';
import { TimerSettings } from './TimerSettings';
import type { TimerState, PomodoroSettings, Tree, PomodoroSession } from '../types';

interface PomodoroTimerProps {
  onSessionComplete: (session: PomodoroSession) => void;
  onTreeComplete: (tree: Tree) => void;
}

const DEFAULT_SETTINGS: PomodoroSettings = {
  workDuration: 25,
  shortBreakDuration: 5,
  longBreakDuration: 15,
  longBreakInterval: 4
};

const TREE_TYPES: Tree['type'][] = ['oak', 'maple', 'pine', 'cherry'];

export function PomodoroTimer({ onSessionComplete, onTreeComplete }: PomodoroTimerProps) {
  const [settings, setSettings] = useState<PomodoroSettings>(DEFAULT_SETTINGS);
  const [showSettings, setShowSettings] = useState(false);
  const [timerState, setTimerState] = useState<TimerState>({
    isRunning: false,
    mode: 'work',
    timeRemaining: settings.workDuration * 60,
    currentSession: 1
  });
  const [currentTree, setCurrentTree] = useState<Tree | null>(null);
  const [completedTrees, setCompletedTrees] = useState<Tree[]>([]);

  // Timer controls
  const startTimer = useCallback(() => {
    setTimerState(prev => ({ ...prev, isRunning: true }));
  }, []);

  const pauseTimer = useCallback(() => {
    setTimerState(prev => ({ ...prev, isRunning: false }));
  }, []);

  const skipSession = useCallback(() => {
    const nextMode = timerState.mode === 'work'
      ? (timerState.currentSession % settings.longBreakInterval === 0 ? 'longBreak' : 'shortBreak')
      : 'work';

    const nextDuration = nextMode === 'work'
      ? settings.workDuration
      : nextMode === 'longBreak'
        ? settings.longBreakDuration
        : settings.shortBreakDuration;

    if (timerState.mode === 'work') {
      const session: PomodoroSession = {
        id: crypto.randomUUID(),
        startTime: new Date(Date.now() - (settings.workDuration * 60 - timerState.timeRemaining) * 1000).toISOString(),
        endTime: new Date().toISOString(),
        duration: settings.workDuration * 60 - timerState.timeRemaining,
        mode: 'work'
      };
      onSessionComplete(session);
    }

    setTimerState(prev => ({
      isRunning: false,
      mode: nextMode,
      timeRemaining: nextDuration * 60,
      currentSession: nextMode === 'work' ? prev.currentSession + 1 : prev.currentSession
    }));
  }, [timerState.mode, timerState.currentSession, timerState.timeRemaining, settings, onSessionComplete]);

  // Timer countdown effect
  useEffect(() => {
    let intervalId: number;

    if (timerState.isRunning && timerState.timeRemaining > 0) {
      intervalId = window.setInterval(() => {
        setTimerState(prev => ({
          ...prev,
          timeRemaining: prev.timeRemaining - 1
        }));
      }, 1000);
    } else if (timerState.timeRemaining === 0 && timerState.isRunning) {
      if (timerState.mode === 'work') {
        const session: PomodoroSession = {
          id: crypto.randomUUID(),
          startTime: new Date(Date.now() - settings.workDuration * 60 * 1000).toISOString(),
          endTime: new Date().toISOString(),
          duration: settings.workDuration * 60,
          mode: 'work'
        };
        onSessionComplete(session);
      }
      skipSession();
    }

    return () => {
      if (intervalId) {
        clearInterval(intervalId);
      }
    };
  }, [timerState.isRunning, timerState.timeRemaining, timerState.mode, settings.workDuration, onSessionComplete, skipSession]);

  // Create new tree when work session starts
  useEffect(() => {
    if (timerState.isRunning && timerState.mode === 'work' && !currentTree) {
      const newTree: Tree = {
        id: crypto.randomUUID(),
        stage: 'seed',
        health: 0,
        createdAt: new Date().toISOString(),
        type: TREE_TYPES[Math.floor(Math.random() * TREE_TYPES.length)]
      };
      setCurrentTree(newTree);
    }
  }, [timerState.isRunning, timerState.mode, currentTree]);

  // Update tree progress during work session
  useEffect(() => {
    if (currentTree && timerState.mode === 'work' && timerState.isRunning) {
      const totalSeconds = settings.workDuration * 60;
      const progress = ((totalSeconds - timerState.timeRemaining) / totalSeconds) * 100;
      
      setCurrentTree(prev => {
        if (!prev) return null;
        
        const health = Math.min(100, progress);
        let stage: Tree['stage'] = prev.stage;
        
        if (health >= 25 && stage === 'seed') stage = 'sapling';
        else if (health >= 50 && stage === 'sapling') stage = 'growing';
        else if (health >= 100 && stage === 'growing') stage = 'mature';
        
        if (stage === prev.stage && health === prev.health) {
          return prev; // Prevent unnecessary updates
        }
        
        return { ...prev, health, stage };
      });
    }
  }, [currentTree, timerState.mode, timerState.timeRemaining, timerState.isRunning, settings.workDuration]);

  // Complete tree when work session ends
  useEffect(() => {
    if (currentTree?.stage === 'mature' && timerState.mode !== 'work') {
      const completedTree = { ...currentTree, completedAt: new Date().toISOString() };
      setCompletedTrees(prev => [...prev, completedTree]);
      onTreeComplete(completedTree);
      setCurrentTree(null);
    }
  }, [currentTree, timerState.mode, onTreeComplete]);

  // Format time remaining
  const formatTime = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes.toString().padStart(2, '0')}:${remainingSeconds.toString().padStart(2, '0')}`;
  };

  return (
    <div className="space-y-8">
      <div className="perspective-1000">
        <div className={`relative transition-transform duration-700 transform-style-3d ${showSettings ? 'rotate-y-180' : ''}`}>
          {/* Timer Card - Front */}
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg dark:shadow-gray-900/30 p-8 max-w-md mx-auto transition-all duration-500 hover:shadow-xl dark:hover:shadow-gray-900/50 transform hover:scale-[1.01] backface-hidden">
            <div className="text-center space-y-6">
              {/* Mode indicator */}
              <div className={`text-lg font-medium transition-colors duration-300 ${
                timerState.mode === 'work' ? 'text-blue-600 dark:text-blue-400' :
                timerState.mode === 'shortBreak' ? 'text-green-600 dark:text-green-400' : 
                'text-purple-600 dark:text-purple-400'
              }`}>
                {timerState.mode === 'work' ? 'Focus Time' : 
                 timerState.mode === 'shortBreak' ? 'Short Break' : 'Long Break'}
              </div>

              {/* Timer display */}
              <div className={`text-6xl font-bold tabular-nums transition-all duration-300 ${
                timerState.isRunning ? 'scale-105' : 'scale-100'
              } ${
                timerState.mode === 'work' ? 'text-blue-700 dark:text-blue-300' :
                timerState.mode === 'shortBreak' ? 'text-green-700 dark:text-green-300' : 
                'text-purple-700 dark:text-purple-300'
              }`}>
                {formatTime(timerState.timeRemaining)}
              </div>

              {/* Session counter */}
              <div className="text-sm text-gray-500 dark:text-gray-400 transition-all duration-300 hover:text-gray-700 dark:hover:text-gray-300">
                Session {timerState.currentSession}
              </div>

              {/* Controls */}
              <div className="flex items-center justify-center gap-4">
                <button
                  onClick={timerState.isRunning ? pauseTimer : startTimer}
                  className={`p-3 rounded-full transition-all duration-300 transform hover:scale-110 active:scale-95 ${
                    timerState.mode === 'work' ? 'bg-blue-600 hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-600' :
                    timerState.mode === 'shortBreak' ? 'bg-green-600 hover:bg-green-700 dark:bg-green-500 dark:hover:bg-green-600' :
                    'bg-purple-600 hover:bg-purple-700 dark:bg-purple-500 dark:hover:bg-purple-600'
                  } text-white`}
                >
                  {timerState.isRunning ? (
                    <Pause className="w-6 h-6 transition-transform duration-300 hover:scale-110" />
                  ) : (
                    <Play className="w-6 h-6 transition-transform duration-300 hover:scale-110" />
                  )}
                </button>
                <button
                  onClick={skipSession}
                  className="p-3 rounded-full bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 transition-all duration-300 hover:bg-gray-200 dark:hover:bg-gray-600 hover:scale-110 active:scale-95"
                >
                  <SkipForward className="w-6 h-6 transition-transform duration-300 hover:rotate-12" />
                </button>
                <button
                  onClick={() => setShowSettings(!showSettings)}
                  className="p-3 rounded-full bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 transition-all duration-300 hover:bg-gray-200 dark:hover:bg-gray-600 hover:scale-110 active:scale-95"
                >
                  <SettingsIcon className="w-6 h-6 transition-transform duration-300 hover:rotate-90" />
                </button>
              </div>
            </div>
          </div>

          {/* Settings Card - Back */}
          <div className="absolute inset-0 bg-white dark:bg-gray-800 rounded-xl shadow-lg p-8 backface-hidden rotate-y-180">
            <TimerSettings
              settings={settings}
              onUpdate={(newSettings) => {
                setSettings(newSettings);
                setTimerState(prev => ({
                  ...prev,
                  timeRemaining: newSettings.workDuration * 60
                }));
              }}
            />
            <button
              onClick={() => setShowSettings(false)}
              className="mt-6 w-full px-4 py-2 bg-blue-600 dark:bg-blue-500 text-white rounded-lg transition-all duration-300 hover:bg-blue-700 dark:hover:bg-blue-600"
            >
              Save Settings
            </button>
          </div>
        </div>
      </div>

      <VirtualGarden currentTree={currentTree} completedTrees={completedTrees} />
    </div>
  );
}