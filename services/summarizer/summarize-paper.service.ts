import type {SummaryModeId} from "@paper-to-video/shared-types";
import {buildRuleBasedSummaryDraft, detectPaperMode, extractAbstractSentences, extractSectionHeadings} from "./rule-based-summary.service";
import {polishSummaryDraft} from "./summary-polish.service";
import {summarizeWithLmStudio} from "./lm-studio.service";
import type {LmStudioSummaryConfig, PaperMode, SourcePaperForSummary, SummaryDraft, SummaryResult} from "./summarizer.types";

type SummarizePaperOptions = {
  paper: SourcePaperForSummary;
  rawText: string;
  summaryMode: SummaryModeId;
  lmStudioConfig?: LmStudioSummaryConfig;
};

const SURVEY_METHOD_SIGNALS = [/L1 Predictor/i, /L2 Simulator/i, /L3 Evolver/i, /levels?\s*[×x]\s*laws/i, /physical/i, /digital/i, /social/i, /scientific/i];
const SURVEY_VALUE_SIGNALS = [/400/u, /100/u, /RL/i, /GUI/i, /multi-agent/i, /scientific/i];
const THEORY_METHOD_SIGNALS = [/plan existence/i, /modal depth/i, /postcondition/i, /不可判定/u];
const THEORY_VALUE_SIGNALS = [/理论边界/u, /不可判定/u, /通用/u, /可计算/u];
const GENERIC_PHRASES = [/统一坐标/u, /双轴框架/u, /画了张清晰地图/u, /方便.*理解/u, /提供.*评估/u, /很重要/u] as const;
const GENERIC_BULLET_PATTERNS = [/统一坐标系/u, /助力/u, /提供.*评估/u, /方便.*理解/u] as const;

const hasSignal = (value: string, patterns: readonly RegExp[]) => patterns.some((pattern) => pattern.test(value));

const reinforceWithRuleBasedBaseline = ({
  draft,
  baseline,
  paperMode,
}: {
  draft: SummaryDraft;
  baseline: SummaryDraft;
  paperMode: PaperMode;
}): SummaryDraft => {
  const nextDraft: SummaryDraft = {
    ...draft,
    bullets: [...draft.bullets],
  };

  if (paperMode === "survey") {
    if (!hasSignal(nextDraft.method, SURVEY_METHOD_SIGNALS) || GENERIC_PHRASES.some((pattern) => pattern.test(nextDraft.method))) {
      nextDraft.method = baseline.method;
    }
    if (!hasSignal(nextDraft.value, SURVEY_VALUE_SIGNALS) || GENERIC_PHRASES.some((pattern) => pattern.test(nextDraft.value))) {
      nextDraft.value = baseline.value;
    }
  }

  if (paperMode === "theory") {
    if (!hasSignal(nextDraft.method, THEORY_METHOD_SIGNALS)) {
      nextDraft.method = baseline.method;
    }
    if (!hasSignal(nextDraft.value, THEORY_VALUE_SIGNALS)) {
      nextDraft.value = baseline.value;
    }
  }

  if (nextDraft.bullets.length < 3) {
    nextDraft.bullets = baseline.bullets;
  } else if (nextDraft.bullets.some((bullet) => GENERIC_BULLET_PATTERNS.some((pattern) => pattern.test(bullet)))) {
    nextDraft.bullets = baseline.bullets;
  }

  return nextDraft;
};

export const summarizePaper = async ({
  paper,
  rawText,
  summaryMode,
  lmStudioConfig,
}: SummarizePaperOptions): Promise<SummaryResult> => {
  const paperMode = detectPaperMode(paper);
  const abstractSentences = extractAbstractSentences(rawText, paper.summary);
  const sectionHeadings = extractSectionHeadings(rawText);
  const context = {
    rawText,
    abstractSentences,
    sectionHeadings,
  };
  const baselineDraft = polishSummaryDraft({
    draft: buildRuleBasedSummaryDraft(paper, context),
    paperMode,
  });

  if (summaryMode === "lm-studio") {
    if (!lmStudioConfig) {
      throw new Error("LM Studio summary mode requires lmStudioConfig");
    }

    // Keep the rule-based path and the local-model path sharing the same inputs,
    // so downstream manifest scaffolding can stay stable while only the summarizer changes.
    const scriptDraft = await summarizeWithLmStudio(paper, context, lmStudioConfig);
    return {
      summaryMode,
      scriptDraft: reinforceWithRuleBasedBaseline({
        draft: scriptDraft,
        baseline: baselineDraft,
        paperMode,
      }),
      abstractSentences,
      sectionHeadings,
      modelName: lmStudioConfig.model,
    };
  }

  return {
    summaryMode: "rule-based",
    scriptDraft: baselineDraft,
    abstractSentences,
    sectionHeadings,
  };
};
