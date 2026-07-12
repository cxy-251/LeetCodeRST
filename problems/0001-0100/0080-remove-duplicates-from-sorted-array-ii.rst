0080. Remove Duplicates from Sorted Array II
============================================

题目信息
--------

:题号: 0080
:难度: Medium
:主题: 数组、双指针、原地覆盖、有序重复
:原题: `LeetCode 0080 <https://leetcode.com/problems/remove-duplicates-from-sorted-array-ii/>`_
:访问状态: Available
:教学重点: 最多保留两次、倒数第二项比较、有效前缀、稳定覆盖

题目重述
--------

给定一个按非递减顺序排列的整数数组 ``nums``，在原数组中整理元素，使每个不同值最多保留两次，并
返回有效前缀长度 ``k``。调用者只检查 ``nums[0:k]``；``k`` 之后的内容没有要求。

题目保证 ``1 <= len(nums) <= 30000``，元素位于 ``[-10000, 10000]``。保留下来的元素必须保持原有
相对顺序，算法使用常数额外空间。

自建示例
--------

.. code-block:: text

   输入：[0,0,0,1,1,1,1,2,3,3]
   返回：7
   有效前缀：[0,0,1,1,2,3,3]

每个值保留前两个副本。第三个及之后的连续副本被跳过。

问题抽象
--------

``write`` 同时表示有效前缀长度和下一个写入位置。扫描当前值 ``value`` 时：

* ``write < 2``：有效前缀还不足两个元素，当前值必然可以保留；
* ``write >= 2``：比较 ``value`` 与有效前缀倒数第二项 ``nums[write-2]``；
* 若两者相同，当前值会成为同一数值的第三个副本，应跳过；
* 若不同，把当前值写入 ``nums[write]`` 并推进 ``write``。

有序性使相同值连续出现，因此倒数第二项足以判断是否已经保留两个当前值。

解法选择
--------

.. list-table::
   :header-rows: 1

   * - 方法
     - 时间复杂度
     - 额外空间
     - 定位
   * - 读写指针与倒数第二项比较
     - ``O(n)``
     - ``O(1)``
     - 主解法；单遍稳定覆盖
   * - 统计每个值后重新写入
     - ``O(n)``
     - ``O(1)``
     - 同样可行，需要分段计数
   * - 建立新数组
     - ``O(n)``
     - ``O(n)``
     - 不满足常数额外空间目标

主解法：最多保留两个副本
------------------------

状态定义与核心不变量
~~~~~~~~~~~~~~~~~~~~

每轮读取当前元素之前：

* ``nums[0:write]`` 是已扫描输入前缀按规则过滤后的结果；
* 有效前缀保持非递减顺序；
* 每个值在有效前缀中最多出现两次；
* ``write`` 不大于当前读取位置，写入不会破坏未来输入；
* 当前循环变量 ``value`` 已在覆盖前保存，不受本轮写入影响。

当 ``write >= 2`` 时，若 ``value == nums[write-2]``，由于有效前缀有序，末尾两个位置都只能是
``value``，所以当前值是第三个或更后的副本。若两者不同，当前值在有效前缀末尾不足两个副本，可以
安全追加。

为什么与倒数第二项比较足够
~~~~~~~~~~~~~~~~~~~~~~~~~~

有效前缀和未处理输入都保持有序。设当前值为 ``x``：

* 若 ``nums[write-2] == x``，前缀最后两项都不小于倒数第二项，也不大于当前输入 ``x``，因此两项
  都等于 ``x``，已经保留两个副本；
* 若 ``nums[write-2] != x``，有效前缀中位于末尾的 ``x`` 最多只有一个，追加后仍不超过两个。

这个判断无需维护当前值计数，也不依赖具体数值范围。

正确性依据
~~~~~~~~~~

**有效前缀合法。** 前两个扫描元素无条件保留。后续元素只有在不会形成第三个副本时写入，因此每个值
最多出现两次。写入顺序与读取顺序一致，非递减顺序保持。

**不会漏掉允许副本。** 某个值的第一个和第二个副本到来时，有效前缀倒数第二项不可能都等于该值，
判断会允许写入。只有第三个及之后的连续副本被跳过。

**结果稳定。** 算法从左到右处理输入，保留元素按发现顺序写入更靠前或相同位置，所以相对顺序不变。

**覆盖安全。** 始终有 ``write <= read + 1``。当前值先读取到局部变量，再写入 ``nums[write]``；
写入位置不会越过尚未读取的后缀。

复杂度
~~~~~~

设数组长度为 ``n``：

* 每个元素读取一次，时间复杂度为 ``O(n)``；
* 只使用读写位置和当前值，算法额外空间为 ``O(1)``；
* 返回结果由长度 ``k`` 和前 ``k`` 个元素共同定义；
* R 返回 ``k`` 与修改后的向量，语言运行时可能复制容器，抽象算法状态仍为常数规模。

核心语言实现
------------

C
~

.. code-block:: c

   int removeDuplicates(int *nums, int numsSize) {
       int write = 0;

       for (int read = 0; read < numsSize; ++read) {
           if (write < 2 || nums[read] != nums[write - 2]) {
               nums[write] = nums[read];
               ++write;
           }
       }

       return write;
   }

C++
~~~

