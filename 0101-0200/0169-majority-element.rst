0169. Majority Element
======================

题目信息
--------

:题号: 0169
:难度: Easy
:主题: 数组、计数、Boyer-Moore 投票
:原题: `LeetCode 0169 <https://leetcode.com/problems/majority-element/>`_
:重点: 严格超过半数、多数元素保证存在、单一返回值

题目重述
--------

给定整数数组 ``nums``，返回其中的多数元素。多数元素是指在长度为 ``n`` 的数组中出现次数严格大于 ``floor(n / 2)`` 的值；题目保证这样的元素一定存在，因此无需处理无解或并列情况。

``nums`` 的长度在 ``1..5 * 10^4`` 范围内，每个元素在 ``-10^9..10^9`` 范围内。进阶目标是在线性时间内完成并只使用常数级额外空间。

自建示例
--------

.. code-block:: text

   输入：nums = [4,1,4,2,4]
   输出：4
   解释：4 出现 3 次，严格大于 floor(5 / 2) = 2。

.. code-block:: text

   输入：nums = [7]
   输出：7
   解释：长度为 1 时，唯一元素出现 1 次，严格大于 floor(1 / 2) = 0。

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
~~~~~~~~~~~~~~~~

``balance`` 表示当前候选在已处理前缀中抵消其他值后的净票数。不同值可以成对删除而不改变严格多数元素。

候选为何最终正确
~~~~~~~~~~~~~~~~

严格多数出现次数超过其余所有元素总数，任意成对抵消后它不可能被完全删除。题目保证多数存在，因此无需第二次验证。

复杂度来源
~~~~~~~~~~

单次扫描时间 ``O(n)``，只使用候选和值差两个标量，空间 ``O(1)``。