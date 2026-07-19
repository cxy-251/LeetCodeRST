0215. Kth Largest Element in an Array
=====================================

题目信息
--------

:题号: 0215
:难度: Medium
:主题: Quickselect、三路分区、顺序统计量
:原题: `LeetCode 0215 <https://leetcode.com/problems/kth-largest-element-in-an-array/>`_
:访问状态: Available
:教学重点: 把第 ``k`` 大转换为升序目标下标，并通过三路分区只保留目标所在区间

精确契约
--------

给定整数数组 ``nums`` 和整数 ``k``，返回数组按从大到小排列后的第 ``k`` 个元素。

官方约束为：

* ``1 <= k <= nums.length <= 10^5``；
* ``-10^4 <= nums[i] <= 10^4``；
* 重复值分别占据排序位置，题目要求的不是第 ``k`` 个不同值。

例如 ``[5,5,4]`` 的第 2 大仍是 5，不能先去重。

本文使用原地 Quickselect，执行过程中会重排 ``nums``，但不要求恢复原顺序。若调用方要求输入只读，应先复制数组，再在副本上选择。

从第 k 大到升序目标下标
----------------------

长度为 ``n`` 的数组升序排列后，下标范围为 ``0..n-1``：

* 最大值位于 ``n-1``；
* 第 2 大位于 ``n-2``；
* 第 ``k`` 大位于 ``n-k``。

因此 Quickselect 要寻找的升序下标为：

.. code-block:: text

   target = n - k

``k-1`` 是从大到小排列时的下标，不能直接用于按升序关系分区的实现。

示例
----

普通输入
~~~~~~~~

.. code-block:: text

   nums = [3, 2, 1, 5, 6, 4]
   k = 2

   升序结果 = [1, 2, 3, 4, 5, 6]
   target = 6 - 2 = 4
   answer = 5

包含重复值
~~~~~~~~~~

.. code-block:: text

   nums = [3, 2, 3, 1, 2, 4, 5, 5, 6]
   k = 4

   升序结果 = [1, 2, 2, 3, 3, 4, 5, 5, 6]
   target = 9 - 4 = 5
   answer = 4

边界位置
~~~~~~~~

``k=1`` 时目标是下标 ``n-1``，也就是最大值；``k=n`` 时目标是下标 0，也就是最小值。
全相等数组对任意合法 ``k`` 都返回同一个值。

解法选择
--------

题目只要求一个顺序统计量，不需要得到完整有序数组。

.. list-table::
   :header-rows: 1

   * - 方法
     - 时间复杂度
     - 额外空间
     - 特点
   * - 完整排序
     - ``O(n log n)``
     - 取决于排序实现
     - 简单，但完成了不需要的全局排序
   * - 大小为 ``k`` 的最小堆
     - ``O(n log k)``
     - ``O(k)``
     - 不必修改输入，适合流式数据
   * - Quickselect
     - 通常接近 ``O(n)``，最坏 ``O(n^2)``
     - ``O(1)``
     - 每轮只保留目标所在的一侧

本文使用三路 Quickselect。三路分区把当前区间分成“小于 pivot”“等于 pivot”“大于 pivot”三段，重复值会集中进入等值段，因此全相等或大量重复的输入可以直接结束，而不会反复处理相同 pivot。

三路分区不变量
--------------

当前只考虑闭区间 ``[left,right]``。先复制一个 pivot 值：

.. code-block:: text

   pivot = nums[left + (right-left)/2]

pivot 必须保存为值，因为它原来所在的数组位置可能在分区过程中被交换。

维护三个指针 ``less``、``scan``、``greater``。每轮循环开始时：

.. code-block:: text

   [left, less)       < pivot
   [less, scan)       == pivot
   [scan, greater]    尚未分类
   (greater, right]   > pivot

初始时 ``less=scan=left``、``greater=right``，已分类区域都为空。

处理当前元素
------------

``nums[scan] < pivot``
   交换 ``nums[less]`` 与 ``nums[scan]``，然后同时增加 ``less`` 和 ``scan``。当前小值进入左侧小于区。

``nums[scan] == pivot``
   只增加 ``scan``，把当前元素并入等值区。

``nums[scan] > pivot``
   交换 ``nums[scan]`` 与 ``nums[greater]``，然后减少 ``greater``。此时不能增加 ``scan``，因为从右侧换来的元素尚未分类。

当 ``scan>greater`` 时未知区为空，当前区间变为：

.. code-block:: text

   [left, less)       < pivot
   [less, greater]    == pivot
   (greater, right]   > pivot

选择下一段
----------

分区结束后，目标下标只有三种位置：

