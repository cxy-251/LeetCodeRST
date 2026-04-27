# PaperToVideo

PaperToVideo 是一个模块化论文视频生成项目，目标是将 arXiv AI 论文自动转化为适合短视频平台发布的音画同步短视频。

核心链路：

1. 获取论文内容
2. 生成 AI 总结与视频脚本
3. 生成或匹配图片素材
4. 组织成 React 网页幻灯片
5. 使用 Edge TTS 生成配音
6. 使用 Remotion 渲染为 MP4

当前仓库阶段以架构设计与工程骨架初始化为主。

## 当前可执行链路

当前已经具备一条最小可运行链路：

1. `npm install`
2. `npm run compose:manifest`
3. `npm run generate:audio`
4. `npm run render:video`
5. `npm run dev:editor`

说明：

1. Node 侧使用 `npm`，因为当前机器已有 `npm` 但没有 `pnpm`。
2. Python TTS 侧默认使用本地 `conda kwai` 环境中的 `edge_tts`。
3. 当前视频渲染是 MVP，先跑通单篇论文总结页与字幕同步，后续再接论文抓取、AI 总结、配图和 WebGL 增强。
4. `dev:editor` 会启动本地网页预览，用于查看多场景论文幻灯片效果。

## 组合配置与批量渲染

单个视频仍然保持原来的方式：

1. `npm run produce:video`
2. `npm run produce:video data/manifests/demo-paper.json`

如果你希望通过“只包含用户输入字段”的配置表来控制视频组合，可以编辑：

- [data/video-batches/demo-batch.csv](/Users/cxy251/Code/02codeX/data/video-batches/demo-batch.csv)

这个 CSV 的每一行代表一个视频组合，当前重点字段是：

1. `content_profile_id`
2. `cover_image_path`
3. `cover_profile_id`
4. `effect_profile_id`
5. `voice_name`
6. `voice_rate`
7. `voice_pitch`
8. `seed`

说明：

1. `content_profile_id`
   表示使用哪份论文总结文本
2. `cover_image_path`
   表示直接使用哪一张背景图
3. `cover_profile_id`
   表示如果不想直接写图片路径，就从封面图库里选一个
4. `effect_profile_id`
   表示这一条视频使用哪一种 WebGL 特效

推荐优先级：

1. 如果你已经有具体图片，优先写 `cover_image_path`
2. 如果你只想复用仓库里的预设图，再写 `cover_profile_id`

## 背景图 9:16 处理工具

如果你后面拿 AI 生成图或网图作为入参，先用这个工具把图片处理成适合手机竖屏的 9:16：

```bash
npm run prepare:cover-image -- \
  --input /path/to/your-image.jpg \
  --output data/images/prepared/your-cover-9x16.jpg
```

然后把输出路径填进 CSV 的 `cover_image_path` 列即可。

这个工具当前主要面向：

1. `jpg`
2. `png`
3. `webp`
4. 常见网络图片 URL

输出目录 `data/images/prepared/*` 默认视为本地工作产物，不会自动进 git。

执行整表批量渲染：

```bash
npm run produce:video -- --batch-config data/video-batches/demo-batch.csv
```

只渲染指定行：

```bash
npm run produce:video -- --batch-config data/video-batches/demo-batch.csv --rows 1,3
```

按区间渲染：

```bash
npm run produce:video -- --batch-config data/video-batches/demo-batch.csv --rows 2-4
```

批量模式下，系统会先为每一行自动生成一份本地 manifest 到：

- `data/manifests/generated/*.json`

然后再按原来的：

1. `compose:manifest`
2. `generate:audio`
3. `build-video`

顺序渲染，所以不会破坏现有的视频主链路。

## 最新论文一键准备链路

如果你希望从最新 `cs.AI` 论文一路准备到“可批量渲染的组合表”，可以执行：

```bash
npm run prepare:latest-ai-batch -- --limit 3
```

这条命令会顺序完成：

1. 抓取最新论文并下载 PDF
2. 抽取 PDF 文本
3. 生成 source bundle
4. 生成中文脚本草案
5. 生成 ingest manifests 和 generated content profiles
6. 生成批量配置表：
   - `data/video-batches/generated/latest-ai-batch.csv`

这份自动生成的 CSV 现在会把以下字段放在前几列：

1. `content_profile_id`
2. `cover_image_path`
3. `cover_profile_id`
4. `effect_profile_id`

然后你就可以直接批量渲染：

```bash
npm run produce:video -- --batch-config data/video-batches/generated/latest-ai-batch.csv
```

如果只想跑其中几条：

```bash
npm run produce:video -- --batch-config data/video-batches/generated/latest-ai-batch.csv --rows 1,2
```

## 外部 AI 总结 JSON 导入

如果你把 PDF 发给其他 AI，让它按项目模板输出总结 JSON，现在可以直接导入成系统可消费的 `contentProfile`：

```bash
npm run import:summary-json -- \
  --input /path/to/video-script.json \
  --profile-id my-paper-summary \
  --register
```

这个命令会：

1. 读取外部 AI 返回的总结 JSON
2. 自动归一化常见字段别名
3. 生成：
   - `data/content-profiles/generated/my-paper-summary.json`
4. 如果加了 `--register`，还会自动写入：
   - `data/content-profiles/index.json`

当前导入器已经兼容一些常见字段变体，例如：

1. `video_script / videoScript / script`
2. `preferred_effect / preferredEffect`
3. `title / heading / headline`
4. `narration / voiceover / script`
5. `bullets / points / highlights`

总结 JSON 的推荐模板见：

- [services/summarizer/video-script-template.json](/Users/cxy251/Code/02codeX/services/summarizer/video-script-template.json)
- [services/summarizer/video-script-prompt.md](/Users/cxy251/Code/02codeX/services/summarizer/video-script-prompt.md)

## 无网络开发模式

如果当前环境不能访问 `edge-tts` 依赖的在线语音服务，可以使用 mock 模式：

1. `npm run compose:manifest`
2. `npm run generate:audio:mock`
3. `npm run render:video`

在这个模式下，项目不会真实生成语音文件，而是先生成音频元数据、字幕分段和占位音频引用，用于继续开发视频编排与页面动效。
