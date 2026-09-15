import React from 'react';
import {
  LayoutDashboard,
  FolderGit2,
  Map,
  Activity,
  Sliders,
  Bell,
  Database,
  Sparkles,
  FileText,
  Settings,
  Shield,
  Layers,
  X,
} from 'lucide-react';
import { UserRole } from '../types';

export type NavTab =
  | 'overview'
  | 'projects'
  | 'map'
  | 'simulator'
  | 'alerts'
  | 'datasources'
  | 'copilot';

interface Props {
  activeTab: NavTab;
  onSelectTab: (tab: NavTab) => void;
  userRole: UserRole;
  onChangeRole: (role: UserRole) => void;
  openAlertsCount: number;
  isOpen?: boolean;
  onClose?: () => void;
}

export const Sidebar: React.FC<Props> = ({
  activeTab,
  onSelectTab,
  userRole,
  onChangeRole,
  openAlertsCount,
  isOpen = false,
  onClose,
}) => {
  const navItems: { id: NavTab; label: string; icon: React.FC<{ className?: string }>; badge?: number }[] = [
    { id: 'overview', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'projects', label: 'Projects Registry', icon: FolderGit2 },
    { id: 'map', label: 'GIS Risk Map', icon: Map },
    { id: 'simulator', label: 'What-If Simulator', icon: Sliders },
    { id: 'alerts', label: 'Alerts Center', icon: Bell, badge: openAlertsCount },
    { id: 'datasources', label: 'Data Sources Catalog', icon: Database },
    { id: 'copilot', label: 'AI Officer Copilot', icon: Sparkles },
  ];

  return (
    <aside className={`fixed md:relative z-40 inset-y-0 left-0 w-64 bg-slate-900 text-slate-300 flex flex-col shrink-0 border-r border-slate-800 select-none transform transition-transform duration-300 ease-in-out ${isOpen ? 'translate-x-0' : '-translate-x-full'} md:translate-x-0`}>
      {/* Brand Header */}
      <div className="p-4 border-b border-slate-800 flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <div className="w-9 h-9 rounded-lg bg-emerald-500 flex items-center justify-center text-slate-950 font-bold shadow-lg shadow-emerald-500/20">
            <Shield className="w-5 h-5 text-slate-950" />
          </div>
          <div>
            <div className="flex items-center space-x-1.5">
              <span className="font-bold text-white tracking-tight text-base">InfraShield</span>
              <span className="text-xs font-semibold px-1.5 py-0.5 rounded bg-emerald-400/10 text-emerald-400 border border-emerald-400/20">AI</span>
            </div>
            <p className="text-[11px] text-slate-400 leading-tight mt-0.5">Decision-Support</p>
          </div>
        </div>
        {onClose && (
          <button onClick={onClose} className="md:hidden p-1 text-slate-400 hover:text-slate-100 hover:bg-slate-800 rounded-lg">
            <X className="w-5 h-5" />
          </button>
        )}
      </div>

      {/* State Badge */}
      <div className="px-4 py-2.5 bg-slate-950/60 border-b border-slate-800/80 flex items-center justify-between text-xs">
        <div className="flex items-center space-x-2">
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
          <span className="text-slate-300 font-medium truncate max-w-[120px]">Karnataka Jurisdiction</span>
        </div>
        <span className="text-[10px] text-slate-500 uppercase tracking-wider font-mono">31 Dist</span>
      </div>

      {/* Navigation Links */}
      <nav className="flex-1 px-3 py-3 space-y-1 overflow-y-auto custom-scrollbar">
        {navItems.map(item => {
          const Icon = item.icon;
          const isActive = activeTab === item.id;
          return (
            <button
              key={item.id}
              onClick={() => onSelectTab(item.id)}
              className={`w-full flex items-center justify-between px-3 py-2 rounded-lg text-xs font-medium transition-all ${
                isActive
                  ? 'bg-emerald-600 text-white shadow-xs font-semibold'
                  : 'text-slate-400 hover:text-slate-100 hover:bg-slate-800/60'
              }`}
            >
              <div className="flex items-center space-x-3">
                <Icon className={`w-4 h-4 ${isActive ? 'text-white' : 'text-slate-400'}`} />
                <span>{item.label}</span>
              </div>
              {item.badge !== undefined && item.badge > 0 && (
                <span className={`text-[10px] px-1.5 py-0.5 rounded-full font-bold ${
                  isActive ? 'bg-white text-emerald-800' : 'bg-rose-500/20 text-rose-300 border border-rose-500/30'
                }`}>
                  {item.badge}
                </span>
              )}
            </button>
          );
        })}
      </nav>

      {/* User Role Switcher */}
      <div className="p-3 border-t border-slate-800 bg-slate-950/40">
        <div className="flex items-center justify-between mb-1.5">
          <span className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider">Active Role</span>
          <span className="text-[10px] text-slate-500">Access Level</span>
        </div>
        <div className="grid grid-cols-3 gap-1 bg-slate-900 p-1 rounded-lg border border-slate-800">
          {(['Admin', 'Officer', 'Viewer'] as UserRole[]).map(role => (
            <button
              key={role}
              onClick={() => onChangeRole(role)}
              className={`py-1 text-[11px] rounded font-medium transition-colors ${
                userRole === role
                  ? 'bg-emerald-500 text-slate-950 font-bold shadow-xs'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              {role}
            </button>
          ))}
        </div>
      </div>

      {/* System Integrity Badge */}
      <div className="p-3 border-t border-slate-800/80 text-[11px] flex items-center justify-between">
        <div className="flex items-center space-x-1.5 text-slate-400">
          <Layers className="w-3.5 h-3.5 text-emerald-400" />
          <span>v1.4 Engine</span>
        </div>
      </div>
    </aside>
  );
};
