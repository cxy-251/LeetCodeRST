0398. Random Pick Index
=======================

题目信息
--------

:题号: 0398
:难度: Medium
:主题: 固定数组、重复值、随机下标、等概率
:原题: `LeetCode 0398 <https://leetcode.com/problems/random-pick-index/>`_
:重点: 返回的是下标而不是值、目标保证存在、同值的所有下标概率相同、对象跨调用使用构造数组

题目重述
--------

使用可能包含重复值的整数数组 ``nums`` 构造对象，并实现 ``pick(target)``。每次调用时，随机返回一个满足 ``nums[index] == target`` 的零基下标。

``target`` 保证至少在数组中出现一次。若它对应多个下标，每个符合条件的下标被返回的概率必须相同，而不是按不同数值等概率选择。数组长度位于 ``[1, 2 * 10^4]``，元素位于 32 位有符号整数范围内，``pick`` 的调用次数不超过 ``10^4``；构造后的数组内容在对象调用期间保持不变。

自建示例
--------

目标出现三次：

.. code-block:: text

   输入数组：nums = [4,1,4,2,4]
   调用：pick(4)
   输出：0、2 或 4
   解释：三个合法下标应各有 1/3 概率被返回。

目标只有一个位置：

.. code-block:: text

   输入数组：nums = [4,1,4,2,4]
   调用：pick(2)
   输出：3
   解释：值 2 只出现在下标 3，因此每次调用都必须返回 3。

把目标值的所有下标预先分组
----------------------------

构造时建立“值到下标数组”的映射。调用 ``pick(target)`` 时，目标对应的每个下标在同一个连续数组中，随机选择其位置即可保证下标等概率；不需要按值抽样，因为题目要求的是目标值对应的实例位置。

C++ 实现
--------

.. code-block:: cpp

   class Solution {
       std::unordered_map<int, std::vector<int>> positions;
       std::mt19937 generator{std::random_device{}()};

   public:
       Solution(std::vector<int>& nums) {
           for (int i = 0; i < static_cast<int>(nums.size()); ++i) {
               positions[nums[i]].push_back(i);
           }
       }

       int pick(int target) {
           const auto& candidates = positions[target];
           std::uniform_int_distribution<int> distribution(
               0, static_cast<int>(candidates.size()) - 1);
           return candidates[distribution(generator)];
       }
   };

代码分析
--------

构造阶段每个数组位置只加入一次，之后随机范围正好覆盖所有合法下标；目标保证存在，所以候选数组非空。构造时间为 ``O(n)``，每次 ``pick`` 平均为 ``O(1)``，额外空间为 ``O(n)``。
