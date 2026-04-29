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

### 使用批量组合配置

```bash
npm run produce:video -- --batch-config data/video-batches/demo-batch.csv
```

只跑指定行：

```bash
npm run produce:video -- --batch-config data/video-batches/demo-batch.csv --rows 1,3
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

### 工程检查

```bash
npm run lint
npm run build
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
5. arXiv `cs.AI` 论文抓取与 PDF 下载
6. PDF 文本抽取
7. 基于论文文本的中文短视频脚本草案生成
8. 基于脚本草案的候选 manifest 生成
9. `contentProfile` / `coverProfile` 驱动的外部文本源与背景图选择
10. 基于 profile 一键生成本地 manifest
11. 基于 CSV 组合配置按行批量生成视频
12. 一键准备最新论文批量配置
13. 9:16 背景图处理工具

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
   - `docs/development-standards.md`
21. 当前 renderer 与 editor 都已经开始读取这套模块参数
22. `compose:manifest` 已支持从 `contentProfile` 注入论文总结文本，并从 `coverProfile` 解析默认背景图
23. 当前 demo / local demo 已从“scene 内硬编码正文”切换成“scene 保留结构，正文由 profile 注入”
24. 生命游戏 effect 已切换为 `Three.js + WebGL` 实现，不再由 SVG/DOM 承担主渲染
25. 文本动效已补上离场参数，当前支持进场 + 离场统一配置
26. 前景层已经开始按 Lego 架构拆成：
   - `atomic-ui` 原子组件库
   - `data/templates/*.json` 模板配置
   - `timeline-engine` 模板引擎
27. 当前 renderer/editor 的前景文本区已切到模板引擎输出，不再全部手写在 `Root.tsx` / `App.tsx`
28. `npm run compose:manifest` 已验证可正常读取模板 JSON，并将 `templateDocument` 写入最新 run 的 `render-manifest.json`
29. `editor-web` 已从单页预览改成“小型预览站点”结构：
   - `/` 作为索引首页
   - `/templates/latest` 读取最新 run
   - `/templates/demo` 读取仓库默认 demo
30. `editor-web` 已新增独立特效实验页分区：
   - 当前主入口收敛为 `/effects/life-game`
   - 旧路径会重定向到新的生命游戏入口页
31. 原子组件字号已从固定像素改成更偏容器友好的响应式尺寸，减少预览页在不同窗口下字号失衡的问题
32. 特效实验页已从“模板裁剪预览”进一步调整为“独立 effect atom 页面”方向：
   - 生命游戏可单独拉出成页面
   - 页面内可点击按钮启动
   - 目标是让贪吃蛇、扫雷、吃豆人等后续 WebGL 小游戏沿同一原子接口接入
33. 已新增 `EffectRuntimeAdapter` 作为“网页交互特效 -> 视频渲染特效”的转换层：
   - 网页端可交互运行
   - 视频端可按绝对帧自动运行
   - 同一个 effect atom 可同时服务 editor 与 Remotion
34. `npm install` 已补跑，workspace 包解析已恢复；`render:video` 不再报 `@paper-to-video/timeline-engine` 找不到，而是进入浏览器启动阶段
35. `tools/build-video.ts` 已补上 WebGL 更稳妥的默认渲染参数：
   - `--gl angle`
   - `--concurrency 2`
   并支持通过 `REMOTION_GL` / `REMOTION_CONCURRENCY` 覆盖
36. `ThreeLifeEffect` 当前坚持 `Three.js + WebGL` 路线，并改成显式尝试 `webgl2 / webgl / experimental-webgl`，同时降低上下文创建开销，以提高 editor 与视频渲染中的可用性
37. `apps/editor-web/src/App.tsx` 已按局部规范重构：
   - `App.tsx` 只做页面装配
   - `AppViews.tsx` 负责视图组件
   - `useEditorPreview.ts` 负责状态和交互
   - `App.service.ts` 负责文件读取与模型整理
   - `App.types.ts` 负责类型
   - `App.module.css` 负责样式
   - 旧的 `styles.css` 已移除
38. 当前活跃的生命游戏特效链路已重构为“纯引擎 + React 适配层”：
   - `ThreeLifeEngine` 负责纯 Three.js / WebGL 生命周期
   - `createLifeMeshes / updateLifeInstances / disposeThreeLife` 负责 mesh 构建、实例更新和 GPU 释放
   - `WebThreeLifeLayer` 使用 `requestAnimationFrame` 驱动网页实时效果
   - `RemotionThreeLifeLayer` 使用外部帧或 `useCurrentFrame()` 驱动视频图层
   - 网页和 Remotion 共用同一个 `renderFrame()` 核心逻辑
