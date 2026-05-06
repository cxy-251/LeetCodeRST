import type {PaperMode, SummaryDraft} from "./summarizer.types";

const stripOuterQuotes = (value: string) =>
  value
    .trim()
    .replace(/[“”]/g, "\"")
    .replace(/^"(.+)"$/u, "$1")
    .replace(/^'(.+)'$/u, "$1");

const collapseWhitespace = (value: string) => value.replace(/\s+/g, " ").trim();

const REASONING_MARKERS = [
  /\bWait\b/i,
  /\bLet's\b/i,
  /\bI should\b/i,
  /\bTo be safe\b/i,
  /\bNeed to check\b/i,
  /\bRecount\b/i,
  /\bcharacter count\b/i,
  /\bchars?\b/i,
] as const;

const stripReasoningLeak = (value: string) => {
  for (const marker of REASONING_MARKERS) {
    const match = marker.exec(value);
    if (match?.index !== undefined && match.index > 0) {
      return value.slice(0, match.index).trim();
    }
  }

  return value;
};

const removeWeakOpeners = (value: string) =>
  value
    .replace(/^这篇论文(主要|核心)?(是在|想要|试图)?/u, "")
    .replace(/^作者(主要|核心)?(提出|讨论|研究)的是?/u, "")
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

const normalizePunctuation = (value: string) =>
  value
    .replace(/[。]{2,}/gu, "。")
    .replace(/[，]{2,}/gu, "，")
    .replace(/[；]{2,}/gu, "；")
    .trim();

const rewriteWeakEnding = (value: string) =>
  value
    .replace(/建议你先收藏起来/gu, "值得先读")
    .replace(/建议先收藏起来/gu, "值得先读")
    .replace(/建议先收藏/gu, "值得先读")
    .replace(/值得收藏起来/gu, "值得先读")
    .replace(/值得一看/gu, "值得先读");

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

  const deLeaked = stripReasoningLeak(cleaned);
  const endingNormalized = mode === "ending" ? rewriteWeakEnding(deLeaked) : deLeaked;
  const valueNormalized =
    mode === "value"
      ? endingNormalized
          .replace(/^它的价值不只是综述/u, "这不只是综述")
          .replace(/^它的价值不只是/u, "它真正的价值在于")
      : endingNormalized;
  const clauseLimited = trimByClauses(valueNormalized, mode === "ending" ? 1 : 2);
  const deFluffed = normalizePunctuation(removeWeakOpeners(clauseLimited));
  const maxChars =
    mode === "hook"
      ? 84
      : mode === "ending"
        ? 54
        : mode === "method" || mode === "value"
          ? 160
          : 92;

  return trimByChars(deFluffed || clauseLimited || cleaned, maxChars);
};

const polishBullet = (value: string) =>
  trimByChars(
    stripReasoningLeak(
      collapseWhitespace(stripOuterQuotes(value))
      .replace(/^[-*•]\s*/u, "")
      .replace(/[。；;！!？?]+$/u, "")
      .trim(),
    ),
    24,
  );

const isUsableBullet = (value: string) => {
  if (!value || value.length < 4) {
    return false;
  }

  if (REASONING_MARKERS.some((marker) => marker.test(value))) {
    return false;
  }

  const asciiCount = (value.match(/[A-Za-z]/g) ?? []).length;
  return asciiCount <= Math.max(4, Math.floor(value.length / 4));
};

const buildFallbackBullets = (draft: SummaryDraft) => {
  const candidates = [draft.method, draft.value, draft.problem]
    .flatMap((text) => text.split(/[，。；]/u))
    .map((item) => polishBullet(item))
    .filter((item) => item.length >= 6);

  return candidates.slice(0, 3);
};

const toDisplaySentence = ({
  value,
  mode,
}: {
  value: string;
  mode: "hook" | "problem" | "method" | "value" | "ending";
}) => {
  const spoken = polishSentence({value, mode});
  const firstClause = spoken
    .split(/[，；：]/u)
    .map((item) => item.trim())
    .filter(Boolean)[0] ?? spoken;

  const noTrail = firstClause
    .replace(/(其实|本质上|更像是|说白了|换句话说)/gu, "")
    .replace(/[。！？!?]+$/u, "")
    .trim();

  const maxChars =
    mode === "hook"
      ? 24
      : mode === "ending"
        ? 22
        : 20;

  return trimByChars(noTrail || spoken, maxChars);
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
    .filter((item, index, all) => isUsableBullet(item) && all.indexOf(item) === index);

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

export const buildDisplayDraft = ({
  draft,
  paperMode,
}: {
  draft: SummaryDraft;
  paperMode: PaperMode;
}): SummaryDraft => {
  const polished = polishSummaryDraft({draft, paperMode});
  const bullets = polished.bullets
    .map((item) => polishBullet(item))
    .filter((item, index, all) => isUsableBullet(item) && all.indexOf(item) === index)
    .slice(0, 3);

  return {
    hook: toDisplaySentence({value: polished.hook, mode: "hook"}),
    problem: toDisplaySentence({value: polished.problem, mode: "problem"}),
    method: toDisplaySentence({value: polished.method, mode: "method"}),
    value: toDisplaySentence({value: polished.value, mode: "value"}),
    ending: toDisplaySentence({value: polished.ending, mode: "ending"}),
    bullets:
      bullets.length >= 3
        ? bullets
        : [
            ...bullets,
            ...["核心问题更清楚", "方法结构更明确", "价值判断更直接"],
          ].slice(0, 3),
  };
};
