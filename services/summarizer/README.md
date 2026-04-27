# summarizer

这个目录负责管理“论文文本获取后的总结输入规范”。

它当前不直接调用某个大模型，而是先把后续接入外部 AI 所需的契约固定下来。

## 当前文件

1. [video-script-template.json](/Users/cxy251/Code/02codeX/services/summarizer/video-script-template.json)
   外部 AI 必须返回的 JSON 模板。
2. [video-script-prompt.md](/Users/cxy251/Code/02codeX/services/summarizer/video-script-prompt.md)
   给外部 AI 的推荐提示词。
3. [video-script-example.json](/Users/cxy251/Code/02codeX/services/summarizer/video-script-example.json)
   一份合格输出示例。
4. [import-summary.service.ts](/Users/cxy251/Code/02codeX/services/summarizer/import-summary.service.ts)
   外部总结 JSON 到 `contentProfile` 的归一化逻辑。
5. [import-summary.types.ts](/Users/cxy251/Code/02codeX/services/summarizer/import-summary.types.ts)
   导入流程的类型定义。

## 设计目标

1. 让不同 AI 的总结输出结构一致
2. 让视频系统始终消费稳定字段，而不是自由文本
3. 保证不同论文输入后，视频风格仍然统一

## 当前约束

外部 AI 输出的重点字段：

1. `paper`
2. `video_script`
3. `visual_hints`

其中系统当前最关心的是：

1. `video_script.hook`
2. `video_script.problem`
3. `video_script.method`
4. `video_script.value`
5. `video_script.ending`
6. `visual_hints.cover_image_keywords`
7. `visual_hints.preferred_effect`

## 已实现的导入能力

现在已经可以通过下面的命令，把外部 AI 返回的总结 JSON 直接导入成 `contentProfile`：

```bash
npm run import:summary-json -- \
  --input /path/to/video-script.json \
  --profile-id my-paper-summary \
  --register
```

默认输出位置：

```text
data/content-profiles/generated/<profile-id>.json
```

`--register` 会把这份 `contentProfile` 自动写入：

- [data/content-profiles/index.json](/Users/cxy251/Code/02codeX/data/content-profiles/index.json)

这样后面就能直接在 manifest 或 batch CSV 里使用这个 `contentProfile.id`。

## 兼容策略

当前导入器是“宽松输入，标准输出”：

1. 支持 `video_script` / `videoScript` / `script`
2. 支持 `preferred_effect` / `preferredEffect`
3. 支持场景字段里的常见别名：
   - `title` / `heading` / `headline`
   - `narration` / `voiceover` / `script`
   - `bullets` / `points` / `highlights`

也就是说，后续总结 JSON 有小范围字段变动时，不需要立刻改整条视频链路，只要导入器还能识别这些别名，就能继续生成稳定的 `contentProfile`。

## 当前限制

1. 导入器目前主要面向 5 段式短视频结构：
   - `hook`
   - `problem`
   - `method`
   - `value`
   - `ending`
2. `visual_hints.cover_image_keywords` 和 `preferred_effect` 当前只会被读取并打印出来，还不会自动改写当前 manifest
3. 如果后续确定了新的正式总结 schema，建议再补一层严格校验而不是长期只靠宽松别名兼容
