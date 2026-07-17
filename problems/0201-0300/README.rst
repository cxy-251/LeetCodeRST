LeetCode 0201–0300
==================

本目录按题号顺序保存 0201 至 0300 的算法教程。当前已完成 0201 至 0218，下一入口为 0219。
每道公开算法题只有一个自包含 RST，正文、证明、静态审查与固定十语言代码全部直接内联，
不使用 ``.inc`` 或 ``.. include::``。

已完成
------

#. `0201. Bitwise AND of Numbers Range <0201-bitwise-and-of-numbers-range.rst>`_
#. `0202. Happy Number <0202-happy-number.rst>`_
#. `0203. Remove Linked List Elements <0203-remove-linked-list-elements.rst>`_
#. `0204. Count Primes <0204-count-primes.rst>`_
#. `0205. Isomorphic Strings <0205-isomorphic-strings.rst>`_
#. `0206. Reverse Linked List <0206-reverse-linked-list.rst>`_
#. `0207. Course Schedule <0207-course-schedule.rst>`_
#. `0208. Implement Trie (Prefix Tree) <0208-implement-trie-prefix-tree.rst>`_
#. `0209. Minimum Size Subarray Sum <0209-minimum-size-subarray-sum.rst>`_
#. `0210. Course Schedule II <0210-course-schedule-ii.rst>`_
#. `0211. Design Add and Search Words Data Structure <0211-design-add-and-search-words-data-structure.rst>`_
#. `0212. Word Search II <0212-word-search-ii.rst>`_
#. `0213. House Robber II <0213-house-robber-ii.rst>`_
#. `0214. Shortest Palindrome <0214-shortest-palindrome.rst>`_
#. `0215. Kth Largest Element in an Array <0215-kth-largest-element-in-an-array.rst>`_
#. `0216. Combination Sum III <0216-combination-sum-iii.rst>`_
#. `0217. Contains Duplicate <0217-contains-duplicate.rst>`_
#. `0218. The Skyline Problem <0218-the-skyline-problem.rst>`_

当前质量状态
------------

``0201–0218`` 已按冻结质量基线完整生成：

* ``0201``：公共二进制前缀、变化后缀归零、逻辑右移与 TypeScript/R 数值适配；
* ``0202``：平方位和有限状态上界、Floyd 循环检测和相遇值判定；
* ``0203``：虚拟头连接不变量、连续删除、C 节点释放假设和 Rust 所有权重接；
* ``0204``：严格小于 ``n`` 的质数计数、埃氏筛不变量、``p*p`` 起点证明、溢出安全和筛数组成本；
* ``0205``：字符双向映射、函数一致性、目标唯一性、双射证明和跨语言字符单位；
* ``0206``：``previous/current/next`` 原地反转、节点守恒、无环证明和跨语言所有权；
* ``0207``：先修边方向、Kahn 剩余入度不变量、拓扑序与有向环等价、重复边和邻接表资源；
* ``0208``：Trie 路径节点、单词终止标记、三种状态操作、事务式 C 插入和跨语言对象生命周期；
* ``0209``：全正数窗口单调性、持续收缩、全局最短性、线性工作量和宽整数求和；
* ``0210``：实际拓扑顺序、无解空结果、非唯一答案验证、重复边和输出载荷；
* ``0211``：点号单字符通配、Trie 分支 DFS、终止标记、真实访问规模和对象生命周期；
* ``0212``：Trie 与棋盘 DFS 联合状态、四邻接、路径内单格不可重复、恢复、去重和 C 输出所有权；
* ``0213``：环形首尾互斥、两个线性区间覆盖、滚动 House Robber DP 和宽整数累计；
* ``0214``：最长回文前缀最优性、KMP 最终 border 双向证明、安全分隔符和跨语言字符串资源；
* ``0215``：``n-k`` 顺序统计下标、三路 Quickselect 不变量、重复值等值段、严格收缩和真实最坏复杂度；
* ``0216``：严格递增组合回溯、数量与总和守恒、可达和剪枝、结果快照和 C 二维输出所有权；
* ``0217``：已见集合不变量、哈希平均/最坏复杂度、C 开放寻址与 R 无歧义整数键；
* ``0218``：半开区间边界扫描、最大堆惰性删除、同坐标整体处理、关键点规范化和二维输出资源。

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

下一批生成 ``0219–0220``：Contains Duplicate II 与 Contains Duplicate III。重点处理索引距离滑动窗口、
窗口集合删除语义，以及有序集合或桶方法中的值差边界、负数分桶和宽整数溢出；具体合同见
``../../state/BATCH_CONTRACT.toml``。
