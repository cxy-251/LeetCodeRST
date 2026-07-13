LeetCode 多语言 RST 学习仓库
============================

本仓库按 LeetCode 题号顺序建设多语言算法学习资料。每道可访问题目对应一个 RST 文件，同时学习
算法状态、正确性证明、复杂度和十语言实现。

项目目标
--------

* 使用原创题目重述；
* 按题号递增推进；
* 普通算法题覆盖 C、C++、Python、Java、Rust、Go、TypeScript、C#、Julia 和 R；
* 代码注释聚焦状态变化、语言边界和容易出错的位置；
* 疑难算法周期性复现，语法知识采用解释衰减；
* Premium 或无法可靠确认的题目按规则登记。

当前状态
--------

``0001`` 至 ``0100`` 的首轮多语言 RST 已完成。``0001`` 至 ``0050`` 的第一次逐题规则提炼已经完成；
``0051`` 至 ``0100`` 的第二轮逐题审查也已完成，共覆盖 50 道题。

第二轮产生的分散经验现已完成归并：

* 十个批次中的 81 条 promoted rules 已去重并重新组织；
* ``state/REVIEW_INDEX.toml`` 中 14 项 active corrections 已纳入前向规则；
* 旧的 ``0051–0100`` 前向规则与第二轮新增经验已经合并为一份自包含文档；
* 历史题目正文保持原样，事实更正只在用户明确选择修复时回写。

``0101`` 至 ``0150`` 的生成必须直接执行 ``docs/FORWARD_RULES_0101_0150.rst``。下一批可开始
``0101`` 至 ``0105``。

核心入口
--------

* ``state/PROGRESS.toml``：当前阶段、覆盖范围和下一步；
* ``state/REVIEW_INDEX.toml``：审查记录、规则来源和事实更正；
* ``state/RULE_CONSOLIDATION_0051_0100.toml``：81 条原始规则的吸收与分组追溯；
* ``docs/FORWARD_RULES_0101_0150.rst``：``0101–0150`` 的完整前向执行规则；
* ``docs/REVIEW_CATALOG_0051_0100.rst``：第二轮审查资料目录；
* ``docs/FORWARD_RULES_0051_0100.rst``：首轮审查后用于 ``0051–0100`` 的历史执行规则；
* ``docs/AUTOMATION_QUALITY_GATE.rst``：当前对话批次的验收步骤；
* ``docs/PROBLEM_TEMPLATE.rst``：单题结构骨架；
* ``docs/SOLUTION_AND_TYPES_POLICY.rst``：解法、平台类型和语言适配器；
* ``docs/AUTOMATION_DIRECT_MAIN_POLICY.rst``：对话驱动执行流程；
* ``state/CONCEPT_LEDGER.toml``：知识账本分段索引；
* ``problems/0001-0100/README.rst``：已完成题目索引。

工程笔记
--------

* `Git 对象与原子提交：blob、tree、commit、ref
  <docs/GIT_OBJECTS_AND_ATOMIC_COMMITS.rst>`_：解释多文件批次如何通过 Git 对象图组装成一个原子提交，
  以及本地 ``git hash-object``、非强制快进和提交后复查的作用。

工程笔记独立于 LeetCode 教学进度，不写入算法知识账本。

审查资料
--------

第一次审查：

* ``docs/REVIEW_CATALOG_0001_0050.rst``；
* ``state/REVIEW_0001_0050.toml`` 与 ``state/reviews/0016-0050``；
* ``docs/REVIEW_FINDINGS_0001_0050.rst`` 与 ``docs/review-findings/0016-0050``；
* ``docs/FORWARD_RULES_0051_0100.rst``。

第二轮审查：

* ``docs/REVIEW_CATALOG_0051_0100.rst``；
* ``state/reviews/0051-0055.toml``；
* ``state/reviews/0056-0060.toml``；
* ``state/reviews/0061-0065.toml``；
* ``state/reviews/0066-0070.toml``；
* ``state/reviews/0071-0075.toml``；
* ``state/reviews/0076-0080.toml``；
* ``state/reviews/0081-0085.toml``；
* ``state/reviews/0086-0090.toml``；
* ``state/reviews/0091-0095.toml``；
* ``state/reviews/0096-0100.toml``；
* ``docs/review-findings/0051-0055.rst``；
* ``docs/review-findings/0056-0060.rst``；
* ``docs/review-findings/0061-0065.rst``；
* ``docs/review-findings/0066-0070.rst``；
* ``docs/review-findings/0071-0075.rst``；
* ``docs/review-findings/0076-0080.rst``；
* ``docs/review-findings/0081-0085.rst``；
* ``docs/review-findings/0086-0090.rst``；
* ``docs/review-findings/0091-0095.rst``；
* ``docs/review-findings/0096-0100.rst``；
* ``state/RULE_CONSOLIDATION_0051_0100.toml``；
* ``docs/FORWARD_RULES_0101_0150.rst``。

批次记录属于证据和追溯资料。事实冲突先读取 ``state/REVIEW_INDEX.toml`` 的更正，生成新题直接执行已归并的
完整前向规则。

知识账本
--------

``state/CONCEPT_LEDGER.toml`` 使用分段记录：

* ``state/concepts/0001-0050.toml``；
* ``state/concepts/0051-0100.toml``；
* ``state/concepts/0074-0100.toml``；
* ``state/concepts/0092-0100.toml``。

后续分段中的同名 ``updates`` 覆盖更早记录的最新题号、出现次数、教学状态和说明。

规则优先级
----------

出现重复或冲突时：

#. ``state/PROGRESS.toml`` 决定当前阶段和下一步；
#. ``state/REVIEW_INDEX.toml`` 的事实更正；
#. ``docs/FORWARD_RULES_0101_0150.rst`` 等已完成归并的前向规则；
#. 专项策略和模板；
#. 批次记录与详细发现；
#. 提交说明、PR 描述和对话报告。

执行方式
--------

所有生成、审查和修复由当前对话中的明确指令触发：

#. 读取最新 ``main``、状态和当前阶段完整规则；
#. 确定本轮唯一范围；
#. 完成内容与质量检查；
#. 将本轮文件作为一个原子提交写入 ``main``；
#. 复查提交差异、状态和下一步；
#. 在对话中报告结果。

分支和 PR 只在用户明确选择评审、多人协作或隔离实验时使用。

文档形式
--------

题目正文和项目说明以 RST 为主，仓库内容以直接阅读源文件为目标。
