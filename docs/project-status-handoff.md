# PaperToVideo 项目状态交接

## 1. 项目位置

- 工作目录：`/Users/cxy251/Code/02codeX`
- GitHub 仓库：`https://github.com/cxy-251/paperToVideo.git`
- 当前分支：`main`

---

## 2. 当前推荐命令

### 标准整条链路

```bash
npm run produce:video
```

### 使用本地真人图案例

```bash
npm run produce:video data/manifests/demo-paper.local.json
```

说明：

1. `demo-paper.local.json` 是用户当前实际使用的版本。
2. 该文件和相关真人图资产只在本地生效，不上传 GitHub。

### 分步执行

```bash
npm run compose:manifest
npm run generate:audio
npm run render:video
```

---

## 3. 用户当前实际使用的配置

用户当前明确说明：

1. 实际使用的是本地专用配置 `data/manifests/demo-paper.local.json`
2. 本地真人图只做本地使用，不上传 GitHub

本地专用资源包括：

- `data/manifests/demo-paper.local.json`
- `data/images/case-beauty-portrait-source.jpeg`
- `data/images/case-beauty-portrait-9x16.jpg`
- 根目录原始文件 `large-1760723512-2370bb8a2f7bdc27e8d0eac60e925c4a.jpeg`

这些文件已写入本地 `.git/info/exclude`，不会进入远端仓库。

---

## 4. 已完成能力

### 基础链路

1. React 组件化页面
2. Remotion 视频渲染入口
3. Python `edge-tts` 语音生成
4. Node 调度脚本

### 工程组织

1. run 级别产物目录
2. `output/latest-run.json`
3. `output/video-runs.csv`
4. 每次视频生成一条台账记录

### 时间轴与配音

1. 真实音频时长通过 `ffprobe` 回写
2. 语速默认值已调到 `+80%`
3. 字幕已从整段改为句级/短分句
4. 音频按 scene 时间点播放

### 背景系统

1. `coverImage` 已接入 manifest
2. 首页支持本地/远程封面图
3. 背景系统已开始从“单一 background preset”拆成模块化结构：
   - `backgroundImageLayoutId`
   - `backgroundEffectId`
   - 文本层保持独立
4. 其他页已接入封面图象限布局机制：
   - `cover-focus-tl`
   - `cover-focus-tr`
   - `cover-focus-br`
   - `cover-focus-bl`
5. 当前已支持的 effect preset：
   - `aurora`
   - `grid-drift`
   - `noise-bloom`
   - `cellular-life`
6. `cellular-life` 当前是“生命游戏风格”的显式块状原型层，已独立于背景图层存在，后续可继续换成真正的 WebGL/shader 实现
5. 已加入本地真人图案例，并裁切出适配手机竖屏的版本：
   - `data/images/case-beauty-portrait-9x16.jpg`
7. `editor-web` 已改为优先读取 `output/latest-run.json` 指向的最新 `render-manifest.json`，不再只盯住旧的固定 demo manifest
8. 非 hero 页面背景策略已调整为：
   - 以首页图轻度虚化作为主底图
   - 动效层压在背景图之上
   - 文本层压在动效之上
9. 之前为了强化识别度加入的人像残影层已移除，因为它会干扰“轻虚化底图 + 上层动效”的目标视觉结构
10. 根据用户最新反馈，非 hero 页面底图已再次从“较重虚化”收紧为“更轻的虚化 + 更高可辨识度”
11. `cellular-life` 的上层动效已从细碎纹理改成更明显的块状 / 网格色块表达，方便快速看出动效层存在
12. 最新 local manifest 已开始显式声明每页的背景布局与 effect 组合，不再只依赖旧的 `backgroundPresetId`
13. 生命游戏 effect 已从“每个 scene 自己局部计算”改成“基于全片绝对时间轴的连续 effect 轨道”
14. 第 2 页已改为 `cellular-launch` 启动场景；第 3 页及后续页面会沿用同一条生命游戏轨道继续演化，不再按 scene 重置
15. 背景图布局已改为 scene 内插值运动，不再只是静态切换象限取景
16. 生命游戏网格密度已进一步提高，当前版本改为更细小的全屏细胞块，而不是大块砖格
17. 生命游戏边界规则已改为环绕式拓展，细胞碰到边缘会从另一侧继续传播
18. 背景图运动已从 `object-position` 弱位移改成“大图平移取景”，便于直接看出页面间坐标滑动
19. 文本动效、背景运动、生命游戏参数已开始通过 `manifest.modules` 外置化，不再只写死在组件内部
20. 已新增模块 API 文档：
   - `docs/modular-visual-apis.md`
