1942. The Number of the Smallest Unoccupied Chair
================================================

题目信息
--------

:题号: 1942
:难度: Medium
:主题: 优先队列、模拟
:原题: `LeetCode 1942 <https://leetcode.com/problems/the-number-of-the-smallest-unoccupied-chair/>`_
:重点: 朋友到达时总坐编号最小的空闲椅子，离开时立即释放

题目重述
--------

每位朋友有到达和离开时间。到达时选择编号最小的空闲椅子，离开时释放。返回目标朋友所坐椅子的编号。

自建示例
--------

.. code-block:: text

   输入：times = [[1,4],[2,3],[4,6]], targetFriend = 2
   输出：0
   解释：时间 4 时前两把椅子都已释放，目标朋友选择编号 0。

.. code-block:: text

   输入：times = [[1,5],[2,3]], targetFriend = 1
   输出：1
   解释：目标朋友到达时椅子 0 仍被占用。
