# 目录职责

`data/video-batches/` 维护批量生成视频的组合配置表。

# 允许内容

- CSV 批量配置
- 批量配置说明

# 禁止内容

- 视频文件
- 音频产物
- 长篇论文正文

# 修改前必须阅读

- `../README.md`
- `../../README.md`
- `../../PROJECT_MAP.md`
- `../../AGENTS.md`

# 命名规则

- 示例：`demo-batch.csv`
- 生成表：`generated/*.csv`

# 边界说明

CSV 只放“用户要选什么组合”。
真正的 manifest 组装逻辑在 `tools/`。

# Codex 规则

- 修改本目录文件前必须阅读本 README。
- 优先把 `content_profile_id / cover_image_path / effect_profile_id` 放在前列。
- 默认不要手改 `generated/` 下的自动输出文件。
