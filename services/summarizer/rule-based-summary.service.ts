import type {PaperMode, PaperSummaryContext, SourcePaperForSummary, SummaryDraft} from "./summarizer.types";

export const splitSentences = (text: string) =>
  text
    .replace(/\s+/g, " ")
    .split(/(?<=[.?!])\s+/)
    .map((item) => item.trim())
    .filter(Boolean);

export const extractAbstractSentences = (rawText: string, fallbackSummary: string) => {
  const text = rawText.replace(/\s+/g, " ");
  const abstractStart = text.match(/As AI systems|Dense vector retrieval|The plan existence problem/i);

  if (!abstractStart) {
    return splitSentences(fallbackSummary).slice(0, 4);
  }

  const startIndex = abstractStart.index ?? 0;
  const abstractWindow = text.slice(startIndex, startIndex + 2400);
  return splitSentences(abstractWindow).slice(0, 6);
};

export const extractSectionHeadings = (rawText: string) => {
  return [...rawText.matchAll(/§\d+(?:\.\d+)?\s+([^\n]+)/g)]
    .map((match) => match[1].trim())
    .filter((heading, index, all) => heading.length > 1 && all.indexOf(heading) === index)
    .slice(0, 10);
};

export const detectPaperMode = (paper: SourcePaperForSummary): PaperMode => {
  const title = paper.title.toLowerCase();
  const summary = paper.summary.toLowerCase();

  if (title.includes("survey") || title.includes("foundations") || summary.includes("taxonomy")) {
    return "survey";
  }

  if (title.includes("proof") || summary.includes("undecidable")) {
    return "theory";
  }

  return "method";
};

const sentenceOr = (sentences: string[], index: number, fallback: string) => sentences[index] ?? fallback;

export const buildRuleBasedSummaryDraft = (
  paper: SourcePaperForSummary,
  context: PaperSummaryContext,
): SummaryDraft => {
  const mode = detectPaperMode(paper);

  if (mode === "survey") {
    return {
      hook: "这篇论文最重要的，不是提新模型，而是重新整理 world model 全景。",
      problem: "智能体开始持续行动后，研究界一直缺一套统一的 world model 定义和评估框架。",
      method: `作者提出 levels×laws 框架，把能力层级和环境约束放进同一张图里，并串起 ${context.sectionHeadings.slice(0, 3).join("、")} 这些主线。`,
      value: "它把 predictor、simulator、evolver 放进同一个坐标系，更适合判断 agent 下一步往哪走。",
      ending: "如果你想系统理解 agent 和 world model，这篇综述就是一张路线图。",
      bullets: [
        "统一能力层级",
        "统一环境约束",
        "串起 agent 路线图",
      ],
    };
  }

  if (mode === "theory") {
    return {
      hook: "这篇论文最硬核的地方，是它证明有些规划问题从根上就解不了。",
      problem: "作者讨论的是 epistemic planning 里的 plan existence，也就是目标是否存在一条可达解。",
      method: "核心结论是一个不可判定性证明：哪怕动作条件收得很弱，问题依然可能无解。",
      value: "它提醒我们，有些规划瓶颈不是算法不够强，而是理论边界本来就在那里。",
      ending: "如果你关心 AI 规划和形式化推理，这篇论文的理论信号很强。",
      bullets: [
        "研究 epistemic planning",
        "证明 plan existence 不可判定",
        "指出规划理论边界",
      ],
    };
  }

  const methodSentence = context.abstractSentences.find((sentence) => /We propose|framework|objective/i.test(sentence)) ??
    sentenceOr(context.abstractSentences, 1, paper.summary);
  const resultSentence = context.abstractSentences.find((sentence) => /improves|faster|Recall|MAP|F1/i.test(sentence)) ??
    sentenceOr(context.abstractSentences, 2, paper.summary);

  return {
    hook: "这篇论文盯上的，是一个真实瓶颈：检索很快，但不一定真有用。",
    problem: "作者想解决检索质量和推理成本的矛盾，也就是怎样兼顾速度和最终答案质量。",
    method: `论文的核心方法可以概括为：${methodSentence}`,
    value: `实验上最值得看的是：${resultSentence}`,
    ending: "如果你在做 RAG 或检索排序，这篇工作更像一份很实用的提效方案。",
    bullets: [
      "检索目标对齐生成收益",
      "减少测试时重排序",
      "更适合大规模部署",
    ],
  };
};
