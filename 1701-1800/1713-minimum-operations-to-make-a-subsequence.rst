1713. Minimum Operations to Make a Subsequence
==============================================

题目信息
--------

:题号: 1713
:难度: Hard
:主题: 最长递增子序列、下标映射
:原题: `LeetCode 1713 <https://leetcode.com/problems/minimum-operations-to-make-a-subsequence/>`_
:重点: ``target`` 元素互不相同，只能向 ``arr`` 任意位置插入整数

题目重述
--------

通过最少插入操作，使 ``target`` 成为 ``arr`` 的子序列。返回最少插入次数。

自建示例
--------

.. code-block:: text

   输入：target = [5,1,3], arr = [9,4,2,3,4]
   输出：2
   解释：当前只能按序匹配目标中的 3，还需插入 5 和 1。

.. code-block:: text

   输入：target = [1,2], arr = [1,2,3]
   输出：0
   解释：target 已是子序列。