LeetCode 多语言 RST 学习仓库
============================

本仓库按 LeetCode 题号顺序建设多语言算法学习资料。每道可访问题目对应一个 RST 文件，
同时学习算法状态、
正确性证明、复杂度和十语言实现。

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

``0001`` 至 ``0112`` 的多语言教程已经完成。``0051`` 至 ``0100`` 的第二轮逐题审查、81 条规则归并和
14 项事实更正也已完成。

``0108`` 至 ``0112`` 按难度预算 6 分完成：Easy、Medium、Easy、Easy、Easy。下一批是
``0113–0114``，两道 Medium 合计 4 分；``0115`` 为 Hard，加入后会超过上限。新题继续直接执行
``docs/FORWARD_RULES_0101_0150.rst``。

核心入口
--------

* ``AGENTS.md``：新对话接手顺序和工作约束；
* ``state/PROGRESS.toml``：当前阶段、覆盖范围和下一步；
* ``state/REVIEW_INDEX.toml``：active corrections 与归档索引；
* ``docs/FORWARD_RULES_0101_0150.rst``：``0101–0150`` 完整前向规则；
* ``docs/AUTOMATION_QUALITY_GATE.rst``：当前批次验收步骤；
* ``docs/PROBLEM_TEMPLATE.rst``：单题结构骨架；
* ``docs/SOLUTION_AND_TYPES_POLICY.rst``：解法、平台类型和语言适配器；
* ``docs/AUTOMATION_DIRECT_MAIN_POLICY.rst``：对话驱动执行流程；
* ``docs/ARTIFACT_LIFECYCLE_POLICY.rst``：中间文件清理和归档规则；
* ``state/CONCEPT_LEDGER.toml``：知识账本分段索引；
* ``problems/0001-0100/README.rst``：``0001–0100`` 已完成题目索引；
* ``problems/0101-0200/README.rst``：当前范围题目索引和难度预算。

历史产物归档
------------

已经被正式规则吸收的审查批次、findings、旧目录和归并记录不再散落在 ``docs/`` 与 ``state/``：

* ``archive/reviews/0001-0050/MANIFEST.rst``：第一次逐题审查产物；
* ``archive/reviews/0051-0100/MANIFEST.rst``：第二轮逐题审查与归并产物；
* ``archive/README.rst``：归档使用与优先级说明。

归档资料只用于规则来源追溯和历史题修复。事实冲突以 ``state/REVIEW_INDEX.toml`` 的 active corrections
为准。

知识账本
--------

``state/CONCEPT_LEDGER.toml`` 使用分段记录，后续分段中的同名 ``updates``
覆盖更早记录的最新题号、出现
次数、教学状态和说明。

规则优先级
----------

出现重复或冲突时：

#. ``state/PROGRESS.toml``；
#. ``state/REVIEW_INDEX.toml`` 的 active corrections；
#. 当前阶段完整前向规则；
#. 专项策略、模板和质量门；
#. ``archive/`` 中的历史证据；
#. 提交、PR 和对话摘要。

执行方式
--------

所有生成、审查、修复和归档由当前对话中的明确指令触发：

#. 读取最新 ``main``、状态和当前阶段规则；
#. 按 Easy=1、Medium=2、Hard=4 确定唯一连续范围；
#. 逐题完成内容与质量检查；
#. 删除无用中间文件，将有追溯价值的阶段产物归档；
#. 将完整结果作为一个原子提交写入 ``main``；
#. 复查提交差异、状态、活动目录和下一步；
#. 在对话中报告结果。

分支和 PR 只在用户明确选择评审、多人协作或隔离实验时作为正式流程使用。

工程笔记
--------

* `Git 对象与原子提交：blob、tree、commit、ref
  <docs/GIT_OBJECTS_AND_ATOMIC_COMMITS.rst>`_：解释多文件批次如何组装为一个原子提交。

文档形式
--------

题目正文和项目说明以 RST 为主，仓库内容以直接阅读源文件为目标。
