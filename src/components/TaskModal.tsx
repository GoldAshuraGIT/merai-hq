'use client';

import { useState, useEffect } from 'react';
import { Task, Workstream, Status, Priority, Assignee } from '@/lib/types';
import { ASSIGNEE_CONFIG, PRIORITY_CONFIG, DEFAULT_WORKSTREAMS } from '@/lib/constants';

interface TaskModalProps {
  task?: Task | null;
  workstreams: Record<string, Workstream>;
  onSave: (data: Omit<Task, 'id' | 'createdAt' | 'updatedAt'>) => void;
  onUpdate?: (id: string, data: Partial<Task>) => void;
  onDelete?: (id: string) => void;
  onClose: () => void;
}

export default function TaskModal({
  task,
  workstreams,
  onSave,
  onUpdate,
  onDelete,
  onClose,
}: TaskModalProps) {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [workstream, setWorkstream] = useState('research');
  const [assignee, setAssignee] = useState<Assignee>('gold');
  const [priority, setPriority] = useState<Priority>('medium');
  const [status, setStatus] = useState<Status>('backlog');
  const [githubUrl, setGithubUrl] = useState('');
  const [confirmDelete, setConfirmDelete] = useState(false);

  const isEditing = !!task;

  useEffect(() => {
    if (task) {
      setTitle(task.title);
      setDescription(task.description);
      setWorkstream(task.workstream);
      setAssignee(task.assignee);
      setPriority(task.priority);
      setStatus(task.status);
      setGithubUrl(task.githubUrl);
    }
  }, [task]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;

    if (isEditing && onUpdate) {
      onUpdate(task.id, {
        title: title.trim(),
        description: description.trim(),
        workstream,
        assignee,
        priority,
        status,
        githubUrl: githubUrl.trim(),
      });
    } else {
      onSave({
        title: title.trim(),
        description: description.trim(),
        workstream,
        assignee,
        priority,
        status,
        githubUrl: githubUrl.trim(),
      });
    }
    onClose();
  };

  const handleDelete = () => {
    if (!confirmDelete) {
      setConfirmDelete(true);
      return;
    }
    if (task && onDelete) {
      onDelete(task.id);
      onClose();
    }
  };

  const ws = workstreams || DEFAULT_WORKSTREAMS;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in"
      onClick={onClose}
    >
      <div
        className="w-full max-w-lg bg-[#161824] border border-[#2a2d3e] rounded-2xl shadow-2xl shadow-black/40 animate-slide-up"
        onClick={e => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 pt-5 pb-4 border-b border-[#2a2d3e]">
          <h2 className="text-lg font-semibold text-white">
            {isEditing ? 'Edit Task' : 'New Task'}
          </h2>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-[#8892a8] hover:text-white hover:bg-[#2a2d3e] cursor-pointer"
          >
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18 18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {/* Title */}
          <div>
            <label className="block text-xs font-medium text-[#8892a8] mb-1.5 uppercase tracking-wider">
              Title <span className="text-red-400">*</span>
            </label>
            <input
              type="text"
              value={title}
              onChange={e => setTitle(e.target.value)}
              placeholder="Task title..."
              autoFocus
              required
              className="w-full px-3.5 py-2.5 text-sm bg-[#0f1117] border border-[#2a2d3e] rounded-lg text-white placeholder-[#8892a8] focus:outline-none focus:border-indigo-500/50 focus:ring-1 focus:ring-indigo-500/30"
            />
          </div>

          {/* Description */}
          <div>
            <label className="block text-xs font-medium text-[#8892a8] mb-1.5 uppercase tracking-wider">
              Description
            </label>
            <textarea
              value={description}
              onChange={e => setDescription(e.target.value)}
              placeholder="Task details..."
              rows={3}
              className="w-full px-3.5 py-2.5 text-sm bg-[#0f1117] border border-[#2a2d3e] rounded-lg text-white placeholder-[#8892a8] focus:outline-none focus:border-indigo-500/50 focus:ring-1 focus:ring-indigo-500/30 resize-none"
            />
          </div>

          {/* Row: Workstream + Assignee */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-medium text-[#8892a8] mb-1.5 uppercase tracking-wider">
                Workstream
              </label>
              <select
                value={workstream}
                onChange={e => setWorkstream(e.target.value)}
                className="w-full px-3.5 py-2.5 text-sm bg-[#0f1117] border border-[#2a2d3e] rounded-lg text-white focus:outline-none focus:border-indigo-500/50 cursor-pointer"
              >
                {Object.entries(ws).map(([key, w]) => (
                  <option key={key} value={key}>{w.label}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-xs font-medium text-[#8892a8] mb-1.5 uppercase tracking-wider">
                Assignee
              </label>
              <select
                value={assignee}
                onChange={e => setAssignee(e.target.value as Assignee)}
                className="w-full px-3.5 py-2.5 text-sm bg-[#0f1117] border border-[#2a2d3e] rounded-lg text-white focus:outline-none focus:border-indigo-500/50 cursor-pointer"
              >
                {Object.entries(ASSIGNEE_CONFIG).map(([key, cfg]) => (
                  <option key={key} value={key}>{cfg.label}</option>
                ))}
              </select>
            </div>
          </div>

          {/* Row: Priority + Status (edit only) */}
          <div className={`grid ${isEditing ? 'grid-cols-2' : 'grid-cols-1'} gap-3`}>
            <div>
              <label className="block text-xs font-medium text-[#8892a8] mb-1.5 uppercase tracking-wider">
                Priority
              </label>
              <select
                value={priority}
                onChange={e => setPriority(e.target.value as Priority)}
                className="w-full px-3.5 py-2.5 text-sm bg-[#0f1117] border border-[#2a2d3e] rounded-lg text-white focus:outline-none focus:border-indigo-500/50 cursor-pointer"
              >
                {Object.entries(PRIORITY_CONFIG).map(([key, cfg]) => (
                  <option key={key} value={key}>{cfg.label}</option>
                ))}
              </select>
            </div>
            {isEditing && (
              <div>
                <label className="block text-xs font-medium text-[#8892a8] mb-1.5 uppercase tracking-wider">
                  Status
                </label>
                <select
                  value={status}
                  onChange={e => setStatus(e.target.value as Status)}
                  className="w-full px-3.5 py-2.5 text-sm bg-[#0f1117] border border-[#2a2d3e] rounded-lg text-white focus:outline-none focus:border-indigo-500/50 cursor-pointer"
                >
                  <option value="backlog">Backlog</option>
                  <option value="in-progress">In Progress</option>
                  <option value="review">Review</option>
                  <option value="done">Done</option>
                </select>
              </div>
            )}
          </div>

          {/* GitHub URL */}
          <div>
            <label className="block text-xs font-medium text-[#8892a8] mb-1.5 uppercase tracking-wider">
              GitHub URL <span className="text-[#8892a8] font-normal normal-case">(optional)</span>
            </label>
            <input
              type="url"
              value={githubUrl}
              onChange={e => setGithubUrl(e.target.value)}
              placeholder="https://github.com/..."
              className="w-full px-3.5 py-2.5 text-sm bg-[#0f1117] border border-[#2a2d3e] rounded-lg text-white placeholder-[#8892a8] focus:outline-none focus:border-indigo-500/50 focus:ring-1 focus:ring-indigo-500/30"
            />
          </div>

          {/* Actions */}
          <div className="flex items-center justify-between pt-2">
            <div>
              {isEditing && onDelete && (
                <button
                  type="button"
                  onClick={handleDelete}
                  className={`px-3.5 py-2 text-sm font-medium rounded-lg cursor-pointer ${
                    confirmDelete
                      ? 'bg-red-600 text-white hover:bg-red-500'
                      : 'text-red-400 hover:text-red-300 hover:bg-red-500/10'
                  }`}
                >
                  {confirmDelete ? 'Confirm Delete' : 'Delete'}
                </button>
              )}
            </div>
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 text-sm text-[#8892a8] hover:text-white rounded-lg cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={!title.trim()}
                className="px-5 py-2 text-sm font-medium bg-indigo-600 hover:bg-indigo-500 disabled:opacity-40 disabled:cursor-not-allowed text-white rounded-lg shadow-lg shadow-indigo-500/20 cursor-pointer"
              >
                {isEditing ? 'Save Changes' : 'Create Task'}
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}
