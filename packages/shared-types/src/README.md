# 目录职责

`packages/shared-types/src/` 负责具体共享类型源码。

# 允许内容

- `type`
- `interface`
- 常量字面量类型

# 禁止内容

- 运行时副作用
- 网络请求
- React / Three / Remotion 逻辑

# 修改前必须阅读

- `../README.md`
- `../../README.md`
- `../../../PROJECT_MAP.md`
- `../../../AGENTS.md`

# 命名规则

- 类型集中导出：`index.ts`

# 边界说明

这里只描述形状，不做行为。
任何解析、归一化、默认值计算都应放回运行时包。

# Codex 规则

- 修改本目录文件前必须阅读本 README。
- 共享类型变更前需最小化影响面。
