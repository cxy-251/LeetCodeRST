1751. Maximum Number of Events That Can Be Attended II
=====================================================

题目信息
--------

:题号: 1751
:难度: Hard
:主题: 区间调度、动态规划、二分查找
:原题: `LeetCode 1751 <https://leetcode.com/problems/maximum-number-of-events-that-can-be-attended-ii/>`_
:重点: 最多参加 ``k`` 个事件，前一事件结束日必须严格早于后一事件开始日

题目重述
--------

每个事件为 ``[start,end,value]``。选择至多 ``k`` 个互不重叠事件，最大化价值总和。

自建示例
--------

.. code-block:: text

   输入：events = [[1,2,4],[3,4,3],[2,3,5]], k = 2
   输出：7
   解释：选择前两个事件，结束日 2 严格早于开始日 3。

.. code-block:: text

   输入：events = [[1,1,8]], k = 1
   输出：8
   解释：选择唯一事件。