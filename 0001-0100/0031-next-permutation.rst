0031. Next Permutation
======================

题目信息
--------

:题号: 0031
:难度: Medium
:主题: 数组、字典序、排列、原地反转
:原题: `LeetCode 0031 <https://leetcode.com/problems/next-permutation/>`_
:重点: 最长非递增后缀、枢轴、最小更大后继、后缀最小化、原地修改

题目重述
--------

给定整数数组 ``nums``，把它原地改成字典序中的下一个排列。若当前排列已经最大，则回绕到最小排列，也就是整体升序。要求只使用常数额外空间。

自建示例
--------

.. code-block:: text

   [1, 3, 5, 4, 2] -> [1, 4, 2, 3, 5]
   最长非递增后缀是 [5,4,2]，枢轴是 3，后缀中最小的更大值是 4。

.. code-block:: text

   [2, 2, 1] -> [1, 2, 2]
   整体非递增，说明已经是最大排列，反转后得到最小排列。

C++ 实现
--------

.. code-block:: cpp

   #include <algorithm>
   #include <vector>

   class Solution {
   private:
       std::vector<int> enumerateAll(const std::vector<int>& input) {
           std::vector<int> current = input;
           std::sort(current.begin(), current.end());
           std::vector<std::vector<int>> all;
           do {
               all.push_back(current);
           } while (std::next_permutation(current.begin(), current.end()));
           for (int i = 0; i < static_cast<int>(all.size()); ++i) {
               if (all[i] == input) return all[(i + 1) % all.size()];
           }
           return input;
       }

       void libraryVersion(std::vector<int>& nums) {
           std::next_permutation(nums.begin(), nums.end());
       }

       void linearSuffix(std::vector<int>& nums) {
           int pivot = static_cast<int>(nums.size()) - 2;
           while (pivot >= 0 && nums[pivot] >= nums[pivot + 1]) --pivot;

           if (pivot >= 0) {
               int successor = static_cast<int>(nums.size()) - 1;
               while (nums[successor] <= nums[pivot]) --successor;
               std::swap(nums[pivot], nums[successor]);
           }

           std::reverse(nums.begin() + pivot + 1, nums.end());
       }

   public:
       void nextPermutation(std::vector<int>& nums) {
           linearSuffix(nums);
       }
   };

题解
----

从全排列枚举到局部字典序结构
~~~~~~~~~~~~~~~~~~~~~~~~~~~~

枚举全部排列再排序需要处理最多 ``n!`` 个序列，而且相邻排列之间只发生局部变化。真正需要利用的是字典序定义：为了得到“刚好更大”的结果，应尽量保留更长的左侧前缀，只在最靠右的可增加位置发生最小幅度变化。

最长非递增后缀为什么已经最大
~~~~~~~~~~~~~~~~~~~~~~~~~~~~

从右向左寻找第一个 ``nums[i] < nums[i+1]``。其右侧后缀必然非递增。对固定的左侧前缀而言，非递增顺序是该后缀元素能够形成的最大排列，因此只重新排列后缀不可能得到更大结果，必须增加位置 ``i``。这个最右侧可增加位置就是枢轴。

后继为什么取最右侧严格更大值
~~~~~~~~~~~~~~~~~~~~~~~~~~~~

后缀非递增，从右向左第一个严格大于枢轴值的元素，就是后缀中最小的更大候选。交换相等值不会增大排列；选择更大的候选会跳过更近的排列。

交换后为什么反转后缀
~~~~~~~~~~~~~~~~~~~~

枢轴完成最小幅度增加后，固定的新前缀已经确定。为了让整个排列尽可能小，后缀必须采用升序。原后缀非递增，交换枢轴与后继后，剩余后缀仍可通过整体反转得到非递减顺序，因此无需排序。

状态演化
~~~~~~~~

.. list-table::
   :header-rows: 1

   * - 阶段
     - 数组
     - 说明
   * - 初始
     - ``[1,3,5,4,2]``
     - 后缀 ``[5,4,2]`` 非递增
   * - 找枢轴
     - ``pivot = 1``
     - ``3 < 5``，位置 1 是最右可增加位置
   * - 找后继
     - ``successor = 3``
     - 值 4 是后缀中最小的更大值
   * - 交换
     - ``[1,4,5,3,2]``
     - 新前缀完成最小增加
   * - 反转后缀
     - ``[1,4,2,3,5]``
     - 固定前缀下的最小后缀

为什么结果恰好是下一个排列
~~~~~~~~~~~~~~~~~~~~~~~~~~

任何更大的排列都必须在枢轴或更左位置首次变化。修改更左位置一定产生更大的字典序跳跃；在枢轴处选择比当前后继更大的值也会跳过候选。算法选择最右枢轴和最小更大后继，并把剩余后缀降到最小，因此不存在位于当前排列与结果之间的排列。

若找不到枢轴，整个数组非递增，当前排列已经最大；反转为升序得到全局最小排列，符合回绕规则。

复杂度来源
~~~~~~~~~~

三次线性扫描分别寻找枢轴、寻找后继和反转后缀，总时间 ``O(n)``；只使用若干下标，额外空间 ``O(1)``。全排列枚举为阶乘级，仅用于说明原始搜索空间。

九语言实现
----------

C
~

