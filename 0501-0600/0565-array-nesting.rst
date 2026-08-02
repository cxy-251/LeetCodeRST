0565. Array Nesting
===================

题目信息
--------

:题号: 0565
:难度: Medium
:主题: 排列数组、下标跳转、循环集合、最大长度
:原题: `LeetCode 0565 <https://leetcode.com/problems/array-nesting/>`_
:重点: nums 是 0..n-1 的排列、从 k 开始反复跳到 nums[当前值]、遇到重复即停止、返回最大集合大小

题目重述
--------

给定长度为 ``n`` 的整数数组 ``nums``，其中每个整数 ``0`` 到 ``n-1`` 恰好出现一次。对任意起始下标 ``k``，依次取 ``nums[k]``、``nums[nums[k]]``、``nums[nums[nums[k]]]``，直到某个值首次重复，所得不同值构成集合 ``S[k]``。

返回所有起点 ``k`` 对应集合大小的最大值。由于 ``nums`` 是一个排列，每次取出的值都可继续作为合法下标，序列最终一定进入一个循环。

自建示例
--------

存在两个长度相同的循环：

.. code-block:: text

   输入：nums = [1,2,0,4,5,3]
   输出：3
   解释：从 0 出发得到 1、2、0，集合大小为 3；从 3 出发得到 4、5、3，大小也为 3。

包含固定点：

.. code-block:: text

   输入：nums = [0,2,1,3]
   输出：2
   解释：下标 0 和 3 各自形成长度 1 的循环，下标 1 与 2 形成长度 2 的循环。

排列函数的每个环只需遍历一次
----------------------------

由于 ``nums`` 是排列，映射 ``i -> nums[i]`` 把所有下标分成互不相交的环。从任一未访问起点沿映射前进，直到回到已访问位置，得到的长度就是该环中所有起点的集合大小；把环内节点全部标记后，其他起点不会产生新的长度。

C++ 实现
--------

.. code-block:: cpp

   class Solution {
   public:
       int arrayNesting(std::vector<int>& nums) {
           int answer = 0;
           std::vector<bool> visited(nums.size(), false);
           for (int start = 0; start < static_cast<int>(nums.size()); ++start) {
               if (visited[start]) continue;
               int current = start;
               int length = 0;
               while (!visited[current]) {
                   visited[current] = true;
                   current = nums[current];
                   ++length;
               }
               answer = std::max(answer, length);
           }
           return answer;
       }
   };

代码分析
--------

排列保证跳转永远在合法下标且最终回到本环，访问标记保证每个下标只走一次；所有环互不相交，所以最大环长就是答案。时间复杂度为 ``O(n)``，额外空间复杂度为 ``O(n)``。
