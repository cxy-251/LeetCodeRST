# PaperToVideo 模块化论文视频系统方案

## 1. 目标定义

本项目的初始目标，不只是“网页文字版视频生成”，而是搭建一个从论文内容到短视频成片的完整生产系统。

目标流程如下：

1. 从 arXiv 的 AI 相关论文来源中获取候选论文。
2. 使用 AI 对论文进行摘要、提炼亮点、整理适合短视频传播的文案结构。
3. 为每个内容片段匹配或生成 AI 图片。
4. 用 React 生成组件化网页幻灯片页面。
5. 用 WebGL 提供可复用的动态背景特效。
6. 用 Edge TTS 将讲解文本转成朗读音频。
7. 用 Remotion 将网页内容、图片、音频、动效组合并渲染为 MP4。
8. 生成适合短视频平台发布的竖屏视频。

最终目标是形成一个可复用、可扩展的“论文内容生产基础平台”，后续在该基础上继续扩展新的内容来源、镜头模板、旁白风格、图片策略、发布渠道等模块。

---

## 2. 需求合理性评估与修正建议

结论：需求总体合理，可实施，但需要明确边界和分阶段落地方式。

当前需求里最容易混淆的是三件事：

1. “论文总结系统”
2. “网页幻灯片生成系统”
3. “视频渲染系统”

如果这三部分不拆开，后续会很快变成一个高耦合项目，扩展性差。基于你的真实目标，建议把原需求修正为如下表达：

### 2.1 修正后的产品目标

系统输入不是单纯的“文本”，而是：

1. 论文来源信息
2. 论文原始内容或摘要
3. 视频风格配置
4. 配音配置
5. 图片策略配置

系统输出不是单纯的“网页”，而是：

1. 一份结构化的内容清单
2. 一套可预览的网页幻灯片
3. 一条带旁白、带背景特效、音画同步的 MP4 视频

### 2.2 对需求的结构化拆分

建议把首版需求拆成五个模块域：

1. `paper-ingestion`：论文获取与标准化
2. `ai-summarization`：论文总结与脚本生成
3. `visual-asset-generation`：配图生成与图片资源管理
4. `slide-composition`：React 幻灯片拼装
5. `video-rendering`：音频、动效、Remotion 导出

### 2.3 需求里需要特别补充的约束

为了避免后面返工，建议从现在开始明确以下约束：

1. 首版聚焦 arXiv AI 板块，不做全站任意学科。
2. 首版以“单篇论文 -> 单条短视频”为主，不先做多论文合集。
3. 首版先支持竖屏视频，例如 `1080x1920`。
4. 首版先支持中文总结与中文配音。
5. 图片模块要抽象成 provider，避免后续被单一图片生成方案绑死。
6. 发布到短视频平台的动作首版不一定自动化，但输出规格要为平台适配预留。

---

## 3. 可实施性结论

结论：可实施，且技术组合是合理的。

原因如下：

1. `React` 适合做组件化页面、模板复用、数据驱动拼装，也适合做幻灯片式网页预览。
2. `Remotion` 适合把 React 页面直接作为视频场景渲染，天然适合“网页幻灯片转 MP4”。
3. `WebGL` 适合承担背景层，不建议承载主要文字布局；文字和图片内容层仍由 React DOM 控制，复杂度最低。
4. `Python + edge-tts` 适合做 TTS 预处理服务或离线音频生成器，稳定且易批处理。
5. AI 总结、图片生成、页面随机组合、配音同步、镜头节奏控制都可以通过“统一 manifest + timeline 配置”完成。

但要注意：真正的难点已经从“网页拼装”升级成了“内容管线 + 时间轴编排 + 素材管理 + 视频渲染”四件事情的协同。因此架构上必须把“论文内容处理”和“视频表现层”彻底解耦。

---

## 4. 核心设计原则

### 3.1 内容与渲染解耦

必须把项目拆成五层：

1. 论文来源层：论文抓取、筛选、标准化。
2. 内容生成层：标题、摘要、亮点、脚本、旁白文本、图片提示词。
3. 模板组件层：标题页、段落页、对比页、引用页、结尾页等 React 组件。
4. 编排时间层：每个页面出现多久、何时切场、何时触发字幕或强调动效。
5. 输出渲染层：图片就位、音频生成、Remotion 合成、MP4 导出。

