0493. Reverse Pairs
===================

题目信息
--------

:题号: 0493
:难度: Hard
:主题: 下标对、严格两倍关系、负数、数量统计
:原题: `LeetCode 0493 <https://leetcode.com/problems/reverse-pairs/>`_
:重点: 必须满足 ``i < j``、条件是 ``nums[i] > 2 * nums[j]``、严格大于、乘二比较可能超出 32 位

题目重述
--------

给定整数数组 ``nums``，统计重要逆序对的数量。重要逆序对是满足以下两个条件的下标对 ``(i, j)``：

.. code-block:: text

   i < j
   nums[i] > 2 * nums[j]

``nums.length`` 位于 ``[1, 5 * 10^4]``，元素在 32 位有符号整数范围内。不同下标对分别计数；比较是严格大于，等于两倍时不算。输入可能含负数，计算 ``2 * nums[j]`` 时不能因 32 位溢出改变比较结果。

自建示例
--------

一个前项与两个后项配对：

.. code-block:: text

   输入：nums = [5,1,2]
   输出：2
   解释：下标对 (0,1) 满足 5 > 2×1，(0,2) 满足 5 > 2×2；其余下标对不满足。

负数也可能形成重要逆序对：

.. code-block:: text

   输入：nums = [-5,-5]
   输出：1
   解释：唯一的下标对满足 -5 > 2×(-5) = -10，因此应计数。

归并排序中跨左右半段计数
------------------------

归并排序把数组分成两个已排序半段。统计跨越中点的逆序对时，对每个左半段元素 ``nums[i]``，用右半段指针找出所有满足 ``nums[i] > 2 * nums[j]`` 的位置；左右半段都已排序，所以右指针只向前移动，不需要为每个 ``i`` 重新扫描。

比较 ``2 * nums[j]`` 时显式提升到 ``long long``，避免负数和 32 位边界造成溢出。统计完成后再按普通归并合并两半，供上层继续使用。

C++ 实现
--------

.. code-block:: cpp

   class Solution {
       long long mergeSort(std::vector<int>& nums, int left, int right,
                           std::vector<int>& buffer) {
           if (left >= right) return 0;
           int middle = left + (right - left) / 2;
           long long answer = mergeSort(nums, left, middle, buffer) +
                              mergeSort(nums, middle + 1, right, buffer);

           int j = middle + 1;
           for (int i = left; i <= middle; ++i) {
               while (j <= right &&
                      static_cast<long long>(nums[i]) >
                          2LL * nums[j]) {
                   ++j;
               }
               answer += j - (middle + 1);
           }

           int i = left;
           j = middle + 1;
           int write = left;
           while (i <= middle && j <= right) {
               if (nums[i] <= nums[j]) {
                   buffer[write++] = nums[i++];
               } else {
                   buffer[write++] = nums[j++];
               }
           }
           while (i <= middle) buffer[write++] = nums[i++];
           while (j <= right) buffer[write++] = nums[j++];
           for (int index = left; index <= right; ++index) {
               nums[index] = buffer[index];
           }
           return answer;
       }

   public:
       int reversePairs(std::vector<int>& nums) {
           if (nums.empty()) return 0;
           std::vector<int> buffer(nums.size());
           return static_cast<int>(mergeSort(
               nums, 0, static_cast<int>(nums.size()) - 1, buffer));
       }
   };

代码分析
--------

右指针单调前进的前提是左右半段已经分别有序；合并时恢复整体有序，递归层层保持这个前提。每层合并和计数均为线性，时间复杂度为 ``O(n log n)``，辅助数组和递归栈空间为 ``O(n)``。