39. effect lab 在当前 616px 左右视口已经保持“手机画面 + 右侧控制栏”并排，仅在更窄宽度下才退化成上下堆叠
40. 已新增稳定工程入口：
   - `npm run lint`
   - `npm run build`
   并已在当前阶段验证通过
41. `demo-batch.csv` 和 `create-video-manifest` 现已正式支持 `particle-orbit`，批量渲染不会再因为 `effect_profile_id=particle-orbit` 在本地解析阶段直接报错
42. 模板预览页 `/templates/demo` 与 `/templates/latest` 已新增手动下拉选择：
   - `Paper / Content Profile`
   - `WebGL Effect`
   目标是直接在同一套模板下切论文总结文本和中间层 WebGL family
43. `editor-web` 模板预览已补齐旧 render manifest 的 `templateDocument` 回填逻辑，不再要求仓库里的默认 demo render manifest 先手工重生成一次才能显示
44. 浏览器中的模板预览默认不再走 Remotion `useCurrentFrame()` 分支，而是改成网页可运行的 interactive effect 适配路径，避免在 editor 里触发 Remotion-only hook 错误
45. effect lab 舞台已改成更适合网页的宽幅实验台：
   - 预览区不再强制沿用 9:16 手机壳
   - 控制侧栏保留在画面右边
   - `snake-grid` 启动按钮文案已修正，不再显示 `Start Life Simulation`
46. effect lab 控件已做第一轮收口：
   - `life-game / snake-grid` 保留颜色与主体尺寸、节奏的高价值参数
   - `particle-orbit` 保留变体、形状、分布、轨迹与主体构图参数
   - 不再暴露过多底层实现参数
47. effect lab 当前已切回稳定基线数据源：
   - `/effects/*` 默认读取仓库基线 manifest，而不是 `latest run`
   - 避免实验页被最新一次视频运行的临时参数污染
48. `Effect Family Context` 说明块已从特效实验页移除，当前 family 选择只保留在组合模板页的手动下拉里
49. 已新增 `rubiks-solver` WebGL 特效家族，灵感来自 Stewart Smith 的 Rubik's Cube Explorer：
   - 新增纯 Three.js 引擎目录：`packages/content-pipeline/src/effects/rubiks-cube/`
   - 网页端走 `requestAnimationFrame`
   - Remotion 端走同一个 `renderFrame()` 核心入口
   - 当前 effect lab 路由：`/effects/rubiks-solver`
50. `rubiks-solver` 已接入现有 effect family 体系：
   - `effectProfile.id = "rubiks-solver"` 可用于整条视频
   - `backgroundEffectId` 已支持 `rubiks-launch / rubiks-auto-solve`
   - 模板页下拉已可切换 Rubik's family
   - batch CSV / `create-video-manifest` / `prepare:latest-ai-batch` 已接受该 profile
51. `compose-manifest` 与 `generate-audio` 已扩展 launch cue 计算，不再只认 `cellular-launch`，Rubik's launch 也能沿用同一套启动时机逻辑
52. 当前 `rubiks-solver` 默认控制参数已收敛为高价值项：
   - `turnFrames`
   - `holdFrames`
   - `cubeScale`
   - `cubieGap`
   - `cameraDrift`
53. 当前已完成浏览器内验证：
   - `/effects/rubiks-solver` 路由可打开
   - 点击 `Start Cube Solver` 后可看到自动解魔方主体层
   - `npm run lint`
   - `npm run build`
   均已通过
54. `lights-beams` 已新增“前进参照物”层：
   - 地面左右导向线
   - 中轴虚线标记
   - 目的是让镜头前推更容易被感知，而不只是看到光球朝前漂
55. `lights-beams` 当前的镜头推进已进一步增强：
   - 相机 dolly 幅度调大
   - look-at 目标更深
   - 地面参照物与波纹地形共享同一套纵深循环
56. 当前 `lights-beams` 的观感目标是：
   - 远处暗轮廓球体
   - 近处亮起的球体 core / glow
   - 地面流动波纹 + 导向线共同提供空间速度感
57. `lights-beams` 默认运动速度已下调：
   - `motionSpeed` 默认值降低
   - 引擎内部时间倍率同步收紧
   - 目标是避免默认状态下镜头推进过急
