# 目录职责

`packages/content-pipeline/src/effects/rubiks-cube/core/` 负责 Rubik's Cube 纯 Three.js / WebGL 核心逻辑。

# 允许内容

- 引擎类
- cubie 构建函数
- move 计算函数
- GPU 释放函数

# 禁止内容

- React hook
- Remotion hook
- 页面按钮、交互状态、实验页文案

# 修改前必须阅读

- `../README.md`
- `../../README.md`
- `../../../README.md`
- `../../../../../../PROJECT_MAP.md`
- `../../../../../../AGENTS.md`

# 命名规则

- `ThreeRubiksEngine.ts`
- `createRubiksCubelets.ts`
- `applyRubiksMove.ts`
- `updateRubiksCubelets.ts`
- `disposeThreeRubiks.ts`

# 边界说明

这里必须保持纯引擎，无 React、无 Remotion 依赖。
所有网页或视频端差异，必须交给 `react/` 适配层解决。

# Codex 规则

- 修改本目录文件前必须阅读本 README。
- 不允许引入 React、Remotion 或浏览器页面状态依赖。
- 不允许把业务层条件分支塞进引擎。
