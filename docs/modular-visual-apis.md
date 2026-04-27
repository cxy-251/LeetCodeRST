# Modular Visual APIs

这个项目当前把页面视觉拆成 3 类可插拔模块：

1. 背景图布局模块
2. 特效层模块
3. 文本动效模块

这些模块都可以通过 `ProductionManifest.modules` 和 `scene` 上的模块 id 从外部写入。

当前生命游戏 effect 的底层已切换为 `Three.js + WebGL` 渲染。
另外，特效层现在开始支持“独立 effect atom 页面”，也就是不经过模板页，单独把某个中间层特效拉出来交互验证。

---

## 1. 背景图布局 API

### scene 字段

```json
"backgroundImageLayoutId": "cover-focus-tl"
```

### 可用值

- `gradient-default`
  效果：不用封面图，走默认渐变背景。
- `cover-full`
  效果：首页大图清晰展示。
- `cover-focus-tl`
  效果：背景图放大后取左上区域。
- `cover-focus-tr`
  效果：背景图放大后取右上区域。
- `cover-focus-br`
  效果：背景图放大后取右下区域。
- `cover-focus-bl`
  效果：背景图放大后取左下区域。

### 全局参数

```json
"modules": {
  "backgroundMotion": {
    "overscanPercent": 36,
    "panTravelPercent": 0.82
  }
}
```

### 参数说明

- `overscanPercent`
  效果：背景图比画面额外放大多少，用于给平移留空间。值越大，能滑动的余量越大。
- `panTravelPercent`
  效果：象限取景点换页时的平移强度。值越大，滑动感越明显。

---

## 2. 特效层 API

### scene 字段

```json
"backgroundEffectId": "cellular-life"
```

### 可用值

- `none`
  效果：不叠加额外特效层。
- `aurora`
  效果：柔和极光感光斑。
- `grid-drift`
  效果：规则网格漂移。
- `noise-bloom`
  效果：噪声光斑扩散。
- `cellular-launch`
  效果：第 2 页按钮启动生命游戏。
- `cellular-life`
  效果：生命游戏持续运行，当前使用 `Three.js + WebGL`。

### 独立 effect atom 页面

当前 `editor-web` 已新增：

- `/effects/life-game`
- `/effects/snake-grid`

这类页面的目标不是展示完整模板，而是单独验证“背景与文本之间的中间层特效原子”。

例如：

- `life-game`
  效果：页面内可点击按钮，启动并持续运行生命游戏。

### 转换层

当前已新增 `EffectRuntimeAdapter`：

1. 网页端：
   - effect atom 可以独立运行
   - 可以响应点击、暂停、重置
2. 视频端：
   - effect atom 会根据绝对帧自动运行
   - 不依赖人工点击

它的作用就是把“交互式小游戏 / WebGL effect”转换成“可被视频引擎稳定录制的 deterministic effect 轨道”。

### 视频渲染兼容策略

当前 `tools/build-video.ts` 对 WebGL effect 默认启用了更保守的渲染参数：

- `--gl angle`
- `--concurrency 2`

目的：

1. 降低 Three.js / WebGL 在 Remotion 多标签并发渲染时的 context 创建失败概率
2. 让生命游戏、后续小游戏类特效在录制视频时更稳定

如果后面需要调整，可通过环境变量覆盖：

- `REMOTION_GL`
- `REMOTION_CONCURRENCY`

### WebGL 上下文策略

当前生命游戏 effect 保持 `Three.js + WebGL` 路线，不切换到 canvas 实现。

为了提高 editor 和视频渲染的稳定性，当前做法是：

1. 显式尝试 `webgl2`
2. 如果不可用，再显式尝试 `webgl`
3. 再退一步尝试 `experimental-webgl`
4. 同时关闭不必要的抗锯齿 / 深度 / 模板缓冲开销

目标是让同一个 WebGL effect atom 在网页端与视频端都更容易成功拿到上下文。

后续新增 WebGL 小游戏时，推荐直接按同一路径继续扩展：

- `/effects/snake-grid`
- `/effects/minesweeper`
- `/effects/pacman-field`

### 生命游戏参数

