# 目录职责

`services/paper-ingest/` 负责论文输入处理服务，如 PDF 文本抽取。

# 允许内容

- PDF 抽取服务
- 论文输入服务说明

# 禁止内容

- 前端页面逻辑
- manifest 组装脚本
- 最终视频渲染逻辑

# 修改前必须阅读

- `../README.md`
- `../../README.md`
- `../../PROJECT_MAP.md`
- `../../AGENTS.md`

# 命名规则

- Python 脚本：`snake_case.py`
- Service 文件：`*.service.ts`
- 类型：`*.types.ts`

# 边界说明

这里负责“把论文变成可分析文本”。
抓取和批处理入口仍在 `tools/`。

# Codex 规则

- 修改本目录文件前必须阅读本 README。
- 不允许把批量 CLI 逻辑写回服务层。
