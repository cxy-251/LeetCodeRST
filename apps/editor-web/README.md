# 目录职责

`apps/editor-web/` 是本地预览站点，负责展示模板页与 WebGL 特效实验页。

# 允许内容

- Vite 应用配置
- React 入口
- 预览站点专用 README
- `src/` 下的页面与状态逻辑

# 禁止内容

- Remotion 渲染代码
- 通用特效核心逻辑
- 跨应用共享组件实现

# 修改前必须阅读

- `../README.md`
- `../../README.md`
- `../../PROJECT_MAP.md`
- `../../AGENTS.md`

# 命名规则

- 入口：`App.tsx`
- 视图：`*View*.tsx`
- Hook：`useXxx.ts`
- 服务：`*.service.ts`
- 类型：`*.types.ts`
- 样式：`*.module.css`

# 边界说明

这里负责“看效果”和交互调参。
真正的特效核心逻辑必须放在 `packages/content-pipeline/`，不要直接写死在应用层。

# Codex 规则

- 修改本目录文件前必须阅读本 README。
- 不允许把 Three.js 核心逻辑直接写回应用层。
- 不允许在应用目录中复制一份 effect 核心实现。
