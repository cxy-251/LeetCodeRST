# 目录职责

`tools/` 负责 Node/TS 脚本入口、批处理命令和产物编排。

# 允许内容

- CLI 脚本入口
- 与脚本直接相关的 README
- `lib/` 公共工具

# 禁止内容

- React 页面代码
- 长期共享 UI 逻辑
- Python 服务实现

# 修改前必须阅读

- `../README.md`
- `../PROJECT_MAP.md`
- `../AGENTS.md`

# 命名规则

- 脚本入口：`verb-noun.ts`
- 批处理：`prepare-*.ts`、`build-*.ts`
- 导入工具：`import-*.ts`

# 边界说明

这里负责“串流程”和“调服务”。
真正的共享逻辑尽量沉到 `tools/lib/` 或 `packages/`。

# Codex 规则

- 修改本目录文件前必须阅读本 README。
- 不允许把通用业务逻辑长期堆在脚本入口里。
- 如需复用，优先抽到 `tools/lib/` 或 `packages/`。
