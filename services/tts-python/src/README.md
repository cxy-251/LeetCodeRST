# 目录职责

`services/tts-python/src/` 负责 Python TTS 源码。

# 允许内容

- Python 入口文件
- 与 TTS 直接相关的辅助模块

# 禁止内容

- Node 脚本
- 前端组件
- 运行产物

# 修改前必须阅读

- `../README.md`
- `../../README.md`
- `../../../PROJECT_MAP.md`
- `../../../AGENTS.md`

# 命名规则

- Python 文件：`snake_case.py`
- 入口建议：`main.py`

# 边界说明

这里只处理 Python 侧 TTS。
流程编排与缓存复用仍在 `tools/`。

# Codex 规则

- 修改本目录文件前必须阅读本 README。
- 不允许把项目级流程控制写进 Python 入口。
