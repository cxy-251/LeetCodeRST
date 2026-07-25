1785. Minimum Elements to Add to Form a Given Sum
================================================

题目信息
--------

:题号: 1785
:难度: Medium
:主题: 数学、贪心
:原题: `LeetCode 1785 <https://leetcode.com/problems/minimum-elements-to-add-to-form-a-given-sum/>`_
:重点: 每个新增元素可取 ``[-limit,limit]`` 内任意整数，求达到目标和的最少数量

题目重述
--------

给定整数数组、``limit`` 和目标 ``goal``。可添加任意数量、绝对值不超过 ``limit`` 的整数，使新数组总和等于目标。返回最少添加数量。

自建示例
--------

.. code-block:: text

   输入：nums = [1,-1,1], limit = 3, goal = 10
   输出：3
   解释：当前和为 1，还差 9，三个值为 3 的元素即可补足。

.. code-block:: text

   输入：nums = [2,3], limit = 5, goal = 5
   输出：0
   解释：原数组和已经等于目标。