这样后续替换模板、背景、配音、主题风格时，不需要重写整个系统。

### 3.2 WebGL 只负责视觉氛围

建议 WebGL 作为页面最底层背景，负责：

1. 粒子流动
2. 渐变噪声
3. 波纹或光晕
4. 视差浮动
5. 简单的交互式镜头移动模拟

不建议第一阶段就让 WebGL 直接渲染正文文字，否则调试成本高，和 Remotion 集成也更容易出兼容问题。

### 3.3 统一时间轴是项目核心

所有东西都应围绕一个统一的 `timeline` 配置：

1. 某段文字从第几帧开始出现。
2. 某个镜头持续多少帧。
3. 背景特效在哪一段增强或减弱。
4. 音频在哪个时间点开始播放。
5. 某句话对应哪个字幕块或强调动画。

如果没有统一时间轴，后面“朗读音频与页面动效配合”会非常难维护。

---

## 5. 推荐总体架构

建议采用 Monorepo 结构，把前端、渲染、脚本、配置分离。

### 4.1 技术组合建议

1. 前端与模板：`React + TypeScript + Vite`
2. 视频渲染：`Remotion`
3. 背景特效：`react-three-fiber` 或原生 `Three.js/WebGL`
4. TTS 管线：`Python + edge-tts`
5. 论文处理与 AI 调度：`Python` 或 `Node.js` 均可，首版建议 Python 为主
6. 任务编排：Node.js 脚本统一调度
7. 配置存储：`JSON / YAML`

说明：

1. 如果想让 WebGL 与 React 更顺滑集成，第一版建议优先 `react-three-fiber`。
2. 如果更强调 shader 自定义，可在背景模块中直接封装 `Three.js + GLSL`。
3. 如果后续需要批量生成多个视频，建议再加一个 `job` 层。

---

## 6. 推荐目录结构

```text
02codeX/
  docs/
    modular-video-system-plan.md
  apps/
    editor-web/              # React 页面预览、模板调试、配置可视化
    video-renderer/          # Remotion 入口、Composition、视频导出
  packages/
    content-pipeline/        # 论文内容标准化、脚本组装、随机组合
    ui-templates/            # 各类页面模板组件
    motion-presets/          # 页面入场、退场、强调、字幕等动效
    webgl-backgrounds/       # WebGL 背景模块
    timeline-engine/         # 时间轴、片段编排、随机组合逻辑
    shared-types/            # 公共类型定义
    theme-system/            # 颜色、字体、间距、主题令牌
  services/
    paper-ingest/            # 论文抓取、元数据解析、原文标准化
    summarizer/              # AI 总结、脚本生成、提示词生成
    image-provider/          # AI 图片生成或图片获取的抽象层
    tts-python/              # Python edge-tts 脚本与服务
  data/
    papers/                  # 原始论文元数据、摘要、缓存
    scripts/                 # 输入文案
    prompts/                 # 图片提示词与总结提示词
    manifests/               # 生成任务配置
    generated-images/        # AI 图片输出
    generated-audio/         # TTS 输出
    generated-meta/          # 语速、时长、分段等元数据
  tools/
    build-video.ts           # 总调度脚本
    generate-audio.ts        # 调用 Python TTS
    compose-manifest.ts      # 内容转时间轴配置
  output/
    previews/
    videos/
```

---

## 7. 模块拆分方案

### 7.1 论文获取与总结模块

这部分是你补充后的真实入口，必须前置设计。

建议最小能力包括：

1. 输入 arXiv 论文链接或 arXiv id。
2. 拉取标题、作者、摘要、分类、发布时间、pdf 链接。
3. 对原始内容做统一标准化。
4. 调用 AI 生成：
   1. 一句话总结
   2. 面向短视频的口语化脚本
   3. 幻灯片文案
   4. 配图提示词

建议不要把“总结结果”直接写进 React 组件，而是先落成结构化 JSON。

### 7.2 图片生成模块

图片模块建议做成 provider 接口，不和某一个图像模型强绑定。

