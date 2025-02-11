import React from 'react';
import { Trees as TreeIcon, Sprout, Leaf } from 'lucide-react';
import type { Tree } from '../types';

interface VirtualGardenProps {
  currentTree?: Tree;
  completedTrees: Tree[];
}

export function VirtualGarden({ currentTree, completedTrees }: VirtualGardenProps) {
  const getTreeIcon = (stage: Tree['stage']) => {
    switch (stage) {
      case 'seed':
        return <div className="w-8 h-8 bg-brown-500 dark:bg-brown-400 rounded-full" />;
      case 'sapling':
        return <Sprout className="w-12 h-12 text-green-500 dark:text-green-400" />;
      case 'growing':
        return <Leaf className="w-16 h-16 text-green-600 dark:text-green-500" />;
      case 'mature':
        return <TreeIcon className="w-20 h-20 text-green-700 dark:text-green-400" />;
    }
  };

  const getTreeColor = (type: Tree['type']) => {
    switch (type) {
      case 'oak':
        return 'from-green-700 to-green-900 dark:from-green-600 dark:to-green-800';
      case 'maple':
        return 'from-red-600 to-red-800 dark:from-red-500 dark:to-red-700';
      case 'pine':
        return 'from-emerald-700 to-emerald-900 dark:from-emerald-600 dark:to-emerald-800';
      case 'cherry':
        return 'from-pink-500 to-pink-700 dark:from-pink-400 dark:to-pink-600';
    }
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg dark:shadow-gray-900/30 p-8 transition-all duration-300">
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <h2 className="text-2xl font-semibold text-gray-800 dark:text-gray-200">Virtual Garden</h2>
          <span className="text-sm text-gray-600 dark:text-gray-400">
            {completedTrees.length} trees grown
          </span>
        </div>

        {/* Current Tree */}
        {currentTree && (
          <div className="relative p-6 bg-gradient-to-br from-green-50 to-blue-50 dark:from-green-900/20 dark:to-blue-900/20 rounded-lg">
            <div className="flex items-center justify-center">
              <div className={`transform transition-all duration-1000 ${
                currentTree.stage === 'mature' ? 'scale-110' : 'scale-100'
              }`}>
                {getTreeIcon(currentTree.stage)}
              </div>
            </div>
            <div className="mt-4">
              <div className="h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-green-400 via-green-500 to-green-600 dark:from-green-500 dark:via-green-400 dark:to-green-300 animate-gradient-x transition-all duration-500"
                  style={{ width: `${currentTree.health.toFixed(2)}%` }}
                />
              </div>
              <div className="mt-2 text-center text-sm text-gray-600 dark:text-gray-400">
                {currentTree.health.toFixed(2)}% Growth
              </div>
            </div>
          </div>
        )}

        {/* Garden Grid */}
        <div className="grid grid-cols-4 gap-4">
          {completedTrees.map((tree) => (
            <div
              key={tree.id}
              className={`aspect-square rounded-lg bg-gradient-to-br ${getTreeColor(tree.type)} 
                p-4 flex items-center justify-center transition-transform hover:scale-105`}
            >
              <TreeIcon className="w-8 h-8 text-white opacity-90" />
            </div>
          ))}
        </div>

        {/* Stats */}
        <div className="grid grid-cols-3 gap-4 text-center">
          <div className="p-4 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
            <div className="text-2xl font-bold text-gray-800 dark:text-gray-200">
              {completedTrees.length}
            </div>
            <div className="text-sm text-gray-600 dark:text-gray-400">Trees Grown</div>
          </div>
          <div className="p-4 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
            <div className="text-2xl font-bold text-gray-800 dark:text-gray-200">
              {completedTrees.filter(t => t.type === 'oak').length}
            </div>
            <div className="text-sm text-gray-600 dark:text-gray-400">Oaks</div>
          </div>
          <div className="p-4 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
            <div className="text-2xl font-bold text-gray-800 dark:text-gray-200">
              {Math.floor(completedTrees.reduce((acc, tree) => acc + tree.health, 0) / completedTrees.length || 0)}%
            </div>
            <div className="text-sm text-gray-600 dark:text-gray-400">Avg Health</div>
          </div>
        </div>
      </div>
    </div>
  );
}