0167. Two Sum II - Input Array Is Sorted
========================================

题目信息
--------

:题号: 0167. 两数之和 II - 输入有序数组
:难度: Medium
:主题: 数组、二分查找、双指针
:原题: `LeetCode 0167 <https://leetcode.com/problems/two-sum-ii-input-array-is-sorted/>`_
:重点: 用当前最小值与最大值的和，一次排除以某个端点为成员的全部候选数对

题目重述
--------

给定按非递减顺序排列的整数数组 ``numbers`` 和整数 ``target``，找出两个不同位置，
使其元素之和等于 ``target``。题目保证恰好存在一个答案。

返回 ``[index1, index2]``，下标从 1 开始，并满足 ``index1 < index2``；算法只能使用
常数级额外空间。

自建示例
--------

.. code-block:: text

   输入：numbers = [1,2,4,6,10], target = 8
   输出：[2,4]

   numbers[1] + numbers[3] = 2 + 6 = 8；返回一基下标 [2,4]。

.. code-block:: text

   输入：numbers = [1,3,3,6], target = 6
   输出：[2,3]

   两个值都为 3，但来自两个不同位置。

.. code-block:: text

   输入：numbers = [-8,-3,1,4,9], target = 6
   输出：[2,5]

   排序产生的单调关系对负数同样成立。

C++ 实现
--------

.. code-block:: cpp

   #include <vector>

   class Solution {
   private:
       std::vector<int> binarySearchEachLeft(
           const std::vector<int>& numbers, int target) {
           int size = static_cast<int>(numbers.size());

           for (int first = 0; first < size; ++first) {
               long long wanted =
                   static_cast<long long>(target) - numbers[first];
               int left = first + 1;
               int right = size - 1;

               while (left <= right) {
                   int middle = left + (right - left) / 2;
                   if (numbers[middle] == wanted) {
                       return {first + 1, middle + 1};
                   }
                   if (numbers[middle] < wanted) {
                       left = middle + 1;
                   } else {
                       right = middle - 1;
                   }
               }
           }
           return {};
       }

       std::vector<int> oppositePointers(
           const std::vector<int>& numbers, int target) {
           int left = 0;
           int right = static_cast<int>(numbers.size()) - 1;

           while (left < right) {
               long long sum =
                   static_cast<long long>(numbers[left]) + numbers[right];
               if (sum == target) {
                   return {left + 1, right + 1};
               }
               if (sum < target) {
                   ++left;
               } else {
                   --right;
               }
           }
           return {};
       }

   public:
       std::vector<int> twoSum(
           std::vector<int>& numbers, int target) {
           return oppositePointers(numbers, target);
       }
   };

题解
----

从数对枚举到补数搜索
~~~~~~~~~~~~~~~~~~~~

不利用有序性时，最直接的搜索空间是全部 ``i < j``，共有 ``n(n-1)/2`` 个数对。
固定第一个位置 ``i`` 后，第二个值必须等于 ``target - numbers[i]``，所以问题可以改写为
“在右侧寻找一个确定的补数”。

数组已经有序，``binarySearchEachLeft`` 能为每个 ``i`` 在后缀 ``[i+1,n)`` 中二分
查找补数，将时间从 ``O(n²)`` 降到 ``O(n log n)``。从 ``i+1`` 开始搜索还直接保证
两个位置不同、返回下标有序。

这个方案仍有重复工作：每换一个左位置，都会在大量重叠的后缀上重新二分。排序不仅能
回答“某个补数是否存在”，还允许一次比较排除以一个端点为成员的整组数对。

两端之和提供删除规则
~~~~~~~~~~~~~~~~~~~~

令 ``left``、``right`` 指向尚未排除区间的最小值和最大值。当前和有三种情况：

* 若等于 ``target``，两个位置就是答案；
* 若小于 ``target``，固定当前最小值 ``numbers[left]``，它与区间内任何元素之和都不
  会超过 ``numbers[left] + numbers[right]``，所以全部过小。当前 ``left`` 不可能
  参与答案，可以整体排除；
* 若大于 ``target``，固定当前最大值 ``numbers[right]``，它与区间内任何元素之和都
  不会低于 ``numbers[left] + numbers[right]``，所以全部过大。当前 ``right`` 不可能
  参与答案，可以整体排除。

因此和过小时只移动左指针，和过大时只移动右指针。移动另一端会缺少排除依据，也可能
跳过唯一答案。

区间不变量与正确性
~~~~~~~~~~~~~~~~~~

循环开始时维护不变量：若答案尚未找到，则唯一答案的两个下标都位于闭区间
``[left,right]`` 中。

初始区间包含整个数组，显然成立。当前和过小时，上述论证证明 ``left`` 无法与区间内
任何位置配对，所以删除它不会删除答案；和过大时同理可以安全删除 ``right``。每轮都让
区间缩小一个位置，并保持不变量。

题目保证答案存在，因此在 ``left < right`` 期间必会遇到目标和。条件 ``left < right``
还保证不会把同一位置使用两次；重复数值不受影响，只要它们位于不同下标即可。

具体走读
~~~~~~~~

对 ``numbers = [1,2,4,6,10]``、``target = 8``：

.. code-block:: text

   left  right  端点值   和   结论
   0     4      1,10     11   过大，10 不可能参与，right 左移
   0     3      1,6       7   过小，1 不可能参与，left 右移
   1     3      2,6       8   命中

最终零基下标是 1、3，接口要求一基下标，所以返回 ``[2,4]``。指针只在找到答案时转换
下标，内部推理始终使用 C++ 数组的零基位置。

数值与返回边界
~~~~~~~~~~~~~~

``sum`` 使用 ``long long``，避免两个 ``int`` 相加时先发生溢出；补数基线也在减法前
提升 ``target``。虽然题目保证存在答案，两个辅助方法仍保留空结果作为防御性出口。
主解不修改输入，也不建立哈希表或排序副本，满足常数额外空间要求。

方案选择与复杂度
~~~~~~~~~~~~~~~~

逐左端二分的时间复杂度为 ``O(n log n)``、额外空间为 ``O(1)``，它展示了从补数线性
搜索到有序查找的第一步优化。双指针进一步让两个端点全程单调移动，每个位置最多被排除
一次，时间为 ``O(n)``、额外空间为 ``O(1)``，因此 ``oppositePointers`` 是主解。
