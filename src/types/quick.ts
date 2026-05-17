export interface QuickStackCard {
  category: string;
  recommendation: string;
  rationale: string;
}

export interface QuickResult {
  cards: QuickStackCard[];
  disclaimer: string;
}
