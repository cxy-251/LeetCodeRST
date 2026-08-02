0525. Contiguous Array
======================

题目信息
--------

:题号: 0525
:难度: Medium
:主题: 二进制数组、连续子数组、零一等量、最大长度
:原题: `LeetCode 0525 <https://leetcode.com/problems/contiguous-array/>`_
:重点: 子数组必须连续、0 和 1 的数量必须完全相等、返回最大长度而不是区间本身

题目重述
--------

给定一个只包含 ``0`` 和 ``1`` 的数组 ``nums``，寻找其中最长的连续子数组，使该子数组内 ``0`` 的数量与 ``1`` 的数量相等，并返回其长度。

若不存在非空的合格子数组，返回 ``0``。相同数量要求子数组长度必为偶数；不能跳过中间元素，也不需要返回具体起止下标。

自建示例
--------

存在多个同长度最长区间：

.. code-block:: text

   输入：nums = [0,1,1,0,1,0,0]
   输出：6
   解释：下标 0..5 和 1..6 的连续子数组都各含 3 个 0 与 3 个 1，长度为 6。

没有等量区间：

.. code-block:: text

   输入：nums = [1,1,1]
   输出：0
   解释：任意非空连续子数组都不含 0。

把 0 和 1 转为相反的余额
------------------------

扫描数组时把 ``1`` 记为 ``+1``、``0`` 记为 ``-1``。若两个前缀在同一位置得到相同余额，它们之间的区间净余额为 0，意味着其中 0 和 1 数量相等。记录每个余额最早出现的下标，重复时用当前位置减最早位置更新最大长度。

前缀余额 0 的初始位置设为 ``-1``，保证从数组开头开始的合法区间也能计入。

C++ 实现
--------

.. code-block:: cpp

   class Solution {
   public:
       int findMaxLength(std::vector<int>& nums) {
           std::unordered_map<int, int> first;
           first[0] = -1;
           int balance = 0;
           int answer = 0;
           for (int i = 0; i < static_cast<int>(nums.size()); ++i) {
               balance += nums[i] == 1 ? 1 : -1;
               auto it = first.find(balance);
               if (it == first.end()) {
                   first[balance] = i;
               } else {
                   answer = std::max(answer, i - it->second);
               }
           }
           return answer;
       }
   };

代码分析
--------

相同余额的两个前缀之间恰好抵消了 0 和 1 的贡献，最早位置策略使同一终点得到最长区间。时间复杂度为 ``O(n)`` 平均，额外空间复杂度为 ``O(n)``。
