0075. Sort Colors
=================

题目信息
--------

:题号: 0075
:难度: Medium
:主题: 数组、双指针、原地分区
:原题: `LeetCode 0075 <https://leetcode.com/problems/sort-colors/>`_
:访问状态: Available
:教学重点: 荷兰国旗、四段不变量、交换后复查

题目重述
--------

给定只含 ``0``、``1``、``2`` 的数组，按非递减顺序原地排序，不能调用通用排序。``1 <= n <= 300``。
普通平台接口无返回值；R 因值语义返回修改后的向量。

自建示例
--------

.. code-block:: text

   输入：[2,0,2,1,1,0]
   输出：[0,0,1,1,2,2]

问题抽象
--------

维护四段：``[0,low)`` 全为 0，``[low,current)`` 全为 1，``[current,high]`` 未分类，
``(high,n)`` 全为 2。每轮只分类 ``nums[current]``。

解法选择
--------

主解法荷兰国旗分区单遍完成，时间 ``O(n)``、空间 ``O(1)``。两遍计数覆盖也为线性，但不能展示单遍
原地分区状态。

主解法：荷兰国旗分区
--------------------

当前值为 0 时与 ``low`` 交换并推进两个左指针；为 1 时只推进 ``current``；为 2 时与 ``high``
交换并缩小右边界，不推进 ``current``。

处理 0 后换入值来自已分类前缀，可以同步推进。处理 2 后换入值来自未知区，必须复查。每轮未知区间
严格缩短；终止时三类区域依次连接。算法只交换已有元素，因此长度和多重集保持不变。

复杂度
~~~~~~

时间 ``O(n)``，算法额外空间 ``O(1)``。R 返回向量时可能产生接口复制。

核心语言实现
------------

C
~

.. code-block:: c

   static void swap_int(int *left, int *right) {
       const int value = *left;
       *left = *right;
       *right = value;
   }

   void sortColors(int *nums, int numsSize) {
       int low = 0;
       int current = 0;
       int high = numsSize - 1;

       while (current <= high) {
           if (nums[current] == 0) {
               swap_int(&nums[low], &nums[current]);
               ++low;
               ++current;
           } else if (nums[current] == 1) {
               ++current;
           } else {
               swap_int(&nums[current], &nums[high]);
               --high;
           }
       }
   }

C++
~~~

.. code-block:: cpp

   #include <utility>
   #include <vector>

   class Solution {
   public:
       void sortColors(std::vector<int>& nums) {
           int low = 0;
           int current = 0;
           int high = static_cast<int>(nums.size()) - 1;

           while (current <= high) {
               if (nums[current] == 0) {
                   std::swap(nums[low], nums[current]);
                   ++low;
                   ++current;
               } else if (nums[current] == 1) {
                   ++current;
               } else {
                   std::swap(nums[current], nums[high]);
                   --high;
               }
           }
       }
   };

Python
~~~~~~

.. code-block:: python

   class Solution:
       def sortColors(self, nums: list[int]) -> None:
           low = 0
           current = 0
           high = len(nums) - 1

           while current <= high:
               if nums[current] == 0:
                   nums[low], nums[current] = nums[current], nums[low]
                   low += 1
                   current += 1
               elif nums[current] == 1:
                   current += 1
               else:
                   nums[current], nums[high] = nums[high], nums[current]
                   high -= 1

Java
~~~~

.. code-block:: java

   class Solution {
       public void sortColors(int[] nums) {
           int low = 0;
           int current = 0;
           int high = nums.length - 1;

           while (current <= high) {
               if (nums[current] == 0) {
                   swap(nums, low, current);
                   low++;
                   current++;
               } else if (nums[current] == 1) {
                   current++;
               } else {
                   swap(nums, current, high);
                   high--;
               }
           }
       }

       private void swap(int[] nums, int left, int right) {
           int value = nums[left];
           nums[left] = nums[right];
           nums[right] = value;
       }
   }

Rust
~~~~

