import React, { useState, useEffect, useRef } from 'react';
import { ProcessingUnit, ProcessingUnitType, TaskComplexity, Task } from '../types.ts';
import { SpinnerIcon } from './Icons.tsx';

const CompletionTime: React.FC<{ time: number }> = ({ time }) => {
    return (
        <div className="absolute inset-0 flex flex-col items-center justify-center text-white text-xs font-bold z-10 animate-fade-in">
            <span className="drop-shadow-sm" style={{ animationDelay: '150ms' }}>{time}</span>
        </div>
    );
};

const Popover: React.FC<{ unit: ProcessingUnit; style: React.CSSProperties; onClose: () => void, side: 'left' | 'right' }> = ({ unit, style, onClose, side }) => {
    const task = unit.currentTask;

    const arrowClass = side === 'right'
        ? "before:right-full before:border-r-gray-300 dark:before:border-r-slate-600"
        : "before:left-full before:border-l-gray-300 dark:before:border-l-slate-600";
    
    return (
        <div
            style={style}
            className={`absolute z-20 p-4 bg-white dark:bg-slate-900 rounded-lg shadow-2xl border border-gray-300 dark:border-slate-600 animate-fade-in w-64
                before:content-[''] before:absolute before:top-1/2 before:-translate-y-1/2 before:border-8 before:border-solid before:border-transparent
                ${arrowClass}`}
        >
            <button onClick={onClose} className="absolute top-1 right-2 text-gray-500 hover:text-gray-700 dark:hover:text-gray-200 text-2xl font-bold">&times;</button>
            <h4 className="font-bold text-lg mb-2 text-slate-800 dark:text-slate-200">Core {unit.id}</h4>
            {task ? (
                <div className="space-y-1 text-sm text-slate-600 dark:text-slate-400">
                    <p><span className="font-semibold text-slate-700 dark:text-slate-300">Status:</span> Processing</p>
                    <p><span className="font-semibold text-slate-700 dark:text-slate-300">Task ID:</span> {task.id.slice(-5)}</p>
                    <p><span className="font-semibold text-slate-700 dark:text-slate-300">Complexity:</span> {task.complexity}</p>
                    <p><span className="font-semibold text-slate-700 dark:text-slate-300">Starts at:</span> tick {task.startTime}</p>
                    <p><span className="font-semibold text-slate-700 dark:text-slate-300">Ends at:</span> tick {task.endTime}</p>
                </div>
            ) : (
                <p className="text-sm text-slate-600 dark:text-slate-400">
                    <span className="font-semibold text-slate-700 dark:text-slate-300">Status:</span> Idle
                </p>
            )}
        </div>
    );
};

const UnitCore = React.memo(React.forwardRef<HTMLDivElement, { unit: ProcessingUnit; currentTick: number; onClick: () => void; isSelected: boolean }>(({ unit, currentTick, onClick, isSelected }, ref) => {
  const [isFlashing, setIsFlashing] = useState(false);
  const [isCompleting, setIsCompleting] = useState(false);
  const prevTaskIdRef = useRef<string | undefined>(undefined);
  const prevTaskRef = useRef<Task | null | undefined>(unit.currentTask);

  useEffect(() => {
    const currentTaskId = unit.currentTask?.id;
    if (currentTaskId && currentTaskId !== prevTaskIdRef.current) {
      setIsFlashing(true);
      const timer = setTimeout(() => setIsFlashing(false), 400);
      return () => clearTimeout(timer);
    }
    prevTaskIdRef.current = currentTaskId;
  }, [unit.currentTask?.id]);

  useEffect(() => {
    if (prevTaskRef.current && !unit.currentTask) {
        setIsCompleting(true);
        const timer = setTimeout(() => setIsCompleting(false), 500);
        return () => clearTimeout(timer);
    }
    prevTaskRef.current = unit.currentTask;
  }, [unit.currentTask]);
  
  const task = unit.currentTask;
  const isBusy = task !== null;
  const isGpu = unit.type === ProcessingUnitType.GPU;
  
  let coreClass = '';
  let progressColor = '';
  
  if (isBusy) {
    progressColor = task.complexity === TaskComplexity.Simple ? 'bg-blue-500' : 'bg-purple-500';
    coreClass = task.complexity === TaskComplexity.Simple 
      ? 'bg-blue-300 dark:bg-blue-900/50 shadow-blue-400/50' 
      : 'bg-purple-300 dark:bg-purple-900/50 shadow-purple-400/50';
  } else {
    coreClass = 'bg-gray-300 dark:bg-slate-600 animate-pulse-idle';
  }

  const size = isGpu ? 'w-4 h-4' : 'w-12 h-12';
  const rounding = isGpu ? 'rounded-sm' : 'rounded';
  
  const progress = isBusy && task.startTime !== undefined && task.endTime !== undefined
    ? Math.min(((currentTick - task.startTime) / (task.endTime - task.startTime)) * 100, 100)
    : 0;

  const title = isBusy 
    ? `Task ${task.id.slice(-5)} (${task.complexity})\nProgress: ${progress.toFixed(0)}%\nEnds at tick: ${task.endTime}` 
    : 'Idle';

  const selectionClass = isSelected ? 'ring-2 ring-yellow-400 scale-110 z-10' : '';

  return (
    <div
      ref={ref}
      onClick={onClick}
      title={title}
      className={`relative flex items-center justify-center transition-all duration-200 overflow-hidden shadow-inner cursor-pointer ${size} ${rounding} ${coreClass} ${isFlashing ? 'animate-flash-in' : ''} ${isCompleting ? 'animate-flash-complete' : ''} ${selectionClass}`}
    >
      {isBusy && (
        <>
          <div 
            className={`absolute top-0 left-0 h-full transition-all duration-100 ease-linear ${progressColor} opacity-80`}
            style={{ width: `${progress}%` }}
          />
           <SpinnerIcon className={`animate-spin text-white ${isGpu ? 'w-3 h-3' : 'w-6 h-6'} opacity-50`} />
          {!isGpu && task.endTime !== undefined && (
             <CompletionTime time={task.endTime} />
          )}
        </>
      )}
      {!isGpu && !isBusy && (
        <div className="absolute inset-2.5 bg-gray-400/80 dark:bg-slate-500/80 rounded-sm shadow-md" />
      )}
    </div>
  );
}));

