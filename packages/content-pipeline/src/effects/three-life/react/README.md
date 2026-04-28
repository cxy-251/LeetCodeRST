# 目录职责

`packages/content-pipeline/src/effects/three-life/react/` 负责 `ThreeLife` 的 React 适配层。

# 允许内容

- `requestAnimationFrame` 驱动的网页层
- Remotion 帧驱动层
- 引擎创建与销毁 hook

# 禁止内容

- 直接修改 core 引擎逻辑的重复实现
- 页面级布局 UI
- effect lab 控件配置

# 修改前必须阅读

- `../README.md`
- `../../README.md`
- `../../../README.md`
- `../../../../../../PROJECT_MAP.md`
- `../../../../../../AGENTS.md`

# 命名规则

- `useThreeLifeEngine.ts`
- `WebThreeLifeLayer.tsx`
- `RemotionThreeLifeLayer.tsx`

# 边界说明

这里只有“如何驱动核心引擎”的差异。
视觉算法与 mesh 更新仍应留在 `core/`。

# Codex 规则

- 修改本目录文件前必须阅读本 README。
- 网页模式必须优先使用 RAF 驱动。
- Remotion 模式必须与网页模式共享同一个 `renderFrame()` 核心入口。
