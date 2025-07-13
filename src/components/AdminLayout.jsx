import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { FiBook, FiLayers, FiImage, FiHome, FiMenu, FiX } from 'react-icons/fi';

function AdminLayout({ children }) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const location = useLocation();

  const navItems = [
    { path: '/', label: 'Dashboard', icon: <FiHome size={20} /> },
    { path: '/book-fetch', label: 'Books', icon: <FiBook size={20} /> },
    { path: '/category-fetch', label: 'Categories', icon: <FiLayers size={20} /> },
    { path: '/banner-fetch', label: 'Banners', icon: <FiImage size={20} /> },
  ];

  const toggleSidebar = () => setSidebarOpen(!sidebarOpen);

  return (
    <div className="flex h-screen bg-gray-100 dark:bg-gray-900">
      {/* Mobile sidebar backdrop */}
      {sidebarOpen && (
        <div 
          className="fixed inset-0 z-20 bg-black bg-opacity-50 lg:hidden"
          onClick={toggleSidebar}
        />
      )}

      {/* Sidebar */}
      <aside 
        className={`fixed inset-y-0 left-0 z-30 w-64 transform bg-gray-800 text-white transition-transform duration-300 ease-in-out lg:translate-x-0 lg:static lg:inset-0 ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}`}
      >
        <div className="flex items-center justify-between px-6 py-5 border-b border-gray-700">
          <div className="flex items-center space-x-2">
            <img src="/bookfather.png" alt="Logo" className="w-8 h-8" />
            <span className="text-xl font-bold">BookFather</span>
          </div>
          <button onClick={toggleSidebar} className="lg:hidden">
            <FiX size={24} />
          </button>
        </div>

        <nav className="mt-6 px-4">
          <ul className="space-y-2">
            {navItems.map((item) => (
              <li key={item.path}>
                <Link
                  to={item.path}
                  className={`flex items-center px-4 py-3 rounded-lg transition-colors ${location.pathname === item.path ? 'bg-green-600 text-white' : 'text-gray-300 hover:bg-gray-700'}`}
                  onClick={() => setSidebarOpen(false)}
                >
                  <span className="mr-3">{item.icon}</span>
                  <span>{item.label}</span>
                </Link>
              </li>
            ))}
          </ul>
        </nav>
      </aside>

      {/* Main content */}
      <div className="flex flex-col flex-1 overflow-hidden">
        {/* Top header */}
        <header className="bg-white dark:bg-gray-800 shadow-md z-10">
          <div className="flex items-center justify-between px-6 py-4">
            <button onClick={toggleSidebar} className="text-gray-500 dark:text-gray-300 focus:outline-none lg:hidden">
              <FiMenu size={24} />
            </button>
            <h1 className="text-xl font-semibold text-gray-800 dark:text-white">
              {navItems.find(item => item.path === location.pathname)?.label || 'Dashboard'}
            </h1>
            {/* <div className="flex items-center space-x-2">
              <div className="w-8 h-8 rounded-full bg-green-500 flex items-center justify-center text-white font-bold">
                A
              </div>
            </div> */}
          </div>
        </header>

        {/* Page content */}
        <main className="flex-1 overflow-y-auto bg-gray-100 dark:bg-gray-900 p-4 md:p-6">
          {children}
        </main>
      </div>
    </div>
  );
}

export default AdminLayout;