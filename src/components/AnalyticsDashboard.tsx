import React, { useMemo } from 'react';
import { BarChart2, Clock, CheckSquare, Trees, Leaf, TrendingUp, Award, Target } from 'lucide-react';
import type { Task, PomodoroSession, Tree } from '../types';

interface AnalyticsDashboardProps {
  tasks: Task[];
  sessions: PomodoroSession[];
  trees: Tree[];
}

export function AnalyticsDashboard({ tasks, sessions, trees }: AnalyticsDashboardProps) {
  const stats = useMemo(() => {
    const now = new Date();
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const thisWeek = new Date(today.getTime() - 7 * 24 * 60 * 60 * 1000);

    return {
      todayTasks: tasks.filter(task => 
        task.completed && new Date(task.updatedAt) >= today
      ).length,
      weekTasks: tasks.filter(task => 
        task.completed && new Date(task.updatedAt) >= thisWeek
      ).length,
      todayFocus: sessions
        .filter(session => new Date(session.startTime) >= today)
        .reduce((acc, session) => acc + session.duration, 0),
      weekFocus: sessions
        .filter(session => new Date(session.startTime) >= thisWeek)
        .reduce((acc, session) => acc + session.duration, 0),
      todayTrees: trees.filter(tree => 
        tree.completedAt && new Date(tree.completedAt) >= today
      ).length,
      weekTrees: trees.filter(tree => 
        tree.completedAt && new Date(tree.completedAt) >= thisWeek
      ).length,
      completionRate: tasks.length > 0 
        ? Math.round((tasks.filter(task => task.completed).length / tasks.length) * 100)
        : 0,
    };
  }, [tasks, sessions, trees]);

  const formatTime = (minutes: number) => {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return `${hours}h ${mins}m`;
  };

  const now = new Date();
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());

  return (
    <div className="space-y-6">
      {/* Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-6 border border-gray-100 dark:border-gray-700 transition-all duration-300 hover:shadow-md hover:border-blue-200 dark:hover:border-blue-700 group">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600 dark:text-gray-300">Tasks Completed</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-gray-100 mt-1 transition-transform duration-300 group-hover:scale-105">
                {stats.todayTasks}
              </p>
              <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">This week: {stats.weekTasks}</p>
            </div>
            <div className="bg-blue-50 dark:bg-blue-900/30 p-3 rounded-lg transition-all duration-300 group-hover:bg-blue-100 dark:group-hover:bg-blue-900/50 group-hover:scale-110">
              <CheckSquare className="w-6 h-6 text-blue-500 dark:text-blue-400 transition-transform duration-300 group-hover:rotate-12" />
            </div>
          </div>
          <div className="mt-4">
            <div className="flex items-center">
              <div className="flex-1">
                <div className="h-2 bg-gray-100 dark:bg-gray-700 rounded-full overflow-hidden">
                  <div
                    className="h-2 bg-blue-500 dark:bg-blue-400 rounded-full transition-all duration-1000 ease-out"
                    style={{ width: `${stats.completionRate}%` }}
                  />
                </div>
              </div>
              <span className="ml-2 text-sm text-gray-600 dark:text-gray-300">{stats.completionRate}%</span>
            </div>
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">Completion rate</p>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-6 border border-gray-100 dark:border-gray-700 transition-all duration-300 hover:shadow-md hover:border-green-200 dark:hover:border-green-700 group">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600 dark:text-gray-300">Focus Time</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-gray-100 mt-1 transition-transform duration-300 group-hover:scale-105">
                {formatTime(stats.todayFocus)}
              </p>
              <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                This week: {formatTime(stats.weekFocus)}
              </p>
            </div>
            <div className="bg-green-50 dark:bg-green-900/30 p-3 rounded-lg transition-all duration-300 group-hover:bg-green-100 dark:group-hover:bg-green-900/50 group-hover:scale-110">
              <Target className="w-6 h-6 text-green-500 dark:text-green-400 transition-transform duration-300 group-hover:rotate-12" />
            </div>
          </div>
          <div className="mt-4">
            <div className="space-y-2">
              <div className="flex justify-between text-sm items-center">
                <span className="text-gray-600 dark:text-gray-300 flex items-center gap-2">
                  <Clock className="w-4 h-4" /> Work
                </span>
                <span className="font-medium text-gray-900 dark:text-gray-100">
                  {formatTime(sessions.filter(s => s.mode === 'work').reduce((acc, s) => acc + s.duration, 0))}
                </span>
              </div>
              <div className="flex justify-between text-sm items-center">
                <span className="text-gray-600 dark:text-gray-300 flex items-center gap-2">
                  <Leaf className="w-4 h-4" /> Breaks
                </span>
                <span className="font-medium text-gray-900 dark:text-gray-100">
                  {formatTime(sessions.filter(s => s.mode !== 'work').reduce((acc, s) => acc + s.duration, 0))}
                </span>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-6 border border-gray-100 dark:border-gray-700 transition-all duration-300 hover:shadow-md hover:border-emerald-200 dark:hover:border-emerald-700 group">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600 dark:text-gray-300">Trees Grown</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-gray-100 mt-1 transition-transform duration-300 group-hover:scale-105">
                {stats.todayTrees}
              </p>
              <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">This week: {stats.weekTrees}</p>
            </div>
            <div className="bg-emerald-50 dark:bg-emerald-900/30 p-3 rounded-lg transition-all duration-300 group-hover:bg-emerald-100 dark:group-hover:bg-emerald-900/50 group-hover:scale-110">
              <Trees className="w-6 h-6 text-emerald-500 dark:text-emerald-400 transition-transform duration-300 group-hover:rotate-12" />
            </div>
          </div>
          <div className="mt-4">
            <div className="space-y-2">
              {(['oak', 'maple', 'pine', 'cherry'] as const).map(type => (
                <div key={type} className="flex justify-between text-sm items-center group/tree">
                  <span className="capitalize text-gray-600 dark:text-gray-300 flex items-center gap-2">
                    <Trees className="w-4 h-4 transition-transform duration-300 group-hover/tree:rotate-12" />
                    {type}
                  </span>
                  <span className="font-medium text-gray-900 dark:text-gray-100">
                    {trees.filter(t => t.type === type).length}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Weekly Activity Chart */}
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-6 border border-gray-100 dark:border-gray-700 transition-all duration-300 hover:shadow-md group">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-2">
            <TrendingUp className="w-5 h-5 text-gray-600 dark:text-gray-300 transition-transform duration-300 group-hover:rotate-12" />
            <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">Weekly Activity</h3>
          </div>
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 bg-blue-500 dark:bg-blue-400 rounded-full" />
              <span className="text-sm text-gray-600 dark:text-gray-300">Tasks</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 bg-green-500 dark:bg-green-400 rounded-full" />
              <span className="text-sm text-gray-600 dark:text-gray-300">Focus Time</span>
            </div>
          </div>
        </div>
        <div className="h-64 flex items-end justify-between">
          {Array.from({ length: 7 }).map((_, i) => {
            const date = new Date(today.getTime() - (6 - i) * 24 * 60 * 60 * 1000);
            const dayTasks = tasks.filter(task => 
              task.completed && new Date(task.updatedAt).toDateString() === date.toDateString()
            ).length;
            const dayFocus = sessions
              .filter(session => new Date(session.startTime).toDateString() === date.toDateString())
              .reduce((acc, session) => acc + session.duration, 0);
            const maxTasks = Math.max(...tasks.map(t => t.completed ? 1 : 0), 1);
            const maxFocus = Math.max(...sessions.map(s => s.duration), 1);
            
            return (
              <div key={i} className="flex-1 flex flex-col items-center gap-2 group/bar">
                <div className="w-full px-2 flex items-end gap-1 h-52">
                  <div
                    className="flex-1 bg-blue-500 dark:bg-blue-400 rounded-t-sm transition-all duration-500 ease-out origin-bottom hover:opacity-90"
                    style={{ height: `${(dayTasks / maxTasks) * 100}%` }}
                  />
                  <div
                    className="flex-1 bg-green-500 dark:bg-green-400 rounded-t-sm transition-all duration-500 ease-out origin-bottom hover:opacity-90"
                    style={{ height: `${(dayFocus / maxFocus) * 100}%` }}
                  />
                </div>
                <span className="text-xs text-gray-600 dark:text-gray-400 transition-colors duration-300 group-hover/bar:text-gray-900 dark:group-hover/bar:text-gray-100">
                  {date.toLocaleDateString('en-US', { weekday: 'short' })}
                </span>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}