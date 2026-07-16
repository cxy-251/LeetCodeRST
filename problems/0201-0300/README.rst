LeetCode 0201–0300
==================

本目录按题号顺序保存 0201 至 0300 的算法教程。当前已完成 0201 至 0204，下一入口为 0205。
每道公开算法题只有一个自包含 RST，正文、证明、静态审查与固定十语言代码全部直接内联，
不使用 ``.inc`` 或 ``.. include::``。

已完成
------

#. `0201. Bitwise AND of Numbers Range <0201-bitwise-and-of-numbers-range.rst>`_
#. `0202. Happy Number <0202-happy-number.rst>`_
#. `0203. Remove Linked List Elements <0203-remove-linked-list-elements.rst>`_
#. `0204. Count Primes <0204-count-primes.rst>`_

当前质量状态
------------

``0201–0204`` 已按冻结质量基线完整生成：

* ``0201``：公共二进制前缀、变化后缀归零、逻辑右移与 TypeScript/R 数值适配；
* ``0202``：平方位和有限状态上界、Floyd 循环检测和相遇值判定；
* ``0203``：虚拟头连接不变量、连续删除、C 节点释放假设和 Rust 所有权重接；
* ``0204``：严格小于 ``n`` 的质数计数、埃氏筛不变量、``p*p`` 起点证明、溢出安全和筛数组成本。

题解代码未运行、未编译、未对拍。只执行人工示例推演、正确性推导、逐语言静态语义审查和仓库一致性检查。

执行规则
--------

``0201`` 起持续执行：

* ``../../docs/TUTORIAL_QUALITY_BASELINE.rst``；
* ``../../docs/FORWARD_RULES_0151_ONWARD.rst``；
* ``../../docs/AUTOMATION_QUALITY_GATE.rst``；
* ``../../state/REVIEW_INDEX.toml`` 的 active corrections；
* ``../../state/BATCH_CONTRACT.toml`` 的当前批次风险与完成条件。

具体要求：

* 普通算法题覆盖 C、C++、Python、Java、Rust、Go、TypeScript、C#、Julia 和 R；
* 精确契约、示例、抽象、状态、不变量、完整证明、复杂度、语言成本和自检不能退化成摘要；
* Premium、Database、Shell 或题面无法可靠确认的题只登记状态，不创建空壳教程；
* 题解代码禁止运行、编译、对拍、穷举、属性测试或 sanitizer；
* 所有生成与状态同步只允许在 ``main`` 形成一个原子提交。

上一范围
--------

``0101–0200`` 的教程、Premium、Database 与 Shell 登记见
``../0101-0200/README.rst``。该范围已经处理结束，不再把新题写入旧目录。

下一动作
--------

下一批生成 ``0205`` Isomorphic Strings、``0206`` Reverse Linked List 与 ``0207`` Course Schedule，
完整处理双向字符映射、链表指针反转和课程依赖有向图判环；具体合同见
``../../state/BATCH_CONTRACT.toml``。
