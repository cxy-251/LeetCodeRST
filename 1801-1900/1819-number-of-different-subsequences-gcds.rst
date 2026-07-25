1819. Number of Different Subsequences GCDs
===========================================

题目信息
--------

:题号: 1819
:难度: Hard
:主题: 数论、最大公约数、枚举
:原题: `LeetCode 1819 <https://leetcode.com/problems/number-of-different-subsequences-gcds/>`_
:重点: 统计所有非空子序列能够产生的不同最大公约数

题目重述
--------

从数组中选择任意非空子序列，计算其最大公约数。返回所有可能结果的不同数量。

自建示例
--------

.. code-block:: text

   输入：nums = [6,10,15]
   输出：7
   解释：可得到 1、2、3、5、6、10、15。

.. code-block:: text

   输入：nums = [4]
   输出：1
   解释：唯一非空子序列的最大公约数为 4。
