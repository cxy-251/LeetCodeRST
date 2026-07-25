1921. Eliminate Maximum Number of Monsters
==========================================

题目信息
--------

:题号: 1921
:难度: Medium
:主题: 贪心、排序
:原题: `LeetCode 1921 <https://leetcode.com/problems/eliminate-maximum-number-of-monsters/>`_
:重点: 每分钟开始时消灭一只怪物，怪物到达城市即失败

题目重述
--------

怪物以固定速度接近城市。每分钟开始时可消灭一只尚未到达的怪物。返回城市被攻破前最多能消灭的怪物数量。

自建示例
--------

.. code-block:: text

   输入：dist = [1,3,4], speed = [1,1,1]
   输出：3
   解释：到达时间为 1、3、4，可在分钟 0、1、2 依次消灭。

.. code-block:: text

   输入：dist = [1,1], speed = [1,1]
   输出：1
   解释：分钟 0 只能消灭一只，另一只在分钟 1 开始前到达。
