# Lego Architecture

当前项目已经开始按 3 层 Lego 结构组织：

## 1. Atomic UI

位置：

- `packages/atomic-ui`

职责：

1. 只做单一视觉职责
2. 不关心模板顺序
3. 不关心场景时间轴
4. 不关心数据来源

当前原子组件包括：

- `cover-avatar`
- `scene-kicker`
- `scene-title`
- `scene-body`
- `scene-bullets`
- `subtitle-panel`

扩展方式：

1. 在 `packages/atomic-ui/src/index.tsx` 新增原子组件
2. 在 shared types 里新增 `AtomicComponentId`
3. 在模板引擎 registry 注册这个组件

## 2. Template Config

位置：

- `data/templates/paper-digest-v1.json`

职责：

1. 决定用哪些原子组件
2. 决定这些组件按什么顺序出现
3. 决定组件出现在 `primary` 还是 `secondary` 区域

注意：

- 模板是配置文件，不是代码文件
- 场景类型到模板节点的映射也在这里定义

## 3. Template Engine

位置：

- `packages/timeline-engine`

职责：

1. 读取 `RenderManifest.templateDocument`
2. 选择适配当前 `scene.type` 的模板
3. 按模板顺序调用 atomic component registry
4. 输出最终可渲染的 React 节点

当前核心 API：

- `renderTemplateZone({ zone, context })`

## 4. Visual Modules

位置：

- `packages/content-pipeline/src/module-api.ts`
- `packages/content-pipeline/src/text-motion.ts`
- `packages/content-pipeline/src/visual-system.ts`
- `packages/content-pipeline/src/three-life-effect.tsx`

职责：

1. 管理背景、特效、文本动效的参数默认值
2. 提供模块 registry 和参数解析
3. 让模板层之外的视觉系统也保持可拆装

## 5. Runtime Flow

链路如下：

1. `data/manifests/*.json`
2. `tools/compose-manifest.ts`
3. 读取模板 JSON
4. 生成 `RenderManifest`
5. renderer/editor 调用 `timeline-engine`
6. `timeline-engine` 调 atomic component registry
7. 原子组件输出最终页面结构

## 6. Current Boundary

当前已经完成：

1. 前景文本区已接入 Atomic UI + Template Engine
2. 模板改动会影响 editor 和 video-renderer
3. 背景与 effect 仍然是独立视觉模块，但还未完全模板化

下一步建议：

1. 把背景和 effect 也做成更完整的组件化 registry
2. 增加更多 atomic components
3. 增加更多模板 JSON