.. code-block:: c

   static void swap_int(int *a, int *b) { int t = *a; *a = *b; *b = t; }
   void nextPermutation(int *nums, int n) {
       int pivot = n - 2;
       while (pivot >= 0 && nums[pivot] >= nums[pivot + 1]) --pivot;
       if (pivot >= 0) {
           int successor = n - 1;
           while (nums[successor] <= nums[pivot]) --successor;
           swap_int(&nums[pivot], &nums[successor]);
       }
       for (int l = pivot + 1, r = n - 1; l < r; ++l, --r) swap_int(&nums[l], &nums[r]);
   }

Python
~~~~~~

.. code-block:: python

   class Solution:
       def nextPermutation(self, nums: list[int]) -> None:
           pivot = len(nums) - 2
           while pivot >= 0 and nums[pivot] >= nums[pivot + 1]:
               pivot -= 1
           if pivot >= 0:
               successor = len(nums) - 1
               while nums[successor] <= nums[pivot]:
                   successor -= 1
               nums[pivot], nums[successor] = nums[successor], nums[pivot]
           nums[pivot + 1:] = reversed(nums[pivot + 1:])

Java
~~~~

.. code-block:: java

   class Solution {
       public void nextPermutation(int[] nums) {
           int pivot = nums.length - 2;
           while (pivot >= 0 && nums[pivot] >= nums[pivot + 1]) pivot--;
           if (pivot >= 0) {
               int successor = nums.length - 1;
               while (nums[successor] <= nums[pivot]) successor--;
               int t = nums[pivot]; nums[pivot] = nums[successor]; nums[successor] = t;
           }
           for (int l = pivot + 1, r = nums.length - 1; l < r; l++, r--) {
               int t = nums[l]; nums[l] = nums[r]; nums[r] = t;
           }
       }
   }

Rust
~~~~

.. code-block:: rust

   impl Solution {
       pub fn next_permutation(nums: &mut Vec<i32>) {
           let mut pivot = nums.len() as isize - 2;
           while pivot >= 0 && nums[pivot as usize] >= nums[pivot as usize + 1] { pivot -= 1; }
           if pivot >= 0 {
               let mut successor = nums.len() - 1;
               while nums[successor] <= nums[pivot as usize] { successor -= 1; }
               nums.swap(pivot as usize, successor);
           }
           nums[(pivot + 1) as usize..].reverse();
       }
   }

Go
~~

.. code-block:: go

   func nextPermutation(nums []int) {
       pivot := len(nums) - 2
       for pivot >= 0 && nums[pivot] >= nums[pivot+1] { pivot-- }
       if pivot >= 0 {
           successor := len(nums) - 1
           for nums[successor] <= nums[pivot] { successor-- }
           nums[pivot], nums[successor] = nums[successor], nums[pivot]
       }
       for l, r := pivot+1, len(nums)-1; l < r; l, r = l+1, r-1 {
           nums[l], nums[r] = nums[r], nums[l]
       }
   }

TypeScript
~~~~~~~~~~

.. code-block:: typescript

   function nextPermutation(nums: number[]): void {
       let pivot = nums.length - 2;
       while (pivot >= 0 && nums[pivot] >= nums[pivot + 1]) pivot--;
       if (pivot >= 0) {
           let successor = nums.length - 1;
           while (nums[successor] <= nums[pivot]) successor--;
           [nums[pivot], nums[successor]] = [nums[successor], nums[pivot]];
       }
       for (let l = pivot + 1, r = nums.length - 1; l < r; l++, r--) {
           [nums[l], nums[r]] = [nums[r], nums[l]];
       }
   }

C#
~~

.. code-block:: csharp

   public class Solution {
       public void NextPermutation(int[] nums) {
           int pivot = nums.Length - 2;
           while (pivot >= 0 && nums[pivot] >= nums[pivot + 1]) pivot--;
           if (pivot >= 0) {
               int successor = nums.Length - 1;
               while (nums[successor] <= nums[pivot]) successor--;
               (nums[pivot], nums[successor]) = (nums[successor], nums[pivot]);
           }
           for (int l = pivot + 1, r = nums.Length - 1; l < r; l++, r--)
               (nums[l], nums[r]) = (nums[r], nums[l]);
       }
   }

Julia
~~~~~

.. code-block:: julia

   function next_permutation!(nums::Vector{Int})
       pivot = length(nums) - 1
       while pivot >= 1 && nums[pivot] >= nums[pivot + 1]
           pivot -= 1
       end
       if pivot >= 1
           successor = length(nums)
           while nums[successor] <= nums[pivot]
               successor -= 1
           end
           nums[pivot], nums[successor] = nums[successor], nums[pivot]
       end
       reverse!(nums, pivot + 1, length(nums))
   end

R
~

.. code-block:: r

   next_permutation <- function(nums) {
     pivot <- length(nums) - 1L
     while (pivot >= 1L && nums[[pivot]] >= nums[[pivot + 1L]]) pivot <- pivot - 1L
     if (pivot >= 1L) {
       successor <- length(nums)
       while (nums[[successor]] <= nums[[pivot]]) successor <- successor - 1L
       temp <- nums[[pivot]]; nums[[pivot]] <- nums[[successor]]; nums[[successor]] <- temp
     }
     if (pivot + 1L < length(nums)) nums[(pivot + 1L):length(nums)] <- rev(nums[(pivot + 1L):length(nums)])
     nums
   }