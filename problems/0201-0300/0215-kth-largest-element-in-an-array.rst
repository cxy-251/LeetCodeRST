0215. Kth Largest Element in an Array
=====================================

题目信息
--------

:题号: 0215
:难度: Medium
:主题: Quickselect、三路分区、顺序统计量、原地算法
:原题: `LeetCode 0215 <https://leetcode.com/problems/kth-largest-element-in-an-array/>`_
:访问状态: Available
:教学重点: ``n-k`` 目标下标、重复值等值区、严格区间收缩、真实最坏复杂度

精确契约
--------

给定长度为 ``n`` 的整数数组 ``nums`` 和整数 ``k``，返回按从大到小排序后的第 ``k`` 个元素。

* ``1 <= k <= n``；
* 重复元素分别占据排序位置，不要求返回第 ``k`` 个不同值；
* 主实现允许原地重排输入数组；
* 返回一个整数值，不需要恢复原顺序；
* 本文扩展边界只在叙述中说明非法 ``k``，平台实现按官方合法输入合同编写。

若业务接口要求输入只读，应先复制数组，再在副本上执行 Quickselect。复制会增加 ``O(n)`` 时间和空间；本文平台实现直接重排输入。

第 k 大如何变成升序目标下标
----------------------------

把数组升序排列后，下标范围为 ``0..n-1``：最大值位于 ``n-1``，第 2 大位于 ``n-2``，第 ``k`` 大位于 ``n-k``。

.. code-block:: text

   target = n - k

``k-1`` 是从大到小排列时的下标，不能直接用于按升序分区的 Quickselect。

自建示例
--------

.. code-block:: text

   nums = [3,2,1,5,6,4], k = 2
   升序 = [1,2,3,4,5,6]
   target = 4
   answer = 5

.. code-block:: text

   nums = [3,2,3,1,2,4,5,5,6], k = 4
   升序 = [1,2,2,3,3,4,5,5,6]
   target = 5
   answer = 4

重复值分别占据排序位置，不能先去重。全相等数组 ``[7,7,7,7]`` 对任意合法 ``k`` 都返回 7。
``k=1`` 搜索升序下标 ``n-1``，``k=n`` 搜索下标 0。

问题抽象与解法选择
------------------

目标是找到一个顺序统计量，不需要完整排序。

.. list-table::
   :header-rows: 1

   * - 方法
     - 时间
     - 额外空间
     - 取舍
   * - 完整排序
     - ``O(n log n)``
     - 依排序实现而定
     - 简单，但完成无关的全局次序工作
   * - 大小为 ``k`` 的最小堆
     - ``O(n log k)``
     - ``O(k)``
     - 输入可只读，适合流式数据
   * - 三路 Quickselect
     - 单轮 ``O(m)``，最坏 ``O(n^2)``
     - ``O(1)`` 核心额外空间
     - 主解法，只保留目标一侧

本文使用当前区间中点元素的值作为确定性 pivot。它不需要随机状态，但不能保证每轮平衡，因此不声称保证或无条件期望 ``O(n)``。

三路分区状态
------------

当前处理闭区间 ``[left,right]``，先复制 pivot 值：

.. code-block:: text

   pivot = nums[left + (right-left)/2]

维护 ``less``、``scan``、``greater``，循环开始时保持：

.. code-block:: text

   [left, less)       < pivot
   [less, scan)       == pivot
   [scan, greater]    尚未分类
   (greater, right]   > pivot

初始 ``less=scan=left``、``greater=right``，三个已分类区域为空。

状态转移
--------

``nums[scan] < pivot``
   交换 ``nums[less]`` 与 ``nums[scan]``，同时增加 ``less`` 和 ``scan``。原等值区首元素被移到等值区末端，小值进入小于区。

``nums[scan] == pivot``
   只增加 ``scan``，把当前元素并入等值区。

``nums[scan] > pivot``
   交换 ``nums[scan]`` 与 ``nums[greater]``，减少 ``greater``，不能增加 ``scan``。右端换入的元素此前未知，必须再次分类。

当 ``scan>greater`` 时未知区为空：

.. code-block:: text

   [left, less)       < pivot
   [less, greater]    == pivot
   (greater, right]   > pivot

目标下标有三种情况：

* ``target < less``：保留 ``[left,less-1]``；
* ``target > greater``：保留 ``[greater+1,right]``；
* ``less <= target <= greater``：该排序位置的值就是 pivot，直接返回。

区间严格收缩
------------

