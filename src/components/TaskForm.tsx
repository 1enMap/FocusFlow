import React, { useState } from 'react';
import { Plus, Loader2, AlertTriangle, CheckCircle2, Circle } from 'lucide-react';
import type { Task } from '../types';

interface TaskFormProps {
  onAddTask: (task: Omit<Task, 'id' | 'createdAt' | 'updatedAt'>) => void;
}

export function TaskForm({ onAddTask }: TaskFormProps) {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [dueDate, setDueDate] = useState('');
  const [priority, setPriority] = useState<Task['priority']>('medium');
  const [tags, setTags] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    await new Promise(resolve => setTimeout(resolve, 500));
    
    onAddTask({
      title,
      description,
      dueDate: dueDate || undefined,
      priority,
      tags: tags.split(',').map(tag => tag.trim()).filter(Boolean),
      completed: false,
    });

    setTitle('');
    setDescription('');
    setDueDate('');
    setPriority('medium');
    setTags('');
    setIsSubmitting(false);
  };

  const cyclePriority = () => {
    const priorities: Task['priority'][] = ['low', 'medium', 'high'];
    const currentIndex = priorities.indexOf(priority);
    const nextIndex = (currentIndex + 1) % priorities.length;
    setPriority(priorities[nextIndex]);
  };

  const getPriorityIcon = () => {
    switch (priority) {
      case 'high':
        return <AlertTriangle className="w-4 h-4" />;
      case 'medium':
        return <CheckCircle2 className="w-4 h-4" />;
      case 'low':
        return <Circle className="w-4 h-4" />;
    }
  };

  return (
    <form onSubmit={handleSubmit} className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-4 transition-all duration-300 hover:shadow-md group">
      <div className="space-y-4">
        <div className="relative group/input">
          <input
            type="text"
            placeholder="Task title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="w-full px-3 py-2 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 focus:border-transparent transition-all duration-300 group-hover/input:border-blue-200 dark:group-hover/input:border-blue-700"
            required
          />
          <div className="absolute inset-0 rounded-lg bg-blue-50 dark:bg-blue-900/20 opacity-0 transition-opacity duration-300 -z-10 group-hover/input:opacity-10" />
        </div>
        
        <div className="relative group/textarea">
          <textarea
            placeholder="Description (optional)"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="w-full px-3 py-2 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 focus:border-transparent transition-all duration-300 group-hover/textarea:border-blue-200 dark:group-hover/textarea:border-blue-700"
            rows={3}
          />
          <div className="absolute inset-0 rounded-lg bg-blue-50 dark:bg-blue-900/20 opacity-0 transition-opacity duration-300 -z-10 group-hover/textarea:opacity-10" />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="relative group/date">
            <input
              type="date"
              value={dueDate}
              onChange={(e) => setDueDate(e.target.value)}
              className="w-full px-3 py-2 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 focus:border-transparent transition-all duration-300 group-hover/date:border-blue-200 dark:group-hover/date:border-blue-700 [color-scheme:light_dark]"
              placeholder="Due date"
            />
            <div className="absolute inset-0 rounded-lg bg-blue-50 dark:bg-blue-900/20 opacity-0 transition-opacity duration-300 -z-10 group-hover/date:opacity-10" />
          </div>

          <div className="relative group/tags">
            <input
              type="text"
              placeholder="Tags (comma-separated)"
              value={tags}
              onChange={(e) => setTags(e.target.value)}
              className="w-full px-3 py-2 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 focus:border-transparent transition-all duration-300 group-hover/tags:border-blue-200 dark:group-hover/tags:border-blue-700"
            />
            <div className="absolute inset-0 rounded-lg bg-blue-50 dark:bg-blue-900/20 opacity-0 transition-opacity duration-300 -z-10 group-hover/tags:opacity-10" />
          </div>
        </div>

        <div className="flex gap-4 items-center">
          <button
            type="button"
            onClick={cyclePriority}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg border transition-all duration-300 ${
              priority === 'high'
                ? 'bg-red-100 dark:bg-red-900/50 border-red-300 dark:border-red-700 text-red-700 dark:text-red-300 hover:bg-red-200 dark:hover:bg-red-900/70'
                : priority === 'medium'
                ? 'bg-yellow-100 dark:bg-yellow-900/50 border-yellow-300 dark:border-yellow-700 text-yellow-700 dark:text-yellow-300 hover:bg-yellow-200 dark:hover:bg-yellow-900/70'
                : 'bg-green-100 dark:bg-green-900/50 border-green-300 dark:border-green-700 text-green-700 dark:text-green-300 hover:bg-green-200 dark:hover:bg-green-900/70'
            } transform hover:scale-105 active:scale-95`}
          >
            <span className="flex items-center gap-2">
              {getPriorityIcon()}
              <span className="capitalize">{priority} Priority</span>
            </span>
          </button>

          <button
            type="submit"
            disabled={isSubmitting}
            className="flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white rounded-lg transition-all duration-300 transform hover:scale-[1.02] active:scale-[0.98] disabled:opacity-70 disabled:cursor-not-allowed focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 dark:focus:ring-offset-gray-800"
          >
            {isSubmitting ? (
              <Loader2 className="w-5 h-5 animate-spin" />
            ) : (
              <Plus className="w-5 h-5 transition-transform duration-300 group-hover:rotate-90" />
            )}
            {isSubmitting ? 'Adding Task...' : 'Add Task'}
          </button>
        </div>
      </div>
    </form>
  );
}