const ProcessingUnitsVisualizer: React.FC<{ units: ProcessingUnit[]; currentTick: number }> = ({ units, currentTick }) => {
  const [selectedUnitId, setSelectedUnitId] = useState<string | null>(null);
  const [popoverStyle, setPopoverStyle] = useState<React.CSSProperties>({ display: 'none' });
  const [popoverSide, setPopoverSide] = useState<'left' | 'right'>('right');

  const containerRef = useRef<HTMLDivElement>(null);
  const coreRefs = useRef<Map<string, HTMLDivElement | null>>(new Map());

  const type = units.length > 0 ? units[0].type : ProcessingUnitType.CPU;
  const title = type === ProcessingUnitType.CPU ? 'CPU Cores' : 'GPU Cores';
  const gridClass = type === ProcessingUnitType.CPU 
    ? 'grid-cols-4 sm:grid-cols-8'
    : 'grid-cols-8 sm:grid-cols-16';

  const handleCoreClick = (unitId: string) => {
    setSelectedUnitId(prevId => (prevId === unitId ? null : unitId));
  };
  
  useEffect(() => {
    if (!selectedUnitId) {
      setPopoverStyle({ display: 'none' });
      return;
    }

    const coreEl = coreRefs.current.get(selectedUnitId);
    if (coreEl && containerRef.current) {
      const containerRect = containerRef.current.getBoundingClientRect();
      const popoverWidth = 256; // w-64 in tailwind
      
      let left = coreEl.offsetLeft + coreEl.offsetWidth + 16; // 16px gap
      let side: 'left' | 'right' = 'right';

      // If it overflows on the right, place it on the left
      if (left + popoverWidth > containerRef.current.offsetWidth) {
        left = coreEl.offsetLeft - popoverWidth - 16;
        side = 'left';
      }

      const top = coreEl.offsetTop + coreEl.offsetHeight / 2;
      setPopoverSide(side);
      setPopoverStyle({
        position: 'absolute',
        transform: 'translateY(-50%)',
        top: `${top}px`,
        left: `${left}px`,
        display: 'block',
      });
    }
  }, [selectedUnitId, units]);

  // Effect to handle clicks outside the component to close the popover
  useEffect(() => {
      const handleClickOutside = (event: MouseEvent) => {
          if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
              setSelectedUnitId(null);
          }
      };
      document.addEventListener('mousedown', handleClickOutside);
      return () => {
          document.removeEventListener('mousedown', handleClickOutside);
      };
  }, []);

  const selectedUnit = selectedUnitId ? units.find(u => u.id === selectedUnitId) : null;

  return (
    <div ref={containerRef} className="relative bg-gray-50 dark:bg-slate-800/50 p-4 rounded-lg border border-gray-200 dark:border-slate-700 min-h-[200px]">
      <h3 className="font-semibold mb-4 text-lg text-slate-800 dark:text-slate-200">{title} ({units.length})</h3>
      <div className={`grid ${gridClass} gap-2`}>
        {units.map((unit) => (
          <UnitCore
            key={unit.id}
            ref={el => { coreRefs.current.set(unit.id, el); }}
            unit={unit}
            currentTick={currentTick}
            onClick={() => handleCoreClick(unit.id)}
            isSelected={unit.id === selectedUnitId}
          />
        ))}
      </div>

      {selectedUnit && (
        <Popover
          unit={selectedUnit}
          style={popoverStyle}
          onClose={() => setSelectedUnitId(null)}
          side={popoverSide}
        />
      )}
    </div>
  );
};

export default ProcessingUnitsVisualizer;