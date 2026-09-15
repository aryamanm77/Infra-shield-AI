import React from 'react';
import { AlertItem } from '../types';
import { Bell, AlertTriangle, CheckCircle2, Clock, Filter, AlertCircle } from 'lucide-react';

interface Props {
  alerts: AlertItem[];
  onUpdateStatus: (id: string, status: 'Open' | 'Under Review' | 'Resolved') => void;
  onSelectProject: (projectId: string) => void;
}

export const AlertsCenterView: React.FC<Props> = ({ alerts, onUpdateStatus, onSelectProject }) => {
  const openAlerts = alerts.filter(a => a.status === 'Open');
  const reviewAlerts = alerts.filter(a => a.status === 'Under Review');
  const resolvedAlerts = alerts.filter(a => a.status === 'Resolved');

  const getSeverityBadge = (sev: string) => {
    switch (sev) {
      case 'Critical': return 'bg-rose-100 text-rose-800 border-rose-200';
      case 'High': return 'bg-orange-100 text-orange-800 border-orange-200';
      case 'Medium': return 'bg-amber-100 text-amber-800 border-amber-200';
      default: return 'bg-slate-100 text-slate-800 border-slate-200';
    }
  };

  const renderAlertCard = (alert: AlertItem) => (
    <div key={alert.id} className="p-4 bg-white border border-slate-200 rounded-xl shadow-2xs hover:shadow-md transition-shadow">
      <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3">
        <div className="space-y-2 flex-1">
          <div className="flex items-center space-x-2">
            <span className={`text-[10px] font-bold px-2 py-0.5 rounded border uppercase tracking-wider ${getSeverityBadge(alert.severity)}`}>
              {alert.severity}
            </span>
            <span className="text-[10px] text-slate-500 font-mono">
              {new Date(alert.timestamp).toLocaleString()}
            </span>
            {alert.is_official_data && (
              <span className="text-[10px] text-emerald-700 bg-emerald-50 px-1.5 py-0.5 rounded border border-emerald-200 font-medium">
                Official Alert
              </span>
            )}
          </div>
          
          <h4 className="text-sm font-bold text-slate-900 leading-tight">{alert.title}</h4>
          
          <div className="text-xs text-slate-700 space-y-1.5">
            <p><strong>Observation:</strong> {alert.description}</p>
            <p className="text-slate-600"><strong>Impact:</strong> {alert.why_it_matters}</p>
          </div>

          <div className="bg-slate-50 p-2.5 rounded-lg border border-slate-100 text-xs text-slate-700 mt-2">
            <strong className="text-slate-900 block mb-0.5">Recommended Action:</strong>
            {alert.recommended_action}
          </div>

          <div className="pt-2 flex flex-wrap gap-x-4 gap-y-2 text-[11px] text-slate-500 font-medium">
            <span>Project: <button onClick={() => onSelectProject(alert.project_id)} className="text-emerald-700 hover:underline">{alert.project_name}</button></span>
            <span>Source: <a href={alert.source_url} target="_blank" rel="noreferrer" className="text-blue-600 hover:underline">{alert.data_source}</a></span>
          </div>
        </div>

        <div className="shrink-0 flex flex-row sm:flex-col items-center sm:items-end gap-2 border-t sm:border-t-0 pt-3 sm:pt-0 border-slate-100">
          <select
            value={alert.status}
            onChange={(e) => onUpdateStatus(alert.id, e.target.value as any)}
            className="text-xs bg-slate-50 border border-slate-300 rounded-lg px-2 py-1.5 focus:outline-hidden"
          >
            <option value="Open">Status: Open</option>
            <option value="Under Review">Status: Under Review</option>
            <option value="Resolved">Status: Resolved</option>
          </select>
          <button 
            onClick={() => onSelectProject(alert.project_id)}
            className="text-xs font-semibold text-emerald-700 bg-emerald-50 hover:bg-emerald-100 px-3 py-1.5 rounded-lg border border-emerald-200 transition-colors"
          >
            Investigate
          </button>
        </div>
      </div>
    </div>
  );

  return (
    <div className="space-y-6 pb-12">
      <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-2xs">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 bg-rose-50 text-rose-600 rounded-lg flex items-center justify-center">
            <Bell className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-base font-bold text-slate-900">Priority Alerts Center</h2>
            <p className="text-xs text-slate-500">Automated early-warnings derived from statutory data anomalies</p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Open Alerts Column */}
        <div className="space-y-3">
          <div className="flex items-center justify-between pb-2 border-b border-slate-200">
            <h3 className="text-sm font-bold text-slate-900 flex items-center space-x-1.5">
              <AlertCircle className="w-4 h-4 text-rose-500" />
              <span>Open & Critical</span>
            </h3>
            <span className="text-xs font-bold text-slate-500 bg-slate-100 px-2 py-0.5 rounded-full">{openAlerts.length}</span>
          </div>
          <div className="space-y-3">
            {openAlerts.map(renderAlertCard)}
            {openAlerts.length === 0 && <p className="text-xs text-slate-400 text-center py-4">No open alerts.</p>}
          </div>
        </div>

        {/* Under Review Column */}
        <div className="space-y-3">
          <div className="flex items-center justify-between pb-2 border-b border-slate-200">
            <h3 className="text-sm font-bold text-slate-900 flex items-center space-x-1.5">
              <Clock className="w-4 h-4 text-amber-500" />
              <span>Under Review</span>
            </h3>
            <span className="text-xs font-bold text-slate-500 bg-slate-100 px-2 py-0.5 rounded-full">{reviewAlerts.length}</span>
          </div>
          <div className="space-y-3">
            {reviewAlerts.map(renderAlertCard)}
            {reviewAlerts.length === 0 && <p className="text-xs text-slate-400 text-center py-4">No alerts under review.</p>}
          </div>
        </div>

        {/* Resolved Column */}
        <div className="space-y-3">
          <div className="flex items-center justify-between pb-2 border-b border-slate-200">
            <h3 className="text-sm font-bold text-slate-900 flex items-center space-x-1.5">
              <CheckCircle2 className="w-4 h-4 text-emerald-500" />
              <span>Resolved</span>
            </h3>
            <span className="text-xs font-bold text-slate-500 bg-slate-100 px-2 py-0.5 rounded-full">{resolvedAlerts.length}</span>
          </div>
          <div className="space-y-3">
            {resolvedAlerts.map(renderAlertCard)}
            {resolvedAlerts.length === 0 && <p className="text-xs text-slate-400 text-center py-4">No resolved alerts.</p>}
          </div>
        </div>
      </div>
    </div>
  );
};
