export type ZoomLevel = 'month' | 'quarter' | 'year';

export interface Goal {
  id: string;
  title: string;
  description?: string;
  startDate: string; // ISO string
  endDate: string; // ISO string
  parentId?: string;
  dependencies: string[]; // array of Goal IDs
  color: string;
  progress: number; // 0 to 100
  completed?: boolean;
}

export interface TimelineConfig {
  zoom: ZoomLevel;
  startDate: string;
  endDate: string;
}
