# AGENTS.md

## 1. 项目目标

本仓库按 LeetCode 题号顺序建设多语言算法学习资料。每道公开可访问题目对应一个 RST 文件，目标是：

1. 原创重述题目与示例；
2. 讲清算法状态、正确性证明、复杂度和边界；
3. 提供固定十语言的可靠实现；
4. 通过解释衰减与周期复现形成持续学习路径。

Premium 或信息不足的题目登记到状态文件，材料完整后继续。

## 2. 当前状态

`0001–0128` 的多语言教程已经完成；`0051–0100` 的第二轮逐题审查和规则归并也已完成。
当前阶段由 `state/PROGRESS.toml` 决定，下一批是 `0129–0131`。

当前完整执行规则是 `docs/FORWARD_RULES_0101_0150.rst`。两轮审查证据已移入 `archive/reviews/`，
只在追溯规则来源或修复历史题时读取。

## 3. 规则优先级

出现重复或冲突时按以下顺序解释：

1. `state/PROGRESS.toml`：当前阶段、完成范围和下一步；
2. `state/REVIEW_INDEX.toml`：active corrections 与归档索引；
3. 当前阶段完整前向规则；
4. 专项策略、模板和质量门；
5. `archive/` 中的批次证据与历史快照；
6. `main` 提交与对话报告。

高优先级文件覆盖低优先级历史快照。

## 4. 新对话接手

每次工作从最新 `main` 开始，依次读取：

1. `AGENTS.md`；
2. `README.rst`；
3. `state/PROGRESS.toml`；
4. `state/REVIEW_INDEX.toml`；
5. `docs/FORWARD_RULES_0101_0150.rst`；
6. `docs/AUTOMATION_QUALITY_GATE.rst`；
7. `docs/PROBLEM_TEMPLATE.rst`；
8. `docs/SOLUTION_AND_TYPES_POLICY.rst`；
9. `docs/RST_STYLE_GUIDE.rst`；
10. `docs/AUTOMATION_DIRECT_MAIN_POLICY.rst`；
11. `docs/ARTIFACT_LIFECYCLE_POLICY.rst`；
12. `state/CONCEPT_LEDGER.toml`；
13. 本轮当前题与最近相关题目。

需要追溯某条历史规则时，再读取 `archive/README.rst` 和对应范围 manifest，不逐份扫描整个 archive。

## 5. 对话驱动工作流

所有审查、生成、修复和归档从用户在当前对话中的明确指令开始。每轮完成：

1. 读取最新状态和当前规则；
2. 按 Easy=1、Medium=2、Hard=4 确定唯一连续范围，总分目标 4 至 6；
3. 按题号逐题完成正文、代码与单题验证，不先铺开整批草稿；
4. 一次性准备索引和状态更新；
5. 执行当前质量门；
6. 清除未使用的 marker、草稿和阶段性中间文件；
7. 直接基于最新 `main` 树构造一个原子提交并更新 `main`；
8. 重新读取 `main` 验证；
9. 报告实际结果和下一步。

详细流程见 `docs/AUTOMATION_DIRECT_MAIN_POLICY.rst`。

## 6. 新题生成

从 `state/PROGRESS.toml` 的 `next_problem` 开始：

1. 按题号递增确定连续范围；
2. 使用 Easy=1、Medium=2、Hard=4 的难度预算控制单批工作量；
3. 每道题完成原创重述、自建示例、问题抽象、解法选择、正确性证明、复杂度、边界和十语言实现；
4. 每题写完立即核对正文与十语言代码，不把单题验证推迟到整批末尾；
5. 应用当前阶段前向规则与质量门；
6. 同步题目 RST、范围 README、根 README、`PROGRESS.toml` 和知识账本；
7. 不为普通生成任务保留一次性分析报告或中间计划文件；
8. 复查完成范围和新的 `next_problem`。

## 7. 历史题修复

用户明确指定某一道历史题需要修改时：

1. 读取该题完整 RST、active correction 和当前规则；
2. 按 archive manifest 定位对应审查证据；
3. 明确缺陷类别；
4. 只修改该题和确实受影响的公共文件；
5. 使用针对性验证；
6. 直接在 `main` 形成独立原子提交；
7. 保持题号进度不变。

## 8. 内容结构

每道题根据教学需要组织：标题与题目信息、原创重述、自建示例、问题抽象、解法选择、状态或不变量、
正确性依据、复杂度、十语言实现、关键边界、知识更新、关联题目和最小自检。

简单题保持紧凑，复杂题提供足够推导。章节服务于理解，不为模板数量扩写内容。

## 9. 固定核心语言

普通算法题默认提供 C、C++、Python、Java、Rust、Go、TypeScript、C#、Julia 和 R。数据库题使用 SQL；
Shell 题使用 Bash 或 POSIX Shell。语言接口与平台类型见 `docs/LANGUAGE_SCOPE.rst` 和
`docs/SOLUTION_AND_TYPES_POLICY.rst`。

## 10. 解法与代码原则

主解法在正确性、复杂度、可读性和跨语言可实现性之间取得平衡。十语言保持同一问题语义。标准库容器和
算法优先使用，同时说明语义、复杂度、前提和版本。

`ListNode`、`TreeNode`、`Node` 等平台类型首次出现时解释结构，后续复用。Julia 使用 `mutable struct`
表达可变节点，R 使用 `environment` 表达引用语义。

## 11. 教学模型

语言语法和常用库按 `introduced`、`reinforcing`、`familiar`、`refresh`、`mastered` 推进。疑难算法周期
复现，每次聚焦当前题的新状态和新边界。代码注释靠近对应语句，优先控制在 88 个显示列以内，硬上限 100。

## 12. 文档与验证

每轮检查 RST 层级、代码块标记、Mermaid、相对链接、题号、文件名、状态、代码、证明和复杂度一致性。
验证报告准确区分运行、编译、静态检查和基准对拍。

## 13. 产物生命周期

活动目录只保留当前执行文件。审查批次和 findings 在审查轮次进行时可以存在；完成规则归并后必须移入
`archive/`。构建缓存、日志、临时 marker、未引用草稿和可由正式产物完全推导的一次性文件不得进入
`main`。完整规则见 `docs/ARTIFACT_LIFECYCLE_POLICY.rst`。

## 14. Git 工作方式

所有生产、审查、修复、规则归并和归档都只允许直接更新 `main`。禁止创建临时分支、工作分支、PR、
上传分片分支或用于组装文件的临时工作流。多文件变化通过 Git blob、tree、commit 和 ref 操作，
基于最新 `main` 一次性构造一个原子提交。

写入前必须重新读取 `main`；若主分支已变化，重新计算目标树，禁止覆盖并发修改。除非用户以后明确修改
本规则，否则任何任务类型都没有分支或 PR 例外。

## 15. 交接结果

每轮结束时确认：

- `PROGRESS.toml` 指向准确阶段和下一步；
- README、题目索引和知识账本同步；
- 活动目录没有已消费的中间文件；
- archive manifest 覆盖本轮需要长期保留的证据；
- 最近的 `main` 提交独立说明本轮范围；
- 对话报告与 `main` 实际状态一致。
