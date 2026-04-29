# 目录职责

`packages/content-pipeline/src/effects/shared/` 负责多个 WebGL effect family 共用的展示层能力，例如镜头 rig、地面/halo/阴影这类 stage accents。

# 允许内容

- 纯 Three.js 共享工具
- 共享展示层类型
- 可复用的 stage accent 构建函数
- 可复用的 camera rig 更新函数

# 禁止内容

- React hook
- Remotion hook
- 某个单一 effect family 的私有业务逻辑
- effect lab 页面控件

# 修改前必须阅读

- `../README.md`
- `../../README.md`
- `../../../README.md`
- `../../../../../PROJECT_MAP.md`
- `../../../../../AGENTS.md`

# 命名规则

- `createXxx.ts`
- `updateXxx.ts`
- `*.types.ts`

# 边界说明

这里是“多个特效都能复用的展示能力”。
如果逻辑只服务于某一个 effect family，应继续留在对应 family 目录里。

# Codex 规则

- 修改本目录文件前必须阅读本 README。
- 不允许引入 React、Remotion 或页面交互状态。
- 不允许把单一特效的私有算法硬塞进共享展示层。