58. `lights-beams` 的前进参照物已从中轴转向两侧：
   - 中轴导向线已移除
   - 两侧保留长导轨和侧边虚线标记
   - 目标是让“镜头往前穿行”更像沿着场域两边掠过
59. 已新增面向实际生产的使用手册：
   - `docs/video-production-manual.md`
   - 重点说明单个视频、批量视频、论文总结导入、背景图切换、WebGL 特效切换
60. 当前 `lights-beams` 仍有已知视觉问题：
   - 光球连续性还不够理想
   - 目前更像“分段出现的球体层”
   - 后续仍需要继续朝“连续布场的远近层次”方向打磨
61. `lights-beams` 已新增连续布场逻辑：
   - 光球不再主要依赖随机散点分布
   - 已按 lanes × depth rows 组织纵深排列
   - 默认球体数量已提升，用于减少远近断档
62. `lights-beams` 当前已加强远处轮廓可见性：
   - accent 层 scale 提高
   - 远处 outline 最小可见比例抬高
   - 当前默认观感比上一版更接近“连续铺开的球体场”

---

## 5. 当前仓库中的关键文件

### 配置与数据

- `data/manifests/demo-paper.json`
- `data/manifests/demo-paper.local.json`
- `data/content-profiles/index.json`
- `data/content-profiles/*.json`
- `data/cover-assets/index.json`
- `data/templates/paper-digest-v1.json`
- `data/video-batches/demo-batch.csv`
- `data/images/cover-portrait.svg`
- `data/images/prepared/*`

### 运行脚本

- `tools/compose-manifest.ts`
- `tools/generate-audio.ts`
- `tools/build-video.ts`
- `tools/produce-video.ts`
- `tools/lib/run-artifacts.ts`
- `tools/fetch-arxiv-ai.ts`
- `tools/extract-pdf-text.ts`
- `tools/build-source-bundle.ts`
- `tools/build-video-batch.ts`
- `tools/prepare-cover-image.ts`
- `tools/analyze-paper-sources.ts`
- `tools/scaffold-paper-manifests.ts`
- `tools/create-video-manifest.ts`
- `tools/prepare-latest-ai-batch.ts`
- `tools/lib/manifest-factory.ts`
- `tools/lib/video-batch.ts`
- `tools/lib/image-processing.ts`

### 渲染入口

- `apps/video-renderer/src/index.tsx`
- `apps/video-renderer/src/Root.tsx`
- `packages/content-pipeline/src/effects/rubiks-cube/`
- `apps/video-renderer/src/Video.tsx`

### Lego 架构

- `packages/atomic-ui/src/index.tsx`
- `packages/timeline-engine/src/index.tsx`
- `packages/content-pipeline/src/effect-atoms.tsx`
- `packages/content-pipeline/src/effect-runtime.tsx`
- `docs/lego-architecture.md`
- `docs/modular-visual-apis.md`
- `docs/development-standards.md`

### 论文接入

- `services/paper-ingest/extract_pdf_text.py`
- `data/source-bundles/latest-ai-batch.json`
- `data/source-bundles/latest-ai-analysis.json`
- `data/manifests/ingest/*.json`

### 预览页

- `apps/editor-web/src/App.tsx`
- `apps/editor-web/src/AppViews.tsx`
- `apps/editor-web/src/useEditorPreview.ts`
- `apps/editor-web/src/App.service.ts`
- `apps/editor-web/src/App.module.css`

### Three Life 引擎

- `packages/content-pipeline/src/effects/three-life/core/ThreeLifeEngine.ts`
- `packages/content-pipeline/src/effects/three-life/core/createLifeMeshes.ts`
- `packages/content-pipeline/src/effects/three-life/core/updateLifeInstances.ts`
- `packages/content-pipeline/src/effects/three-life/core/disposeThreeLife.ts`
- `packages/content-pipeline/src/effects/three-life/react/useThreeLifeEngine.ts`
- `packages/content-pipeline/src/effects/three-life/react/WebThreeLifeLayer.tsx`
- `packages/content-pipeline/src/effects/three-life/react/RemotionThreeLifeLayer.tsx`

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

## 7. 功能完成情况总览

### 已完成

1. 论文到视频的基础工程链路已经打通：
   - 读取 manifest
   - 生成 render manifest
   - 生成音频
   - 渲染视频
2. React 预览站点已经可用：
   - 模板页预览
   - effect 原子页预览
