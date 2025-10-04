
export enum ProcessingUnitType {
  CPU = 'cpu',
  GPU = 'gpu',
}

export enum TaskStatus {
  Queued = 'queued',
  Processing = 'processing',
  Completed = 'completed',
}

export enum TaskComplexity {
  Simple = 'Simple',
  Complex = 'Complex',
}

export enum SchedulingAlgorithm {
  FIFO = 'FIFO', // First-In, First-Out
  LIFO = 'LIFO', // Last-In, First-Out
  SJF = 'SJF',   // Shortest Job First
}

export interface Task {
  id: string;
  complexity: TaskComplexity;
  status: TaskStatus;
  processingTime: number; // in simulation ticks
  queueTime: number; // in simulation ticks
  startTime?: number; // tick number when processing started
  endTime?: number; // tick number when processing ended
}

export interface ProcessingUnit {
  id:string;
  type: ProcessingUnitType;
  currentTask: Task | null;
}

export interface SimulationMetrics {
  tasksCompleted: number;
  avgWaitTime: number;
  avgProcessingTime: number;
  utilization: number;
}

export interface SimulationState {
  tasks: Map<string, Task>;
  queue: string[];
  processingUnits: ProcessingUnit[];
  completedTaskIds: string[];
  tick: number;
  metrics: SimulationMetrics;
  nextTaskIdInQueue: string | null;
}