若 ``target<less``，目标仍满足 ``target>=left``，所以 ``less>=left+1``，新右端严格左移。
若 ``target>greater``，目标仍满足 ``target<=right``，所以 ``greater<=right-1``，新左端严格右移。
目标落在等值段时立即结束。每次未结束迭代都缩短候选区间。

正确性证明
----------

引理一：分区不变量初始化成立
~~~~~~~~~~~~~~~~~~~~~~~~~~~~

初始小于区、等值区和大于区均为空，整个闭区间是未知区，四段描述成立。

引理二：三种转移保持不变量
~~~~~~~~~~~~~~~~~~~~~~~~~~

小值交换后进入小于区，原等值元素移到等值区末端；等值只扩展等值区；大值交换后进入右侧大于区，换入 ``scan`` 的未知元素保留待检查。三种比较结果覆盖全部整数关系，因此每轮保持不变量。

引理三：分区结束后所有元素分类完整
~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

循环在 ``scan>greater`` 时结束，未知区为空。结合引理二，当前区间被连续分成小于、等于和大于 pivot 的三段，重复 pivot 值全部集中在等值段。

引理四：只保留目标所在一侧是安全的
~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

小于段的元素在升序中必位于等值段之前，大于段必位于等值段之后。目标在左侧时不可能由等值或大值占据；目标在右侧时不可能由小值或等值占据；目标在等值段时该位置的值必为 pivot。分区只改变排列，不改变元素多重集合，重复值的排序位置完整保留。

引理五：算法终止
~~~~~~~~~~~~~~~~

内层每轮让 ``scan`` 增加或 ``greater`` 减少，未知区长度下降。外层未返回时候选区间严格缩短。有限数组上最终必进入某个 pivot 等值段并返回。

定理：算法返回第 k 大元素
~~~~~~~~~~~~~~~~~~~~~~~~

升序目标下标 ``n-k`` 正是第 ``k`` 大元素的位置。引理四保证每轮保留包含该位置的候选区间，目标进入等值段时返回正确值；引理五保证过程终止。

复杂度与真实边界
----------------

一次长度为 ``m`` 的三路分区耗时 ``O(m)``，核心额外状态为 ``O(1)``，输入被原地重排。

若各轮较平衡，总工作量为 ``n+n/2+n/4+...=O(n)``；全相等数组也在一轮结束。确定性中点 pivot 仍存在连续极不平衡的对抗排列，最坏累计 ``O(n^2)``。因此本文只报告常见输入下通常接近线性、最坏 ``O(n^2)``，不写成保证线性。

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

           if (target < less) right = less - 1;
           else if (target > greater) left = greater + 1;
           else return pivot;
       }
       return 0;
   }

C 不分配内存，直接重排调用方数组。pivot 在交换前复制为值。

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
               int less = left, scan = left, greater = right;
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

需要 ``<vector>`` 与 ``<utility>``；参数按引用接收并被重排。

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

Python 元组赋值完成交换，输入列表被修改。

Java
~~~~

.. code-block:: java

   class Solution {
       public int findKthLargest(int[] nums, int k) {
           int target = nums.length - k;
           int left = 0, right = nums.length - 1;
           while (left <= right) {
               int pivot = nums[left + (right - left) / 2];
               int less = left, scan = left, greater = right;
               while (scan <= greater) {
                   if (nums[scan] < pivot) {
                       int temporary = nums[less];
                       nums[less++] = nums[scan];
                       nums[scan++] = temporary;
                   } else if (nums[scan] > pivot) {
                       int temporary = nums[scan];
                       nums[scan] = nums[greater];
                       nums[greater--] = temporary;
                   } else {
                       ++scan;
                   }
               }
               if (target < less) right = less - 1;
               else if (target > greater) left = greater + 1;
               else return pivot;
           }
           throw new IllegalStateException();
       }
   }

Java 数组元素会被原地重排。

Rust
~~~~