3. `contentProfile / coverProfile / effectProfile` 三层配置已建立
4. 批量 CSV 配置已经建立，并支持按行渲染
5. arXiv 最新论文抓取、PDF 下载、PDF 文本抽取已经可用
6. 自动生成：
   - source bundle
   - analysis bundle
   - ingest manifest
   - generated content profile
   - generated batch CSV
7. 背景图 9:16 处理工具已经可用，适合位图输入
8. 本地缓存体系已经建立：
   - PDF 缓存
   - 音频缓存
   - run 产物归档
9. 开发规范文档已经补齐
10. 外部 AI 论文总结模板、提示词、示例已经写入 `services/summarizer`
11. 外部 AI 总结 JSON 已经可以导入成 `contentProfile`
12. 第三个 WebGL effect family `particle-orbit` 已接入，可作为更偏 Three.js 粒子案例方向的样板
13. effect lab 已支持按特效声明参数控件，网页实验页可以局部调节特效参数而不改全局 manifest
14. effect lab 参数控件已从“纯数值滑杆”扩展到“数值 + 枚举选择”，可以调颜色主题、粒子形状、分布、轨迹和变体
15. life-game / snake-grid 的颜色控制已进一步改成连续 HSL 滑块，不再只依赖预设颜色主题
16. effect lab 布局已改成“手机画面 + 贴边控制侧栏”，参数面板不再和预览结果分离
17. `ThreeLife` 已完成纯引擎拆分，网页实时页和 Remotion 视频层现在共享同一套 `renderFrame()` 核心逻辑
18. `life-game` 实验页已实测恢复实时运行，控制面板在当前窄屏视口中也能保持右侧嵌入

### 未完成

1. 还没有把论文总结质量提升到“稳定可商用”的程度，当前仍有启发式模板味
2. 还没有接入真正的图像生成/搜图服务调度，只做了图片处理和路径接入
3. 还没有做视频质量筛选或自动评分机制
4. 还没有实现多个模板风格的大规模切换，目前主模板仍以 `paper-digest-v1` 为核心
5. 还没有完成更丰富的 WebGL effect 家族扩展，例如扫雷、吃豆人等；当前已扩到 `life-game / snake-grid / particle-orbit`
6. 还没有把 effect registry、template registry、profile registry 做成严格 schema 校验
7. 还没有提供 GUI 级别的配置编辑器，当前主要靠 JSON 和 CSV
8. 外部总结 JSON 导入虽然已经可用，但当前仍是“宽松别名兼容 + 标准落盘”，还没有建立严格的 schema version 管理
9. 特效实验页目前已经支持参数调节，但还没有把这套控件直接反写成可保存 preset 或 manifest patch
10. 同一类特效虽然已经支持 variant / shape / distribution / trajectory，但这些组合目前主要停留在实验页，还没有正式沉淀成可复用的 profile registry

### 当前不完善

1. 生命游戏相关视觉体验仍未完全达到理想状态：
   - 第二页按钮后视觉衔接仍有改进空间
   - 某些页面的实际动效表现仍不够强
2. 贪吃蛇和生命游戏虽然可切换，但审美和节奏仍偏原型
3. `prepare:cover-image` 当前更适合 jpg/png/webp 这类位图；SVG 等矢量输入虽有兼容，但不是主路径
4. Remotion 渲染在当前环境仍可能被 Chromium 启动权限限制阻塞，这不是业务代码本身的逻辑错误，但会影响本机批量渲染体验
5. 自动论文分析目前主要基于规则/启发式生成中文脚本草案，质量依赖论文类型，理论类、综述类和应用类的稳定性仍不完全一致
6. 一些旧文档里仍保留了项目早期阶段的描述，后续需要继续清理和统一
7. 外部总结 JSON 导入器当前稳定覆盖的是 5 段式短视频结构，超过这个结构的复杂脚本还没有抽象成更通用的 scene mapper
8. 新增的 `particle-orbit` 目前是第一版粒子轨道样板，视觉方向已经成立，但还没有细化成多个粒子案例子风格
9. `particle-orbit` 已从“边缘环绕 + 中央过曝”调整为“中央主视觉优先”，但还需要继续打磨更多中心构图变体
10. 当前 life-game / snake-grid 的实验页已经去掉列数和行数暴露，改成更贴近视觉结果的“色块主题 + 尺寸 + 节奏”控制
11. `ThreeLife` 这条链路虽然已经完成核心架构拆分，但 `snake-grid / particle-orbit` 还没有按同样深度拆成纯引擎层，后续应继续统一
12. `editor-web` 构建当前仍会出现 `chunk size > 500kB` 的 Vite 提示，这不阻塞功能，但后续最好继续做按路由或 effect family 的拆包
13. effect lab 在更窄网页宽度下虽然已经尽量保持右侧侧栏，但当视口进一步变窄时仍会退化；如果后续要长期面向桌面实验页使用，建议把信息区再进一步上移，给舞台让出更多横向空间
14. effect lab 的舞台虽然已经改成更适合网页的宽幅区域，但目前仍然是“固定侧栏 + 响应式主舞台”的第一版；如果后续要上更多复杂特效，建议再加可折叠侧栏或分段参数分组

