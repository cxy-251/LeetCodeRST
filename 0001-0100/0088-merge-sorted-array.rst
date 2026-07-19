0088. Merge Sorted Array
========================

题目信息
--------

:题号: 0088
:难度: Easy
:主题: 数组、双指针、原地合并、逆向写入
:原题: `LeetCode 0088 <https://leetcode.com/problems/merge-sorted-array/>`_
:访问状态: Available
:教学重点: 从后向前合并、未读前缀保护、有效输入前缀、复制型语言适配器

题目重述
--------

给定两个非递减整数数组。``nums1`` 的总长度为 ``m + n``，其中前 ``m`` 项是有效元素，后 ``n`` 个
槽位专门预留给合并结果；``nums2`` 的前 ``n`` 项全部有效。把两组元素原地合并到 ``nums1``，结果仍
为非递减顺序。

题目保证 ``0 <= m, n <= 200``、``1 <= m + n <= 200``，元素位于 ``[-10^9, 10^9]``。固定宽度语言
不执行元素算术，只做比较和赋值，因此不存在数值溢出路径。

自建示例
--------

.. code-block:: text

   输入：nums1 = [1,2,3,0,0,0], m = 3
         nums2 = [2,5,6],       n = 3
   输出：nums1 = [1,2,2,3,5,6]

只有 ``nums1[0:m]`` 属于原始数据，尾部的零只是容量槽位，不参与输入排序语义。

问题抽象
--------

若从前向后写入，可能覆盖 ``nums1`` 中尚未读取的有效元素。结果尾部应当放置两组未合并前缀中的较大
元素，因此可以从后向前写：

.. code-block:: text

   first  = m - 1
   second = n - 1
   write  = m + n - 1

每轮把 ``nums1[first]`` 与 ``nums2[second]`` 中较大的值写到 ``nums1[write]``，再移动对应读指针。
只需循环到 ``nums2`` 耗尽；若 ``nums1`` 仍有剩余，它们已经位于正确前缀位置。

解法选择
--------

.. list-table::
   :header-rows: 1

   * - 方法
     - 时间复杂度
     - 额外空间
     - 定位
   * - 从后向前双指针
     - ``O(m + n)``
     - ``O(1)``
     - 主解法；利用预留尾部避免覆盖
   * - 复制 ``nums1`` 有效前缀后正向合并
     - ``O(m + n)``
     - ``O(m)``
     - 直观，但浪费题目提供的原地容量
   * - 拼接后排序
     - ``O((m+n) log(m+n))``
     - 依排序实现而定
     - 未利用两个输入已经有序

主解法：从后向前原地合并
------------------------

状态定义与核心不变量
~~~~~~~~~~~~~~~~~~~~

每轮开始时：

* ``nums1[0:first+1]`` 与 ``nums2[0:second+1]`` 是尚未合并的两个有序前缀；
* ``nums1[write+1:m+n]`` 已经是最终结果中最大的若干元素，顺序正确；
* ``write = first + second + 1``；
* 写入位置严格位于 ``nums1`` 未读前缀之后，不会覆盖尚未比较的 ``nums1`` 元素。

当 ``second >= 0`` 时，由 ``write = first + second + 1`` 可知 ``write > first``。因此即使本轮从
``nums2`` 取值，写入也不会破坏 ``nums1[0:first+1]``。

为什么取较大元素
~~~~~~~~~~~~~~~~

两个未合并前缀各自有序，最大候选只能是 ``nums1[first]`` 或 ``nums2[second]``。最终结果当前空位
``write`` 是尚未填充位置中的最右端，必须放置这两个候选中较大的一个。写入后，对应前缀缩短一项，
不变量继续成立。

为什么只循环到 ``nums2`` 耗尽
~~~~~~~~~~~~~~~~~~~~~~~~~~~~

若 ``nums2`` 先耗尽，``nums1`` 剩余元素本来就位于数组前缀，且它们小于或等于已经写好的后缀，无需
搬动。若 ``nums1`` 先耗尽，循环会继续把 ``nums2`` 剩余前缀复制到 ``nums1`` 的对应位置。

相等时实现选择 ``nums2`` 的元素。题目只要求数值顺序，不要求跨数组稳定身份，因此任一侧优先都正确。

正确性依据
~~~~~~~~~~

**写入值正确。** 每轮未合并元素的最大值必在两个前缀末端，算法把其中较大者写入当前最右空位。

