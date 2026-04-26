# timeline-engine

模板引擎层。

职责：

1. 读取 `RenderManifest.templateDocument`
2. 选择适合当前 scene 的模板定义
3. 按模板顺序调用 atomic UI registry
4. 输出最终的 React 节点树

核心 API：

- `renderTemplateZone({zone, context})`