---

## 8. 下一步优先级

建议严格按这个顺序继续：

1. 把 `fetch:arxiv-ai -> extract:pdf-text -> build:source-bundle -> analyze:paper-sources -> scaffold:paper-manifests` 串成更顺滑的一键入口
2. 继续提升论文脚本草案质量，把当前启发式总结升级成更稳定的结构化摘要流程
3. 将候选 manifest 与背景图、PDF、音频、最终视频更明确地绑定到同一个 run/source bundle 视图中
4. 继续把背景层和 effect 层进一步模板化/组件化
5. 在 `atomic-ui` 中新增更多原子组件
6. 增加第二套、第三套模板 JSON，而不是只用 `paper-digest-v1`
7. 给外部总结 JSON 增加 schema version 和严格校验，降低后续字段变动风险
8. 继续沿 effect atom registry 复现更多 Three.js 风格案例，并沉淀成可选 effect family
9. 把 effect lab 的参数调节结果导出成 preset，减少人工抄参数
10. 把 `particle-orbit` 的 variant 进一步拆成正式 effect family，或者反过来抽成共享 preset 机制

---

## 9. 最新论文接入进展

截至当前阶段，项目已经能在本地完成这条链路：

1. 抓取 arXiv `cs.AI` 最新论文
2. 下载 PDF 到 `output/cache/papers/<arxivId>/source.pdf`
3. 抽取 PDF 文本到 `output/cache/papers/<arxivId>/source.txt`
4. 生成 source bundle：
   - `data/source-bundles/latest-ai-batch.json`
5. 基于抽取文本生成中文短视频脚本草案：
   - `data/source-bundles/latest-ai-analysis.json`
6. 为每篇论文生成候选 manifest：
   - `data/manifests/ingest/*.json`
7. 基于 `contentProfile + coverProfile + effectProfile` 生成本地使用的统一风格 manifest：
   - `npm run create:manifest -- --content-profile <id> --cover-profile <id> --effect-profile <id>`
8. 基于 CSV 配置表批量生成或按行生成视频：
   - `npm run produce:video -- --batch-config data/video-batches/demo-batch.csv`
   - `npm run produce:video -- --batch-config data/video-batches/demo-batch.csv --rows 1,3`
9. 一键准备最新论文批量配置：
   - `npm run prepare:latest-ai-batch -- --limit 3`
   - 输出：`data/video-batches/generated/latest-ai-batch.csv`
10. 背景图 9:16 处理：
    - `npm run prepare:cover-image -- --input <image> --output data/images/prepared/<name>.jpg`
11. 当前 batch CSV 的前几列已经调整为：
    - `content_profile_id`
    - `cover_image_path`
    - `cover_profile_id`
    - `effect_profile_id`
12. 外部 AI 总结 JSON 可以直接导入成 `contentProfile`：
    - `npm run import:summary-json -- --input /path/to/video-script.json --profile-id my-paper-summary --register`
13. 新增第三个 WebGL effect atom 页面：
    - `/effects/particle-orbit`
14. 批量配置示例已新增：
    - `effect_profile_id=particle-orbit`

当前本地已经实际拉取并分析了 3 篇 `cs.AI` 论文，并生成了对应的背景图建议和候选 manifest。

需要注意：

1. `data/source-bundles/*.json`
2. `data/manifests/ingest/*.json`
3. `output/cache/papers/*`
4. `output/cache/images/*`

这些都属于本地抓取/缓存产物，已经通过 `.gitignore` 保持不进仓库。

另外，`build-source-bundle`、`analyze-paper-sources`、`scaffold-paper-manifests` 目前应顺序执行，不建议并行跑；并行时可能出现后一步先读取、前一步文件尚未写出的情况。

---

## 10. 2026-04-27 Latest Fix

Current debugging focus returned to the real product goal:

