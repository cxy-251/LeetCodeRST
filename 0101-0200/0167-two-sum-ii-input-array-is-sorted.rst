0167. Two Sum II - Input Array Is Sorted
========================================

题目信息
--------

:题号: 0167
:难度: Medium
:主题: 数组、双指针、二分查找
:原题: `LeetCode 0167 <https://leetcode.com/problems/two-sum-ii-input-array-is-sorted/>`_
:重点: 有序和单调性、左右排除、返回一基下标

题目重述
--------

给定按非递减顺序排列的整数数组 ``numbers`` 和整数 ``target``，找出两个不同位置，使对应元素之和等于目标值。返回这两个位置的一基下标 ``[index1, index2]``，其中 ``index1 < index2``。题目保证恰好存在一个答案，且不能重复使用同一个元素；算法只能使用常数额外空间。

自建示例
--------

.. code-block:: text

   numbers = [2,7,11,15], target = 9
   输出：[1,2]，因为 2 + 7 = 9。

   numbers = [-4,-1,0,3,10], target = 2
   输出：[2,4]，因为 -1 + 3 = 2。

   numbers = [1,2,3,4,4,9], target = 8
   输出：[4,5]，两个 4 来自不同位置。

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
