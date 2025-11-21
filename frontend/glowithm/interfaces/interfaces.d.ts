export interface IngredientBase {
  slug: string;
  name: string;
  also_called?: string;
  categories: string[];
  recommended_for: string[];
  avoided_for: string[];
  details?: string;
  quickfacts: string[];
  proof: string[];
}

export interface IngredientRead extends IngredientBase {
  id: number;
}

export interface PredictionItem {
  label: string;
  confidence: number;
  confidence_display: string;
}

export interface PredictResponse {
  skin_type: string;
  confidence: number;
  confidence_display: string;
  all_predictions: PredictionItem[];
  recommended: Record<string, IngredientRead[]>;
  avoided: Record<string, IngredientRead[]>;   
}

export type IngredientSearchResponse = IngredientRead[];

export interface IngredientExplanation {
  ingredient: string;
  explanation: string;
  is_verified: boolean;
}
