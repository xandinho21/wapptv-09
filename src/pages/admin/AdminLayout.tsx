
import React from 'react';
import { Outlet } from 'react-router-dom';
import { SidebarProvider, SidebarTrigger } from '@/components/ui/sidebar';
import AdminSidebar from '../../components/AdminSidebar';
import { usePublicDataContext } from '../../contexts/PublicDataContext';

const AdminLayout = () => {
  const { data } = usePublicDataContext();
  
  return (
    <SidebarProvider>
      <div className="min-h-screen bg-gray-900 flex w-full">
        <AdminSidebar />
        <div className="flex-1 flex flex-col">
          <header className="bg-gray-800 border-b border-gray-700 px-6 py-4">
            <div className="flex items-center gap-4">
              <SidebarTrigger className="text-gray-300 hover:text-white" />
              <div>
                <h1 className="text-2xl font-bold text-green-400">{data.siteName} Admin</h1>
                <p className="text-gray-400">Painel de Administração</p>
              </div>
            </div>
          </header>
          <main className="flex-1 p-6">
            <Outlet />
          </main>
        </div>
      </div>
    </SidebarProvider>
  );
};

export default AdminLayout;
