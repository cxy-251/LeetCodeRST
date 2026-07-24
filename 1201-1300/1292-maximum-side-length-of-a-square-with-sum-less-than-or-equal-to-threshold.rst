1292. Maximum Side Length of a Square with Sum Less than or Equal to Threshold
==============================================================================

题目信息
--------

:题号: 1292
:难度: Medium
:主题: 矩阵、二维前缀和、二分查找
:原题: `LeetCode 1292 <https://leetcode.com/problems/maximum-side-length-of-a-square-with-sum-less-than-or-equal-to-threshold/>`_
:重点: 寻找元素和不超过 ``threshold`` 的连续正方形子矩阵，并最大化边长；不存在合法正方形时返回 ``0``

题目重述
--------

给定非负整数矩阵 ``mat`` 和整数 ``threshold``。一个正方形子矩阵必须由连续行和连续列组成。

请返回元素总和不超过 ``threshold`` 的正方形子矩阵能够达到的最大边长。若连边长为 ``1`` 的正方形都不存在，返回 ``0``。

``1 <= mat.length, mat[i].length <= 300``，``0 <= mat[i][j] <= 10^4``，``0 <= threshold <= 10^5``。

自建示例
--------

多个单位元素可以组成更大的合法正方形：

.. code-block:: text

   输入：mat = [[1,1,1],[1,1,1]], threshold = 4
   输出：2
   解释：任意 2 x 2 子矩阵的元素和为 4；矩阵高度不足以形成边长 3 的正方形。

阈值小于所有单格元素时返回零：

.. code-block:: text

   输入：mat = [[2,3]], threshold = 1
   输出：0
   解释：任意 1 x 1 子矩阵的元素和都超过阈值。