# 目录职责

`data/prompts/` 存放与内容生成相关的提示词资源。

# 允许内容

- 提示词文本
- Prompt 模板

# 禁止内容

- 执行脚本
- 最终代码实现
- 与提示词无关的业务说明

# 修改前必须阅读

- `../README.md`
- `../../README.md`
- `../../PROJECT_MAP.md`
- `../../AGENTS.md`

# 命名规则

- `*.md`
- `*.txt`

# 边界说明

这里存 prompt 资源，不存 prompt 调用逻辑。
调用逻辑应在 `tools/` 或 `services/`。

# Codex 规则

- 修改本目录文件前必须阅读本 README。
- 不允许把 prompt 解释性文档和运行脚本混在一起。