```json
"modules": {
  "cellularEffect": {
    "cellColumns": 44,
    "cellRows": 78,
    "stepEveryFrames": 2,
    "activationDelayFrames": 18,
    "cellPadding": 0.5,
    "cornerRadius": 0.45,
    "edgeMode": "wrap",
    "primaryColor": "#82ffd9",
    "secondaryColor": "#f6fbff",
    "birthColor": "#4db8ff"
  }
}
```

### 参数说明

- `cellColumns`
  效果：横向网格数量。越大，细胞越小。
- `cellRows`
  效果：纵向网格数量。越大，细胞越密。
- `stepEveryFrames`
  效果：多少帧迭代一次生命游戏。值越小，演化越快。
- `activationDelayFrames`
  效果：启动按钮出现后，延迟多少帧开始正式演化。
- `cellPadding`
  效果：单个细胞块内部留白。值越小，块越满。
- `cornerRadius`
  效果：细胞圆角强度。
- `edgeMode`
  当前支持：`wrap`
  效果：边界环绕，细胞从另一侧继续拓展。
- `primaryColor`
  效果：稳定存活细胞的主色。
- `secondaryColor`
  效果：次级细胞色，用来拉开层次。
- `birthColor`
  效果：新生或高亮细胞的强调色。

---

## 3. 文本动效 API

### scene 字段

```json
"motionPresetId": "fade-up"
```

### 可用值

- `fade-up`
  效果：轻微上浮进入。
- `slide-up`
  效果：更明显的上滑进入。
- `stagger-rise`
  效果：标题和 bullet 分段抬升出现。
- `hard-cut`
  效果：几乎无过渡，直接切换。

### 全局参数

```json
"modules": {
  "textMotions": {
    "fade-up": {
      "enterFrames": 12,
      "maxLiftPx": 14,
      "minOpacity": 0.28,
      "bodyDelayFrames": 2,
      "bulletsStaggerFrames": 3
    }
  }
}
```

### 参数说明

- `enterFrames`
  效果：文本入场持续帧数。
- `maxLiftPx`
  效果：文本最大上浮位移。
- `minOpacity`
  效果：入场开始时的最低透明度。
- `bodyDelayFrames`
  效果：正文相对标题的延迟出现帧数。
- `bulletsStaggerFrames`
  效果：bullet 之间的错峰进入帧数。
- `exitFrames`
  效果：文本离场持续帧数。
- `exitLiftPx`
  效果：文本离场时额外上抬位移。
- `exitOpacity`
  效果：文本离场结束前保留的透明度下限。

---

## 4. 组合方式

### 字号参数

```json
{
  "modules": {
    "typography": {
      "kickerSize": "clamp(0.88rem, 1.15vw + 0.5rem, 1.62rem)",
      "titleSize": "clamp(2.48rem, 5vw + 0.7rem, 5.6rem)",
      "bodySize": "clamp(1.18rem, 1.95vw + 0.55rem, 2.42rem)",
      "bulletSize": "clamp(1.1rem, 1.78vw + 0.52rem, 2.12rem)",
      "subtitleSize": "clamp(1.12rem, 1.52vw + 0.54rem, 1.94rem)"
    }
  }
}
```

效果：

- `kickerSize`
  调整场景顶部小字。
- `titleSize`
  调整大标题。
- `bodySize`
  调整正文段落。
- `bulletSize`
  调整 bullet 列表。
- `subtitleSize`
  调整底部字幕面板字号。

当前推荐组合方式：

```json
{
  "backgroundImageLayoutId": "cover-focus-tr",
  "backgroundEffectId": "cellular-life",
  "motionPresetId": "stagger-rise"
}
```

这表示：

1. 背景图取右上区域
2. 上层叠持续运行的生命游戏
3. 文本用分段抬升动效进入

---

## 5. 后续扩展方式

后面新增模块时，建议遵循同一套规则：

1. 先新增一个模块 id
2. 再新增对应配置结构
3. 在 renderer/editor 中注册这个模块
4. 在本文档补充这个模块的效果与参数说明

例如未来可以继续新增：

- `backgroundEffectId: "smoke-field"`
- `backgroundEffectId: "snake-grid"`
- `motionPresetId: "typewriter"`
- `motionPresetId: "word-pop"`
