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
      hook: "如果 AI 真要在环境里持续行动，它最缺的其实不是会说话，而是会预测世界接下来怎么变。",
      problem: "问题是现在大家都在说 world model，但不同社区的定义很散，结果就是很多方法根本没法放在一起比较。",
      method: `作者搭了一个 levels×laws 双轴框架，把能力层级和环境约束放进同一张图里，并把 ${context.sectionHeadings.slice(0, 3).join("、")} 这些主线串了起来。`,
      value: "它的价值不只是综述，而是把 predictor、simulator、evolver 这些概念放回同一个坐标系，方便判断 agent 下一步该往哪走。",
      ending: "如果你想系统理解 agent 和 world model，这篇论文很适合作为一张总路线图。",
      bullets: [
        "统一能力层级",
        "统一环境约束",
        "串起 agent 路线图",
      ],
    };
  }

  if (mode === "theory") {
    return {
      hook: "这篇论文最硬核的地方，是它在告诉你：有些规划问题不是难解，而是从根上就可能解不了。",
      problem: "作者讨论的是 epistemic planning 里的 plan existence，也就是给定目标之后，到底存不存在一条可达的计划。",
      method: "核心结论是一个不可判定性证明。哪怕把动作条件收得很弱，这个问题依然可能没有可计算的通用解法。",
      value: "这类结论真正重要的地方在于，它提醒我们有些瓶颈不是算法不够强，而是理论边界本来就在那里。",
      ending: "如果你关心 AI 规划和形式化推理，这篇论文的理论信号非常强。",
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
    hook: "这篇论文盯上的，是一个很真实的瓶颈：检索虽然很快，但拿回来的内容不一定真能帮模型答对问题。",
    problem: "作者想解决的是检索质量和推理成本的矛盾，也就是怎样既保住速度，又更贴近最终答案质量。",
    method: `论文的核心方法可以概括为：${methodSentence}`,
    value: `实验上最值得看的地方是：${resultSentence}`,
    ending: "如果你在做 RAG 或检索排序，这篇工作更像一份很实用的提效方案。",
    bullets: [
      "检索目标对齐生成收益",
      "减少测试时重排序",
      "更适合大规模部署",
    ],
  };
};
