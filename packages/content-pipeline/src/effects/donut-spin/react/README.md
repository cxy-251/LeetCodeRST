# 目录职责

`packages/content-pipeline/src/effects/donut-spin/react/` 负责旋转甜甜圈特效的 React 适配层。

# 允许内容

- `useThreeDonutEngine.ts`
- `WebDonutLayer.tsx`
- `RemotionDonutLayer.tsx`

# 禁止内容

- 纯几何创建逻辑
- 页面级 UI 和布局样式
- 与 React 无关的共享脚本

# 修改前必须阅读

- `../README.md`
- `../../README.md`
- `../../../README.md`
- `../../../../../../PROJECT_MAP.md`
- `../../../../../../AGENTS.md`

# 命名规则

- Hook：`useThreeDonutEngine.ts`
- 交互层：`WebDonutLayer.tsx`
- 渲染层：`RemotionDonutLayer.tsx`

# 边界说明

这里只有 React 生命周期与 canvas 绑定。
真正的渲染算法仍在 `core/`。

# Codex 规则

- 修改本目录文件前必须阅读本 README。
- Web 与 Remotion 必须共用同一套 `renderFrame()`。
