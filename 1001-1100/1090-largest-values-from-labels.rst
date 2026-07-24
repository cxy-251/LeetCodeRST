1090. Largest Values From Labels
================================

题目信息
--------

:题号: 1090
:难度: Medium
:主题: 物品选择、标签限额、最大价值
:原题: `LeetCode 1090 <https://leetcode.com/problems/largest-values-from-labels/>`_
:重点: 最多选择 ``numWanted`` 个物品，同一标签最多选择 ``useLimit`` 个；目标是最大化被选物品价值总和

题目重述
--------

给定长度相同的数组 ``values`` 和 ``labels``，第 ``i`` 个物品的价值为 ``values[i]``，标签为 ``labels[i]``。

可以选择至多 ``numWanted`` 个不同物品，但对于任意标签，被选物品中拥有该标签的数量不能超过 ``useLimit``。允许少选物品。请返回满足全部限制时能够得到的最大价值总和。

``1 <= values.length == labels.length <= 2 * 10^4``，``0 <= values[i], labels[i] <= 2 * 10^4``，``1 <= numWanted, useLimit <= values.length``。

自建示例
--------

每个标签只能选一个最高价值物品：

.. code-block:: text

   输入：values = [9,8,7,6,5], labels = [1,1,2,2,3], numWanted = 3, useLimit = 1
   输出：21
   解释：从标签 1、2、3 中分别选择价值 9、7、5 的物品，总价值为 21；同标签的第二件物品不能再选。

只有一个物品：

.. code-block:: text

   输入：values = [4], labels = [0], numWanted = 1, useLimit = 1
   输出：4
   解释：唯一物品满足数量和标签限制，选择它可得到最大价值 4。