首版职责：

1. 接收每页或每段的图片提示词。
2. 生成或获取图片资源。
3. 输出图片路径、比例信息、风格标签。
4. 允许失败回退到占位图或论文封面图。

统一抽象示意：

```ts
type ImageAsset = {
  id: string;
  prompt: string;
  localPath: string;
  width?: number;
  height?: number;
  provider: string;
  styleTag?: string;
};
```

### 6.1 React 页面模板模块

目标：把“文字视频页面”做成可拼接的组件库。

建议模板类型：

1. `HeroScene`：主标题页
2. `ParagraphScene`：单段重点文案页
3. `BulletScene`：列表页
4. `QuoteScene`：引用页
5. `CompareScene`：左右对比页
6. `StatsScene`：数字强调页
7. `EndingScene`：结尾总结页

每个场景组件只做三件事：

1. 接收结构化内容数据。
2. 接收视觉主题参数。
3. 接收时间轴状态并基于当前帧渲染动画。

建议统一接口：

```ts
type SceneProps<TContent> = {
  content: TContent;
  theme: ThemeTokenSet;
  timing: SceneTiming;
  progress: {
    sceneFrame: number;
    sceneDuration: number;
    enterProgress: number;
    exitProgress: number;
  };
};
```

这样后续新增模板时不会影响渲染主流程。

### 7.3 页面拼接模块

不要让页面直接互相引用，应增加一个“编排器”：

1. 输入：论文总结脚本、图片素材、风格配置、随机种子。
2. 输出：场景数组 `SceneDefinition[]`。

例如：

```ts
type SceneDefinition = {
  id: string;
  type: "hero" | "paragraph" | "bullet" | "quote" | "ending";
  durationInFrames: number;
  content: unknown;
  motionPresetId: string;
  backgroundPresetId: string;
  audioSegmentId?: string;
};
```

这层负责“把内容转成视频结构”，是实现随机组合的关键。

### 7.4 Remotion 渲染模块

Remotion 层负责：

1. 读取 `SceneDefinition[]`
2. 根据每个场景的持续时长顺序拼接
3. 挂载背景层、内容层、字幕层、音频层
4. 输出 MP4

建议结构：

1. `RootComposition`
2. `SceneTrack`
3. `AudioTrack`
4. `SubtitleTrack`
5. `FxTrack`

这样后续可以把字幕、特效、背景增强从页面模板里剥离出来，保持场景组件专注内容表现。

### 7.5 WebGL 背景模块

建议将 WebGL 背景模块做成可插拔背景预设：

1. `AuroraBackground`
2. `ParticlesBackground`
3. `WaveFieldBackground`
4. `NoiseGradientBackground`
5. `GridPulseBackground`

统一接口：

```ts
type BackgroundProps = {
  palette: string[];
  intensity: number;
  progress: number;
  audioReactive?: number;
  seed?: number;
};
```

注意事项：

1. 背景必须支持离屏稳定渲染，避免依赖真实用户交互。
2. 背景计算量不要过高，否则 Remotion 渲染速度会显著下降。
3. 第一版优先做“视觉稳定”和“可参数化”，不要先追求超复杂 shader。

### 7.6 Python Edge TTS 模块

建议做成独立服务或脚本模块，不要直接耦合进 React。

输入：

1. 文本
2. voice 名称
3. rate
4. pitch
5. output path

输出：

1. `mp3` 或 `wav`
2. 对应的时长数据
3. 可选：句子级或段落级切分信息

推荐输出元数据：

```json
{
  "audioFile": "data/generated-audio/scene-001.mp3",
  "durationMs": 4280,
  "segments": [
    {
      "text": "第一句",
      "startMs": 0,
      "endMs": 1600
    },
    {
      "text": "第二句",
      "startMs": 1600,
      "endMs": 4280
    }
  ]
}
```

这份元数据后续可以直接喂给字幕和强调动画。

---

## 8. 随机组合机制设计

随机组合不能只是“随机挑模板”，否则很容易出现风格和节奏失控。建议分三层随机：

### 7.1 内容结构随机

根据脚本长度和内容标签，生成不同的场景排列，例如：

