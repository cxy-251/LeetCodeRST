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

## 无网络开发模式

如果当前环境不能访问 `edge-tts` 依赖的在线语音服务，可以使用 mock 模式：

1. `npm run compose:manifest`
2. `npm run generate:audio:mock`
3. `npm run render:video`

在这个模式下，项目不会真实生成语音文件，而是先生成音频元数据、字幕分段和占位音频引用，用于继续开发视频编排与页面动效。
