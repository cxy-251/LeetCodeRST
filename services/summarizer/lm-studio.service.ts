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

const STRICT_RESPONSE_SCHEMA = {
  type: "object",
  additionalProperties: false,
  required: ["hook", "problem", "method", "value", "ending", "bullets"],
  properties: {
    hook: {type: "string"},
    problem: {type: "string"},
    method: {type: "string"},
    value: {type: "string"},
    ending: {type: "string"},
    bullets: {
      type: "array",
      minItems: 3,
      maxItems: 3,
      items: {type: "string"},
    },
  },
} as const;

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

const normalizeJsonText = (raw: string) =>
  raw
    .replace(/^```json\s*/i, "")
    .replace(/^```\s*/i, "")
    .replace(/\s*```$/i, "")
    .replace(/[“”]/g, "\"")
    .replace(/[‘’]/g, "'")
    .trim();

const extractJsonObject = (raw: string) => {
  const start = raw.indexOf("{");
  const end = raw.lastIndexOf("}");
  if (start === -1 || end === -1 || end <= start) {
    return raw;
  }

  return raw.slice(start, end + 1);
};

const stripTrailingCommas = (raw: string) => raw.replace(/,\s*([}\]])/g, "$1");

const tryParseDraft = (raw: string): SummaryDraft | null => {
  const normalized = normalizeJsonText(raw);
  const candidates = [
    normalized,
    extractJsonObject(normalized),
    stripTrailingCommas(normalized),
    stripTrailingCommas(extractJsonObject(normalized)),
  ];

  for (const candidate of candidates) {
    try {
      const parsed = JSON.parse(candidate) as Partial<SummaryDraft>;
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
    } catch {
      continue;
    }
  }

  return null;
};

const parseDraft = (raw: string): SummaryDraft => {
  const parsed = tryParseDraft(raw);
  if (!parsed) {
    throw new SyntaxError("Unable to parse LM Studio completion into strict JSON");
  }

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

const requestCompletion = async ({
  config,
  messages,
  maxTokens,
  temperature,
  preferStructuredOutput,
}: {
  config: LmStudioSummaryConfig;
  messages: Array<{role: "system" | "user"; content: string}>;
  maxTokens: number;
  temperature: number;
  preferStructuredOutput: boolean;
}) => {
  const url = `${config.baseUrl.replace(/\/+$/, "")}/chat/completions`;
  const buildBody = (structured: boolean) => ({
    model: config.model,
    temperature,
    max_tokens: maxTokens,
    messages,
    ...(structured
      ? {
          response_format: {
            type: "json_schema",
            json_schema: {
              name: "paper_video_script",
              schema: STRICT_RESPONSE_SCHEMA,
            },
          },
        }
      : {}),
  });

  const doRequest = async (structured: boolean) => {
    const response = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${config.apiKey}`,
      },
      body: JSON.stringify(buildBody(structured)),
    });

    return response;
  };

  const response = await doRequest(preferStructuredOutput);
  if (!response.ok && preferStructuredOutput && [400, 404, 422, 500].includes(response.status)) {
    const fallbackResponse = await doRequest(false);
    if (!fallbackResponse.ok) {
      throw new Error(`LM Studio request failed: ${fallbackResponse.status} ${fallbackResponse.statusText}`);
    }

    return (await fallbackResponse.json()) as ChatCompletionResponse;
  }

  if (!response.ok) {
    throw new Error(`LM Studio request failed: ${response.status} ${response.statusText}`);
  }

  return (await response.json()) as ChatCompletionResponse;
};

const buildRepairPrompt = (raw: string) => {
  return [
    "下面是一段格式损坏的 JSON 风格输出。",
    "请你把它修复成严格合法 JSON，并且只输出 JSON。",
    "必须包含以下字段：hook, problem, method, value, ending, bullets。",
    "bullets 必须是长度为 3 的字符串数组。",
    "",
    raw,
  ].join("\n");
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
  const payload = await requestCompletion({
    config,
    maxTokens: config.maxOutputTokens,
    temperature: config.temperature,
    preferStructuredOutput: true,
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
  });

  const content = extractContent(payload);
  if (!content) {
    throw new Error("LM Studio returned an empty completion");
  }

  let draft = tryParseDraft(content);

  if (!draft) {
    const repairedPayload = await requestCompletion({
      config,
      maxTokens: Math.min(config.maxOutputTokens, 800),
      temperature: 0,
      preferStructuredOutput: true,
      messages: [
        {
          role: "system",
          content: "You repair malformed JSON into strict JSON.",
        },
        {
          role: "user",
          content: buildRepairPrompt(content),
        },
      ],
    });
    const repairedContent = extractContent(repairedPayload);
    draft = repairedContent ? tryParseDraft(repairedContent) : null;
  }

  if (!draft) {
    throw new SyntaxError(
      `LM Studio returned non-parseable JSON. Preview: ${normalizeJsonText(content).slice(0, 240)}`,
    );
  }

  draft = parseDraft(JSON.stringify(draft));
  validateDraft(draft);
  return draft;
};
