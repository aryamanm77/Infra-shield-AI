export type UserRole = 'Admin' | 'Officer' | 'Viewer';

export type RiskLevel = 'Low' | 'Medium' | 'High' | 'Critical';

export type DataSourceStatus =
  | 'Connected'
  | 'Updated'
  | 'Official Public Data'
  | 'Imported'
  | 'Needs Authorization'
  | 'Unavailable'
  | 'Error';

export type ProjectStage =
  | 'Planning'
  | 'Land Acquisition'
  | 'Approvals'
  | 'Construction'
  | 'Completion';

export interface DataSourceProvenance {
  source_id: string;
  dataset_name: string;
  organization: string;
  source_url: string;
  api_url?: string;
  data_type: string;
  geographic_coverage: string;
  retrieved_at: string;
  source_last_updated: string;
  record_count: number;
  connection_status: DataSourceStatus;
  authorization_required: boolean;
  error_message?: string;
  is_official: boolean;
}

export interface RiskFactor {
  id: string;
  factor_type: 'Legal' | 'Ownership' | 'Compensation' | 'Environmental' | 'Resettlement' | 'Historical';
  name: string;
  score: number; // 0-100
  weight: number; // e.g. 0.25
  contribution: number; // e.g. +21 points
  status: 'Critical' | 'Elevated' | 'Moderate' | 'Nominal' | 'Data Unavailable';
  reason: string;
  supporting_data: string;
  source_name: string;
  source_id: string;
  source_url: string;
  source_record_id?: string;
  is_official_data: boolean;
}

export interface ProjectSegment {
  id: string;
  project_id: string;
  segment_name: string;
  chainage_km: string;
  length_km: number;
  coordinates: [number, number][]; // [longitude, latitude] pairs
  progress: number;
  land_acquisition_progress: number;
  risk_level: RiskLevel;
  risk_score: number;
  primary_bottleneck: string;
  status: string;
  source_id: string;
}

export interface ClearanceRecord {
  id: string;
  project_id: string;
  proposal_number: string;
  clearance_type: 'Environment Clearance' | 'Forest Clearance' | 'Wildlife Clearance' | 'CRZ';
  project_category: string;
  state: string;
  district: string;
  submission_date: string;
  current_status: 'Under Process' | 'Stage-I Approved' | 'Stage-II In-Principle' | 'Approved with Conditions' | 'Deliberation Pending' | 'Information Sought';
  stage: string;
  decision_date?: string;
  source_id: string;
  source_url: string;
  last_updated: string;
  is_official_data: boolean;
  notes?: string;
}

export interface ProjectRecord {
  id: string;
  project_id: string;
  project_name: string;
  project_type: 'National Highway' | 'Expressway' | 'Railway Corridor' | 'Suburban Rail' | 'Metro Rail' | 'Urban Flyover';
  agency: string; // e.g. NHAI, MoRTH, South Western Railway, BMRCL, K-RIDE
  state: string;
  district: string;
  location: string;
  latitude: number;
  longitude: number;
  route_coordinates?: [number, number][]; // GeoJSON line string [lon, lat]
  project_cost_cr: number; // in INR Crores
  expenditure_to_date_cr: number;
  planned_start: string;
  planned_completion: string;
  projected_completion: string;
  current_stage: ProjectStage;
  progress: number; // 0 - 100%
  land_acquisition_progress: number; // 0 - 100%
  status: 'Active' | 'Delayed' | 'Critical Stagnation' | 'Ahead of Schedule';
  
  // Risk Model Outputs
  overall_risk_score: number; // 0 - 100
  risk_level: RiskLevel;
  predicted_delay_months: number;
  cost_exposure_cr: number;
  monthly_idle_rate_cr: number;
  model_version: string;
  risk_calculated_at: string;
  
  // Data Traceability
  is_official_data: boolean;
  data_source_label: 'Official Public Data' | 'Imported Official Data' | 'Demonstration Dataset';
  source_id: string;
  source_name: string;
  source_url: string;
  last_updated: string;
  
  // Child data
  risk_factors: RiskFactor[];
  segments?: ProjectSegment[];
  clearances?: ClearanceRecord[];
  recommended_actions: string[];
}

export interface AlertItem {
  id: string;
  project_id: string;
  project_name: string;
  severity: 'Critical' | 'High' | 'Medium';
  title: string;
  description: string;
  why_it_matters: string;
  recommended_action: string;
  timestamp: string;
  data_source: string;
  source_url: string;
  status: 'Open' | 'Under Review' | 'Resolved';
  assigned_to?: string;
  is_official_data: boolean;
}

export interface WhatIfAssumption {
  id: string;
  label: string;
  description: string;
  category: 'Legal' | 'Ownership' | 'Compensation' | 'Environmental' | 'Resettlement' | 'Alignment';
  active: boolean;
  impact_risk_reduction: number; // points reduced
  impact_delay_reduction_months: number;
}

export interface WhatIfScenarioResult {
  scenario_name: string;
  project_id: string;
  original_risk: number;
  simulated_risk: number;
  original_delay_months: number;
  simulated_delay_months: number;
  original_cost_exposure_cr: number;
  simulated_cost_exposure_cr: number;
  applied_assumptions: string[];
  calculated_at: string;
}

export interface HistoricalProject {
  id: string;
  project_id: string;
  project_name: string;
  project_type: string;
  state: string;
  district: string;
  agency: string;
  planned_duration_months: number;
  actual_duration_months: number;
  delay_months: number;
  planned_cost_cr: number;
  actual_cost_cr: number;
  cost_overrun_cr: number;
  cost_overrun_pct: number;
  primary_delay_reason: string;
  completion_year: number;
  source_id: string;
  is_official_data: boolean;
}

export interface DataImportSummary {
  id: string;
  source_id: string;
  filename: string;
  imported_at: string;
  rows_received: number;
  rows_imported: number;
  rows_rejected: number;
  rejection_reasons: { reason: string; count: number }[];
  status: 'Completed' | 'Completed with Warnings' | 'Failed';
}

export interface SystemHealthStatus {
  database: 'Operational' | 'Degraded' | 'Offline';
  parivesh_connector: 'Connected' | 'Update Unavailable' | 'Error';
  data_gov_connector: 'Connected' | 'Operational' | 'Rate Limited';
  karnataka_gis: 'Operational' | 'Needs Authorization';
  gemini_service: 'Operational' | 'Missing Key' | 'Error';
  map_service: 'Operational' | 'Degraded';
  last_successful_sync: string;
}
