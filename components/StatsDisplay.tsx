import React from 'react';
import { SimulationMetrics } from '../types.ts';

const StatCard: React.FC<{ label: string; value: string }> = React.memo(({ label, value }) => (
  <div className="bg-white dark:bg-slate-800 p-3 rounded-md text-center border border-gray-200 dark:border-slate-700">
    <div className="text-2xl font-bold text-blue-600 dark:text-blue-500">{value}</div>
    <div className="text-sm text-slate-500 dark:text-slate-400 uppercase tracking-wider">{label}</div>
  </div>
));

const StatsDisplay: React.FC<{ metrics: SimulationMetrics }> = ({ metrics }) => {
  return (
    <div className="bg-gray-50 dark:bg-slate-800/50 p-4 rounded-lg border border-gray-200 dark:border-slate-700">
      <h3 className="font-semibold mb-4 text-lg text-slate-800 dark:text-slate-200">Performance Metrics</h3>
      <div className="grid grid-cols-2 gap-3">
        <StatCard label="Tasks Done" value={metrics.tasksCompleted.toString()} />
        <StatCard label="Utilization" value={`${metrics.utilization.toFixed(0)}%`} />
        <StatCard label="Avg Wait" value={`${metrics.avgWaitTime.toFixed(2)}t`} />
        <StatCard label="Avg Process" value={`${metrics.avgProcessingTime.toFixed(2)}t`} />
      </div>
      <p className="text-xs text-gray-500 mt-3 text-center">* 't' denotes simulation ticks.</p>
    </div>
  );
};

export default StatsDisplay;