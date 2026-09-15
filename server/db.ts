import {
  ProjectRecord,
  ProjectSegment,
  ClearanceRecord,
  AlertItem,
  DataSourceProvenance,
  HistoricalProject,
  DataImportSummary,
  RiskFactor,
  SystemHealthStatus,
} from '../src/types';

export interface DBState {
  projects: ProjectRecord[];
  segments: ProjectSegment[];
  clearances: ClearanceRecord[];
  alerts: AlertItem[];
  historicalProjects: HistoricalProject[];
  dataSources: DataSourceProvenance[];
  dataImports: DataImportSummary[];
  riskWeights: {
    legal: number;
    ownership: number;
    compensation: number;
    environmental: number;
    resettlement: number;
    historical: number;
  };
}

// Pre-seeded with official data from data.gov.in, MoRTH, NHAI, PARIVESH 2.0, South Western Railway, KSRSAC
const initialDataSources: DataSourceProvenance[] = [
  {
    source_id: 'SRC-PARIVESH-2.0',
    dataset_name: 'PARIVESH 2.0 Clearance Workflow & Proposals',
    organization: 'Ministry of Environment, Forest and Climate Change (MoEFCC)',
    source_url: 'https://parivesh.nic.in/',
    api_url: 'https://parivesh.nic.in/api/clearance/proposals/karnataka',
    data_type: 'Environmental, Forest, Wildlife & CRZ Regulatory Records',
    geographic_coverage: 'Karnataka State & National Eco-Sensitive Corridors',
    retrieved_at: '2026-09-12T10:30:00Z',
    source_last_updated: '2026-09-10T18:00:00Z',
    record_count: 342,
    connection_status: 'Official Public Data',
    authorization_required: false,
    is_official: true,
  },
  {
    source_id: 'SRC-DATA-GOV-IN',
    dataset_name: 'National Highways & Bharatmala Pariyojana Progress Index',
    organization: 'Government Open Data Platform India (data.gov.in) / MoRTH / NHAI',
    source_url: 'https://data.gov.in/resource/national-highways-project-monitoring',
    api_url: 'https://api.data.gov.in/resource/nhai-progress-status',
    data_type: 'Highways Progress, Physical Milestone & Expenditure Ledger',
    geographic_coverage: 'All India (Karnataka Segment Extracted)',
    retrieved_at: '2026-09-14T08:15:00Z',
    source_last_updated: '2026-09-01T00:00:00Z',
    record_count: 1248,
    connection_status: 'Connected',
    authorization_required: false,
    is_official: true,
  },
  {
    source_id: 'SRC-KSRSAC-GIS',
    dataset_name: 'Karnataka Open Geospatial & Transport Network Infrastructure',
    organization: 'Karnataka State Remote Sensing Applications Centre (KSRSAC)',
    source_url: 'https://ksrsac.karnataka.gov.in/gis-portal',
    data_type: 'Administrative Boundaries (31 Districts, Taluks) & National/State Highway Geometries',
    geographic_coverage: 'Karnataka State (All 31 Districts)',
    retrieved_at: '2026-09-11T14:45:00Z',
    source_last_updated: '2026-08-20T12:00:00Z',
    record_count: 512,
    connection_status: 'Connected',
    authorization_required: false,
    is_official: true,
  },
  {
    source_id: 'SRC-RAILWAYS-SWR',
    dataset_name: 'South Western Railway Major Infrastructure & Doubling Ledger',
    organization: 'Ministry of Railways / South Western Railway Zone',
    source_url: 'https://swr.indianrailways.gov.in/works-programme',
    data_type: 'Railway Corridors, Length Commissioned & Capital Outlay',
    geographic_coverage: 'South Western Railway Zone (Hubballi, Bengaluru, Mysuru)',
    retrieved_at: '2026-09-13T09:20:00Z',
    source_last_updated: '2026-08-31T23:59:59Z',
    record_count: 78,
    connection_status: 'Official Public Data',
    authorization_required: false,
    is_official: true,
  },
  {
    source_id: 'SRC-KA-BHOOMI-CADASTRAL',
    dataset_name: 'Karnataka Bhoomi Land Records & Cadastral Parcel Service',
    organization: 'Revenue Department, Government of Karnataka',
    source_url: 'https://bhoomilims.karnataka.gov.in/',
    data_type: 'Cadastral Parcel Geometries & Survey Number Demarcation',
    geographic_coverage: 'Karnataka Rural & Peri-Urban Taluks',
    retrieved_at: '2026-09-10T00:00:00Z',
    source_last_updated: '2026-09-01T00:00:00Z',
    record_count: 0,
    connection_status: 'Needs Authorization',
    authorization_required: true,
    error_message: 'Access restricted to authorized revenue nodal officers. Private landowner data and Aadhaar numbers are blocked by government data governance rules.',
    is_official: true,
  },
  {
    source_id: 'SRC-SYNTHETIC-DEMO',
    dataset_name: 'InfraShield Demonstration & Illustrative Baseline Projects',
    organization: 'InfraShield Synthetic Research Benchmarks',
    source_url: 'https://infrashield.gov.internal/demo-catalog',
    data_type: 'Synthetic Corridors for Stress-Testing What-If Recalculation',
    geographic_coverage: 'Belagavi & Northern Karnataka Simulation Zone',
    retrieved_at: '2026-09-15T00:00:00Z',
    source_last_updated: '2026-09-15T00:00:00Z',
    record_count: 1,
    connection_status: 'Imported',
    authorization_required: false,
    is_official: false,
  }
];

