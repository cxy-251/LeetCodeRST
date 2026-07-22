0041. First Missing Positive
============================

题目信息
--------

:题号: 0041
:题名: First Missing Positive
:难度: Hard
:类型: Algorithms
:主题: 数组、原地哈希、循环置换、鸽巢原理
:原题: `LeetCode 0041 <https://leetcode.com/problems/first-missing-positive/>`_
:教学重点: 答案范围、值到槽位映射、重复值停止条件、交换摊还分析

题目重述
--------

给定未排序整数数组，返回没有出现的最小正整数。数组包含负数、零、重复值和大整数；要求 ``O(n)`` 时间、``O(1)`` 额外空间，允许原地修改输入。

自建示例
--------

.. code-block:: text

   [3, 4, -1, 1] -> 2
   [1, 2, 3] -> 4
   [1, 1, 2] -> 3

第一组中只有 ``1``、``3``、``4`` 会影响答案；第二组包含 ``1..n``，所以答案是 ``n+1``；第三组说明重复值必须阻止无意义循环交换。

C++ 实现
--------

.. code-block:: cpp

   #include <algorithm>
   #include <unordered_set>
   #include <vector>

   class Solution {
   private:
       int sortAndScan(std::vector<int> nums) {
           std::sort(nums.begin(), nums.end());
           int expected = 1;
           for (int value : nums) {
               if (value == expected) ++expected;
               else if (value > expected) break;
           }
           return expected;
       }

       int hashSet(const std::vector<int>& nums) {
           std::unordered_set<int> seen(nums.begin(), nums.end());
           for (int value = 1;; ++value) {
               if (!seen.count(value)) return value;
           }
       }

       int cyclicPlacement(std::vector<int>& nums) {
           const int n = static_cast<int>(nums.size());
           for (int i = 0; i < n; ++i) {
               while (nums[i] >= 1 && nums[i] <= n &&
                      nums[nums[i] - 1] != nums[i]) {
                   std::swap(nums[i], nums[nums[i] - 1]);
               }
           }
           for (int i = 0; i < n; ++i) {
               if (nums[i] != i + 1) return i + 1;
           }
           return n + 1;
       }

   public:
       int firstMissingPositive(std::vector<int>& nums) {
           return cyclicPlacement(nums);
       }
   };

题解
----

为什么答案只可能在 1 到 n+1
~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

长度为 ``n`` 的数组最多容纳 ``n`` 个不同正整数。若 ``1..n`` 中有缺口，最小缺失值位于该范围；若它们全部存在，答案只能是 ``n+1``。因此非正数和大于 ``n`` 的值都不需要建立槽位。

数组如何充当哈希表
~~~~~~~~~~~~~~~~~~

把值 ``x`` 映射到下标 ``x-1``。最终若某个有效值出现，就尽量把它送到自己的槽位：1 放在 0，2 放在 1，依此类推。完成后从左到右第一处 ``nums[i] != i+1`` 就表示值 ``i+1`` 未出现。

为什么一个位置要使用 while
~~~~~~~~~~~~~~~~~~~~~~~~~~

一次交换会把当前位置的新值带回来。这个新值也可能属于 ``1..n`` 且仍未就位，所以必须继续处理，直到当前位置为无效值、已经正确，或目标槽位已有相同值。

重复值为何必须停止交换
~~~~~~~~~~~~~~~~~~~~~~

若 ``nums[i] == nums[nums[i]-1]``，目标槽位已经保存同值。继续交换不会改变数组，会形成死循环。该条件同时表达“这个值已经被记录”，多余副本无需再移动。

状态演化
~~~~~~~~

.. list-table::
   :header-rows: 1

   * - 当前数组
     - 当前值
     - 动作
   * - ``[3,4,-1,1]``
     - 3
     - 与槽位 2 交换，得到 ``[-1,4,3,1]``
   * - ``[-1,4,3,1]``
     - 4
     - 与槽位 3 交换，得到 ``[-1,1,3,4]``
   * - ``[-1,1,3,4]``
     - 1
     - 与槽位 0 交换，得到 ``[1,-1,3,4]``
   * - 最终扫描
     - 下标 1 不是值 2
     - 返回 2

为什么总交换次数仍是线性
~~~~~~~~~~~~~~~~~~~~~~~~

每次有效交换至少把一个 ``1..n`` 的值放入最终槽位。一个槽位一旦保存正确值，不会再被不同值合法占据；重复副本又会被停止条件拦截。因此成功交换至多 ``n`` 次，外层扫描和最终扫描也各为 ``O(n)``。

为什么首次错位就是最小缺失值
~~~~~~~~~~~~~~~~~~~~~~~~~~~~

整理结束后，若值 ``x`` 出现，它的目标槽位要么保存 ``x``，要么目标槽位已保存同值。于是扫描到第一处错位 ``i`` 时，所有更小值 ``1..i`` 都已在对应槽位，而 ``i+1`` 没有任何副本能进入槽位 ``i``，它正是最小缺失正整数。若无错位，``1..n`` 全部存在，返回 ``n+1``。