.. code-block:: rust

   impl Solution {
       pub fn find_kth_largest(mut nums: Vec<i32>, k: i32) -> i32 {
           let target = nums.len() as isize - k as isize;
           let mut left = 0_isize;
           let mut right = nums.len() as isize - 1;

           while left <= right {
               let pivot = nums[(left + (right - left) / 2) as usize];
               let mut less = left;
               let mut scan = left;
               let mut greater = right;

               while scan <= greater {
                   let value = nums[scan as usize];
                   if value < pivot {
                       nums.swap(less as usize, scan as usize);
                       less += 1;
                       scan += 1;
                   } else if value > pivot {
                       nums.swap(scan as usize, greater as usize);
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
           unreachable!("valid input must return")
       }
   }

Rust 平台签名按值取得 ``Vec``。分区游标使用 ``isize``，避免右边界下降到 -1 时发生 ``usize`` 下溢；仅在已证明非负的数组访问处转换为 ``usize``。

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

Go 切片共享底层数组，调用方可观察到重排。

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

``number`` 能精确表示官方 32 位整数，输入数组被修改。

C#
~~

.. code-block:: csharp

   public class Solution {
       public int FindKthLargest(int[] nums, int k) {
           int target = nums.Length - k;
           int left = 0, right = nums.Length - 1;
           while (left <= right) {
               int pivot = nums[left + (right - left) / 2];
               int less = left, scan = left, greater = right;
               while (scan <= greater) {
                   if (nums[scan] < pivot) {
                       (nums[less], nums[scan]) = (nums[scan], nums[less]);
                       ++less;
                       ++scan;
                   } else if (nums[scan] > pivot) {
                       (nums[scan], nums[greater]) = (nums[greater], nums[scan]);
                       --greater;
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
   }

C# 数组对象在调用方与函数之间共享，元素顺序会改变。

Julia
~~~~~

.. code-block:: julia

   function find_kth_largest!(nums::Vector{Int}, k::Int)::Int
       n = length(nums)
       target = n - k + 1
       left = 1
       right = n
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

Julia 使用一基目标位置 ``n-k+1``；函数名 ``!`` 明确输入向量被重排。

R
~

.. code-block:: r

   find_kth_largest <- function(nums, k) {
     n <- length(nums)
     target <- n - k + 1L
     left <- 1L
     right <- n
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
       if (target < less) right <- less - 1L
       else if (target > greater) left <- greater + 1L
       else return(pivot)
     }
     stop("unreachable for valid input")
   }

R 使用一基目标位置。元素赋值重排函数本地向量绑定；函数只返回答案。官方整数范围在双精度 ``numeric`` 中可精确比较。

人工静态推演
------------

* ``[3,2,1,5,6,4], k=2``：``target=4``，每轮只保留下标 4 所在段，最终返回 5；
* ``[3,2,3,1,2,4,5,5,6], k=4``：``target=5``，重复值分别参与排序，最终返回 4；
* 全相等：第一轮等值段覆盖整个区间，直接返回；
* 升序、降序：正确性不依赖分区平衡，目标侧仍严格缩小；
* ``k=1`` 与 ``k=n``：分别搜索升序下标 ``n-1`` 与 0。

静态审查记录
------------

本题未运行、未编译、未对拍、未穷举，也未执行 sanitizer。已人工核对：

* ``n-k`` 与 Julia/R 的一基 ``n-k+1``；
* 四段不变量及大值交换后不增加 ``scan``；
* 重复值形成连续等值段；
* 左右候选区间严格收缩；
* 十语言交换、索引和输入变异语义；
* Rust 有符号游标避免无符号下溢；
* 确定性 pivot 的 ``O(n^2)`` 最坏时间。

剩余风险是代码没有经过目标平台编译或执行；接口名称和容器类型按常见 LeetCode 适配器静态核对。

关键易错点
----------

* 把目标写成 ``k-1``，实际寻找第 ``k`` 小；
* 大值交换后增加 ``scan``，跳过换入的未知元素；
* 二路分区在大量重复值下无法可靠收缩；
* pivot 未复制为值，交换后比较基准变化；
* 把确定性 pivot 写成保证 ``O(n)``；
* 忘记说明输入被重排。

知识联系
--------

Quickselect 与快速排序共享分区思想，差别是每轮只处理目标一侧。重复值多时三路分区能一次跳过整个等值段。输入不可修改或数据流持续到达时，可使用大小为 ``k`` 的最小堆。

自检问题
--------

#. 为什么第 ``k`` 大对应升序下标 ``n-k``？
#. 大值交换后为什么不能增加 ``scan``？
#. 目标位于等值段时为什么直接返回 pivot？
#. 为什么本文不能声称保证 ``O(n)``？
#. 输入必须只读时需要什么额外成本？

参考答案
~~~~~~~~

#. 升序末端 ``n-1`` 是第 1 大，每向前一位名次增加 1。
#. 换入 ``scan`` 的元素来自未知区，必须重新比较。
#. 等值段每个排序位置都由值等于 pivot 的元素占据。
#. 确定性 pivot 存在连续极不平衡分区，最坏累计 ``O(n^2)``。
#. 先复制数组，再在副本上执行，增加 ``O(n)`` 时间和空间。