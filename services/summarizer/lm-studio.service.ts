import type {LmStudioSummaryConfig, PaperSummaryContext, SourcePaperForSummary, SummaryDraft} from "./summarizer.types";

type ChatCompletionResponse = {
  choices?: Array<{
    message?: {
      content?: string | Array<{type?: string; text?: string}>;
    };
  }>;
};

const RESPONSE_SCHEMA_EXAMPLE = {
  hook: "开场钩子",
  problem: "论文在解决什么问题",
  method: "作者的核心方法是什么",
  value: "为什么值得看",
  ending: "结尾总结",
  bullets: ["要点 1", "要点 2", "要点 3"],
};

const extractContent = (payload: ChatCompletionResponse) => {
  const raw = payload.choices?.[0]?.message?.content;
  if (typeof raw === "string") {
    return raw.trim();
  }

  if (Array.isArray(raw)) {
    return raw
      .map((item) => item.text ?? "")
      .join("")
      .trim();
  }

  return "";
};

const parseDraft = (raw: string): SummaryDraft => {
  const normalized = raw
    .replace(/^```json\s*/i, "")
    .replace(/^```\s*/i, "")
    .replace(/\s*```$/i, "")
    .trim();
  const parsed = JSON.parse(normalized) as Partial<SummaryDraft>;
  const bullets = Array.isArray(parsed.bullets)
    ? parsed.bullets.map((item) => `${item ?? ""}`.trim()).filter(Boolean).slice(0, 3)
    : [];

  return {
    hook: `${parsed.hook ?? ""}`.trim(),
    problem: `${parsed.problem ?? ""}`.trim(),
    method: `${parsed.method ?? ""}`.trim(),
    value: `${parsed.value ?? ""}`.trim(),
    ending: `${parsed.ending ?? ""}`.trim(),
    bullets,
  };
};

const validateDraft = (draft: SummaryDraft) => {
  const requiredKeys: Array<keyof SummaryDraft> = ["hook", "problem", "method", "value", "ending"];

  for (const key of requiredKeys) {
    if (!draft[key].trim()) {
      throw new Error(`LM Studio summary is missing required field: ${key}`);
    }
  }

  if (draft.bullets.length === 0) {
    throw new Error("LM Studio summary is missing bullets");
  }
};

const buildPrompt = (paper: SourcePaperForSummary, context: PaperSummaryContext) => {
  const excerpt = context.rawText.replace(/\s+/g, " ").slice(0, 14000);
  const headings = context.sectionHeadings.slice(0, 8).join(" | ") || "N/A";
  const abstract = context.abstractSentences.slice(0, 6).join(" ");

  return [
    "你是一个论文短视频脚本生成器。",
    "请阅读下面的论文信息，输出合法 JSON，并且只输出 JSON。",
    "输出格式必须与这个结构一致：",
    JSON.stringify(RESPONSE_SCHEMA_EXAMPLE, null, 2),
    "",
    "要求：",
    "1. 语言使用中文。",
    "2. 每个字段用 1 到 2 句话，适合短视频配音。",
    "3. bullets 固定输出 3 条，简洁、面向观众。",
    "4. 不要写 markdown，不要解释。",
    "",
    `论文标题：${paper.title}`,
    `论文编号：${paper.arxivId}`,
    `论文方向：${paper.categories.join(" / ")}`,
    `发布日期：${paper.publishedAt}`,
    `摘要句：${abstract}`,
    `章节线索：${headings}`,
    "",
    "论文文本片段：",
    excerpt,
  ].join("\n");
};

export const summarizeWithLmStudio = async (
  paper: SourcePaperForSummary,
  context: PaperSummaryContext,
  config: LmStudioSummaryConfig,
): Promise<SummaryDraft> => {
  const response = await fetch(`${config.baseUrl.replace(/\/+$/, "")}/chat/completions`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${config.apiKey}`,
    },
    body: JSON.stringify({
      model: config.model,
      temperature: config.temperature,
      max_tokens: config.maxOutputTokens,
      messages: [
        {
          role: "system",
          content: "You convert research papers into concise Chinese short-video script JSON.",
        },
        {
          role: "user",
          content: buildPrompt(paper, context),
        },
      ],
    }),
  });

  if (!response.ok) {
    throw new Error(`LM Studio request failed: ${response.status} ${response.statusText}`);
  }

  const payload = (await response.json()) as ChatCompletionResponse;
  const content = extractContent(payload);
  if (!content) {
    throw new Error("LM Studio returned an empty completion");
  }

  const draft = parseDraft(content);
  validateDraft(draft);
  return draft;
};