21. 当前 renderer 与 editor 都已经开始读取这套模块参数
22. 生命游戏 effect 已切换为 `Three.js + WebGL` 实现，不再由 SVG/DOM 承担主渲染
23. 文本动效已补上离场参数，当前支持进场 + 离场统一配置
24. 前景层已经开始按 Lego 架构拆成：
   - `atomic-ui` 原子组件库
   - `data/templates/*.json` 模板配置
   - `timeline-engine` 模板引擎
25. 当前 renderer/editor 的前景文本区已切到模板引擎输出，不再全部手写在 `Root.tsx` / `App.tsx`
26. `npm run compose:manifest` 已验证可正常读取模板 JSON，并将 `templateDocument` 写入最新 run 的 `render-manifest.json`
27. `editor-web` 已从单页预览改成“小型预览站点”结构：
   - `/` 作为索引首页
   - `/templates/latest` 读取最新 run
   - `/templates/demo` 读取仓库默认 demo
28. `editor-web` 已新增独立特效实验页分区：
   - 当前主入口收敛为 `/effects/life-game`
   - 旧路径会重定向到新的生命游戏入口页
29. 原子组件字号已从固定像素改成更偏容器友好的响应式尺寸，减少预览页在不同窗口下字号失衡的问题
30. 特效实验页已从“模板裁剪预览”进一步调整为“独立 effect atom 页面”方向：
   - 生命游戏可单独拉出成页面
   - 页面内可点击按钮启动
   - 目标是让贪吃蛇、扫雷、吃豆人等后续 WebGL 小游戏沿同一原子接口接入
31. 已新增 `EffectRuntimeAdapter` 作为“网页交互特效 -> 视频渲染特效”的转换层：
   - 网页端可交互运行
   - 视频端可按绝对帧自动运行
   - 同一个 effect atom 可同时服务 editor 与 Remotion
32. `npm install` 已补跑，workspace 包解析已恢复；`render:video` 不再报 `@paper-to-video/timeline-engine` 找不到，而是进入浏览器启动阶段
33. `tools/build-video.ts` 已补上 WebGL 更稳妥的默认渲染参数：
   - `--gl angle`
   - `--concurrency 2`
   并支持通过 `REMOTION_GL` / `REMOTION_CONCURRENCY` 覆盖
34. `ThreeLifeEffect` 当前坚持 `Three.js + WebGL` 路线，并改成显式尝试 `webgl2 / webgl / experimental-webgl`，同时降低上下文创建开销，以提高 editor 与视频渲染中的可用性
35. `apps/editor-web/src/App.tsx` 已按局部规范重构：
   - `App.tsx` 只做页面装配
   - `AppViews.tsx` 负责视图组件
   - `useEditorPreview.ts` 负责状态和交互
   - `App.service.ts` 负责文件读取与模型整理
   - `App.types.ts` 负责类型
   - `App.module.css` 负责样式
   - 旧的 `styles.css` 已移除
36. 当前活跃的生命游戏特效链路也已做同风格局部拆分：
   - `effect-atoms.tsx` 主要保留组件装配
   - `effect-atoms.types.ts` 负责类型
   - `effect-atoms.service.ts` 负责展示层辅助计算
   - `effect-atoms.module.css` 负责样式
   - `three-life-effect.tsx` 仅保留 canvas 组件外壳
   - `use-three-life-renderer.ts` 下沉 Three.js 生命周期与渲染逻辑

---

## 5. 当前仓库中的关键文件

### 配置与数据

- `data/manifests/demo-paper.json`
- `data/manifests/demo-paper.local.json`
- `data/templates/paper-digest-v1.json`
- `data/images/cover-portrait.svg`

### 运行脚本

- `tools/compose-manifest.ts`
- `tools/generate-audio.ts`
- `tools/build-video.ts`
- `tools/produce-video.ts`
- `tools/lib/run-artifacts.ts`

### 渲染入口

- `apps/video-renderer/src/index.tsx`
- `apps/video-renderer/src/Root.tsx`
- `apps/video-renderer/src/Video.tsx`

### Lego 架构

- `packages/atomic-ui/src/index.tsx`
- `packages/timeline-engine/src/index.tsx`
- `packages/content-pipeline/src/effect-atoms.tsx`
- `packages/content-pipeline/src/effect-runtime.tsx`
- `docs/lego-architecture.md`
- `docs/modular-visual-apis.md`

### 预览页

- `apps/editor-web/src/App.tsx`
- `apps/editor-web/src/styles.css`

---

## 6. 当前已知问题

### 最重要问题

用户最新反馈：

1. 首页已经能显示图片
2. 用户明确要求其他页面不要再保留“原来那种背景主导感”，而是要让首页图的轻虚化版本成为主背景
3. 用户要求明确把“背景图、动效、文本”拆成可独立替换的模块
4. 用户要求封面图按四象限循环移动：
   - 第 2 页左上
   - 第 3 页右上
   - 第 4 页右下
   - 第 5 页左下
   - 后续继续循环