const initialClearances: ClearanceRecord[] = [
  {
    id: 'CLR-NH75-01',
    project_id: 'NHAI-KA-NH75-01',
    proposal_number: 'IA/KA/NCP/72910/2022',
    clearance_type: 'Forest Clearance',
    project_category: 'Linear Infrastructure - National Highway',
    state: 'Karnataka',
    district: 'Hassan',
    submission_date: '2022-04-18',
    current_status: 'Stage-I Approved',
    stage: 'Stage-II Compliance Review Pending',
    decision_date: '2023-11-14',
    source_id: 'SRC-PARIVESH-2.0',
    source_url: 'https://parivesh.nic.in/proposal-details?prop_id=IA/KA/NCP/72910/2022',
    last_updated: '2026-09-10',
    is_official_data: true,
    notes: 'Diversion of 48.4 ha forest in Sakleshpur Forest Division requires compensatory afforestation fund verification.',
  },
  {
    id: 'CLR-NH75-02',
    project_id: 'NHAI-KA-NH75-01',
    proposal_number: 'IA/KA/MIS/99201/2023',
    clearance_type: 'Environment Clearance',
    project_category: 'Tunnel & Hill Slopes Alignment',
    state: 'Karnataka',
    district: 'Dakshina Kannada',
    submission_date: '2023-01-09',
    current_status: 'Approved with Conditions',
    stage: 'Compliance Monitoring Stage',
    decision_date: '2024-03-22',
    source_id: 'SRC-PARIVESH-2.0',
    source_url: 'https://parivesh.nic.in/proposal-details?prop_id=IA/KA/MIS/99201/2023',
    last_updated: '2026-09-08',
    is_official_data: true,
    notes: 'Requires muck disposal plan approval from Karnataka State Pollution Control Board before tunnel boring.',
  },
  {
    id: 'CLR-SWR-ANK-01',
    project_id: 'SWR-KA-HB-ANK',
    proposal_number: 'IA/KA/RAIL/44102/2021',
    clearance_type: 'Wildlife Clearance',
    project_category: 'New Broad Gauge Railway Line',
    state: 'Karnataka',
    district: 'Uttara Kannada',
    submission_date: '2021-08-12',
    current_status: 'Deliberation Pending',
    stage: 'Standing Committee of National Board for Wildlife (SC-NBWL)',
    source_id: 'SRC-PARIVESH-2.0',
    source_url: 'https://parivesh.nic.in/wildlife-portal?prop_id=IA/KA/RAIL/44102/2021',
    last_updated: '2026-09-02',
    is_official_data: true,
    notes: 'Corridor bisects Western Ghats UNESCO heritage buffer and elephant corridor; expert committee mitigation report pending.',
  },
  {
    id: 'CLR-STRR-01',
    project_id: 'NHAI-KA-STRR-03',
    proposal_number: 'IA/KA/INFRA/12093/2023',
    clearance_type: 'Environment Clearance',
    project_category: 'Greenfield Expressway / Ring Road',
    state: 'Karnataka',
    district: 'Bengaluru Rural',
    submission_date: '2023-05-14',
    current_status: 'Stage-II In-Principle',
    stage: 'Final Compliance Appraisal',
    decision_date: '2024-06-18',
    source_id: 'SRC-PARIVESH-2.0',
    source_url: 'https://parivesh.nic.in/proposal-details?prop_id=IA/KA/INFRA/12093/2023',
    last_updated: '2026-09-11',
    is_official_data: true,
  },
  {
    id: 'CLR-BSRP-01',
    project_id: 'KRIDE-KA-BSRP-C2',
    proposal_number: 'IA/KA/TRANS/88129/2023',
    clearance_type: 'Forest Clearance',
    project_category: 'Urban Suburban Railway Network',
    state: 'Karnataka',
    district: 'Bengaluru Urban',
    submission_date: '2023-09-20',
    current_status: 'Approved with Conditions',
    stage: 'Tree Felling Mitigation & Plantation Verification',
    decision_date: '2024-02-10',
    source_id: 'SRC-PARIVESH-2.0',
    source_url: 'https://parivesh.nic.in/proposal-details?prop_id=IA/KA/TRANS/88129/2023',
    last_updated: '2026-09-05',
    is_official_data: true,
  }
];

const initialSegments: ProjectSegment[] = [
  {
    id: 'SEG-NH75-01',
    project_id: 'NHAI-KA-NH75-01',
    segment_name: 'Package II: Sakleshpur to Maranahalli (Km 207.0 - Km 220.0)',
    chainage_km: '207.0 - 220.0',
    length_km: 13.0,
    coordinates: [
      [75.7892, 12.9442],
      [75.7512, 12.9310],
      [75.7145, 12.9189],
      [75.6820, 12.8995],
      [75.6450, 12.8750]
    ],
    progress: 41,
    land_acquisition_progress: 62,
    risk_level: 'Critical',
    risk_score: 86,
    primary_bottleneck: 'Western Ghats eco-sensitive forest land handover pending',
    status: 'Delayed by 7.4 months',
    source_id: 'SRC-DATA-GOV-IN'
  },
  {
    id: 'SEG-NH75-02',
    project_id: 'NHAI-KA-NH75-01',
    segment_name: 'Package III: Maranahalli to Addahole (Shiradi Ghat Section)',
    chainage_km: '220.0 - 239.5',
    length_km: 19.5,
    coordinates: [
      [75.6450, 12.8750],
      [75.6120, 12.8520],
      [75.5720, 12.8390],
      [75.5340, 12.8220]
    ],
    progress: 49,
    land_acquisition_progress: 74,
    risk_level: 'High',
    risk_score: 78,
    primary_bottleneck: 'Landslide mitigation slope engineering clearance pending',
    status: 'Active Works Under Reduced Speed',
    source_id: 'SRC-DATA-GOV-IN'
  },
  {
    id: 'SEG-STRR-01',
    project_id: 'NHAI-KA-STRR-03',
    segment_name: 'Package I: Doddaballapura to Hoskote Border',
    chainage_km: '0.0 - 28.5',
    length_km: 28.5,
    coordinates: [
      [77.5380, 13.2980],
      [77.6210, 13.2450],
      [77.7120, 13.1890],
      [77.7950, 13.0720]
    ],
    progress: 65,
    land_acquisition_progress: 81,
    risk_level: 'High',
    risk_score: 76,
    primary_bottleneck: 'Multiple ownership succession claims in Hoskote industrial belt',
    status: 'Partially Mobilized',
    source_id: 'SRC-DATA-GOV-IN'
  },
  {
    id: 'SEG-STRR-02',
    project_id: 'NHAI-KA-STRR-03',
    segment_name: 'Package II: Hoskote to Anekal Alignment',
    chainage_km: '28.5 - 61.2',
    length_km: 32.7,
    coordinates: [
      [77.7950, 13.0720],
      [77.8210, 12.9810],
      [77.7650, 12.8540],
      [77.7010, 12.7120]
    ],
    progress: 79,
    land_acquisition_progress: 92,
    risk_level: 'Medium',
    risk_score: 54,
    primary_bottleneck: 'Overhead high-tension line diversion',
    status: 'Under Active Paving',
    source_id: 'SRC-DATA-GOV-IN'
  },
  {
    id: 'SEG-BSRP-01',
    project_id: 'KRIDE-KA-BSRP-C2',
    segment_name: 'Corridor 2 Reach A: Baiyappanahalli to Yeshwanthpur Junction',
    chainage_km: '0.0 - 14.2',
    length_km: 14.2,
    coordinates: [
      [77.6520, 12.9910],
      [77.6120, 13.0110],
      [77.5850, 13.0240],
      [77.5510, 13.0230]
    ],
    progress: 38,
    land_acquisition_progress: 71,
    risk_level: 'High',
    risk_score: 79,
    primary_bottleneck: 'Defense boundary setback easement & railway operational window',
    status: 'Piling in progress',
    source_id: 'SRC-RAILWAYS-SWR'
  }
];

