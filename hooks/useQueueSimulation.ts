import { useState, useEffect, useCallback, useRef } from 'react';
import {
  Task,
  ProcessingUnit,
  ProcessingUnitType,
  TaskStatus,
  SimulationState,
  TaskComplexity,
  SchedulingAlgorithm,
} from '../types.ts';

const CPU_CORES = 8;
const GPU_CORES = 128;
const SIMPLE_TASK_TIME = 10; // ticks
const COMPLEX_TASK_TIME = 30; // ticks

const createInitialState = (unitType: ProcessingUnitType): SimulationState => {
  const units: ProcessingUnit[] = [];
  const coreCount = unitType === ProcessingUnitType.CPU ? CPU_CORES : GPU_CORES;
  for (let i = 0; i < coreCount; i++) {
    units.push({ id: `${unitType}-${i}`, type: unitType, currentTask: null });
  }

  return {
    tasks: new Map(),
    queue: [],
    processingUnits: units,
    completedTaskIds: [],
    tick: 0,
    metrics: {
      tasksCompleted: 0,
      avgWaitTime: 0,
      avgProcessingTime: 0,
      utilization: 0,
    },
    nextTaskIdInQueue: null,
  };
};

export const useQueueSimulation = () => {
  const [unitType, setUnitType] = useState<ProcessingUnitType>(ProcessingUnitType.CPU);
  const [simulation, setSimulation] = useState<SimulationState>(() => createInitialState(unitType));
  const [isRunning, setIsRunning] = useState(false);
  const [speed, setSpeed] = useState(50); // percentage
  const [schedulingAlgorithm, setSchedulingAlgorithm] = useState<SchedulingAlgorithm>(SchedulingAlgorithm.FIFO);

  const simulationRef = useRef(simulation);
  simulationRef.current = simulation;
  
  const tickInterval = 250 - (speed * 2);

  useEffect(() => {
    if (!isRunning) return;

    const timer = setInterval(() => {
      setSimulation(prev => {
        const newState: SimulationState = { ...prev, tick: prev.tick + 1 };
        
        const newTasks = new Map(newState.tasks);
        const newUnits = newState.processingUnits.map(u => ({ ...u }));
        let newQueue = [...newState.queue];
        let newCompleted = [...newState.completedTaskIds];

        // 0. Identify the next task to be picked for UI highlighting
        let nextId: string | null = null;
        if (newQueue.length > 0) {
            switch(schedulingAlgorithm) {
                case SchedulingAlgorithm.LIFO:
                    nextId = newQueue[newQueue.length - 1];
                    break;
                case SchedulingAlgorithm.SJF:
                    let shortestTime = Infinity;
                    let shortestId: string | null = null;
                    newQueue.forEach((id) => {
                        const task = newTasks.get(id);
                        if (task && task.processingTime < shortestTime) {
                            shortestTime = task.processingTime;
                            shortestId = id;
                        }
                    });
                    nextId = shortestId;
                    break;
                case SchedulingAlgorithm.FIFO:
                default:
                    nextId = newQueue[0];
                    break;
            }
        }
        newState.nextTaskIdInQueue = nextId;

        // 1. Update processing tasks
        newUnits.forEach(unit => {
          if (unit.currentTask && unit.currentTask.endTime !== undefined) {
            if (newState.tick >= unit.currentTask.endTime) {
              const completedTask = newTasks.get(unit.currentTask.id);
              if (completedTask) {
                completedTask.status = TaskStatus.Completed;
                completedTask.endTime = newState.tick;
                newTasks.set(completedTask.id, completedTask);
                newCompleted.unshift(completedTask.id);
                unit.currentTask = null;
              }
            }
          }
        });
        
        // 2. Assign tasks from queue to idle units based on scheduling algorithm
        newUnits.forEach(unit => {
            if (unit.currentTask === null && newQueue.length > 0) {
                let taskId: string | undefined;
                let taskIndex = -1;

                // This logic MUST match the identification logic above
                switch(schedulingAlgorithm) {
                    case SchedulingAlgorithm.LIFO:
                        taskId = newQueue.pop();
                        if (taskId) taskIndex = newQueue.length;
                        break;
                    case SchedulingAlgorithm.SJF:
                        if (newState.nextTaskIdInQueue) {
                            taskIndex = newQueue.findIndex(id => id === newState.nextTaskIdInQueue);
                            if (taskIndex > -1) {
                                taskId = newQueue.splice(taskIndex, 1)[0];
                            }
                        }
                        break;
                    case SchedulingAlgorithm.FIFO:
                    default:
                        taskId = newQueue.shift();
                        if (taskId) taskIndex = 0;
                        break;
                }
                
                if (taskId) {
                    const taskToProcess = newTasks.get(taskId);
                    if (taskToProcess) {
                        taskToProcess.status = TaskStatus.Processing;
                        taskToProcess.startTime = newState.tick;
                        taskToProcess.endTime = newState.tick + taskToProcess.processingTime;
                        newTasks.set(taskId, taskToProcess);
                        unit.currentTask = taskToProcess;
                    }
                }
            }
        });

        // 3. Update queue time for queued tasks
        newQueue.forEach(taskId => {
            const task = newTasks.get(taskId);
            if (task) {
                task.queueTime += 1;
                newTasks.set(taskId, task);
            }
        });

        // 4. Calculate metrics
        const completedTasks = newCompleted.map(id => newTasks.get(id)).filter(Boolean) as Task[];
        const totalWaitTime = completedTasks.reduce((sum, task) => sum + (task.startTime! - (task.queueTime > 0 ? (task.startTime! - task.queueTime) : task.startTime!)), 0);
        const totalProcessingTime = completedTasks.reduce((sum, task) => sum + task.processingTime, 0);
        const busyUnits = newUnits.filter(u => u.currentTask !== null).length;
        
        const newMetrics = {
            tasksCompleted: completedTasks.length,
            avgWaitTime: completedTasks.length > 0 ? totalWaitTime / completedTasks.length : 0,
            avgProcessingTime: completedTasks.length > 0 ? totalProcessingTime / completedTasks.length : 0,
            utilization: newUnits.length > 0 ? (busyUnits / newUnits.length) * 100 : 0,
        };

        return { 
            ...newState, 
            tasks: newTasks,
            processingUnits: newUnits,
            queue: newQueue,
            completedTaskIds: newCompleted,
            metrics: newMetrics,
        };
      });
    }, tickInterval);

    return () => clearInterval(timer);
  }, [isRunning, speed, tickInterval, schedulingAlgorithm]);
  
  const addMultipleTasks = useCallback((count: number, complexity: TaskComplexity) => {
    if (count <= 0) return;
    setSimulation(prev => {
      const newTasks = new Map(prev.tasks);
      const newQueue = [...prev.queue];
      for (let i = 0; i < count; i++) {
        const id = `task-${Date.now()}-${Math.random().toString(36).substr(2, 5)}-${i}`;

        const baseTime = complexity === TaskComplexity.Simple ? SIMPLE_TASK_TIME : COMPLEX_TASK_TIME;
        const processingTime = unitType === ProcessingUnitType.GPU 
            ? Math.max(1, Math.round(baseTime / 10))
            : baseTime;

        const newTask: Task = {
          id,
          complexity,
          status: TaskStatus.Queued,
          processingTime,
          queueTime: 0,
        };
        newTasks.set(id, newTask);
        newQueue.push(id);
      }
      return { ...prev, tasks: newTasks, queue: newQueue };
    });
  }, [unitType]);

  const resetSimulation = useCallback(() => {
    setIsRunning(false);
    setSimulation(createInitialState(simulationRef.current.processingUnits[0].type));
  }, []);

  const changeUnitType = useCallback((newType: ProcessingUnitType) => {
    setUnitType(newType);
    setIsRunning(false);
    setSimulation(createInitialState(newType));
  }, []);
  
  const changeSchedulingAlgorithm = useCallback((newAlgo: SchedulingAlgorithm) => {
    setSchedulingAlgorithm(newAlgo);
    setIsRunning(false);
    setSimulation(createInitialState(simulationRef.current.processingUnits[0].type));
  }, []);

  return {
    simulation,
    isRunning,
    speed,
    addMultipleTasks,
    start: () => setIsRunning(true),
    pause: () => setIsRunning(false),
    reset: resetSimulation,
    setSpeed,
    changeUnitType,
    unitType,
    schedulingAlgorithm,
    changeSchedulingAlgorithm,
  };
};