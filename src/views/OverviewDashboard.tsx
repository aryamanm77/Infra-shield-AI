import React, { useState } from 'react';
import { ProjectRecord, AlertItem, RiskLevel } from '../types';
import {
  AlertTriangle,
  TrendingUp,
  Clock,
  IndianRupee,
  ChevronRight,
  ShieldCheck,
  Building2,
  ExternalLink,
  Sliders,
  Filter,
  CheckCircle2,
  AlertCircle
} from 'lucide-react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  Cell,
  PieChart,
  Pie,
} from 'recharts';

interface Props {
  projects: ProjectRecord[];
  alerts: AlertItem[];
  kpis: {
    activeProjects: number;
    totalProjects: number;
    highRiskProjects: number;
    avgProgress: number;
    totalAtRiskCostCr: number;
  };
  onSelectProject: (projectId: string) => void;
  onOpenSimulator: (projectId: string) => void;
  onOpenProvenance: (project: ProjectRecord, metric?: string, val?: any) => void;
}

export const OverviewDashboard: React.FC<Props> = ({
  projects,
  alerts,
  kpis,
  onSelectProject,
  onOpenSimulator,
  onOpenProvenance,
}) => {
  const [selectedDistrict, setSelectedDistrict] = useState<string>('All');
  const [selectedType, setSelectedType] = useState<string>('All');
  const [selectedRisk, setSelectedRisk] = useState<string>('All');
  const [searchQuery, setSearchQuery] = useState<string>('');

  // Filtering
  const filteredProjects = projects.filter(p => {
    if (selectedDistrict !== 'All' && p.district !== selectedDistrict) return false;
    if (selectedType !== 'All' && p.project_type !== selectedType) return false;
    if (selectedRisk !== 'All' && p.risk_level !== selectedRisk) return false;
    if (
      searchQuery &&
      !p.project_name.toLowerCase().includes(searchQuery.toLowerCase()) &&
      !p.project_id.toLowerCase().includes(searchQuery.toLowerCase())
    ) {
      return false;
    }
    return true;
  });

  const districts = ['All', ...Array.from(new Set(projects.map(p => p.district)))];
  const projectTypes = ['All', ...Array.from(new Set(projects.map(p => p.project_type)))];

  // Chart data: Projects by risk category
  const riskCounts = {
    Low: projects.filter(p => p.risk_level === 'Low').length,
    Medium: projects.filter(p => p.risk_level === 'Medium').length,
    High: projects.filter(p => p.risk_level === 'High').length,
    Critical: projects.filter(p => p.risk_level === 'Critical').length,
  };

  const riskChartData = [
    { name: 'Low (0-39)', count: riskCounts.Low, color: '#10b981' },
    { name: 'Medium (40-69)', count: riskCounts.Medium, color: '#f59e0b' },
    { name: 'High (70-84)', count: riskCounts.High, color: '#f97316' },
    { name: 'Critical (85-100)', count: riskCounts.Critical, color: '#ef4444' },
  ];

  const getRiskColorBadge = (level: RiskLevel) => {
    switch (level) {
      case 'Critical':
        return 'bg-rose-50 text-rose-700 border-rose-200';
      case 'High':
        return 'bg-orange-50 text-orange-700 border-orange-200';
      case 'Medium':
        return 'bg-amber-50 text-amber-700 border-amber-200';
      case 'Low':
        return 'bg-emerald-50 text-emerald-700 border-emerald-200';
    }
  };

  const defaultKpis = kpis || {
    activeProjects: 0,
    totalProjects: 0,
    highRiskProjects: 0,
    avgProgress: 0,
    totalAtRiskCostCr: 0,
  };

  return (
    <div className="space-y-6 pb-12">
      {/* System Jurisdiction & Verification Banner */}
      <div className="bg-gradient-to-r from-indigo-900 to-indigo-700 text-white rounded-xl p-5 border border-indigo-800 shadow-md flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center space-x-2">
            <span className="px-2 py-0.5 text-[11px] font-semibold bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 rounded">
              Official Monitoring Feed
            </span>
            <span className="text-xs text-indigo-200">Karnataka State Infrastructure Grid</span>
          </div>
          <h2 className="text-lg font-bold text-white mt-1">Infrastructure Early-Warning & Decision Support</h2>
          <p className="text-xs text-indigo-100/80 max-w-2xl mt-0.5">
            Real-time synchronization with <strong>data.gov.in</strong> (NHAI / MoRTH) and <strong>PARIVESH 2.0</strong> (MoEFCC) regulatory clearing houses. Model estimates are clearly delineated from verified government filings.
          </p>
        </div>
        <div className="flex items-center space-x-3 shrink-0">
          <div className="text-right">
            <span className="text-[11px] text-indigo-200 block">Transparent Model</span>
            <span className="text-xs font-mono font-medium text-emerald-400">v1.4 Weighted Engine</span>
          </div>
          <div className="h-8 w-px bg-indigo-600"></div>
          <div className="text-right">
            <span className="text-[11px] text-indigo-200 block">Sync Status</span>
            <span className="text-xs font-semibold text-white">Live Verified</span>
          </div>
        </div>
      </div>

      {/* KPI Cards Row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-2xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-slate-500 uppercase tracking-wider">Active Projects</span>
            <div className="w-8 h-8 rounded-lg bg-blue-50 text-blue-700 flex items-center justify-center">
              <Building2 className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline space-x-2">
            <span className="text-2xl font-extrabold text-slate-900">{defaultKpis.activeProjects}</span>
            <span className="text-xs text-slate-500 font-medium">/ {defaultKpis.totalProjects} total</span>
          </div>
          <p className="text-[11px] text-slate-500 mt-1">Under active state & national tracking</p>
        </div>

        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-2xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-slate-500 uppercase tracking-wider">Elevated Risk Corridors</span>
            <div className="w-8 h-8 rounded-lg bg-rose-50 text-rose-700 flex items-center justify-center">
              <AlertTriangle className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline space-x-2">
            <span className="text-2xl font-extrabold text-rose-600">{defaultKpis.highRiskProjects}</span>
            <span className="text-xs text-slate-500 font-medium">high or critical</span>
          </div>
          <div className="mt-1 flex items-center space-x-1 text-[11px] text-slate-500">
            <ShieldCheck className="w-3 h-3 text-blue-500" />
            <span>InfraShield Model Estimate</span>
          </div>
        </div>

        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-2xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-slate-500 uppercase tracking-wider">Avg Physical Progress</span>
            <div className="w-8 h-8 rounded-lg bg-emerald-50 text-emerald-700 flex items-center justify-center">
              <TrendingUp className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline space-x-2">
            <span className="text-2xl font-extrabold text-slate-900">{defaultKpis.avgProgress}%</span>
            <span className="text-xs text-emerald-600 font-medium">across corridors</span>
          </div>
          <div className="w-full bg-slate-100 rounded-full h-1.5 mt-2">
            <div className="bg-emerald-500 h-1.5 rounded-full" style={{ width: `${defaultKpis.avgProgress}%` }}></div>
          </div>
        </div>

        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-2xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-slate-500 uppercase tracking-wider">Total At-Risk Exposure</span>
            <div className="w-8 h-8 rounded-lg bg-amber-50 text-amber-700 flex items-center justify-center">
              <IndianRupee className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline space-x-1">
            <span className="text-2xl font-extrabold text-slate-900">₹{defaultKpis.totalAtRiskCostCr}</span>
            <span className="text-xs text-slate-600 font-bold">Cr</span>
          </div>
          <p className="text-[11px] text-slate-500 mt-1">Contractor idle & escalation exposure</p>
        </div>
      </div>

      {/* Global Filters Bar */}
      <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-2xs space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2 text-xs font-semibold text-slate-700 uppercase tracking-wider">
            <Filter className="w-3.5 h-3.5 text-slate-500" />
            <span>Filter Portfolio</span>
          </div>
          <span className="text-xs text-slate-500">
            Showing <strong className="text-slate-900">{filteredProjects.length}</strong> of {projects.length} projects
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
          {/* Search */}
          <div>
            <label className="block text-[11px] font-medium text-slate-600 mb-1">Search Corridor / Project ID</label>
            <input
              type="text"
              placeholder="e.g. NH-75, Hubballi, STRR..."
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              className="w-full px-3 py-1.5 text-xs bg-slate-50 border border-slate-300 rounded-lg focus:outline-hidden focus:ring-1 focus:ring-emerald-500"
            />
          </div>

          {/* District */}
          <div>
            <label className="block text-[11px] font-medium text-slate-600 mb-1">District</label>
            <select
              value={selectedDistrict}
              onChange={e => setSelectedDistrict(e.target.value)}
              className="w-full px-3 py-1.5 text-xs bg-slate-50 border border-slate-300 rounded-lg focus:outline-hidden focus:ring-1 focus:ring-emerald-500"
            >
              {districts.map(d => (
                <option key={d} value={d}>{d}</option>
              ))}
            </select>
          </div>

          {/* Project Type */}
          <div>
            <label className="block text-[11px] font-medium text-slate-600 mb-1">Infrastructure Type</label>
            <select
              value={selectedType}
              onChange={e => setSelectedType(e.target.value)}
              className="w-full px-3 py-1.5 text-xs bg-slate-50 border border-slate-300 rounded-lg focus:outline-hidden focus:ring-1 focus:ring-emerald-500"
            >
              {projectTypes.map(t => (
                <option key={t} value={t}>{t}</option>
              ))}
            </select>
          </div>

          {/* Risk Level */}
          <div>
            <label className="block text-[11px] font-medium text-slate-600 mb-1">Risk Level</label>
            <select
              value={selectedRisk}
              onChange={e => setSelectedRisk(e.target.value)}
              className="w-full px-3 py-1.5 text-xs bg-slate-50 border border-slate-300 rounded-lg focus:outline-hidden focus:ring-1 focus:ring-emerald-500"
            >
              <option value="All">All Risk Levels</option>
              <option value="Critical">Critical (85-100)</option>
              <option value="High">High (70-84)</option>
              <option value="Medium">Medium (40-69)</option>
              <option value="Low">Low (0-39)</option>
            </select>
          </div>
        </div>
      </div>

      {/* Main Grid: Projects Watchlist & Visual Analytics */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left 2 Cols: High-Risk Projects Watchlist */}
        <div className="lg:col-span-2 bg-white rounded-xl border border-slate-200 shadow-2xs overflow-hidden flex flex-col">
          <div className="p-4 border-b border-slate-200 flex items-center justify-between bg-slate-50/50">
            <div>
              <h3 className="text-sm font-bold text-slate-900">Project Delay Risk Ledger</h3>
              <p className="text-xs text-slate-500">Classified by InfraShield Transparent Weighted Model</p>
            </div>
            <span className="text-xs text-slate-500 font-mono">Karnataka Grid</span>
          </div>

          <div className="divide-y divide-slate-100 overflow-y-auto max-h-[520px]">
            {filteredProjects.map(project => {
              const topFactor = project.risk_factors[0];
              return (
                <div
                  key={project.id}
                  className="p-4 hover:bg-slate-50/80 transition-colors flex flex-col sm:flex-row sm:items-center justify-between gap-3"
                >
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center space-x-2">
                      <span className={`text-[10px] font-bold px-2 py-0.5 rounded border uppercase tracking-wider ${getRiskColorBadge(project.risk_level)}`}>
                        {project.risk_level} • {project.overall_risk_score}/100
                      </span>
                      <span className="text-xs text-slate-400 font-mono">{project.project_id}</span>
                      {project.is_official_data ? (
                        <span className="text-[10px] px-1.5 py-0.2 bg-emerald-50 text-emerald-700 border border-emerald-200 rounded font-medium">
                          Official Data
                        </span>
                      ) : (
                        <span className="text-[10px] px-1.5 py-0.2 bg-amber-50 text-amber-700 border border-amber-200 rounded font-medium">
                          Demonstration Baseline
                        </span>
                      )}
                    </div>

                    <h4
                      onClick={() => onSelectProject(project.project_id)}
                      className="text-sm font-semibold text-slate-900 hover:text-emerald-700 cursor-pointer mt-1 truncate"
                      title={project.project_name}
                    >
                      {project.project_name}
                    </h4>

                    <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-slate-500 mt-1">
                      <span><strong>Agency:</strong> {project.agency}</span>
                      <span><strong>District:</strong> {project.district}</span>
                      <span><strong>Stage:</strong> {project.current_stage}</span>
                      <span><strong>Physical:</strong> {project.progress}%</span>
                    </div>

                    {topFactor && (
                      <div className="mt-2 text-xs bg-slate-50 p-2 rounded border border-slate-100 flex items-start space-x-1.5">
                        <AlertCircle className="w-3.5 h-3.5 text-slate-500 shrink-0 mt-0.5" />
                        <div className="text-slate-600">
                          <span className="font-medium text-slate-800">Primary Bottleneck:</span> {topFactor.name} (+{topFactor.contribution} pts) — {topFactor.reason}
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Metrics & Actions */}
                  <div className="flex sm:flex-col items-center sm:items-end justify-between sm:justify-center shrink-0 space-y-1 border-t sm:border-t-0 pt-2 sm:pt-0 border-slate-100">
                    <div className="text-left sm:text-right">
                      <span className="text-[10px] text-slate-400 uppercase tracking-wider block">Estimated Delay</span>
                      <span className="text-sm font-extrabold text-slate-900">+{project.predicted_delay_months} mos</span>
                    </div>
                    <div className="text-left sm:text-right">
                      <span className="text-[10px] text-slate-400 uppercase tracking-wider block">Cost Exposure</span>
                      <span className="text-xs font-bold text-rose-600">₹{project.cost_exposure_cr} Cr</span>
                    </div>

                    <div className="flex items-center space-x-1.5 pt-1">
                      <button
                        onClick={() => onOpenSimulator(project.project_id)}
                        className="px-2 py-1 text-xs font-medium text-emerald-800 bg-emerald-50 hover:bg-emerald-100 border border-emerald-200 rounded flex items-center space-x-1 transition-colors"
                        title="Simulate interventions"
                      >
                        <Sliders className="w-3 h-3" />
                        <span>Simulate</span>
                      </button>
                      <button
                        onClick={() => onSelectProject(project.project_id)}
                        className="p-1 text-slate-400 hover:text-slate-700 rounded hover:bg-slate-100"
                        title="View Full Project Intelligence"
                      >
                        <ChevronRight className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Right 1 Col: Portfolio Distribution & Critical Alerts */}
        <div className="space-y-6">
          {/* Risk Level Distribution Chart */}
          <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-2xs">
            <h3 className="text-sm font-bold text-slate-900">Risk Profile Breakdown</h3>
            <p className="text-xs text-slate-500 mb-3">Model assessment across {projects.length} state projects</p>
            <div className="h-44 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={riskChartData} layout="vertical" margin={{ top: 5, right: 20, left: 30, bottom: 5 }}>
                  <XAxis type="number" hide />
                  <YAxis type="category" dataKey="name" tick={{ fontSize: 11, fill: '#64748b' }} width={85} />
                  <Tooltip
                    contentStyle={{ fontSize: '12px', borderRadius: '8px', border: '1px solid #e2e8f0' }}
                    formatter={(val: any) => [`${val} Projects`, 'Count']}
                  />
                  <Bar dataKey="count" radius={[0, 4, 4, 0]}>
                    {riskChartData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Critical Alerts Feed */}
          <div className="bg-white rounded-xl border border-slate-200 shadow-2xs overflow-hidden">
            <div className="p-4 border-b border-slate-200 flex items-center justify-between bg-slate-50">
              <div className="flex items-center space-x-2">
                <AlertTriangle className="w-4 h-4 text-rose-600" />
                <h3 className="text-sm font-bold text-slate-900">Active High-Priority Alerts</h3>
              </div>
              <span className="text-xs font-bold text-rose-600">{alerts.filter(a => a.status === 'Open').length} Open</span>
            </div>

            <div className="divide-y divide-slate-100 max-h-[300px] overflow-y-auto">
              {alerts.slice(0, 3).map(alert => (
                <div key={alert.id} className="p-3.5 hover:bg-slate-50 transition-colors">
                  <div className="flex items-center justify-between">
                    <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded uppercase ${
                      alert.severity === 'Critical' ? 'bg-rose-100 text-rose-800' : 'bg-amber-100 text-amber-800'
                    }`}>
                      {alert.severity}
                    </span>
                    <span className="text-[10px] text-slate-400">{new Date(alert.timestamp).toLocaleDateString()}</span>
                  </div>

                  <h4 className="text-xs font-semibold text-slate-900 mt-1">{alert.title}</h4>
                  <p className="text-[11px] text-slate-500 line-clamp-2 mt-0.5">{alert.description}</p>

                  <div className="mt-2 pt-2 border-t border-slate-100 flex items-center justify-between text-[11px]">
                    <span className="text-slate-500 truncate max-w-[160px]">{alert.project_name}</span>
                    <button
                      onClick={() => onSelectProject(alert.project_id)}
                      className="text-emerald-700 font-semibold hover:underline"
                    >
                      Investigate
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