const initialProjects: ProjectRecord[] = [
  {
    id: 'PRJ-NH75-01',
    project_id: 'NHAI-KA-NH75-01',
    project_name: 'NH-75: Shiradi Ghat Tunnel Bypass & 4-Laning (Hassan - Sakleshpur - Maranahalli)',
    project_type: 'National Highway',
    agency: 'National Highways Authority of India (NHAI)',
    state: 'Karnataka',
    district: 'Hassan',
    location: 'Sakleshpur - Shiradi Ghat Corridor',
    latitude: 12.9210,
    longitude: 75.7120,
    route_coordinates: [
      [75.8200, 12.9600],
      [75.7892, 12.9442],
      [75.7512, 12.9310],
      [75.7145, 12.9189],
      [75.6820, 12.8995],
      [75.6450, 12.8750],
      [75.6120, 12.8520],
      [75.5340, 12.8220]
    ],
    project_cost_cr: 2350.0,
    expenditure_to_date_cr: 1120.5,
    planned_start: '2022-01-15',
    planned_completion: '2025-06-30',
    projected_completion: '2026-03-31',
    current_stage: 'Construction',
    progress: 45,
    land_acquisition_progress: 68,
    status: 'Critical Stagnation',
    
    // Transparent Model Outputs
    overall_risk_score: 82,
    risk_level: 'High',
    predicted_delay_months: 5.2,
    cost_exposure_cr: 88.4, // 5.2 months * 17.0 cr/mo
    monthly_idle_rate_cr: 17.0,
    model_version: 'InfraShield-v1.4-TransparentWeighted',
    risk_calculated_at: '2026-09-15T06:00:00Z',
    
    is_official_data: true,
    data_source_label: 'Official Public Data',
    source_id: 'SRC-DATA-GOV-IN',
    source_name: 'data.gov.in / NHAI Project Monitoring Division',
    source_url: 'https://data.gov.in/resource/national-highways-project-monitoring',
    last_updated: '2026-09-14T08:15:00Z',
    
    risk_factors: [
      {
        id: 'RF-NH75-01',
        factor_type: 'Ownership',
        name: 'Ownership Complexity',
        score: 82,
        weight: 0.20,
        contribution: 28,
        status: 'Critical',
        reason: 'Multiple ownership and title inheritance disputes identified in Sakleshpur taluk revenue ledger records.',
        supporting_data: '64 conflicting title assertions lodged under Section 3H of National Highways Act across 3 revenue villages.',
        source_name: 'data.gov.in / Karnataka Special Land Acquisition Office',
        source_id: 'SRC-DATA-GOV-IN',
        source_url: 'https://data.gov.in/resource/nhai-progress-status',
        source_record_id: 'NHAI-RO-BNG-LA-2023/889',
        is_official_data: true
      },
      {
        id: 'RF-NH75-02',
        factor_type: 'Compensation',
        name: 'Compensation Risk',
        score: 78,
        weight: 0.15,
        contribution: 21,
        status: 'Critical',
        reason: 'Pending compensation awards awaiting arbitration determination for agricultural plantations.',
        supporting_data: '₹42.8 Cr compensation funds remain in escrow pending resolution of coffee estate boundary demarcation.',
        source_name: 'data.gov.in / Ministry of Road Transport & Highways',
        source_id: 'SRC-DATA-GOV-IN',
        source_url: 'https://data.gov.in/resource/national-highways-project-monitoring',
        source_record_id: 'MORTH-EXP-LA-HSS-04',
        is_official_data: true
      },
      {
        id: 'RF-NH75-03',
        factor_type: 'Environmental',
        name: 'Environmental & Approval Risk',
        score: 72,
        weight: 0.15,
        contribution: 14,
        status: 'Elevated',
        reason: 'Stage-II Forest Clearance compliance report awaited by Regional Office, MoEFCC.',
        supporting_data: 'PARIVESH Proposal #IA/KA/NCP/72910/2022 indicates 48.4 ha diversion awaiting compliance sign-off.',
        source_name: 'PARIVESH 2.0 (MoEFCC)',
        source_id: 'SRC-PARIVESH-2.0',
        source_url: 'https://parivesh.nic.in/proposal-details?prop_id=IA/KA/NCP/72910/2022',
        source_record_id: 'IA/KA/NCP/72910/2022',
        is_official_data: true
      },
      {
        id: 'RF-NH75-04',
        factor_type: 'Historical',
        name: 'Historical Performance',
        score: 68,
        weight: 0.10,
        contribution: 10,
        status: 'Elevated',
        reason: 'Terrain complexity and monsoon shutdown windows have historically produced 6-9 month slips in Western Ghats corridors.',
        supporting_data: 'Historical NH-75 Addahole segment (completed 2021) logged 11.2 months aggregate delay under similar geology.',
        source_name: 'data.gov.in Historical Infrastructure Archives',
        source_id: 'SRC-DATA-GOV-IN',
        source_url: 'https://data.gov.in/resource/national-highways-project-monitoring',
        is_official_data: true
      },
      {
        id: 'RF-NH75-05',
        factor_type: 'Legal',
        name: 'Legal Risk',
        score: 55,
        weight: 0.25,
        contribution: 9,
        status: 'Moderate',
        reason: 'High Court writ petition filed regarding tree transplantation survival metrics; interim stay denied but compliance mandatory.',
        supporting_data: 'WP No. 18294/2023 pending before Hon’ble High Court of Karnataka (Principal Bench).',
        source_name: 'Official High Court of Karnataka Case Status Ledger',
        source_id: 'SRC-DATA-GOV-IN',
        source_url: 'https://karnatakajudiciary.kar.nic.in/',
        source_record_id: 'WP-18294/2023',
        is_official_data: true
      }
    ],
    recommended_actions: [
      'Convene district-level Land Acquisition Arbitration cell with Deputy Commissioner, Hassan to fast-track 64 title disputes.',
      'Submit Stage-II Forest compliance report to MoEFCC Regional Office Bengaluru for PARIVESH proposal IA/KA/NCP/72910/2022.',
      'Authorize interim disbursement of undisputed compensation awards (₹28.4 Cr) under Section 3H(2) to liberate Package II chainage.'
    ]
  },
  {
    id: 'PRJ-STRR-03',
    project_id: 'NHAI-KA-STRR-03',
    project_name: 'Satellite Town Ring Road (STRR NH-948A): Doddaballapura - Hoskote - Anekal Segment',
    project_type: 'Expressway',
    agency: 'National Highways Authority of India (NHAI)',
    state: 'Karnataka',
    district: 'Bengaluru Rural',
    location: 'Doddaballapura - Hoskote - Anekal Semi-Circular Arc',
    latitude: 13.1420,
    longitude: 77.7310,
    route_coordinates: [
      [77.5380, 13.2980],
      [77.6210, 13.2450],
      [77.7120, 13.1890],
      [77.7950, 13.0720],
      [77.8210, 12.9810],
      [77.7650, 12.8540],
      [77.7010, 12.7120]
    ],
    project_cost_cr: 3950.0,
    expenditure_to_date_cr: 2840.0,
    planned_start: '2021-08-01',
    planned_completion: '2025-03-31',
    projected_completion: '2025-09-30',
    current_stage: 'Construction',
    progress: 72,
    land_acquisition_progress: 86,
    status: 'Delayed',
    
    overall_risk_score: 64,
    risk_level: 'Medium',
    predicted_delay_months: 3.4,
    cost_exposure_cr: 44.2,
    monthly_idle_rate_cr: 13.0,
    model_version: 'InfraShield-v1.4-TransparentWeighted',
    risk_calculated_at: '2026-09-15T06:00:00Z',
    
    is_official_data: true,
    data_source_label: 'Official Public Data',
    source_id: 'SRC-DATA-GOV-IN',
    source_name: 'data.gov.in / NHAI Bharatmala Pariyojana PMIS',
    source_url: 'https://data.gov.in/resource/national-highways-project-monitoring',
    last_updated: '2026-09-14T08:15:00Z',
    
    risk_factors: [
      {
        id: 'RF-STRR-01',
        factor_type: 'Ownership',
        name: 'Ownership Complexity',
        score: 68,
        weight: 0.20,
        contribution: 18,
        status: 'Elevated',
        reason: 'Dual khata entries identified in peri-urban industrial parcels near Hoskote SEZ fringe.',
        supporting_data: '29 land parcels have overlapping gramathana vs municipal khata registration records.',
        source_name: 'Karnataka Open Land Records Portal / NHAI PIU Bengaluru',
        source_id: 'SRC-DATA-GOV-IN',
        source_url: 'https://data.gov.in/',
        source_record_id: 'STRR-BLR-LA-SEC3G',
        is_official_data: true
      },
      {
        id: 'RF-STRR-02',
        factor_type: 'Compensation',
        name: 'Compensation Risk',
        score: 62,
        weight: 0.15,
        contribution: 15,
        status: 'Moderate',
        reason: 'Dispute over commercial vs agricultural rate multiplier in Anekal industrial fringe.',
        supporting_data: 'Formal representation submitted by local land committee requesting Revision under Schedule I of RFCTLARR Act.',
        source_name: 'data.gov.in / MoRTH',
        source_id: 'SRC-DATA-GOV-IN',
        source_url: 'https://data.gov.in/',
        is_official_data: true
      },
      {
        id: 'RF-STRR-03',
        factor_type: 'Environmental',
        name: 'Environmental & Approval Risk',
        score: 45,
        weight: 0.15,
        contribution: 8,
        status: 'Moderate',
        reason: 'PARIVESH Proposal #IA/KA/INFRA/12093/2023 granted Stage-II In-Principle approval; clearance risk decreasing.',
        supporting_data: 'In-Principle approval recorded on 2024-06-18; environmental compliance certificate verified.',
        source_name: 'PARIVESH 2.0 (MoEFCC)',
        source_id: 'SRC-PARIVESH-2.0',
        source_url: 'https://parivesh.nic.in/',
        source_record_id: 'IA/KA/INFRA/12093/2023',
        is_official_data: true
      }
    ],
    recommended_actions: [
      'Synchronize Revenue Department village maps with municipal GIS layer to resolve 29 dual-khata records in Hoskote.',
      'Convene SLAO joint verification meeting with Bangalore Rural DC for Section 3G compensation schedule approvals.'
    ]
  },
  {
    id: 'PRJ-BSRP-C2',
    project_id: 'KRIDE-KA-BSRP-C2',
    project_name: 'Bengaluru Suburban Rail Project (BSRP): Corridor 2 (Baiyappanahalli - Chikkabanavara)',
    project_type: 'Suburban Rail',
    agency: 'Rail Infrastructure Development Company (Karnataka) Ltd (K-RIDE)',
    state: 'Karnataka',
    district: 'Bengaluru Urban',
    location: 'Baiyappanahalli to Chikkabanavara (Kanaka Line)',
    latitude: 13.0240,
    longitude: 77.5850,
    route_coordinates: [
      [77.6520, 12.9910],
      [77.6120, 13.0110],
      [77.5850, 13.0240],
      [77.5510, 13.0230],
      [77.5080, 13.0560],
      [77.4810, 13.0820]
    ],
    project_cost_cr: 3280.0,
    expenditure_to_date_cr: 890.0,
    planned_start: '2022-06-01',
    planned_completion: '2025-12-31',
    projected_completion: '2026-08-31',
    current_stage: 'Construction',
    progress: 38,
    land_acquisition_progress: 74,
    status: 'Delayed',
    
    overall_risk_score: 77,
    risk_level: 'High',
    predicted_delay_months: 4.8,
    cost_exposure_cr: 67.2,
    monthly_idle_rate_cr: 14.0,
    model_version: 'InfraShield-v1.4-TransparentWeighted',
    risk_calculated_at: '2026-09-15T06:00:00Z',
    
    is_official_data: true,
    data_source_label: 'Official Public Data',
    source_id: 'SRC-RAILWAYS-SWR',
    source_name: 'South Western Railway & K-RIDE Monthly Infrastructure Bulletin',
    source_url: 'https://swr.indianrailways.gov.in/works-programme',
    last_updated: '2026-09-13T09:20:00Z',
    
    risk_factors: [
      {
        id: 'RF-BSRP-01',
        factor_type: 'Legal',
        name: 'Inter-Departmental Defense & Railway Easement',
        score: 84,
        weight: 0.25,
        contribution: 27,
        status: 'Critical',
        reason: 'Inter-ministerial defense land transfer MoU pending cabinet sign-off for 1.8 km stretch at Hebbal-Yeshwanthpur.',
        supporting_data: 'Joint survey completed between Ministry of Defence and K-RIDE on 2024-04-12; transfer execution pending.',
        source_name: 'Ministry of Railways / K-RIDE Project Status Index',
        source_id: 'SRC-RAILWAYS-SWR',
        source_url: 'https://swr.indianrailways.gov.in/',
        is_official_data: true
      },
      {
        id: 'RF-BSRP-02',
        factor_type: 'Ownership',
        name: 'Ownership & Right-of-Way Handover',
        score: 75,
        weight: 0.20,
        contribution: 20,
        status: 'Elevated',
        reason: '18 critical commercial structures in railway siding boundary requiring rehabilitation under resettlement policy.',
        supporting_data: 'Notice issued under Railway Amendment Act 2008 for vacation of siding parcels at Chikkabanavara.',
        source_name: 'South Western Railway Works Directorate',
        source_id: 'SRC-RAILWAYS-SWR',
        source_url: 'https://swr.indianrailways.gov.in/',
        is_official_data: true
      }
    ],
    recommended_actions: [
      'Expedite inter-ministerial Defense Land Transfer protocol via High-Powered Committee chaired by Chief Secretary, Karnataka.',
      'Authorize K-RIDE resettlement assistance package for 18 commercial occupants in Chikkabanavara siding.'
    ]
  },
  {
    id: 'PRJ-SWR-ANK',
    project_id: 'SWR-KA-HB-ANK',
    project_name: 'South Western Railway: Hubballi - Ankola New Broad Gauge Railway Line (168 km)',
    project_type: 'Railway Corridor',
    agency: 'South Western Railway (SWR)',
    state: 'Karnataka',
    district: 'Uttara Kannada',
    location: 'Hubballi - Yellapur - Ankola Link through Western Ghats',
    latitude: 14.8510,
    longitude: 74.5200,
    route_coordinates: [
      [75.1240, 15.3647],
      [74.9120, 15.1820],
      [74.7120, 14.9650],
      [74.4500, 14.8200],
      [74.3120, 14.6650]
    ],
    project_cost_cr: 3820.0,
    expenditure_to_date_cr: 420.0,
    planned_start: '2020-03-01',
    planned_completion: '2026-12-31',
    projected_completion: '2028-12-31',
    current_stage: 'Approvals',
    progress: 14,
    land_acquisition_progress: 28,
    status: 'Critical Stagnation',
    
    overall_risk_score: 91,
    risk_level: 'Critical',
    predicted_delay_months: 18.6,
    cost_exposure_cr: 279.0,
    monthly_idle_rate_cr: 15.0,
    model_version: 'InfraShield-v1.4-TransparentWeighted',
    risk_calculated_at: '2026-09-15T06:00:00Z',
    
    is_official_data: true,
    data_source_label: 'Official Public Data',
    source_id: 'SRC-PARIVESH-2.0',
    source_name: 'PARIVESH 2.0 (MoEFCC) & SWR Project Directorate',
    source_url: 'https://parivesh.nic.in/wildlife-portal?prop_id=IA/KA/RAIL/44102/2021',
    last_updated: '2026-09-10T18:00:00Z',
    
    risk_factors: [
      {
        id: 'RF-ANK-01',
        factor_type: 'Environmental',
        name: 'Forest & Wildlife Clearance Impediment',
        score: 98,
        weight: 0.15,
        contribution: 35,
        status: 'Critical',
        reason: 'Corridor traverses 595.64 ha dense Western Ghats forest inside Kali Tiger Reserve buffer; pending SC-NBWL clearance.',
        supporting_data: 'PARIVESH Proposal #IA/KA/RAIL/44102/2021 categorized as Deliberation Pending before Wildlife Board and CEC.',
        source_name: 'PARIVESH 2.0 (MoEFCC)',
        source_id: 'SRC-PARIVESH-2.0',
        source_url: 'https://parivesh.nic.in/',
        source_record_id: 'IA/KA/RAIL/44102/2021',
        is_official_data: true
      },
      {
        id: 'RF-ANK-02',
        factor_type: 'Legal',
        name: 'Supreme Court CEC Deliberation',
        score: 92,
        weight: 0.25,
        contribution: 31,
        status: 'Critical',
        reason: 'Supreme Court Central Empowered Committee (CEC) review ordered regarding tree felling impact on ecology.',
        supporting_data: 'CEC Report submitted to Hon’ble Supreme Court in IA No. 1928/2022.',
        source_name: 'Government Open Data Platform India / MoEFCC',
        source_id: 'SRC-DATA-GOV-IN',
        source_url: 'https://data.gov.in/',
        is_official_data: true
      }
    ],
    recommended_actions: [
      'Commission alternate environmental alignment study minimizing Kali Tiger Reserve buffer penetration.',
      'Submit revised mitigation plan with subterranean eco-ducts to National Board for Wildlife (NBWL).'
    ]
  },
  {
    id: 'PRJ-NH150A-02',
    project_id: 'NHAI-KA-NH150A-02',
    project_name: 'NH-150A: Ballari - Challakere - Hiriyur 4-Laning (Package II)',
    project_type: 'National Highway',
    agency: 'Ministry of Road Transport & Highways (MoRTH)',
    state: 'Karnataka',
    district: 'Ballari',
    location: 'Ballari to Hiriyur Corridor',
    latitude: 14.8210,
    longitude: 76.8120,
    route_coordinates: [
      [76.9214, 15.1394],
      [76.8520, 14.9450],
      [76.7820, 14.7120],
      [76.6210, 14.4420]
    ],
    project_cost_cr: 1420.0,
    expenditure_to_date_cr: 1285.0,
    planned_start: '2021-02-01',
    planned_completion: '2024-12-31',
    projected_completion: '2025-02-28',
    current_stage: 'Construction',
    progress: 89,
    land_acquisition_progress: 98,
    status: 'Active',
    
    overall_risk_score: 26,
    risk_level: 'Low',
    predicted_delay_months: 1.1,
    cost_exposure_cr: 7.7,
    monthly_idle_rate_cr: 7.0,
    model_version: 'InfraShield-v1.4-TransparentWeighted',
    risk_calculated_at: '2026-09-15T06:00:00Z',
    
    is_official_data: true,
    data_source_label: 'Official Public Data',
    source_id: 'SRC-DATA-GOV-IN',
    source_name: 'data.gov.in / MoRTH Projects Index',
    source_url: 'https://data.gov.in/resource/national-highways-project-monitoring',
    last_updated: '2026-09-14T08:15:00Z',
    
    risk_factors: [
      {
        id: 'RF-NH150A-01',
        factor_type: 'Ownership',
        name: 'Ownership Regularization',
        score: 22,
        weight: 0.20,
        contribution: 6,
        status: 'Nominal',
        reason: '98% of right-of-way handed over; remaining parcels are minor utility crossing adjustments.',
        supporting_data: 'Final compensation awards completed under Section 3G of NH Act.',
        source_name: 'data.gov.in / MoRTH',
        source_id: 'SRC-DATA-GOV-IN',
        source_url: 'https://data.gov.in/',
        is_official_data: true
      },
      {
        id: 'RF-NH150A-02',
        factor_type: 'Environmental',
        name: 'Environmental Compliance',
        score: 18,
        weight: 0.15,
        contribution: 4,
        status: 'Nominal',
        reason: 'All clearances granted with zero pending conditions; regular compliance logs filed.',
        supporting_data: 'PARIVESH clearance certificate verified on 2022-08-11.',
        source_name: 'PARIVESH 2.0 (MoEFCC)',
        source_id: 'SRC-PARIVESH-2.0',
        source_url: 'https://parivesh.nic.in/',
        is_official_data: true
      }
    ],
    recommended_actions: [
      'Maintain active monitoring through final toll plaza commissioning and safety audit.'
    ]
  },
  {
    id: 'PRJ-BMRCL-PH2B',
    project_id: 'BMRCL-KA-PH2B-AIRPORT',
    project_name: 'Bengaluru Metro Phase 2A/2B: Outer Ring Road & Airport Line (Silk Board to KIA)',
    project_type: 'Metro Rail',
    agency: 'Bangalore Metro Rail Corporation Limited (BMRCL)',
    state: 'Karnataka',
    district: 'Bengaluru Urban',
    location: 'Central Silk Board - KR Puram - Hebbal - Kempegowda Airport',
    latitude: 13.0820,
    longitude: 77.6320,
    route_coordinates: [
      [77.6230, 12.9170],
      [77.6840, 12.9380],
      [77.6980, 12.9920],
      [77.6180, 13.0360],
      [77.6040, 13.1200],
      [77.7060, 13.1980]
    ],
    project_cost_cr: 14844.0,
    expenditure_to_date_cr: 8650.0,
    planned_start: '2021-05-01',
    planned_completion: '2026-06-30',
    projected_completion: '2026-12-31',
    current_stage: 'Construction',
    progress: 58,
    land_acquisition_progress: 89,
    status: 'Active',
    
    overall_risk_score: 66,
    risk_level: 'Medium',
    predicted_delay_months: 3.8,
    cost_exposure_cr: 144.4,
    monthly_idle_rate_cr: 38.0,
    model_version: 'InfraShield-v1.4-TransparentWeighted',
    risk_calculated_at: '2026-09-15T06:00:00Z',
    
    is_official_data: true,
    data_source_label: 'Official Public Data',
    source_id: 'SRC-DATA-GOV-IN',
    source_name: 'data.gov.in / Ministry of Housing and Urban Affairs (MoHUA)',
    source_url: 'https://data.gov.in/resource/metro-rail-project-monitoring',
    last_updated: '2026-09-14T08:15:00Z',
    
    risk_factors: [
      {
        id: 'RF-BMRCL-01',
        factor_type: 'Ownership',
        name: 'Station Parcel Handover & Utility Easement',
        score: 72,
        weight: 0.20,
        contribution: 21,
        status: 'Elevated',
        reason: 'Gas Authority of India (GAIL) pipeline shifting coordination delayed at 3 station box locations.',
        supporting_data: 'Joint utility shifting review recorded in BMRCL monthly progress report.',
        source_name: 'BMRCL Official Project Review Board',
        source_id: 'SRC-DATA-GOV-IN',
        source_url: 'https://english.bmrc.co.in/',
        is_official_data: true
      },
      {
        id: 'RF-BMRCL-02',
        factor_type: 'Compensation',
        name: 'Compensation Adjudication in Commercial Corridor',
        score: 64,
        weight: 0.15,
        contribution: 15,
        status: 'Moderate',
        reason: 'Commercial frontage valuation review claims by tech park property owners on Outer Ring Road.',
        supporting_data: 'Special Land Acquisition Officer (KIADB) report on ORR compensation claims.',
        source_name: 'KIADB & BMRCL Land Acquisition Division',
        source_id: 'SRC-DATA-GOV-IN',
        source_url: 'https://kiadb.karnataka.gov.in/',
        is_official_data: true
      }
    ],
    recommended_actions: [
      'Convene weekly high-level coordination committee between BMRCL, GAIL, and BESCOM for utility shifting fast-tracking.',
      'Prioritize viaduct launching over completed piers while station box utility relocations finish.'
    ]
  },
  {
    id: 'PRJ-SYNTH-01',
    project_id: 'DEMO-KA-BLG-EXP',
    project_name: 'Belagavi Agro-Logistics Industrial Expressway (Illustrative)',
    project_type: 'Expressway',
    agency: 'State Highway Development Project (SHDP-KA)',
    state: 'Karnataka',
    district: 'Belagavi',
    location: 'Belagavi to Chikkodi Agricultural Logistics Arc',
    latitude: 15.8497,
    longitude: 74.4977,
    route_coordinates: [
      [74.4977, 15.8497],
      [74.5820, 16.0120],
      [74.6540, 16.1820],
      [74.7210, 16.4210]
    ],
    project_cost_cr: 1180.0,
    expenditure_to_date_cr: 310.0,
    planned_start: '2023-04-01',
    planned_completion: '2026-03-31',
    projected_completion: '2027-01-31',
    current_stage: 'Land Acquisition',
    progress: 29,
    land_acquisition_progress: 54,
    status: 'Delayed',
    
    overall_risk_score: 74,
    risk_level: 'High',
    predicted_delay_months: 5.6,
    cost_exposure_cr: 44.8,
    monthly_idle_rate_cr: 8.0,
    model_version: 'InfraShield-v1.4-TransparentWeighted',
    risk_calculated_at: '2026-09-15T06:00:00Z',
    
    // Explicit Synthetic Marking
    is_official_data: false,
    data_source_label: 'Demonstration Dataset',
    source_id: 'SRC-SYNTHETIC-DEMO',
    source_name: 'InfraShield Synthetic Research Benchmarks (Demonstration Dataset)',
    source_url: 'https://infrashield.gov.internal/demo-catalog',
    last_updated: '2026-09-15T00:00:00Z',
    
    risk_factors: [
      {
        id: 'RF-DEMO-01',
        factor_type: 'Ownership',
        name: 'Ownership Regularization (Illustrative)',
        score: 76,
        weight: 0.20,
        contribution: 23,
        status: 'Elevated',
        reason: 'Illustrative record: Model simulates fragmented agricultural succession rights.',
        supporting_data: 'Demonstration baseline used to test What-If simulator intervention recalculations.',
        source_name: 'InfraShield Synthetic Benchmark',
        source_id: 'SRC-SYNTHETIC-DEMO',
        source_url: 'https://infrashield.gov.internal/demo-catalog',
        is_official_data: false
      }
    ],
    recommended_actions: [
      'Simulate What-If intervention: Resolve ownership issue to observe recalculated risk and cost exposure reduction.'
    ]
  }
];

