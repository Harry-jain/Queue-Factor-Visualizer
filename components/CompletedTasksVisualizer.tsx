import React from 'react';
import { Task, TaskComplexity } from '../types.ts';
import { CheckCircleIcon } from './Icons.tsx';

interface CompletedTasksVisualizerProps {
  tasks: Map<string, Task>;
  completedTaskIds: string[];
}

const CompletedTaskItem: React.FC<{ task: Task }> = React.memo(({ task }) => {
  const color = task.complexity === TaskComplexity.Simple ? 'text-blue-600 dark:text-blue-500' : 'text-purple-600 dark:text-purple-500';
  const processTime = (task.endTime ?? 0) - (task.startTime ?? 0);

  return (
    <li className="text-sm text-gray-600 dark:text-gray-300 animate-fade-in flex items-center justify-between">
      <div className="flex items-center">
        <CheckCircleIcon className="w-4 h-4 text-green-500 mr-2 shrink-0" />
        <span>Task <span className={`font-mono ${color}`}>{task.id.slice(-5)}</span></span>
      </div>
      <span className="font-semibold">{processTime}t</span>
    </li>
  );
});

const CompletedTasksVisualizer: React.FC<CompletedTasksVisualizerProps> = ({ tasks, completedTaskIds }) => {
  const displayedTasks = completedTaskIds.slice(0, 10);

  return (
    <div className="bg-gray-50 dark:bg-slate-800/50 p-4 rounded-lg border border-gray-200 dark:border-slate-700">
      <h3 className="font-semibold mb-4 text-lg text-slate-800 dark:text-slate-200">Completed Tasks</h3>
      <div className="h-40 overflow-y-auto pr-2">
        {completedTaskIds.length > 0 ? (
          <ul className="space-y-1">
            {displayedTasks.map(taskId => {
              const task = tasks.get(taskId);
              return task ? <CompletedTaskItem key={task.id} task={task} /> : null;
            })}
          </ul>
        ) : (
          <div className="flex items-center justify-center h-full">
            <p className="text-gray-500 dark:text-gray-400 text-center">No tasks completed yet.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default CompletedTasksVisualizer;