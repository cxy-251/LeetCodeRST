# 目录职责

`data/` 负责维护项目可手工编辑的输入资源、模板、profile 和批量配置。

# 允许内容

- 手工维护的 JSON / CSV / 图片输入资源
- 模板配置
- 内容 profile 与封面 profile
- 本目录及子目录 README

# 禁止内容

- 业务源码
- Python/TypeScript 可执行实现
- 长期依赖手改的 generated 产物

# 修改前必须阅读

- `../README.md`
- `../PROJECT_MAP.md`
- `../AGENTS.md`

# 命名规则

- Manifest：`*.json`
- 批量配置：`*.csv`
- 输入图片：`*.jpg`、`*.png`、`*.webp`、`*.svg`

# 边界说明

这里放“输入与配置”，不放执行逻辑。
执行逻辑必须留在 `tools/`、`packages/` 或 `services/`。

# Codex 规则

- 修改本目录文件前必须阅读本 README。
- 默认不要手改 `generated` 或缓存子目录。
- 如果新增一种配置子目录，必须补 `README.md`。
