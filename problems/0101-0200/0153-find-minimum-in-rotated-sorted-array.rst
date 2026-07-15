0153. Find Minimum in Rotated Sorted Array
==========================================

题目信息
--------

:题号: 0153
:难度: Medium
:主题: 数组、二分查找、旋转有序数组
:原题: `LeetCode 0153 <https://leetcode.com/problems/find-minimum-in-rotated-sorted-array/>`_
:访问状态: Available
:教学重点: 右端点比较、候选区间不变量、保留中点

题目重述
--------

给定一个非空整数数组。它由一个严格递增、元素互不相同的数组在未知位置旋转得到，也可能保持原顺序。
返回其中的最小值。算法只比较元素，不修改输入，要求时间复杂度为 ``O(log n)``。

算法
----

维护闭区间 ``[left, right]``，保证最小值所在下标始终位于其中。取中点 ``mid``，把
``nums[mid]`` 与当前右端值 ``nums[right]`` 比较：

* 若 ``nums[mid] > nums[right]``，下降断点一定在 ``mid`` 右侧，令 ``left = mid + 1``；
* 否则 ``mid`` 到 ``right`` 已经递增，最小值位于 ``[left, mid]``，令 ``right = mid``。

第二种情况不能写成 ``mid - 1``，因为 ``mid`` 本身可能就是最小值。区间缩到一个下标时返回该元素。

正确性
~~~~~~

循环开始时，最小值下标位于 ``[left, right]``。若 ``nums[mid] > nums[right]``，中点位于旋转前的较大
递增段，而右端位于较小段，因此旋转断点和最小值严格位于中点右侧，删除 ``[left, mid]`` 安全。

若 ``nums[mid] < nums[right]``，从中点到右端严格递增；该段最小元素是 ``nums[mid]``。全局最小值要么
就是中点，要么位于左侧，所以保留 ``[left, mid]`` 安全。元素互不相同，因此两者不会相等。每轮区间
严格缩短，最终 ``left == right``；由不变量，该下标就是最小值位置。

复杂度
~~~~~~

每轮至少把候选区间缩小近一半，时间复杂度为 ``O(log n)``。只维护三个下标，额外空间为 ``O(1)``。
所有实现只读取输入。

核心语言实现
------------

C
~

.. code-block:: c

   int findMin(int *nums, int numsSize) {
       int left = 0;
       int right = numsSize - 1;

       while (left < right) {
           int mid = left + (right - left) / 2;
           if (nums[mid] > nums[right]) {
               left = mid + 1;
           } else {
               right = mid;
           }
       }

       return nums[left];
   }

C++
~~~

.. code-block:: cpp

   #include <vector>

   class Solution {
   public:
       int findMin(std::vector<int>& nums) {
           int left = 0;
           int right = static_cast<int>(nums.size()) - 1;

           while (left < right) {
               int mid = left + (right - left) / 2;
               if (nums[mid] > nums[right]) {
                   left = mid + 1;
               } else {
                   right = mid;
               }
           }

           return nums[left];
       }
   };

Python
~~~~~~

.. code-block:: python

   class Solution:
       def findMin(self, nums: list[int]) -> int:
           left = 0
           right = len(nums) - 1

           while left < right:
               mid = left + (right - left) // 2
               if nums[mid] > nums[right]:
                   left = mid + 1
               else:
                   right = mid

           return nums[left]

Java
~~~~

.. code-block:: java

   class Solution {
       public int findMin(int[] nums) {
           int left = 0;
           int right = nums.length - 1;

           while (left < right) {
               int mid = left + (right - left) / 2;
               if (nums[mid] > nums[right]) {
                   left = mid + 1;
               } else {
                   right = mid;
               }
           }

           return nums[left];
       }
   }

Rust
~~~~

.. code-block:: rust

   impl Solution {
       pub fn find_min(nums: Vec<i32>) -> i32 {
           let mut left = 0usize;
           let mut right = nums.len() - 1;

           while left < right {
               let mid = left + (right - left) / 2;
               if nums[mid] > nums[right] {
                   left = mid + 1;
               } else {
                   right = mid;
               }
           }

           nums[left]
       }
   }

Go
~~

.. code-block:: go

   func findMin(nums []int) int {
       left := 0
       right := len(nums) - 1

       for left < right {
           mid := left + (right-left)/2
           if nums[mid] > nums[right] {
               left = mid + 1
           } else {
               right = mid
           }
       }

       return nums[left]
   }

TypeScript
~~~~~~~~~~

.. code-block:: typescript

   function findMin(nums: number[]): number {
       let left = 0;
       let right = nums.length - 1;

       while (left < right) {
           const mid = left + Math.floor((right - left) / 2);
           if (nums[mid] > nums[right]) {
               left = mid + 1;
           } else {
               right = mid;
           }
       }

       return nums[left];
   }

C#
~~

.. code-block:: csharp

   public class Solution {
       public int FindMin(int[] nums) {
           int left = 0;
           int right = nums.Length - 1;

           while (left < right) {
               int mid = left + (right - left) / 2;
               if (nums[mid] > nums[right]) {
                   left = mid + 1;
               } else {
                   right = mid;
               }
           }

           return nums[left];
       }
   }

Julia
~~~~~

.. code-block:: julia

   function find_min(nums::Vector{Int})::Int
       left = 1
       right = length(nums)

       while left < right
           mid = left + (right - left) ÷ 2
           if nums[mid] > nums[right]
               left = mid + 1
           else
               right = mid
           end
       end

       return nums[left]
   end

R
~

.. code-block:: r

   find_min <- function(nums) {
     left <- 1L
     right <- length(nums)

     while (left < right) {
       mid <- left + (right - left) %/% 2L
       if (nums[mid] > nums[right]) {
         left <- mid + 1L
       } else {
         right <- mid
       }
     }

     nums[left]
   }

关键边界
--------

* 单元素数组直接返回唯一值；
* 未发生有效旋转时，右端比较会持续保留左半区；
* 旋转点紧邻首尾时仍必须保留可能成为答案的中点；
* 闭区间循环使用 ``left < right``，结束时无需再次比较两个候选；
* 互异前提保证 ``nums[mid]`` 与 ``nums[right]`` 不会在不同下标处相等。

验证
----

运行三个官方示例、单元素、两元素的旋转与未旋转情况。Python 另对 500 个随机严格递增数组的全部随机
旋转与线性最小值对拍；C、C++、Go、Java 和 TypeScript 运行相同代表案例，其余语言完成静态检查。

最小自检
--------

#. 为什么 ``nums[mid] > nums[right]`` 时可以连同中点一起删除？
#. 为什么另一分支只能令 ``right = mid``，不能令 ``right = mid - 1``？
#. 互异元素前提删除了哪一种无法判定的比较结果？
