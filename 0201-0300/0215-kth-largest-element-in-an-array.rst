0215. Kth Largest Element in an Array
=====================================

题目信息
--------

:题号: 0215
:难度: Medium
:主题: 数组、Quickselect、三路分区、顺序统计
:原题: `LeetCode 0215 <https://leetcode.com/problems/kth-largest-element-in-an-array/>`_
:重点: 按排序位置计算、重复值分别占位、k 从 1 开始、不要求完整排序

题目重述
--------

给定整数数组 ``nums`` 和整数 ``k``，返回把数组按从大到小排列后位于第 ``k`` 个位置的元素。``k`` 使用一基排名，``k=1`` 表示最大元素。重复值必须按其出现次数分别占据排序位置，因此题目求的不是第 ``k`` 个不同元素。

数组长度位于 ``[1, 10^5]``，元素位于 ``[-10^4, 10^4]``，并满足 ``1 <= k <= nums.length``。题目只要求返回目标数值，不要求输出排序后的数组；允许在解法中改变数组内部顺序。

自建示例
--------

重复值占据多个排名：

.. code-block:: text

   输入：nums = [7, 4, 7, 1, 9, 3]，k = 3
   输出：7
   解释：降序排列为 [9,7,7,4,3,1]，两个 7 分别占据第 2 和第 3 个位置，因此第 3 大仍是 7。

全部为负数：

.. code-block:: text

   输入：nums = [-5, -1, -3, -2]，k = 4
   输出：-5
   解释：降序排列为 [-1,-2,-3,-5]，第 4 大是 -5。

问题转化与目标下标
------------------

若数组按升序排列，下标范围是 ``0..n-1``：

* 最大元素位于 ``n-1``；
* 第 2 大位于 ``n-2``；
* 第 ``k`` 大位于 ``n-k``。

因此问题转化为寻找升序顺序统计量下标：

.. code-block:: text

   target = n - k

不需要真正完成排序，只需确定这个位置的值。

三路分区
--------

在当前闭区间 ``[left,right]`` 中选取一个基准值 ``pivot``。维护四段：

.. code-block:: text

   [left, less)          < pivot
   [less, scan)          = pivot
   [scan, greater]       未分类
   (greater, right]      > pivot

初始：

.. code-block:: text

   less = left
   scan = left
   greater = right

处理 ``nums[scan]``：

* 若小于 ``pivot``，与 ``nums[less]`` 交换，``less`` 和 ``scan`` 都加一；
* 若等于 ``pivot``，只让 ``scan`` 加一；
* 若大于 ``pivot``，与 ``nums[greater]`` 交换，``greater`` 减一，但 ``scan`` 不动。

与右侧交换后，换到 ``scan`` 的元素还未分类，所以不能立即增加 ``scan``。

分区结束时 ``scan=greater+1``，得到：

.. code-block:: text

   [left, less)          < pivot
   [less, greater]       = pivot
   (greater, right]      > pivot

随后：

* ``target < less``：只搜索左段；
* ``target > greater``：只搜索右段；
* ``less <= target <= greater``：目标位置属于等值段，直接返回 ``pivot``。

为什么使用三路而不是二路
------------------------

若数组含大量重复值，二路分区可能把与基准相等的元素分散在两侧，导致后续反复处理相同值。三路分区一次聚合全部等值元素；只要目标落在等值段，立刻结束。

本章取当前区间中点元素值作为确定性基准。它避免首元素或尾元素对已排序输入的直接最坏退化，但仍不能保证最坏线性时间。对抗性输入仍可能使分区极不平衡。

正确性证明
----------

**引理一：循环不变量始终成立。**

初始时前三个已分类区间为空，未知区覆盖整个当前区间。

* 小于分支把当前元素放到小于段末尾，并扩展小于段和已扫描区；
* 等于分支把当前元素纳入等值段；
* 大于分支把当前元素放到大于段开头，右边界左移；换入元素仍属于未知区。

每步都保持四段定义。

