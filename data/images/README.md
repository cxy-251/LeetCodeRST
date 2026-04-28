# 目录职责

`data/images/` 存放可手工维护的输入图片资源。

# 允许内容

- 输入背景图
- 示例图
- 本地准备后的 9:16 图片
- `.gitkeep`

# 禁止内容

- 代码文件
- 论文 JSON
- 音频与视频产物

# 修改前必须阅读

- `../README.md`
- `../../README.md`
- `../../PROJECT_MAP.md`
- `../../AGENTS.md`

# 命名规则

- 原图建议：`<name>-source.<ext>`
- 竖屏图建议：`<name>-9x16.<ext>`
- 准备目录：`prepared/`

# 边界说明

这里放图片资产本身。
图片 profile 在 `cover-assets/`，图片处理脚本在 `tools/`。

# Codex 规则

- 修改本目录文件前必须阅读本 README。
- 默认不要改本地私有图片路径规则。
- `prepared/` 更适合放脚本生成的位图结果。
