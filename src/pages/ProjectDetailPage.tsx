import { useState, useEffect, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { projectsService } from '../api/projects.service';
import { tasksService } from '../api/tasks.service';
import type { Project, Task, TaskStatus } from '../types';
import { KANBAN_COLUMNS } from '../config/kanban';
import { KanbanColumn } from '../components/KanbanColumn';
import { CreateTaskModal } from '../components/CreateTaskModal';

export default function ProjectDetailPage() {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();
    const [project, setProject] = useState<Project | null>(null);
    const [tasks, setTasks] = useState<Task[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [showModal, setShowModal] = useState(false);
    const loadData = useCallback(async () => {
        if (!id) return;
        setLoading(true);
        try {
            const [proj, taskList] = await Promise.all([
                projectsService.getById(id),
                tasksService.getByProject(id),
            ]);
            setProject(proj);
            setTasks(taskList);
        } catch { setError('No se pudo cargar el proyecto'); }
        finally { setLoading(false); }
    }, [id]);
    useEffect(() => { loadData(); }, [loadData]);
    // Optimistic update: cambiar en UI antes de que responda el servidor
    const handleStatusChange = async (taskId: string, newStatus: TaskStatus) => {
        setTasks(prev => prev.map(t => t.id === taskId ? { ...t, status: newStatus }
            : t));
        try { await tasksService.update(taskId, { status: newStatus }); }
        catch { loadData(); } // Si falla, recargar del servidor
    };
    const handleDelete = async (taskId: string) => {
        if (!confirm('¿Eliminar esta tarea?')) return;
        setTasks(prev => prev.filter(t => t.id !== taskId));
        try { await tasksService.remove(taskId); }
        catch { loadData(); }
    };
    const handleTaskCreated = (newTask: Task) => {
        setTasks(prev => [newTask, ...prev]);
        setShowModal(false);
    };
    // Agrupar tareas por status para cada columna
    const tasksByStatus = KANBAN_COLUMNS.reduce((acc, col) => {
        acc[col.id] = tasks.filter(t => t.status === col.id);
        return acc;
    }, {} as Record<TaskStatus, Task[]>);
    if (loading) return (
        <div className="min-h-screen flex items-center justify-center bg-slate-100">
            <div className="animate-spin rounded-full h-10 w-10 border-b-2 borderblue-
600" />
        </div>
    );
    return (
        <div className="min-h-screen bg-slate-100">
            <header className="bg-white border-b border-slate-200 px-6 py-4">
                <div className="max-w-screen-xl mx-auto flex items-center justifybetween">
                    <div className="flex items-center gap-3">
                        <button onClick={() => navigate('/projects')}
                            className="text-slate-400 hover:text-slate-700 text-sm">
                            ← Proyectos
                        </button>
                        <span className="text-slate-300">/</span>
                        <h1 className="text-lg font-bold text-slate-
800">{project?.name}</h1>
                    </div>
                    <button onClick={() => setShowModal(true)}
                        className="bg-blue-600 hover:bg-blue-700 text-white text-sm fontmedium
px-4 py-2 rounded-lg transition">
                        + Nueva Tarea
                    </button>
                </div>
            </header>
            {error && <div className="max-w-screen-xl mx-auto px-6 py-2 text-red-600
text-sm">{error}</div>}
            <main className="max-w-screen-xl mx-auto p-6">
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                    {KANBAN_COLUMNS.map(col => (
                        <KanbanColumn
                            key={col.id}
                            config={col}
                            tasks={tasksByStatus[col.id] ?? []}
                            onStatusChange={handleStatusChange}
                            onDelete={handleDelete}
                            onAddTask={col.id === 'TODO' ? () => setShowModal(true) :
                                undefined}
                        />
                    ))}
                </div>
            </main>
            {showModal && project && (
                <CreateTaskModal
                    projectId={project.id}
                    onCreated={handleTaskCreated}
                    onClose={() => setShowModal(false)}
                />
            )}
        </div>
    );
}