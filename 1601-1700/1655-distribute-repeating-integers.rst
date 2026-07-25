1655. Distribute Repeating Integers
===================================

题目信息
--------

:题号: 1655
:难度: Hard
:主题: 状态压缩、回溯、频次
:原题: `LeetCode 1655 <https://leetcode.com/problems/distribute-repeating-integers/>`_
:重点: 每位顾客获得指定数量且所有整数值必须相同，不同顾客可获得相同值的不同实例

题目重述
--------

给定含重复整数的 ``nums`` 和顾客需求 ``quantity``。判断能否为每位顾客分配恰好所需数量的同值整数，每个数组元素最多使用一次。

自建示例
--------

.. code-block:: text

   输入：nums = [1,1,2,2], quantity = [2,2]
   输出：true
   解释：两位顾客分别获得两个 1 和两个 2。

.. code-block:: text

   输入：nums = [1,2], quantity = [2]
   输出：false
   解释：没有任何值出现两次。