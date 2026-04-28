# 目录职责

`apps/editor-web/src/` 负责预览站点的 React 视图、路由状态、展示装配和编辑实验页 UI。

# 允许内容

- `.tsx` 视图组件
- `.module.css` 样式
- `useXXX.ts` 状态与交互 hook
- `*.service.ts` 页面装配与数据读取逻辑
- `*.types.ts` 页面层类型

# 禁止内容

- 纯 Three.js 引擎实现
- 业务脚本调度代码
- 与预览站点无关的共享逻辑

# 修改前必须阅读

- `../README.md`
- `../../README.md`
- `../../../PROJECT_MAP.md`
- `../../../AGENTS.md`

# 命名规则

- 视图入口：`App.tsx`
- 视图集合：`AppViews.tsx`
- Hook：`useEditorPreview.ts`
- 服务：`App.service.ts`
- 类型：`App.types.ts`
- 样式：`App.module.css`

# 边界说明

本目录只负责“页面如何展示和交互”。
特效 runtime、模板引擎、共享组件必须继续留在 `packages/`。

# Codex 规则

- 修改本目录文件前必须阅读本 README。
- `.tsx` 只写组件结构和少量展示逻辑。
- 不允许把大段样式写进 TSX。
- 不允许顺手把共享逻辑搬进本目录。
