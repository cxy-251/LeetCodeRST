# 目录职责

`services/tts-python/` 负责 Python `edge-tts` 配音服务入口。

# 允许内容

- Python TTS 服务代码
- 服务说明
- `src/` 目录

# 禁止内容

- Node CLI 入口
- React 页面
- 视频渲染逻辑

# 修改前必须阅读

- `../README.md`
- `../../README.md`
- `../../PROJECT_MAP.md`
- `../../AGENTS.md`

# 命名规则

- Python 入口：`src/main.py`
- 文档：`README.md`

# 边界说明

这里负责真实语音生成。
调度它的 Node 脚本在 `tools/generate-audio.ts`。

# Codex 规则

- 修改本目录文件前必须阅读本 README。
- 不允许把 Node 侧路径拼装逻辑塞进 Python 服务。