1. `标题 -> 段落 -> 列表 -> 总结`
2. `标题 -> 引用 -> 对比 -> 段落 -> 总结`
3. `标题 -> 数字强调 -> 段落 -> 段落 -> 结尾`

规则应受控，而不是完全自由随机。

### 7.2 视觉样式随机

随机组合以下内容，但要受主题约束：

1. 字体组
2. 主色与辅助色
3. 背景特效类型
4. 入场动效预设
5. 字幕样式

建议使用 `theme seed`，保证“同一个 seed 可复现相同结果”。

### 7.3 节奏参数随机

可随机但有边界：

1. 页面停留时长浮动
2. 元素逐字/逐行出现节奏
3. 背景波动强弱
4. 镜头推进幅度

建议所有随机参数最终都写入 manifest，避免一次生成和二次渲染结果不一致。

---

## 9. 音频与页面动效同步方案

这是最关键部分，建议按“句子级同步”实现，而不是按字同步起步。

### 8.1 第一阶段：段落级同步

最容易落地：

1. 一页对应一段音频。
2. 页面开场后立即播放该段音频。
3. 文案按句子或分组依次出现。

优点：

1. 实现快
2. 稳定
3. 足够做 MVP

### 8.2 第二阶段：句子级同步

做法：

1. TTS 前先做句子切分。
2. 每句生成时间区间。
3. 动画触发点绑定到句子开始时间。

可实现效果：

1. 句子朗读到哪里，页面哪里高亮
2. 当前句放大、变色、描边
3. 字幕逐句切换

### 8.3 第三阶段：词级或字级同步

理论可做，但不建议第一版上线就做。

原因：

1. `edge-tts` 本身更适合快速出音频，不一定天然提供稳定到词级的精确时间戳。
2. 精细到词级后，文本渲染、布局抖动、性能问题都会增加。

建议路线：

1. MVP：段落级
2. V2：句子级
3. V3：词级高亮

---

## 10. 内容数据结构建议

建议统一用一个 `manifest` 描述一次视频任务。

示例：

```json
{
  "projectId": "demo-001",
  "seed": 42,
  "fps": 30,
  "width": 1080,
  "height": 1920,
  "paper": {
    "source": "arxiv",
    "paperId": "2501.12345",
    "title": "Example Paper Title"
  },
  "theme": {
    "id": "clean-tech"
  },
  "voice": {
    "name": "zh-CN-XiaoxiaoNeural",
    "rate": "+0%",
    "pitch": "+0Hz"
  },
  "scenes": [
    {
      "id": "scene-001",
      "type": "hero",
      "content": {
        "title": "这是标题",
        "subtitle": "这是副标题"
      },
      "backgroundPresetId": "aurora",
      "motionPresetId": "fade-up",
      "imageAssetIds": ["image-001"],
      "audioText": "这是标题，这是副标题。",
      "durationStrategy": "auto-by-audio"
    }
  ]
}
```

说明：

1. `manifest` 是唯一可信输入。
2. 所有随机结果和自动计算结果最终都回写到 manifest 或派生文件。
3. Remotion 只消费“已确定”的 manifest，不在渲染阶段做不稳定决策。

---

## 11. 渲染流程设计

推荐完整流程如下：

1. 获取论文元数据与摘要。
2. 调用 AI 生成口语化视频脚本、幻灯片文案、配图提示词。
3. 生成或收集每个场景的图片素材。
4. 通过 `compose-manifest` 把脚本与图片拆成场景。
5. 为每个场景调用 Python `edge-tts` 生成音频与时长元数据。
6. 根据音频时长回填每个场景时长。
7. 生成最终 `render-manifest.json`。
8. Remotion 读取 `render-manifest.json`。
9. 组合背景、页面、字幕、音频、图片。
10. 渲染输出 MP4。

建议将“音频生成”和“视频渲染”拆成两个独立步骤，便于复用和排查问题。

---

## 12. 关键难点与应对方案

### 12.1 难点：AI 总结结果不稳定

问题：

1. 总结长度可能忽长忽短。
2. 口语化脚本可能不适合直接配音。
3. 幻灯片文案和旁白文案可能风格不一致。

建议：

