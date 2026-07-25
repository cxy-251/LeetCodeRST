1605. Find Valid Matrix Given Row and Column Sums
================================================

题目信息
--------

:题号: 1605
:难度: Medium
:主题: 矩阵构造、贪心、行列和
:原题: `LeetCode 1605 <https://leetcode.com/problems/find-valid-matrix-given-row-and-column-sums/>`_
:重点: 构造非负整数矩阵，使每行和与每列和分别等于给定数组

题目重述
--------

给定 ``rowSum`` 和 ``colSum``，两者总和相等。返回任意一个非负整数矩阵，使第 ``i`` 行之和为 ``rowSum[i]``，第 ``j`` 列之和为 ``colSum[j]``。

题目保证至少存在一种答案。

自建示例
--------

.. code-block:: text

   输入：rowSum = [3,2], colSum = [1,4]
   输出：[[1,2],[0,2]]
   解释：两行和为 3、2，两列和为 1、4。

.. code-block:: text

   输入：rowSum = [0], colSum = [0,0]
   输出：[[0,0]]
   解释：零总量只能由全零矩阵满足。