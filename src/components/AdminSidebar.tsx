import React from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import { Phone, MessageSquare, DollarSign, LogOut, Eye } from 'lucide-react';
import { useAdmin } from '../hooks/useAdmin';
import { useNavigate } from 'react-router-dom';
import { useToast } from '@/hooks/use-toast';
import { Sidebar, SidebarContent, SidebarGroup, SidebarGroupContent, SidebarGroupLabel, SidebarMenu, SidebarMenuButton, SidebarMenuItem, SidebarHeader, SidebarFooter, useSidebar } from '@/components/ui/sidebar';
import { Button } from '@/components/ui/button';
const AdminSidebar = () => {
  const {
    logout
  } = useAdmin();
  const navigate = useNavigate();
  const {
    toast
  } = useToast();
  const location = useLocation();
  const {
    state
  } = useSidebar();
  const menuItems = [{
    title: 'Configurar WhatsApp',
    url: '/admin/dashboard/whatsapp',
    icon: Phone
  }, {
    title: 'Configurar Botões',
    url: '/admin/dashboard/buttons',
    icon: MessageSquare
  }, {
    title: 'Tabela de Preços',
    url: '/admin/dashboard/pricing',
    icon: DollarSign
  }];
  const handleLogout = () => {
    logout();
    navigate('/admin/login');
    toast({
      title: "Logout realizado",
      description: "Você foi desconectado do painel administrativo."
    });
  };
  return <Sidebar className="bg-gray-900 border-gray-700">
      <SidebarHeader className="p-6 border-b border-gray-700 bg-gray-800 mx-0 my-0 px-[24px] py-[22px]">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 bg-green-500 rounded-lg flex items-center justify-center">
            <span className="text-white font-bold">W</span>
          </div>
          {state === 'expanded' && <div>
              <h2 className="text-white font-bold">Wapp TV</h2>
              <p className="text-gray-400 text-sm">Painel Administrador</p>
            </div>}
        </div>
      </SidebarHeader>

      <SidebarContent className="bg-gray-900 rounded-sm my-0 py-0">
        <SidebarGroup className="py-0">
          <SidebarGroupLabel className="text-gray-400 text-xs uppercase tracking-wider">
            {state === 'expanded' ? 'Configurações' : ''}
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {menuItems.map(item => <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild>
                    <NavLink to={item.url} className={({
                  isActive
                }) => `flex items-center gap-3 px-3 py-2 rounded-lg transition-colors ${isActive ? 'bg-green-500 text-white' : 'text-gray-300 hover:bg-gray-800 hover:text-white'}`}>
                      <item.icon size={20} className="bg-green-400 rounded-xl mx-0 px-[2px] py-0" />
                      {state === 'expanded' && <span className="text-slate-50">{item.title}</span>}
                    </NavLink>
                  </SidebarMenuButton>
                </SidebarMenuItem>)}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter className="p-4 border-t border-gray-700 bg-gray-900">
        <div className="space-y-2">
          <Button onClick={() => navigate('/')} variant="outline" size={state === 'expanded' ? 'default' : 'icon'} className="w-full border-gray-600 justify-start bg-green-50 text-gray-900">
            <Eye size={16} />
            {state === 'expanded' && <span className="ml-2">Ver Site</span>}
          </Button>
          <Button onClick={handleLogout} variant="destructive" className="w-full justify-start" size={state === 'expanded' ? 'default' : 'icon'}>
            <LogOut size={16} />
            {state === 'expanded' && <span className="ml-2">Sair</span>}
          </Button>
        </div>
      </SidebarFooter>
    </Sidebar>;
};
export default AdminSidebar;