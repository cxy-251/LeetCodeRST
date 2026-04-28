# 目录职责

`packages/content-pipeline/src/effects/` 负责各类 WebGL / Three.js 特效族与相关引擎目录。

# 允许内容

- effect family 子目录
- 共享 effect README
- effect 相关薄适配组件

# 禁止内容

- 页面级 UI
- 批处理脚本
- 与特效无关的文本或音频逻辑

# 修改前必须阅读

- `../README.md`
- `../../README.md`
- `../../../README.md`
- `../../../../PROJECT_MAP.md`
- `../../../../AGENTS.md`

# 命名规则

- effect family 目录：`three-life`
- 入口文件：`index.ts`
- 子层拆分目录：`core/`、`react/`

# 边界说明

本目录只负责特效族本身。
特效如何被模板或视频使用，由上层 runtime adapter 与应用装配层决定。

# Codex 规则

- 修改本目录文件前必须阅读本 README。
- 新增 effect family 时必须先建目录 README。
- 不允许把实验页 UI 控件定义写进纯引擎目录。
