import React from 'react';
import { CheckCircle2, Circle, Clock, Tag, ChevronRight } from 'lucide-react';
import type { Task } from '../types';

interface TaskListProps {
  tasks: Task[];
  onToggleTask: (taskId: string) => void;
}

export function TaskList({ tasks, onToggleTask }: TaskListProps) {
  const sortedTasks = [...tasks].sort((a, b) => {
    // Show incomplete tasks first
    if (a.completed !== b.completed) {
      return a.completed ? 1 : -1;
    }
    // Then sort by priority
    const priorityOrder = { high: 0, medium: 1, low: 2 };
    if (a.priority !== b.priority) {
      return priorityOrder[a.priority] - priorityOrder[b.priority];
    }
    // Finally sort by creation date
    return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
  });

  return (
    <div className="space-y-4">
      {sortedTasks.length === 0 ? (
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-8 text-center transition-all duration-300">
          <p className="text-gray-600 dark:text-gray-300">No tasks yet. Click the + button above to create one!</p>
        </div>
      ) : (
        sortedTasks.map((task) => (
          <div
            key={task.id}
            className={`group bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-4 transition-all duration-300 hover:shadow-md hover:translate-x-1 ${
              task.completed ? 'opacity-75' : ''
            }`}
          >
            <div className="flex items-start gap-4">
              <button
                onClick={() => onToggleTask(task.id)}
                className="mt-1 relative"
                aria-label={task.completed ? "Mark as incomplete" : "Mark as complete"}
              >
                <div className="absolute inset-0 bg-blue-100 dark:bg-blue-900/50 scale-150 opacity-0 rounded-full transition-all duration-300 group-hover:scale-100 group-hover:opacity-30" />
                {task.completed ? (
                  <CheckCircle2 className="w-5 h-5 text-green-500 dark:text-green-400 transition-all duration-300 hover:scale-110" />
                ) : (
                  <Circle className="w-5 h-5 text-gray-400 dark:text-gray-500 transition-all duration-300 group-hover:text-blue-500 dark:group-hover:text-blue-400 hover:scale-110" />
                )}
              </button>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <h3 className={`text-lg font-medium transition-all duration-300 truncate ${
                    task.completed ? 'text-gray-400 dark:text-gray-500 line-through' : 'text-gray-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400'
                  }`}>
                    {task.title}
                  </h3>
                  <ChevronRight className="w-4 h-4 text-gray-400 dark:text-gray-500 transition-all duration-300 opacity-0 transform translate-x-[-10px] group-hover:opacity-100 group-hover:translate-x-0" />
                </div>
                {task.description && (
                  <p className="mt-1 text-gray-600 dark:text-gray-300 transition-colors duration-300 group-hover:text-gray-700 dark:group-hover:text-gray-200">{task.description}</p>
                )}
                <div className="mt-2 flex flex-wrap items-center gap-4 text-sm text-gray-500 dark:text-gray-400">
                  {task.dueDate && (
                    <div className="flex items-center gap-1 transition-transform duration-300 hover:scale-105">
                      <Clock className="w-4 h-4 transition-transform duration-300 group-hover:rotate-12" />
                      <span className="dark:text-gray-300">{new Date(task.dueDate).toLocaleDateString()}</span>
                    </div>
                  )}
                  {task.tags.length > 0 && (
                    <div className="flex items-center gap-1 transition-transform duration-300 hover:scale-105">
                      <Tag className="w-4 h-4 transition-transform duration-300 group-hover:rotate-12" />
                      <span className="truncate dark:text-gray-300">{task.tags.join(', ')}</span>
                    </div>
                  )}
                  <span className={`px-2 py-1 rounded-full text-xs font-medium transition-all duration-300 ${
                    task.priority === 'high' ? 'bg-red-100 dark:bg-red-900/50 text-red-700 dark:text-red-300' :
                    task.priority === 'medium' ? 'bg-yellow-100 dark:bg-yellow-900/50 text-yellow-700 dark:text-yellow-300' :
                    'bg-green-100 dark:bg-green-900/50 text-green-700 dark:text-green-300'
                  } hover:scale-105`}>
                    {task.priority}
                  </span>
                </div>
              </div>
            </div>
          </div>
        ))
      )}
    </div>
  );
}