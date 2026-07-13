# AGENTS.md

## 1. 项目目标

本仓库按 LeetCode 题号建设多语言算法教程。每题必须完成原创重述、算法状态、正确性证明、复杂度、边界和
C、C++、Python、Java、Rust、Go、TypeScript、C#、Julia、R 十语言实现。

## 2. 当前状态

`0001–0150` 已完成。`0101–0150` 使用 `docs/FORWARD_RULES_0101_0150.rst` 生成并通过批量质量检查。
当前阶段由 `state/PROGRESS.toml` 标记为 `review_ready`，下一批审查 `0101–0105`。完成 `0101–0150`
审查、规则归并和产物清理前，不直接生成 `0151`。

## 3. 规则优先级

1. `state/PROGRESS.toml`；
2. `state/REVIEW_INDEX.toml` 的 active corrections；
3. 当前阶段完整前向规则；
4. 专项策略、模板和质量门；
5. 当前审查证据；
6. `archive/` 历史证据；
7. 提交、PR 和对话摘要。

## 4. 新对话接手

依次读取：

1. `AGENTS.md`；
2. `README.rst`；
3. `state/PROGRESS.toml`；
4. `state/REVIEW_INDEX.toml`；
5. `docs/FORWARD_RULES_0101_0150.rst`；
6. `docs/AUTOMATION_QUALITY_GATE.rst`；
7. `docs/REVIEW_AND_PREVENTION_POLICY.rst`；
8. `docs/SOLUTION_AND_TYPES_POLICY.rst`；
9. `docs/ARTIFACT_LIFECYCLE_POLICY.rst`；
10. `state/CONCEPT_LEDGER.toml`；
11. 当前五题的完整 RST。

历史证据只通过 `archive/README.rst` 与对应 manifest 定位，不逐份扫描 archive。

## 5. 当前阶段审查

从 `state/REVIEW_INDEX.toml` 的 `review.current` 开始，每批连续五题：

1. 完整读取题目契约、示例、状态、证明、复杂度和十语言代码；
2. 检查正文与真实实现是否一致；
3. 区分确定性错误、语言语义风险、复杂度遗漏和验证限制；
4. 将当前轮必要证据写入活动 review 文件；
5. 稳定模式提升为 `0151–0200` 前向规则候选；
6. 同步 `REVIEW_INDEX`、`PROGRESS` 和 README；
7. 历史题默认保持原样，只有用户明确指定时才回改。

完成 `0101–0150` 全范围审查后，在同一原子提交中归并规则、归档批次证据并清空活动 review 目录。

## 6. 新题生成

只有 `PROGRESS.phase` 回到生成阶段后，才从 `next_problem` 开始。每题完成：

- 精确契约和原创示例；
- 问题抽象、状态或不变量；
- 正确性证明与终止性；
- 完整复杂度和输出成本；
- 十语言真实接口；
- 关键边界、易错点、知识账本和关联题目；
- 编译、运行、静态检查或对拍证据的准确标注。

普通生成不创建可由正式题目和状态推导的一次性报告。

## 7. 语言与代码原则

普通算法题固定十语言。平台提供的 `ListNode`、`TreeNode`、`Node` 不在每题重复定义；Julia 使用
`mutable struct` 节点约定，R 使用 `environment` 表达引用语义。代码行优先不超过 88 个显示字符，硬上限
100。语言特有所有权、索引、字符单位、物化和返回副本必须进入正文复杂度。

## 8. 验证边界

明确区分运行验证、编译验证、静态验证和基准对拍。一种语言的通过不能外推到其余语言。本批
`0101–0150` 的 Python、C、C++、Java、Go、TypeScript 已完成语法、编译或类型检查；Rust、C#、Julia、R
目前只有静态检查，阶段审查仍需核对高风险语义。

## 9. 产物生命周期

活动目录只保留当前执行依赖。临时 marker、日志、缓存、草稿和一次性报告不得进入 `main`。审查批次和
findings 在审查轮次进行时可以存在；规则归并完成时必须立即移入 `archive/` 并更新 manifest。

## 10. Git 工作方式

日常工作采用直接 `main` 的原子提交语义。连接器需要临时分支组装多文件时，最终 squash 后主分支只留下
一个提交。提交后重新读取状态、索引、范围 README 和抽样题目，确认与对话报告一致。