用户明确说明：

- 使用的命令是本地配置版本，也就是 `demo-paper.local.json`

因此下一个接手者应优先排查：

1. `produce:video data/manifests/demo-paper.local.json` 是否真的把本地 manifest 传递到了整条链路
2. `output/latest-run.json` 指向的 run 是否来自 `demo-paper.local.json`
3. `render-manifest.json` 中的 `coverImage.path` 是否确实是 `data/images/case-beauty-portrait-9x16.jpg`
4. `apps/video-renderer/src/Root.tsx` 中 `cover-*` preset 是否在非 hero 页面真正走到了 cover-derived 分支
5. 之前 `editor-web` 没有稳定读取最新 run 的 local manifest 产物，这一层现已修正，但仍建议继续实机验证
6. 需要继续确认 Remotion 渲染产物是否稳定复用了最新 run 和最新 public 静态资源
7. 当前非 hero 页面的人像残影层已移除，改为更直接的“轻虚化封面图 + 上层动效”
8. 用户进一步指出：之前的虚化仍然偏重、上层动效不够明显，因此当前版本继续朝“更易辨认底图 + 更强块状动效”推进
9. 当前 `cellular-life` 已经拆成独立 effect 层，但仍属于“生命游戏风格原型”，还不是真正的 WebGL 版本
10. 最新 local run 已重新 compose 到 `20260427-071354`，用于验证 Three.js/WebGL 生命游戏、文本进出动效和参数外置化后的行为

### 视觉方向问题

虽然已经有 `cover-cellular-mask` 原型，但它当前仍然更像“基于首页图的细胞风格遮罩背景”，还不是严格意义上的“细胞自动机演化”。

另外，当前 `cover-cellular-mask` 的定位是：

1. 稳定可渲染原型
2. 用首页图轮廓做视觉遮罩
3. 先验证“人像驱动背景演化”的方向
4. 还没有真正进入有状态 cellular automata 演化

---

## 7. 下一步优先级

建议严格按这个顺序继续：

1. 继续把背景层和 effect 层也进一步模板化/组件化
2. 在 `atomic-ui` 中新增更多原子组件
3. 增加第二套、第三套模板 JSON，而不是只用 `paper-digest-v1`
4. 确认本地专用 manifest 在整条链路上稳定生效
5. 继续扩充更多 Three.js / WebGL effect 模块

---

## 9. 2026-04-27 Latest Fix

Current debugging focus returned to the real product goal:

1. `edge-tts` is confirmed by the user to work locally, so TTS is no longer treated as a product-code blocker.
2. The active issue is the `life-game` effect not appearing clearly in either the editor lab or final render.

Latest code changes:

1. Fixed the active `ThreeLifeEffect` camera update bug in `packages/content-pipeline/src/use-three-life-renderer.ts`.
   The orthographic camera was incorrectly updating `bottom = height`, which could collapse the visible render area during frame updates.
2. Disabled frustum culling on the instanced mesh so the cellular grid is not accidentally clipped after instance transforms.
3. Isolated the effect lab stage from the cover-image background in `apps/editor-web/src/App.service.ts`.
   The effect sandbox now uses a neutral dark gradient instead of the latest template cover image, making the WebGL middle layer easier to inspect by itself.

Expected outcome after this fix:

1. `/effects/life-game` should show the life simulation after clicking start, instead of appearing as only a pulsing button.
2. The same fix should also improve visibility of the life effect in the final Remotion video, because the broken camera update affected both environments.

---

## 10. 2026-04-27 Modular Tuning Pass

This pass focused on making the active visual system easier to tune from config rather than code.

What changed:

1. Added `modules.typography` so text sizes can now be adjusted externally from the manifest.
   Current configurable values are:
   - `kickerSize`
   - `titleSize`
   - `bodySize`
   - `bulletSize`
   - `subtitleSize`
2. Expanded `modules.cellularEffect` so life-game colors can be tuned externally.
   Current configurable values now include:
   - `primaryColor`
   - `secondaryColor`
   - `birthColor`
   - existing timing/grid parameters such as `activationDelayFrames`, `cellColumns`, `cellRows`, `stepEveryFrames`
3. Reduced life-game activation delay from `36` to `18` frames.
   Goal: let page 2 complete the launch-button beat and then start showing the life simulation inside the same scene, instead of only appearing from page 3 onward.
4. Added a second WebGL effect lab prototype: `/effects/snake-grid`.
   This is a deterministic Three.js grid-snake atom intended as the next reusable game-like middle-layer effect.

Validation:

1. `npx tsc --noEmit -p apps/editor-web/tsconfig.json`
2. `npx tsc --noEmit -p apps/video-renderer/tsconfig.json`

Next check after this pass:

1. Confirm text is visually large enough in both template preview and final render.
2. Confirm life-game now becomes visible within scene 2 after the launch button beat.
3. Review `/effects/snake-grid` as the baseline for the next effect family.

