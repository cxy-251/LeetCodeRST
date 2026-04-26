# PaperToVideo Manifest 与 Timeline 设计

## 1. 设计目标

本设计文档用于定义 PaperToVideo 的核心中间数据结构，确保以下模块之间可以解耦协作：

1. 论文抓取模块
2. AI 总结与脚本模块
3. 图片生成模块
4. React 幻灯片模块
5. Edge TTS 模块
6. Remotion 视频渲染模块

核心原则：所有渲染结果都来自一份确定性的 `render manifest`，而不是在渲染时临时推导。

---

## 2. 数据流分层

建议把数据拆成四个层级文件：

1. `paper-source.json`
2. `content-brief.json`
3. `production-manifest.json`
4. `render-manifest.json`

含义如下：

1. `paper-source.json`：原始论文信息与清洗后的基础内容。
2. `content-brief.json`：AI 生成的摘要、脚本、配图提示词。
3. `production-manifest.json`：业务层面的场景编排配置。
4. `render-manifest.json`：最终给 Remotion 消费的确定性渲染输入。

---

## 3. Source 层结构

```ts
type PaperSource = {
  id: string;
  source: "arxiv";
  arxivId: string;
  title: string;
  authors: string[];
  abstract: string;
  categories: string[];
  pdfUrl?: string;
  publishedAt?: string;
  fetchedAt: string;
};
```

说明：

1. 这一层尽量保真，不引入视频表达逻辑。
2. 后续如果扩展到别的论文来源，也尽量兼容该结构。

---

## 4. Content Brief 层结构

```ts
type ContentBrief = {
  projectId: string;
  sourcePaperId: string;
  language: "zh-CN";
  summary: {
    oneLiner: string;
    shortSummary: string;
    keyTakeaways: string[];
  };
  script: {
    hook: string;
    sections: Array<{
      id: string;
      heading: string;
      narration: string;
      slideBullets: string[];
      imagePrompt: string;
    }>;
    ending: string;
  };
};
```

说明：

1. `narration` 给 TTS 使用。
2. `slideBullets` 给页面模板使用。
3. `imagePrompt` 给图片 provider 使用。

---

## 5. Production Manifest 结构

这是编排层的核心结构，表达“准备做什么视频”。

```ts
type ProductionManifest = {
  projectId: string;
  seed: number;
  locale: "zh-CN";
  output: {
    width: number;
    height: number;
    fps: number;
    platform: "douyin" | "xiaohongshu" | "bilibili-short";
  };
  paper: {
    source: "arxiv";
    paperId: string;
    title: string;
  };
  theme: {
    id: string;
    paletteId: string;
    fontPackId: string;
  };
  voice: {
    provider: "edge-tts";
    name: string;
    rate: string;
    pitch: string;
    volume?: string;
  };
  scenes: ProductionScene[];
};

type ProductionScene = {
  id: string;
  type:
    | "hero"
    | "paper-intro"
    | "summary"
    | "bullet"
    | "image-focus"
    | "quote"
    | "ending";
  contentRef: string;
  narrationText: string;
  imagePrompt?: string;
  imageAssetId?: string;
  backgroundPresetId: string;
  motionPresetId: string;
  durationStrategy: "auto-by-audio" | "fixed";
  fixedDurationMs?: number;
};
```

---

## 6. Render Manifest 结构

这是给 Remotion 的最终输入，必须是确定性的。

```ts
type RenderManifest = {
  projectId: string;
  seed: number;
  fps: number;
  width: number;
  height: number;
  totalFrames: number;
  theme: RenderTheme;
  scenes: RenderScene[];
  audioAssets: AudioAsset[];
  imageAssets: ImageAsset[];
};

type RenderScene = {
  id: string;
  type: string;
  fromFrame: number;
  durationInFrames: number;
  backgroundPresetId: string;
  motionPresetId: string;
  imageAssetIds: string[];
  audioSegmentIds: string[];
  subtitleSegmentIds: string[];
  content: Record<string, unknown>;
  timing: SceneTiming;
};
```

关键要求：

1. 每个场景的 `fromFrame` 和 `durationInFrames` 都必须已算好。
2. 图片、音频、字幕都不能在 Remotion 渲染时再做不稳定计算。

---

## 7. Audio Meta 结构

```ts
type AudioAsset = {
  id: string;
  filePath: string;
  durationMs: number;
  sampleRate?: number;
  sceneId: string;
  segments: AudioSegment[];
};

type AudioSegment = {
  id: string;
  text: string;
  startMs: number;
  endMs: number;
  role: "narration" | "subtitle";
};
```

说明：

1. MVP 可以先做到句子级分段。
2. 如果后续拿到更精细的词级时间戳，可以兼容扩展。

---

## 8. Timeline 模型

建议 timeline 分三层：

1. 场景层 timeline
2. 句子层 timeline
3. 特效层 timeline

### 8.1 场景层

```ts
type SceneTiming = {
  enterFrames: number;
  holdFrames: number;
  exitFrames: number;
  audioOffsetFrames: number;
};
```

公式：

```ts
durationInFrames =
  enterFrames + holdFrames + exitFrames
```

### 8.2 句子层

```ts
type SubtitleSegment = {
  id: string;
  sceneId: string;
  text: string;
  startFrame: number;
  endFrame: number;
  emphasisLevel?: number;
};
```

### 8.3 特效层

```ts
type FxCue = {
  id: string;
  sceneId: string;
  type: "background-pulse" | "word-highlight" | "camera-push";
  startFrame: number;
  endFrame: number;
  intensity: number;
};
```

---

## 9. 时间换算规则

统一规则：

```ts
frames = Math.round((ms / 1000) * fps);
```

建议：

1. 整个项目只保留 `ms` 和 `frame` 两种时间单位。
2. 音频元数据层以 `ms` 为主。
3. Remotion 渲染层以 `frame` 为主。

---

## 10. 场景时长计算策略

MVP 推荐公式：

```ts
sceneDurationMs =
  audioDurationMs + enterBufferMs + exitBufferMs;
```

推荐默认值：

1. `enterBufferMs = 300`
2. `exitBufferMs = 400`
3. `minimumSceneDurationMs = 2500`

最终逻辑：

```ts
sceneDurationMs = Math.max(
  minimumSceneDurationMs,
  audioDurationMs + enterBufferMs + exitBufferMs
);
```

---

## 11. 随机化落点

可以随机，但必须在 `production manifest` 阶段完成：

1. 场景模板类型
2. 背景预设
3. 动效预设
4. 配色方案
5. 图片布局方式

不能在 `render manifest` 或 Remotion 渲染阶段再随机。

---

## 12. 校验规则

建议增加 schema 校验：

1. 每个 scene 必须有 `id`
2. 每个 scene 必须有 `narrationText`
3. `audioSegmentIds` 必须都存在于 `audioAssets`
4. `imageAssetIds` 必须都存在于 `imageAssets`
5. 所有 scene 的时间范围不能重叠
6. `totalFrames` 必须等于最后一个 scene 的结束帧

---

## 13. MVP 必须实现的最小字段

首版可以先只实现：

1. 论文基础信息
2. 5 种以内的场景类型
3. 句子级字幕分段
4. 单音轨旁白
5. 单图或双图布局
6. 单主题体系

这样可以先跑通完整链路，再逐步扩展。
