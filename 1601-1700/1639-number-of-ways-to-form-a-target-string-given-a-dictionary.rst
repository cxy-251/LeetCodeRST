1639. Number of Ways to Form a Target String Given a Dictionary
===============================================================

题目信息
--------

:题号: 1639
:难度: Hard
:主题: 动态规划、字符串列计数
:原题: `LeetCode 1639 <https://leetcode.com/problems/number-of-ways-to-form-a-target-string-given-a-dictionary/>`_
:重点: 从左到右选择严格递增的列，每列可从任意单词取一个匹配字符

题目重述
--------

所有 ``words`` 等长。形成 ``target`` 时，第 ``i`` 个目标字符从某一列选取，后续字符只能使用更靠右的列；同一列中可选择任意单词的字符。统计方案数并对 ``10^9+7`` 取模。

自建示例
--------

.. code-block:: text

   输入：words = ["ab","ac"], target = "ab"
   输出：2
   解释：首字符 a 在第 0 列有两种来源，第二列的 b 只有一种来源。

.. code-block:: text

   输入：words = ["a"], target = "c"
   输出：0
   解释：没有任何列含字符 c。