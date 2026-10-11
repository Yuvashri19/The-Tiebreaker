export type FactorType = 'pro' | 'con';
export type SWOTCategory = 'strength' | 'weakness' | 'opportunity' | 'threat';

export interface DecisionFactor {
  id: string;
  name: string;
  type: FactorType;
  description?: string;
  weight: number; // 1 to 5
}

export interface SWOTItem {
  id: string;
  name: string;
  category: SWOTCategory;
  description?: string;
  weight: number; // 1 to 5
}

export interface ComparisonCriterion {
  id: string;
  name: string;
  weight: number; // 1 to 5 (importance)
  description?: string;
}

export interface ComparisonOption {
  id: string;
  name: string;
  scores: Record<string, number>; // criterionId -> rating from 1 to 10
}

export interface DecisionVerdict {
  winner: string;
  reasoning: string;
  mitigationStrategy: string;
  nextSteps: string[];
}

export interface DecisionWorkspace {
  id: string;
  title: string;
  description?: string;
  createdAt: string;
  options: string[]; // List of alternate names (e.g., ["Relocate to Seattle", "Stay in SF"])
  prosCons: DecisionFactor[];
  swot: SWOTItem[];
  criteria: ComparisonCriterion[];
  comparisonOptions: ComparisonOption[];
  verdict: DecisionVerdict;
}
