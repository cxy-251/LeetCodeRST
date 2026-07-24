1395. Count Number of Teams
===========================

题目信息
--------

:题号: 1395
:难度: Medium
:主题: 数组、枚举、计数
:原题: `LeetCode 1395 <https://leetcode.com/problems/count-number-of-teams/>`_
:重点: 选择下标 ``i < j < k``，三名士兵评分必须严格递增或严格递减；评分互不相同

题目重述
--------

给定互不相同的士兵评分数组 ``rating``。从中选择三名士兵，要求保留原数组下标顺序 ``i < j < k``。

若评分满足 ``rating[i] < rating[j] < rating[k]`` 或 ``rating[i] > rating[j] > rating[k]``，则构成合法队伍。请返回合法三人组数量。

``3 <= rating.length <= 1000``，评分为正整数且互不相同。

自建示例
--------

同一数组可以形成多个递增队伍：

.. code-block:: text

   输入：rating = [1,3,2,4]
   输出：2
   解释：合法下标组为 (0,1,3) 和 (0,2,3)。

三个严格递减元素形成一个队伍：

.. code-block:: text

   输入：rating = [5,3,1]
   输出：1
   解释：唯一三人组满足严格递减。