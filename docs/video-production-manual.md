# 视频生产手册

本手册面向“如何通过改配置生成不同视频”。

目标不是解释所有内部实现，而是让你快速知道：

1. 改什么内容会生成不同视频
2. 单个视频怎么渲染
3. 批量视频怎么渲染
4. 论文文本、背景图、WebGL 特效分别从哪里切换

## 1. 生成不同视频的三个核心开关

当前系统最重要的 3 个输入维度是：

1. `contentProfile`
   这条视频讲什么论文、用什么总结文本
2. `coverProfile` 或 `cover_image_path`
   这条视频用哪张背景图
3. `effectProfile`
   这条视频中间层用哪种 WebGL 特效

可以把它理解成：

- 内容：讲什么
- 背景：看什么图
- 特效：中间层怎么动

## 2. 单个视频的标准生成方式

### 2.1 直接渲染一个 manifest

```bash
npm run produce:video data/manifests/demo-paper.json
```

如果不带路径：

```bash
npm run produce:video
```

系统会使用默认入口 manifest。

### 2.2 手工修改 manifest 来生成不同视频

当前示例文件：

- `data/manifests/demo-paper.json`

最常改的字段是：

```json
{
  "contentProfile": {
    "id": "demo-layout-priors"
  },
  "coverProfile": {
    "id": "portrait-default"
  },
  "effectProfile": {
    "id": "life-game"
  }
}
```

含义：

- `contentProfile.id`
  控制论文总结文本
- `coverProfile.id`
  控制背景图
- `effectProfile.id`
  控制整条视频使用哪一个 WebGL 特效族

## 3. 论文文本怎么切换

### 3.1 使用已有 content profile

当前 profile 索引文件：

- `data/content-profiles/index.json`

例如：

- `demo-layout-priors`
- `agentic-world-modeling`

只要把 manifest 里的：

```json
"contentProfile": {
  "id": "agentic-world-modeling"
}
```

换掉，就会用另一份论文总结文本。

### 3.2 使用外部 AI 总结 JSON

如果你把 PDF 发给其他 AI 做总结，推荐它按这里的模板返回：

- `services/summarizer/video-script-template.json`
- `services/summarizer/video-script-prompt.md`

拿到 JSON 后导入：

```bash
npm run import:summary-json -- \
  --input /path/to/video-script.json \
  --profile-id my-paper-summary \
  --register
```

导入后会生成：

- `data/content-profiles/generated/my-paper-summary.json`

然后你就可以在 manifest 或 CSV 里把：

```json
"contentProfile": {
  "id": "my-paper-summary"
}
```

切过去。

## 4. 背景图怎么切换

### 4.1 使用已有 cover profile

当前背景图索引：

- `data/cover-assets/index.json`

例如：

- `portrait-default`
- `abstract-orbit`

manifest 中改这里：

```json
"coverProfile": {
  "id": "abstract-orbit"
}
```

### 4.2 使用你自己的图片

如果你有 AI 生成图或网图，建议先处理成 9:16：

```bash
npm run prepare:cover-image -- \
  --input /path/to/source.jpg \
  --output data/images/prepared/source-9x16.jpg
```

然后有两种接法：

1. 先做成 `coverProfile`
2. 直接在 batch CSV 的 `cover_image_path` 里填路径

## 5. WebGL 特效怎么切换

当前 effect family 是“整条视频选一个 family”。

manifest 中改：

```json
"effectProfile": {
  "id": "life-game"
}
```

当前常见值包括：

- `life-game`
- `snake-grid`
- `particle-orbit`
- `lights-beams`
- `rubiks-solver`

原则：

- 一条视频只选一个 `effectProfile.id`
- 页面里的不同 scene 会沿用这一个 family 的启动页 / 主运行页变体

## 6. 批量生产视频

### 6.1 批量配置文件在哪里

示例 CSV：

- `data/video-batches/demo-batch.csv`

这个 CSV 的前几列是最重要的：

```csv
# enabled,row_id,content_profile_id,cover_image_path,cover_profile_id,effect_profile_id,project_id,cover_image_source,seed,voice_name,voice_rate,voice_pitch,base_manifest_path
```

推荐理解为：

1. `content_profile_id`
   这行视频讲哪篇论文
2. `cover_image_path`
   直接指定背景图路径