* ``target < less``：目标在小于段，新区间为 ``[left,less-1]``；
* ``target > greater``：目标在大于段，新区间为 ``[greater+1,right]``；
* ``less <= target <= greater``：目标位于等值段，该位置的值就是 pivot，直接返回。

Quickselect 的关键不是把每一段继续排序，而是确认目标在哪一段，只保留那一段。

为什么区间一定收缩
------------------

目标在左段时，等值段至少包含一个 pivot，所以 ``less>left``，新右端 ``less-1`` 严格小于旧右端。

目标在右段时，同理 ``greater<right``，新左端 ``greater+1`` 严格大于旧左端。

目标在等值段时立即返回。因此每次外层循环要么结束，要么缩短候选区间，不会停在同一范围内反复分区。

正确性证明
----------

**引理一：三路分区结束后，当前区间按与 pivot 的大小关系被正确分成三段。**

循环开始时不变量成立。遇到小值时将它移入左段；遇到等值时扩展中段；遇到大值时将它移入右段，并保留换入元素继续检查。每轮都缩短未知区且保持四段关系。循环结束时未知区为空，因此三段分类完整。

**引理二：分区不会改变目标顺序统计量。**

分区只交换元素，不增加、删除或修改任何值，因此数组的多重集合保持不变。小于 pivot 的元素在升序中必然位于等值段之前，大于 pivot 的元素必然位于等值段之后。

**引理三：每轮保留的区间一定包含目标下标对应的值。**

若 ``target`` 在小于段，等值段和大于段中的值都不可能占据该升序位置；若目标在大于段，左侧两段同样可以排除；若目标在等值段，该位置的值必然等于 pivot。三种处理都不会丢失答案。

**定理：算法返回第 ``k`` 大元素。**

``target=n-k`` 正是第 ``k`` 大元素在升序排列中的下标。引理三保证每轮保留包含该顺序统计量的区间；候选区间持续收缩，最终目标进入某个 pivot 的等值段并返回。返回值因此正确。

复杂度
------

一次长度为 ``m`` 的三路分区耗时 ``O(m)``，只使用若干下标和一个 pivot 值，额外空间为 ``O(1)``。

若 pivot 持续把区间分得较平衡，总工作量形成 ``n+n/2+n/4+...``，为 ``O(n)``。本文使用确定性的中点元素值作为 pivot，仍可能遇到连续极不平衡的排列，最坏时间复杂度为 ``O(n^2)``。因此不能把这个具体实现写成保证线性。

输入数组会被原地重排。若先复制输入，则增加 ``O(n)`` 复制时间和 ``O(n)`` 空间。

十语言实现
----------

C
~

.. code-block:: c

   static void swap_int(int *a, int *b) {
       int temporary = *a;
       *a = *b;
       *b = temporary;
   }

   int findKthLargest(int *nums, int numsSize, int k) {
       const int target = numsSize - k;
       int left = 0;
       int right = numsSize - 1;

       while (left <= right) {
           const int pivot = nums[left + (right - left) / 2];
           int less = left;
           int scan = left;
           int greater = right;

           while (scan <= greater) {
               if (nums[scan] < pivot) {
                   swap_int(&nums[less], &nums[scan]);
                   ++less;
                   ++scan;
               } else if (nums[scan] > pivot) {
                   swap_int(&nums[scan], &nums[greater]);
                   --greater;
               } else {
                   ++scan;
               }
           }

           if (target < less) {
               right = less - 1;
           } else if (target > greater) {
               left = greater + 1;
           } else {
               return pivot;
           }
       }

       return 0;
   }

函数按官方合法输入合同执行；最后的 ``return 0`` 在该合同下不可达。数组在原地被重排。

C++
~~~

.. code-block:: cpp

   class Solution {
   public:
       int findKthLargest(std::vector<int>& nums, int k) {
           const int target = static_cast<int>(nums.size()) - k;
           int left = 0;
           int right = static_cast<int>(nums.size()) - 1;

           while (left <= right) {
               const int pivot = nums[left + (right - left) / 2];
               int less = left;
               int scan = left;
               int greater = right;

               while (scan <= greater) {
                   if (nums[scan] < pivot) {
                       std::swap(nums[less++], nums[scan++]);
                   } else if (nums[scan] > pivot) {
                       std::swap(nums[scan], nums[greater--]);
                   } else {
                       ++scan;
                   }
               }

               if (target < less) right = less - 1;
               else if (target > greater) left = greater + 1;
               else return pivot;
           }

           return 0;
       }
   };

需要 ``<utility>`` 与 ``<vector>``。参数按引用接收并被重排。

Python
~~~~~~