复杂度来源
~~~~~~~~~~

排序方法为 ``O(n log n)``；哈希集合为 ``O(n)`` 时间和 ``O(n)`` 空间；循环置换为 ``O(n)`` 时间、``O(1)`` 额外空间。

九语言实现
----------

C
~

.. code-block:: c

   int firstMissingPositive(int *nums, int n) {
       for (int i = 0; i < n; ++i) {
           while (nums[i] >= 1 && nums[i] <= n &&
                  nums[nums[i] - 1] != nums[i]) {
               int target = nums[i] - 1;
               int temporary = nums[i];
               nums[i] = nums[target];
               nums[target] = temporary;
           }
       }
       for (int i = 0; i < n; ++i) if (nums[i] != i + 1) return i + 1;
       return n + 1;
   }

Python
~~~~~~

.. code-block:: python

   class Solution:
       def firstMissingPositive(self, nums: list[int]) -> int:
           n = len(nums)
           for i in range(n):
               while 1 <= nums[i] <= n and nums[nums[i] - 1] != nums[i]:
                   target = nums[i] - 1
                   nums[i], nums[target] = nums[target], nums[i]
           for i, value in enumerate(nums):
               if value != i + 1:
                   return i + 1
           return n + 1

Java
~~~~

.. code-block:: java

   class Solution {
       public int firstMissingPositive(int[] nums) {
           int n = nums.length;
           for (int i = 0; i < n; i++) {
               while (nums[i] >= 1 && nums[i] <= n && nums[nums[i] - 1] != nums[i]) {
                   int target = nums[i] - 1;
                   int temp = nums[i]; nums[i] = nums[target]; nums[target] = temp;
               }
           }
           for (int i = 0; i < n; i++) if (nums[i] != i + 1) return i + 1;
           return n + 1;
       }
   }

Rust
~~~~

.. code-block:: rust

   impl Solution {
       pub fn first_missing_positive(mut nums: Vec<i32>) -> i32 {
           let n = nums.len();
           for i in 0..n {
               while nums[i] >= 1 && nums[i] <= n as i32 &&
                     nums[nums[i] as usize - 1] != nums[i] {
                   let target = nums[i] as usize - 1;
                   nums.swap(i, target);
               }
           }
           for i in 0..n { if nums[i] != i as i32 + 1 { return i as i32 + 1; } }
           n as i32 + 1
       }
   }

Go
~~

.. code-block:: go

   func firstMissingPositive(nums []int) int {
       n := len(nums)
       for i := 0; i < n; i++ {
           for nums[i] >= 1 && nums[i] <= n && nums[nums[i]-1] != nums[i] {
               target := nums[i] - 1
               nums[i], nums[target] = nums[target], nums[i]
           }
       }
       for i, value := range nums { if value != i+1 { return i+1 } }
       return n+1
   }

TypeScript
~~~~~~~~~~

.. code-block:: typescript

   function firstMissingPositive(nums: number[]): number {
       const n = nums.length;
       for (let i = 0; i < n; i++) {
           while (nums[i] >= 1 && nums[i] <= n && nums[nums[i] - 1] !== nums[i]) {
               const target = nums[i] - 1;
               [nums[i], nums[target]] = [nums[target], nums[i]];
           }
       }
       for (let i = 0; i < n; i++) if (nums[i] !== i + 1) return i + 1;
       return n + 1;
   }

C#
~~

.. code-block:: csharp

   public class Solution {
       public int FirstMissingPositive(int[] nums) {
           int n = nums.Length;
           for (int i = 0; i < n; ++i) {
               while (nums[i] >= 1 && nums[i] <= n && nums[nums[i] - 1] != nums[i]) {
                   int target = nums[i] - 1;
                   (nums[i], nums[target]) = (nums[target], nums[i]);
               }
           }
           for (int i = 0; i < n; ++i) if (nums[i] != i + 1) return i + 1;
           return n + 1;
       }
   }

Julia
~~~~~

.. code-block:: julia

   function first_missing_positive!(nums::Vector{Int})::Int
       n = length(nums)
       for i in eachindex(nums)
           while 1 <= nums[i] <= n && nums[nums[i]] != nums[i]
               target = nums[i]
               nums[i], nums[target] = nums[target], nums[i]
           end
       end
       for i in eachindex(nums)
           nums[i] != i && return i
       end
       n + 1
   end

R
~

.. code-block:: r

   first_missing_positive <- function(nums) {
     n <- length(nums)
     if (n > 0L) for (i in seq_len(n)) {
       while (nums[[i]] >= 1L && nums[[i]] <= n && nums[[nums[[i]]]] != nums[[i]]) {
         target <- nums[[i]]
         temporary <- nums[[i]]
         nums[[i]] <- nums[[target]]
         nums[[target]] <- temporary
       }
     }
     if (n > 0L) for (i in seq_len(n)) if (nums[[i]] != i) return(i)
     n + 1L
   }