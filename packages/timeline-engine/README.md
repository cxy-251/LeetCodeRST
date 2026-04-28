# 目录职责

`packages/timeline-engine/` 是模板装配引擎包。

# 允许内容

- 模板装配逻辑
- 模板渲染入口
- `src/` 源码目录

# 禁止内容

- 原子组件实现
- 应用页面状态
- 视频脚本抓取逻辑

# 修改前必须阅读

- `../README.md`
- `../../README.md`
- `../../PROJECT_MAP.md`
- `../../AGENTS.md`

# 命名规则

- 入口：`index.tsx`
- 渲染函数：`renderTemplateZone`

# 边界说明

本包负责“把配置拼起来”。
组件定义在 `atomic-ui/`，内容和视觉配置在 `content-pipeline/` 与 `data/templates/`。

# Codex 规则

- 修改本目录文件前必须阅读本 README。
- 不允许把模板配置文件写成代码 if/else 大杂烩。
