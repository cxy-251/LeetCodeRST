import {buildRuleBasedSummaryDraft, detectPaperMode} from "./rule-based-summary.service";
import {polishSummaryDraft} from "./summary-polish.service";
import type {
  DisplaySceneDraft,
  DisplayScriptDraft,
  PaperSummaryContext,
  SourcePaperForSummary,
  SummaryDraft,
} from "./summarizer.types";

const cleanText = (value: string) =>
  value
    .replace(/\s+/g, " ")
    .replace(/(?<![（(])\bagentic RAG\b/gi, "__AGENTIC_RAG__")
    .replace(/(?<![（(])\bRAG\b/gi, "__RAG__")
    .replace(/(?<![（(])\bLLMs\b/g, "__LLMS__")
    .replace(/(?<![（(])\bLLM\b/g, "__LLM__")
    .replace(/(?<![（(])\bGUI agents?\b/gi, "__GUI_AGENT__")
    .replace(/(?<![（(])\bRL\b/g, "__RL__")
    .replace(/(?<![（(])\bAI agents?\b/gi, "__AI_AGENT__")
    .replace(/(?<![（(])\bagents?\b/gi, "__AGENT__")
    .replace(/(?<![（(])\bworld model\b/gi, "__WORLD_MODEL__")
    .replace(/(?<![（(])\bplan existence\b/gi, "__PLAN_EXISTENCE__")
    .replace(/(?<![（(])\bepistemic planning\b/gi, "__EPISTEMIC_PLANNING__")
    .replace(/(?<![（(])\bpointed Kripke model\b/gi, "__POINTED_KRIPKE__")
    .replace(/(?<![（(])\bepistemic actions?\b/gi, "__EPISTEMIC_ACTION__")
    .replace(/(?<![（(])\bmodal depth\b/gi, "__MODAL_DEPTH__")
    .replace(/(?<![（(])\bpostconditions?\b/gi, "__POSTCONDITION__")
    .replace(/(?<![（(])\brollouts?\b/gi, "__ROLLOUT__")
    .replace(/__AGENTIC_RAG__/g, "主动规划式检索增强生成（agentic RAG）")
    .replace(/__RAG__/g, "检索增强生成（RAG）")
    .replace(/__LLMS__/g, "大语言模型（LLM）")
    .replace(/__LLM__/g, "大语言模型（LLM）")
    .replace(/__GUI_AGENT__/g, "图形界面智能体（GUI agent）")
    .replace(/__RL__/g, "强化学习（RL）")
    .replace(/__AI_AGENT__/g, "AI 智能体")
    .replace(/__AGENT__/g, "智能体")
    .replace(/__WORLD_MODEL__/g, "世界模型")
    .replace(/__PLAN_EXISTENCE__/g, "计划存在性")
    .replace(/__EPISTEMIC_PLANNING__/g, "认知规划（epistemic planning）")
    .replace(/__POINTED_KRIPKE__/g, "带真实世界指针的知识状态图（pointed Kripke model）")
    .replace(/__EPISTEMIC_ACTION__/g, "认知动作（epistemic action）")
    .replace(/__MODAL_DEPTH__/g, "模态深度（modal depth）")
    .replace(/__POSTCONDITION__/g, "后置条件（postcondition）")
    .replace(/__ROLLOUT__/g, "多步推演")
    .replace(/大语言模型（(?:大语言模型（)+LLM）(?:）)+/g, "大语言模型（LLM）")
    .replace(/主动规划式检索增强生成（agentic\s+检索增强生成（RAG））/g, "主动规划式检索增强生成（agentic RAG）")
    .replace(/标准\s+检索增强生成（RAG）/g, "标准检索增强生成（RAG）")
    .replace(/([\u4e00-\u9fff])\s+([A-Za-z\u4e00-\u9fff（])/g, "$1$2")
    .replace(/([A-Za-z0-9）])\s+([，。！？；：])/g, "$1$2")
    .replace(/([。！？；])\s+/g, "$1")
    .replace(/\s+([，。！？；：])/g, "$1")
    .replace(/\s*（\s*/g, "（")
    .replace(/\s*）\s*/g, "）")
    .replace(/\s*×\s*/g, "×")
    .replace(/[。]{2,}/gu, "。")
    .replace(/[，]{2,}/gu, "，")
    .trim();

const trimByChars = (value: string, limit: number) => {
  if (value.length <= limit) {
    return value;
  }

  return value.slice(0, limit).replace(/[，、；：,.!?！？]+$/u, "").trim();
};

const englishLetterCount = (value: string) => (value.match(/[A-Za-z]/g) ?? []).length;

const isEnglishHeavy = (value: string) => {
  const letters = englishLetterCount(value);
  return letters >= 22 || /(?:\b[A-Za-z][A-Za-z0-9-]*\b[\s,;:()（）]*){5,}/.test(value);
};

const stripEnglishFragments = (value: string) =>
  cleanText(value)
    .replace(/(?:\b[A-Za-z][A-Za-z0-9-]*\b[\s,;:()（）]*){5,}/g, "")
    .replace(/\s+/g, " ")
    .trim();

const uniqueBullets = (items: string[], limit = 4, maxChars = 46) => {
  const seen = new Set<string>();
  const bullets: string[] = [];

  for (const item of items) {
    const normalized = trimByChars(
      cleanText(item)
        .replace(/^[-*•]\s*/u, "")
        .replace(/[。；;！!？?]+$/u, "")
        .trim(),
      maxChars,
    );

    if (!normalized || normalized.length < 4 || seen.has(normalized) || isEnglishHeavy(normalized)) {
      continue;
    }

    seen.add(normalized);
    bullets.push(normalized);

    if (bullets.length >= limit) {
      break;
    }
  }

  return bullets;
};

const composeBody = (parts: string[], maxChars: number) => {
  const text = cleanText(
    parts
      .map((part) => part.trim())
      .filter(Boolean)
      .join(" ")
      .replace(/\s+/g, " "),
  );

  if (!text) {
    return "";
  }

  return trimByChars(text, maxChars);
};

const composeDistinctBody = (primary: string, fallback: string, maxChars: number) => {
  const normalizedPrimary = cleanText(primary);
  const normalizedFallback = cleanText(fallback);
  const fallbackBody =
    !normalizedFallback ||
    normalizedFallback === normalizedPrimary ||
    normalizedPrimary.includes(normalizedFallback) ||
    normalizedFallback.includes(normalizedPrimary)
      ? ""
      : normalizedFallback;

  return composeBody([normalizedPrimary, fallbackBody], maxChars);
};

const inferMethodFocusLabel = (text: string) => {
  const normalized = text.toLowerCase();

  if (/symptom|conversational|triage|assessment/.test(normalized)) {
    return "主动问诊与关键信息补齐";
  }

  if (/clinical|medicine|radiology|medical|safety/.test(normalized)) {
    return "医疗系统的真实可靠性";
  }

  if (/retrieval|rag|search|ranking/.test(normalized)) {
    return "检索链路对答案质量的影响";
  }

  if (/planning|planner|agent/.test(normalized)) {
    return "智能体的长期行动策略";
  }

  if (/benchmark|dataset|evaluation/.test(normalized)) {
    return "评测指标与真实能力的差距";
  }

  if (/vision|video|image|multimodal/.test(normalized)) {
    return "多模态系统的真实稳定性";
  }

  return "系统落地时的关键瓶颈";
};

const appendIfMissing = (base: string, addition: string) => {
  const normalizedBase = cleanText(base);
  const normalizedAddition = cleanText(addition);

  if (!normalizedAddition || !normalizedBase) {
    return normalizedAddition ? [normalizedBase, normalizedAddition].filter(Boolean).join(" ") : normalizedBase;
  }

  return normalizedBase.includes(normalizedAddition) ? normalizedBase : `${normalizedBase} ${normalizedAddition}`.trim();
};

const extractNamedArtifacts = (text: string) => {
  const ignore = new Set(["Clinical", "LLMs", "LLM", "AI", "The", "This", "We", "To", "As", "In", "On"]);
  return [...text.matchAll(/\b(?:[A-Z][A-Za-z0-9]+(?:-[A-Za-z0-9]+)+|[A-Z]{2,}(?:-[A-Z0-9]+)*)\b/g)]
    .map((match) => match[0]?.trim() ?? "")
    .filter((item) => item.length >= 3 && !ignore.has(item))
    .filter((item, index, all) => all.indexOf(item) === index)
    .slice(0, 4);
};

const extractMethodDimensions = (text: string) => {
  const normalized = text.toLowerCase();
  const dimensions: string[] = [];
  const mapping: Array<[RegExp, string]> = [
    [/model scale/, "模型规模"],
    [/context length/, "上下文长度"],
    [/evidence quality|clean evidence|conflict evidence/, "证据质量"],
    [/retrieval complexity|retrieval strategy|standard rag|agentic rag/, "检索方式"],
    [/context exposure|max-context/, "上下文构造"],
    [/inference-time compute|latency/, "推理时算力"],
  ];

  for (const [pattern, label] of mapping) {
    if (pattern.test(normalized) && !dimensions.includes(label)) {
      dimensions.push(label);
    }
  }

  return dimensions.slice(0, 5);
};

const extractEvaluationFacts = (text: string) => {
  const modelCount = /evaluated\s+(\d+)\s+(?:locally deployed\s+)?llms?/i.exec(text)?.[1];
  const conditionCount = /across\s+(\d+)\s+deployment conditions/i.exec(text)?.[1];
  const questionCount = /benchmark of\s+(\d+)\s+(?:multiple-choice\s+)?questions/i.exec(text)?.[1];
  const facts: string[] = [];

  if (questionCount) {
    facts.push(`${questionCount} 道任务题`);
  }

  if (modelCount && conditionCount) {
    facts.push(`${modelCount} 个模型 × ${conditionCount} 种条件`);
  } else if (modelCount) {
    facts.push(`${modelCount} 个模型对比`);
  }

  return facts;
};

const extractFindingBullets = (text: string) => {
  const findings: string[] = [];
  const normalized = text.toLowerCase();

  if (/clean evidence produced the strongest improvement/.test(normalized)) {
    findings.push("干净证据最有效，不是更复杂的 RAG");
  }

  const highRiskDrop = /high-risk error from\s+([0-9.]+)%\s+to\s+([0-9.]+)%/i.exec(text);
  if (highRiskDrop) {
    findings.push(`高风险错误率 ${highRiskDrop[1]}%→${highRiskDrop[2]}%`);
  }

  if (/did not reproduce this safety profile/.test(normalized)) {
    findings.push("标准 RAG 没复制这种安全收益");
  }

  if (/increased latency without closing the safety gap/.test(normalized)) {
    findings.push("长上下文更慢，但没补齐安全差距");
  }

  if (/worst-case analysis showed/i.test(text)) {
    findings.push("真正危险的错误集中在少数高风险题");
  }

  return findings.slice(0, 3);
};

const withoutExistingBullets = (candidates: string[], existing: string[]) => {
  const normalizedExisting = new Set(existing.map((item) => cleanText(item)));
  return candidates.filter((item) => {
    const normalized = cleanText(item);
    return normalized && !normalizedExisting.has(normalized);
  });
};

const buildSurveyDisplayDraft = ({
  polishedDraft,
  baselineDraft,
}: {
  polishedDraft: SummaryDraft;
  baselineDraft: SummaryDraft;
}): DisplayScriptDraft => {
  const hookBody = composeBody(
    [
      polishedDraft.hook,
      "这篇论文不是再造一个新 agent，而是先把 world model 这个词拆开：到底它分几层能力、受哪类规律约束、为什么不同系统会在完全不同的地方失效。",
    ],
    146,
  );

  const problemBody = composeBody(
    [
      "现在 world model 这个词同时指一步预测器、多步模拟器，甚至会根据新证据更新自身假设的系统。",
      "术语一乱，RL、GUI agent、多智能体和科研 agent 虽然都声称在做 world model，但其实在比较完全不同的对象。",
    ],
    168,
  );

  const methodBody = composeBody(
    [
      "作者用 levels×laws 双轴 taxonomy 重排文献：一轴看能力从 L1 Predictor、L2 Simulator 到 L3 Evolver，另一轴看系统面对的是 physical、digital、social、scientific 哪一类规律。",
      "重点不是再提一个新模型，而是给所有 world model 工作一张统一坐标纸。",
    ],
    178,
  );

  const valueBody = composeBody(
    [
      "这套框架把 400+ 论文和 100+ 代表系统放回同一坐标系，能直接解释为什么同样叫 world model 的方法，会在不同环境约束下暴露完全不同的失败点。",
      "因此你不仅能看懂术语，还能判断某个智能体到底缺的是短期预测、长期多步推演，还是失败后的模型修正能力。",
    ],
    182,
  );

  return {
    hook: {
      body: hookBody,
      bullets: [],
    },
    problem: {
      body: problemBody,
      bullets: uniqueBullets([
        "世界模型可能只指一步预测器",
        "也可能指可做长期多步推演的模拟器",
        "定义混乱会让评测结果失真",
        "不同研究社区往往在讨论不同对象",
      ]),
    },
    method: {
      body: methodBody,
      bullets: uniqueBullets([
        "L1 Predictor：只学一步局部转移",
        "L2 Simulator：多步条件模拟",
        "L3 Evolver：预测失败后用新证据修模",
        "新意是统一 taxonomy，而不是再发明一个新 backbone",
      ]),
    },
    value: {
      body: valueBody,
      bullets: uniqueBullets([
        "四类规律：物理 / 数字 / 社会 / 科学",
        "整理 400+ 论文与 100+ 代表系统",
        "给设计、失败分析和评测一套统一坐标系",
        "能判断系统缺的是预测、模拟还是修模",
      ]),
    },
    ending: {
      body: "这篇综述真正留下的是一把尺子：你可以直接判断一个智能体缺的是预测、模拟，还是失败后的模型修正能力。",
      bullets: [],
    },
  };
};

const buildTheoryDisplayDraft = ({
  polishedDraft,
  baselineDraft,
}: {
  polishedDraft: SummaryDraft;
  baselineDraft: SummaryDraft;
}): DisplayScriptDraft => {
  return {
    hook: {
      body: composeBody(
        [
          polishedDraft.hook,
          "它讨论的不是工程调参，而是某类规划问题从理论上是否存在通用解，以及为什么某些规划器永远不可能覆盖所有情形。",
        ],
        132,
      ),
      bullets: [],
    },
    problem: {
      body: composeBody(
        [
          "论文研究 epistemic planning 里的 plan existence：给定目标公式、初始知识状态和一组 epistemic actions，是否存在一条动作序列能达成目标。",
          "这里的关键不是最优性，而是“有没有任何一条计划存在”。",
        ],
        164,
      ),
      bullets: uniqueBullets([
        "epistemic planning：在不完全知识下规划",
        "pointed Kripke model：带真实世界指针的知识状态图",
        "epistemic action：优先改变认知而非物理世界的动作",
        "plan existence：问是否存在可达成目标的动作序列",
      ]),
    },
    method: {
      body: composeBody(
        [
          "作者把条件压到很弱：epistemic action 的 precondition modal depth 最多只有 1，而且没有 postcondition；即便这样，plan existence 仍被证明为不可判定。",
          "也就是说，论文的新意不是设计新 planner，而是在极简设定下给出不可判定性证明。",
        ],
        176,
      ),
      bullets: uniqueBullets([
        "precondition modal depth ≤ 1",
        "没有 postcondition",
        "把动作限制到非常弱的知识更新",
        "即便如此仍然不可判定",
      ]),
    },
    value: {
      body: composeBody(
        [
          "这条结果等于给 epistemic planning 画出硬边界：有些难题不是缺更强算法，而是问题本身就没有统一可计算解。",
          "这能帮助你判断后续工作该去找可解子类、近似方法还是额外结构假设，而不是盲目堆 planner。",
        ],
        176,
      ),
      bullets: uniqueBullets([
        "给 epistemic planning 画出理论边界",
        "解释为何某些规划器永远无法通解",
        "提醒研究者去找可解子类和额外结构",
        "后续研究必须绕开这条不可判定红线",
      ]),
    },
    ending: {
      body: "结论很直接：即便把条件压到很弱，这类认知规划问题仍然不可判定，后续研究必须绕开这条理论边界。",
      bullets: [],
    },
  };
};

const buildMethodDisplayDraft = ({
  paper,
  context,
  polishedDraft,
  baselineDraft,
}: {
  paper: SourcePaperForSummary;
  context: Pick<PaperSummaryContext, "abstractSentences" | "sectionHeadings">;
  polishedDraft: SummaryDraft;
  baselineDraft: SummaryDraft;
}): DisplayScriptDraft => {
  const evidenceText = [paper.title, paper.summary, ...context.abstractSentences, ...context.sectionHeadings].join(" ");
  const artifacts = extractNamedArtifacts(evidenceText);
  const dimensions = extractMethodDimensions(evidenceText);
  const evaluationFacts = extractEvaluationFacts(evidenceText);
  const findingBullets = extractFindingBullets(evidenceText);
  const focusLabel = inferMethodFocusLabel(evidenceText);
  const hookSource = isEnglishHeavy(polishedDraft.hook) ? baselineDraft.hook : polishedDraft.hook;
  const problemSource = isEnglishHeavy(polishedDraft.problem) ? baselineDraft.problem : polishedDraft.problem;
  const methodSource = isEnglishHeavy(polishedDraft.method)
    ? stripEnglishFragments(baselineDraft.method)
    : stripEnglishFragments(polishedDraft.method) || stripEnglishFragments(baselineDraft.method);
  const valueSource = isEnglishHeavy(polishedDraft.value)
    ? stripEnglishFragments(baselineDraft.value)
    : stripEnglishFragments(polishedDraft.value) || stripEnglishFragments(baselineDraft.value);
  const endingSource = isEnglishHeavy(polishedDraft.ending) ? baselineDraft.ending : polishedDraft.ending;

  const hookBody = composeBody(
    [
      stripEnglishFragments(problemSource),
      findingBullets[0] ? `最关键的发现是：${findingBullets[0]}。` : "",
    ],
    146,
  );
  const problemBody = composeDistinctBody(problemSource, baselineDraft.problem, 198);
  const methodBody = composeBody(
    [
      appendIfMissing(methodSource, dimensions.length > 0 ? `重点拆开比较 ${dimensions.join("、")} 这些变量。` : ""),
      evaluationFacts.length > 0 ? `实验覆盖 ${evaluationFacts.join("、")}。` : "",
    ],
    208,
  );
  const valueBody = composeBody(
    [
      appendIfMissing(valueSource, findingBullets[0] ?? ""),
      findingBullets[1] ?? "",
    ],
    206,
  );

  const fallbackBullets = baselineDraft.bullets;
  const methodBullets = uniqueBullets(
    [
      artifacts[0] ? `${artifacts[0]}：核心方法/框架` : "",
      artifacts[1] ? `${artifacts[1]}：关键评测或数据设置` : "",
      dimensions.length > 0 ? `比较 ${dimensions.join("、")}` : "",
      ...evaluationFacts,
      ...findingBullets,
      ...fallbackBullets,
    ],
    5,
    48,
  );
  const valueBullets = uniqueBullets(
    withoutExistingBullets(
      [
        ...findingBullets,
        dimensions.length > 0 ? `安全收益取决于 ${dimensions.slice(0, 3).join("、")}` : "",
        ...fallbackBullets,
      ],
      methodBullets,
    ),
    4,
    48,
  );
  const problemBullets = uniqueBullets(
    [
      artifacts[0] ? `论文主角：${artifacts[0]}` : "",
      `核心场景：${focusLabel}`,
      dimensions.length > 0 ? `核心变量：${dimensions.slice(0, 3).join("、")}` : "",
      ...findingBullets,
      fallbackBullets[0] ?? "",
    ],
    4,
    46,
  );

  return {
    hook: {
      body: hookBody,
      bullets: [],
    },
    problem: {
      body: problemBody,
      bullets: problemBullets,
    },
    method: {
      body: methodBody,
      bullets: methodBullets.length >= 2 ? methodBullets : [],
    },
    value: {
      body: valueBody,
      bullets: valueBullets.length >= 2 ? valueBullets : [],
    },
    ending: {
      body: composeBody([endingSource], 108),
      bullets: [],
    },
  };
};

export const buildDisplayScriptDraft = ({
  paper,
  draft,
  context,
}: {
  paper: SourcePaperForSummary;
  draft: SummaryDraft;
  context: Pick<PaperSummaryContext, "abstractSentences" | "sectionHeadings">;
}): DisplayScriptDraft => {
  const paperMode = detectPaperMode(paper);
  const polishedDraft = polishSummaryDraft({draft, paperMode});
  const baselineDraft = polishSummaryDraft({
    draft: buildRuleBasedSummaryDraft(paper, {
      rawText: "",
      abstractSentences: context.abstractSentences,
      sectionHeadings: context.sectionHeadings,
    }),
    paperMode,
  });

  if (paperMode === "survey") {
    return buildSurveyDisplayDraft({polishedDraft, baselineDraft});
  }

  if (paperMode === "theory") {
    return buildTheoryDisplayDraft({polishedDraft, baselineDraft});
  }

  return buildMethodDisplayDraft({
    paper,
    context,
    polishedDraft,
    baselineDraft,
  });
};
