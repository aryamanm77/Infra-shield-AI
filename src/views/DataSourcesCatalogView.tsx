import React from 'react';
import { DataSourceProvenance } from '../types';
import { Database, Link2, ShieldCheck, RefreshCw, AlertCircle, CheckCircle2 } from 'lucide-react';

interface Props {
  dataSources: DataSourceProvenance[];
  onTestConnection: (id: string) => void;
  onSync: (id: string) => void;
  syncingId: string | null;
}

export const DataSourcesCatalogView: React.FC<Props> = ({ dataSources, onTestConnection, onSync, syncingId }) => {
  return (
    <div className="space-y-6 pb-12">
      <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-2xs">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 bg-indigo-50 text-indigo-600 rounded-lg flex items-center justify-center">
            <Database className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-base font-bold text-slate-900">Data Connectivity Catalog</h2>
            <p className="text-xs text-slate-500">Live API integrations with state and national infrastructure ledgers</p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {dataSources.map(ds => (
          <div key={ds.source_id} className="bg-white rounded-xl border border-slate-200 shadow-2xs overflow-hidden flex flex-col">
            <div className="p-4 border-b border-slate-100 bg-slate-50 flex justify-between items-start">
              <div>
                <h3 className="text-sm font-bold text-slate-900">{ds.dataset_name}</h3>
                <p className="text-xs text-slate-500 font-medium">{ds.organization}</p>
              </div>
              {ds.is_official && (
                <ShieldCheck className="w-5 h-5 text-emerald-500 shrink-0" title="Official Government Source" />
              )}
            </div>

            <div className="p-4 flex-1 space-y-4 text-xs text-slate-600">
              <div className="grid grid-cols-2 gap-2 bg-slate-50 p-2.5 rounded border border-slate-100">
                <div>
                  <span className="text-slate-400 block text-[10px] uppercase">Status</span>
                  <div className="flex items-center space-x-1 mt-0.5">
                    {ds.connection_status === 'Connected' || ds.connection_status === 'Official Public Data' || ds.connection_status === 'Imported' ? (
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" />
                    ) : (
                      <AlertCircle className="w-3.5 h-3.5 text-amber-500" />
                    )}
                    <span className="font-semibold text-slate-800">{ds.connection_status}</span>
                  </div>
                </div>
                <div>
                  <span className="text-slate-400 block text-[10px] uppercase">Records Cached</span>
                  <span className="font-mono font-medium text-slate-800 block mt-0.5">{ds.record_count.toLocaleString()}</span>
                </div>
              </div>

              <div>
                <strong className="block text-slate-700 mb-0.5">Data Payload Type:</strong>
                <p>{ds.data_type}</p>
              </div>

              <div>
                <strong className="block text-slate-700 mb-0.5">Coverage:</strong>
                <p>{ds.geographic_coverage}</p>
              </div>

              {ds.error_message && (
                <div className="bg-rose-50 border border-rose-200 p-2.5 rounded text-rose-800 text-[11px] font-medium flex items-start space-x-2">
                  <AlertCircle className="w-3.5 h-3.5 shrink-0 mt-0.5" />
                  <p>{ds.error_message}</p>
                </div>
              )}

              <div className="text-[10px] text-slate-400 flex items-center justify-between pt-2 border-t border-slate-100">
                <span>Last Updated: {new Date(ds.source_last_updated).toLocaleString()}</span>
                <span>Retrieved: {new Date(ds.retrieved_at).toLocaleDateString()}</span>
              </div>
            </div>

            <div className="px-4 py-3 bg-slate-50 border-t border-slate-100 flex items-center justify-between gap-2">
              {ds.source_url && !ds.source_url.includes('.internal') ? (
                <a 
                  href={ds.source_url}
                  target="_blank"
                  rel="noreferrer"
                  className="text-xs font-semibold text-blue-600 hover:underline flex items-center space-x-1"
                >
                  <Link2 className="w-3.5 h-3.5" />
                  <span>Source Portal</span>
                </a>
              ) : (
                <div className="text-xs font-medium text-slate-400 flex items-center space-x-1 cursor-not-allowed" title="Internal or simulated data source cannot be opened.">
                  <Link2 className="w-3.5 h-3.5 opacity-50" />
                  <span>Internal Network</span>
                </div>
              )}

              <div className="flex space-x-2">
                <button
                  onClick={() => onTestConnection(ds.source_id)}
                  className="px-3 py-1.5 text-xs font-semibold text-slate-700 bg-white border border-slate-300 rounded-lg hover:bg-slate-100 transition-colors shadow-2xs"
                >
                  Test Connection
                </button>
                <button
                  onClick={() => onSync(ds.source_id)}
                  disabled={syncingId === ds.source_id || ds.authorization_required}
                  className="px-3 py-1.5 text-xs font-semibold text-white bg-indigo-600 rounded-lg hover:bg-indigo-700 transition-colors shadow-2xs disabled:opacity-50 flex items-center space-x-1.5"
                >
                  {syncingId === ds.source_id ? (
                    <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                  ) : (
                    <RefreshCw className="w-3.5 h-3.5" />
                  )}
                  <span>Sync Now</span>
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
