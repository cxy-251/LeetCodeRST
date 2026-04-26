# PaperToVideo MVP 初始化与任务拆分

## 1. MVP 目标

在首个可运行版本中，实现下面这条最小链路：

1. 输入一篇 arXiv AI 论文信息
2. 生成中文总结脚本
3. 生成对应图片提示词
4. 组织成网页幻灯片
5. 生成中文配音
6. 输出一条竖屏短视频

---

## 2. 建议的首批目录职责

### `apps/editor-web`

用于本地预览网页幻灯片与模板调试。

### `apps/video-renderer`

用于承载 Remotion Composition 与视频导出入口。

### `packages/shared-types`

放公共 TypeScript 类型，包括：

1. `PaperSource`
2. `ContentBrief`
3. `ProductionManifest`
4. `RenderManifest`

### `packages/ui-templates`

放页面模板组件：

1. `HeroScene`
2. `PaperIntroScene`
3. `BulletScene`
4. `EndingScene`

### `packages/webgl-backgrounds`

放可复用背景：

1. `AuroraBackground`
2. `ParticlesBackground`

### `services/paper-ingest`

负责拉取 arXiv 论文元数据并转换为统一结构。

### `services/summarizer`

负责 AI 总结、脚本生成、提示词生成。

### `services/image-provider`

负责根据提示词拿到图片资源。

### `services/tts-python`

负责调用 `edge-tts` 生成音频与音频元数据。

---

## 3. 开发顺序

### 阶段 A：数据结构先行

1. 定义 shared types
2. 定义 manifest 示例文件
3. 定义本地数据目录规范

### 阶段 B：内容管线跑通

1. 实现 paper ingest 输入输出格式
2. 实现 summarizer 的统一接口
3. 实现 image provider 的统一接口

### 阶段 C：渲染链路跑通

1. 实现基础 React 幻灯片模板
2. 实现 Remotion 读取 render manifest
3. 实现 TTS 音频挂载
4. 实现基础字幕与背景特效

### 阶段 D：系统化增强

1. seed 随机复现
2. 多模板组合
3. 句子级同步
4. 多平台输出参数

---

## 4. 当前建议先做的工程动作

1. 初始化 Monorepo 根配置
2. 放置 `shared-types` 占位定义
3. 放置 `data/manifests/demo-paper.json`
4. 放置 Python TTS 服务骨架
5. 放置工具脚本入口占位文件

---

## 5. 验收标准

MVP 完成时，至少应满足：

1. 目录结构稳定
2. 数据结构清晰
3. 单篇论文可产出一条视频
4. 页面、图片、语音、背景特效都可替换
