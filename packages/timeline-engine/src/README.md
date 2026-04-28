# 目录职责

`packages/timeline-engine/src/` 负责模板配置到 React 节点树的装配逻辑。

# 允许内容

- 模板渲染函数
- 模板上下文类型
- 轻量装配 helper

# 禁止内容

- 原子组件实现
- 页面级路由状态
- WebGL 引擎代码

# 修改前必须阅读

- `../README.md`
- `../../README.md`
- `../../../PROJECT_MAP.md`
- `../../../AGENTS.md`

# 命名规则

- 入口：`index.tsx`
- 渲染函数：`renderXxx`

# 边界说明

这里负责“拼”组件，不负责定义组件视觉。
视觉组件在 `atomic-ui/`，内容解析在 `content-pipeline/`。

# Codex 规则

- 修改本目录文件前必须阅读本 README。
- 不允许把模板配置写死成单篇论文逻辑。
