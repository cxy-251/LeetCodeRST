# 目录职责

`packages/webgl-backgrounds/` 预留给“背景层专属”的 WebGL 特效模块。

# 允许内容

- 背景层 WebGL 特效实现
- 背景层辅助类型与注册入口

# 禁止内容

- 中间层小游戏特效
- 页面级交互控件
- 模板装配逻辑

# 修改前必须阅读

- `../README.md`
- `../../README.md`
- `../../PROJECT_MAP.md`
- `../../AGENTS.md`

# 命名规则

- `XxxBackground.tsx`
- `useXxxBackground.ts`
- `*.types.ts`

# 边界说明

本目录只负责背景层特效。
中间层主体特效在 `packages/content-pipeline/src/effects/`。

# Codex 规则

- 修改本目录文件前必须阅读本 README。
- 不允许把中间层 effect atom 混入背景层目录。
