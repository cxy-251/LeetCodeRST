# 目录职责

`packages/content-pipeline/` 负责内容标准化、背景与特效参数解析、effect runtime 适配与 scene 视觉逻辑。

# 允许内容

- 内容管线代码
- effect runtime 适配层
- 可复用视觉解析逻辑
- `src/` 源码目录

# 禁止内容

- 应用层页面状态
- 一次性 CLI 入口
- Python 服务实现

# 修改前必须阅读

- `../README.md`
- `../../README.md`
- `../../PROJECT_MAP.md`
- `../../AGENTS.md`

# 命名规则

- Hook：`useXxx.ts`
- 适配层：`XxxAdapter.tsx`
- 类型：`*.types.ts`
- 服务/解析：`*.service.ts`
- 引擎目录：`effects/three-life/*`

# 边界说明

本包负责“共享内容与视觉逻辑”。
页面壳层在 `apps/`，模板装配在 `timeline-engine/`，共享原子组件在 `atomic-ui/`。

# Codex 规则

- 修改本目录文件前必须阅读本 README。
- 不允许把应用层交互状态直接耦合进共享 effect 核心。
- 如需跨 effect family 复用，优先抽公共函数，不要复制。
