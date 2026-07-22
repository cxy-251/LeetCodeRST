0034. Find First and Last Position of Element in Sorted Array
=============================================================

题目信息
--------

:题号: 0034
:题名: Find First and Last Position of Element in Sorted Array
:难度: Medium
:类型: Algorithms
:主题: 数组、二分查找、边界定位、重复元素
:原题: `LeetCode 0034 <https://leetcode.com/problems/find-first-and-last-position-of-element-in-sorted-array/>`_
:教学重点: lower bound、upper bound、半开区间、存在性验证、重复值边界

题目重述
--------

给定非递减数组 ``nums`` 和目标值 ``target``，返回目标第一次与最后一次出现的零基下标。目标不存在时返回 ``[-1,-1]``，整体时间必须是 ``O(log n)``。

自建示例
--------

.. code-block:: text

   nums = [1,2,2,2,4,7], target = 2
   lower_bound = 1，upper_bound = 4，答案 [1,3]。

.. code-block:: text

   nums = [1,2,4,6], target = 3
   lower_bound = 2，但 nums[2] = 4，因此目标不存在。

C++ 实现
--------

.. code-block:: cpp

   #include <vector>

   class Solution {
   private:
       std::vector<int> linearScan(const std::vector<int>& nums, int target) {
           int first = -1, last = -1;
           for (int i = 0; i < static_cast<int>(nums.size()); ++i) {
               if (nums[i] == target) {
                   if (first == -1) first = i;
                   last = i;
               }
           }
           return {first, last};
       }

       int findAny(const std::vector<int>& nums, int target) {
           int left = 0, right = static_cast<int>(nums.size()) - 1;
           while (left <= right) {
               int mid = left + (right - left) / 2;
               if (nums[mid] == target) return mid;
               if (nums[mid] < target) left = mid + 1;
               else right = mid - 1;
           }
           return -1;
       }

       std::vector<int> binaryThenExpand(const std::vector<int>& nums, int target) {
           int hit = findAny(nums, target);
           if (hit == -1) return {-1, -1};
           int first = hit, last = hit;
           while (first > 0 && nums[first - 1] == target) --first;
           while (last + 1 < static_cast<int>(nums.size()) && nums[last + 1] == target) ++last;
           return {first, last};
       }

       int lowerBound(const std::vector<int>& nums, int target) {
           int left = 0, right = static_cast<int>(nums.size());
           while (left < right) {
               int mid = left + (right - left) / 2;
               if (nums[mid] < target) left = mid + 1;
               else right = mid;
           }
           return left;
       }

       int upperBound(const std::vector<int>& nums, int target) {
           int left = 0, right = static_cast<int>(nums.size());
           while (left < right) {
               int mid = left + (right - left) / 2;
               if (nums[mid] <= target) left = mid + 1;
               else right = mid;
           }
           return left;
       }

       std::vector<int> twoBounds(const std::vector<int>& nums, int target) {
           int first = lowerBound(nums, target);
           if (first == static_cast<int>(nums.size()) || nums[first] != target) return {-1, -1};
           return {first, upperBound(nums, target) - 1};
       }

   public:
       std::vector<int> searchRange(std::vector<int>& nums, int target) {
           return twoBounds(nums, target);
       }
   };

题解
----

任意命中为什么还不够
~~~~~~~~~~~~~~~~~~~~

普通二分只保证找到某一个目标位置。若命中后向左右扩展，在数组全部等于目标时仍要扫描 ``O(n)`` 个元素。要保持对数复杂度，左右边界本身也必须通过二分定位。

边界如何改写成插入位置
~~~~~~~~~~~~~~~~~~~~~~

定义：

* ``lower_bound(target)``：第一个满足 ``nums[i] >= target`` 的位置；
* ``upper_bound(target)``：第一个满足 ``nums[i] > target`` 的位置。

目标存在时，它的所有副本连续排列，因此首位置等于下界，末位置等于上界减一。

半开区间为何允许返回 n
~~~~~~~~~~~~~~~~~~~~~~

两个函数都维护 ``[left,right)``，初始 ``[0,n)``。``right`` 可以等于 ``n``，表示边界位于数组末尾之后。当 ``left == right`` 时，左侧元素均不满足边界条件，当前位置及右侧满足，返回值自然兼容空数组和末尾插入。

相等值在两个边界中如何归类
~~~~~~~~~~~~~~~~~~~~~~~~~~

求下界时，``nums[mid] == target`` 已满足“大于等于”，但可能不是第一个，因此令 ``right = mid``。求上界时，相等值仍属于边界左侧，必须令 ``left = mid + 1``。唯一差异是比较条件 ``<`` 与 ``<=``，它决定相等元素被保留在哪一侧。

状态演化
~~~~~~~~

.. list-table::
   :header-rows: 1

   * - 搜索
     - 条件
     - 左侧已排除元素
     - 右侧保证
   * - lower bound
     - ``nums[mid] < target`` 才右移
     - 全部 ``< target``
     - 全部 ``>= target``
   * - upper bound
     - ``nums[mid] <= target`` 才右移
     - 全部 ``<= target``
     - 全部 ``> target``

为什么还要验证目标存在
~~~~~~~~~~~~~~~~~~~~~~

下界始终返回合法插入位置，即使目标不存在也如此。例如在 ``[1,2,4]`` 中查找 3，下界为 2，但该位置值为 4。因此必须验证 ``first < n`` 且 ``nums[first] == target``；失败时返回 ``[-1,-1]``。

为什么两个边界准确
~~~~~~~~~~~~~~~~~~

