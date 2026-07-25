1959. Minimum Total Space Wasted With K Resizing Operations
==========================================================

题目信息
--------

:题号: 1959
:难度: Medium
:主题: 动态规划、前缀和
:原题: `LeetCode 1959 <https://leetcode.com/problems/minimum-total-space-wasted-with-k-resizing-operations/>`_
:重点: 数组划分为至多 ``k + 1`` 段，每段容量取该段最大需求

题目重述
--------

内存按时间顺序满足 ``nums[i]`` 的需求，初始可设容量并最多调整 ``k`` 次。每个时刻浪费量为容量减需求，容量不能小于需求。返回最小总浪费。

自建示例
--------

.. code-block:: text

   输入：nums = [10,20,15], k = 1
   输出：5
   解释：第一段只服务 10，第二段容量 20 服务 20、15，浪费 5。

.. code-block:: text

   输入：nums = [4,2], k = 1
   输出：0
   解释：可为两个时刻分别设置容量 4 和 2。
