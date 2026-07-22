0169. Majority Element
======================

题目信息
--------

:题号: 0169
:难度: Easy
:主题: 数组、计数、Boyer-Moore 投票
:原题: `LeetCode 0169 <https://leetcode.com/problems/majority-element/>`_
:教学重点: 候选抵消、严格多数保证、可选二次验证

题目重述
--------

找出出现次数超过数组长度一半的元素。

自建示例
--------

.. code-block:: text

   [2,2,1,1,1,2,2] -> 2

C++ 实现
--------

.. code-block:: cpp

   #include <algorithm>
   #include <unordered_map>
   #include <vector>

   class Solution {
   private:
       int sorting(std::vector<int> nums) {
           std::sort(nums.begin(), nums.end());
           return nums[nums.size() / 2];
       }

       int counting(const std::vector<int>& nums) {
           std::unordered_map<int, int> count;
           for (int value : nums)
               if (++count[value] > static_cast<int>(nums.size()) / 2) return value;
           return 0;
       }

       int boyerMoore(const std::vector<int>& nums) {
           int candidate = 0;
           int balance = 0;
           for (int value : nums) {
               if (balance == 0) candidate = value;
               balance += value == candidate ? 1 : -1;
           }
           return candidate;
       }

   public:
       int majorityElement(std::vector<int>& nums) {
           return boyerMoore(nums);
       }
   };

题解
----

抵消过程保存什么
~~~~~~~~

``balance`` 表示当前候选在已处理前缀中抵消其他值后的净票数。不同值可以成对删除而不改变严格多数元素。

候选为何最终正确
~~~~~~~~

严格多数出现次数超过其余所有元素总数，任意成对抵消后它不可能被完全删除。题目保证多数存在，因此无需第二次验证。

复杂度来源
~~~~~

单次扫描时间 ``O(n)``，只使用候选和值差两个标量，空间 ``O(1)``。
