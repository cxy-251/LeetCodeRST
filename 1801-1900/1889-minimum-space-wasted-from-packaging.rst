1889. Minimum Space Wasted From Packaging
=========================================

题目信息
--------

:题号: 1889
:难度: Hard
:主题: 排序、二分查找、前缀和
:原题: `LeetCode 1889 <https://leetcode.com/problems/minimum-space-wasted-from-packaging/>`_
:重点: 只能选择一个供应商，为每个包裹选可容纳它的最小箱子

题目重述
--------

每个供应商提供若干箱子尺寸，箱子可重复使用。选择一个供应商，为每个包裹分配尺寸不小于包裹的箱子，最小化总浪费空间。无供应商可装下全部包裹时返回 -1。

自建示例
--------

.. code-block:: text

   输入：packages = [2,3,5], boxes = [[4,8],[2,5]]
   输出：2
   解释：选择第二个供应商，使用箱子 2、5、5，总浪费为 0 + 2 + 0。

.. code-block:: text

   输入：packages = [5], boxes = [[4]]
   输出：-1
   解释：没有箱子能容纳包裹。
