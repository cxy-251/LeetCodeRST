# AI_TODO

## 使用规则

- Codex 每次开始工作前，必须先阅读本文件。
- 只执行状态为 `[TODO]` 的任务。
- 每次最多执行 1 个任务，除非用户明确要求多个。
- 执行前，把任务状态改为 `[DOING]`。
- 执行完成后，把任务状态改为 `[DONE]`，并填写完成说明。
- 如果无法完成，把任务状态改为 `[BLOCKED]`，并写明原因。
- 不要删除历史任务。
- 不要擅自新增大范围任务。
- 如果发现新问题，可以追加到「发现的问题」区域。

---

## 任务列表

### T001 拆分 `App.service.ts`

状态：`[TODO]`

目标：

当前 `App.service.ts` 文件职责过多，里面混合了常量、数据加载函数、路由配置、manifest 构建逻辑、stage model 构建逻辑、effect 相关函数等内容。

请在不改变现有功能、不改变外部行为、不破坏 TypeScript 类型检查的前提下，将 `App.service.ts` 拆分为多个职责更清晰的模块。

要求：

1. 保持功能完全等价。

   - 不改变现有页面路径。
   - 不改变 manifest 加载逻辑。
   - 不改变 effect preview 行为。
   - 不改变 template preview 行为。
   - 不改变现有业务逻辑。
   - 不做额外架构重写。

2. 建议拆分为以下文件：

   ```txt
   App.constants.ts
   App.loaders.ts
   App.routes.ts
   App.previewManifest.ts
   App.stageModel.ts
   App.effects.ts
   App.service.ts
   ```

3. 各文件职责建议：

   ```txt
   App.constants.ts
   - EFFECT_LAB_RENDER_WIDTH
   - EFFECT_LAB_RENDER_HEIGHT

   App.loaders.ts
   - fetchJson
   - resolveWorkspacePath
   - buildLocalAssetSrc
   - loadLatestManifest
   - loadLatestProductionManifest
   - loadLatestContentProfileRegistry
   - loadLatestContentProfileDocument
   - loadDefaultProductionManifest
   - loadDefaultContentProfileRegistry
   - loadDefaultContentProfileDocument
   - loadContentProfileRegistry
   - loadContentProfileDocument
   - loadTemplateDocument
   - loadLatestRenderManifest
   - loadDefaultManifest

   App.routes.ts
   - templateRoutes
   - effectRoutes
   - legacyRedirects
   - routeCollections
   - resolveInitialPath
   - findRoutes

   App.previewManifest.ts
   - buildSceneSubtitles
   - resolveContentProfileOptions
   - resolveContentProfilePath
   - createTemplatePreviewManifest

   App.stageModel.ts
   - resolveTemplateLayout
   - createTemplateStageModel
   - createEffectStageModel

   App.effects.ts
   - getEffectStartLabel
   - findEffectScene
   - getEffectDefinition
   - getSceneLabel
   - getCoverImageSrc
   - isLoadingState
   - formatSeconds
   - effectProfileOptions
   ```

4. `App.service.ts` 保留为 barrel 文件。

   目的：保持原有 import 兼容，避免大规模修改引用。

   示例：

   ```ts
   export * from "./App.constants";
   export * from "./App.loaders";
   export * from "./App.routes";
   export * from "./App.previewManifest";
   export * from "./App.stageModel";
   export * from "./App.effects";
   ```

5. 导出规则：

   * 如果函数只在当前模块内部使用，不要导出。
   * `fetchJson` 如果只在 `App.loaders.ts` 内部使用，不要导出。
   * `resolveWorkspacePath` 如果只在 `App.loaders.ts` 内部使用，不要导出。
   * `buildSceneSubtitles` 如果只在 `App.previewManifest.ts` 内部使用，不要导出。
   * 如果某些函数已经被其他文件直接引用，则保持导出，或通过 `App.service.ts` 重新导出。
   * 所有 type import 必须跟随函数移动到对应文件。
   * 不要引入循环依赖。

6. 验证要求：

   重构完成后，请执行项目中已有的验证命令，例如：

   * TypeScript 类型检查
   * lint
   * test
   * build

   如果没有找到对应命令，请在完成记录中说明。

验收标准：

* `App.service.ts` 不再堆放所有实现逻辑，只作为统一导出入口。
* 原有从 `App.service.ts` import 的代码仍然可用。
* TypeScript 类型检查通过。
* 项目可以正常启动或构建。
* 没有改变业务逻辑。
* 没有顺手做无关重构。

完成记录：

* 完成时间：
* 修改文件：
* 验证命令：
* 验证结果：
* 备注：

---

## 发现的问题

* 暂无

### T002 暂无

### T003 修复 donut 论文批量链路并提升本地模型总结质量

状态：`[DONE]`

目标：

1. 修复 `npm run produce:paper-urls:donut -- --paper-url-csv ...` 在本地运行时出现的：
   - arXiv `429`
   - LM Studio `missing bullets`
   - `edge-tts` 偶发超时导致整批失败
2. 提升本地 `LM Studio` 文案质量，让短视频文案能更直接表达论文核心技术点，而不是只做空泛概括。

完成记录：

* 完成时间：2026-05-06
* 修改文件：
  * `tools/lib/arxiv.ts`
  * `tools/fetch-arxiv-ai.ts`
  * `tools/generate-audio.ts`
  * `services/summarizer/lm-studio.service.ts`
  * `services/summarizer/rule-based-summary.service.ts`
  * `services/summarizer/summarize-paper.service.ts`
  * `services/summarizer/summary-polish.service.ts`
  * `docs/video-production-manual.md`
  * `docs/project-status-handoff.md`
* 验证命令：
  * `npm run build`
  * `node --import tsx tools/analyze-paper-sources.ts --input data/source-bundles/generated/paper-url-single-20260429-124630.json --output /tmp/paper-summary-quality-check-6.json --summary-mode lm-studio`
  * `npm run produce:paper-urls:donut -- --paper-url-csv data/papers/paper-urls.csv`
* 验证结果：
  * 构建通过
  * 本地 `LM Studio` 能生成更具体的 `method/value`
  * donut 批量命令整条链路可跑通并产出视频
* 备注：
  * 本任务为用户明确指定任务，因此未执行 `T001`
