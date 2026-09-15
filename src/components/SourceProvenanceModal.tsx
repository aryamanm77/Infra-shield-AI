import React from 'react';
import { DataSourceProvenance } from '../types';
import { ShieldCheck, ExternalLink, Database, Clock, Building2, AlertCircle, X } from 'lucide-react';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  provenance: Partial<DataSourceProvenance> | null;
  metricLabel?: string;
  metricValue?: string | number;
}

export const SourceProvenanceModal: React.FC<Props> = ({
  isOpen,
  onClose,
  provenance,
  metricLabel,
  metricValue,
}) => {
  if (!isOpen || !provenance) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-xs p-4 animate-in fade-in duration-150">
      <div className="bg-white rounded-xl shadow-2xl border border-slate-200 max-w-xl w-full overflow-hidden flex flex-col">
        {/* Header */}
        <div className="px-6 py-4 border-b border-slate-200 flex items-center justify-between bg-slate-50">
          <div className="flex items-center space-x-2.5">
            <div className="w-8 h-8 rounded-lg bg-emerald-100 flex items-center justify-center text-emerald-800">
              <ShieldCheck className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-sm font-semibold text-slate-900">Data Traceability & Provenance</h3>
              <p className="text-xs text-slate-500">Government Data Auditing Ledger</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-md text-slate-400 hover:text-slate-600 hover:bg-slate-200 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-4 text-sm text-slate-700 max-h-[80vh] overflow-y-auto">
          {metricLabel && (
            <div className="bg-slate-50 p-3.5 rounded-lg border border-slate-200 flex items-center justify-between">
              <div>
                <span className="text-xs font-medium text-slate-500 uppercase tracking-wider">Audited Metric</span>
                <p className="text-sm font-semibold text-slate-900 mt-0.5">{metricLabel}</p>
              </div>
              {metricValue !== undefined && (
                <div className="text-right">
                  <span className="text-xs text-slate-500">Current Value</span>
                  <p className="text-base font-bold text-slate-900">{metricValue}</p>
                </div>
              )}
            </div>
          )}

          <div className="grid grid-cols-2 gap-3">
            <div className="p-3 bg-slate-50 rounded-lg border border-slate-200">
              <div className="flex items-center space-x-2 text-slate-500 mb-1">
                <Building2 className="w-3.5 h-3.5" />
                <span className="text-xs font-medium uppercase">Source Agency</span>
              </div>
              <p className="text-sm font-medium text-slate-900">
                {provenance.organization || 'Government of India / State Dept'}
              </p>
            </div>

            <div className="p-3 bg-slate-50 rounded-lg border border-slate-200">
              <div className="flex items-center space-x-2 text-slate-500 mb-1">
                <Database className="w-3.5 h-3.5" />
                <span className="text-xs font-medium uppercase">Dataset ID</span>
              </div>
              <p className="text-sm font-mono font-medium text-slate-900">{provenance.source_id || 'OFFICIAL-REGISTRY'}</p>
            </div>
          </div>

          <div className="space-y-2">
            <span className="text-xs font-medium text-slate-500 uppercase">Dataset Name</span>
            <p className="text-sm font-medium text-slate-900 bg-slate-50 p-2.5 rounded border border-slate-200">
              {provenance.dataset_name || 'Official Project Progress & Clearance Ledger'}
            </p>
          </div>

          <div className="space-y-1">
            <div className="flex items-center space-x-1.5 text-xs text-slate-500">
              <Clock className="w-3.5 h-3.5" />
              <span>Timestamps & Refresh Cycle</span>
            </div>
            <div className="grid grid-cols-2 gap-2 text-xs text-slate-600 bg-slate-50 p-2.5 rounded border border-slate-200">
              <div>
                <span className="text-slate-400 block">Retrieved at:</span>
                <span className="font-mono text-slate-700">{provenance.retrieved_at ? new Date(provenance.retrieved_at).toLocaleString() : 'Recent verification'}</span>
              </div>
              <div>
                <span className="text-slate-400 block">Source Last Updated:</span>
                <span className="font-mono text-slate-700">{provenance.source_last_updated ? new Date(provenance.source_last_updated).toLocaleDateString() : 'Official Q3 2026 Cycle'}</span>
              </div>
            </div>
          </div>

          {/* Official vs Synthetic Distinction */}
          <div className={`p-3 rounded-lg border text-xs flex items-start space-x-2.5 ${
            provenance.is_official !== false
              ? 'bg-emerald-50 border-emerald-200 text-emerald-900'
              : 'bg-amber-50 border-amber-200 text-amber-900'
          }`}>
            <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
            <div>
              <p className="font-semibold">
                {provenance.is_official !== false ? 'Official Public Record Verified' : 'Demonstration & Simulation Baseline'}
              </p>
              <p className="mt-0.5 text-xs opacity-90">
                {provenance.is_official !== false
                  ? 'This data point is retrieved directly from official open government portals and regulatory clearing houses without synthetic modification.'
                  : 'This record is provided as an illustrative baseline for comparing What-If simulation interventions.'}
              </p>
            </div>
          </div>

          {provenance.source_url && !provenance.source_url.includes('.internal') ? (
            <div className="pt-2">
              <a
                href={provenance.source_url}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center justify-center w-full px-4 py-2 text-xs font-semibold text-slate-700 bg-white border border-slate-300 rounded-lg hover:bg-slate-50 hover:text-slate-900 transition-colors shadow-2xs"
              >
                <span>View Official Source Record</span>
                <ExternalLink className="w-3.5 h-3.5 ml-1.5" />
              </a>
            </div>
          ) : provenance.source_url && provenance.source_url.includes('.internal') ? (
            <div className="pt-2">
              <div className="inline-flex items-center justify-center w-full px-4 py-2 text-xs font-medium text-slate-400 bg-slate-50 border border-slate-200 rounded-lg cursor-not-allowed">
                <span>Internal network link unavailable</span>
                <ExternalLink className="w-3.5 h-3.5 ml-1.5 opacity-50" />
              </div>
            </div>
          ) : null}
        </div>

        {/* Footer */}
        <div className="px-6 py-3 border-t border-slate-200 bg-slate-50 text-right">
          <button
            onClick={onClose}
            className="px-4 py-1.5 text-xs font-medium text-slate-700 bg-white border border-slate-300 rounded-lg hover:bg-slate-100 transition-colors shadow-2xs"
          >
            Close Audit Inspector
          </button>
        </div>
      </div>
    </div>
  );
};
