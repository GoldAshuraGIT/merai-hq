'use client';

import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { Task, Workstream } from '@/lib/types';
import { ASSIGNEE_CONFIG, PRIORITY_CONFIG } from '@/lib/constants';

interface TaskCardProps {
  task: Task;
  workstream: Workstream;
  onClick: () => void;
}

export default function TaskCard({ task, workstream, onClick }: TaskCardProps) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({
    id: task.id,
    data: { type: 'task', task },
  });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  const assignee = ASSIGNEE_CONFIG[task.assignee];
  const priority = PRIORITY_CONFIG[task.priority];

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...attributes}
      {...listeners}
      onClick={onClick}
      className={`
        group p-3.5 rounded-xl bg-[#1c1f2e] border border-[#2a2d3e]
        hover:border-[#3a3d4e] hover:bg-[#242838]
        cursor-grab active:cursor-grabbing
        ${isDragging ? 'opacity-50 scale-[1.02] shadow-2xl shadow-black/40 z-50' : ''}
      `}
    >
      {/* Top row: workstream tag + priority + github */}
      <div className="flex items-center justify-between mb-2.5">
        <span
          className="px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wider rounded-md"
          style={{
            color: workstream.color,
            backgroundColor: `${workstream.color}18`,
          }}
        >
          {workstream.label}
        </span>
        <div className="flex items-center gap-2">
          {task.githubUrl && (
            <a
              href={task.githubUrl}
              target="_blank"
              rel="noopener noreferrer"
              onClick={e => e.stopPropagation()}
              className="text-[#8892a8] hover:text-white"
            >
              <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="currentColor">
                <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0 0 24 12c0-6.63-5.37-12-12-12Z" />
              </svg>
            </a>
          )}
          <span
            className="w-2 h-2 rounded-full shrink-0"
            style={{
              backgroundColor: priority.color,
              boxShadow: priority.glow,
            }}
            title={`${priority.label} priority`}
          />
        </div>
      </div>

      {/* Title */}
      <h3 className="text-sm font-medium text-white mb-1 leading-snug line-clamp-2">
        {task.title}
      </h3>

      {/* Description */}
      {task.description && (
        <p className="text-xs text-[#8892a8] leading-relaxed mb-3 line-clamp-2">
          {task.description}
        </p>
      )}

      {/* Assignee */}
      <div className="flex items-center justify-between">
        <span
          className="inline-flex items-center gap-1 px-2 py-0.5 text-[10px] font-semibold rounded-md"
          style={{
            color: assignee.color,
            backgroundColor: assignee.bg,
          }}
        >
          <span className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: assignee.color }} />
          {assignee.label}
        </span>
      </div>
    </div>
  );
}