**已完成后缀正确。** 归纳地，写入值不大于后缀中先前写入的值，且大于或等于全部仍未合并元素，因此
完成后缀始终等于最终排序结果的对应后缀。

**不会覆盖未读值。** ``second >= 0`` 时 ``write > first``，写入位置不在 ``nums1`` 未读前缀中。

**终止与完整性。** 每轮至少减少一个读指针。``nums2`` 耗尽后，它的全部元素和所有被移动的
``nums1`` 元素已写入；剩余 ``nums1`` 前缀已经在正确位置，因此整个数组完成合并。

复杂度
~~~~~~

* 最多处理 ``m + n`` 个元素，时间复杂度为 ``O(m + n)``；
* 指针状态占 ``O(1)`` 算法额外空间；
* C、C++、Python、Java、Rust、Go、TypeScript 和 C# 直接修改 ``nums1``；
* Julia 与 R 适配器返回修改后的向量，因为调用边界可能具有复制语义；循环本身仍为常数空间。

核心语言实现
------------

C
~

.. code-block:: c

   void merge(
       int *nums1,
       int nums1Size,
       int m,
       int *nums2,
       int nums2Size,
       int n
   ) {
       (void)nums1Size;
       (void)nums2Size;

       int first = m - 1;
       int second = n - 1;
       int write = m + n - 1;

       while (second >= 0) {
           if (first >= 0 && nums1[first] > nums2[second]) {
               nums1[write--] = nums1[first--];
           } else {
               nums1[write--] = nums2[second--];
           }
       }
   }

C++
~~~

.. code-block:: cpp

   #include <vector>

   class Solution {
   public:
       void merge(
           std::vector<int>& nums1,
           int m,
           std::vector<int>& nums2,
           int n
       ) {
           int first = m - 1;
           int second = n - 1;
           int write = m + n - 1;

           while (second >= 0) {
               if (first >= 0 && nums1[first] > nums2[second]) {
                   nums1[write--] = nums1[first--];
               } else {
                   nums1[write--] = nums2[second--];
               }
           }
       }
   };

Python
~~~~~~

.. code-block:: python

   class Solution:
       def merge(
           self,
           nums1: list[int],
           m: int,
           nums2: list[int],
           n: int,
       ) -> None:
           first = m - 1
           second = n - 1
           write = m + n - 1

           while second >= 0:
               if first >= 0 and nums1[first] > nums2[second]:
                   nums1[write] = nums1[first]
                   first -= 1
               else:
                   nums1[write] = nums2[second]
                   second -= 1
               write -= 1

Java
~~~~

.. code-block:: java

   class Solution {
       public void merge(int[] nums1, int m, int[] nums2, int n) {
           int first = m - 1;
           int second = n - 1;
           int write = m + n - 1;

           while (second >= 0) {
               if (first >= 0 && nums1[first] > nums2[second]) {
                   nums1[write--] = nums1[first--];
               } else {
                   nums1[write--] = nums2[second--];
               }
           }
       }
   }

Rust
~~~~

.. code-block:: rust

   impl Solution {
       pub fn merge(
           nums1: &mut Vec<i32>,
           m: i32,
           nums2: &mut Vec<i32>,
           n: i32,
       ) {
           let mut first = m - 1;
           let mut second = n - 1;
           let mut write = m + n - 1;

           while second >= 0 {
               if first >= 0
                   && nums1[first as usize] > nums2[second as usize]
               {
                   nums1[write as usize] = nums1[first as usize];
                   first -= 1;
               } else {
                   nums1[write as usize] = nums2[second as usize];
                   second -= 1;
               }
               write -= 1;
           }
       }
   }

Go
~~

.. code-block:: go

   func merge(nums1 []int, m int, nums2 []int, n int) {
   	first := m - 1
   	second := n - 1
   	write := m + n - 1

   	for second >= 0 {
   		if first >= 0 && nums1[first] > nums2[second] {
   			nums1[write] = nums1[first]
   			first--
   		} else {
   			nums1[write] = nums2[second]
   			second--
   		}
   		write--
   	}
   }

TypeScript
~~~~~~~~~~

.. code-block:: typescript

   function merge(
       nums1: number[],
       m: number,
       nums2: number[],
       n: number,
   ): void {
       let first = m - 1;
       let second = n - 1;
       let write = m + n - 1;

       while (second >= 0) {
           if (first >= 0 && nums1[first] > nums2[second]) {
               nums1[write] = nums1[first];
               first -= 1;
           } else {
               nums1[write] = nums2[second];
               second -= 1;
           }
           write -= 1;
       }
   }

