# 目录职责

`apps/video-renderer/src/` 负责 Remotion 组合入口、视频图层装配和透明特效叠加。

# 允许内容

- Remotion 入口文件
- 视频页面装配组件
- 只属于渲染应用的薄适配层

# 禁止内容

- 复制特效核心逻辑
- 通用模板引擎实现
- 预览站点专用状态逻辑

# 修改前必须阅读

- `../README.md`
- `../../README.md`
- `../../../PROJECT_MAP.md`
- `../../../AGENTS.md`

# 命名规则

- 入口：`index.tsx`
- 根图层：`Root.tsx`
- 组合层：`Video.tsx`

# 边界说明

本目录只负责 Remotion 侧装配。
共享特效与模板逻辑必须从 `packages/` 引入，不要在这里再造一套。

# Codex 规则

- 修改本目录文件前必须阅读本 README。
- 不允许把实验页逻辑写进视频渲染层。
- 如果需要新的 WebGL 能力，先扩展 `packages/content-pipeline/`。
