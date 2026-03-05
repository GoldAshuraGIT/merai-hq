'use client';

import { BoardData } from '@/lib/types';

interface HeaderProps {
  board: BoardData;
  saving: boolean;
  onAddTask: () => void;
  onReload: () => void;
  searchQuery: string;
  onSearchChange: (q: string) => void;
}

export default function Header({
  board,
  saving,
  onAddTask,
  onReload,
  searchQuery,
  onSearchChange,
}: HeaderProps) {
  const total = board.tasks.length;
  const active = board.tasks.filter(
    t => t.status === 'in-progress' || t.status === 'review'
  ).length;
  const done = board.tasks.filter(t => t.status === 'done').length;

  return (
    <header className="sticky top-0 z-30 bg-[#0f1117]/80 backdrop-blur-xl border-b border-[#2a2d3e]">
      <div className="max-w-[1600px] mx-auto px-4 sm:px-6 py-3">
        <div className="flex items-center justify-between gap-4 flex-wrap">
          {/* Logo & Title */}
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-white font-bold text-sm shadow-lg shadow-indigo-500/20">
              M
            </div>
            <div>
              <h1 className="text-lg font-semibold text-white leading-tight">
                MeraiLABS
              </h1>
              <p className="text-xs text-[#8892a8]">Task Board</p>
            </div>
          </div>

          {/* Stats */}
          <div className="flex items-center gap-5 text-sm">
            <div className="flex items-center gap-1.5">
              <span className="text-[#8892a8]">Total</span>
              <span className="font-semibold text-white tabular-nums">{total}</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-amber-400" />
              <span className="text-[#8892a8]">Active</span>
              <span className="font-semibold text-white tabular-nums">{active}</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
              <span className="text-[#8892a8]">Done</span>
              <span className="font-semibold text-white tabular-nums">{done}</span>
            </div>
          </div>

          {/* Search + Actions */}
          <div className="flex items-center gap-3">
            <div className="relative">
              <svg
                className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#8892a8]"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={2}
                stroke="currentColor"
              >
                <path strokeLinecap="round" strokeLinejoin="round" d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607Z" />
              </svg>
              <input
                type="text"
                placeholder="Search tasks..."
                value={searchQuery}
                onChange={e => onSearchChange(e.target.value)}
                className="w-48 sm:w-64 pl-9 pr-3 py-2 text-sm bg-[#161824] border border-[#2a2d3e] rounded-lg text-white placeholder-[#8892a8] focus:outline-none focus:border-indigo-500/50 focus:ring-1 focus:ring-indigo-500/30"
              />
            </div>

            {/* Sync indicator */}
            {saving && (
              <div className="flex items-center gap-1.5 text-xs text-[#8892a8]">
                <div className="w-3 h-3 border-2 border-indigo-400 border-t-transparent rounded-full animate-spin" />
                Saving
              </div>
            )}

            <button
              onClick={onReload}
              className="p-2 rounded-lg bg-[#161824] border border-[#2a2d3e] text-[#8892a8] hover:text-white hover:border-[#3a3d4e] cursor-pointer"
              title="Reload board"
            >
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" d="M16.023 9.348h4.992v-.001M2.985 19.644v-4.992m0 0h4.992m-4.993 0 3.181 3.183a8.25 8.25 0 0 0 13.803-3.7M4.031 9.865a8.25 8.25 0 0 1 13.803-3.7l3.181 3.182" />
              </svg>
            </button>

            <button
              onClick={onAddTask}
              className="flex items-center gap-2 px-4 py-2 text-sm font-medium bg-indigo-600 hover:bg-indigo-500 text-white rounded-lg shadow-lg shadow-indigo-500/20 cursor-pointer"
            >
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
              </svg>
              Add Task
            </button>
          </div>
        </div>
      </div>
    </header>
  );
}
