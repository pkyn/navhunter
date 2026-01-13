export interface NavigationLink {
  name: string;
  url: string;
  type: 'internal' | 'third-party';
  description?: string;
}

export interface GroundingSource {
  title: string;
  uri: string;
}

export interface AnalysisResult {
  links: NavigationLink[];
  summary: string;
  groundingSources: GroundingSource[];
  scriptsAndStylesheets: string[];
}

export enum AnalysisStatus {
  IDLE = 'IDLE',
  ANALYZING = 'ANALYZING',
  COMPLETED = 'COMPLETED',
  ERROR = 'ERROR'
}