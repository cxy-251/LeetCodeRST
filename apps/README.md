# 目录职责

`apps/` 负责最终可运行应用，包括编辑预览站点和 Remotion 渲染应用。

# 允许内容

- 应用级目录
- 应用自己的 `README.md`
- 应用入口配置

# 禁止内容

- 可复用跨应用逻辑
- 共享类型
- 独立于应用的通用工具函数

# 修改前必须阅读

- `../README.md`
- `../PROJECT_MAP.md`
- `../AGENTS.md`

# 命名规则

- 应用目录：`editor-web`、`video-renderer`
- 每个应用目录必须包含自己的 `README.md`

# 边界说明

`apps/` 只放最终应用。
复用能力应落在 `packages/`，脚本调度应落在 `tools/`。

# Codex 规则

- 修改本目录文件前必须阅读本 README。
- 不允许把共享逻辑直接塞回应用目录。
- 如需跨应用复用，优先抽到 `packages/`。
