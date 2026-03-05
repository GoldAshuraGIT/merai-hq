'use client';

import { useState, useEffect, useCallback, useRef } from 'react';
import { BoardData, Task, Status } from '@/lib/types';
import { EMPTY_BOARD } from '@/lib/constants';

function getToken(): string | null {
  if (typeof window === 'undefined') return null;
  return localStorage.getItem('board_token');
}

async function apiFetch<T>(path: string, options?: RequestInit): Promise<T> {
  const token = getToken();
  const res = await fetch(path, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
      ...options?.headers,
    },
  });

  if (res.status === 401) {
    localStorage.removeItem('board_token');
    window.location.href = '/login';
    throw new Error('Unauthorized');
  }

  if (!res.ok) {
    const data = await res.json().catch(() => ({}));
    throw new Error(data.error || `API error ${res.status}`);
  }

  return res.json();
}

export function useBoard() {
  const [board, setBoard] = useState<BoardData>(EMPTY_BOARD);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const saveTimeout = useRef<ReturnType<typeof setTimeout> | null>(null);
  const boardRef = useRef(board);
  boardRef.current = board;

  const load = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await apiFetch<BoardData>('/api/board');
      setBoard(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load');
    } finally {
      setLoading(false);
    }
  }, []);

  const save = useCallback(async (data: BoardData) => {
    try {
      setSaving(true);
      setError(null);
      await apiFetch('/api/board', {
        method: 'PUT',
        body: JSON.stringify(data),
      });
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to save');
    } finally {
      setSaving(false);
    }
  }, []);

  const debouncedSave = useCallback((data: BoardData) => {
    if (saveTimeout.current) clearTimeout(saveTimeout.current);
    saveTimeout.current = setTimeout(() => save(data), 800);
  }, [save]);

  const updateBoard = useCallback((updater: (prev: BoardData) => BoardData) => {
    setBoard(prev => {
      const next = updater(prev);
      next.meta.lastUpdated = new Date().toISOString();
      debouncedSave(next);
      return next;
    });
  }, [debouncedSave]);

  const addTask = useCallback((task: Omit<Task, 'id' | 'createdAt' | 'updatedAt'>) => {
    updateBoard(prev => ({
      ...prev,
      tasks: [
        ...prev.tasks,
        {
          ...task,
          id: crypto.randomUUID(),
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        },
      ],
    }));
  }, [updateBoard]);

  const updateTask = useCallback((id: string, updates: Partial<Task>) => {
    updateBoard(prev => ({
      ...prev,
      tasks: prev.tasks.map(t =>
        t.id === id ? { ...t, ...updates, updatedAt: new Date().toISOString() } : t
      ),
    }));
  }, [updateBoard]);

  const deleteTask = useCallback((id: string) => {
    updateBoard(prev => ({
      ...prev,
      tasks: prev.tasks.filter(t => t.id !== id),
    }));
  }, [updateBoard]);

  const moveTask = useCallback((taskId: string, newStatus: Status) => {
    updateTask(taskId, { status: newStatus });
  }, [updateTask]);

  useEffect(() => {
    load();
    return () => {
      if (saveTimeout.current) clearTimeout(saveTimeout.current);
    };
  }, [load]);

  return {
    board,
    loading,
    saving,
    error,
    reload: load,
    addTask,
    updateTask,
    deleteTask,
    moveTask,
  };
}