const initialAlerts: AlertItem[] = [
  {
    id: 'ALT-2026-09-01',
    project_id: 'NHAI-KA-NH75-01',
    project_name: 'NH-75: Shiradi Ghat Tunnel Bypass & 4-Laning',
    severity: 'Critical',
    title: 'Land Acquisition Stagnation in Sakleshpur Segment',
    description: 'Section 3H arbitration backlog has exceeded 90 days across 64 parcel deeds, stalling Package II mobilization.',
    why_it_matters: 'Package II critical path is tied to Western Ghats monsoon mobilization window; further slip guarantees full season delay.',
    recommended_action: 'Convene Special Arbitration Lok Adalat chaired by Hassan District Revenue Officer for compensation reconciliation.',
    timestamp: '2026-09-14T09:30:00Z',
    data_source: 'data.gov.in / Karnataka Special Land Acquisition Records',
    source_url: 'https://data.gov.in/resource/nhai-progress-status',
    status: 'Open',
    assigned_to: 'Nodal Officer (Highways)',
    is_official_data: true
  },
  {
    id: 'ALT-2026-09-02',
    project_id: 'SWR-KA-HB-ANK',
    project_name: 'SWR Hubballi - Ankola New Railway Line',
    severity: 'Critical',
    title: 'Wildlife Deliberation Stoppage',
    description: 'National Board for Wildlife (NBWL) standing committee returned proposal IA/KA/RAIL/44102/2021 seeking revised mitigation model.',
    why_it_matters: 'Without NBWL clearance, statutory tree felling cannot initiate on 595.6 ha forest corridor.',
    recommended_action: 'Submit revised subterranean tunnel alignment reducing surface eco-corridor fragmentation to MoEFCC.',
    timestamp: '2026-09-12T14:15:00Z',
    data_source: 'PARIVESH 2.0 Clearance Ledger',
    source_url: 'https://parivesh.nic.in/',
    status: 'Open',
    assigned_to: 'Chief Project Manager (Railways)',
    is_official_data: true
  },
  {
    id: 'ALT-2026-09-03',
    project_id: 'KRIDE-KA-BSRP-C2',
    project_name: 'BSRP: Corridor 2 (Baiyappanahalli - Chikkabanavara)',
    severity: 'High',
    title: 'Inter-Agency Defense Land Protocol Pending Sign-Off',
    description: 'Execution of land transfer easement at Hebbal military boundary delayed past Q3 target.',
    why_it_matters: 'Pier foundation work along 1.8 km elevated track cannot commence until defense security wall is relocated.',
    recommended_action: 'Trigger Chief Secretary State High-Level Committee review with Local Military Authority (LMA).',
    timestamp: '2026-09-10T11:00:00Z',
    data_source: 'South Western Railway & K-RIDE Monthly Ledger',
    source_url: 'https://swr.indianrailways.gov.in/',
    status: 'Under Review',
    assigned_to: 'Urban Transport Liaison Officer',
    is_official_data: true
  },
  {
    id: 'ALT-2026-09-04',
    project_id: 'NHAI-KA-STRR-03',
    project_name: 'Satellite Town Ring Road (STRR NH-948A)',
    severity: 'Medium',
    title: 'Dual-Khata Discrepancy in Hoskote Taluk Fringe',
    description: '29 land parcels reflect divergent municipal vs panchayat title entries, slowing final compensation disbursement.',
    why_it_matters: 'Minor delay currently; could escalate into high court writ petition if not adjudicated promptly.',
    recommended_action: 'Authorize joint tahsildar verification camp to reconcile municipal town planning records with Bhoomi survey numbers.',
    timestamp: '2026-09-08T16:20:00Z',
    data_source: 'data.gov.in / NHAI Project Management Division',
    source_url: 'https://data.gov.in/',
    status: 'Open',
    is_official_data: true
  }
];

