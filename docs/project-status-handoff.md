# PaperToVideo 项目状态交接

## 1. 项目位置

- 工作目录：`/Users/cxy251/Code/02codeX`
- GitHub 仓库：`https://github.com/cxy-251/paperToVideo.git`
- 当前分支：`main`

---

## 2. 当前推荐命令

### 标准整条链路

```bash
npm run produce:video
```

### 使用本地真人图案例

```bash
npm run produce:video data/manifests/demo-paper.local.json
```

说明：

1. `demo-paper.local.json` 是用户当前实际使用的版本。
2. 该文件和相关真人图资产只在本地生效，不上传 GitHub。

### 分步执行

```bash
npm run compose:manifest
npm run generate:audio
npm run render:video
```

---

## 3. 用户当前实际使用的配置

用户当前明确说明：

1. 实际使用的是本地专用配置 `data/manifests/demo-paper.local.json`
2. 本地真人图只做本地使用，不上传 GitHub

本地专用资源包括：

- `data/manifests/demo-paper.local.json`
- `data/images/case-beauty-portrait-source.jpeg`
- `data/images/case-beauty-portrait-9x16.jpg`
- 根目录原始文件 `large-1760723512-2370bb8a2f7bdc27e8d0eac60e925c4a.jpeg`

这些文件已写入本地 `.git/info/exclude`，不会进入远端仓库。

---

## 4. 已完成能力

### 基础链路

1. React 组件化页面
2. Remotion 视频渲染入口
3. Python `edge-tts` 语音生成
4. Node 调度脚本

### 工程组织

1. run 级别产物目录
2. `output/latest-run.json`
3. `output/video-runs.csv`
4. 每次视频生成一条台账记录

### 时间轴与配音

1. 真实音频时长通过 `ffprobe` 回写
2. 语速默认值已调到 `+80%`
3. 字幕已从整段改为句级/短分句
4. 音频按 scene 时间点播放

### 背景系统

1. `coverImage` 已接入 manifest
2. 首页支持本地/远程封面图
3. 背景系统已开始从“单一 background preset”拆成模块化结构：
   - `backgroundImageLayoutId`
   - `backgroundEffectId`
   - 文本层保持独立
4. 其他页已接入封面图象限布局机制：
   - `cover-focus-tl`
   - `cover-focus-tr`
   - `cover-focus-br`
   - `cover-focus-bl`
5. 当前已支持的 effect preset：
   - `aurora`
   - `grid-drift`
   - `noise-bloom`
   - `cellular-life`
6. `cellular-life` 当前是“生命游戏风格”的显式块状原型层，已独立于背景图层存在，后续可继续换成真正的 WebGL/shader 实现
5. 已加入本地真人图案例，并裁切出适配手机竖屏的版本：
   - `data/images/case-beauty-portrait-9x16.jpg`
7. `editor-web` 已改为优先读取 `output/latest-run.json` 指向的最新 `render-manifest.json`，不再只盯住旧的固定 demo manifest
8. 非 hero 页面背景策略已调整为：
   - 以首页图轻度虚化作为主底图
   - 动效层压在背景图之上
   - 文本层压在动效之上
9. 之前为了强化识别度加入的人像残影层已移除，因为它会干扰“轻虚化底图 + 上层动效”的目标视觉结构
10. 根据用户最新反馈，非 hero 页面底图已再次从“较重虚化”收紧为“更轻的虚化 + 更高可辨识度”
11. `cellular-life` 的上层动效已从细碎纹理改成更明显的块状 / 网格色块表达，方便快速看出动效层存在
12. 最新 local manifest 已开始显式声明每页的背景布局与 effect 组合，不再只依赖旧的 `backgroundPresetId`

---

## 5. 当前仓库中的关键文件

### 配置与数据

- `data/manifests/demo-paper.json`
- `data/manifests/demo-paper.local.json`
- `data/images/cover-portrait.svg`

### 运行脚本

- `tools/compose-manifest.ts`
- `tools/generate-audio.ts`
- `tools/build-video.ts`
- `tools/produce-video.ts`
- `tools/lib/run-artifacts.ts`

### 渲染入口

- `apps/video-renderer/src/index.tsx`
- `apps/video-renderer/src/Root.tsx`
- `apps/video-renderer/src/Video.tsx`

### 预览页

- `apps/editor-web/src/App.tsx`
- `apps/editor-web/src/styles.css`

---

## 6. 当前已知问题

### 最重要问题

用户最新反馈：

1. 首页已经能显示图片
2. 用户明确要求其他页面不要再保留“原来那种背景主导感”，而是要让首页图的轻虚化版本成为主背景
3. 用户要求明确把“背景图、动效、文本”拆成可独立替换的模块
4. 用户要求封面图按四象限循环移动：
   - 第 2 页左上
   - 第 3 页右上
   - 第 4 页右下
   - 第 5 页左下
   - 后续继续循环

用户明确说明：

- 使用的命令是本地配置版本，也就是 `demo-paper.local.json`

因此下一个接手者应优先排查：

1. `produce:video data/manifests/demo-paper.local.json` 是否真的把本地 manifest 传递到了整条链路
2. `output/latest-run.json` 指向的 run 是否来自 `demo-paper.local.json`
3. `render-manifest.json` 中的 `coverImage.path` 是否确实是 `data/images/case-beauty-portrait-9x16.jpg`
4. `apps/video-renderer/src/Root.tsx` 中 `cover-*` preset 是否在非 hero 页面真正走到了 cover-derived 分支
5. 之前 `editor-web` 没有稳定读取最新 run 的 local manifest 产物，这一层现已修正，但仍建议继续实机验证
6. 需要继续确认 Remotion 渲染产物是否稳定复用了最新 run 和最新 public 静态资源
7. 当前非 hero 页面的人像残影层已移除，改为更直接的“轻虚化封面图 + 上层动效”
8. 用户进一步指出：之前的虚化仍然偏重、上层动效不够明显，因此当前版本继续朝“更易辨认底图 + 更强块状动效”推进
9. 当前 `cellular-life` 已经拆成独立 effect 层，但仍属于“生命游戏风格原型”，还不是真正的 WebGL 版本

### 视觉方向问题

虽然已经有 `cover-cellular-mask` 原型，但它当前仍然更像“基于首页图的细胞风格遮罩背景”，还不是严格意义上的“细胞自动机演化”。

另外，当前 `cover-cellular-mask` 的定位是：

1. 稳定可渲染原型
2. 用首页图轮廓做视觉遮罩
3. 先验证“人像驱动背景演化”的方向
4. 还没有真正进入有状态 cellular automata 演化

---

## 7. 下一步优先级

建议严格按这个顺序继续：

1. 继续验证 `cellular-life` 在 editor 和最终视频里是否足够明显
2. 继续强化“象限循环移动”的视觉表现
3. 确认本地专用 manifest 在整条链路上稳定生效
4. 在现有 `cellular-life` 基础上继续做更完整的有状态演化
5. 再把这层升级为真正的 WebGL / shader 实现

---

## 8. 续接建议

如果在新对话里继续，建议先读：

1. `docs/project-status-handoff.md`
2. `data/manifests/demo-paper.local.json`
3. `apps/video-renderer/src/Root.tsx`
4. `tools/build-video.ts`
5. `output/latest-run.json`

然后先验证一次：

```bash
npm run produce:video data/manifests/demo-paper.local.json
```

并重点检查最新 run 的：

1. `inputs/production-manifest.json`
2. `manifests/render-manifest.json`
3. `video/*.mp4`

确认它们是否真的引用了本地真人图。
