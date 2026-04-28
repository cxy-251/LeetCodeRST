# 目录职责

`docs/` 负责开发文档、架构文档和交接文档。

# 允许内容

- 架构说明
- 开发规范
- 交接文档
- API 说明

# 禁止内容

- 业务源码
- 运行时缓存
- 自动生成的大量临时调试文本

# 修改前必须阅读

- `../README.md`
- `../PROJECT_MAP.md`
- `../AGENTS.md`

# 命名规则

- 文档：`kebab-case.md`
- 交接：`project-status-handoff.md`

# 边界说明

这里负责“说清楚系统”，不负责实现系统。
实现细节仍在 `apps/`、`packages/`、`services/`、`tools/`。

# Codex 规则

- 修改本目录文件前必须阅读本 README。
- 不允许把目录规则写散到随机文档里，优先回收进目录 `README.md`。
