# 目录职责

`data/cover-assets/` 维护背景图 profile 与封面图索引。

# 允许内容

- 背景图 profile JSON
- 背景图索引

# 禁止内容

- 原始大图二进制文件
- 论文总结文本
- 视频 manifest

# 修改前必须阅读

- `../README.md`
- `../../README.md`
- `../../PROJECT_MAP.md`
- `../../AGENTS.md`

# 命名规则

- 索引：`index.json`
- profile：`<cover-id>.json`

# 边界说明

这里定义“用哪张图、图的元信息是什么”。
真正的图片文件通常在 `data/images/`。

# Codex 规则

- 修改本目录文件前必须阅读本 README。
- 不允许把图片位图直接堆在本目录。
- 不允许把 effect 选择写进 cover profile。
