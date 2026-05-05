import type {SummaryModeId} from "@paper-to-video/shared-types";

export type SummaryDraft = {
  hook: string;
  problem: string;
  method: string;
  value: string;
  ending: string;
  bullets: string[];
};

export type SourcePaperForSummary = {
  arxivId: string;
  title: string;
  summary: string;
  categories: string[];
  publishedAt: string;
};

export type PaperMode = "survey" | "theory" | "method";

export type PaperSummaryContext = {
  rawText: string;
  abstractSentences: string[];
  sectionHeadings: string[];
};

export type LmStudioSummaryConfig = {
  baseUrl: string;
  model: string;
  apiKey: string;
  temperature: number;
  maxOutputTokens: number;
  maxInputChars: number;
  compactInputChars: number;
};

export type SummaryResult = {
  summaryMode: SummaryModeId;
  scriptDraft: SummaryDraft;
  abstractSentences: string[];
  sectionHeadings: string[];
  modelName?: string;
};
