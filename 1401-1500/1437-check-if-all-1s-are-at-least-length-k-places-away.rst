1437. Check If All 1's Are at Least Length K Places Away
========================================================

题目信息
--------

:题号: 1437
:难度: Easy
:主题: 数组、间距检查
:原题: `LeetCode 1437 <https://leetcode.com/problems/check-if-all-1s-are-at-least-length-k-places-away/>`_
:重点: 任意相邻两个值为 ``1`` 的位置之间至少需要有 ``k`` 个零

题目重述
--------

给定二进制数组 ``nums`` 和非负整数 ``k``。检查数组中任意两个相邻出现的 ``1`` 之间，是否都至少隔着 ``k`` 个位置。

若全部满足返回 ``true``；只要存在一对 ``1`` 的下标差不大于 ``k``，返回 ``false``。

``1 <= nums.length <= 10^5``，``nums[i]`` 为 ``0`` 或 ``1``，``0 <= k <= nums.length``。

自建示例
--------

恰好隔着 ``k`` 个零时满足条件：

.. code-block:: text

   输入：nums = [1,0,0,1], k = 2
   输出：true
   解释：两个 1 之间恰好有两个零。

间隔不足时返回假：

.. code-block:: text

   输入：nums = [1,0,1], k = 2
   输出：false
   解释：两个 1 之间只有一个零。