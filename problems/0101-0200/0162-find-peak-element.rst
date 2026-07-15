0162. Find Peak Element
=======================

题目信息
--------

:题号: 0162
:难度: Medium
:主题: 数组、二分查找、局部峰值
:原题: `LeetCode 0162 <https://leetcode.com/problems/find-peak-element/>`_
:访问状态: Available
:教学重点: 相邻斜率判断、存在性区间、不需要寻找全局最大值

题目重述
--------

给定非空整数数组，相邻元素保证不相等。数组两侧可视为负无穷。返回任意一个峰值元素的零基下标；峰值需要
严格大于左右相邻元素。题目要求 ``O(log n)`` 时间，因此不能线性扫描全部位置。

算法
----

维护闭区间 ``[left, right]``，保证其中至少存在一个峰值。中点按下取整计算，所以 ``left < right`` 时
``mid + 1`` 一定合法。比较 ``nums[mid]`` 与 ``nums[mid + 1]``：

* 若正在上升，右侧一定存在峰值，令 ``left = mid + 1``；
* 若正在下降，中点或左侧一定存在峰值，令 ``right = mid``。

区间缩成一个位置后返回该下标。算法寻找局部结构，不要求返回数组最大值的位置。

正确性
~~~~~~

若 ``nums[mid] < nums[mid+1]``，从 ``mid+1`` 向右沿上升方向继续：要么在边界前首次下降，下降前位置
就是峰值；要么一直上升到右端，右端因外侧为负无穷而是峰值。因此右半区含峰值。反之，中点到右邻正在
下降；向左同理，要么此前出现由上升转下降的位置，要么一直下降到左端，左端就是峰值，所以
``[left, mid]`` 含峰值。每轮保留一个含峰值的非空区间并严格缩短，最终唯一位置必为峰值。

复杂度
~~~~~~

每轮把候选区间缩小近一半，时间复杂度为 ``O(log n)``，额外空间为 ``O(1)``。Julia 和 R 内部使用一基
位置，但返回值减一以匹配题目零基下标。

核心语言实现
------------

C
~

.. code-block:: c

   int findPeakElement(int *nums, int numsSize) {
       int left = 0;
       int right = numsSize - 1;

       while (left < right) {
           int mid = left + (right - left) / 2;
           if (nums[mid] < nums[mid + 1]) {
               left = mid + 1;
           } else {
               right = mid;
           }
       }
       return left;
   }

C++
~~~

.. code-block:: cpp

   #include <vector>

   class Solution {
   public:
       int findPeakElement(std::vector<int>& nums) {
           int left = 0;
           int right = static_cast<int>(nums.size()) - 1;

           while (left < right) {
               int mid = left + (right - left) / 2;
               if (nums[mid] < nums[mid + 1]) {
                   left = mid + 1;
               } else {
                   right = mid;
               }
           }
           return left;
       }
   };

Python
~~~~~~

.. code-block:: python

   class Solution:
       def findPeakElement(self, nums: list[int]) -> int:
           left = 0
           right = len(nums) - 1

           while left < right:
               mid = left + (right - left) // 2
               if nums[mid] < nums[mid + 1]:
                   left = mid + 1
               else:
                   right = mid
           return left

Java
~~~~

.. code-block:: java

   class Solution {
       public int findPeakElement(int[] nums) {
           int left = 0;
           int right = nums.length - 1;

           while (left < right) {
               int mid = left + (right - left) / 2;
               if (nums[mid] < nums[mid + 1]) {
                   left = mid + 1;
               } else {
                   right = mid;
               }
           }
           return left;
       }
   }

Rust
~~~~

.. code-block:: rust

   impl Solution {
       pub fn find_peak_element(nums: Vec<i32>) -> i32 {
           let mut left = 0usize;
           let mut right = nums.len() - 1;

           while left < right {
               let mid = left + (right - left) / 2;
               if nums[mid] < nums[mid + 1] {
                   left = mid + 1;
               } else {
                   right = mid;
               }
           }
           left as i32
       }
   }

Go
~~

.. code-block:: go

   func findPeakElement(nums []int) int {
       left := 0
       right := len(nums) - 1

       for left < right {
           mid := left + (right-left)/2
           if nums[mid] < nums[mid+1] {
               left = mid + 1
           } else {
               right = mid
           }
       }
       return left
   }

TypeScript
~~~~~~~~~~

.. code-block:: typescript

   function findPeakElement(nums: number[]): number {
       let left = 0;
       let right = nums.length - 1;

       while (left < right) {
           const mid = left + Math.floor((right - left) / 2);
           if (nums[mid] < nums[mid + 1]) {
               left = mid + 1;
           } else {
               right = mid;
           }
       }
       return left;
   }

C#
~~

.. code-block:: csharp

   public class Solution {
       public int FindPeakElement(int[] nums) {
           int left = 0;
           int right = nums.Length - 1;

           while (left < right) {
               int mid = left + (right - left) / 2;
               if (nums[mid] < nums[mid + 1]) {
                   left = mid + 1;
               } else {
                   right = mid;
               }
           }
           return left;
       }
   }

Julia
~~~~~

.. code-block:: julia

   function find_peak_element(nums::Vector{Int})::Int
       left = 1
       right = length(nums)

       while left < right
           mid = left + (right - left) ÷ 2
           if nums[mid] < nums[mid + 1]
               left = mid + 1
           else
               right = mid
           end
       end
       return left - 1
   end

R
~

.. code-block:: r

   find_peak_element <- function(nums) {
     left <- 1L
     right <- length(nums)

     while (left < right) {
       mid <- left + (right - left) %/% 2L
       if (nums[mid] < nums[mid + 1L]) {
         left <- mid + 1L
       } else {
         right <- mid
       }
     }
     left - 1L
   }

关键边界
--------

* 单元素数组的唯一位置同时大于两个虚拟边界；
* 严格递增数组返回末元素，严格递减数组返回首元素；
* 数组可能有多个峰值，返回任意一个都合法；
* ``right = mid`` 必须保留可能已经是峰值的中点；
* 相邻元素不相等，使比较结果只有严格上升或严格下降两种。

验证
----

运行两个官方示例、单元素、严格递增、严格递减和多峰数组。Python 穷举值域 ``[-2, 2]``、长度 1 至 7
且相邻不等的 27305 个数组，验证返回位置满足峰值定义；C、C++、Go、Java 和 TypeScript 运行代表案例，
其余语言完成静态检查。

最小自检
--------

#. 上升时为什么只能证明右侧存在某个峰值，而不是中点右邻必为峰值？
#. 下降分支为什么必须保留 ``mid``？
#. 虚拟负无穷边界怎样保证单调数组也一定存在峰值？
