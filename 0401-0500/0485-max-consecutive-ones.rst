0485. Max Consecutive Ones
==========================

题目信息
--------

:题号: 0485
:难度: Easy
:主题: 二进制数组、连续子数组、全为 1、最大长度
:原题: `LeetCode 0485 <https://leetcode.com/problems/max-consecutive-ones/>`_
:重点: 只统计连续的 1、遇到 0 时当前长度中断、返回最长连续段长度

题目重述
--------

给定只包含 0 和 1 的整数数组 ``nums``，返回其中由连续字符 1 组成的最长子数组长度。

``nums.length`` 位于 ``[1, 10^5]``。不能跳过中间的 0 来连接两段 1；若数组中没有 1，结果为 0。函数只返回长度，不需要返回区间位置。

自建示例
--------

存在多段连续 1：

.. code-block:: text

   输入：nums = [1,1,0,1,1,1,0,1]
   输出：3
   解释：三段 1 的长度分别为 2、3、1，最大值为 3。

全部为零：

.. code-block:: text

   输入：nums = [0,0,0]
   输出：0
   解释：不存在包含 1 的连续子数组。

遇到零就重置连续长度
--------------------

扫描数组时，当前元素为 1 就把连续长度加一，并更新最大值；当前元素为 0 则切断连续段，把当前长度归零。这样只维护以当前位置结尾的连续 1 长度，不会跨过中间的零连接两段。

C++ 实现
--------

.. code-block:: cpp

   class Solution {
   public:
       int findMaxConsecutiveOnes(std::vector<int>& nums) {
           int current = 0;
           int answer = 0;
           for (int value : nums) {
               if (value == 1) {
                   ++current;
                   answer = std::max(answer, current);
               } else {
                   current = 0;
               }
           }
           return answer;
       }
   };

代码分析
--------

``current`` 始终表示当前连续段长度，零是唯一的分隔事件；每个元素只访问一次，时间复杂度为 ``O(n)``，额外空间复杂度为 ``O(1)``。
