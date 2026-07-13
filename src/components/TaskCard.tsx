import { useState } from 'react';
import { useDraggable } from '@dnd-kit/core';

import type { Task, TaskStatus } from '../types';
import { KANBAN_COLUMNS } from '../config/kanban';

interface TaskCardProps {
  task: Task;
  onStatusChange: (taskId: string, newStatus: TaskStatus) => void;
  onDelete: (taskId: string) => void;
}

export function TaskCard({
  task,
  onStatusChange,
  onDelete,
}: TaskCardProps) {
  const [hovered, setHovered] = useState(false);

  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    isDragging,
  } = useDraggable({
    id: task.id,
  });

  const style = transform
    ? {
        transform: `translate3d(${transform.x}px, ${transform.y}px, 0)`,
      }
    : undefined;

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...listeners}
      {...attributes}
      className={`
        bg-white
        rounded-lg
        border
        border-slate-200
        p-3
        shadow-sm
        transition
        relative
        group
        cursor-grab
        active:cursor-grabbing
        ${hovered ? 'shadow-md' : ''}
        ${isDragging ? 'opacity-50 z-50' : ''}
      `}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      {/* Botón eliminar */}
      <button
        type="button"
        onClick={(e) => {
          e.stopPropagation();
          onDelete(task.id);
        }}
        className="
          absolute
          top-2
          right-2
          text-slate-300
          hover:text-red-500
          opacity-0
          group-hover:opacity-100
          transition
          text-lg
          leading-none
        "
      >
        ×
      </button>

      {/* Título */}
      <p className="font-medium text-slate-800 text-sm pr-6 mb-1">
        {task.title}
      </p>

      {/* Descripción */}
      {task.description && (
        <p className="text-xs text-slate-500 line-clamp-2 mb-2">
          {task.description}
        </p>
      )}

      {/* Asignado y comentarios */}
      <div className="flex items-center justify-between mt-2">
        {task.assignee ? (
          <span className="text-xs bg-slate-100 text-slate-600 px-2 py-0.5 rounded-full">
            {task.assignee.name}
          </span>
        ) : (
          <span />
        )}

        {(task._count?.comments ?? 0) > 0 && (
          <span className="text-xs text-slate-400">
            💬 {task._count.comments}
          </span>
        )}
      </div>

      {/* Estado */}
      <select
        value={task.status}
        onClick={(e) => e.stopPropagation()}
        onChange={(e) =>
          onStatusChange(task.id, e.target.value as TaskStatus)
        }
        className="
          mt-3
          w-full
          rounded
          border
          border-slate-200
          px-2
          py-1
          text-xs
          bg-white
          text-slate-600
          focus:outline-none
          focus:ring-1
          focus:ring-blue-400
        "
      >
        {KANBAN_COLUMNS.map((column) => (
          <option key={column.id} value={column.id}>
            {column.label}
          </option>
        ))}
      </select>
    </div>
  );
}