1052. Grumpy Bookstore Owner
============================

题目信息
--------

:题号: 1052
:难度: Medium
:主题: 时间序列、一次连续技巧、满意顾客最大化
:原题: `LeetCode 1052 <https://leetcode.com/problems/grumpy-bookstore-owner/>`_
:重点: 店主可在恰好 ``minutes`` 个连续分钟内消除暴躁状态一次；原本不暴躁时的顾客始终满意

题目重述
--------

数组 ``customers[i]`` 表示第 ``i`` 分钟进入书店的顾客数量，``grumpy[i]`` 为 ``1`` 表示店主该分钟暴躁、这些顾客原本不满意，为 ``0`` 表示顾客自然满意。

店主可以选择一个长度恰好为 ``minutes`` 的连续时间段，在这一段内使用一次秘密技巧，使所有分钟都按不暴躁处理。请返回采用最佳时间段后，全天满意顾客总数的最大值。

``1 <= customers.length == grumpy.length <= 2 * 10^4``，``0 <= customers[i] <= 1000``，``grumpy[i]`` 为 ``0`` 或 ``1``，``1 <= minutes <= customers.length``。

自建示例
--------

技巧应覆盖额外顾客最多的暴躁分钟：

.. code-block:: text

   输入：customers = [4,2,1,5,3], grumpy = [1,0,1,1,0], minutes = 2
   输出：11
   解释：原本满意的顾客有 2 + 3 = 5 人；在分钟 2 到 3 使用技巧可额外满足 1 + 5 = 6 人，总数为 11。
