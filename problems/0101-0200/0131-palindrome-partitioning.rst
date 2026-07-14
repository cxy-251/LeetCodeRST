0131. Palindrome Partitioning
=============================

题目信息
--------

:题号: 0131
:难度: Medium
:主题: 字符串、动态规划、回溯、枚举
:原题: `LeetCode 0131 <https://leetcode.com/problems/palindrome-partitioning/>`_
:访问状态: Available
:教学重点: 回文区间 DP、切分点回溯、输出敏感复杂度

题目重述
--------

给定一个非空小写英文字符串，把它切分成若干连续非空片段，使每个片段都是回文串。
返回全部合法切分方案。不同方案由切分位置决定，输出顺序没有语义要求。

算法
----

先预计算 ``pal[start][end]``，表示闭区间 ``s[start..end]`` 是否为回文：

.. code-block:: text

   pal[start][end] =
       s[start] == s[end] and
       (end - start < 2 or pal[start + 1][end - 1])

起点从右向左填写，保证查询内部区间时状态已经存在。

随后从位置 ``start`` 回溯。枚举所有 ``end >= start``；若区间是回文，
把该片段加入路径并递归到 ``end + 1``。到达字符串末尾时复制当前路径作为一个答案。

正确性
~~~~~~

DP 公式直接来自回文定义：两端字符相同，且长度不超过二或内部区间也是回文。
填写顺序保证每个状态依赖的内部状态已正确。

回溯只选择 DP 判定为真的区间，所以生成的每个片段都是回文，且片段首尾相接覆盖整个字符串。
任意合法方案都有唯一的片段终点序列；回溯会依次选择这些终点，因此不会遗漏。
不同递归分支首次选择的终点不同，所以不会重复生成同一方案。

复杂度
~~~~~~

预处理时间和空间均为 ``O(n^2)``。设答案数为 ``P``，总输出字符载荷为 ``Z``；
回溯时间至少为 ``Theta(Z)``，不能只报告 DP 成本。递归路径最深 ``O(n)``，
返回结果空间同样由输出规模决定。

核心语言实现
------------

.. include:: 0131-palindrome-partitioning-code-1.inc

.. include:: 0131-palindrome-partitioning-code-2.inc

.. include:: 0131-palindrome-partitioning-code-3.inc

.. include:: 0131-palindrome-partitioning-code-4.inc

.. include:: 0131-palindrome-partitioning-code-5.inc

.. include:: 0131-palindrome-partitioning-code-6.inc

.. include:: 0131-palindrome-partitioning-code-7.inc

.. include:: 0131-palindrome-partitioning-code-8.inc

.. include:: 0131-palindrome-partitioning-code-9.inc

.. include:: 0131-palindrome-partitioning-code-10.inc

关键边界
--------

* 单字符只有一种切分；
* 整个字符串是回文时，完整字符串只是答案之一；
* 重复字符可能产生大量方案，必须计入输出成本；
* 路径加入片段后，递归返回时必须撤销；
* C、Julia 和 R 的适配器会显式物化子串。

最小自检
--------

#. 为什么 DP 的起点要从右向左填写？
#. 为什么每个合法切分都对应唯一的终点序列？
#. 为什么总复杂度必须包含输出载荷？
