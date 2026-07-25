1578. Minimum Time to Make Rope Colorful
========================================

题目信息
--------

:题号: 1578
:难度: Medium
:主题: 字符串、贪心、连续段
:原题: `LeetCode 1578 <https://leetcode.com/problems/minimum-time-to-make-rope-colorful/>`_
:重点: 删除若干气球，使相邻气球颜色不同；同色连续段中保留删除耗时最大的一个可最小化成本

题目重述
--------

一条绳子上依次排列若干气球，字符串 ``colors`` 表示颜色，``neededTime[i]`` 表示移除第 ``i`` 个气球所需时间。

可以删除任意气球。请返回使最终相邻气球颜色都不同所需的最小总时间。

``1 <= colors.length == neededTime.length <= 10^5``，``1 <= neededTime[i] <= 10^4``。

自建示例
--------

每个同色连续段只需保留耗时最大的气球：

.. code-block:: text

   输入：colors = "aabaa", neededTime = [1,2,3,4,5]
   输出：5
   解释：开头 aa 删除耗时 1 的气球，末尾 aa 删除耗时 4 的气球，总计 5。

所有相邻颜色不同时成本为零：

.. code-block:: text

   输入：colors = "abc", neededTime = [5,1,4]
   输出：0
   解释：无需删除任何气球。