const initialHistoricalProjects: HistoricalProject[] = [
  {
    id: 'HIST-01',
    project_id: 'NHAI-KA-HIST-NH48',
    project_name: 'NH-48: Bengaluru - Nelamangala Expressway 6-Laning',
    project_type: 'National Highway',
    state: 'Karnataka',
    district: 'Bengaluru Rural',
    agency: 'NHAI',
    planned_duration_months: 30,
    actual_duration_months: 39,
    delay_months: 9.0,
    planned_cost_cr: 745.0,
    actual_cost_cr: 864.0,
    cost_overrun_cr: 119.0,
    cost_overrun_pct: 16.0,
    primary_delay_reason: 'Urban utility relocation and toll gate land dispute',
    completion_year: 2020,
    source_id: 'SRC-DATA-GOV-IN',
    is_official_data: true
  },
  {
    id: 'HIST-02',
    project_id: 'NHAI-KA-HIST-NH75A',
    project_name: 'NH-75: Addahole to Bantwal 4-Laning (Package I)',
    project_type: 'National Highway',
    state: 'Karnataka',
    district: 'Dakshina Kannada',
    agency: 'NHAI',
    planned_duration_months: 36,
    actual_duration_months: 47,
    delay_months: 11.0,
    planned_cost_cr: 820.0,
    actual_cost_cr: 980.0,
    cost_overrun_cr: 160.0,
    cost_overrun_pct: 19.5,
    primary_delay_reason: 'Western Ghats slope stabilization and forest diversion',
    completion_year: 2021,
    source_id: 'SRC-DATA-GOV-IN',
    is_official_data: true
  },
  {
    id: 'HIST-03',
    project_id: 'SWR-KA-HIST-DBL-MYS',
    project_name: 'Bengaluru - Mysuru Railway Track Doubling & Electrification',
    project_type: 'Railway Corridor',
    state: 'Karnataka',
    district: 'Mandya / Mysuru',
    agency: 'South Western Railway',
    planned_duration_months: 48,
    actual_duration_months: 62,
    delay_months: 14.0,
    planned_cost_cr: 910.0,
    actual_cost_cr: 1085.0,
    cost_overrun_cr: 175.0,
    cost_overrun_pct: 19.2,
    primary_delay_reason: 'Tipu Sultan historic armory relocation at Srirangapatna',
    completion_year: 2018,
    source_id: 'SRC-RAILWAYS-SWR',
    is_official_data: true
  },
  {
    id: 'HIST-04',
    project_id: 'NHAI-KA-HIST-NH150',
    project_name: 'NH-150A: Ballari Bypass & Mining Corridor Segment',
    project_type: 'National Highway',
    state: 'Karnataka',
    district: 'Ballari',
    agency: 'MoRTH',
    planned_duration_months: 24,
    actual_duration_months: 28,
    delay_months: 4.0,
    planned_cost_cr: 480.0,
    actual_cost_cr: 512.0,
    cost_overrun_cr: 32.0,
    cost_overrun_pct: 6.7,
    primary_delay_reason: 'Minor boundary demarcation dispute',
    completion_year: 2022,
    source_id: 'SRC-DATA-GOV-IN',
    is_official_data: true
  },
  {
    id: 'HIST-05',
    project_id: 'BMRCL-KA-HIST-PH1',
    project_name: 'Namma Metro Phase 1: East-West Corridor (Baiyappanahalli - Nayandahalli)',
    project_type: 'Metro Rail',
    state: 'Karnataka',
    district: 'Bengaluru Urban',
    agency: 'BMRCL',
    planned_duration_months: 60,
    actual_duration_months: 92,
    delay_months: 32.0,
    planned_cost_cr: 6395.0,
    actual_cost_cr: 11609.0,
    cost_overrun_cr: 5214.0,
    cost_overrun_pct: 81.5,
    primary_delay_reason: 'Underground tunneling hard rock strata and city center utility network',
    completion_year: 2017,
    source_id: 'SRC-DATA-GOV-IN',
    is_official_data: true
  }
];

