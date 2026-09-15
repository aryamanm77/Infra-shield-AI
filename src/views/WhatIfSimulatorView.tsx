import React, { useState, useEffect } from 'react';
import { ProjectRecord, WhatIfScenarioResult } from '../types';
import { Sliders, CheckCircle2, ArrowRight, AlertTriangle, ShieldCheck, Activity, RefreshCw } from 'lucide-react';

interface Props {
  projects: ProjectRecord[];
  onSelectProject: (projectId: string) => void;
}

export const WhatIfSimulatorView: React.FC<Props> = ({ projects, onSelectProject }) => {
  const [selectedProjectId, setSelectedProjectId] = useState<string>('');
  const [isSimulating, setIsSimulating] = useState(false);
  const [simulationResult, setSimulationResult] = useState<WhatIfScenarioResult | null>(null);

  // Intervention toggles
  const [toggles, setToggles] = useState({
    resolveOwnership: false,
    completeCompensation: false,
    approveEnvironmentalClearance: false,
    accelerateResettlement: false,
    optimizeAlignment: false,
    dedicatedArbitrationDesk: false,
  });

  const selectedProject = projects.find(p => p.project_id === selectedProjectId);

  useEffect(() => {
    // Reset simulation when project changes
    setSimulationResult(null);
    setToggles({
      resolveOwnership: false,
      completeCompensation: false,
      approveEnvironmentalClearance: false,
      accelerateResettlement: false,
      optimizeAlignment: false,
      dedicatedArbitrationDesk: false,
    });
  }, [selectedProjectId]);

  const handleToggle = (key: keyof typeof toggles) => {
    setToggles(prev => ({ ...prev, [key]: !prev[key] }));
  };

  const runSimulation = async () => {
    if (!selectedProjectId) return;
    setIsSimulating(true);

    try {
      const res = await fetch(`/api/projects/${selectedProjectId}/simulate`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(toggles),
      });
      if (res.ok) {
        const data = await res.json();
        setSimulationResult(data);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setIsSimulating(false);
    }
  };

  return (
    <div className="space-y-6 pb-12">
      {/* Header */}
      <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-2xs">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
              <Sliders className="w-5 h-5 text-emerald-600" />
              What-If Intervention Simulator
            </h2>
            <p className="text-xs text-slate-500 mt-1">
              Test administrative interventions and observe recalculated InfraShield risk projections and cost exposure compression.
            </p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column: Project Selection & Interventions */}
        <div className="lg:col-span-1 space-y-4">
          <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-2xs">
            <label className="block text-xs font-semibold text-slate-700 mb-2">Select Target Project</label>
            <select
              value={selectedProjectId}
              onChange={(e) => setSelectedProjectId(e.target.value)}
              className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-300 rounded-lg focus:outline-hidden focus:ring-2 focus:ring-emerald-500"
            >
              <option value="">-- Choose a high-risk project --</option>
              {projects.filter(p => p.overall_risk_score >= 40).map(p => (
                <option key={p.id} value={p.project_id}>
                  {p.project_id} - {p.project_name.substring(0, 40)}...
                </option>
              ))}
            </select>

            {selectedProject && (
              <div className="mt-4 p-3 bg-slate-50 rounded-lg border border-slate-200 text-xs">
                <div className="flex justify-between mb-1">
                  <span className="text-slate-500">Current Risk:</span>
                  <span className="font-bold text-rose-600">{selectedProject.overall_risk_score}/100</span>
                </div>
                <div className="flex justify-between mb-1">
                  <span className="text-slate-500">Predicted Delay:</span>
                  <span className="font-bold text-slate-900">+{selectedProject.predicted_delay_months} mos</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Cost Exposure:</span>
                  <span className="font-bold text-slate-900">₹{selectedProject.cost_exposure_cr} Cr</span>
                </div>
              </div>
            )}
          </div>

          <div className={`bg-white p-4 rounded-xl border border-slate-200 shadow-2xs transition-opacity ${!selectedProject ? 'opacity-50 pointer-events-none' : ''}`}>
            <h3 className="text-sm font-bold text-slate-900 mb-3">Policy Interventions</h3>
            <div className="space-y-2">
              <label className="flex items-start space-x-3 p-3 rounded-lg border border-slate-200 hover:bg-slate-50 cursor-pointer transition-colors">
                <input
                  type="checkbox"
                  checked={toggles.resolveOwnership}
                  onChange={() => handleToggle('resolveOwnership')}
                  className="mt-0.5 rounded text-emerald-600 focus:ring-emerald-500"
                />
                <div className="text-xs">
                  <span className="font-semibold text-slate-900 block">Resolve Title Disputes</span>
                  <span className="text-slate-500">Fast-track Section 3H arbitration backlog</span>
                </div>
              </label>

              <label className="flex items-start space-x-3 p-3 rounded-lg border border-slate-200 hover:bg-slate-50 cursor-pointer transition-colors">
                <input
                  type="checkbox"
                  checked={toggles.approveEnvironmentalClearance}
                  onChange={() => handleToggle('approveEnvironmentalClearance')}
                  className="mt-0.5 rounded text-emerald-600 focus:ring-emerald-500"
                />
                <div className="text-xs">
                  <span className="font-semibold text-slate-900 block">Expedite MoEFCC Clearance</span>
                  <span className="text-slate-500">Push PARIVESH proposals to Stage-II Final</span>
                </div>
              </label>

              <label className="flex items-start space-x-3 p-3 rounded-lg border border-slate-200 hover:bg-slate-50 cursor-pointer transition-colors">
                <input
                  type="checkbox"
                  checked={toggles.dedicatedArbitrationDesk}
                  onChange={() => handleToggle('dedicatedArbitrationDesk')}
                  className="mt-0.5 rounded text-emerald-600 focus:ring-emerald-500"
                />
                <div className="text-xs">
                  <span className="font-semibold text-slate-900 block">Dedicated DC Arbitration Desk</span>
                  <span className="text-slate-500">Establish local revenue cell for land claims</span>
                </div>
              </label>

              <label className="flex items-start space-x-3 p-3 rounded-lg border border-slate-200 hover:bg-slate-50 cursor-pointer transition-colors">
                <input
                  type="checkbox"
                  checked={toggles.optimizeAlignment}
                  onChange={() => handleToggle('optimizeAlignment')}
                  className="mt-0.5 rounded text-emerald-600 focus:ring-emerald-500"
                />
                <div className="text-xs">
                  <span className="font-semibold text-slate-900 block">Corridor Alignment Optimization</span>
                  <span className="text-slate-500">Bypass contested ecological boundaries</span>
                </div>
              </label>
            </div>

            <button
              onClick={runSimulation}
              disabled={!selectedProjectId || isSimulating || !Object.values(toggles).some(Boolean)}
              className="w-full mt-4 py-2 bg-emerald-600 text-white text-xs font-semibold rounded-lg hover:bg-emerald-700 disabled:opacity-50 transition-colors flex justify-center items-center gap-2"
            >
              {isSimulating ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Activity className="w-4 h-4" />}
              <span>Execute Recalculation</span>
            </button>
          </div>
        </div>

        {/* Right Column: Results */}
        <div className="lg:col-span-2">
          {simulationResult ? (
            <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-2xs space-y-6 animate-in fade-in duration-300">
              <div className="flex items-center justify-between border-b border-slate-100 pb-4">
                <div>
                  <h3 className="text-sm font-bold text-slate-900">Simulation Complete</h3>
                  <p className="text-xs text-slate-500">InfraShield Model Recalculation Engine v1.4</p>
                </div>
                <ShieldCheck className="w-6 h-6 text-emerald-500" />
              </div>

              {/* Metrics Comparison */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 relative overflow-hidden">
                  <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block mb-2">Overall Risk Score</span>
                  <div className="flex items-end space-x-3">
                    <span className="text-xl font-bold text-slate-400 line-through">{simulationResult.original_risk}</span>
                    <ArrowRight className="w-4 h-4 text-slate-300 mb-1" />
                    <span className="text-3xl font-black text-emerald-600">{simulationResult.simulated_risk}</span>
                  </div>
                  <div className="mt-1 text-[11px] text-emerald-700 font-semibold bg-emerald-100 px-2 py-0.5 rounded-full inline-block">
                    -{(simulationResult.original_risk - simulationResult.simulated_risk).toFixed(0)} points
                  </div>
                </div>

                <div className="p-4 bg-slate-50 rounded-xl border border-slate-200">
                  <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block mb-2">Projected Delay</span>
                  <div className="flex items-end space-x-3">
                    <span className="text-xl font-bold text-slate-400 line-through">{simulationResult.original_delay_months}m</span>
                    <ArrowRight className="w-4 h-4 text-slate-300 mb-1" />
                    <span className="text-3xl font-black text-blue-600">{simulationResult.simulated_delay_months}m</span>
                  </div>
                  <div className="mt-1 text-[11px] text-blue-700 font-semibold bg-blue-100 px-2 py-0.5 rounded-full inline-block">
                    Saved {(simulationResult.original_delay_months - simulationResult.simulated_delay_months).toFixed(1)} months
                  </div>
                </div>

                <div className="p-4 bg-slate-50 rounded-xl border border-slate-200">
                  <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block mb-2">Cost Exposure</span>
                  <div className="flex items-end space-x-3">
                    <span className="text-xl font-bold text-slate-400 line-through">₹{simulationResult.original_cost_exposure_cr}</span>
                    <ArrowRight className="w-4 h-4 text-slate-300 mb-1" />
                    <span className="text-3xl font-black text-indigo-600">₹{simulationResult.simulated_cost_exposure_cr}</span>
                  </div>
                  <div className="mt-1 text-[11px] text-indigo-700 font-semibold bg-indigo-100 px-2 py-0.5 rounded-full inline-block">
                    Reduced by ₹{(simulationResult.original_cost_exposure_cr - simulationResult.simulated_cost_exposure_cr).toFixed(1)} Cr
                  </div>
                </div>
              </div>

              {/* Applied Interventions List */}
              <div>
                <h4 className="text-xs font-bold text-slate-900 mb-2">Applied Interventions</h4>
                <ul className="space-y-2">
                  {simulationResult.applied_assumptions.map((assumption, idx) => (
                    <li key={idx} className="flex items-start space-x-2 text-xs text-slate-700 bg-white p-2 rounded border border-slate-100">
                      <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
                      <span>{assumption}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          ) : (
            <div className="h-full min-h-[400px] bg-slate-50 rounded-xl border border-slate-200 border-dashed flex flex-col items-center justify-center text-center p-6">
              <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center shadow-2xs mb-3">
                <Sliders className="w-6 h-6 text-slate-300" />
              </div>
              <h3 className="text-sm font-bold text-slate-700">No Simulation Active</h3>
              <p className="text-xs text-slate-500 max-w-sm mt-1">
                Select a high-risk project and toggle policy interventions to model risk reduction and cost savings.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
