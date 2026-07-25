1830. Minimum Number of Operations to Make String Sorted
=======================================================

题目信息
--------

:题号: 1830
:难度: Hard
:主题: 组合数学、字符串、计数
:原题: `LeetCode 1830 <https://leetcode.com/problems/minimum-number-of-operations-to-make-string-sorted/>`_
:重点: 每次转到当前字符串的前一个不同字典序排列，求到排序状态的步数

题目重述
--------

按题目定义的操作不断把字符串变为字典序紧邻且更小的不同排列，直到字符串非递减。返回操作次数并取模。

自建示例
--------

.. code-block:: text

   输入：s = "cba"
   输出：5
   解释：在三个不同字符的六种排列中，cba 的零基字典序排名为 5。

.. code-block:: text

   输入：s = "aab"
   输出：0
   解释：字符串已经按非递减顺序排列。
