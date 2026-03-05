import { Column, Workstream, Assignee } from './types';

export const COLUMNS: Column[] = [
  { id: 'backlog', title: 'Backlog', icon: '📋' },
  { id: 'in-progress', title: 'In Progress', icon: '⚡' },
  { id: 'review', title: 'Review', icon: '👀' },
  { id: 'done', title: 'Done', icon: '✅' },
];

export const DEFAULT_WORKSTREAMS: Record<string, Workstream> = {
  research: { label: 'Research', color: '#8B5CF6' },
  curriculum: { label: 'Curriculum', color: '#3B82F6' },
  avatars: { label: 'Avatars', color: '#EC4899' },
  platform: { label: 'Platform', color: '#10B981' },
  social: { label: 'Social Media', color: '#F59E0B' },
  marketing: { label: 'Marketing', color: '#EF4444' },
  operations: { label: 'Operations', color: '#6B7280' },
};

export const ASSIGNEE_CONFIG: Record<Assignee, { label: string; color: string; bg: string }> = {
  gold: { label: 'Gold', color: '#F59E0B', bg: 'rgba(245,158,11,0.15)' },
  ashura: { label: 'Ashura', color: '#8B5CF6', bg: 'rgba(139,92,246,0.15)' },
  claude: { label: 'Claude', color: '#3B82F6', bg: 'rgba(59,130,246,0.15)' },
};

export const PRIORITY_CONFIG: Record<string, { label: string; color: string; glow: string }> = {
  high: { label: 'High', color: '#EF4444', glow: '0 0 8px rgba(239,68,68,0.6)' },
  medium: { label: 'Medium', color: '#F59E0B', glow: '0 0 8px rgba(245,158,11,0.5)' },
  low: { label: 'Low', color: '#10B981', glow: '0 0 8px rgba(16,185,129,0.5)' },
};

export const EMPTY_BOARD = {
  meta: {
    project: 'MeraiLABS',
    lastUpdated: new Date().toISOString(),
    updatedBy: 'system',
  },
  workstreams: DEFAULT_WORKSTREAMS,
  tasks: [],
};