1. 把 AI 输出拆成明确字段，而不是一段自由文本。
2. 为每种输出单独设计 prompt 模板。
3. 在进入渲染层前加一个 schema 校验步骤。

### 12.2 难点：Remotion 与 WebGL 的稳定渲染

问题：

1. 某些 WebGL 动画在浏览器预览正常，但离屏渲染时帧不一致。
2. 高负载 shader 会拖慢视频导出速度。

建议：

1. 第一版优先使用简单、确定性的 shader。
2. 所有噪声、随机数都基于 seed。
3. 不依赖实时输入设备数据。

### 12.3 难点：音频时长与页面时长对齐

问题：

1. 页面过短会导致音频被切断。
2. 页面过长会造成空镜头停留。

建议：

1. 由音频时长反推场景时长。
2. 给每个场景增加最小前奏和结尾缓冲。
3. 统一公式：

```ts
sceneDuration = audioDuration + enterBuffer + exitBuffer;
```

### 12.4 难点：随机组合后的风格失控

问题：

1. 某些模板和背景不匹配。
2. 某些动效组合会显得杂乱。

建议：

1. 建立“兼容性矩阵”。
2. 通过主题系统限制可组合范围。
3. 随机不是完全开放，而是“规则内随机”。

---

## 13. 实施阶段建议

### 阶段 1：MVP

目标：先跑通完整链路。

范围：

1. 支持单篇 arXiv 论文输入
2. 基础论文摘要与脚本生成
3. 3 到 4 个 React 页面模板
4. 1 到 2 个图片位布局模板
5. 2 个 WebGL 背景
6. Python `edge-tts` 音频生成
7. Remotion 合成 MP4
8. 段落级音频同步
9. 一个基础 manifest 生成器

产出：

1. 可以输入一篇 arXiv AI 论文，输出一条竖屏论文总结短视频
2. 支持固定模板组合，不要求高级随机
3. 配图先支持单 provider 或占位资源回退

### 阶段 2：模块复用化

范围：

1. 扩展更多页面模板
2. 增加主题系统
3. 背景、动效参数化
4. 完善目录结构和类型系统
5. 支持 seed 随机复现

产出：

1. 同一篇论文可以生成多个视觉版本
2. 模块可以复用到不同内容生产项目

### 阶段 3：高级同步与批量生成

范围：

1. 句子级同步
2. 字幕轨道
3. 批量任务生成
4. 多 voice 风格
5. 更细的时间轴调优工具

---

## 14. 推荐的首版实现策略

建议不要一开始就做成“完整可视化编辑器”，而是先做“配置驱动系统”。

推荐顺序：

1. 先定义论文输入、脚本输出、`manifest` 与时间轴的数据结构。
2. 再打通单篇论文到结构化 JSON 的流程。
3. 再写 3 个最核心的页面模板。
4. 接着打通 Python `edge-tts` 音频生成。
5. 再做 Remotion Composition 读取 manifest。
6. 最后补 WebGL 背景、图片 provider 与随机组合。

原因：

1. 时间轴和数据结构先稳住，后续扩展最轻松。
2. 先通流程，再美化视觉，风险更低。
3. 如果一开始先堆视觉效果，很容易拖慢整体进度。

---

## 15. 是否建议现在就开工

建议可以直接开始，且优先做 MVP。

从工程角度看，这个项目是可落地的，但前提是我们从第一天就按“模块化 + 配置驱动 + 统一时间轴”来做，而不是边写页面边拼逻辑。

如果下一步继续推进，建议立刻进入以下动作：

1. 初始化 Monorepo 目录。
2. 定义 `manifest`、`scene`、`theme`、`audio-meta` 类型。
3. 建立 React 模板包与 Remotion 渲染入口。
4. 建立 Python `edge-tts` 服务脚本。
5. 做一个最小可运行 demo。

---

## 16. 我建议的下一份文档

在本方案之后，最值得马上补的不是 UI 图，而是下面两份技术文档：

1. `manifest` 与时间轴的数据结构设计文档
2. MVP 目录初始化与任务拆分文档

如果继续，我下一步可以直接把这两个文档也写出来，并顺手把项目骨架目录一起初始化。
