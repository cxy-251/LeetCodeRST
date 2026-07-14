0132. Palindrome Partitioning II
==================================

题目信息
--------

:题号: 0132
:难度: Hard
:主题: 动态规划、回文区间、前缀最优值
:原题: `LeetCode 0132 <https://leetcode.com/problems/palindrome-partitioning-ii/>`_
:访问状态: Available
:教学重点: 回文表、最后一段分解、最少切割次数

题目重述
--------

给定一个非空小写英文字母字符串，将它切分为若干回文子串。返回所需的最少切割次数。
整个字符串已经是回文时返回 ``0``。

算法
----

令 ``pal[start][end]`` 表示闭区间 ``s[start..end]`` 是否为回文。按 ``end`` 从左到右计算，
同一 ``end`` 下按 ``start`` 从右到左计算：

.. code-block:: text

   pal[start][end] =
       s[start] == s[end]
       and (end - start <= 1 or pal[start + 1][end - 1])

令 ``cuts[end]`` 表示前缀 ``s[0..end]`` 的最少切割次数。枚举所有以 ``end`` 结尾的回文段：

.. code-block:: text

   start == 0  ->  candidate = 0
   start > 0   ->  candidate = cuts[start - 1] + 1

取最小候选即可。

正确性
~~~~~~

任意最优分割都有唯一的最后一段 ``s[start..end]``，该段必须是回文。若 ``start == 0``，
整个前缀无需切割；否则前面的 ``s[0..start-1]`` 必须采用其最优切法，再增加最后一刀。
算法枚举全部可能的最后回文段，因此不会漏掉最优解；采用更差的前缀切法也不可能改善总切割数。

复杂度
~~~~~~

回文表和转移都需要 ``O(n^2)`` 时间，回文表占 ``O(n^2)`` 空间，``cuts`` 占 ``O(n)`` 空间。
Julia 使用 ``codeunits`` 只创建轻量包装；R 会物化字符向量，但总空间仍由回文表主导。

核心语言实现
------------

.. include:: 0132-palindrome-partitioning-ii-code-1.inc

.. include:: 0132-palindrome-partitioning-ii-code-2.inc

.. include:: 0132-palindrome-partitioning-ii-code-3.inc

.. include:: 0132-palindrome-partitioning-ii-code-4.inc

.. include:: 0132-palindrome-partitioning-ii-code-5.inc

关键边界
--------

* 单字符答案为 ``0``；
* 整串回文时 ``cuts[n-1]`` 会被更新为 ``0``；
* ``cuts[end]`` 初始设为 ``end``，对应每个字符单独成段；
* 回文状态依赖更短的内部区间，计算顺序必须保证该状态已经可用；
* 返回切割次数，不是回文片段数量。

最小自检
--------

#. 为什么只枚举最后一个回文片段就足以得到全局最优？
#. ``start == 0`` 时为什么候选值是 ``0``？
#. 为什么 ``cuts[end]`` 的安全上界是 ``end``？
