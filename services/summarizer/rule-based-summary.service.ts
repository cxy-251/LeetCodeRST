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
      hook: `这篇论文不是在做单点模型改进，而是在重新整理 AI agent 的 world modeling 全景。`,
      problem: `作者想解决的问题是：当智能体开始在真实环境里持续行动时，我们到底该怎样定义和评估 world model。`,
      method: `论文提出了一个 levels x laws 的分析框架，把能力层级和约束类型放到同一张图里，并梳理了 ${context.sectionHeadings.slice(0, 3).join("、")} 等关键脉络。`,
      value: `它的价值不只是综述，而是把 predictor、simulator、evolver 这些能力层级统一到了同一个研究坐标系里。`,
      ending: `如果你在关注 agent、world model 和长期规划，这篇综述非常适合作为进入这个方向的起点。`,
      bullets: [
        "统一 world model 的能力层级",
        "把物理、数字、社会、科学环境放进同一框架",
        "更适合用来理解 agent 系统下一步往哪走",
      ],
    };
  }

  if (mode === "theory") {
    return {
      hook: `这篇论文切的是一个很底层的问题：某些规划问题，从理论上就可能根本不可判定。`,
      problem: `作者讨论的是 epistemic planning 里的 plan existence 问题，也就是给定目标和动作后，是否存在一条可达路径。`,
      method: `核心结果是一个 undecidability proof。即使把动作条件限制得很弱，这个计划存在性问题依然可能不可判定。`,
      value: `这类结论的意义在于，它告诉我们哪些规划设定天然会碰到理论边界，而不是单纯算法还不够强。`,
      ending: `如果你关心 AI 规划、逻辑推理和形式化方法，这篇短论文的理论信号很强。`,
      bullets: [
        "研究对象是 epistemic planning",
        "结果是 plan existence 不可判定",
        "提示某些规划任务存在理论极限",
      ],
    };
  }

  const methodSentence = context.abstractSentences.find((sentence) => /We propose|framework|objective/i.test(sentence)) ??
    sentenceOr(context.abstractSentences, 1, paper.summary);
  const resultSentence = context.abstractSentences.find((sentence) => /improves|faster|Recall|MAP|F1/i.test(sentence)) ??
    sentenceOr(context.abstractSentences, 2, paper.summary);

  return {
    hook: `这篇论文关注的是 RAG 检索环节的一个实际瓶颈：向量召回很快，但不一定真的最有用。`,
    problem: `作者想解决的是检索质量和推理成本之间的矛盾，也就是怎样既保留 dense retrieval 的速度，又靠近 LLM utility re-ranking 的效果。`,
    method: `论文的核心方法可以概括为：${methodSentence}`,
    value: `实验上最值得看的是：${resultSentence}`,
    ending: `如果你正在做 RAG、dense retriever 或者检索排序，这篇工作很适合作为性能和成本平衡的参考。`,
    bullets: [
      "把检索目标改成对齐生成 utility",
      "不依赖测试时 LLM 重排序",
      "更适合大规模 RAG 实际部署",
    ],
  };
};
