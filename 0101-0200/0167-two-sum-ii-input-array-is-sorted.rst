0167. Two Sum II - Input Array Is Sorted
========================================

题目信息
--------

:题号: 0167
:难度: Medium
:主题: 数组、双指针、二分查找
:原题: `LeetCode 0167 <https://leetcode.com/problems/two-sum-ii-input-array-is-sorted/>`_
:重点: 非递减数组、两个不同位置、一基下标、唯一答案、常数空间

题目重述
--------

给定按非递减顺序排列的整数数组 ``numbers`` 和整数 ``target``，找出两个不同下标，使对应元素之和恰好等于 ``target``。返回长度为 2 的数组 ``[index1, index2]``，其中下标从 ``1`` 开始并满足 ``index1 < index2``。

题目保证恰好存在一个答案，同一个数组位置不能使用两次，并要求只使用常数级额外空间。``numbers`` 的长度在 ``2..3 * 10^4`` 范围内，数组元素和 ``target`` 均在 ``-1000..1000`` 范围内。

自建示例
--------

.. code-block:: text

   输入：numbers = [-8,-3,1,4,9], target = 6
   输出：[2,5]
   解释：第 2 个元素 -3 与第 5 个元素 9 的和为 6；返回的是一基下标。

.. code-block:: text

   输入：numbers = [1,3,3,6], target = 6
   输出：[2,3]
   解释：两个值为 3 的元素位于不同位置，可以共同组成目标值。

C++ 实现
--------

.. code-block:: cpp

   #include <vector>

   class Solution {
   private:
       std::vector<int> binarySearchEach(const std::vector<int>& numbers, int target) {
           for (int i = 0; i < static_cast<int>(numbers.size()); ++i) {
               int left = i + 1;
               int right = static_cast<int>(numbers.size()) - 1;
               int wanted = target - numbers[i];
               while (left <= right) {
                   int middle = left + (right - left) / 2;
                   if (numbers[middle] == wanted) return {i + 1, middle + 1};
                   if (numbers[middle] < wanted) left = middle + 1;
                   else right = middle - 1;
               }
           }
           return {};
       }

       std::vector<int> twoPointers(const std::vector<int>& numbers, int target) {
           int left = 0;
           int right = static_cast<int>(numbers.size()) - 1;
           while (left < right) {
               long long sum = static_cast<long long>(numbers[left]) + numbers[right];
               if (sum == target) return {left + 1, right + 1};
               if (sum < target) ++left;
               else --right;
           }
           return {};
       }

   public:
       std::vector<int> twoSum(std::vector<int>& numbers, int target) {
           return twoPointers(numbers, target);
       }
   };

题解
----

有序性如何排除一端
~~~~~~~~~~~~~~~~~~

当前和小于目标时，固定右端并继续减小左值只会更小，因此必须右移左指针；和过大时同理左移右指针。

为何不会跳过答案
~~~~~~~~~~~~~~~~

每次丢弃的一端不可能与当前区间内任何另一端组成目标和，合法答案仍留在闭区间中。

复杂度来源
~~~~~~~~~~

双指针各单调移动最多 ``n`` 次，时间 ``O(n)``、空间 ``O(1)``。