import React from 'react';
import { useQueueSimulation } from '../hooks/useQueueSimulation.ts';
import Controls from './Controls.tsx';
import TaskQueueVisualizer from './TaskQueueVisualizer.tsx';
import ProcessingUnitsVisualizer from './ProcessingUnitsVisualizer.tsx';
import StatsDisplay from './StatsDisplay.tsx';
import CompletedTasksVisualizer from './CompletedTasksVisualizer.tsx';

interface VisualizationProps {
  onNavigate: () => void;
}

const Visualization: React.FC<VisualizationProps> = ({ onNavigate }) => {
  const {
    simulation,
    isRunning,
    speed,
    addMultipleTasks,
    start,
    pause,
    reset,
    setSpeed,
    changeUnitType,
    unitType,
    schedulingAlgorithm,
    changeSchedulingAlgorithm,
  } = useQueueSimulation();

  return (
    <section
      id="visualization"
      className="bg-white dark:bg-slate-800 rounded-xl p-4 md:p-8 border border-gray-200 dark:border-slate-700 shadow-xl"
    >
      <h2 className="text-3xl font-bold text-center mb-6 text-slate-900 dark:text-slate-100">
        Live Simulation
      </h2>

      <div className="grid lg:grid-cols-4 gap-6">
        <div className="lg:col-span-1 space-y-6">
          <Controls
            isRunning={isRunning}
            onStart={start}
            onPause={pause}
            onReset={reset}
            onAddMultipleTasks={(count, complexity) =>
              addMultipleTasks(count, complexity)
            }
            speed={speed}
            onSpeedChange={setSpeed}
            unitType={unitType}
            onUnitTypeChange={changeUnitType}
            schedulingAlgorithm={schedulingAlgorithm}
            onSchedulingAlgorithmChange={changeSchedulingAlgorithm}
          />
          <StatsDisplay metrics={simulation.metrics} />
        </div>

        <div className="lg:col-span-3 space-y-6">
          <div className="grid md:grid-cols-2 gap-6">
            <TaskQueueVisualizer
              tasks={simulation.tasks}
              queue={simulation.queue}
              nextTaskId={simulation.nextTaskIdInQueue}
            />
            <CompletedTasksVisualizer
              tasks={simulation.tasks}
              completedTaskIds={simulation.completedTaskIds}
            />
          </div>
          <ProcessingUnitsVisualizer
            units={simulation.processingUnits}
            currentTick={simulation.tick}
          />
        </div>
      </div>
      <div className="text-center mt-8">
        <button
          onClick={onNavigate}
          className="bg-gray-800 hover:bg-gray-900 text-white font-bold py-3 px-8 rounded-lg transition-all duration-300 transform hover:scale-105 shadow-lg"
        >
          Test Your Knowledge
        </button>
      </div>
    </section>
  );
};

export default Visualization;