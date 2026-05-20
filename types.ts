
export enum ProficiencyLevel {
  NEEDS_IMPROVEMENT = 'Perlu Bimbingan',
  BASIC = 'Cukup',
  PROFICIENT = 'Baik',
  ADVANCED = 'Sangat Baik'
}

export interface StudentRecord {
  id: string;
  name: string;
  className: string;
  period: string;
  readingFluency: string;
  readingAccuracy: string;
  literalComprehension: string;
  hotsInference: string;
  vocabulary: string;
  score: number;
  level: ProficiencyLevel;
  createdAt?: any;
}

export interface Recommendation {
  scoreRange: string;
  level: ProficiencyLevel;
  characteristics: string[];
  followUp: string;
  readingMaterials: string[];
  matrix: {
    readingFluency: string;
    readingAccuracy: string;
    literalComprehension: string;
    hotsInference: string;
    vocabulary: string;
  };
}

export interface AIAnalysis {
  summary: string;
  detailedStrategy: string;
  suggestedActivities: string[];
}
