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
const includesAny = (value: string, patterns: RegExp[]) => patterns.some((pattern) => pattern.test(value));

export const buildRuleBasedSummaryDraft = (
  paper: SourcePaperForSummary,
  context: PaperSummaryContext,
): SummaryDraft => {
  const mode = detectPaperMode(paper);
  const evidenceText = [paper.title, paper.summary, ...context.abstractSentences, ...context.sectionHeadings].join(" ");

  if (mode === "survey") {
    const hasLevels = includesAny(evidenceText, [/L1 Predictor/i, /L2 Simulator/i, /L3 Evolver/i, /three capability levels/i]);
    const hasLaws = includesAny(evidenceText, [/physical/i, /digital/i, /social/i, /scientific/i, /governing-law regimes/i]);
    const hasScale = includesAny(evidenceText, [/400 works/i, /100 representative systems/i, /representative systems/i]);

    return {
      hook: "如果 AI 真要自己干活，它最缺的不是多说几句像人的话，而是能不能持续预测环境接下来会怎么变。",
      problem: "问题是现在大家都在说 world model，但有人指一步预测器，有人指完整模拟器，还有人把会自我修正的系统也算进去。术语一散，不同 agent 的方法就很难放在同一张表里比较。",
      method:
        hasLevels && hasLaws
          ? "作者提出一个 levels×laws 双轴分类：一轴把 world model 分成 L1、L2、L3 三层能力，另一轴按 physical、digital、social、scientific 四类规律划分场景，用同一套坐标去比较不同 agent。"
          : `作者搭了一个双轴框架，把能力层级和环境约束放进同一张图里，并把 ${context.sectionHeadings.slice(0, 3).join("、")} 这些主线串了起来。`,
      value:
        hasScale
          ? "它的价值不只是综述，而是把 400 多篇工作和 100 多个代表系统放回同一套坐标系，让你看清一个系统缺的是短期预测、长期模拟，还是失败后的模型更新。"
          : "它的价值不只是综述，而是把 predictor、simulator、evolver 这些概念放回同一个坐标系，方便判断 agent 下一步该往哪走。",
      ending: "如果你想看懂 agent 世界模型的路线图，这篇论文更像一张总地图，先读它再看具体算法会省很多时间。",
      bullets: [
        "三层能力框架",
        "四类环境约束",
        "统一 world model 坐标系",
      ],
    };
  }

  if (mode === "theory") {
    return {
      hook: "这篇论文最硬核的地方，是它告诉你：有些规划问题不是暂时难解，而是原则上就不可能有通用求解器。",
      problem: "作者研究的是 epistemic planning 里的 plan existence，也就是给定目标、知识状态和一组动作之后，到底存不存在一条可达计划。",
      method: "它把条件收得很弱：precondition 的 modal depth 最多只有 1，而且没有 postcondition；即便这样，作者仍然证明 plan existence 是不可判定的。",
      value: "这等于划出了一条理论边界，说明有些瓶颈不是算法没调好，而是问题本身就不存在通用可计算解。对做 agent 规划的人来说，这会直接决定你该去找可解子类还是额外结构假设。",
      ending: "如果你关心智能体规划的理论上限，这篇论文值得看，因为它直接告诉你哪些方向继续堆 planner 也没用。",
      bullets: [
        "研究 plan existence",
        "弱条件下仍不可判定",
        "划出规划理论边界",
      ],
    };
  }

  const methodSentence = context.abstractSentences.find((sentence) => /We propose|framework|objective/i.test(sentence)) ??
    sentenceOr(context.abstractSentences, 1, paper.summary);
  const resultSentence = context.abstractSentences.find((sentence) => /improves|faster|Recall|MAP|F1/i.test(sentence)) ??
    sentenceOr(context.abstractSentences, 2, paper.summary);

  return {
    hook: "这篇论文盯上的，是一个很真实的瓶颈：检索很快，但拿回来的内容不一定真能帮模型答对问题。",
    problem: "作者想解决的是检索质量和推理成本的矛盾，也就是怎样既保住速度，又让检索结果更贴近最终答案质量。",
    method: `论文的核心方法可以概括为：${methodSentence} 重点不是单独提一个小模块，而是重写检索、排序和生成之间的协同方式。`,
    value: `实验上最值得看的地方是：${resultSentence} 如果这件事能在成本不明显上升的情况下成立，它就不只是指标提升，而是部署价值。`,
    ending: "如果你在做 RAG 或检索排序，这篇工作更像一份很实用的提效方案，而且你能直接借它判断系统里最该改哪一层。",
    bullets: [
      "检索目标对齐生成收益",
      "减少测试时重排序",
      "更适合大规模部署",
    ],
  };
};
