# 目录职责

`data/content-profiles/` 维护论文总结文本 profile。

# 允许内容

- 手工维护的内容 profile JSON
- profile 索引文件

# 禁止内容

- 模板文件
- 图片文件
- 音频或视频产物

# 修改前必须阅读

- `../README.md`
- `../../README.md`
- `../../PROJECT_MAP.md`
- `../../AGENTS.md`

# 命名规则

- 索引：`index.json`
- profile：`<profile-id>.json`

# 边界说明

这里描述“这条视频讲什么”。
背景图选择在 `cover-assets/`，模板结构在 `templates/`。

# Codex 规则

- 修改本目录文件前必须阅读本 README。
- 不允许把视觉参数硬塞进内容 profile。
- `generated/` 子目录默认视为导入生成结果，不手改。
