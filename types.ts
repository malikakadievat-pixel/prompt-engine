export interface OptimizedPrompt {
  title: string;
  method: string;
  content: string;
  explanation: string;
}

export interface AnalysisResult {
  originalScore: number;
  critique: string;
  suggestions: string[];
  variations: OptimizedPrompt[];
}

export enum PromptMode {
  GENERAL = 'General',
  CODING = 'Coding',
  CREATIVE = 'Creative',
  BUSINESS = 'Business'
}

export interface LoadingState {
  isLoading: boolean;
  message: string;
}