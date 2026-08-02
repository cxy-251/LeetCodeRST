0495. Teemo Attacking
=====================

题目信息
--------

:题号: 0495
:难度: Easy
:主题: 攻击时间、中毒区间、持续时间刷新、总时长
:原题: `LeetCode 0495 <https://leetcode.com/problems/teemo-attacking/>`_
:重点: 每次攻击从该秒开始持续 ``duration`` 秒、重叠时间不能重复计数、新攻击会延长或刷新中毒结束时间

题目重述
--------

数组 ``timeSeries`` 按严格递增顺序记录提莫发动攻击的时间。每次攻击会让目标从当前时刻开始中毒 ``duration`` 秒，也就是覆盖离散时间区间 ``[t, t + duration - 1]``。

若下一次攻击发生时目标仍在中毒，新效果与原效果重叠，重叠秒数只能计入一次，同时中毒结束时间按新攻击重新延后。返回目标处于中毒状态的总秒数。

``timeSeries.length`` 位于 ``[1, 10^4]``，攻击时间位于 ``[0, 10^7]``，``duration`` 位于 ``[1, 10^7]``。结果等于所有中毒时间区间并集的长度。

自建示例
--------

前两次攻击重叠，最后一次分离：

.. code-block:: text

   输入：timeSeries = [1,3,10]，duration = 4
   输出：10
   解释：前三个中毒区间为 [1,4]、[3,6]、[10,13]；前两个合并为 1..6 共 6 秒，最后一个贡献 4 秒，总计 10 秒。

每次攻击恰好无重叠：

.. code-block:: text

   输入：timeSeries = [0,2,4]，duration = 2
   输出：6
   解释：区间分别为 [0,1]、[2,3]、[4,5]，相邻但不重叠，总长度为 6。

相邻攻击的新增贡献取间隔与持续时间的较小值
----------------------------------------------

第一击一定贡献 ``duration`` 秒。对于相邻攻击时间差 ``gap``：若 ``gap >= duration``，前一次中毒已经结束，新攻击再贡献完整的 ``duration``；若 ``gap < duration``，前一次效果只覆盖到下一击前，新增贡献只有 ``gap`` 秒。因此每次新增长度是 ``min(duration, gap)``。

按题意区间是离散的 ``[t, t + duration - 1]``，所以相差 ``duration`` 时恰好不重叠，不能写成小于等于的重叠判断。

C++ 实现
--------

.. code-block:: cpp

   class Solution {
   public:
       int findPoisonedDuration(std::vector<int>& timeSeries,
                                int duration) {
           long long total = duration;
           for (int i = 1; i < static_cast<int>(timeSeries.size()); ++i) {
               long long gap = static_cast<long long>(timeSeries[i]) -
                                timeSeries[i - 1];
               total += std::min<long long>(duration, gap);
           }
           return static_cast<int>(total);
       }
   };

代码分析
--------

只保留相邻攻击的时间差即可计算区间并集长度；时间序列已经严格递增，不需要排序或维护全部区间。遍历一次得到 ``O(n)`` 时间和 ``O(1)`` 额外空间，累计值用 ``long long`` 防止中间加法溢出。
