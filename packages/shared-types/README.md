# 目录职责

`packages/shared-types/` 维护跨层共享类型包。

# 允许内容

- 类型定义
- 类型导出入口
- 类型包 README

# 禁止内容

- 运行时业务逻辑
- React 组件
- Three.js 引擎

# 修改前必须阅读

- `../README.md`
- `../../README.md`
- `../../PROJECT_MAP.md`
- `../../AGENTS.md`

# 命名规则

- 类型目录：`src/`
- 导出入口：`index.ts`

# 边界说明

这里只放跨层共享的数据形状。
不要在这里引入运行时依赖。

# Codex 规则

- 修改本目录文件前必须阅读本 README。
- 修改共享类型前，先确认会影响哪些目录。
- 不允许把运行时 helper 混进类型包。
