# 目录职责

`packages/content-pipeline/src/` 是内容与视觉管线源码目录。

# 允许内容

- 视觉解析逻辑
- effect runtime 适配层
- WebGL effect 入口
- 类型、service、hook、工具函数

# 禁止内容

- 应用页面代码
- CLI 脚本入口
- 只属于单个目录的 README 之外的跨层临时逻辑

# 修改前必须阅读

- `../README.md`
- `../../README.md`
- `../../../PROJECT_MAP.md`
- `../../../AGENTS.md`

# 命名规则

- 类型：`*.types.ts`
- 服务：`*.service.ts`
- Hook：`useXxx.ts`
- Effect 组件：`three-xxx-effect.tsx`
- 聚合出口：`index.ts`

# 边界说明

本目录负责共享视觉逻辑，不直接感知具体页面布局。
React 页面壳层属于 `apps/`，模板组合属于 `packages/timeline-engine/`。

# Codex 规则

- 修改本目录文件前必须阅读本 README。
- 不允许把 React 页面层状态下沉成共享默认逻辑。
- 复杂 effect 应优先继续拆到子目录，而不是把 hook 继续做大。
