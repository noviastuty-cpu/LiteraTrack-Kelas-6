
export enum ProficiencyLevel {
  NEEDS_IMPROVEMENT = 'Perlu Bimbingan',
  BASIC = 'Cukup',
  PROFICIENT = 'Baik',
  ADVANCED = 'Sangat Baik'
}

export interface StudentRecord {
  id: string;
  name: string;
  score: number;
  level: ProficiencyLevel;
}

export interface Recommendation {
  scoreRange: string;
  level: ProficiencyLevel;
  characteristics: string[];
  followUp: string;
  readingMaterials: string[];
}

export interface AIAnalysis {
  summary: string;
  detailedStrategy: string;
  suggestedActivities: string[];
}
