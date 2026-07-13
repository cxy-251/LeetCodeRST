LeetCode 多语言 RST 学习仓库
============================

本仓库按 LeetCode 题号顺序建设多语言算法学习资料。每道可访问题目对应一个 RST 文件，同时学习算法状态、
正确性证明、复杂度和十语言实现。

当前状态
--------

``0001`` 至 ``0150`` 的多语言教程已经完成。新完成的 ``0101–0150`` 直接执行了前两轮审查归并出的
``docs/FORWARD_RULES_0101_0150.rst``，共新增 50 道题和 500 份语言实现。

当前阶段为 ``review_ready``。下一动作是审查 ``0101–0105``，随后连续审查至 ``0150``，归并新规则并清理
审查中间产物；完成这些动作前不直接生成 ``0151``。

核心入口
--------

* ``AGENTS.md``：新对话接手顺序和工作约束；
* ``state/PROGRESS.toml``：当前阶段、覆盖范围、验证结果和下一步；
* ``state/REVIEW_INDEX.toml``：当前审查范围、active corrections 与归档索引；
* ``docs/FORWARD_RULES_0101_0150.rst``：本次 50 题使用的完整前向规则；
* ``docs/AUTOMATION_QUALITY_GATE.rst``：生成与阶段审查验收步骤；
* ``docs/PROBLEM_TEMPLATE.rst``：单题结构骨架；
* ``docs/SOLUTION_AND_TYPES_POLICY.rst``：解法、平台类型和语言适配器；
* ``docs/ARTIFACT_LIFECYCLE_POLICY.rst``：中间文件清理和归档规则；
* ``state/CONCEPT_LEDGER.toml``：知识账本分段索引；
* ``problems/0001-0100/README.rst``：``0001–0100`` 题目索引；
* ``problems/0101-0200/README.rst``：当前已完成的 ``0101–0150`` 题目索引。

本批验证
--------

``0101–0150`` 已完成：

* 50 个 RST 文件的章节、题号、链接和十语言代码块检查；
* 500 个语言代码块全部满足 100 字符硬行宽；
* Python 50 份代码通过语法解析；
* C 与 C++ 各 50 份代码通过严格警告语法编译；
* Java、Go、TypeScript 各 50 份代码通过编译或严格类型检查；
* Rust、C#、Julia、R 各 50 份代码完成接口、括号、作用域和所有权静态检查。

这些结果属于编译或静态验证，不等同于 500 份实现全部完成运行测试。

历史产物归档
------------

已经被正式规则吸收的审查批次、findings、旧目录和归并记录位于：

* ``archive/reviews/0001-0050/MANIFEST.rst``；
* ``archive/reviews/0051-0100/MANIFEST.rst``；
* ``archive/README.rst``。

归档资料只用于规则来源追溯和历史题修复。事实冲突以 ``state/REVIEW_INDEX.toml`` 的 active corrections
为准。

规则优先级
----------

#. ``state/PROGRESS.toml``；
#. ``state/REVIEW_INDEX.toml`` 的 active corrections；
#. 当前阶段完整前向规则；
#. 专项策略、模板和质量门；
#. 当前审查证据与 ``archive/`` 历史证据；
#. 提交、PR 和对话摘要。

执行方式
--------

所有生成、审查、修复和归档由当前对话中的明确指令触发。每轮确定唯一范围、完成内容与质量检查、清理
无用中间文件，并以一个原子提交进入 ``main``。分支和 PR 只在用户明确选择评审或协作流程时作为正式入口。

文档形式
--------

题目正文和项目说明以 RST 为主，仓库内容以直接阅读源文件为目标。
