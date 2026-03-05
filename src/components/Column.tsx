'use client';

import { useDroppable } from '@dnd-kit/core';
import {
  SortableContext,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable';
import { Task, Workstream, Column as ColumnType } from '@/lib/types';
import TaskCard from './TaskCard';

interface ColumnProps {
  column: ColumnType;
  tasks: Task[];
  workstreams: Record<string, Workstream>;
  onTaskClick: (task: Task) => void;
}

export default function Column({ column, tasks, workstreams, onTaskClick }: ColumnProps) {
  const { setNodeRef, isOver } = useDroppable({
    id: column.id,
    data: { type: 'column', status: column.id },
  });

  const taskIds = tasks.map(t => t.id);

  return (
    <div className="flex flex-col min-w-[280px] w-[280px] lg:w-full lg:min-w-0">
      {/* Column Header */}
      <div className="flex items-center justify-between px-3 py-2.5 mb-3">
        <div className="flex items-center gap-2">
          <span className="text-base">{column.icon}</span>
          <h2 className="text-sm font-semibold text-[#e2e8f0]">{column.title}</h2>
          <span className="px-1.5 py-0.5 text-[10px] font-semibold bg-[#2a2d3e] text-[#8892a8] rounded-md tabular-nums">
            {tasks.length}
          </span>
        </div>
      </div>

      {/* Drop zone */}
      <SortableContext items={taskIds} strategy={verticalListSortingStrategy}>
        <div
          ref={setNodeRef}
          className={`
            flex-1 space-y-2.5 p-2 rounded-xl min-h-[200px]
            transition-colors duration-200
            ${isOver ? 'bg-indigo-500/8 border-2 border-dashed border-indigo-500/30' : 'border-2 border-transparent'}
          `}
        >
          {tasks.map(task => (
            <TaskCard
              key={task.id}
              task={task}
              workstream={workstreams[task.workstream] || { label: task.workstream, color: '#6B7280' }}
              onClick={() => onTaskClick(task)}
            />
          ))}

          {tasks.length === 0 && (
            <div className="flex items-center justify-center h-24 text-xs text-[#8892a8]/50 select-none">
              Drop tasks here
            </div>
          )}
        </div>
      </SortableContext>
    </div>
  );
}