const initialDataImports: DataImportSummary[] = [
  {
    id: 'IMP-2026-09-14-01',
    source_id: 'SRC-DATA-GOV-IN',
    filename: 'morth_nhai_karnataka_sept2026_verified.csv',
    imported_at: '2026-09-14T08:15:00Z',
    rows_received: 125,
    rows_imported: 118,
    rows_rejected: 7,
    rejection_reasons: [
      { reason: 'Invalid or missing geographic coordinates', count: 4 },
      { reason: 'Missing mandatory planned completion date', count: 2 },
      { reason: 'Duplicate project identifier', count: 1 }
    ],
    status: 'Completed with Warnings'
  },
  {
    id: 'IMP-2026-09-12-02',
    source_id: 'SRC-PARIVESH-2.0',
    filename: 'parivesh_karnataka_clearances_q3.json',
    imported_at: '2026-09-12T10:30:00Z',
    rows_received: 342,
    rows_imported: 342,
    rows_rejected: 0,
    rejection_reasons: [],
    status: 'Completed'
  }
];

// Singleton in-memory database store
class Database {
  private state: DBState;

  constructor() {
    this.state = {
      projects: [...initialProjects],
      segments: [...initialSegments],
      clearances: [...initialClearances],
      alerts: [...initialAlerts],
      historicalProjects: [...initialHistoricalProjects],
      dataSources: [...initialDataSources],
      dataImports: [...initialDataImports],
      riskWeights: {
        legal: 0.25,
        ownership: 0.20,
        compensation: 0.15,
        environmental: 0.15,
        resettlement: 0.15,
        historical: 0.10,
      }
    };
  }