.. code-block:: rust

   impl Solution {
       pub fn sort_colors(nums: &mut Vec<i32>) {
           let mut low = 0usize;
           let mut current = 0usize;
           let mut high = nums.len();

           while current < high {
               match nums[current] {
                   0 => {
                       nums.swap(low, current);
                       low += 1;
                       current += 1;
                   }
                   1 => {
                       current += 1;
                   }
                   _ => {
                       high -= 1;
                       nums.swap(current, high);
                   }
               }
           }
       }
   }

Go
~~

.. code-block:: go

   func sortColors(nums []int) {
       low := 0
       current := 0
       high := len(nums) - 1

       for current <= high {
           if nums[current] == 0 {
               nums[low], nums[current] = nums[current], nums[low]
               low++
               current++
           } else if nums[current] == 1 {
               current++
           } else {
               nums[current], nums[high] = nums[high], nums[current]
               high--
           }
       }
   }

TypeScript
~~~~~~~~~~

.. code-block:: typescript

   function sortColors(nums: number[]): void {
       let low = 0;
       let current = 0;
       let high = nums.length - 1;

       while (current <= high) {
           if (nums[current] === 0) {
               [nums[low], nums[current]] = [nums[current], nums[low]];
               low += 1;
               current += 1;
           } else if (nums[current] === 1) {
               current += 1;
           } else {
               [nums[current], nums[high]] = [nums[high], nums[current]];
               high -= 1;
           }
       }
   }

C#
~~

.. code-block:: csharp

   public class Solution {
       public void SortColors(int[] nums) {
           int low = 0;
           int current = 0;
           int high = nums.Length - 1;

           while (current <= high) {
               if (nums[current] == 0) {
                   Swap(nums, low, current);
                   low++;
                   current++;
               } else if (nums[current] == 1) {
                   current++;
               } else {
                   Swap(nums, current, high);
                   high--;
               }
           }
       }

       private static void Swap(int[] nums, int left, int right) {
           int value = nums[left];
           nums[left] = nums[right];
           nums[right] = value;
       }
   }

Julia
~~~~~

.. code-block:: julia

   function sort_colors!(nums::Vector{Int})::Nothing
       low = 1
       current = 1
       high = length(nums)

       while current <= high
           if nums[current] == 0
               nums[low], nums[current] = nums[current], nums[low]
               low += 1
               current += 1
           elseif nums[current] == 1
               current += 1
           else
               nums[current], nums[high] = nums[high], nums[current]
               high -= 1
           end
       end
       return nothing
   end

R
~

.. code-block:: r

   sort_colors <- function(nums) {
     low <- 1L
     current <- 1L
     high <- length(nums)

     while (current <= high) {
       if (nums[current] == 0L) {
         value <- nums[low]
         nums[low] <- nums[current]
         nums[current] <- value
         low <- low + 1L
         current <- current + 1L
       } else if (nums[current] == 1L) {
         current <- current + 1L
       } else {
         value <- nums[current]
         nums[current] <- nums[high]
         nums[high] <- value
         high <- high - 1L
       }
     }
     nums
   }

验证计划与证据
--------------

覆盖单元素、全相同、已排序、逆序和缺少某类值；穷举短数组并用独立排序基准验证，再执行随机对拍、
编译、严格类型检查和运行测试。

关键边界
--------

* 输入域必须限定为 0、1、2；
* 处理 2 后不能推进 ``current``；
* Rust 使用半开未知区间；
* R 返回修改后的向量，不修改调用者绑定。

易错点
------

* 与右端交换后直接推进 ``current``；
* 处理 0 时漏掉一个左指针；
* 把半开和闭合的 ``high`` 初始化混写；
* 调用通用排序，绕过分区目标。

本题新增知识
------------

荷兰国旗三向分区、四段区域不变量、右端交换后的未知值复查。

本题强化知识
------------

原地交换的多重集守恒、指针跨越前的完成性证明，以及语言值语义与原地接口的区别。

关联题目
--------

* `0027. Remove Element <0027-remove-element.rst>`_：原地有效前缀；
* `0041. First Missing Positive <0041-first-missing-positive.rst>`_：交换填槽。

最小自检
--------

#. 四个区域分别表示什么？
#. 为什么处理 2 后不能推进 ``current``？
#. 为什么处理 0 后可以推进两个指针？
#. 终止时为什么有序且多重集不变？
