
import React from 'react';
import { 
  LayoutDashboard, 
  Server, 
  ShieldAlert, 
  BarChart3, 
  CreditCard, 
  Settings, 
  Lock,
  LogOut,
  ChevronLeft,
  ChevronRight
} from 'lucide-react';
import { auth } from '../security/auth';
import { UserRole } from '../types';

interface SidebarProps {
  collapsed: boolean;
  setCollapsed: (v: boolean) => void;
  activeTab: string;
  setActiveTab: (tab: string) => void;
}

const Sidebar: React.FC<SidebarProps> = ({ collapsed, setCollapsed, activeTab, setActiveTab }) => {
  const user = auth.getUser();

  const menuItems = [
    { id: 'dashboard', icon: LayoutDashboard, label: 'Dashboard', roles: [UserRole.VIEWER, UserRole.DEVELOPER, UserRole.ADMIN] },
    { id: 'servers', icon: Server, label: 'Instances', roles: [UserRole.DEVELOPER, UserRole.ADMIN] },
    { id: 'analytics', icon: BarChart3, label: 'Analytics', roles: [UserRole.VIEWER, UserRole.DEVELOPER, UserRole.ADMIN] },
    { id: 'security', icon: ShieldAlert, label: 'Security', roles: [UserRole.ADMIN] },
    { id: 'billing', icon: CreditCard, label: 'Billing', roles: [UserRole.ADMIN] },
    { id: 'settings', icon: Settings, label: 'Settings', roles: [UserRole.ADMIN, UserRole.DEVELOPER] },
  ];

  return (
    <aside className={`bg-[#0f172a] border-r border-slate-800 transition-all duration-300 flex flex-col ${collapsed ? 'w-20' : 'w-64'}`}>
      <div className="h-16 flex items-center justify-between px-6 border-b border-slate-800">
        {!collapsed && <span className="font-bold text-indigo-400 text-lg tracking-tight">MK MULTIVERSE</span>}
        {collapsed && <span className="font-bold text-indigo-400">MK</span>}
        <button onClick={() => setCollapsed(!collapsed)} className="p-1 hover:bg-slate-800 rounded transition-colors">
          {collapsed ? <ChevronRight size={18} /> : <ChevronLeft size={18} />}
        </button>
      </div>

      <nav className="flex-1 py-6 px-3 space-y-2">
        {menuItems.map((item) => {
          if (!auth.hasPermission(item.roles[0])) return null;
          const isActive = activeTab === item.id;

          return (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className={`w-full flex items-center px-3 py-3 rounded-lg transition-all group ${
                isActive 
                ? 'bg-indigo-600/10 text-indigo-400' 
                : 'text-slate-400 hover:bg-slate-800 hover:text-slate-200'
              }`}
            >
              <item.icon size={20} className={isActive ? 'text-indigo-400' : 'group-hover:text-slate-200'} />
              {!collapsed && <span className="ml-4 font-medium">{item.label}</span>}
              {!collapsed && item.roles[0] === UserRole.ADMIN && (
                <Lock size={12} className="ml-auto opacity-40" />
              )}
            </button>
          );
        })}
      </nav>

      <div className="p-4 border-t border-slate-800">
        {!collapsed && (
          <div className="flex items-center mb-4 px-2">
            <img src={user?.avatar} className="w-8 h-8 rounded-full bg-slate-700" alt="Avatar" />
            <div className="ml-3 overflow-hidden">
              <p className="text-sm font-semibold text-slate-200 truncate">{user?.name}</p>
              <p className="text-xs text-slate-500 truncate">{user?.role}</p>
            </div>
          </div>
        )}
        <button 
          onClick={() => auth.logout()}
          className="w-full flex items-center px-3 py-2 text-red-400 hover:bg-red-500/10 rounded-lg transition-colors"
        >
          <LogOut size={20} />
          {!collapsed && <span className="ml-4 font-medium">Logout</span>}
        </button>
      </div>
    </aside>
  );
};

export default Sidebar;
