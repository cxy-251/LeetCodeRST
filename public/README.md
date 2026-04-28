# 目录职责

根级 `public/` 目录存放可被本地工具链直接读取的静态资源占位文件。

# 允许内容

- 静态占位资源
- 生成目录的 `.gitkeep`

# 禁止内容

- 业务源码
- 长期维护的输入资源
- 应用层页面代码

# 修改前必须阅读

- `../README.md`
- `../PROJECT_MAP.md`
- `../AGENTS.md`

# 命名规则

- 生成音频：`generated-audio/`
- 生成图片：`generated-images/`

# 边界说明

这里是根级静态资源区。
长期维护的输入图片仍应放在 `data/images/`。

# Codex 规则

- 修改本目录文件前必须阅读本 README。
- 不允许把源码放进 `public/`。
