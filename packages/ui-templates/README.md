# 目录职责

`packages/ui-templates/` 预留给模板相关共享约定与未来模板辅助代码。

# 允许内容

- 模板约定说明
- 模板辅助类型或注册入口

# 禁止内容

- 具体模板 JSON
- 原子组件实现
- 页面逻辑

# 修改前必须阅读

- `../README.md`
- `../../README.md`
- `../../PROJECT_MAP.md`
- `../../AGENTS.md`

# 命名规则

- 模板辅助文件：`*.ts`
- 目录说明：`README.md`

# 边界说明

当前模板配置真正放在 `data/templates/*.json`。
本目录只保留模板共享层的扩展空间。

# Codex 规则

- 修改本目录文件前必须阅读本 README。
- 不允许把模板 JSON 误放进本目录。
