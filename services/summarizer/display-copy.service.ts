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
    .replace(/AI agent/gi, "AI agent")
    .replace(/world model/gi, "world model")
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

const uniqueBullets = (items: string[], limit = 4) => {
  const seen = new Set<string>();
  const bullets: string[] = [];

  for (const item of items) {
    const normalized = trimByChars(
      cleanText(item)
        .replace(/^[-*•]\s*/u, "")
        .replace(/[。；;！!？?]+$/u, "")
        .trim(),
      34,
    );

    if (!normalized || normalized.length < 4 || seen.has(normalized)) {
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
      "因此你不仅能看懂术语，还能判断某个 agent 到底缺的是短期预测、长期 rollout，还是失败后的模型修正能力。",
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
        "world model 可能指一步预测器",
        "也可能指可 rollout 的长期模拟器",
        "定义混乱会让评测结果失真",
        "不同 community 往往在讨论不同对象",
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
      body: composeBody(
        [
        polishedDraft.ending,
          "看完这篇，你会知道 world model 不是一个词，而是一张能力、规律和失败模式共同构成的路线图。",
        ],
        104,
      ),
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
      body: composeBody(
        [
          polishedDraft.ending,
          "如果你关心 agent 的理论上限，这篇论文会直接告诉你哪些方向天生无解，哪些方向才值得继续做。",
        ],
        98,
      ),
      bullets: [],
    },
  };
};

const buildMethodDisplayDraft = ({
  polishedDraft,
  baselineDraft,
}: {
  polishedDraft: SummaryDraft;
  baselineDraft: SummaryDraft;
}): DisplayScriptDraft => {
  const problemBody = composeBody(
    [
      polishedDraft.problem,
      "真正的问题不是有没有检索，而是检索回来的信息能不能直接提升最终答案质量，以及系统到底该把预算花在召回、重排还是生成上。",
    ],
    168,
  );

  const methodBody = composeBody(
    [
      polishedDraft.method,
      "也就是说，它不是单点提速，而是在重写检索、排序和生成之间的接口关系，决定信息在哪一步被过滤、聚合和真正消费。",
    ],
    178,
  );

  const valueBody = composeBody(
    [
      polishedDraft.value,
      "如果实验里同时保住质量和推理成本，这类方法就不只是学术指标，而是部署价值，因为它会直接影响推理延迟、吞吐和线上成本。",
    ],
    174,
  );

  const fallbackBullets = baselineDraft.bullets;

  return {
    hook: {
      body: composeBody(
        [
          polishedDraft.hook,
          "它要解决的是系统级瓶颈，而不是只把某个子模块单独做强。",
        ],
        100,
      ),
      bullets: [],
    },
    problem: {
      body: problemBody,
      bullets: uniqueBullets([
        polishedDraft.problem,
        fallbackBullets[0] ?? "",
        "关注最终答案质量而不是中间代理指标",
        "先问收益落在哪一层，再决定调检索还是调生成",
      ]),
    },
    method: {
      body: methodBody,
      bullets: uniqueBullets([
        polishedDraft.method,
        fallbackBullets[1] ?? "",
        "重写检索、排序、生成之间的协同方式",
        "方法新意通常体现在接口重组而不是单模块替换",
      ]),
    },
    value: {
      body: valueBody,
      bullets: uniqueBullets([
        polishedDraft.value,
        ...(fallbackBullets ?? []),
      ]),
    },
    ending: {
      body: composeBody(
        [
          polishedDraft.ending,
          "如果你关心的是把方法真正落到系统里，这篇工作的参考价值会比单看指标更高，因为它会告诉你预算该投在哪个子模块。",
        ],
        104,
      ),
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

  return buildMethodDisplayDraft({polishedDraft, baselineDraft});
};