**引理二：分区结束后，目标位置只可能位于算法选择的区段。**

分区后，左段所有元素都小于 ``pivot``，中段都等于 ``pivot``，右段都大于 ``pivot``。在任何升序排列中：

* 左段占据当前区间最前面的 ``less-left`` 个位置；
* 等值段占据接下来的位置 ``less..greater``；
* 右段占据最后的位置。

因此目标下标小于 ``less`` 时不可能在中段或右段；大于 ``greater`` 时不可能在左段或中段；落入中段时其值必为 ``pivot``。

**引理三：每次继续搜索都严格缩小区间。**

左段搜索把 ``right`` 改为 ``less-1``；右段搜索把 ``left`` 改为 ``greater+1``。中段至少包含选取的基准元素，因此被排除后新区间严格变小。

**定理：算法返回第 ``k`` 大元素。**

目标下标 ``n-k`` 正确对应第 ``k`` 大。每轮分区后，引理二保证算法保留且只保留可能包含目标位置的区段；目标落入等值段时返回该位置必然拥有的基准值。由引理三过程终止，因此最终返回正确顺序统计量。

复杂度
------

* 单次分区扫描当前区间一次；
* 平均情况下 Quickselect 处理规模按几何级数缩小，期望时间为 ``O(n)``；
* 本章使用确定性中点值，不提供随机化或 median-of-medians，因此最坏时间仍为 ``O(n²)``；
* 分区原地进行，核心额外空间为 ``O(1)``；
* 算法会改变输入数组元素顺序；
* 元素和索引操作不需要宽整数。

C++ 实现
--------

.. code-block:: cpp

   class Solution {
   public:
       int findKthLargest(std::vector<int>& nums, int k) {
           int target = static_cast<int>(nums.size()) - k;
           int left = 0;
           int right = static_cast<int>(nums.size()) - 1;

           while (left <= right) {
               int pivot = nums[left + (right - left) / 2];
               int less = left;
               int current = left;
               int greater = right;

               while (current <= greater) {
                   if (nums[current] < pivot) {
                       std::swap(nums[less++], nums[current++]);
                   } else if (nums[current] > pivot) {
                       std::swap(nums[current], nums[greater--]);
                   } else {
                       ++current;
                   }
               }

               if (target < less) {
                   right = less - 1;
               } else if (target > greater) {
                   left = greater + 1;
               } else {
                   return nums[target];
               }
           }
           return -1;
       }
   };

代码分析
--------

第 ``k`` 大元素在升序下标中的位置是 ``target = n-k``。三路分区把当前区间划成“小于 pivot、等于 pivot、大于 pivot”三段；交换大于区元素时不递增 ``current``，因为换进来的元素尚未检查。分区结束后，若目标下标落在等于段，答案已经确定；否则只在目标所在的一侧继续处理，另一侧不再访问。

例如 ``nums=[3,2,3,1,2,4,5,5,6]``、``k=4`` 时目标下标为 5。某轮分区若得到小于段下标 ``[0,3]``、等于段 ``[4,5]``、大于段从 6 开始，目标在等于段内，直接返回该值；重复值被整体归入等于段，不会导致相同值之间无意义地继续分割。算法原地改变数组顺序，平均时间复杂度为 ``O(n)``，确定性中点值下最坏复杂度为 ``O(n^2)``，额外空间复杂度为 ``O(1)``。

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

最后的 ``return 0`` 仅为满足 C 控制流；合法输入必在循环内返回。数组被原地重排。

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

           throw std::logic_error("valid input must return");
       }
   };

需要 ``<algorithm>``、``<stdexcept>`` 与 ``<vector>``。输入向量被修改。

Python
~~~~~~

.. code-block:: python

   class Solution:
       def findKthLargest(self, nums: list[int], k: int) -> int:
           target = len(nums) - k
           left = 0
           right = len(nums) - 1

           while left <= right:
               pivot = nums[left + (right - left) // 2]
               less = left
               scan = left
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
