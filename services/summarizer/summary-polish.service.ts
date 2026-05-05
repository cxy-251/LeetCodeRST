import type {PaperMode, SummaryDraft} from "./summarizer.types";

const stripOuterQuotes = (value: string) =>
  value
    .trim()
    .replace(/[“”]/g, "\"")
    .replace(/^"(.+)"$/u, "$1")
    .replace(/^'(.+)'$/u, "$1");

const collapseWhitespace = (value: string) => value.replace(/\s+/g, " ").trim();

const removeWeakOpeners = (value: string) =>
  value
    .replace(/^这篇论文(主要|核心)?(是在|想要|试图)?/u, "")
    .replace(/^作者(主要|核心)?(提出|讨论|研究)的是?/u, "")
    .replace(/^它的价值不只是/u, "")
    .trim();

const trimByClauses = (value: string, maxClauses: number) => {
  const clauses = value
    .split(/[。！？]/u)
    .map((item) => item.trim())
    .filter(Boolean);

  if (clauses.length <= maxClauses) {
    return clauses.join("。");
  }

  return clauses.slice(0, maxClauses).join("。");
};

const trimByChars = (value: string, limit: number) => {
  if (value.length <= limit) {
    return value;
  }

  const trimmed = value.slice(0, limit).replace(/[，、；：,.!?！？]+$/u, "").trim();
  return trimmed || value.slice(0, limit);
};

const polishSentence = ({
  value,
  mode,
}: {
  value: string;
  mode: "hook" | "problem" | "method" | "value" | "ending";
}) => {
  const cleaned = collapseWhitespace(stripOuterQuotes(value))
    .replace(/world model/gi, "world model")
    .replace(/AI agent/gi, "AI agent")
    .replace(/\s*（\s*/g, "（")
    .replace(/\s*）\s*/g, "）")
    .replace(/\s*×\s*/g, "×");

  const clauseLimited = trimByClauses(cleaned, mode === "hook" ? 2 : 1);
  const deFluffed = removeWeakOpeners(clauseLimited);
  const maxChars =
    mode === "hook"
      ? 42
      : mode === "ending"
        ? 34
        : 38;

  return trimByChars(deFluffed || clauseLimited || cleaned, maxChars);
};

const polishBullet = (value: string) =>
  trimByChars(
    collapseWhitespace(stripOuterQuotes(value))
      .replace(/^[-*•]\s*/u, "")
      .replace(/[。；;！!？?]+$/u, "")
      .trim(),
    24,
  );

const buildFallbackBullets = (draft: SummaryDraft) => {
  const candidates = [draft.method, draft.value, draft.problem]
    .flatMap((text) => text.split(/[，。；]/u))
    .map((item) => polishBullet(item))
    .filter((item) => item.length >= 6);

  return candidates.slice(0, 3);
};

export const polishSummaryDraft = ({
  draft,
  paperMode,
}: {
  draft: SummaryDraft;
  paperMode: PaperMode;
}): SummaryDraft => {
  const bullets = draft.bullets
    .map((item) => polishBullet(item))
    .filter((item, index, all) => item && all.indexOf(item) === index);

  const fallbackBullets = buildFallbackBullets(draft);
  const normalizedBullets = [...bullets, ...fallbackBullets].slice(0, 3);

  const modeAwareEnding =
    paperMode === "survey" && !/框架|坐标系|全景/u.test(draft.ending)
      ? `${draft.ending} 它更像进入这个方向的一张路线图。`
      : draft.ending;

  return {
    hook: polishSentence({value: draft.hook, mode: "hook"}),
    problem: polishSentence({value: draft.problem, mode: "problem"}),
    method: polishSentence({value: draft.method, mode: "method"}),
    value: polishSentence({value: draft.value, mode: "value"}),
    ending: polishSentence({value: modeAwareEnding, mode: "ending"}),
    bullets:
      normalizedBullets.length >= 3
        ? normalizedBullets
        : [
            ...normalizedBullets,
            ...["核心问题更清楚", "方法结构更明确", "价值判断更直接"],
          ].slice(0, 3),
  };
};
