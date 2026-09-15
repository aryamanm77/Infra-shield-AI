import React, { useState } from 'react';
import { ProjectRecord, RiskLevel } from '../types';
import {
  Search,
  Filter,
  Download,
  Sliders,
  ExternalLink,
  ChevronRight,
  ShieldCheck,
  Building2,
  Calendar,
  AlertCircle
} from 'lucide-react';

interface Props {
  projects: ProjectRecord[];
  onSelectProject: (projectId: string) => void;
  onOpenSimulator: (projectId: string) => void;
  onOpenProvenance: (project: ProjectRecord, metric?: string, val?: any) => void;
}

export const ProjectsView: React.FC<Props> = ({
  projects,
  onSelectProject,
  onOpenSimulator,
  onOpenProvenance,
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [districtFilter, setDistrictFilter] = useState('All');
  const [typeFilter, setTypeFilter] = useState('All');
  const [riskFilter, setRiskFilter] = useState('All');
  const [statusFilter, setStatusFilter] = useState('All');
  const [sortField, setSortField] = useState<'risk' | 'cost' | 'delay' | 'progress'>('risk');
  const [sortAsc, setSortAsc] = useState(false);

  const districts = ['All', ...Array.from(new Set(projects.map(p => p.district)))];
  const projectTypes = ['All', ...Array.from(new Set(projects.map(p => p.project_type)))];

  const filtered = projects.filter(p => {
    if (districtFilter !== 'All' && p.district !== districtFilter) return false;
    if (typeFilter !== 'All' && p.project_type !== typeFilter) return false;
    if (riskFilter !== 'All' && p.risk_level !== riskFilter) return false;
    if (statusFilter !== 'All' && p.status !== statusFilter) return false;
    if (
      searchTerm &&
      !p.project_name.toLowerCase().includes(searchTerm.toLowerCase()) &&
      !p.project_id.toLowerCase().includes(searchTerm.toLowerCase()) &&
      !p.agency.toLowerCase().includes(searchTerm.toLowerCase())
    ) {
      return false;
    }
    return true;
  });

  filtered.sort((a, b) => {
    let diff = 0;
    if (sortField === 'risk') diff = a.overall_risk_score - b.overall_risk_score;
    if (sortField === 'cost') diff = a.project_cost_cr - b.project_cost_cr;
    if (sortField === 'delay') diff = a.predicted_delay_months - b.predicted_delay_months;
    if (sortField === 'progress') diff = a.progress - b.progress;
    return sortAsc ? diff : -diff;
  });

  const exportCSV = () => {
    const headers = [
      'Project ID',
      'Project Name',
      'Agency',
      'District',
      'Type',
      'Stage',
      'Sanctioned Cost (Cr)',
      'Physical Progress (%)',
      'Land Acquired (%)',
      'Risk Score',
      'Risk Level',
      'Predicted Delay (Mos)',
      'Cost Exposure (Cr)',
      'Data Source',
      'Is Official Data'
    ];

    const rows = filtered.map(p => [
      `"${p.project_id}"`,
      `"${p.project_name.replace(/"/g, '""')}"`,
      `"${p.agency}"`,
      `"${p.district}"`,
      `"${p.project_type}"`,
      `"${p.current_stage}"`,
      p.project_cost_cr,
      p.progress,
      p.land_acquisition_progress,
      p.overall_risk_score,
      p.risk_level,
      p.predicted_delay_months,
      p.cost_exposure_cr,
      `"${p.source_name}"`,
      p.is_official_data ? 'Yes' : 'No'
    ]);

    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map(e => e.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `InfraShield_Projects_Export_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const getRiskBadge = (level: RiskLevel, score: number) => {
    switch (level) {
      case 'Critical':
        return <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-bold bg-rose-50 text-rose-700 border border-rose-200">Critical • {score}</span>;
      case 'High':
        return <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-bold bg-orange-50 text-orange-700 border border-orange-200">High • {score}</span>;
      case 'Medium':
        return <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-bold bg-amber-50 text-amber-700 border border-amber-200">Medium • {score}</span>;
      case 'Low':
        return <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">Low • {score}</span>;
    }
  };

  return (
    <div className="space-y-4 pb-12">
      {/* Controls & Filter Header */}
      <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-2xs space-y-3">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
          <div>
            <h2 className="text-base font-bold text-slate-900">Karnataka Infrastructure Project Registry</h2>
            <p className="text-xs text-slate-500">
              Traceable records aggregated from data.gov.in, PARIVESH 2.0 & Ministry ledgers.
            </p>
          </div>
          <button
            onClick={exportCSV}
            className="inline-flex items-center space-x-1.5 px-3 py-1.5 text-xs font-semibold text-slate-700 bg-white border border-slate-300 rounded-lg hover:bg-slate-50 transition-colors shadow-2xs self-start md:self-auto"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Export Filtered CSV</span>
          </button>
        </div>

        {/* Filters */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-2.5 pt-2 border-t border-slate-100">
          <div>
            <label className="block text-[11px] font-medium text-slate-600 mb-1">Search Keywords</label>
            <div className="relative">
              <Search className="w-3.5 h-3.5 absolute left-2.5 top-2 text-slate-400" />
              <input
                type="text"
                value={searchTerm}
                onChange={e => setSearchTerm(e.target.value)}
                placeholder="ID, Corridor, Agency..."
                className="w-full pl-8 pr-3 py-1.5 text-xs bg-slate-50 border border-slate-300 rounded-lg focus:outline-hidden focus:ring-1 focus:ring-emerald-500"
              />
            </div>
          </div>

          <div>
            <label className="block text-[11px] font-medium text-slate-600 mb-1">District</label>
            <select
              value={districtFilter}
              onChange={e => setDistrictFilter(e.target.value)}
              className="w-full px-2.5 py-1.5 text-xs bg-slate-50 border border-slate-300 rounded-lg focus:outline-hidden"
            >
              {districts.map(d => <option key={d} value={d}>{d}</option>)}
            </select>
          </div>

          <div>
            <label className="block text-[11px] font-medium text-slate-600 mb-1">Project Type</label>
            <select
              value={typeFilter}
              onChange={e => setTypeFilter(e.target.value)}
              className="w-full px-2.5 py-1.5 text-xs bg-slate-50 border border-slate-300 rounded-lg focus:outline-hidden"
            >
              {projectTypes.map(t => <option key={t} value={t}>{t}</option>)}
            </select>
          </div>

          <div>
            <label className="block text-[11px] font-medium text-slate-600 mb-1">Risk Classification</label>
            <select
              value={riskFilter}
              onChange={e => setRiskFilter(e.target.value)}
              className="w-full px-2.5 py-1.5 text-xs bg-slate-50 border border-slate-300 rounded-lg focus:outline-hidden"
            >
              <option value="All">All Risk Levels</option>
              <option value="Critical">Critical (85-100)</option>
              <option value="High">High (70-84)</option>
              <option value="Medium">Medium (40-69)</option>
              <option value="Low">Low (0-39)</option>
            </select>
          </div>

          <div>
            <label className="block text-[11px] font-medium text-slate-600 mb-1">Sort By</label>
            <div className="flex items-center space-x-1">
              <select
                value={sortField}
                onChange={e => setSortField(e.target.value as any)}
                className="w-full px-2 py-1.5 text-xs bg-slate-50 border border-slate-300 rounded-lg focus:outline-hidden"
              >
                <option value="risk">Risk Score</option>
                <option value="delay">Delay Estimate</option>
                <option value="cost">Cost</option>
                <option value="progress">Progress</option>
              </select>
              <button
                onClick={() => setSortAsc(!sortAsc)}
                className="px-2 py-1.5 text-xs border border-slate-300 rounded-lg bg-slate-50 hover:bg-slate-100"
                title="Toggle Sort Direction"
              >
                {sortAsc ? '↑' : '↓'}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Main Table */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-2xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-slate-600">
            <thead className="bg-slate-50 border-b border-slate-200 text-[11px] uppercase tracking-wider text-slate-500 font-semibold">
              <tr>
                <th className="px-4 py-3">Project & ID</th>
                <th className="px-3 py-3">Agency & District</th>
                <th className="px-3 py-3">Stage</th>
                <th className="px-3 py-3">Physical / LA %</th>
                <th className="px-3 py-3">Sanctioned Cost</th>
                <th className="px-3 py-3">Risk Assessment</th>
                <th className="px-3 py-3">Projected Delay</th>
                <th className="px-3 py-3">Cost Exposure</th>
                <th className="px-3 py-3">Data Provenance</th>
                <th className="px-3 py-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filtered.map(project => (
                <tr key={project.id} className="hover:bg-slate-50/80 transition-colors">
                  <td className="px-4 py-3.5 max-w-xs">
                    <button
                      onClick={() => onSelectProject(project.project_id)}
                      className="font-semibold text-slate-900 hover:text-emerald-700 text-left line-clamp-2"
                    >
                      {project.project_name}
                    </button>
                    <span className="text-[10px] font-mono text-slate-400 block mt-0.5">{project.project_id}</span>
                  </td>

                  <td className="px-3 py-3.5 whitespace-nowrap">
                    <div className="font-medium text-slate-800">{project.agency}</div>
                    <div className="text-[11px] text-slate-400">{project.district}</div>
                  </td>

                  <td className="px-3 py-3.5 whitespace-nowrap">
                    <span className="px-2 py-0.5 rounded bg-slate-100 text-slate-700 font-medium">
                      {project.current_stage}
                    </span>
                  </td>

                  <td className="px-3 py-3.5 whitespace-nowrap">
                    <div>
                      <span className="font-semibold text-slate-900">{project.progress}%</span>
                      <span className="text-[10px] text-slate-400 ml-1">works</span>
                    </div>
                    <div className="text-[11px] text-slate-500">
                      <span>{project.land_acquisition_progress}%</span>
                      <span className="text-[10px] text-slate-400 ml-1">land acquired</span>
                    </div>
                  </td>

                  <td className="px-3 py-3.5 whitespace-nowrap font-medium text-slate-900">
                    ₹{project.project_cost_cr.toLocaleString()} Cr
                  </td>

                  <td className="px-3 py-3.5 whitespace-nowrap">
                    {getRiskBadge(project.risk_level, project.overall_risk_score)}
                  </td>

                  <td className="px-3 py-3.5 whitespace-nowrap font-bold text-slate-900">
                    +{project.predicted_delay_months} mos
                  </td>

                  <td className="px-3 py-3.5 whitespace-nowrap font-bold text-rose-600">
                    ₹{project.cost_exposure_cr} Cr
                  </td>

                  <td className="px-3 py-3.5 whitespace-nowrap">
                    <button
                      onClick={() => onOpenProvenance(project, 'Overall Risk & Schedule Delay', `${project.overall_risk_score}/100`)}
                      className="inline-flex items-center space-x-1 text-[11px] font-medium text-emerald-800 hover:text-emerald-950 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200"
                    >
                      <ShieldCheck className="w-3 h-3 text-emerald-600" />
                      <span>{project.is_official_data ? 'Verified' : 'Demo'}</span>
                    </button>
                  </td>

                  <td className="px-3 py-3.5 text-right whitespace-nowrap">
                    <div className="inline-flex items-center space-x-1.5">
                      <button
                        onClick={() => onOpenSimulator(project.project_id)}
                        className="px-2 py-1 text-xs font-medium text-emerald-800 bg-emerald-50 hover:bg-emerald-100 rounded border border-emerald-200"
                        title="Simulate Interventions"
                      >
                        <Sliders className="w-3 h-3" />
                      </button>
                      <button
                        onClick={() => onSelectProject(project.project_id)}
                        className="p-1 text-slate-400 hover:text-slate-800 rounded hover:bg-slate-100"
                        title="Inspect Project"
                      >
                        <ChevronRight className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
