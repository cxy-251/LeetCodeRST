# 项目结构地图

本文件是仓库导航入口。任何代码修改前，都必须先阅读本文件，再定位目标目录的 `README.md`。

## 顶层维护目录

- `apps/`
  - 前端预览站点与 Remotion 渲染应用。
- `packages/`
  - 可复用库、模板引擎、类型定义、内容管线、特效模块。
- `services/`
  - Python TTS、论文接入、总结契约、图片提供等服务层。
- `tools/`
  - Node 脚本入口、批处理、manifest 组装、资产处理工具。
- `data/`
  - 手工维护的模板、profile、批量配置、静态图片与输入资源。
- `docs/`
  - 面向开发者的说明文档、交接文档、架构文档。
- `public/`
  - 根级静态资源占位目录。

## 重点代码路径

- `apps/editor-web/src/`
  - 预览站点 React 代码。
- `apps/video-renderer/src/`
  - Remotion 视频图层和组合入口。
- `packages/content-pipeline/src/`
  - 文本、背景、特效、时间 cue 的核心管线。
- `packages/content-pipeline/src/effects/three-life/`
  - `ThreeLife` 的纯引擎与 React 适配层。
- `packages/content-pipeline/src/effects/rubiks-cube/`
  - Rubik's Cube 自动解算特效族的纯引擎与 React 适配层。
- `packages/atomic-ui/src/`
  - 原子展示组件。
- `packages/timeline-engine/src/`
  - 模板配置转 React 节点树。
- `packages/shared-types/src/`
  - 跨层共享类型。
- `tools/lib/`
  - 脚本层公共函数。

## 配置与输入资源

- `data/content-profiles/`
  - 论文总结文本 profile。
- `data/cover-assets/`
  - 背景图 profile 索引。
- `data/manifests/`
  - 视频输入 manifest。
- `data/templates/`
  - 模板配置文件。
- `data/video-batches/`
  - 批量视频组合 CSV。
- `data/images/`
  - 可维护的输入图片。

## 服务与外部输入

- `services/summarizer/`
  - 外部 AI 总结 JSON 模板、提示词、导入服务。
- `services/paper-ingest/`
  - PDF 文本抽取与论文接入相关服务。
- `services/tts-python/`
  - Python `edge-tts` 入口。

## 默认不手工维护的目录

- `node_modules/`
- `build/`
- `dist/`
- `output/`
- `data/generated-*`
- `data/manifests/generated/`
- `data/manifests/ingest/`
- `data/content-profiles/generated/`
- `data/video-batches/generated/`

这些目录默认视为生成结果或缓存目录，不应直接手改。若必须修改，先创建或补齐对应目录 `README.md`。
