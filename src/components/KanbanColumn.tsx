import { useDroppable } from '@dnd-kit/core';

import type { Task, TaskStatus } from '../types';
import type { KanbanColumnConfig } from '../config/kanban';

import { TaskCard } from './TaskCard';

interface Props {
  config: KanbanColumnConfig;
  tasks: Task[];
  onStatusChange: (taskId: string, newStatus: TaskStatus) => void;
  onDelete: (taskId: string) => void;
  onAddTask?: () => void;
}

export function KanbanColumn({
  config,
  tasks,
  onStatusChange,
  onDelete,
  onAddTask,
}: Props) {
  const { setNodeRef, isOver } = useDroppable({
    id: config.id,
  });

  return (
    <div
      className={`
        flex flex-col
        rounded-xl
        ${config.bgColor}
        min-h-[500px]
        p-3
        transition-colors
        ${isOver ? 'ring-2 ring-blue-400 bg-blue-50' : ''}
      `}
    >
      {/* Cabecera */}
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <div className={`w-2.5 h-2.5 rounded-full ${config.color}`} />

          <span className="text-sm font-semibold text-slate-700">
            {config.label}
          </span>

          <span className="text-xs bg-white text-slate-500 px-1.5 py-0.5 rounded-full border">
            {tasks.length}
          </span>
        </div>

        {onAddTask && (
          <button
            type="button"
            onClick={onAddTask}
            className="text-slate-400 hover:text-blue-600 text-xl leading-none transition"
          >
            +
          </button>
        )}
      </div>

      {/* Zona donde se pueden soltar tarjetas */}
      <div
        ref={setNodeRef}
        className="flex flex-col gap-2 flex-1 rounded-lg transition-colors"
      >
        {tasks.map((task) => (
          <TaskCard
            key={task.id}
            task={task}
            onStatusChange={onStatusChange}
            onDelete={onDelete}
          />
        ))}

        {tasks.length === 0 && (
          <div className="flex items-center justify-center flex-1 text-slate-300 text-xs border-2 border-dashed border-slate-200 rounded-lg py-10">
            Suelta una tarea aquí
          </div>
        )}
      </div>
    </div>
  );
}