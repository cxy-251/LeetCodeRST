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

## 下一步建议

后续可以继续补一层脚本，把这类 JSON 自动转换成 `contentProfile`，这样用户拿到外部 AI 输出后，不需要手动改字段，直接进视频链路。
