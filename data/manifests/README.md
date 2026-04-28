# 目录职责

`data/manifests/` 维护视频输入 manifest。

# 允许内容

- 手工维护的 manifest
- demo manifest
- 本地案例 manifest

# 禁止内容

- 共享类型定义
- 论文文本 profile
- 图片位图

# 修改前必须阅读

- `../README.md`
- `../../README.md`
- `../../PROJECT_MAP.md`
- `../../AGENTS.md`

# 命名规则

- demo：`demo-paper.json`
- 本地案例：`*.local.json`
- 手工组合：`<name>.json`

# 边界说明

manifest 负责装配选择，不负责保存长篇正文。
正文应引用 `contentProfile`，背景图应引用 `coverProfile` 或图片路径。

# Codex 规则

- 修改本目录文件前必须阅读本 README。
- 默认不要手改 `generated/` 或 `ingest/` 子目录内容。
- 不允许在 manifest 中写长篇硬编码正文，优先走 profile。