---

## 11. 2026-04-27 Dynamic Cue Timing Pass

This pass removed the remaining fixed-frame launch dependency from the life-game flow.

What changed:

1. `cellularEffect.activationDelayFrames` is no longer used as the driver for page-2 to page-3 activation handoff.
2. Launch timing is now computed from scene timing derived from narration audio duration.
   Specifically:
   - `interactionFrameOffset`
   - `effectStartFrameOffset`
   are written into `SceneTiming`.
3. The launch scene now computes its simulated click beat and effect-start beat from hold duration using configurable ratios and clamps.
4. `snake-grid` was upgraded from a drifting prototype to a deterministic food-seeking version:
   - food persists until eaten
   - the snake chooses the shortest wrapped path toward food
   - a new food target only spawns after successful consumption

New `modules.cellularEffect` timing controls:

- `launchClickRatio`
- `launchSettleRatio`
- `minLaunchClickFrames`
- `maxLaunchClickFrames`
- `minLaunchSettleFrames`
- `maxLaunchSettleFrames`

Why this matters:

1. Swapping in a different paper, narration text, or voice rate should no longer require manually editing a fixed activation frame.
2. The second scene can now complete the launch-button beat and start the life simulation based on actual scene timing rather than a hardcoded delay.

---

## 12. 2026-04-27 Mixed Effect Composition Pass

This pass addressed two product-level concerns:

1. How a single video can use different WebGL effects across scenes.
2. Why the page-2 launch scene still felt late even after cue timing became audio-driven.

What changed:

1. Effect runtime now distinguishes between:
   - `interactionFrame`
   - `effectStartFrame`
   This allows the launch button to visually "click" before the life simulation actually starts.
2. Launch settle timing was shortened so the simulation starts almost immediately after the click beat.
3. The default demo manifests now mix two WebGL effects in one video:
   - early middle scenes use `cellular-life`
   - later scenes use `snake-grid`

Current usage model:

1. The latest direction is now "one video uses one effect family".
2. The manifest selects that family through top-level `effectProfile.id`.
3. Scene-level effect ids are treated as semantic slots, and the compose step resolves them to the chosen effect family.
4. This means the user can switch the whole video from `life-game` to `snake-grid` by editing one config field instead of changing every scene manually.

---

## 13. 2026-04-27 Immediate Launch + Lighter Snake Colors

This pass made two UX-level adjustments:

1. Page-2 launch timing now uses immediate start after the click beat.
   - `effectStartFrameOffset` now equals `interactionFrameOffset` when settle delay is configured as zero.
   - Verified on latest local compose: scene 2 now resolves to `40 -> 40`.
2. `snake-grid` default color treatment was shifted toward a lighter, higher-contrast palette.
   - body uses a pale mint
   - head uses a warm near-white
   - food uses a soft peach highlight

Practical outcome:

1. The life-game launch page should no longer feel like it pauses after the simulated click.
2. `snake-grid` should read less like a dark overlay and more like a deliberate light-accent gameplay layer.

---

## 14. 2026-04-27 Paper Ingest + Asset Cache Pass

This pass prepared the project for real paper ingestion and reduced duplicate asset work.

What changed:

1. Added audio cache reuse in `tools/generate-audio.ts`.
   - cache key is based on narration text + TTS voice settings
   - repeated runs with the same scene text/voice now reuse cached MP3 instead of synthesizing again
2. Added output cache directories in `tools/lib/run-artifacts.ts`.
   - `output/cache/audio`
   - `output/cache/papers`
3. Added paper bundling support to run composition.
   - if `manifest.paper.localPdfPath` exists, the PDF is linked/copied into the current run's `paper/` directory
4. Added an arXiv fetch tool:
   - `npm run fetch:arxiv-ai -- --latest-only --download-pdf`
5. Added a PDF text extraction tool:
   - `npm run extract:pdf-text -- --input-pdf <pdf> --output-text <txt>`
   - current implementation uses Python `pypdf` inside the `kwai` conda environment

Important note:

1. Existing old run directories still contain historical duplicated audio files from before the cache layer existed.
2. From this pass onward, newly generated identical narration audio should reuse the cache instead of regenerating.

---

## 8. 续接建议

如果在新对话里继续，建议先读：

1. `docs/project-status-handoff.md`
2. `data/manifests/demo-paper.local.json`
3. `apps/video-renderer/src/Root.tsx`
4. `tools/build-video.ts`
5. `output/latest-run.json`

然后先验证一次：

```bash
npm run produce:video data/manifests/demo-paper.local.json
```

并重点检查最新 run 的：

1. `inputs/production-manifest.json`
2. `manifests/render-manifest.json`
3. `video/*.mp4`

确认它们是否真的引用了本地真人图。