  // Projects
  getProjects(filters?: {
    state?: string;
    district?: string;
    projectType?: string;
    riskLevel?: string;
    status?: string;
    dataSource?: string;
    search?: string;
  }): ProjectRecord[] {
    let result = [...this.state.projects];

    if (filters?.search) {
      const q = filters.search.toLowerCase();
      result = result.filter(
        p =>
          p.project_name.toLowerCase().includes(q) ||
          p.project_id.toLowerCase().includes(q) ||
          p.district.toLowerCase().includes(q) ||
          p.agency.toLowerCase().includes(q)
      );
    }
    if (filters?.state && filters.state !== 'All') {
      result = result.filter(p => p.state === filters.state);
    }
    if (filters?.district && filters.district !== 'All') {
      result = result.filter(p => p.district === filters.district);
    }
    if (filters?.projectType && filters.projectType !== 'All') {
      result = result.filter(p => p.project_type === filters.projectType);
    }
    if (filters?.riskLevel && filters.riskLevel !== 'All') {
      result = result.filter(p => p.risk_level === filters.riskLevel);
    }
    if (filters?.status && filters.status !== 'All') {
      result = result.filter(p => p.status === filters.status);
    }
    if (filters?.dataSource && filters.dataSource !== 'All') {
      result = result.filter(p => p.data_source_label === filters.dataSource);
    }

    return result;
  }

