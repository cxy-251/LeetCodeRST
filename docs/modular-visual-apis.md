# Modular Visual APIs

这个项目当前把页面视觉拆成 3 类可插拔模块：

1. 背景图布局模块
2. 特效层模块
3. 文本动效模块

这些模块都可以通过 `ProductionManifest.modules` 和 `scene` 上的模块 id 从外部写入。

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
  效果：生命游戏持续运行。

### 生命游戏参数

```json
"modules": {
  "cellularEffect": {
    "cellColumns": 44,
    "cellRows": 78,
    "stepEveryFrames": 2,
    "activationDelayFrames": 36,
    "cellPadding": 0.5,
    "cornerRadius": 0.45,
    "edgeMode": "wrap"
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

---

## 4. 组合方式

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
