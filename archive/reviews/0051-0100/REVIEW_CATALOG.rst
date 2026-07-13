0051–0100 第二轮审查资料目录
===========================

用途
----

本文件记录 ``0051`` 至 ``0100`` 第二轮逐题审查的覆盖、证据位置、事实更正和规则归并结果。审查读取
每题完整 RST、证明、复杂度和十语言代码，历史题目正文默认不修改。

覆盖完成
--------

第二轮逐题审查已经完成：

* ``0051–0055``：``state/reviews/0051-0055.toml`` 与
  ``docs/review-findings/0051-0055.rst``；
* ``0056–0060``：``state/reviews/0056-0060.toml`` 与
  ``docs/review-findings/0056-0060.rst``；
* ``0061–0065``：``state/reviews/0061-0065.toml`` 与
  ``docs/review-findings/0061-0065.rst``；
* ``0066–0070``：``state/reviews/0066-0070.toml`` 与
  ``docs/review-findings/0066-0070.rst``；
* ``0071–0075``：``state/reviews/0071-0075.toml`` 与
  ``docs/review-findings/0071-0075.rst``；
* ``0076–0080``：``state/reviews/0076-0080.toml`` 与
  ``docs/review-findings/0076-0080.rst``；
* ``0081–0085``：``state/reviews/0081-0085.toml`` 与
  ``docs/review-findings/0081-0085.rst``；
* ``0086–0090``：``state/reviews/0086-0090.toml`` 与
  ``docs/review-findings/0086-0090.rst``；
* ``0091–0095``：``state/reviews/0091-0095.toml`` 与
  ``docs/review-findings/0091-0095.rst``；
* ``0096–0100``：``state/reviews/0096-0100.toml`` 与
  ``docs/review-findings/0096-0100.rst``。

共审查 50 道题。覆盖状态和 active corrections 以 ``state/REVIEW_INDEX.toml`` 为准。

资料分层
--------

被审查正文
~~~~~~~~~~

``problems/0001-0100/0051`` 至 ``0100`` 是本轮审查对象。确定性问题先进入审查证据和 ``REVIEW_INDEX``；
只有用户明确指定修复某题时，才修改该题正文。

结构化记录
~~~~~~~~~~

``state/reviews/0051-0100`` 的十个五题批次保存：

* 每题正向样本；
* 确定性问题与验证缺口；
* promoted rule ID；
* correction ID；
* 批次范围和后续动作。

详细证据
~~~~~~~~

``docs/review-findings/0051-0100`` 的十份文件保存完整文字分析、代码语义依据和跨题归纳。

归并结果
--------

第二轮十个批次共提升 81 条规则。它们已经与旧的 ``docs/FORWARD_RULES_0051_0100.rst``、14 项 active
corrections 和审查政策去重归并：

* 结构化追溯：``state/RULE_CONSOLIDATION_0051_0100.toml``；
* 完整执行规则：``docs/FORWARD_RULES_0101_0150.rst``。

新文档是 ``0101`` 至 ``0150`` 的自包含规则入口。生成新题时不再要求逐份读取十个批次；批次记录和 findings
继续作为证据来源。归并没有修改任何历史题目 RST。

重点事实更正
------------

* R 递归普通复杂赋值不会自动把父调用帧状态共享给子调用；
* R ``seq.int`` 需要在构造前验证端点与步长方向；
* Julia ``codeunits`` 是轻量 wrapper，``collect(codeunits(...))`` 才物化数组；
* R 反复 ``c`` 追加和负下标删除可能产生平方级累计复制；
* 一行 DP 核心空间不能覆盖 C++ 按值参数、Julia ``collect`` 和 R 字符转换的适配器物化；
* Go 子串切片可能共享并保留完整原字符串，独立存储需要显式 ``strings.Clone``；
* Julia ``Vector`` 元素修改对调用者可见，R 形式参数局部修改需要返回适配结果；
* Gray Code ``n=0`` 需要独立的零维退化约定；
* ``0095`` R 构造器必须与 ``0094`` 的 ``new_tree_node`` 名称一致。

完整 correction 文本和优先级继续由 ``state/REVIEW_INDEX.toml`` 维护。

下一阶段
--------

``0101`` 至 ``0150`` 已具备完整前向规则。下一批为 ``0101`` 至 ``0105``，必须先读取
``docs/FORWARD_RULES_0101_0150.rst``。

规则优先级
----------

#. ``state/PROGRESS.toml``：当前阶段和下一步；
#. ``state/REVIEW_INDEX.toml``：事实更正与 canonical 文件；
#. ``docs/FORWARD_RULES_0101_0150.rst``：当前阶段完整规则；
#. 专项策略和模板；
#. 批次记录与详细证据；
#. 提交说明、PR 描述和对话报告。
