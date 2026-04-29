# 目录职责

`services/summarizer/` 负责论文总结输入契约、规则式总结、LM Studio 本地模型适配和外部 AI 总结导入服务。

# 允许内容

- 总结 JSON 模板
- 提示词文档
- 总结导入 service
- 规则式总结 service
- LM Studio 本地总结 service
- 类型定义

# 禁止内容

- 真正的视频渲染代码
- React 页面组件
- 直接抓取论文 PDF 的实现

# 修改前必须阅读

- `../README.md`
- `../../README.md`
- `../../PROJECT_MAP.md`
- `../../AGENTS.md`

# 命名规则

- 模板：`video-script-template.json`
- 提示词：`video-script-prompt.md`
- 示例：`video-script-example.json`
- 导入逻辑：`import-summary.service.ts`
- 总结调度：`summarize-paper.service.ts`
- 规则式总结：`rule-based-summary.service.ts`
- LM Studio 适配：`lm-studio.service.ts`
- 类型：`import-summary.types.ts`

# 边界说明

这里负责“论文文本如何被总结成统一结构”。
真正把 profile 装进视频链路的脚本在 `tools/`，内容落盘位置在 `data/content-profiles/`。

当前支持两种自动总结模式：

- `rule-based`
  纯规则 / 启发式，不依赖模型 API
- `lm-studio`
  通过 LM Studio 的 OpenAI 兼容本地接口生成脚本草案

# Codex 规则

- 修改本目录文件前必须阅读本 README。
- 不允许把宽松输入兼容逻辑散落到别的目录。
- 如果总结 JSON schema 变动，先更新本目录契约，再改下游消费方。
