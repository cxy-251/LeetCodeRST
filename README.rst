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
* 把跨题模式写入前向规则和自动质量门；
* 不修改 ``0001`` 至 ``0050`` 的历史题目 RST；
* 审查完成前保留 ``next_problem = 51``，但暂不生成 0051。

当前已经完整审查 ``0001`` 至 ``0030``，下一批为 ``0031`` 至 ``0035``。
总进度以 ``state/PROGRESS.toml`` 和 ``state/REVIEW_INDEX.toml`` 为准。

审查记录分为：

* ``state/REVIEW_0001_0050.toml``：保留 ``0001`` 至 ``0015`` 的完整旧记录；
* ``state/reviews/``：从 ``0016`` 起按五题一批保存结构化记录；
* ``docs/REVIEW_FINDINGS_0001_0050.rst``：保留前三批详细提炼；
* ``docs/review-findings/``：保存后续批次的正文证据；
* ``docs/FORWARD_RULES_0051_0100.rst``：汇总对新题真正执行的规则。

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

* 精确官方约束支撑字符模型、数值宽度、索引边界、非空断言和链表别名前提；
* 官方契约与通用扩展分开，十语言前提保持一致；
* 有效前缀题定义返回长度、可检查前缀、尾部未定义语义和调用后容器状态；
* 字符串题分别定义比较单位和返回下标坐标；
* 复杂度计入输入规范化、键载荷、字符工作、具体容器、输出构造、结果扩容和返回复制；
* C 失败路径不得返回部分结果，``realloc`` 与复合状态分配必须事务式更新；
* 固定容量、组合数量和 Catalan 计数必须由上界证明并检查溢出；
* 数值检查覆盖连续加法、差值、绝对值、剪枝边界、平台整数宽度与最终窄化；
* 对数复杂度必须覆盖零值定义域；
* 贪心、二分、双指针、滑动窗口和回溯证明覆盖真实决策；
* 正文宣称的剪枝与优化必须和十语言代码实际一致；
* 某语言使用适配器或不同算法时单独解释接口、正确性和复杂度；
* 破坏性链表算法必须声明输入拓扑、所有权、共享节点和调用后可用性；
* 局部重连需要列出边清单并证明连通、节点守恒与无环；
* 边界不足时先只读探测，再进行首次破坏性写入；
* 自定义堆和哈希表的复杂度必须由目标语言具体容器与键载荷支撑；
* R 的 ``<<-``、``c`` 追加和写时复制按真实语义计费；
* Julia 与 R 的空范围和短范围必须按真实循环起点守卫；
* 标准库导入、最低版本、比较器和平台预置边界必须明确。

完整规则见：

* ``docs/REVIEW_AND_PREVENTION_POLICY.rst``；
* ``docs/REVIEW_FINDINGS_0001_0050.rst``；
* ``docs/review-findings/``；
* ``docs/FORWARD_RULES_0051_0100.rst``；
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
#. ``docs/review-findings/`` 中已经登记的批次文件；
#. ``docs/FORWARD_RULES_0051_0100.rst``；
#. ``docs/AUTOMATION_QUALITY_GATE.rst``；
#. ``docs/AUTOMATION_DIRECT_MAIN_POLICY.rst``；
#. ``state/PROGRESS.toml``；
#. ``state/REVIEW_INDEX.toml``；
#. ``state/REVIEW_0001_0050.toml`` 与 ``state/reviews/`` 中已登记的记录；
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
     FORWARD_RULES_0051_0100.rst
     review-findings/
       0016-0020.rst
       0021-0025.rst
       0026-0030.rst
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
     REVIEW_INDEX.toml
     REVIEW_0001_0050.toml
     reviews/
       0016-0020.toml
       0021-0025.toml
       0026-0030.toml
     CONCEPT_LEDGER.toml

文档形式
--------

题目正文和项目说明以 RST 为主。仓库不建立 Sphinx、文档站点、CI 构建或发布系统，
内容以直接阅读源文件为目标。

仓库前身
--------

本仓库原用于 ``paperToVideo`` 项目。改造前 ``main`` 的最终状态保存在
``archive/paperToVideo-before-reset`` 分支中。