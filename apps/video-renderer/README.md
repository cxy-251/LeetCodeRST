# 目录职责

`apps/video-renderer/` 是 Remotion 视频渲染应用目录。

# 允许内容

- Remotion 应用配置
- `src/` 渲染入口
- `public/` 运行时静态资源目录

# 禁止内容

- 共享模板逻辑
- 论文分析脚本
- 预览站点业务逻辑

# 修改前必须阅读

- `../README.md`
- `../../README.md`
- `../../PROJECT_MAP.md`
- `../../AGENTS.md`

# 命名规则

- 源码目录：`src/`
- 静态资源目录：`public/`
- 目录规则文件：`README.md`

# 边界说明

这里只负责视频渲染应用本身。
内容管线、特效引擎、共享组件必须放回 `packages/`。

# Codex 规则

- 修改本目录文件前必须阅读本 README。
- 不允许在本目录复制共享特效实现。
- 如需新增公共逻辑，先抽到 `packages/`。
