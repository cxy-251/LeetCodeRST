LeetCode 多语言 RST 学习仓库
============================

本仓库按 LeetCode 题号顺序建设多语言算法学习资料。每道可访问题目对应一个 RST 文件，
同时学习算法状态、正确性证明、复杂度和十语言实现。

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

已完成 ``0001–0155``、``0160``、``0162`` 和 ``0164–0165`` 的多语言教程；``0156–0159``、
``0161`` 与 ``0163`` 已按 Premium 规则登记。``0001`` 至 ``0100`` 的两轮历史逐题审查、81 条规则
归并和 14 项事实更正也已完成。

本批登记并跳过 Premium ``0163``，完成 ``0164`` Hard 与 ``0165`` Medium，难度合计 6 分。下一批为
``0166–0169``：Medium、Medium、Easy、Easy，合计 6 分。从 ``0151`` 起，所有后续题目统一使用并持续
维护 ``docs/FORWARD_RULES_0151_ONWARD.rst``。

固定“每 50 题一次”的全量审核已经取消。普通批次执行自身质量门；只有出现高风险语义、验证异常、
规则冲突，或用户明确要求时，才进行针对性抽查。

核心入口
--------

* ``AGENTS.md``：新对话接手顺序和工作约束；
* ``state/PROGRESS.toml``：当前阶段、覆盖范围、启用规则和下一步；
* ``state/REVIEW_INDEX.toml``：active corrections、审查策略与归档索引；
* ``docs/FORWARD_RULES_0101_0150.rst``：``0101–0150`` 阶段规则与历史来源；
* ``docs/FORWARD_RULES_0151_ONWARD.rst``：``0151`` 起全部后续题目的唯一长期前向规则；
* ``docs/AUTOMATION_QUALITY_GATE.rst``：当前批次验收步骤；
* ``docs/PROBLEM_TEMPLATE.rst``：单题结构骨架；
* ``docs/SOLUTION_AND_TYPES_POLICY.rst``：解法、平台类型和语言适配器；
* ``docs/REVIEW_AND_PREVENTION_POLICY.rst``：风险触发抽查和历史题边界；
* ``docs/AUTOMATION_DIRECT_MAIN_POLICY.rst``：只允许直接更新 ``main`` 的执行流程；
* ``docs/ARTIFACT_LIFECYCLE_POLICY.rst``：中间文件清理和归档规则；
* ``state/CONCEPT_LEDGER.toml``：知识账本分段索引；
* ``problems/0001-0100/README.rst``：``0001–0100`` 已完成题目索引；
* ``problems/0101-0200/README.rst``：当前范围题目索引、Premium 登记和难度预算。

历史产物归档
------------

已经被正式规则吸收的审查批次、findings、旧目录和归并记录统一保存在：

* ``archive/reviews/0001-0050/MANIFEST.rst``：第一次逐题审查产物；
* ``archive/reviews/0051-0100/MANIFEST.rst``：第二轮逐题审查与归并产物；
* ``archive/README.rst``：归档使用与优先级说明。

归档资料只用于规则来源追溯和历史题修复。事实冲突以 ``state/REVIEW_INDEX.toml`` 的 active corrections
为准。

知识账本
--------

``state/CONCEPT_LEDGER.toml`` 使用分段记录，后续分段中的同名 ``updates`` 覆盖更早记录的
最新题号、出现次数、教学状态和说明。

规则优先级
----------

出现重复或冲突时：

#. ``state/PROGRESS.toml``；
#. ``state/REVIEW_INDEX.toml`` 的 active corrections 与 review policy；
#. 当前生效的前向规则；
#. 专项策略、模板和质量门；
#. ``archive/`` 中的历史证据；
#. ``main`` 提交和对话摘要。

执行方式
--------

所有生成、抽查、修复、规则维护和归档由当前对话中的明确指令触发：

#. 读取最新 ``main``、状态和当前规则；
#. 按 Easy=1、Medium=2、Hard=4 确定唯一连续范围；
#. 逐题完成内容与必要质量检查；
#. 普通题只运行官方示例和关键边界，不默认执行大规模随机对拍；
#. Premium 或信息不足的题目登记状态后继续寻找可执行题目；
#. 通用问题直接维护 ``docs/FORWARD_RULES_0151_ONWARD.rst``；
#. 删除无用中间文件，将有追溯价值的专项产物归档；
#. 基于最新树将完整结果作为一个原子提交直接写入 ``main``；
#. 复查提交差异、状态、活动目录和下一步；
#. 在对话中报告结果。

仓库任务禁止创建分支、PR、上传分片分支或临时组装工作流。多文件提交使用 Git 对象直接构造，
不经过任何旁路分支。

工程笔记
--------

* `Git 对象与原子提交：blob、tree、commit、ref
  <docs/GIT_OBJECTS_AND_ATOMIC_COMMITS.rst>`_：解释多文件批次如何组装为一个原子提交。

文档形式
--------

题目正文和项目说明以 RST 为主，仓库内容以直接阅读源文件为目标。
