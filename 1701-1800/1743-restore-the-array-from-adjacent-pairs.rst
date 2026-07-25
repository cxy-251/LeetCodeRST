1743. Restore the Array From Adjacent Pairs
==========================================

题目信息
--------

:题号: 1743
:难度: Medium
:主题: 图、哈希表、路径恢复
:原题: `LeetCode 1743 <https://leetcode.com/problems/restore-the-array-from-adjacent-pairs/>`_
:重点: 数组元素互不相同，每个相邻无序对恰好给出一次，答案及其反转都合法

题目重述
--------

给定原数组所有相邻元素组成的无序对，恢复任意一个符合这些相邻关系的原数组。

自建示例
--------

.. code-block:: text

   输入：adjacentPairs = [[2,1],[3,4],[3,2]]
   输出：[1,2,3,4]
   解释：相邻关系依次为 1-2、2-3、3-4。

.. code-block:: text

   输入：adjacentPairs = [[7,9]]
   输出：[7,9]
   解释：两个元素的顺序及其反转都可接受。