1. `edge-tts` is confirmed by the user to work locally, so TTS is no longer treated as a product-code blocker.
2. The active issue is the `life-game` effect not appearing clearly in either the editor lab or final render.

Latest code changes:

1. Fixed the active `ThreeLifeEffect` camera update bug, now preserved inside `packages/content-pipeline/src/effects/three-life/core/ThreeLifeEngine.ts`.
   The orthographic camera was incorrectly updating `bottom = height`, which could collapse the visible render area during frame updates.
2. Disabled frustum culling on the instanced mesh so the cellular grid is not accidentally clipped after instance transforms.
3. Isolated the effect lab stage from the cover-image background in `apps/editor-web/src/App.service.ts`.
   The effect sandbox now uses a neutral dark gradient instead of the latest template cover image, making the WebGL middle layer easier to inspect by itself.

Expected outcome after this fix:

1. `/effects/life-game` should show the life simulation after clicking start, instead of appearing as only a pulsing button.
2. The same fix should also improve visibility of the life effect in the final Remotion video, because the broken camera update affected both environments.

---

## 11. 2026-04-27 Modular Tuning Pass

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

## 12. 2026-04-27 Dynamic Cue Timing Pass

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

## 13. 2026-04-27 Mixed Effect Composition Pass

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

## 14. 2026-04-27 Immediate Launch + Lighter Snake Colors

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

## 15. 2026-04-27 Paper Ingest + Asset Cache Pass

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

## 16. 2026-04-27 Source Bundle + Manifest Scaffold Pass

This pass connected downloaded paper assets to actual candidate video manifests.

What was completed:

1. Downloaded 3 latest `cs.AI` papers and cached their PDFs locally.
2. Downloaded 3 background images into `output/cache/images`.
3. Extracted plain text from all 3 PDFs into `source.txt` files.
4. Built a source bundle file:
   - `data/source-bundles/latest-ai-batch.json`
5. Scaffolded 3 candidate production manifests:
   - `data/manifests/ingest/arxiv-2604-22722v1.json`
   - `data/manifests/ingest/arxiv-2604-22736v1.json`
   - `data/manifests/ingest/arxiv-2604-22748v1.json`

Why this matters:

1. The project now has a concrete bridge from paper ingestion assets to renderable manifest inputs.
2. Later PDF summarization can replace the placeholder abstract-to-scene logic without changing the surrounding asset pipeline.

---

## 17. 续接建议

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

---

## 18. 2026-04-28 Effect Lab Sizing + Particle Orbit Default Pass

This pass fixed two active effect-lab usability issues.

What changed:

1. The effect lab stage now fills its frame correctly instead of showing a large outer shell with a smaller inner preview.
   - `apps/editor-web/src/App.module.css`
   - `effectFrame` now uses an explicit aspect ratio plus flex layout
   - `slidePreview` now stretches to the full available surface
2. The effect lab stage layout was rebalanced for web usage.
   - the presentation column now gets more width
   - the right control sidebar stays embedded, but the stage no longer feels portrait-constrained
   - narrow widths now use a more reasonable stage/sidebar split and a better fallback stack
3. `particle-orbit` default visuals were retuned.
   - smaller particle size
   - lower default density
   - lighter pastel palette
   - wider spread and softer motion defaults
4. `particle-orbit` color rendering was moved away from per-instance color updates.
   - it now uses three layered instanced meshes (`primary` / `secondary` / `accent`)
   - this matches the more reliable material-layer coloring strategy already used in other effect families
   - this was done because the prior instance-color path produced black particles in the in-app browser

Verification:

1. `npm run lint`
2. `npm run build`

---

## 22. 2026-04-29 Lights Beams Perspective Rework

This pass pushed `lights-beams` away from a centered burst and closer to the original `Lights` reference language.

What changed:

1. The beam field was rebuilt as a forward corridor of vertical light pillars instead of a radial starburst.
   - `packages/content-pipeline/src/effects/lights-beams/core/createLightsMeshes.ts`
   - `packages/content-pipeline/src/effects/lights-beams/core/updateLightsInstances.ts`
2. The floor became a looping multi-tile ripple terrain rather than a single static plane.
   - tiles now wrap in depth to suggest an infinite landscape
   - wave deformation is evaluated per tile using world-space depth so seams stay hidden
3. The camera was retuned into a lower, perspective glide with a moving look-at target.
   - `packages/content-pipeline/src/effects/lights-beams/core/ThreeLightsEngine.ts`
