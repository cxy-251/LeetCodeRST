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
* Premium 或无法可靠确认的题目按规则登记。

已完成范围
----------

``0001`` 至 ``0050`` 的首轮多语言 RST 已完成。完整索引见
``problems/0001-0100/README.rst``。

当前阶段
--------

当前阶段为 ``0001–0050`` 逐题规则提炼审查。

审查工作按题号完整读取正文、证明、复杂度和十语言代码，将单题观察保存到批次记录，并把稳定的
跨题模式提升为 ``0051–0100`` 的前向规则。历史题目在此阶段作为只读学习样本。

当前已经完整审查 ``0001`` 至 ``0045``，下一批为 ``0046`` 至 ``0050``。
总进度以 ``state/PROGRESS.toml`` 和 ``state/REVIEW_INDEX.toml`` 为准。

审查记录分为：

* ``state/REVIEW_0001_0050.toml``：保存 ``0001`` 至 ``0015`` 的完整旧记录；
* ``state/reviews/``：从 ``0016`` 起按五题一批保存结构化记录；
* ``docs/REVIEW_FINDINGS_0001_0050.rst``：保存前三批详细提炼；
* ``docs/review-findings/``：保存后续批次正文证据；
* ``docs/FORWARD_RULES_0051_0100.rst``：汇总新题真正执行的规则。

审查证据
--------

内容质量结论来自完整题目 RST、正文中的题意与证明、十种语言代码块，以及直接相关的公共规则与
知识账本。PR、提交和状态记录用于说明工作流程，题解质量判断仍以实际正文和代码为准。

固定核心语言
------------

普通算法题默认覆盖 C、C++、Python、Java、Rust、Go、TypeScript、C#、Julia 和 R。
JavaScript 运行时知识在 TypeScript 中教学；SQL 用于数据库题；Bash 或 POSIX Shell 用于 Shell 题。
完整边界见 ``docs/LANGUAGE_SCOPE.rst``。

后续质量规则
------------

从实际 RST 审查中确认的规则会约束 0051 以后，例如：

* 精确约束支撑字符模型、数值宽度、索引边界、规范表示、断言和结构前提；
* 固定域题同时说明精确工作量、约束内常数界和推广模型；
* 官方契约、平台接口和语言适配器分别说明；
* 值派生下标先完成值域检查，再按短路顺序执行数组访问；
* 原地槽位置换证明永久进展、正确槽位保持和重复值终止；
* 聚合结果与覆盖端点由数量、单项贡献和最大步长共同推导宽度；
* 字符串比较单位、返回坐标、输入规范化、序列化管线和构造峰值空间分别计算；
* 数字字符串声明零的唯一表示和前导零规则，后处理解包具有存在性证明；
* C 的分配、扩容和多缓冲区更新形成完整资源契约；
* 二分、双指针、贪心、滑动窗口、回溯和动态规划证明覆盖真实决策；
* 在线结算证明未来信息不会改变已提交结果；
* MRV 等启发式证明只改变顺序，并计入启发式选择成本；
* 受控回退给出单调进度量、回退次数和重扫上界；
* 区间 BFS 压缩证明层出边并集连续，覆盖边界与数组下标分开；
* 回溯复杂度拆为预处理、搜索节点和输出载荷；
* 同层去重证明等价分支与后缀覆盖关系；
* 调用级对象字段和闭包状态在公共入口建立本轮状态；
* 正文中的语言范围、切片、复制和标准库行为经过实际语义校验；
* 编译器内建、语言版本、导入和平台预置边界明确；
* R 的环境、写时复制和结果追加按真实成本分析；
* Julia 的递减范围按实际循环起点和后缀耗尽条件守卫。

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

新的对话工作依次读取：

#. ``AGENTS.md``；
#. 本文件；
#. ``docs/PROJECT_VISION.rst``；
#. ``docs/LANGUAGE_SCOPE.rst``；
#. ``docs/SOLUTION_AND_TYPES_POLICY.rst``；
#. ``docs/CONTENT_LANGUAGE_POLICY.rst``；
#. ``docs/RST_STYLE_GUIDE.rst``；
#. ``docs/RELATED_PROBLEMS_POLICY.rst``；
#. ``docs/REVIEW_AND_PREVENTION_POLICY.rst``；
#. 当前已登记的审查记录与详细发现；
#. ``docs/FORWARD_RULES_0051_0100.rst``；
#. ``docs/AUTOMATION_QUALITY_GATE.rst``；
#. ``docs/AUTOMATION_DIRECT_MAIN_POLICY.rst``；
#. ``state/PROGRESS.toml``；
#. ``state/REVIEW_INDEX.toml``；
#. ``state/CONCEPT_LEDGER.toml``。

仓库文件是跨对话和跨执行环境的共享状态。

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
       0031-0035.rst
       0036-0040.rst
       0041-0045.rst
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
       0031-0035.toml
       0036-0040.toml
       0041-0045.toml
     CONCEPT_LEDGER.toml

文档形式
--------

题目正文和项目说明以 RST 为主。仓库不建立文档站点或发布系统，内容以直接阅读源文件为目标。

仓库前身
--------

本仓库原用于 ``paperToVideo`` 项目。改造前 ``main`` 的最终状态保存在
``archive/paperToVideo-before-reset`` 分支中。
