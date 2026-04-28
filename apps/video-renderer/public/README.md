# 目录职责

`apps/video-renderer/public/` 负责 Remotion 渲染时可访问的静态资源。

# 允许内容

- 运行时复制进来的音频与图片
- `.gitkeep`
- 对渲染器可见的静态占位资源

# 禁止内容

- 源代码
- 需要手工长期维护的业务配置
- 不可复现的临时调试文件

# 修改前必须阅读

- `../README.md`
- `../../README.md`
- `../../../PROJECT_MAP.md`
- `../../../AGENTS.md`

# 命名规则

- 生成音频放在 `generated-audio/`
- 生成图片放在 `generated-images/`
- 空目录保留 `.gitkeep`

# 边界说明

这里是渲染应用的静态资源入口，不是输入资源的长期仓库。
长期维护的图片和配置应放在 `data/`。

# Codex 规则

- 修改本目录文件前必须阅读本 README。
- 默认只允许脚本复制生成物进入本目录。
- 不允许把业务源码放进本目录。
