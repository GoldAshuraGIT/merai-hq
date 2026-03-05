export type Status = 'backlog' | 'in-progress' | 'review' | 'done';
export type Priority = 'high' | 'medium' | 'low';
export type Assignee = 'gold' | 'ashura' | 'claude';

export interface Task {
  id: string;
  title: string;
  description: string;
  status: Status;
  assignee: Assignee;
  priority: Priority;
  workstream: string;
  githubUrl: string;
  createdAt: string;
  updatedAt: string;
}

export interface Workstream {
  label: string;
  color: string;
}

export interface BoardMeta {
  project: string;
  lastUpdated: string;
  updatedBy: string;
}

export interface BoardData {
  meta: BoardMeta;
  workstreams: Record<string, Workstream>;
  tasks: Task[];
}

export interface Column {
  id: Status;
  title: string;
  icon: string;
}
