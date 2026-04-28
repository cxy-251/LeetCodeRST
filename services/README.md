# 目录职责

`services/` 负责外部服务适配、Python 运行层和输入处理服务。

# 允许内容

- 服务目录
- 服务层 README
- 与服务直接相关的实现

# 禁止内容

- 应用页面代码
- 顶层 CLI 入口
- 共享 UI 组件

# 修改前必须阅读

- `../README.md`
- `../PROJECT_MAP.md`
- `../AGENTS.md`

# 命名规则

- 服务目录语义化命名：`tts-python`、`paper-ingest`、`summarizer`

# 边界说明

服务层负责“与外部能力打交道”。
CLI 调度在 `tools/`，共享前端逻辑在 `packages/`。

# Codex 规则

- 修改本目录文件前必须阅读本 README。
- 不允许把页面层状态或样式写进服务目录。
