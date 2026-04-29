import type {SummaryModeId} from "@paper-to-video/shared-types";
import {buildRuleBasedSummaryDraft, extractAbstractSentences, extractSectionHeadings} from "./rule-based-summary.service";
import {summarizeWithLmStudio} from "./lm-studio.service";
import type {LmStudioSummaryConfig, SourcePaperForSummary, SummaryResult} from "./summarizer.types";

type SummarizePaperOptions = {
  paper: SourcePaperForSummary;
  rawText: string;
  summaryMode: SummaryModeId;
  lmStudioConfig?: LmStudioSummaryConfig;
};

export const summarizePaper = async ({
  paper,
  rawText,
  summaryMode,
  lmStudioConfig,
}: SummarizePaperOptions): Promise<SummaryResult> => {
  const abstractSentences = extractAbstractSentences(rawText, paper.summary);
  const sectionHeadings = extractSectionHeadings(rawText);
  const context = {
    rawText,
    abstractSentences,
    sectionHeadings,
  };

  if (summaryMode === "lm-studio") {
    if (!lmStudioConfig) {
      throw new Error("LM Studio summary mode requires lmStudioConfig");
    }

    // Keep the rule-based path and the local-model path sharing the same inputs,
    // so downstream manifest scaffolding can stay stable while only the summarizer changes.
    const scriptDraft = await summarizeWithLmStudio(paper, context, lmStudioConfig);
    return {
      summaryMode,
      scriptDraft,
      abstractSentences,
      sectionHeadings,
      modelName: lmStudioConfig.model,
    };
  }

  return {
    summaryMode: "rule-based",
    scriptDraft: buildRuleBasedSummaryDraft(paper, context),
    abstractSentences,
    sectionHeadings,
  };
};
