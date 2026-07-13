import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { useState } from 'react';

const menuItems = [
  { label: 'Inicio', icon: '🏠', active: true, path: '/dashboard' },
  { label: 'Tareas', icon: '📋', active: false, path: '/tasks' },
  { label: 'Proyectos', icon: '📅', active: false, path: '/projects' },
  { label: 'Configuración', icon: '⚙️', active: false, path: '/settings' },
];

export default function DashboardPage() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(true);

  const handleLogout = () => {
    logout();
    navigate('/login', { replace: true });
  };

  const handleMenuClick = (path: string) => {
    navigate(path);
  };

  return (
    <div className="min-h-screen flex flex-col bg-gray-100">

      {/* Header */}
      <header className="bg-white shadow-sm border-b border-gray-200">
        <div className="flex items-center justify-between px-6 h-16">

          <div className="flex items-center gap-4">
            <button
              onClick={() => setSidebarOpen(!sidebarOpen)}
              className="text-gray-600 hover:text-gray-900 text-xl leading-none"
            >
              ☰
            </button>

            <h1 className="text-xl font-bold text-gray-900">
              TaskFlow
            </h1>
          </div>


          <div className="flex items-center gap-4">

            <span className="text-sm text-gray-600">
              {user?.name ?? 'usuario'}
            </span>

            <button
              onClick={handleLogout}
              className="bg-red-600 text-white text-sm rounded px-4 py-2 hover:bg-red-700"
            >
              Cerrar sesión
            </button>

          </div>

        </div>
      </header>


      {/* Body */}
      <div className="flex flex-1">


        {/* Sidebar */}
        <aside
          className={`bg-white shadow-sm border-r border-gray-200 transition-all duration-200 ${
            sidebarOpen
              ? 'w-56'
              : 'w-0 overflow-hidden'
          }`}
        >

          <nav className="p-4 space-y-1">

            {menuItems.map((item) => (

              <button
                key={item.label}
                onClick={() => handleMenuClick(item.path)}
                className={`w-full text-left px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                  item.active
                    ? 'bg-blue-50 text-blue-700'
                    : 'text-gray-700 hover:bg-gray-100'
                }`}
              >

                <span className="mr-2">
                  {item.icon}
                </span>

                {item.label}

              </button>

            ))}

          </nav>

        </aside>



        {/* Main content */}
        <main className="flex-1 p-6">

          <div className="bg-white shadow-md rounded-lg p-8">

            <h2 className="text-2xl font-bold text-gray-900 mb-2">
              Bienvenido, {user?.name ?? 'usuario'}
            </h2>

            <p className="text-gray-600">
              Este es el panel principal. Acá se mostrarán las tareas y el contenido de la aplicación.
            </p>

          </div>

        </main>


      </div>


      {/* Footer */}
      <footer className="bg-white shadow-sm border-t border-gray-200 px-6 py-4">

        <p className="text-sm text-gray-500 text-center">
          &copy; {new Date().getFullYear()} TaskFlow. Todos los derechos reservados.
        </p>

      </footer>


    </div>
  );
}