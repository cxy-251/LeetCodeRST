LeetCode 多语言 RST 学习仓库
============================

本仓库按 LeetCode 题号顺序建设多语言算法学习资料。每道可访问题目对应一个 RST 文件，
同时学习算法、正确性证明、复杂度和多种语言实现。

项目目标
--------

* 题目内容使用原创重述，不复制平台完整题干或官方题解；
* 按题号递增推进，让不同算法主题自然交错；
* 每道普通算法题提供 C、C++、Python、Java、Rust、Go、TypeScript、C#、Julia、R；
* 语法知识采用解释衰减，疑难算法采用周期性复现；
* 代码注释重点解释状态变化、语言边界和容易出错的位置；
* Premium 或无法可靠确认的题目按规则登记，不猜测题意。

已完成范围
----------

``0001`` 至 ``0050`` 的首轮多语言 RST 已完成。完整索引见
``problems/0001-0100/README.rst``。

当前阶段
--------

当前阶段为 ``0001–0050`` 逐题规则提炼审查。

这次审查的目标是完整读取每个 RST，从实际正文和十语言代码中提炼 ``0051–0100`` 的优化规则：

* 逐题按编号读取，不通过 PR 描述或完成报告代替内容审查；
* 记录题意、证明、复杂度、字符模型、语言接口、内存和所有权等问题；
* 把跨题模式写入模板、质量门和语言规则；
* 不修改 ``0001`` 至 ``0050`` 的历史题目 RST；
* 审查完成前保留 ``next_problem = 51``，但暂不生成 0051。

当前已经完整审查 ``0001`` 至 ``0010``，下一批为 ``0011`` 至 ``0015``。
进度以 ``state/PROGRESS.toml`` 与 ``state/REVIEW_0001_0050.toml`` 为准，提炼结果见
``docs/REVIEW_FINDINGS_0001_0050.rst``。

审查证据边界
------------

内容质量结论必须来自：

* 完整题目 RST；
* 正文中的题意、示例、证明和复杂度；
* 十种语言代码块；
* 直接相关的公共规则与知识账本。

PR 标题、提交信息、合并状态和自动任务报告只能证明流程发生过，不能证明题解内容质量。

固定核心语言
------------

普通算法题默认覆盖：

* C；
* C++；
* Python；
* Java；
* Rust；
* Go；
* TypeScript；
* C#；
* Julia；
* R。

JavaScript 运行时知识在 TypeScript 中教学；SQL 用于数据库题；Bash 或 POSIX Shell 用于
Shell 题。完整边界见 ``docs/LANGUAGE_SCOPE.rst``。

后续质量规则
------------

从实际 RST 审查中确认的规则会约束 0051 以后，例如：

* 字符串题必须把精确字符约束与字节、代码单元、码点或字形簇模型绑定；
* 复杂度计入 ``[]byte``、``collect``、``strsplit``、切片和结果复制；
* C 失败路径不能返回看似合法的部分结果或把资源失败伪装成合法布尔值；
* 二分证明必须覆盖搜索方向和排除安全性；
* 必要导入、平台预置和语言版本前提必须明确；
* 哈希解法区分期望与最坏复杂度；
* 核心推导只完整出现一次，复现题只解释新增差异；
* 边界算术必须先扩宽操作数再计算；
* 整数逐位复杂度使用位数 ``d`` 或 ``log(|x| + 1)``；
* R 的 ``<<-`` 不能被当作矩阵原地更新保证；
* 递归深度必须由题目最大规模和语言栈限制共同证明。

完整规则见：

* ``docs/REVIEW_AND_PREVENTION_POLICY.rst``；
* ``docs/REVIEW_FINDINGS_0001_0050.rst``；
* ``docs/AUTOMATION_QUALITY_GATE.rst``；
* ``docs/SOLUTION_AND_TYPES_POLICY.rst``；
* ``docs/PROBLEM_TEMPLATE.rst``。

开始工作
--------

新的对话或自动任务必须先读取：

#. ``AGENTS.md``；
#. 本文件；
#. ``docs/PROJECT_VISION.rst``；
#. ``docs/LANGUAGE_SCOPE.rst``；
#. ``docs/SOLUTION_AND_TYPES_POLICY.rst``；
#. ``docs/CONTENT_LANGUAGE_POLICY.rst``；
#. ``docs/RST_STYLE_GUIDE.rst``；
#. ``docs/RELATED_PROBLEMS_POLICY.rst``；
#. ``docs/REVIEW_AND_PREVENTION_POLICY.rst``；
#. ``docs/REVIEW_FINDINGS_0001_0050.rst``；
#. ``docs/AUTOMATION_QUALITY_GATE.rst``；
#. ``docs/AUTOMATION_DIRECT_MAIN_POLICY.rst``；
#. ``state/PROGRESS.toml``；
#. ``state/REVIEW_0001_0050.toml``；
#. ``state/CONCEPT_LEDGER.toml``。

仓库文件是跨对话和跨执行环境的唯一共享状态。

文件组织
--------

::

   AGENTS.md
   README.rst
   docs/
     PROJECT_VISION.rst
     LANGUAGE_SCOPE.rst
     SOLUTION_AND_TYPES_POLICY.rst
     CONTENT_LANGUAGE_POLICY.rst
     RST_STYLE_GUIDE.rst
     RELATED_PROBLEMS_POLICY.rst
     REVIEW_AND_PREVENTION_POLICY.rst
     REVIEW_FINDINGS_0001_0050.rst
     AUTOMATION_QUALITY_GATE.rst
     AUTOMATION_DIRECT_MAIN_POLICY.rst
     PROBLEM_TEMPLATE.rst
   problems/
     0001-0100/
       README.rst
       0001-two-sum.rst
       ...
       0050-powx-n.rst
   state/
     PROGRESS.toml
     REVIEW_0001_0050.toml
     CONCEPT_LEDGER.toml

文档形式
--------

题目正文和项目说明以 RST 为主。仓库不建立 Sphinx、文档站点、CI 构建或发布系统，
内容以直接阅读源文件为目标。

仓库前身
--------

本仓库原用于 ``paperToVideo`` 项目。改造前 ``main`` 的最终状态保存在
``archive/paperToVideo-before-reset`` 分支中。
