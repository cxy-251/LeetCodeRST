# 目录职责

`tools/lib/` 负责脚本层公共函数和辅助模块。

# 允许内容

- 脚本层共享 helper
- manifest factory
- 批处理辅助逻辑

# 禁止内容

- 可直接执行的 CLI 入口
- 前端页面逻辑
- 与脚本无关的共享 UI

# 修改前必须阅读

- `../README.md`
- `../../README.md`
- `../../PROJECT_MAP.md`
- `../../AGENTS.md`

# 命名规则

- `*.ts`
- `*.service.ts`
- `*.types.ts`

# 边界说明

这里是脚本层公共库。
如果能力需要被应用或多个包共用，应进一步上移到 `packages/`。

# Codex 规则

- 修改本目录文件前必须阅读本 README。
- 不允许把仅供单脚本使用的大量私有逻辑无意义抽到这里。
