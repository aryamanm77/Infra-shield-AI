import { ProjectRecord, RiskFactor, WhatIfScenarioResult, WhatIfAssumption } from '../src/types';
import { db } from './db';

export function calculateProjectRisk(project: ProjectRecord, customWeights?: {
  legal: number;
  ownership: number;
  compensation: number;
  environmental: number;
  resettlement: number;
  historical: number;
}) {
  const weights = customWeights || db.getRiskWeights();
  let weightedSum = 0;
  let totalWeight = 0;

  const factorsWithContributions = project.risk_factors.map(rf => {
    let weight = 0.15;
    if (rf.factor_type === 'Legal') weight = weights.legal;
    if (rf.factor_type === 'Ownership') weight = weights.ownership;
    if (rf.factor_type === 'Compensation') weight = weights.compensation;
    if (rf.factor_type === 'Environmental') weight = weights.environmental;
    if (rf.factor_type === 'Resettlement') weight = weights.resettlement;
    if (rf.factor_type === 'Historical') weight = weights.historical;

    const contribution = Math.round(rf.score * weight);
    weightedSum += contribution;
    totalWeight += weight;

    return {
      ...rf,
      weight,
      contribution
    };
  });

  const overall = totalWeight > 0 ? Math.round(weightedSum / totalWeight) : project.overall_risk_score;
  let level: 'Low' | 'Medium' | 'High' | 'Critical' = 'Low';
  if (overall >= 85) level = 'Critical';
  else if (overall >= 70) level = 'High';
  else if (overall >= 40) level = 'Medium';

  // Delay calculation transparent empirical formula:
  // Base delay: 0.08 months per risk point above 20
  const delayMonths = Math.max(0.4, Number(((overall - 18) * 0.08).toFixed(1)));
  const costExposureCr = Number((delayMonths * (project.monthly_idle_rate_cr || 12.0)).toFixed(1));

  return {
    overall_risk_score: overall,
    risk_level: level,
    predicted_delay_months: delayMonths,
    cost_exposure_cr: costExposureCr,
    risk_factors: factorsWithContributions,
    model_version: 'InfraShield-v1.4-TransparentWeighted'
  };
}

export function simulateWhatIf(
  projectId: string,
  selectedInterventions: {
    resolveOwnership?: boolean;
    completeCompensation?: boolean;
    approveEnvironmentalClearance?: boolean;
    accelerateResettlement?: boolean;
    optimizeAlignment?: boolean;
    dedicatedArbitrationDesk?: boolean;
  }
): WhatIfScenarioResult {
  const project = db.getProjectById(projectId);
  if (!project) {
    throw new Error(`Project ${projectId} not found in database.`);
  }

  let simulatedScore = project.overall_risk_score;
  const appliedAssumptions: string[] = [];

  if (selectedInterventions.resolveOwnership) {
    simulatedScore -= 22;
    appliedAssumptions.push('Resolve Title & Ownership Disputes (Section 3H arbitration resolved)');
  }
  if (selectedInterventions.completeCompensation) {
    simulatedScore -= 18;
    appliedAssumptions.push('Complete Compensation Escrow Disbursement (Undisputed tranche paid)');
  }
  if (selectedInterventions.approveEnvironmentalClearance) {
    simulatedScore -= 19;
    appliedAssumptions.push('Stage-II Forest / Wildlife Clearance Granted with Compliance Verification');
  }
  if (selectedInterventions.accelerateResettlement) {
    simulatedScore -= 12;
    appliedAssumptions.push('Accelerate Resettlement & Commercial Siding Rehabilitation');
  }
  if (selectedInterventions.optimizeAlignment) {
    simulatedScore -= 15;
    appliedAssumptions.push('Alignment Micro-Optimization bypassing contested forest parcels');
  }
  if (selectedInterventions.dedicatedArbitrationDesk) {
    simulatedScore -= 8;
    appliedAssumptions.push('Establish Fast-Track Revenue Arbitration Desk with District Collector');
  }

  simulatedScore = Math.max(15, Math.min(100, Math.round(simulatedScore)));

  const simulatedDelay = Math.max(0.5, Number(((simulatedScore - 18) * 0.08).toFixed(1)));
  const simulatedCostExposure = Number((simulatedDelay * (project.monthly_idle_rate_cr || 12.0)).toFixed(1));

  return {
    scenario_name: appliedAssumptions.length > 0 ? appliedAssumptions.join(' + ') : 'Baseline (No Interventions)',
    project_id: project.project_id,
    original_risk: project.overall_risk_score,
    simulated_risk: simulatedScore,
    original_delay_months: project.predicted_delay_months,
    simulated_delay_months: simulatedDelay,
    original_cost_exposure_cr: project.cost_exposure_cr,
    simulated_cost_exposure_cr: simulatedCostExposure,
    applied_assumptions: appliedAssumptions,
    calculated_at: new Date().toISOString(),
  };
}

export function generateRiskExplanation(project: ProjectRecord): {
  headline: string;
  summary: string;
  topDrivers: { factor: string; score: number; contribution: number; source: string }[];
  clearanceContext?: string;
  provenance: string;
} {
  const topDrivers = [...project.risk_factors]
    .sort((a, b) => b.contribution - a.contribution)
    .slice(0, 3)
    .map(rf => ({
      factor: rf.name,
      score: rf.score,
      contribution: rf.contribution,
      source: rf.source_name
    }));

  const driverNames = topDrivers.map(d => d.factor.toLowerCase()).join(', ');
  const headline = `Risk is elevated primarily due to ${driverNames}.`;

  const summary = `Based on verified project records from ${project.source_name}, this project exhibits an InfraShield model estimate score of ${project.overall_risk_score}/100. The principal delay drivers are ${topDrivers[0]?.factor} (+${topDrivers[0]?.contribution} pts) and ${topDrivers[1]?.factor} (+${topDrivers[1]?.contribution} pts). Outstanding statutory or legal prerequisites currently indicate a projected schedule slippage of ~${project.predicted_delay_months} months if unaddressed.`;

  return {
    headline,
    summary,
    topDrivers,
    clearanceContext: project.clearances && project.clearances.length > 0
      ? `${project.clearances.length} official regulatory clearance proposals linked in PARIVESH 2.0.`
      : 'No critical environmental clearances pending in PARIVESH.',
    provenance: project.source_name,
  };
}
