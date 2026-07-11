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

``0001`` 至 ``0050`` 的首轮多语言 RST 已完成。

``0001`` 至 ``0050`` 的逐题规则提炼也已完成。审查依据是每道题的完整正文、证明、复杂度和十语言代码。
历史题目保持原样，稳定规则已经汇总到 ``docs/FORWARD_RULES_0051_0100.rst``。

下一题为 ``0051. N-Queens``。0051 与 0052 均为 Hard，下一批只处理 0051。

进度入口
--------

* ``state/PROGRESS.toml``：内容生成与阶段状态；
* ``state/REVIEW_INDEX.toml``：0001–0050 审查批次和更正索引；
* ``docs/FORWARD_RULES_0051_0100.rst``：0051–0100 的最终执行规则；
* ``problems/0001-0100/README.rst``：题目索引。

审查记录
--------

* ``state/REVIEW_0001_0050.toml``：0001–0015 结构化记录；
* ``state/reviews/``：0016–0050 分批记录；
* ``docs/REVIEW_FINDINGS_0001_0050.rst``：0001–0015 详细提炼；
* ``docs/review-findings/``：0016–0050 分批证据。

Julia UnitRange 更正
-------------------

Julia ``a:b`` 是隐式步长 ``+1`` 的 ``UnitRange``；当 ``a>b`` 时为空。递减遍历使用显式负步长，
例如 ``n:-1:1``。该结论覆盖此前审查记录中关于自动递减的错误描述。详细记录见
``docs/review-findings/0046-0050.rst``。

执行方式
--------

所有生成、审查和修复由当前对话中的明确指令触发：

#. 读取最新 ``main``、``state/PROGRESS.toml`` 和相关规则；
#. 确定本轮唯一范围；
#. 完成内容与质量检查；
#. 将本轮文件作为一个原子提交写入 ``main``；
#. 复查提交差异、状态和下一步；
#. 在对话中报告结果。

详细工作流见 ``docs/AUTOMATION_DIRECT_MAIN_POLICY.rst``。

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
#. ``docs/FORWARD_RULES_0051_0100.rst``；
#. ``docs/AUTOMATION_QUALITY_GATE.rst``；
#. ``docs/AUTOMATION_DIRECT_MAIN_POLICY.rst``；
#. ``state/PROGRESS.toml``；
#. ``state/REVIEW_INDEX.toml``；
#. ``state/CONCEPT_LEDGER.toml``。

仓库文件是跨对话和跨执行环境的共享状态。

文档形式
--------

题目正文和项目说明以 RST 为主。仓库内容以直接阅读源文件为目标。

仓库前身
--------

本仓库原用于 ``paperToVideo`` 项目。改造前 ``main`` 的最终状态保存在
``archive/paperToVideo-before-reset`` 分支中。
