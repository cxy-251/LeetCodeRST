# 目录职责

`packages/atomic-ui/src/` 负责原子组件源码。

# 允许内容

- `XxxAtom` 组件
- 组件 props 类型
- 组件局部样式

# 禁止内容

- 模板选择逻辑
- 渲染时间轴逻辑
- 论文文本清洗逻辑

# 修改前必须阅读

- `../README.md`
- `../../README.md`
- `../../../PROJECT_MAP.md`
- `../../../AGENTS.md`

# 命名规则

- `XxxAtom.tsx`
- `index.tsx`
- 如需样式文件，使用 `.module.css`

# 边界说明

组件只负责渲染。
组件组合顺序由 `timeline-engine` 决定，文本来源由 `content-pipeline` 和 `data/` 决定。

# Codex 规则

- 修改本目录文件前必须阅读本 README。
- `.tsx` 内不要写与模板选择相关的条件分支。
- 如需新增原子组件，保持单一职责。
