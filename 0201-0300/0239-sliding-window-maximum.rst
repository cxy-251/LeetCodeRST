0239. Sliding Window Maximum
============================

题目信息
--------

:题号: 0239
:难度: Hard
:主题: 单调队列、滑动窗口、堆
:原题: `LeetCode 0239 <https://leetcode.com/problems/sliding-window-maximum/>`_
:教学重点: 过期下标、单调性、窗口顺序

题目重述
--------

给定整数数组 ``nums`` 与窗口长度 ``k``，接口为 ``vector<int> maxSlidingWindow(vector<int>& nums, int k)``。窗口从左到右每次移动一格，返回每个长度为 ``k`` 的窗口最大值，顺序与窗口起点一致。``n`` 最多约 ``10^5``，``1 <= k <= n``，输入不需修改。

自建示例
--------

.. code-block:: text

   输入：nums=[4,2,12,3,8], k=3
   输出：[12,12,12]

   输入：nums=[5,1], k=1
   输出：[5,1]
