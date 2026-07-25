1431. Kids With the Greatest Number of Candies
==============================================

题目信息
--------

:题号: 1431
:难度: Easy
:主题: 数组、最大值、逐项判断
:原题: `LeetCode 1431 <https://leetcode.com/problems/kids-with-the-greatest-number-of-candies/>`_
:重点: 分别假设把全部额外糖果给当前孩子，判断其糖果数是否达到或超过原数组最大值

题目重述
--------

给定数组 ``candies``，其中 ``candies[i]`` 表示第 ``i`` 个孩子拥有的糖果数；另给定 ``extraCandies``。

对于每个孩子，假设把全部额外糖果都给他。若此时他的糖果数不少于所有孩子原本的最大糖果数，则对应答案为 ``true``，否则为 ``false``。返回布尔数组。

``2 <= candies.length <= 100``，``1 <= candies[i] <= 100``，``1 <= extraCandies <= 50``。

自建示例
--------

达到当前最大值也应返回真：

.. code-block:: text

   输入：candies = [2,5,1], extraCandies = 3
   输出：[true,true,false]
   解释：三名孩子得到额外糖果后分别为 5、8、4，原最大值为 5。

所有孩子原有糖果相同时均满足条件：

.. code-block:: text

   输入：candies = [4,4], extraCandies = 1
   输出：[true,true]
   解释：任一孩子得到额外糖果后都会超过原最大值。