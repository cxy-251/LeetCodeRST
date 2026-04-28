# 目录职责

`packages/motion-presets/` 预留给页面、字幕和文本动效预设。

# 允许内容

- 动效预设定义
- 动效 preset 注册逻辑

# 禁止内容

- 页面组件
- WebGL effect 引擎
- CLI 脚本

# 修改前必须阅读

- `../README.md`
- `../../README.md`
- `../../PROJECT_MAP.md`
- `../../AGENTS.md`

# 命名规则

- `XxxMotionPreset.ts`
- `index.ts`

# 边界说明

这里只定义动效 preset。
具体使用位置由 `content-pipeline`、`timeline-engine` 和应用层决定。

# Codex 规则

- 修改本目录文件前必须阅读本 README。
- 不允许把具体页面结构写进 preset 包。