4. A distant horizon glow was added so the upper half of the frame reads more like atmosphere instead of dead empty space.
5. The beam volume illusion is now closer to the original article description.
   - each light uses three crossed planes instead of a chunky box beam
   - the family still keeps the same pure-engine / shared-renderFrame architecture
6. Default `lights-beams` parameters were retuned so the first-load state is visually usable without manual adjustment.
   - `packages/content-pipeline/src/module-api.ts`

Why this matters:

1. The previous version proved the family wiring, but it still read too much like a center-composed stage burst.
2. The reference project is more about flying over a reactive light landscape, so depth, terrain repetition, and camera motion needed to become the main visual language.

Verification:

1. `npm run lint`
2. `npm run build`
3. Browser-checked `/effects/lights-beams`

---

## 23. 2026-04-29 Lights Ground-Orb Pass

This pass corrected the visual interpretation of the `Lights` reference again.

What changed:

1. The middle-layer subject for `lights-beams` is now a field of glow orbs anchored to the ripple terrain instead of upright beam pillars.
   - `packages/content-pipeline/src/effects/lights-beams/core/createLightsMeshes.ts`
   - `packages/content-pipeline/src/effects/lights-beams/core/updateLightsInstances.ts`
2. Each orb now breathes in place with layered glow / core / accent spheres.
   - the same instanced optimization pattern is preserved
   - motion is driven through shared `renderFrame()` like the other effect families
3. Orb positions are sampled against the same floor wave function that deforms the ground tiles.
   - this keeps them visually attached to the terrain instead of floating as a detached overlay
4. The camera remains low and perspective-based, but it now looks into a terrain-lightscape rather than a corridor of vertical columns.
   - `packages/content-pipeline/src/effects/lights-beams/core/ThreeLightsEngine.ts`

Why this matters:

1. The previous pass improved depth and terrain, but the subject still read as stage beams.
2. The requested target is closer to grounded glowing orbs that pulse over a reactive landscape, so the family needed to move away from pillar geometry and toward breathing light nodes.

Verification:

1. `npm run lint`
2. `npm run build`
3. Browser-checked `/effects/lights-beams`

---

## 24. 2026-04-29 Lights Anchored Orb Depth Pass

This pass refined the `Lights` interpretation from "breathing orbs on terrain" into a more specific depth composition.

What changed:

1. Orb positions are now anchored in world space instead of drifting through the scene.
   - the camera and floor waves move
   - the orb field itself stays fixed to the landscape
2. The floor deformation is no longer based on a mostly uniform wave blend.
   - multiple radial disturbance sources now drive the terrain
   - the surface reads more like uneven ripples than even sinusoidal rows
3. Distant orbs now read mostly as outline silhouettes, while near-field orbs receive the stronger core/glow contribution.
   - `accent` layer stays visible farther back
   - `core` and `glow` are biased toward the foreground
4. The family still keeps the same pure-engine / shared-renderFrame structure, so web preview and Remotion continue to use one core path.

Why this matters:

1. The requested target is not a musically-reactive beam burst.
2. The important visual hierarchy is:
   - reactive uneven ground
   - fixed orb markers attached to that ground
   - distant dim silhouettes
   - near bright breathing nodes

Verification:

1. `npm run lint`
2. `npm run build`
3. Browser-checked `/effects/lights-beams`

---

## 25. 2026-04-29 Lights Forward Dolly Pass

This pass made the `Lights` family read more like a forward-moving camera through a field of anchored orb markers.

What changed:

1. The camera now performs a stronger forward dolly instead of staying almost static with only subtle sway.
   - `packages/content-pipeline/src/effects/lights-beams/core/ThreeLightsEngine.ts`
2. Orb depth presentation is now tied to the same forward-travel phase used by the terrain loop.
   - orbs approach from the distance
   - near-field orbs brighten more strongly
   - far-field orbs remain mostly outline-like
3. The ground tiles and orb positions now share the same wrapped travel offset, which makes the whole scene feel like one moving landscape instead of two unrelated layers.
4. Glow and core radii were increased so the foreground "lit" state is easier to perceive during the forward pass.

Why this matters:

1. The previous pass fixed the orb/terrain relationship, but the camera movement still did not read strongly enough.
2. The intended reference behavior is not just "lights on terrain", but "the camera pushes forward and those distant dark markers bloom as they approach".

Verification:

1. `npm run lint`
2. `npm run build`
3. Browser-checked `/effects/lights-beams`

---

## 22. 2026-04-29 Lights Beams Perspective Rework

