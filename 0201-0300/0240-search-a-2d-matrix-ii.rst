0240. Search a 2D Matrix II
===========================

题目信息
--------

:题号: 0240
:难度: Medium
:主题: 矩阵、二分查找、单调消去
:原题: `LeetCode 0240 <https://leetcode.com/problems/search-a-2d-matrix-ii/>`_
:教学重点: 行列单调性、角点移动、整行整列排除

题目重述
--------

给定 ``m x n`` 整数矩阵 ``matrix``，每行从左到右非递减、每列从上到下非递减，接口为 ``bool searchMatrix(vector<vector<int>>& matrix, int target)``。判断目标是否存在。行列数最多约 300，值可为 32 位整数；返回布尔值，不修改矩阵。

自建示例
--------

.. code-block:: text

   输入：matrix=[[1,4,9],[2,5,12],[6,8,15]], target=8
   输出：true

   target=7
   输出：false
