import React from 'react';
import { UserRole } from '../types';
import { ShieldCheck, Activity, Search, RefreshCw, UserCheck, Menu } from 'lucide-react';
import { PWAInstallButton } from './PWAInstallButton';

interface Props {
  title: string;
  subtitle?: string;
  userRole: UserRole;
  onRefreshData?: () => void;
  isRefreshing?: boolean;
  onToggleMobileMenu?: () => void;
}

export const Navbar: React.FC<Props> = ({
  title,
  subtitle,
  userRole,
  onRefreshData,
  isRefreshing,
  onToggleMobileMenu,
}) => {
  return (
    <header className="h-16 bg-white border-b border-slate-200 px-4 md:px-6 flex items-center justify-between shrink-0">
      <div className="flex items-center space-x-3">
        {onToggleMobileMenu && (
          <button 
            onClick={onToggleMobileMenu}
            className="p-1.5 -ml-1.5 md:hidden text-slate-600 hover:bg-slate-100 rounded-lg transition-colors"
          >
            <Menu className="w-5 h-5" />
          </button>
        )}
        <div>
          <h1 className="text-base md:text-lg font-bold text-slate-900 tracking-tight truncate max-w-[200px] md:max-w-none">{title}</h1>
          {subtitle && <p className="text-xs text-slate-500">{subtitle}</p>}
        </div>
      </div>

      <div className="flex items-center space-x-2 md:space-x-3">
        {/* System Health Pulse */}
        <div className="hidden lg:flex items-center space-x-2 px-2.5 py-1 bg-slate-50 border border-slate-200 rounded-lg text-xs text-slate-600">
          <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
          <span className="font-medium text-slate-700">PARIVESH 2.0 & data.gov.in:</span>
          <span className="text-emerald-700 font-semibold">Operational</span>
        </div>

        {/* Model Transparency Disclaimer Pill */}
        <div className="hidden xl:flex items-center space-x-1 px-2.5 py-1 bg-blue-50 border border-blue-200 rounded-lg text-xs text-blue-800">
          <ShieldCheck className="w-3.5 h-3.5 text-blue-600" />
          <span className="font-medium">InfraShield Model Estimates</span>
        </div>

        {/* PWA Install Button */}
        <PWAInstallButton />

        {/* Role Badge */}
        <div className="hidden sm:flex items-center space-x-1.5 px-2.5 py-1 bg-slate-100 border border-slate-200 rounded-lg text-xs font-medium text-slate-700">
          <UserCheck className="w-3.5 h-3.5 text-slate-500" />
          <span>{userRole} Mode</span>
        </div>

        {/* Manual Refresh Button */}
        {onRefreshData && (
          <button
            onClick={onRefreshData}
            disabled={isRefreshing}
            className="p-1.5 rounded-lg border border-slate-200 text-slate-600 hover:bg-slate-50 hover:text-slate-900 transition-colors shadow-2xs shrink-0"
            title="Refresh database records"
          >
            <RefreshCw className={`w-4 h-4 ${isRefreshing ? 'animate-spin text-emerald-600' : ''}`} />
          </button>
        )}
      </div>
    </header>
  );
};
