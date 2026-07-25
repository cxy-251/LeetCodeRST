1477. Find Two Non-overlapping Sub-arrays Each With Target Sum
==============================================================

题目信息
--------

:题号: 1477
:难度: Medium
:主题: 数组、滑动窗口、动态规划
:原题: `LeetCode 1477 <https://leetcode.com/problems/find-two-non-overlapping-sub-arrays-each-with-target-sum/>`_
:重点: 选择两个互不重叠的连续非空子数组，二者元素和都等于 ``target``；最小化长度之和，无解返回 ``-1``

题目重述
--------

给定正整数数组 ``arr`` 和正整数 ``target``。寻找两个连续非空子数组，使它们互不重叠，并且各自元素和都恰好等于 ``target``。

请返回两个子数组长度之和的最小值；若不存在这样的两个子数组，返回 ``-1``。

``1 <= arr.length <= 10^5``，``1 <= arr[i], target <= 10^8``。

自建示例
--------

相邻的两个目标区间可以共同使用：

.. code-block:: text

   输入：arr = [1,1,1,1], target = 2
   输出：4
   解释：选择下标区间 [0,1] 和 [2,3]，两段和都为 2，总长度为 4。

所有目标区间互相重叠时无解：

.. code-block:: text

   输入：arr = [1,2,1], target = 3
   输出：-1
   解释：两个和为 3 的子数组分别是 [1,2] 和 [2,1]，它们共享中间元素。