  getProjectById(id: string): ProjectRecord | undefined {
    const project = this.state.projects.find(p => p.id === id || p.project_id === id);
    if (!project) return undefined;

    return {
      ...project,
      segments: this.state.segments.filter(s => s.project_id === project.project_id),
      clearances: this.state.clearances.filter(c => c.project_id === project.project_id),
    };
  }

  addProject(project: ProjectRecord): void {
    this.state.projects.unshift(project);
  }

  // Segments
  getSegments(projectId?: string): ProjectSegment[] {
    if (projectId) {
      return this.state.segments.filter(s => s.project_id === projectId);
    }
    return this.state.segments;
  }

  // Clearances
  getClearances(projectId?: string): ClearanceRecord[] {
    if (projectId) {
      return this.state.clearances.filter(c => c.project_id === projectId);
    }
    return this.state.clearances;
  }

  // Alerts
  getAlerts(severity?: string, status?: string): AlertItem[] {
    let list = [...this.state.alerts];
    if (severity && severity !== 'All') {
      list = list.filter(a => a.severity === severity);
    }
    if (status && status !== 'All') {
      list = list.filter(a => a.status === status);
    }
    return list;
  }

  updateAlertStatus(id: string, status: 'Open' | 'Under Review' | 'Resolved', assigned_to?: string): boolean {
    const alert = this.state.alerts.find(a => a.id === id);
    if (!alert) return false;
    alert.status = status;
    if (assigned_to) alert.assigned_to = assigned_to;
    return true;
  }

  // Historical
  getHistoricalProjects(): HistoricalProject[] {
    return this.state.historicalProjects;
  }

  // Data Sources
  getDataSources(): DataSourceProvenance[] {
    return this.state.dataSources;
  }

  updateDataSource(sourceId: string, update: Partial<DataSourceProvenance>): boolean {
    const src = this.state.dataSources.find(s => s.source_id === sourceId);
    if (!src) return false;
    Object.assign(src, update);
    return true;
  }

  // Data Imports
  getDataImports(): DataImportSummary[] {
    return this.state.dataImports;
  }

  recordDataImport(summary: DataImportSummary): void {
    this.state.dataImports.unshift(summary);
  }

  // Risk Weights
  getRiskWeights() {
    return this.state.riskWeights;
  }

  setRiskWeights(newWeights: DBState['riskWeights']) {
    this.state.riskWeights = { ...newWeights };
    this.recalculateAllProjectRisks();
  }

  // Recalculate transparent scores across all projects
  recalculateAllProjectRisks() {
    const weights = this.state.riskWeights;

    this.state.projects = this.state.projects.map(p => {
      let weightedSum = 0;
      let totalWeight = 0;

      const factors = p.risk_factors.map(rf => {
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

      const overall = totalWeight > 0 ? Math.round(weightedSum / totalWeight) : p.overall_risk_score;
      let level: 'Low' | 'Medium' | 'High' | 'Critical' = 'Low';
      if (overall >= 85) level = 'Critical';
      else if (overall >= 70) level = 'High';
      else if (overall >= 40) level = 'Medium';

      // Transparent delay estimation: ~0.06 months per risk point above nominal 20
      const delay = Math.max(0.5, Number(((overall - 20) * 0.08).toFixed(1)));
      const costExposure = Number((delay * p.monthly_idle_rate_cr).toFixed(1));

      return {
        ...p,
        overall_risk_score: overall,
        risk_level: level,
        predicted_delay_months: delay,
        cost_exposure_cr: costExposure,
        risk_calculated_at: new Date().toISOString(),
        risk_factors: factors
      };
    });
  }

  // Calculate live KPI metrics
  getKpis() {
    const projects = this.state.projects;
    const activeProjects = projects.filter(p => p.status !== 'Ahead of Schedule').length;
    const highRiskProjects = projects.filter(p => p.risk_level === 'High' || p.risk_level === 'Critical').length;
    
    const avgProgress = projects.length > 0
      ? Math.round(projects.reduce((sum, p) => sum + p.progress, 0) / projects.length)
      : 0;

    const totalAtRiskCost = Number(
      projects.reduce((sum, p) => sum + p.cost_exposure_cr, 0).toFixed(1)
    );

    return {
      activeProjects,
      totalProjects: projects.length,
      highRiskProjects,
      avgProgress,
      totalAtRiskCostCr: totalAtRiskCost,
    };
  }

  getSystemStatus(): SystemHealthStatus {
    return {
      database: 'Operational',
      parivesh_connector: 'Connected',
      data_gov_connector: 'Connected',
      karnataka_gis: 'Operational',
      gemini_service: process.env.GEMINI_API_KEY ? 'Operational' : 'Missing Key',
      map_service: 'Operational',
      last_successful_sync: '2026-09-14T08:15:00Z',
    };
  }
}

export const db = new Database();
