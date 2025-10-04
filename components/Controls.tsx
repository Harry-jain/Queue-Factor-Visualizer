import React, { useState } from 'react';
import { ProcessingUnitType, TaskComplexity, SchedulingAlgorithm } from '../types.ts';
import { PlayIcon, PauseIcon, ResetIcon, CpuIcon, GpuIcon } from './Icons.tsx';

interface ControlsProps {
  isRunning: boolean;
  onStart: () => void;
  onPause: () => void;
  onReset: () => void;
  onAddMultipleTasks: (count: number, complexity: TaskComplexity) => void;
  speed: number;
  onSpeedChange: (speed: number) => void;
  unitType: ProcessingUnitType;
  onUnitTypeChange: (type: ProcessingUnitType) => void;
  schedulingAlgorithm: SchedulingAlgorithm;
  onSchedulingAlgorithmChange: (algo: SchedulingAlgorithm) => void;
}

const Button: React.FC<{ onClick: () => void; children: React.ReactNode; className?: string, title: string }> = ({ onClick, children, className, title }) => (
  <button
    title={title}
    onClick={onClick}
    className={`flex items-center justify-center p-3 rounded-md transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-100 dark:focus:ring-offset-slate-800 ${className}`}
  >
    {children}
  </button>
);

const Controls: React.FC<ControlsProps> = ({
  isRunning,
  onStart,
  onPause,
  onReset,
  onAddMultipleTasks,
  speed,
  onSpeedChange,
  unitType,
  onUnitTypeChange,
  schedulingAlgorithm,
  onSchedulingAlgorithmChange,
}) => {
  const [numTasks, setNumTasks] = useState(10);

  const algoButtonClass = (algo: SchedulingAlgorithm) => {
    return `w-full p-2 text-sm rounded-md transition ${
      schedulingAlgorithm === algo 
      ? 'bg-blue-600 text-white font-semibold ring-2 ring-blue-300' 
      : 'bg-gray-200 hover:bg-gray-300 text-gray-700 dark:bg-slate-700 dark:hover:bg-slate-600 dark:text-gray-300'
    }`;
  };

  return (
    <div className="bg-gray-50 dark:bg-slate-800/50 p-4 rounded-lg border border-gray-200 dark:border-slate-700 space-y-6">
      <div>
        <h3 className="font-semibold mb-3 text-lg text-slate-800 dark:text-slate-200">Simulation Controls</h3>
        <div className="grid grid-cols-3 gap-2">
          {!isRunning ? (
            <Button onClick={onStart} className="bg-green-500 hover:bg-green-600 text-white" title="Start Simulation">
              <PlayIcon className="w-6 h-6" />
            </Button>
          ) : (
            <Button onClick={onPause} className="bg-yellow-500 hover:bg-yellow-600 text-white" title="Pause Simulation">
              <PauseIcon className="w-6 h-6" />
            </Button>
          )}
          <Button onClick={onReset} className="col-span-2 bg-red-500 hover:bg-red-600 text-white" title="Reset Simulation">
            <ResetIcon className="w-6 h-6 mr-2" /> Reset
          </Button>
        </div>
      </div>
      
      <div>
        <h3 className="font-semibold mb-3 text-lg text-slate-800 dark:text-slate-200">Scheduling Algorithm</h3>
        <div className="grid grid-cols-3 gap-2">
            <button onClick={() => onSchedulingAlgorithmChange(SchedulingAlgorithm.FIFO)} className={algoButtonClass(SchedulingAlgorithm.FIFO)}>FIFO</button>
            <button onClick={() => onSchedulingAlgorithmChange(SchedulingAlgorithm.LIFO)} className={algoButtonClass(SchedulingAlgorithm.LIFO)}>LIFO</button>
            <button onClick={() => onSchedulingAlgorithmChange(SchedulingAlgorithm.SJF)} className={algoButtonClass(SchedulingAlgorithm.SJF)}>SJF</button>
        </div>
      </div>

      <div>
        <h3 className="font-semibold mb-3 text-lg text-slate-800 dark:text-slate-200">Add Tasks</h3>
        <div className="flex items-center gap-2 mb-2">
          <label htmlFor="task-number-input" className="text-sm font-medium text-gray-700 dark:text-gray-300">Qty:</label>
          <input 
            id="task-number-input"
            type="number"
            value={numTasks}
            onChange={(e) => setNumTasks(Math.max(1, parseInt(e.target.value) || 1))}
            className="w-full p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500 bg-white dark:bg-slate-700 dark:border-slate-600 dark:text-white"
            min="1"
          />
        </div>
        <div className="grid grid-cols-2 gap-2">
          <button onClick={() => onAddMultipleTasks(numTasks, TaskComplexity.Simple)} className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-2 rounded transition text-sm">Add Simple</button>
          <button onClick={() => onAddMultipleTasks(numTasks, TaskComplexity.Complex)} className="w-full bg-purple-600 hover:bg-purple-700 text-white font-bold py-2 px-2 rounded transition text-sm">Add Complex</button>
        </div>
      </div>

      <div>
        <label htmlFor="speed-slider" className="font-semibold mb-3 text-lg text-slate-800 dark:text-slate-200 block">Speed: {speed}%</label>
        <input
          id="speed-slider"
          type="range"
          min="1"
          max="100"
          value={speed}
          onChange={(e) => onSpeedChange(Number(e.target.value))}
          className="w-full h-2 bg-gray-300 dark:bg-slate-600 rounded-lg appearance-none cursor-pointer"
        />
      </div>

      <div>
        <h3 className="font-semibold mb-3 text-lg text-slate-800 dark:text-slate-200">Processing Unit</h3>
        <div className="grid grid-cols-2 gap-2">
          <button
            onClick={() => onUnitTypeChange(ProcessingUnitType.CPU)}
            className={`flex items-center justify-center p-3 rounded-md transition ${unitType === ProcessingUnitType.CPU ? 'bg-blue-600 text-white ring-2 ring-blue-300' : 'bg-gray-200 hover:bg-gray-300 dark:bg-slate-700 dark:hover:bg-slate-600'}`}
          >
            <CpuIcon className="w-5 h-5 mr-2" /> CPU
          </button>
          <button
            onClick={() => onUnitTypeChange(ProcessingUnitType.GPU)}
            className={`flex items-center justify-center p-3 rounded-md transition ${unitType === ProcessingUnitType.GPU ? 'bg-blue-600 text-white ring-2 ring-blue-300' : 'bg-gray-200 hover:bg-gray-300 dark:bg-slate-700 dark:hover:bg-slate-600'}`}
          >
            <GpuIcon className="w-5 h-5 mr-2" /> GPU
          </button>
        </div>
      </div>
    </div>
  );
};

export default Controls;