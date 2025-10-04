import React from 'react';
import { CpuIcon, GpuIcon } from './Icons.tsx';

const Card: React.FC<{
  title: string;
  children: React.ReactNode;
  icon: React.ReactNode;
}> = ({ title, children, icon }) => (
  <div className="bg-white dark:bg-slate-800 rounded-lg p-6 shadow-md border border-gray-200 dark:border-slate-700 hover:border-blue-400 dark:hover:border-blue-500 transition-all duration-300 transform hover:-translate-y-1 hover:shadow-lg h-full">
    <div className="flex items-center mb-4">
      <div className="text-blue-600 dark:text-blue-500 mr-4">{icon}</div>
      <h3 className="text-xl font-semibold text-blue-600 dark:text-blue-500">{title}</h3>
    </div>
    <p className="text-slate-600 dark:text-slate-400 leading-relaxed">{children}</p>
  </div>
);

interface IntroductionProps {
  onNavigate: () => void;
}

const Introduction: React.FC<IntroductionProps> = ({ onNavigate }) => {
  return (
    <section id="introduction" className="space-y-10">
      <div className="text-center">
        <h2 className="text-3xl font-bold tracking-tight sm:text-4xl text-slate-900 dark:text-slate-100">
          Understanding Queue Factor in Machine Learning
        </h2>
        <p className="mt-4 max-w-3xl mx-auto text-lg text-slate-600 dark:text-slate-400">
          An interactive guide to how computers handle complex tasks. See the
          difference between CPU and GPU processing in real-time.
        </p>
      </div>
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
        <Card
          title="What is Queue Factor?"
          icon={<div className="w-8 h-8 text-2xl font-bold">[Q]</div>}
        >
          Queue Factor describes the efficiency of managing and executing a series of computational tasks. In ML, operations are placed in a queue, waiting for a processor. How this queue is managed dramatically impacts performance.
        </Card>
        <Card
          title="CPU: The Sequential Specialist"
          icon={<CpuIcon className="w-8 h-8" />}
        >
          A Central Processing Unit (CPU) has a few powerful cores designed to handle tasks one after another very quickly. It's excellent for sequential, single-threaded tasks but can become a bottleneck when faced with thousands of parallel operations.
        </Card>
        <Card
          title="GPU: The Parallel Powerhouse"
          icon={<GpuIcon className="w-8 h-8" />}
        >
          A Graphics Processing Unit (GPU) has thousands of smaller, more specialized cores. It excels at performing the same operation on large sets of data simultaneously. This parallel architecture makes it ideal for neural networks.
        </Card>
        <div className="md:col-span-2 lg:col-span-3">
            <Card
              title="Scheduling Algorithms: The Rulebook for Queues"
              icon={<div className="w-8 h-8 text-2xl font-bold">[📜]</div>}
            >
              A scheduling algorithm decides the order in which tasks in the queue are executed. This choice has a huge impact on system performance, fairness, and throughput. Common strategies include:
              <ul className="list-disc list-inside mt-2 space-y-1">
                <li><span className="font-semibold">FIFO (First-In, First-Out):</span> The simplest method. Tasks are processed in the order they arrive, like a line at a grocery store.</li>
                <li><span className="font-semibold">LIFO (Last-In, First-Out):</span> The most recent task to arrive is the first one to be processed.</li>
                <li><span className="font-semibold">SJF (Shortest Job First):</span> A smart approach that prioritizes the quickest tasks to complete, often increasing overall throughput.</li>
              </ul>
            </Card>
        </div>
      </div>
      <div className="text-center pt-6">
        <button
          onClick={onNavigate}
          className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-8 rounded-lg transition-all duration-300 transform hover:scale-105 shadow-lg"
        >
          Start Visualization
        </button>
      </div>
    </section>
  );
};

export default Introduction;