# 目录职责

`packages/content-pipeline/src/effects/donut-spin/core/` 负责旋转甜甜圈特效的纯 Three.js / WebGL 核心逻辑。

# 允许内容

- 引擎类
- 几何/材质创建函数
- 释放逻辑

# 禁止内容

- React hook
- 页面级状态
- effect lab 控件定义

# 修改前必须阅读

- `../README.md`
- `../../README.md`
- `../../../README.md`
- `../../../../../../PROJECT_MAP.md`
- `../../../../../../AGENTS.md`

# 命名规则

- 引擎：`ThreeDonutEngine.ts`
- 创建：`createDonutMeshes.ts`
- 释放：`disposeThreeDonut.ts`

# 边界说明

这里只负责纯引擎，不处理 React 生命周期和实验页交互。

# Codex 规则

- 修改本目录文件前必须阅读本 README。
- 不允许把 React 依赖引入 core。
