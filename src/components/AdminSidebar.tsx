
import React from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from '@/components/ui/sidebar';
import { MessageCircle, Settings, DollarSign, Star, LogOut, User, Globe, FileText, Zap, Users, Palette } from 'lucide-react';

const menuItems = [
  {
    title: 'Configurar WhatsApp',
    url: '/admin/dashboard/whatsapp',
    icon: MessageCircle,
  },
  {
    title: 'Configurar Botões',
    url: '/admin/dashboard/buttons',
    icon: Settings,
  },
  {
    title: 'Configurar Planos',
    url: '/admin/dashboard/plans',
    icon: Star,
  },
  {
    title: 'Tutoriais',
    url: '/admin/dashboard/tutorials',
    icon: Settings,
  },
  {
    title: 'Tabela de Preços',
    url: '/admin/dashboard/pricing',
    icon: DollarSign,
  },
  {
    title: 'Configurar Conteúdo',
    url: '/admin/dashboard/content',
    icon: FileText,
  },
  {
    title: 'Configurar plano destaque',
    url: '/admin/dashboard/krator',
    icon: Zap,
  },
  {
    title: 'Configurar Revendedores',
    url: '/admin/dashboard/reseller',
    icon: Users,
  },
  {
    title: 'Configurações de SEO',
    url: '/admin/dashboard/seo',
    icon: Globe,
  },
  {
    title: 'Configurações do Site',
    url: '/admin/dashboard/site',
    icon: Globe,
  },
  {
    title: 'Temas',
    url: '/admin/dashboard/themes',
    icon: Palette,
  },
  {
    title: 'Tema Krator',
    url: '/admin/dashboard/krator-theme',
    icon: Zap,
  },
  {
    title: 'Configurações Admin',
    url: '/admin/dashboard/settings',
    icon: User,
  },
];

const AdminSidebar = () => {
  const { state } = useSidebar();
  const { signOut } = useAuth();
  const location = useLocation();
  const isCollapsed = state === 'collapsed';

  const handleSignOut = async () => {
    await signOut();
  };

  return (
    <Sidebar className={`${isCollapsed ? 'w-14' : 'w-64'} bg-gray-800 border-r border-gray-700`}>
      <SidebarContent className="bg-gray-800">
        <SidebarGroup>
          <SidebarGroupLabel className="text-green-400 font-semibold px-4 py-2">
            {!isCollapsed && 'Menu Principal'}
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {menuItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton
                    asChild
                    className={`text-gray-300 hover:text-white hover:bg-gray-700 ${
                      location.pathname === item.url
                        ? 'bg-gray-700 text-green-400 border-r-2 border-green-400'
                        : ''
                    }`}
                  >
                    <NavLink to={item.url} className="flex items-center gap-3 px-4 py-2">
                      <item.icon size={20} />
                      {!isCollapsed && <span>{item.title}</span>}
                    </NavLink>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
              
              <SidebarMenuItem>
                <SidebarMenuButton
                  onClick={handleSignOut}
                  className="text-gray-300 hover:text-white hover:bg-red-600 cursor-pointer"
                >
                  <div className="flex items-center gap-3 px-4 py-2">
                    <LogOut size={20} />
                    {!isCollapsed && <span>Sair</span>}
                  </div>
                </SidebarMenuButton>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  );
};

export default AdminSidebar;
