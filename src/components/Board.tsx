'use client';

import { useState, useMemo } from 'react';
import {
  DndContext,
  DragEndEvent,
  DragOverEvent,
  DragStartEvent,
  DragOverlay,
  PointerSensor,
  useSensor,
  useSensors,
  closestCorners,
} from '@dnd-kit/core';
import { Task, Status } from '@/lib/types';
import { COLUMNS } from '@/lib/constants';
import { useBoard } from '@/hooks/useBoard';
import Header from './Header';
import FilterBar from './FilterBar';
import Column from './Column';
import TaskCard from './TaskCard';
import TaskModal from './TaskModal';

export default function Board() {
  const {
    board,
    loading,
    saving,
    error,
    reload,
    addTask,
    updateTask,
    deleteTask,
    moveTask,
  } = useBoard();

  const [searchQuery, setSearchQuery] = useState('');
  const [filterWorkstream, setFilterWorkstream] = useState('');
  const [filterAssignee, setFilterAssignee] = useState('');
  const [filterPriority, setFilterPriority] = useState('');
  const [modalOpen, setModalOpen] = useState(false);
  const [editingTask, setEditingTask] = useState<Task | null>(null);
  const [activeTask, setActiveTask] = useState<Task | null>(null);

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 5,
      },
    })
  );

  // Filter tasks
  const filteredTasks = useMemo(() => {
    return board.tasks.filter(task => {
      if (searchQuery) {
        const q = searchQuery.toLowerCase();
        if (
          !task.title.toLowerCase().includes(q) &&
          !task.description.toLowerCase().includes(q)
        ) {
          return false;
        }
      }
      if (filterWorkstream && task.workstream !== filterWorkstream) return false;
      if (filterAssignee && task.assignee !== filterAssignee) return false;
      if (filterPriority && task.priority !== filterPriority) return false;
      return true;
    });
  }, [board.tasks, searchQuery, filterWorkstream, filterAssignee, filterPriority]);

  // Group tasks by column
  const tasksByColumn = useMemo(() => {
    const map: Record<Status, Task[]> = {
      backlog: [],
      'in-progress': [],
      review: [],
      done: [],
    };
    filteredTasks.forEach(t => {
      if (map[t.status]) map[t.status].push(t);
    });
    return map;
  }, [filteredTasks]);

  const handleDragStart = (event: DragStartEvent) => {
    const task = board.tasks.find(t => t.id === event.active.id);
    if (task) setActiveTask(task);
  };

  const handleDragOver = (_event: DragOverEvent) => {
    // We handle everything in dragEnd for simplicity
  };

  const handleDragEnd = (event: DragEndEvent) => {
    setActiveTask(null);

    const { active, over } = event;
    if (!over) return;

    const taskId = active.id as string;
    const overData = over.data.current;

    let newStatus: Status | null = null;

    if (overData?.type === 'column') {
      newStatus = overData.status as Status;
    } else if (overData?.type === 'task') {
      // Dropped on another task — take that task's status
      const overTask = board.tasks.find(t => t.id === over.id);
      if (overTask) newStatus = overTask.status;
    }

    if (newStatus) {
      const currentTask = board.tasks.find(t => t.id === taskId);
      if (currentTask && currentTask.status !== newStatus) {
        moveTask(taskId, newStatus);
      }
    }
  };

  const openNewTask = () => {
    setEditingTask(null);
    setModalOpen(true);
  };

  const openEditTask = (task: Task) => {
    setEditingTask(task);
    setModalOpen(true);
  };

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center gap-4 bg-[#0f1117]">
        <div className="w-8 h-8 border-2 border-indigo-500 border-t-transparent rounded-full animate-spin" />
        <p className="text-sm text-[#8892a8]">Loading board...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-[#0f1117]">
      <Header
        board={board}
        saving={saving}
        onAddTask={openNewTask}
        onReload={reload}
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
      />

      <FilterBar
        workstreams={board.workstreams}
        activeWorkstream={filterWorkstream}
        activeAssignee={filterAssignee}
        activePriority={filterPriority}
        onWorkstreamChange={setFilterWorkstream}
        onAssigneeChange={setFilterAssignee}
        onPriorityChange={setFilterPriority}
      />

      {error && (
        <div className="max-w-[1600px] mx-auto px-4 sm:px-6 mb-3">
          <div className="flex items-center gap-2 px-4 py-2.5 text-sm bg-red-500/10 border border-red-500/20 text-red-400 rounded-lg">
            <svg className="w-4 h-4 shrink-0" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m9-.75a9 9 0 1 1-18 0 9 9 0 0 1 18 0Zm-9 3.75h.008v.008H12v-.008Z" />
            </svg>
            {error}
            <button onClick={reload} className="ml-auto text-xs underline cursor-pointer hover:text-red-300">
              Retry
            </button>
          </div>
        </div>
      )}

      {/* Board */}
      <div className="flex-1 max-w-[1600px] mx-auto w-full px-4 sm:px-6 pb-6">
        <DndContext
          sensors={sensors}
          collisionDetection={closestCorners}
          onDragStart={handleDragStart}
          onDragOver={handleDragOver}
          onDragEnd={handleDragEnd}
        >
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {COLUMNS.map(col => (
              <Column
                key={col.id}
                column={col}
                tasks={tasksByColumn[col.id]}
                workstreams={board.workstreams}
                onTaskClick={openEditTask}
              />
            ))}
          </div>

          <DragOverlay dropAnimation={null}>
            {activeTask && (
              <div className="rotate-2 scale-105 opacity-90">
                <TaskCard
                  task={activeTask}
                  workstream={
                    board.workstreams[activeTask.workstream] || {
                      label: activeTask.workstream,
                      color: '#6B7280',
                    }
                  }
                  onClick={() => {}}
                />
              </div>
            )}
          </DragOverlay>
        </DndContext>
      </div>

      {/* Modal */}
      {modalOpen && (
        <TaskModal
          task={editingTask}
          workstreams={board.workstreams}
          onSave={addTask}
          onUpdate={updateTask}
          onDelete={deleteTask}
          onClose={() => {
            setModalOpen(false);
            setEditingTask(null);
          }}
        />
      )}
    </div>
  );
}