.. code-block:: python

   class Solution:
       def findKthLargest(self, nums: list[int], k: int) -> int:
           target = len(nums) - k
           left, right = 0, len(nums) - 1

           while left <= right:
               pivot = nums[left + (right - left) // 2]
               less = scan = left
               greater = right

               while scan <= greater:
                   if nums[scan] < pivot:
                       nums[less], nums[scan] = nums[scan], nums[less]
                       less += 1
                       scan += 1
                   elif nums[scan] > pivot:
                       nums[scan], nums[greater] = nums[greater], nums[scan]
                       greater -= 1
                   else:
                       scan += 1

               if target < less:
                   right = less - 1
               elif target > greater:
                   left = greater + 1
               else:
                   return pivot

           raise RuntimeError("unreachable for valid input")

Python 列表被原地修改。与右侧交换后不移动 ``scan``。

Java
~~~~

.. code-block:: java

   class Solution {
       public int findKthLargest(int[] nums, int k) {
           int target = nums.length - k;
           int left = 0;
           int right = nums.length - 1;

           while (left <= right) {
               int pivot = nums[left + (right - left) / 2];
               int less = left;
               int scan = left;
               int greater = right;

               while (scan <= greater) {
                   if (nums[scan] < pivot) {
                       swap(nums, less++, scan++);
                   } else if (nums[scan] > pivot) {
                       swap(nums, scan, greater--);
                   } else {
                       ++scan;
                   }
               }

               if (target < less) right = less - 1;
               else if (target > greater) left = greater + 1;
               else return pivot;
           }

           throw new IllegalStateException("valid input must return");
       }

       private void swap(int[] nums, int a, int b) {
           int temporary = nums[a];
           nums[a] = nums[b];
           nums[b] = temporary;
       }
   }

pivot 先复制到局部变量，不依赖它原来的数组位置。

Rust
~~~~

.. code-block:: rust

   impl Solution {
       pub fn find_kth_largest(mut nums: Vec<i32>, k: i32) -> i32 {
           let target = nums.len() - k as usize;
           let mut left = 0_usize;
           let mut right = nums.len() - 1;

           loop {
               let pivot = nums[left + (right - left) / 2];
               let mut less = left;
               let mut scan = left;
               let mut greater = right;

               while scan <= greater {
                   if nums[scan] < pivot {
                       nums.swap(less, scan);
                       less += 1;
                       scan += 1;
                   } else if nums[scan] > pivot {
                       nums.swap(scan, greater);
                       if greater == 0 {
                           break;
                       }
                       greater -= 1;
                   } else {
                       scan += 1;
                   }
               }

               if target < less {
                   right = less - 1;
               } else if target > greater {
                   left = greater + 1;
               } else {
                   return pivot;
               }
           }
       }
   }

Rust 使用 ``usize`` 下标。``greater==0`` 的保护避免无符号下标减一；发生该情况时右侧未知区已经耗尽。

Go
~~

.. code-block:: go

   func findKthLargest(nums []int, k int) int {
       target := len(nums) - k
       left, right := 0, len(nums)-1

       for left <= right {
           pivot := nums[left+(right-left)/2]
           less, scan, greater := left, left, right

           for scan <= greater {
               if nums[scan] < pivot {
                   nums[less], nums[scan] = nums[scan], nums[less]
                   less++
                   scan++
               } else if nums[scan] > pivot {
                   nums[scan], nums[greater] = nums[greater], nums[scan]
                   greater--
               } else {
                   scan++
               }
           }

           if target < less {
               right = less - 1
           } else if target > greater {
               left = greater + 1
           } else {
               return pivot
           }
       }

       panic("unreachable for valid input")
   }

切片底层数组被原地重排。

TypeScript
~~~~~~~~~~

.. code-block:: typescript

   function findKthLargest(nums: number[], k: number): number {
       const target = nums.length - k;
       let left = 0;
       let right = nums.length - 1;

       while (left <= right) {
           const pivot = nums[left + Math.floor((right - left) / 2)];
           let less = left;
           let scan = left;
           let greater = right;

           while (scan <= greater) {
               if (nums[scan] < pivot) {
                   [nums[less], nums[scan]] = [nums[scan], nums[less]];
                   less += 1;
                   scan += 1;
               } else if (nums[scan] > pivot) {
                   [nums[scan], nums[greater]] = [nums[greater], nums[scan]];
                   greater -= 1;
               } else {
                   scan += 1;
               }
           }

           if (target < less) right = less - 1;
           else if (target > greater) left = greater + 1;
           else return pivot;
       }

       throw new Error("unreachable for valid input");
   }

官方整数范围可由 ``number`` 精确表示。

C#
~~

.. code-block:: csharp

   public class Solution {
       public int FindKthLargest(int[] nums, int k) {
           int target = nums.Length - k;
           int left = 0;
           int right = nums.Length - 1;

           while (left <= right) {
               int pivot = nums[left + (right - left) / 2];
               int less = left;
               int scan = left;
               int greater = right;

               while (scan <= greater) {
                   if (nums[scan] < pivot) {
                       Swap(nums, less++, scan++);
                   } else if (nums[scan] > pivot) {
                       Swap(nums, scan, greater--);
                   } else {
                       ++scan;
                   }
               }

               if (target < less) right = less - 1;
               else if (target > greater) left = greater + 1;
               else return pivot;
           }

           throw new System.InvalidOperationException();
       }

       private static void Swap(int[] nums, int a, int b) {
           int temporary = nums[a];
           nums[a] = nums[b];
           nums[b] = temporary;
       }
   }

数组按引用语义传入，分区会改变其中元素顺序。

Julia
~~~~~

.. code-block:: julia

   function find_kth_largest(nums::Vector{Int}, k::Int)::Int
       target = length(nums) - k + 1
       left = 1
       right = length(nums)

       while left <= right
           pivot = nums[left + (right - left) ÷ 2]
           less = left
           scan = left
           greater = right

           while scan <= greater
               if nums[scan] < pivot
                   nums[less], nums[scan] = nums[scan], nums[less]
                   less += 1
                   scan += 1
               elseif nums[scan] > pivot
                   nums[scan], nums[greater] = nums[greater], nums[scan]
                   greater -= 1
               else
                   scan += 1
               end
           end

           if target < less
               right = less - 1
           elseif target > greater
               left = greater + 1
           else
               return pivot
           end
       end

       error("unreachable for valid input")
   end

Julia 使用一基下标，所以升序目标位置是 ``length(nums)-k+1``。

R
~

.. code-block:: r

   find_kth_largest <- function(nums, k) {
     target <- length(nums) - k + 1L
     left <- 1L
     right <- length(nums)

     while (left <= right) {
       pivot <- nums[left + (right - left) %/% 2L]
       less <- left
       scan <- left
       greater <- right

       while (scan <= greater) {
         if (nums[scan] < pivot) {
           temporary <- nums[less]
           nums[less] <- nums[scan]
           nums[scan] <- temporary
           less <- less + 1L
           scan <- scan + 1L
         } else if (nums[scan] > pivot) {
           temporary <- nums[scan]
           nums[scan] <- nums[greater]
           nums[greater] <- temporary
           greater <- greater - 1L
         } else {
           scan <- scan + 1L
         }
       }

       if (target < less) {
         right <- less - 1L
       } else if (target > greater) {
         left <- greater + 1L
       } else {
         return(pivot)
       }
     }

     stop("unreachable for valid input")
   }

R 同样使用一基目标位置。函数内部重排局部向量绑定，不依赖完整排序。

关键易错点
----------

* 把目标写成 ``k-1``，混淆降序位置与升序下标；
* 先对数组去重，错误改变重复值占据的排序位置；
* 与右侧未知元素交换后立即增加 ``scan``，漏掉对换入值的分类；
* pivot 保存为数组位置而不是值，交换后比较基准发生变化；
* 二路分区在大量重复值时反复处理相同元素；
* 目标在等值段时仍继续搜索；
* 声称确定性 pivot 的实现保证 ``O(n)``；
* 忘记说明 Quickselect 会改变输入顺序。

知识联系
--------

Quickselect 与快速排序使用相同的分区思想。快速排序递归处理两侧，因为它需要完整顺序；Quickselect 只处理包含目标顺序统计量的一侧，所以通常能省去大量工作。

大小为 ``k`` 的最小堆适合输入不能修改、数据持续到达或只允许保存少量元素的场景。完整排序适合后续还要进行多次有序查询的场景。选择算法时，应先判断需求是“一个位置”“前 ``k`` 个元素”还是“完整顺序”。

自检问题
--------

#. 为什么第 ``k`` 大对应升序下标 ``n-k``？
#. 三路分区结束后 ``less`` 与 ``greater`` 分别表示什么边界？
#. 与 ``greater`` 位置交换后为什么不能立即增加 ``scan``？
#. 为什么目标落入等值段时可以直接返回 pivot？
#. 这个确定性 pivot 实现为什么不能保证最坏 ``O(n)``？

参考答案
~~~~~~~~

#. 升序最大值在 ``n-1``，每向前一个位置，大的排名增加 1，因此第 ``k`` 大在 ``n-k``。
#. ``less`` 是等值段起点，``greater`` 是等值段终点；左侧都小于 pivot，右侧都大于 pivot。
#. 从右侧换来的值此前属于未知区，尚未判断与 pivot 的关系。
#. 等值段中的每个排序位置都由 pivot 值占据，目标值已经确定。
#. pivot 可能连续产生极不平衡分区，使处理规模接近 ``n+(n-1)+...+1``。