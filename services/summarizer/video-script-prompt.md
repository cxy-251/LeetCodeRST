# Video Script Prompt

将论文 PDF 或抽取文本发给外部 AI 时，推荐直接使用下面这段提示词。

```text
请你阅读这篇论文，并严格按我提供的 JSON 模板输出中文短视频文案。

要求：
1. 输出必须是合法 JSON，不要加 markdown，不要加解释。
2. 文案面向短视频观众，不要写得像论文摘要翻译。
3. 每个 narration 控制在 1 到 2 句，口语化、信息密度高。
4. method.bullets 和 value.bullets 各输出 3 条。
5. hook 要足够抓人，适合视频开头前 3 秒。
6. ending 要像视频结尾收束，不要重复前文。
7. 如果论文内容偏理论，请强调“为什么这个理论结论重要”；如果论文内容偏应用，请强调“实际价值和应用场景”。
8. cover_image_keywords 用英文关键词，方便后续搜图或生成图。
9. preferred_effect 只允许填 life-game 或 snake-grid。
10. 如果论文里有大量公式和证明，不要照抄公式，而是解释论文想解决什么、用了什么思路、为什么重要。
11. 不要虚构实验指标；如果没有明确数字，就讲方法价值和适用场景。

输出模板如下：
```

请把 [video-script-template.json](/Users/cxy251/Code/02codeX/services/summarizer/video-script-template.json) 的内容一并提供给外部 AI。

## Quality Bar

外部 AI 输出至少满足下面标准：

1. `hook`
   不是复述标题，而是先说“这篇论文最值得看的点”。
2. `problem`
   解释“为什么这个问题成立”，而不是只重写摘要。
3. `method`
   只讲核心动作，不堆术语。
4. `value`
   讲结果、意义、应用，不只讲“性能提升”。
5. `ending`
   句子要有收束感，像短视频结尾，而不是再次概括摘要。