This follow-up changed `lights-beams` from a flat central burst into a more scene-like interpretation of the Hello Enjoy `Lights` reference.

What changed:

1. `ThreeLightsEngine` now uses a perspective camera instead of the earlier orthographic setup.
2. The scene now includes a flowing ripple floor in the lower half of the frame.
3. The camera now drifts through the scene over time, instead of keeping the composition locked to a flat center burst.
4. Beam placement was rewritten into a depth corridor so the effect reads more like a staged 3D environment.
5. The default `lights-beams` preset was retuned so the experiment page and the actual default family baseline are aligned.

Why this matters:

1. The original pass technically added the family, but visually it felt too much like a radial particle explosion.
2. The new direction is much closer to the user's target reference: moving camera, vertical light structures, and lower-plane motion.

Verification:

1. `npm run lint`
2. `npm run build`
3. Browser check:
   - `/effects/lights-beams`
3. Browser check:
   - `/effects/life-game`
   - `/effects/particle-orbit`

Observed outcome:

1. `life-game` stage sizing is now visually coherent inside the effect lab frame.
2. `particle-orbit` defaults are no longer black and oversized.

---

## 19. 2026-04-28 Effect Lab Portrait Stage Follow-up

This follow-up aligned the effect lab stage with the intended portrait-first preview workflow.

What changed:

1. The effect lab runtime canvas was switched back to a portrait render size.
   - `apps/editor-web/src/App.tsx`
   - `540 x 960` is now used for interactive effect-layer rendering
2. The effect lab layout now reserves a portrait-width presentation column instead of stretching the stage area horizontally.
   - `apps/editor-web/src/App.module.css`
   - stage column now uses a constrained portrait-friendly width
   - effect frame is back to a `9 / 16` aspect ratio
   - narrow-width breakpoints keep the stage portrait instead of switching to a landscape shell

Why this was needed:

1. The previous responsive pass fixed inner-surface fill, but it also made the lab read like a horizontal demo panel.
2. For this project, the effect lab is meant to validate short-video effect behavior, so the default stage should stay portrait-oriented.

---

## 20. 2026-04-28 Template Preview Render-Space Alignment Pass

This pass fixed a mismatch between the template preview page and the final exported video.

What changed:

1. Template preview now lays out content in the same render coordinate space as the final video.
   - `apps/editor-web/src/AppViews.tsx`
   - `apps/editor-web/src/usePreviewSurfaceScale.ts`
   - `apps/editor-web/src/App.types.ts`
2. The preview surface is rendered at the manifest's real `width x height`, then scaled down into the browser shell.
   - this prevents long titles from wrapping earlier than they do in Remotion output
   - this keeps avatar, kicker, title, body, subtitle, and effect placement closer to the exported video
3. Template preview now uses render-manifest dimensions instead of assuming a smaller ad hoc preview space.
   - `apps/editor-web/src/App.service.ts`
4. The template phone shell was enlarged for narrow browser widths so the preview stays readable after render-space scaling.
   - `apps/editor-web/src/App.module.css`

Why this matters:

1. Previously, the web preview was laying out text directly inside a much narrower DOM box than the final render.
2. Exported video still looked "old but correct" because Remotion was using the real output dimensions.
3. After this pass, template preview and exported video should be much closer again, while effect-lab behavior remains isolated.

---

## 21. 2026-04-29 Lights Beams WebGL Effect Family

This pass added a new WebGL effect family inspired by the Hello Enjoy `Lights` interaction.

What changed:

1. A new `lights-beams` effect family was added under:
   - `packages/content-pipeline/src/effects/lights-beams/`
   - pure engine in `core/`
   - shared web / Remotion adapters in `react/`
2. The new family uses a single pure `ThreeLightsEngine` for both interactive preview and Remotion rendering.
   - web preview uses `requestAnimationFrame`
   - Remotion uses the same `renderFrame()` entry point
3. New supported IDs were added across the stack:
   - `effectProfile.id = "lights-beams"`
   - `backgroundEffectId = "lights-launch" | "lights-beams"`
4. The effect registry, runtime adapter, editor routes, template dropdown, batch CSV validation, and manifest creation flow now all recognize `lights-beams`.
5. The effect lab route is now available at:
   - `/effects/lights-beams`

Why this matters:

1. The project now has another non-game, center-composed WebGL family that is closer to polished Three.js showcase work.
2. The family was added through the same modular boundary as the previous effect families, so future Three.js showcase recreations can follow the same pattern.

Verification:

1. `npm run lint`
2. `npm run build`
