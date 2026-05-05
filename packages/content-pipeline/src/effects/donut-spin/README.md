# 目录职责

`packages/content-pipeline/src/effects/donut-spin/` 负责旋转甜甜圈特效族。

# 允许内容

- 纯 Three.js 引擎
- React 适配层
- 类型定义
- 目录聚合出口

# 禁止内容

- 页面级 UI 控件
- effect lab 布局样式
- 论文、模板或批处理业务逻辑

# 修改前必须阅读

- `../README.md`
- `../../README.md`
- `../../../README.md`
- `../../../../../PROJECT_MAP.md`
- `../../../../../AGENTS.md`

# 命名规则

- 引擎：`ThreeDonutEngine.ts`
- React 层：`WebDonutLayer.tsx`、`RemotionDonutLayer.tsx`
- Hook：`useThreeDonutEngine.ts`
- 类型：`donut-spin.types.ts`
- 目录出口：`index.ts`

# 边界说明

这里是单一 effect family 的完整实现。
共享 effect registry 仍在上层 `src/`，页面控制逻辑仍在 `apps/editor-web/`。

# Codex 规则

- 修改本目录文件前必须阅读本 README。
- 不允许把 React 生命周期写回 core 层。
- 不允许复制一套单独给 Remotion 用的引擎逻辑。
