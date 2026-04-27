# Development Standards

这份规范用于约束 `paperToVideo` 项目的代码风格、职责边界和坏味道治理。

目标不是“写得像模板代码”，而是：

1. 保持视频生成链路稳定
2. 让模块可以像乐高一样拆装
3. 让不同论文文本、背景图、特效和模板都能低成本复用

---

## 1. Core Principles

### 1.1 Single Responsibility Principle

每个模块只负责一件事。

示例：

1. `tsx`
   只负责组件结构和少量展示逻辑
2. `module.css`
   只负责样式
3. `useXXX.ts`
   只负责状态和交互
4. `service.ts`
   只负责数据读取、文件处理、映射、API 调用
5. `types.ts`
   只负责类型定义

禁止：

1. 在一个文件里同时堆 UI、样式、状态、文件 IO、路径处理
2. 把视频渲染时序、内容装配、视图细节混在同一个大组件里

### 1.2 Open/Closed Principle

模块应尽量做到：

1. 对扩展开放
2. 对修改关闭

这意味着新增能力时，优先：

1. 新增 registry 项
2. 新增 profile 文件
3. 新增模板节点
4. 新增 effect atom

而不是直接改已有逻辑分支，把旧模块越改越大。

### 1.3 Configuration over Hardcoding

凡是用户后续可能切换的内容，都不应该写死在代码里。

必须优先配置化的内容包括：

1. 论文总结文本
2. 背景图/封面图
3. WebGL effect family
4. 文本动效参数
5. 背景运动参数
6. 语音参数
7. 模板布局

当前推荐入口：

1. `contentProfile`
2. `coverProfile`
3. `effectProfile`
4. `modules`
5. `template`

---

## 2. File Organization Rules

### 2.1 React / TSX

React 相关代码必须优先按下面拆分：

1. `Component.tsx`
2. `Component.module.css`
3. `useComponent.ts`
4. `Component.service.ts`
5. `Component.types.ts`

适用范围：

1. `apps/editor-web`
2. `packages/content-pipeline` 中有交互或复杂渲染生命周期的组件
3. 后续新增的 WebGL effect 页面

### 2.2 Tool Scripts

`tools/*.ts` 只做流程编排，不做大段领域逻辑。

当脚本出现下面情况时，必须拆出去：

1. 超过一个明显职责
2. 同时处理参数解析、文件读写、领域规则、格式映射
3. 有独立测试价值的纯逻辑

建议拆分为：

1. `tools/<name>.ts`
   CLI 入口
2. `tools/lib/<name>.service.ts`
   业务逻辑
3. `tools/lib/<name>.types.ts`
   类型

### 2.3 Data Files

数据必须按用途分层：

1. `data/templates`
   模板结构
2. `data/content-profiles`
   文本内容源
3. `data/cover-assets`
   封面图/背景图索引
4. `data/manifests`
   生产配置入口
5. `output/cache`
   可复用缓存
6. `output/runs`
   一次次实际生成的产物

禁止：

1. 把运行期产物写回源码配置目录
2. 把临时抓取结果直接当仓库固定资产

---

## 3. Architecture Boundaries

### 3.1 Atomic UI Layer

`packages/atomic-ui`

职责：

1. 只关心最小视觉单元
2. 不关心论文内容来源
3. 不关心 effect family
4. 不关心 run 目录

禁止：

1. 在 atomic component 里直接读 manifest 文件
2. 在 atomic component 里计算音频时间轴

### 3.2 Template Engine Layer

`packages/timeline-engine`

职责：

1. 根据模板把原子组件拼起来
2. 读取 render context
3. 输出当前 scene 的前景结构

禁止：

1. 在模板引擎里写死具体论文文案
2. 在模板引擎里写 effect family 判断分支

### 3.3 Content Pipeline Layer

`packages/content-pipeline`

职责：

1. 管理模块 registry
2. 管理默认参数与 profile 解析
3. 管理 effect runtime adapter
4. 管理背景与特效层逻辑

禁止：

1. 让 effect 层直接依赖 editor 路由
2. 让 effect 层直接读磁盘文件

### 3.4 Tooling Layer

`tools`

职责：

1. 读取外部输入
2. 生成中间产物
3. 写入 run 目录
4. 调度 Python / Remotion / edge-tts

禁止：

1. 把 UI 逻辑放进 CLI
2. 把路径拼接规则散落在多个无关脚本里

---

## 4. Code Smells to Avoid

下面这些都属于当前项目需要主动避免的坏味道。

### 4.1 Giant File

症状：

1. 一个文件里同时有类型、样式、渲染、状态、文件 IO、算法
2. 一个文件超过 250~350 行且职责不清

处理：

1. 先拆类型
2. 再拆样式
3. 再拆 hook/service

