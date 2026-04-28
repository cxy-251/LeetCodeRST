# 目录职责

`packages/content-pipeline/src/effects/three-life/` 负责 `ThreeLife` 特效族。

# 允许内容

- 纯 Three.js 引擎
- React 适配层
- 类型定义
- 聚合出口

# 禁止内容

- 页面 UI 控件
- effect lab 布局样式
- 论文或模板业务逻辑

# 修改前必须阅读

- `../README.md`
- `../../README.md`
- `../../../README.md`
- `../../../../../PROJECT_MAP.md`
- `../../../../../AGENTS.md`

# 命名规则

- 引擎：`ThreeLifeEngine.ts`
- React 层：`WebThreeLifeLayer.tsx`、`RemotionThreeLifeLayer.tsx`
- Hook：`useThreeLifeEngine.ts`
- 类型：`three-life.types.ts`
- 目录出口：`index.ts`

# 边界说明

这里是单一 effect family 的完整实现。
共享 effect registry 仍在上层 `src/`，页面控制逻辑仍在 `apps/editor-web/`。

# Codex 规则

- 修改本目录文件前必须阅读本 README。
- 不允许把 React 生命周期写回 core 层。
- 不允许复制一套单独给 Remotion 用的引擎逻辑。