.. code-block:: cpp

   #include <vector>

   class Solution {
   public:
       int removeDuplicates(std::vector<int>& nums) {
           int write = 0;

           for (const int value : nums) {
               if (write < 2 || value != nums[write - 2]) {
                   nums[write] = value;
                   ++write;
               }
           }

           return write;
       }
   };

Python
~~~~~~

.. code-block:: python

   class Solution:
       def removeDuplicates(self, nums: list[int]) -> int:
           write = 0

           for value in nums:
               if write < 2 or value != nums[write - 2]:
                   nums[write] = value
                   write += 1

           return write

Java
~~~~

.. code-block:: java

   class Solution {
       public int removeDuplicates(int[] nums) {
           int write = 0;

           for (int value : nums) {
               if (write < 2 || value != nums[write - 2]) {
                   nums[write] = value;
                   ++write;
               }
           }

           return write;
       }
   }

Rust
~~~~

.. code-block:: rust

   impl Solution {
       pub fn remove_duplicates(nums: &mut Vec<i32>) -> i32 {
           let mut write = 0usize;

           for read in 0..nums.len() {
               let value = nums[read];
               if write < 2 || value != nums[write - 2] {
                   nums[write] = value;
                   write += 1;
               }
           }

           write as i32
       }
   }

Go
~~

.. code-block:: go

   func removeDuplicates(nums []int) int {
       write := 0

       for _, value := range nums {
           if write < 2 || value != nums[write-2] {
               nums[write] = value
               write++
           }
       }

       return write
   }

TypeScript
~~~~~~~~~~

.. code-block:: typescript

   function removeDuplicates(nums: number[]): number {
       let write = 0;

       for (const value of nums) {
           if (write < 2 || value !== nums[write - 2]) {
               nums[write] = value;
               write++;
           }
       }

       return write;
   }

C#
~~

.. code-block:: csharp

   public class Solution {
       public int RemoveDuplicates(int[] nums) {
           int write = 0;

           foreach (int value in nums) {
               if (write < 2 || value != nums[write - 2]) {
                   nums[write] = value;
                   ++write;
               }
           }

           return write;
       }
   }

Julia
~~~~~

.. code-block:: julia

   function remove_duplicates_twice!(nums::Vector{Int})::Int
       write = 0

       for read in eachindex(nums)
           value = nums[read]
           if write < 2 || value != nums[write - 1]
               write += 1
               nums[write] = value
           end
       end

       return write
   end

R
~

.. code-block:: r

   remove_duplicates_twice <- function(nums) {
     write <- 0L

     for (read in seq_along(nums)) {
       value <- nums[[read]]
       if (write < 2L || value != nums[[write - 1L]]) {
         write <- write + 1L
         nums[[write]] <- value
       }
     }

     list(k = write, nums = nums)
   }

验证计划与证据
--------------

覆盖单元素、恰好两个、全部相同、没有超过两次、多个长重复段和负数；对随机有序数组与独立分组基准
比较 ``k`` 和有效前缀。可用语言执行编译、严格类型检查和运行测试。

关键边界
--------

* 前两个元素总能保留，判断必须先检查 ``write < 2``；
* 只检查有效前缀，``k`` 之后内容未定义；
* 输入有序是局部比较成立的必要条件；
* 循环中先保存当前值，可避免覆盖后读取语义混乱；
* Julia、R 使用一基索引，零基 ``write-2`` 映射为一基位置 ``write-1``。

易错点
------

* 与 ``nums[write-1]`` 比较，会错误地把允许的第二个副本也删除；
* 与原数组 ``nums[read-2]`` 比较，忽略前面已经跳过的元素；
* 在 ``write < 2`` 时访问负下标；
* 试图删除数组元素并移动后缀，引入不必要成本；
* 返回原数组长度，或要求整理 ``k`` 之后的内容；
* 使用无序输入测试后误认为算法错误。

本题新增知识
------------

* “每个值最多保留 ``r`` 次”可统一判断 ``write < r`` 或
  ``value != nums[write-r]``；
* 有序有效前缀的倒数第 ``r`` 项可以作为第 ``r+1`` 个副本见证；
* 当前值局部快照让读写覆盖语义更清晰。

本题强化知识
------------

* 0026 的有效前缀和读写指针模型推广到允许两个副本；
* 0075 的原地修改再次要求证明元素守恒或允许删除的精确规则；
* Julia、R 的一基索引需要重新推导相对有效长度的位置。

关联题目
--------

* `0026. Remove Duplicates from Sorted Array
  <0026-remove-duplicates-from-sorted-array.rst>`_
* `0027. Remove Element <0027-remove-element.rst>`_
* `0075. Sort Colors <0075-sort-colors.rst>`_

最小自检
--------

#. 为什么比较的是 ``nums[write-2]``？
#. ``write < 2`` 时为什么可以无条件保留？
#. 输入有序性在证明中承担什么作用？
#. 为什么写入不会覆盖未来尚未读取的数据？
#. 返回 ``k`` 后调用者检查哪些位置？

答案要点
~~~~~~~~

#. 相等可证明有效前缀末尾已经有两个当前值。
#. 有效前缀总元素数不足两个，任何值都不可能已出现两次。
#. 它让相同值连续，并使前缀末尾结构可以代表当前值副本数。
#. 写指针不会超越读取进度，当前值也已先保存。
#. 只检查 ``nums[0:k]``，后缀没有要求。
