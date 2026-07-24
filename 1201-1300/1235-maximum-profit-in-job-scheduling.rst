1235. Maximum Profit in Job Scheduling
======================================

题目信息
--------

:题号: 1235
:难度: Hard
:主题: 区间调度、动态规划、二分查找
:原题: `LeetCode 1235 <https://leetcode.com/problems/maximum-profit-in-job-scheduling/>`_
:重点: 选择若干互不重叠的工作最大化利润；前一工作结束时间等于后一工作开始时间时允许同时选择

题目重述
--------

给定三个等长数组 ``startTime``、``endTime`` 和 ``profit``，第 ``i`` 份工作在 ``startTime[i]`` 开始、``endTime[i]`` 结束，完成可获得 ``profit[i]``。

选择任意数量的工作，但任意两份被选工作不能在时间上重叠。若一份工作恰好在另一份结束时开始，二者可以同时选择。请返回能够获得的最大总利润。

``1 <= startTime.length == endTime.length == profit.length <= 5 * 10^4``，所有时间和利润均为正整数，且每份工作的开始时间严格小于结束时间。

自建示例
--------

结束时间与下一份开始时间相同时可以衔接：

.. code-block:: text

   输入：startTime = [1,3,4,6], endTime = [3,5,6,8], profit = [20,40,30,50]
   输出：110
   解释：选择区间 [1,3]、[3,5] 和 [6,8]，总利润为 20 + 40 + 50 = 110。

全部工作互相重叠时选择利润最高者：

.. code-block:: text

   输入：startTime = [1,2], endTime = [4,3], profit = [50,40]
   输出：50
   解释：两份工作时间重叠，不能同时选择，第一份利润更高。