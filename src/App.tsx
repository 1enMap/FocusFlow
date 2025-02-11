import React, { useState } from 'react';
import { Layout } from './components/Layout';
import { TaskList } from './components/TaskList';
import { TaskForm } from './components/TaskForm';
import { PomodoroTimer } from './components/PomodoroTimer';
import { AnalyticsDashboard } from './components/AnalyticsDashboard';
import { Settings } from './components/Settings';
import { Auth } from './components/Auth';
import { Plus } from 'lucide-react';
import { useAuth } from './context/AuthContext';
import type { Task, PomodoroSession, Tree } from './types';

function App() {
  const { user, loading, signOut } = useAuth();
  const [currentView, setCurrentView] = useState<'tasks' | 'timer' | 'analytics' | 'settings'>('tasks');
  const [tasks, setTasks] = useState<Task[]>([]);
  const [sessions, setSessions] = useState<PomodoroSession[]>([]);
  const [trees, setTrees] = useState<Tree[]>([]);
  const [isTaskFormOpen, setIsTaskFormOpen] = useState(false);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-50 to-white dark:from-gray-900 dark:to-gray-800">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (!user) {
    return <Auth />;
  }

  const handleAddTask = (newTask: Omit<Task, 'id' | 'createdAt' | 'updatedAt'>) => {
    const task: Task = {
      ...newTask,
      id: crypto.randomUUID(),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    setTasks([task, ...tasks]);
    setIsTaskFormOpen(false);
  };

  const handleToggleTask = (taskId: string) => {
    setTasks(tasks.map(task => 
      task.id === taskId
        ? { ...task, completed: !task.completed, updatedAt: new Date().toISOString() }
        : task
    ));
  };

  const handleSessionComplete = (session: PomodoroSession) => {
    setSessions([...sessions, session]);
  };

  const handleTreeComplete = (tree: Tree) => {
    setTrees([...trees, tree]);
  };

  const handleLogout = async () => {
    await signOut();
  };

  const handleResetAnalytics = () => {
    setTasks([]);
    setSessions([]);
    setTrees([]);
  };

  return (
    <Layout currentView={currentView} onViewChange={setCurrentView}>
      <div className="max-w-4xl mx-auto space-y-8 px-4 py-6">
        {currentView === 'tasks' && (
          <div className="space-y-6">
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg dark:shadow-gray-900/30 p-6 transition-all duration-500 hover:shadow-xl">
              <div className="space-y-6">
                <div className="flex items-center justify-between">
                  <h2 className="text-2xl font-semibold bg-gradient-to-r from-blue-600 to-purple-600 dark:from-blue-400 dark:to-purple-400 bg-clip-text text-transparent">Tasks</h2>
                  <div className="flex items-center gap-4">
                    <span className="text-sm text-gray-600 dark:text-gray-400">
                      {tasks.filter(t => !t.completed).length} remaining
                    </span>
                    <button
                      onClick={() => setIsTaskFormOpen(!isTaskFormOpen)}
                      className="p-2 rounded-lg bg-gradient-to-r from-blue-600 to-purple-600 text-white transition-all duration-300 hover:scale-105 active:scale-95 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 dark:focus:ring-offset-gray-800"
                      aria-label="Toggle task form"
                    >
                      <Plus className={`w-5 h-5 transition-transform duration-300 ${isTaskFormOpen ? 'rotate-45' : 'rotate-0'}`} />
                    </button>
                  </div>
                </div>
                
                {/* Task Form - Animated slide and fade */}
                <div className={`transform transition-all duration-300 origin-top ${
                  isTaskFormOpen 
                    ? 'opacity-100 scale-y-100 max-h-[1000px]' 
                    : 'opacity-0 scale-y-0 max-h-0 overflow-hidden'
                }`}>
                  <TaskForm onAddTask={handleAddTask} />
                </div>

                {/* Task List */}
                <TaskList tasks={tasks} onToggleTask={handleToggleTask} />
              </div>
            </div>
          </div>
        )}

        {currentView === 'timer' && (
          <div className="animate-fade-in">
            <PomodoroTimer
              onSessionComplete={handleSessionComplete}
              onTreeComplete={handleTreeComplete}
            />
          </div>
        )}

        {currentView === 'analytics' && (
          <div className="animate-fade-in">
            <AnalyticsDashboard
              tasks={tasks}
              sessions={sessions}
              trees={trees}
            />
          </div>
        )}

        {currentView === 'settings' && (
          <div className="animate-fade-in">
            <Settings
              onLogout={handleLogout}
              onResetAnalytics={handleResetAnalytics}
            />
          </div>
        )}
      </div>
    </Layout>
  );
}

export default App;