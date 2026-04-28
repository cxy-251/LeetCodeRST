# 目录职责

`data/templates/` 维护模板配置文件，定义组件顺序和区域布局。

# 允许内容

- 模板 JSON
- 模板说明

# 禁止内容

- React 组件实现
- WebGL 核心逻辑
- 论文内容全文

# 修改前必须阅读

- `../README.md`
- `../../README.md`
- `../../PROJECT_MAP.md`
- `../../AGENTS.md`

# 命名规则

- 模板：`<template-id>.json`

# 边界说明

模板不是代码文件，只负责“用哪些组件、按什么顺序摆放”。
真正的组件在 `packages/atomic-ui/`，装配引擎在 `packages/timeline-engine/`。

# Codex 规则

- 修改本目录文件前必须阅读本 README。
- 不允许在模板文件里嵌入代码表达式。
- 新增模板时保持可配置、可复用，不要绑死单篇论文。