3. `cover_profile_id`
   如果不直给路径，就走已注册背景图
4. `effect_profile_id`
   这行视频用哪种 WebGL 特效

后面的列如果没有特殊需求，可以继续沿用默认值。

### 6.2 一次渲染整张表

```bash
npm run produce:video -- --batch-config data/video-batches/demo-batch.csv
```

### 6.3 只渲染指定几行

```bash
npm run produce:video -- --batch-config data/video-batches/demo-batch.csv --rows 1,3
```

### 6.4 渲染一个区间

```bash
npm run produce:video -- --batch-config data/video-batches/demo-batch.csv --rows 2-4
```

## 7. 一条视频最推荐的生产流程

如果你已经有：

- 一份论文总结文本
- 一张背景图
- 一个想用的 WebGL 特效

推荐流程：

1. 导入或准备论文总结
2. 准备背景图到 9:16
3. 新增或修改一行 batch CSV
4. 执行 `produce:video`

### 示例流程

1. 导入总结 JSON

```bash
npm run import:summary-json -- \
  --input /path/to/video-script.json \
  --profile-id paper-a \
  --register
```

2. 处理背景图

```bash
npm run prepare:cover-image -- \
  --input /path/to/cover.jpg \
  --output data/images/prepared/paper-a-cover.jpg
```

3. 在 CSV 里加一行

```csv
true,paper-a-row,paper-a,data/images/prepared/paper-a-cover.jpg,,lights-beams,,local,42,zh-CN-XiaoxiaoNeural,+80%,+0Hz,
```

4. 渲染这一行

```bash
npm run produce:video -- --batch-config data/video-batches/demo-batch.csv --rows 1
```

## 8. 从最新 arXiv AI 论文开始

如果你还没有论文输入，可以先抓最新论文：

```bash
npm run prepare:latest-ai-batch -- --limit 3
```

这条命令会串起：

1. 抓取最新 `cs.AI`
2. 下载 PDF
3. 抽 PDF 文本
4. 生成 source bundle
5. 生成分析结果
6. 生成候选 manifest / content profile
7. 生成批量 CSV

生成后的 CSV 通常在：

- `data/video-batches/generated/latest-ai-batch.csv`

然后你可以手改：

- `content_profile_id`
- `cover_image_path`
- `effect_profile_id`

再批量渲染。

## 9. 产物放在哪里

每次运行都会写到 run 目录：

```text
output/runs/<project-id>/<run-id>/
```

里面通常会有：

- `inputs/production-manifest.json`
- `manifests/render-manifest.json`
- `audio/`
- `meta/`
- `paper/`
- `images/`
- `video/`
- `run-summary.json`

全局索引：

- `output/latest-run.json`
- `output/video-runs.csv`

## 10. 缓存与避免重复生成

当前系统已经支持：

- PDF 缓存
- 音频缓存

缓存目录包括：

- `output/cache/papers`
- `output/cache/audio`

也就是说：

- 相同论文 PDF 不会反复下载
- 相同文本 + 相同 voice 参数不会重复生成 mp3

## 11. 当前建议你优先改哪些内容

如果你只想快速生成不同视频，优先改这三个：

1. `content_profile_id`
2. `cover_image_path` 或 `cover_profile_id`
3. `effect_profile_id`

这三个决定了绝大多数视频差异。

## 12. 当前已知限制

1. 某些 WebGL 特效 family 还在持续打磨中，视觉细节并不是最终版。
2. `lights-beams` 当前仍在继续逼近参考站点，光球连续性还不算最终完成。
3. effect lab 和最终视频共享同一套 family，但实验页观感仍可能先于视频模板成熟。

## 13. 最短操作清单

### 单个视频

1. 改 `data/manifests/demo-paper.json`
2. 改：
   - `contentProfile.id`
   - `coverProfile.id`
   - `effectProfile.id`
3. 运行：

```bash
npm run produce:video data/manifests/demo-paper.json
```

### 批量视频

1. 改 `data/video-batches/demo-batch.csv`
2. 每行主要改：
   - `content_profile_id`
   - `cover_image_path`
   - `effect_profile_id`
3. 运行：

```bash
npm run produce:video -- --batch-config data/video-batches/demo-batch.csv
```

### 只跑几行

```bash
npm run produce:video -- --batch-config data/video-batches/demo-batch.csv --rows 1,3
```
