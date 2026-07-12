import { Task, TaskStatus } from '../types';
import { TaskCard } from './TaskCard';
import { KanbanColumnConfig } from '../config/kanban';
interface Props {
    config: KanbanColumnConfig;
    tasks: Task[];
    onStatusChange: (taskId: string, newStatus: TaskStatus) => void;
    onDelete: (taskId: string) => void;
    onAddTask?: () => void;
}
export function KanbanColumn({ config, tasks, onStatusChange, onDelete,
    onAddTask }: Props) {
    return (
        <div className={`flex flex-col rounded-xl ${config.bgColor} min-h-[200px] p-
3`}>
            <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2">
                    <div className={`w-2.5 h-2.5 rounded-full ${config.color}`} />
                    <span className="text-sm font-semibold text-slate-
700">{config.label}</span>
                    <span className="text-xs bg-white text-slate-500 px-1.5 py-0.5
rounded-full border">
                        {tasks.length}
                    </span>
                </div>
                {onAddTask && (
                    <button onClick={onAddTask}
                        className="text-slate-400 hover:text-blue-600 text-xl leading-none
transition">
                        +
                    </button>
                )}
            </div>
            <div className="flex flex-col gap-2">
                {tasks.map(task => (
                    <TaskCard
                        key={task.id}
                        task={task}
                        onStatusChange={onStatusChange}
                        onDelete={onDelete}
                    />
                ))}
                {tasks.length === 0 && (
                    <div className="text-center py-8 text-slate-300 text-xs">Sin
                        tareas</div>
                )}
            </div>
        </div>
    );
}