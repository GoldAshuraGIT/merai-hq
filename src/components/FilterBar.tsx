'use client';

import { Workstream, Assignee, Priority } from '@/lib/types';
import { ASSIGNEE_CONFIG, PRIORITY_CONFIG } from '@/lib/constants';

interface FilterBarProps {
  workstreams: Record<string, Workstream>;
  activeWorkstream: string;
  activeAssignee: string;
  activePriority: string;
  onWorkstreamChange: (w: string) => void;
  onAssigneeChange: (a: string) => void;
  onPriorityChange: (p: string) => void;
}

export default function FilterBar({
  workstreams,
  activeWorkstream,
  activeAssignee,
  activePriority,
  onWorkstreamChange,
  onAssigneeChange,
  onPriorityChange,
}: FilterBarProps) {
  return (
    <div className="max-w-[1600px] mx-auto px-4 sm:px-6 py-3">
      <div className="flex items-center gap-3 flex-wrap">
        <span className="text-xs font-medium text-[#8892a8] uppercase tracking-wider">Filters</span>

        {/* Workstream */}
        <select
          value={activeWorkstream}
          onChange={e => onWorkstreamChange(e.target.value)}
          className="px-3 py-1.5 text-sm bg-[#161824] border border-[#2a2d3e] rounded-lg text-[#e2e8f0] focus:outline-none focus:border-indigo-500/50 cursor-pointer"
        >
          <option value="">All Workstreams</option>
          {Object.entries(workstreams).map(([key, ws]) => (
            <option key={key} value={key}>{ws.label}</option>
          ))}
        </select>

        {/* Assignee */}
        <select
          value={activeAssignee}
          onChange={e => onAssigneeChange(e.target.value)}
          className="px-3 py-1.5 text-sm bg-[#161824] border border-[#2a2d3e] rounded-lg text-[#e2e8f0] focus:outline-none focus:border-indigo-500/50 cursor-pointer"
        >
          <option value="">All Assignees</option>
          {(Object.entries(ASSIGNEE_CONFIG) as [Assignee, typeof ASSIGNEE_CONFIG[Assignee]][]).map(
            ([key, cfg]) => (
              <option key={key} value={key}>{cfg.label}</option>
            )
          )}
        </select>

        {/* Priority */}
        <select
          value={activePriority}
          onChange={e => onPriorityChange(e.target.value)}
          className="px-3 py-1.5 text-sm bg-[#161824] border border-[#2a2d3e] rounded-lg text-[#e2e8f0] focus:outline-none focus:border-indigo-500/50 cursor-pointer"
        >
          <option value="">All Priorities</option>
          {(Object.entries(PRIORITY_CONFIG) as [Priority, typeof PRIORITY_CONFIG[string]][]).map(
            ([key, cfg]) => (
              <option key={key} value={key}>{cfg.label}</option>
            )
          )}
        </select>

        {/* Clear filters */}
        {(activeWorkstream || activeAssignee || activePriority) && (
          <button
            onClick={() => {
              onWorkstreamChange('');
              onAssigneeChange('');
              onPriorityChange('');
            }}
            className="px-3 py-1.5 text-xs text-[#8892a8] hover:text-white bg-[#161824] border border-[#2a2d3e] rounded-lg cursor-pointer"
          >
            Clear all
          </button>
        )}
      </div>
    </div>
  );
}
