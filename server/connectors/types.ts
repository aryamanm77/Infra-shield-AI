import { DataSourceStatus, DataSourceProvenance } from '../../src/types';

export interface DataConnector {
  id: string;
  name: string;
  organization: string;
  sourceUrl: string;
  apiUrl?: string;
  coverage: string;
  requiresAuth: boolean;
  
  getStatus(): Promise<DataSourceProvenance>;
  testConnection(): Promise<{ success: boolean; message: string; latencyMs?: number }>;
  discover(): Promise<{ availableDatasets: string[]; recordCountEstimate: number }>;
  fetch(): Promise<any[]>;
  validate(rawRecords: any[]): Promise<{ valid: any[]; rejected: { record: any; reason: string }[] }>;
  normalize(validRecords: any[]): Promise<any[]>;
  sync(): Promise<{
    importedCount: number;
    rejectedCount: number;
    rejectionReasons: { reason: string; count: number }[];
    status: DataSourceStatus;
    timestamp: string;
  }>;
}