C#
~~

.. code-block:: csharp

   public class Solution {
       public void Merge(int[] nums1, int m, int[] nums2, int n) {
           int first = m - 1;
           int second = n - 1;
           int write = m + n - 1;

           while (second >= 0) {
               if (first >= 0 && nums1[first] > nums2[second]) {
                   nums1[write--] = nums1[first--];
               } else {
                   nums1[write--] = nums2[second--];
               }
           }
       }
   }

Julia
~~~~~

.. code-block:: julia

   function merge_sorted!(
       nums1::Vector{Int},
       m::Int,
       nums2::Vector{Int},
       n::Int,
   )::Vector{Int}
       first = m
       second = n
       write = m + n

       while second >= 1
           if first >= 1 && nums1[first] > nums2[second]
               nums1[write] = nums1[first]
               first -= 1
           else
               nums1[write] = nums2[second]
               second -= 1
           end
           write -= 1
       end

       return nums1
   end

R
~

.. code-block:: r

   merge_sorted <- function(nums1, m, nums2, n) {
     first <- m
     second <- n
     write <- m + n

     while (second >= 1L) {
       if (first >= 1L && nums1[first] > nums2[second]) {
         nums1[write] <- nums1[first]
         first <- first - 1L
       } else {
         nums1[write] <- nums2[second]
         second <- second - 1L
       }
       write <- write - 1L
     }

     nums1
   }

验证计划与证据
--------------

* 两侧都有元素且包含重复值；
* ``n = 0``，确认 ``nums1`` 保持不变；
* ``m = 0``，确认 ``nums2`` 全部复制到 ``nums1``；
* ``nums2`` 全部小于 ``nums1``，验证持续向前填充；
* 随机有序数组与独立拼接排序基准对拍；
* 可运行语言执行编译、严格警告或严格类型检查。

关键边界
--------

* ``nums1`` 的输入数据只在前 ``m`` 项，尾部占位值不参与比较；
* ``m`` 或 ``n`` 可以为零；
* 循环条件是 ``second >= 0``，不必主动复制剩余 ``nums1`` 前缀；
* 写指针必须从 ``m + n - 1`` 开始；
* Julia 与 R 使用一基下标，初始指针直接是 ``m``、``n`` 和 ``m + n``。

易错点
------

* 从前向后直接写入，会覆盖 ``nums1`` 尚未读取的数据；
* 把 ``nums1`` 尾部占位零当成有效输入，会破坏排序结果；
* 当 ``nums1`` 先耗尽时提前停止，会漏掉 ``nums2`` 的剩余元素；
* 当 ``nums2`` 先耗尽后继续搬运 ``nums1``，虽然可正确，但属于无意义写入；
* 使用无符号下标时直接减到负数会下溢；Rust 实现使用有符号 ``i32`` 游标后再做已证明非负的转换。

本题新增知识
------------

* 利用目标数组尾部容量执行逆向原地合并；
* ``write = first + second + 1`` 同时证明位置关系与覆盖安全；
* 第二输入耗尽即可结束，第一输入剩余前缀无需移动。

本题强化知识
------------

* 有效前缀与底层容器总长度必须分开定义；
* 双指针移动需要证明被提交位置未来不会改变；
* 原地数组算法保持元素多重集；
* 复制型语言适配器需明确返回修改后的容器。

关联题目
--------

* `0021. Merge Two Sorted Lists <0021-merge-two-sorted-lists.rst>`_：两个有序序列的稳定合并；
* `0080. Remove Duplicates from Sorted Array II
  <0080-remove-duplicates-from-sorted-array-ii.rst>`_：有效前缀与原地写指针契约。

最小自检
--------

#. 为什么必须从结果尾部开始写？
#. ``write = first + second + 1`` 如何证明不会覆盖未读 ``nums1`` 元素？
#. 为什么 ``nums2`` 耗尽后可以直接结束？
#. ``m = 0`` 和 ``n = 0`` 时分别发生什么？
#. Julia 与 R 的接口为什么返回向量？

答案要点
~~~~~~~~

两个未合并前缀的最大值必在末端。把较大值写入最右空位并缩短对应前缀，可以保持已完成后缀正确；
只要 ``nums2`` 尚有元素，写位置就严格位于 ``nums1`` 未读前缀之后，因此不会覆盖数据。