### 4.2 Hardcoded Business Content

症状：

1. 论文正文直接写在组件里
2. 背景图路径直接写在渲染器里
3. effect family 在 scene 里被硬编码为固定唯一值

处理：

1. 优先迁移到 profile 或 registry
2. 让代码只消费 profile 结果

### 4.3 Boolean Branch Explosion

症状：

1. `if/else` 里堆很多 effect family 判断
2. 随着新增小游戏，条件分支越来越多

处理：

1. 用 registry
2. 用 resolver
3. 用 profile id -> implementation 映射

### 4.4 Mixed Runtime Context

症状：

1. 网页交互逻辑和视频录制逻辑写死在一起
2. 点击事件和绝对帧逻辑互相污染

处理：

1. 通过 adapter 隔离
2. 让 effect atom 接收标准化 runtime props

### 4.5 Hidden Side Effects

症状：

1. 一个函数名看起来像纯函数，实际写文件
2. 一个 hook 渲染时偷偷触发网络请求

处理：

1. 有 IO 的逻辑必须放到 `service` 或显式副作用函数里
2. 函数名要体现副作用

### 4.6 Duplicate Path Logic

症状：

1. 多个地方重复拼 `output/runs/...`
2. 多个脚本各自处理缓存路径

处理：

1. 统一收口到 `tools/lib/run-artifacts.ts`
2. 新路径规则必须复用现有 helpers

### 4.7 Style Leakage

症状：

1. 大段内联样式写进 TSX
2. 全局 CSS 污染 effect page 和 template page

处理：

1. 默认使用 `*.module.css`
2. 全局样式只放 reset 或真正跨页面共享的 token

---

## 5. React Standards

### 5.1 Component Rules

组件必须：

1. 尽量无副作用
2. 通过 props 驱动
3. 不直接依赖磁盘路径
4. 不直接操作 run 目录

组件不应该：

1. 直接 `fetch` 本地文件
2. 直接 `fs.readFile`
3. 直接做复杂时间轴推导

### 5.2 Hook Rules

复杂状态必须进入 `useXXX.ts`。

适用场景：

1. 播放/暂停/重置
2. 路由切换模型
3. 交互式 effect 状态
4. 多步骤视图模型整理

要求：

1. hook 名必须体现用途
2. hook 返回值保持稳定、语义清晰

### 5.3 CSS Rules

默认规则：

1. 样式写到 `.module.css`
2. 组件内只保留极少量动态 style
3. 所有配色、字号、间距优先走 token 或 config

禁止：

1. 把整个页面的大段 CSS 塞进 `style={{...}}`
2. 用 JS 拼过多样式对象替代 CSS 模块

---

## 6. Manifest and Profile Rules

### 6.1 Manifest Role

`manifest` 负责：

1. 选择模板
2. 选择内容源
3. 选择背景图源
4. 选择 WebGL effect
5. 选择模块参数
6. 定义 scene 顺序和节奏

`manifest` 不负责：

1. 保存大段论文正文本体
2. 保存可复用的统一脚本草案库

### 6.2 Content Profile Role

`contentProfile` 负责：

1. 提供某一篇论文的视频文案
2. 给每个 `contentRef` 注入正文
3. 覆盖 paper 元信息

### 6.3 Cover Profile Role

`coverProfile` 负责：

1. 提供背景/封面图索引
2. 让同一模板快速换图

### 6.4 Effect Profile Role

`effectProfile` 负责：

1. 选择一条视频主用的 WebGL effect family
2. 保持整条视频风格统一

---

## 7. Commenting Rules

只给复杂业务逻辑加注释，而且注释必须解释“为什么”。

合格示例：

1. 为什么第二页按钮启动要和真实音频长度对齐
2. 为什么 effect runtime 要拆成网页端和视频端两种模式
3. 为什么某些缓存 key 要包含 voice 参数

不合格示例：

1. `// set value`
2. `// loop through items`

---

## 8. Review Checklist

每次提交前至少检查：

1. 有没有把论文正文硬编码回 scene
2. 有没有新增巨大组件文件
3. 有没有把运行期路径逻辑复制到新文件
4. 有没有把样式写回 TSX
5. 有没有把本地缓存或产物误加进 git
6. 有没有绕开 profile / registry 直接写死特效或背景
7. 有没有让 editor 专属逻辑污染 renderer
8. 有没有让 renderer 专属逻辑污染 editor

---

## 9. Current Enforcement Strategy

当前项目先采用“文档规范 + 局部重构 + review 约束”的方式执行。

后续建议继续补：

1. ESLint 规则
2. import 边界规则
3. 目录级别约束
4. effect registry / template registry 的 schema 校验

在这些自动化规则补齐之前，新增代码默认按这份文档执行。
