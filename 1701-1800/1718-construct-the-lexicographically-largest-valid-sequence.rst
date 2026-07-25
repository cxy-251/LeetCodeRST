1718. Construct the Lexicographically Largest Valid Sequence
============================================================

题目信息
--------

:题号: 1718
:难度: Medium
:主题: 回溯、构造
:原题: `LeetCode 1718 <https://leetcode.com/problems/construct-the-lexicographically-largest-valid-sequence/>`_
:重点: 数字 1 出现一次，数字 ``2..n`` 各出现两次且两个位置距离等于该数字

题目重述
--------

构造长度 ``2n-1`` 的合法序列，并在所有答案中字典序最大。题目保证存在答案。

自建示例
--------

.. code-block:: text

   输入：n = 3
   输出：[3,1,2,3,2]
   解释：两个 3 相距 3，两个 2 相距 2，且该序列字典序最大。

.. code-block:: text

   输入：n = 1
   输出：[1]
   解释：只有数字 1。