import React, { useState } from 'react';
import { ProjectRecord, RiskLevel, RiskFactor, ClearanceRecord } from '../types';
import {
  ArrowLeft,
  Building2,
  Calendar,
  IndianRupee,
  ShieldCheck,
  AlertTriangle,
  Sliders,
  Sparkles,
  ExternalLink,
  Clock,
  Layers,
  FileCheck,
  CheckCircle2,
  Info
} from 'lucide-react';

interface Props {
  project: ProjectRecord;
  onBack: () => void;
  onOpenSimulator: (projectId: string) => void;
  onOpenCopilot: (projectId: string) => void;
  onOpenProvenance: (project: ProjectRecord, metric?: string, val?: any) => void;
}

export const ProjectDetailView: React.FC<Props> = ({
  project,
  onBack,
  onOpenSimulator,
  onOpenCopilot,
  onOpenProvenance,
}) => {
  const [activeTab, setActiveTab] = useState<'overview' | 'risk_factors' | 'clearances' | 'segments'>('overview');

  const getRiskColor = (level: RiskLevel) => {
    switch (level) {
      case 'Critical': return 'bg-rose-500 text-white';
      case 'High': return 'bg-orange-500 text-white';
      case 'Medium': return 'bg-amber-500 text-white';
      case 'Low': return 'bg-emerald-500 text-white';
    }
  };

  return (
    <div className="space-y-6 pb-12">
      {/* Top Breadcrumb & Actions */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <button
          onClick={onBack}
          className="inline-flex items-center space-x-1 text-xs font-semibold text-slate-600 hover:text-slate-900 bg-white px-3 py-1.5 rounded-lg border border-slate-200 shadow-2xs self-start"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Back to Projects</span>
        </button>

        <div className="flex items-center space-x-2">
          <button
            onClick={() => onOpenCopilot(project.project_id)}
            className="inline-flex items-center space-x-1.5 px-3 py-1.5 text-xs font-semibold text-slate-700 bg-white border border-slate-300 rounded-lg hover:bg-slate-50 transition-colors shadow-2xs"
          >
            <Sparkles className="w-3.5 h-3.5 text-purple-600" />
            <span>Consult AI Copilot</span>
          </button>

          <button
            onClick={() => onOpenSimulator(project.project_id)}
            className="inline-flex items-center space-x-1.5 px-3 py-1.5 text-xs font-semibold text-white bg-emerald-600 rounded-lg hover:bg-emerald-700 transition-colors shadow-xs"
          >
            <Sliders className="w-3.5 h-3.5" />
            <span>Simulate Interventions</span>
          </button>
        </div>
      </div>

      {/* Project Header Card */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-2xs p-6">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          <div className="space-y-1.5">
            <div className="flex flex-wrap items-center gap-2">
              <span className="text-xs font-mono font-bold px-2 py-0.5 rounded bg-slate-100 text-slate-700 border border-slate-200">
                {project.project_id}
              </span>
              <span className="text-xs font-medium px-2 py-0.5 rounded bg-blue-50 text-blue-700 border border-blue-200">
                {project.project_type}
              </span>
              <span className="text-xs font-medium px-2 py-0.5 rounded bg-slate-100 text-slate-700 border border-slate-200">
                {project.current_stage}
              </span>
              {project.is_official_data ? (
                <span className="text-xs font-medium px-2 py-0.5 rounded bg-emerald-50 text-emerald-700 border border-emerald-200 flex items-center space-x-1">
                  <ShieldCheck className="w-3 h-3" />
                  <span>Official Public Data</span>
                </span>
              ) : (
                <span className="text-xs font-medium px-2 py-0.5 rounded bg-amber-50 text-amber-700 border border-amber-200">
                  Demonstration Dataset
                </span>
              )}
            </div>

            <h2 className="text-xl font-bold text-slate-900">{project.project_name}</h2>
            <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-slate-500">
              <span><strong>Agency:</strong> {project.agency}</span>
              <span><strong>Location:</strong> {project.location}</span>
              <span><strong>District:</strong> {project.district}, {project.state}</span>
              <span><strong>Last Synced:</strong> {new Date(project.last_updated).toLocaleDateString()}</span>
            </div>
          </div>

          {/* Model Risk Estimate Badge */}
          <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 shrink-0 flex items-center space-x-4">
            <div className="text-right">
              <div className="flex items-center space-x-1 text-[11px] font-semibold text-slate-500 uppercase tracking-wider justify-end">
                <Info className="w-3 h-3 text-slate-400" />
                <span>InfraShield Model Estimate</span>
              </div>
              <p className="text-2xl font-black text-slate-900 mt-0.5">
                {project.overall_risk_score} <span className="text-xs font-normal text-slate-500">/ 100</span>
              </p>
              <span className={`text-[10px] font-bold px-2 py-0.5 rounded uppercase tracking-wider inline-block mt-0.5 ${getRiskColor(project.risk_level)}`}>
                {project.risk_level} Risk
              </span>
            </div>
            <div className="h-12 w-px bg-slate-200"></div>
            <div className="text-left space-y-1 text-xs">
              <div>
                <span className="text-slate-400 block text-[10px] uppercase">Projected Delay</span>
                <span className="font-bold text-slate-900">+{project.predicted_delay_months} months</span>
              </div>
              <div>
                <span className="text-slate-400 block text-[10px] uppercase">Financial Exposure</span>
                <span className="font-bold text-rose-600">₹{project.cost_exposure_cr} Cr</span>
              </div>
            </div>
          </div>
        </div>

        {/* Milestone Progress Bar */}
        <div className="mt-6 pt-5 border-t border-slate-100 grid grid-cols-1 md:grid-cols-4 gap-4 text-xs">
          <div>
            <span className="text-slate-400 uppercase text-[10px] block">Sanctioned Outlay</span>
            <span className="text-sm font-bold text-slate-900">₹{project.project_cost_cr} Cr</span>
            <span className="text-slate-500 text-[11px] block mt-0.5">Expenditure: ₹{project.expenditure_to_date_cr} Cr</span>
          </div>

          <div>
            <span className="text-slate-400 uppercase text-[10px] block">Planned Timeline</span>
            <span className="text-sm font-bold text-slate-900">{project.planned_start}</span>
            <span className="text-slate-500 text-[11px] block mt-0.5">Target: {project.planned_completion}</span>
          </div>

          <div>
            <span className="text-slate-400 uppercase text-[10px] block">Projected Slippage</span>
            <span className="text-sm font-bold text-rose-600">{project.projected_completion}</span>
            <span className="text-slate-500 text-[11px] block mt-0.5">Slip: +{project.predicted_delay_months} months</span>
          </div>

          <div>
            <span className="text-slate-400 uppercase text-[10px] block">Physical Progress vs Land</span>
            <div className="flex items-center justify-between text-[11px] font-medium mt-0.5">
              <span>Works: {project.progress}%</span>
              <span>Land Acq: {project.land_acquisition_progress}%</span>
            </div>
            <div className="w-full bg-slate-200 rounded-full h-1.5 mt-1.5">
              <div className="bg-emerald-500 h-1.5 rounded-full" style={{ width: `${project.progress}%` }}></div>
            </div>
          </div>
        </div>
      </div>

      {/* Tabs Navigation */}
      <div className="flex items-center space-x-2 border-b border-slate-200">
        <button
          onClick={() => setActiveTab('overview')}
          className={`px-4 py-2 text-xs font-bold border-b-2 transition-colors ${
            activeTab === 'overview'
              ? 'border-emerald-600 text-emerald-800'
              : 'border-transparent text-slate-500 hover:text-slate-800'
          }`}
        >
          Risk Explainability & Factors ({project.risk_factors.length})
        </button>

        <button
          onClick={() => setActiveTab('clearances')}
          className={`px-4 py-2 text-xs font-bold border-b-2 transition-colors ${
            activeTab === 'clearances'
              ? 'border-emerald-600 text-emerald-800'
              : 'border-transparent text-slate-500 hover:text-slate-800'
          }`}
        >
          PARIVESH Regulatory Clearances ({project.clearances?.length || 0})
        </button>

        <button
          onClick={() => setActiveTab('segments')}
          className={`px-4 py-2 text-xs font-bold border-b-2 transition-colors ${
            activeTab === 'segments'
              ? 'border-emerald-600 text-emerald-800'
              : 'border-transparent text-slate-500 hover:text-slate-800'
          }`}
        >
          Corridor Segments ({project.segments?.length || 0})
        </button>
      </div>

      {/* Tab 1: Overview & Explainable Risk Factors */}
      {activeTab === 'overview' && (
        <div className="space-y-6">
          {/* Explainable AI Narrative Card */}
          <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-2xs space-y-3">
            <div className="flex items-center space-x-2 text-slate-900 font-bold text-sm">
              <Sparkles className="w-4 h-4 text-emerald-600" />
              <h3>Why is this project at risk? (Transparent Model Diagnostic)</h3>
            </div>
            <p className="text-xs text-slate-700 leading-relaxed bg-slate-50 p-3.5 rounded-lg border border-slate-200">
              Based on official data feeds from <strong>{project.source_name}</strong> and <strong>PARIVESH 2.0</strong>, this corridor exhibits an InfraShield risk estimate of <strong>{project.overall_risk_score}/100 ({project.risk_level})</strong>.
              The primary bottlenecks generating schedule vulnerability are:
            </p>

            {/* Risk Factor Drivers Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5 pt-1">
              {project.risk_factors?.map(factor => (
                <div
                  key={factor.id}
                  className="p-4 rounded-xl border border-slate-200 bg-white hover:border-slate-300 transition-colors shadow-2xs flex flex-col justify-between"
                >
                  <div>
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-slate-900">{factor.name}</span>
                      <span className="text-xs font-mono font-bold px-2 py-0.5 rounded bg-rose-50 text-rose-700 border border-rose-200">
                        +{factor.contribution} pts contribution
                      </span>
                    </div>

                    <div className="flex items-center space-x-2 text-[11px] text-slate-500 mt-1">
                      <span>Weight: {Math.round((factor.weight || 0) * 100)}%</span>
                      <span>•</span>
                      <span>Factor Score: {factor.score}/100</span>
                      <span>•</span>
                      <span className={`font-semibold ${
                        factor.status === 'Critical' ? 'text-rose-600' : 'text-amber-600'
                      }`}>{factor.status}</span>
                    </div>

                    <p className="text-xs text-slate-700 mt-2 font-medium">{factor.reason}</p>

                    <div className="mt-2 text-[11px] bg-slate-50 p-2 rounded border border-slate-100 text-slate-600">
                      <span className="font-semibold text-slate-700 block">Supporting Evidence:</span>
                      {factor.supporting_data}
                    </div>
                  </div>

                  <div className="mt-3 pt-2 border-t border-slate-100 flex items-center justify-between text-[11px]">
                    <span className="text-slate-500 truncate max-w-[200px]">{factor.source_name}</span>
                    <button
                      onClick={() => onOpenProvenance(project, factor.name, `${factor.score}/100 (+${factor.contribution} pts)`)}
                      className="text-emerald-700 font-semibold hover:underline inline-flex items-center space-x-1"
                    >
                      <ShieldCheck className="w-3 h-3 text-emerald-600" />
                      <span>Audit Provenance</span>
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Recommended Administrative Interventions */}
          <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-2xs space-y-3">
            <div className="flex items-center space-x-2 text-slate-900 font-bold text-sm">
              <CheckCircle2 className="w-4 h-4 text-emerald-600" />
              <h3>Recommended Officer Interventions</h3>
            </div>
            <ul className="space-y-2">
              {project.recommended_actions?.map((act, idx) => (
                <li key={idx} className="text-xs text-slate-700 bg-slate-50 p-3 rounded-lg border border-slate-200 flex items-start space-x-2.5">
                  <span className="w-5 h-5 rounded-full bg-emerald-100 text-emerald-800 flex items-center justify-center font-bold text-[10px] shrink-0 mt-0.5">
                    {idx + 1}
                  </span>
                  <span className="leading-relaxed">{act}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      )}

      {/* Tab 2: Regulatory Clearances (PARIVESH) */}
      {activeTab === 'clearances' && (
        <div className="bg-white rounded-xl border border-slate-200 shadow-2xs overflow-hidden">
          <div className="p-4 border-b border-slate-200 bg-slate-50 flex items-center justify-between">
            <div>
              <h3 className="text-sm font-bold text-slate-900">MoEFCC PARIVESH 2.0 Clearance Tracking</h3>
              <p className="text-xs text-slate-500">Official statutory environmental, forest, and wildlife proposals</p>
            </div>
            <span className="text-xs font-mono text-slate-500">MoEFCC Gateway</span>
          </div>

          {project.clearances && project.clearances.length > 0 ? (
            <div className="divide-y divide-slate-100">
              {project.clearances.map(clr => (
                <div key={clr.id} className="p-4 hover:bg-slate-50 transition-colors space-y-2">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                    <div className="flex items-center space-x-2">
                      <span className="text-xs font-mono font-bold px-2 py-0.5 rounded bg-blue-50 text-blue-700 border border-blue-200">
                        {clr.proposal_number}
                      </span>
                      <span className="text-xs font-semibold text-slate-900">{clr.clearance_type}</span>
                    </div>

                    <span className={`text-xs font-bold px-2 py-0.5 rounded self-start sm:self-auto ${
                      clr.current_status.includes('Approved')
                        ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                        : 'bg-amber-50 text-amber-700 border border-amber-200'
                    }`}>
                      {clr.current_status}
                    </span>
                  </div>

                  <div className="text-xs text-slate-600 grid grid-cols-1 sm:grid-cols-3 gap-2 pt-1">
                    <div><strong>Current Stage:</strong> {clr.stage}</div>
                    <div><strong>Submitted:</strong> {clr.submission_date}</div>
                    <div><strong>Decision / Review:</strong> {clr.decision_date || 'Pending Deliberation'}</div>
                  </div>

                  {clr.notes && (
                    <div className="text-xs text-slate-600 bg-slate-50 p-2.5 rounded border border-slate-200">
                      <span className="font-semibold text-slate-700">Appraisal Note:</span> {clr.notes}
                    </div>
                  )}

                  <div className="pt-2 flex items-center justify-between text-[11px] text-slate-500">
                    <span>Source: PARIVESH 2.0 Official Single-Window Portal</span>
                    <a
                      href={clr.source_url}
                      target="_blank"
                      rel="noreferrer"
                      className="text-emerald-700 font-semibold hover:underline inline-flex items-center space-x-1"
                    >
                      <span>Inspect Portal Record</span>
                      <ExternalLink className="w-3 h-3 ml-0.5" />
                    </a>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="p-8 text-center text-xs text-slate-500">
              No regulatory environmental or forest clearance records pending for this project in PARIVESH.
            </div>
          )}
        </div>
      )}

      {/* Tab 3: Corridor Segments Breakdown */}
      {activeTab === 'segments' && (
        <div className="bg-white rounded-xl border border-slate-200 shadow-2xs overflow-hidden">
          <div className="p-4 border-b border-slate-200 bg-slate-50">
            <h3 className="text-sm font-bold text-slate-900">Project Segment Vulnerability</h3>
            <p className="text-xs text-slate-500">Chainage analysis and localized land handover status</p>
          </div>

          {project.segments && project.segments.length > 0 ? (
            <div className="divide-y divide-slate-100">
              {project.segments.map(seg => (
                <div key={seg.id} className="p-4 hover:bg-slate-50 transition-colors space-y-2">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                    <div>
                      <h4 className="text-xs font-bold text-slate-900">{seg.segment_name}</h4>
                      <span className="text-[11px] text-slate-500 font-mono">Chainage: Km {seg.chainage_km} ({seg.length_km} km)</span>
                    </div>

                    <span className={`text-xs font-bold px-2 py-0.5 rounded self-start sm:self-auto ${
                      seg.risk_level === 'Critical' ? 'bg-rose-100 text-rose-800' :
                      seg.risk_level === 'High' ? 'bg-orange-100 text-orange-800' : 'bg-amber-100 text-amber-800'
                    }`}>
                      {seg.risk_level} • {seg.risk_score}/100
                    </span>
                  </div>

                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 text-xs text-slate-600 pt-1">
                    <div><strong>Works Progress:</strong> {seg.progress}%</div>
                    <div><strong>Land Handed Over:</strong> {seg.land_acquisition_progress}%</div>
                    <div className="col-span-2 sm:col-span-1"><strong>Status:</strong> {seg.status}</div>
                  </div>

                  <div className="text-xs text-slate-600 bg-slate-50 p-2 rounded border border-slate-200">
                    <span className="font-semibold text-slate-700">Primary Bottleneck:</span> {seg.primary_bottleneck}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="p-8 text-center text-xs text-slate-500">
              Corridor is treated as a unified package with no separate sub-chainage splits registered.
            </div>
          )}
        </div>
      )}
    </div>
  );
};