下界循环结束时，``first`` 左侧全部小于目标，``first`` 及右侧全部大于等于目标，所以它是第一个可能等于目标的位置。上界左侧全部小于等于目标，右侧全部严格大于目标，所以 ``upper-1`` 是最后一个可能等于目标的位置。目标存在时连续重复段正好夹在这两个边界之间。

复杂度来源
~~~~~~~~~~

两次边界二分各为 ``O(log n)``，总时间仍为 ``O(log n)``，额外空间 ``O(1)``。命中后扩展最坏退化为 ``O(n)``。

九语言实现
----------

C
~

.. code-block:: c

   static int bound(int *nums, int n, int target, int upper) {
       int left = 0, right = n;
       while (left < right) {
           int mid = left + (right - left) / 2;
           if (nums[mid] < target || (upper && nums[mid] == target)) left = mid + 1;
           else right = mid;
       }
       return left;
   }
   int *searchRange(int *nums, int n, int target, int *returnSize) {
       int *answer = malloc(2 * sizeof(int)); *returnSize = 2;
       int first = bound(nums, n, target, 0);
       if (first == n || nums[first] != target) answer[0] = answer[1] = -1;
       else { answer[0] = first; answer[1] = bound(nums, n, target, 1) - 1; }
       return answer;
   }

Python
~~~~~~

.. code-block:: python

   class Solution:
       def searchRange(self, nums: list[int], target: int) -> list[int]:
           def bound(upper: bool) -> int:
               left, right = 0, len(nums)
               while left < right:
                   mid = left + (right - left) // 2
                   if nums[mid] < target or (upper and nums[mid] == target):
                       left = mid + 1
                   else:
                       right = mid
               return left
           first = bound(False)
           if first == len(nums) or nums[first] != target:
               return [-1, -1]
           return [first, bound(True) - 1]

Java
~~~~

.. code-block:: java

   class Solution {
       private int bound(int[] nums, int target, boolean upper) {
           int left = 0, right = nums.length;
           while (left < right) {
               int mid = left + (right - left) / 2;
               if (nums[mid] < target || (upper && nums[mid] == target)) left = mid + 1;
               else right = mid;
           }
           return left;
       }
       public int[] searchRange(int[] nums, int target) {
           int first = bound(nums, target, false);
           if (first == nums.length || nums[first] != target) return new int[]{-1, -1};
           return new int[]{first, bound(nums, target, true) - 1};
       }
   }

Rust
~~~~

.. code-block:: rust

   impl Solution {
       pub fn search_range(nums: Vec<i32>, target: i32) -> Vec<i32> {
           fn bound(nums: &[i32], target: i32, upper: bool) -> usize {
               let (mut left, mut right) = (0usize, nums.len());
               while left < right {
                   let mid = left + (right - left) / 2;
                   if nums[mid] < target || (upper && nums[mid] == target) { left = mid + 1; }
                   else { right = mid; }
               }
               left
           }
           let first = bound(&nums, target, false);
           if first == nums.len() || nums[first] != target { return vec![-1, -1]; }
           vec![first as i32, bound(&nums, target, true) as i32 - 1]
       }
   }

Go
~~

.. code-block:: go

   func searchRange(nums []int, target int) []int {
       bound := func(upper bool) int {
           left, right := 0, len(nums)
           for left < right {
               mid := left + (right-left)/2
               if nums[mid] < target || (upper && nums[mid] == target) { left = mid+1 } else { right = mid }
           }
           return left
       }
       first := bound(false)
       if first == len(nums) || nums[first] != target { return []int{-1, -1} }
       return []int{first, bound(true)-1}
   }

TypeScript
~~~~~~~~~~

.. code-block:: typescript

   function searchRange(nums: number[], target: number): number[] {
       const bound = (upper: boolean): number => {
           let left = 0, right = nums.length;
           while (left < right) {
               const mid = left + Math.floor((right - left) / 2);
               if (nums[mid] < target || (upper && nums[mid] === target)) left = mid + 1;
               else right = mid;
           }
           return left;
       };
       const first = bound(false);
       return first === nums.length || nums[first] !== target ? [-1, -1] : [first, bound(true) - 1];
   }

C#
~~

.. code-block:: csharp

   public class Solution {
       private int Bound(int[] nums, int target, bool upper) {
           int left = 0, right = nums.Length;
           while (left < right) {
               int mid = left + (right - left) / 2;
               if (nums[mid] < target || (upper && nums[mid] == target)) left = mid + 1;
               else right = mid;
           }
           return left;
       }
       public int[] SearchRange(int[] nums, int target) {
           int first = Bound(nums, target, false);
           return first == nums.Length || nums[first] != target ? new int[]{-1,-1} : new int[]{first, Bound(nums,target,true)-1};
       }
   }

Julia
~~~~~

.. code-block:: julia

   function search_range(nums::Vector{Int}, target::Int)
       function bound(upper)
           left, right = 1, length(nums) + 1
           while left < right
               mid = left + (right - left) ÷ 2
               if nums[mid] < target || (upper && nums[mid] == target)
                   left = mid + 1
               else
                   right = mid
               end
           end
           left
       end
       first = bound(false)
       first > length(nums) || nums[first] != target ? [-1,-1] : [first-1, bound(true)-2]
   end

R
~

.. code-block:: r

   search_range <- function(nums, target) {
     bound <- function(upper) {
       left <- 1L; right <- length(nums) + 1L
       while (left < right) {
         mid <- left + (right - left) %/% 2L
         if (nums[[mid]] < target || (upper && nums[[mid]] == target)) left <- mid + 1L else right <- mid
       }
       left
     }
     first <- bound(FALSE)
     if (first > length(nums) || nums[[first]] != target) c(-1L, -1L) else c(first - 1L, bound(TRUE) - 2L)
   }