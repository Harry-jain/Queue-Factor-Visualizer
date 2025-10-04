import React from 'react';
import { Task, TaskComplexity } from '../types.ts';

interface TaskQueueVisualizerProps {
  tasks: Map<string, Task>;
  queue: string[];
  nextTaskId: string | null;
}

const TaskBlock: React.FC<{ task: Task, isNext: boolean }> = React.memo(({ task, isNext }) => {
  const color = task.complexity === TaskComplexity.Simple ? 'bg-blue-500' : 'bg-purple-500';
  const title = `Task ${task.id.slice(-6)} - ${task.complexity}\nProcessing Time: ${task.processingTime}t`;
  const nextClass = isNext ? 'is-next-in-queue' : '';
  
  return (
    <div
      title={title}
      className={`relative w-8 h-10 ${color} rounded-sm shrink-0 border-2 border-white/50 dark:border-black/50 animate-fade-in flex items-center justify-center shadow-md ${nextClass}`}
    >
        <span className="text-white text-xs font-bold drop-shadow-sm">{task.processingTime}t</span>
    </div>
  );
});

const TaskQueueVisualizer: React.FC<TaskQueueVisualizerProps> = ({ tasks, queue, nextTaskId }) => {
  return (
    <div className="bg-gray-50 dark:bg-slate-800/50 p-4 rounded-lg border border-gray-200 dark:border-slate-700">
      <h3 className="font-semibold mb-4 text-lg text-slate-800 dark:text-slate-200">Task Queue ({queue.length})</h3>
      <div className="w-full bg-gray-200 dark:bg-slate-700 rounded h-16 p-2 flex items-center overflow-x-auto overflow-y-hidden">
        {queue.length > 0 ? (
          <div className="flex flex-row-reverse gap-1">
            {queue.map(taskId => {
              const task = tasks.get(taskId);
              return task ? <TaskBlock key={task.id} task={task} isNext={task.id === nextTaskId} /> : null;
            }).reverse()}
          </div>
        ) : (
          <p className="text-gray-500 dark:text-gray-400 w-full text-center">Queue is empty. Add tasks to begin.</p>
        )}
      </div>
    </div>
  );
};

export default TaskQueueVisualizer;