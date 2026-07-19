0217. Contains Duplicate
========================

题目信息
--------

:题号: 0217
:难度: Easy
:主题: 哈希集合、前缀状态、提前返回
:原题: `LeetCode 0217 <https://leetcode.com/problems/contains-duplicate/>`_
:访问状态: Available
:教学重点: 把“是否在此前出现过”转化为集合查询，并用前缀不变量证明不会误报或漏报

精确契约
--------

给定整数数组 ``nums``，若某个值至少出现两次则返回 ``true``；若所有元素互不相同则返回 ``false``。

官方约束为：

* ``1 <= nums.length <= 10^5``；
* ``-10^9 <= nums[i] <= 10^9``。

因此输入不能为空，元素可能为负数、零或正数，所有值都能由常见的 32 位有符号整数保存。
题目只要求判断重复是否存在，不要求返回重复值、重复次数或对应下标。找到第二次出现即可立即返回。
本文实现不修改输入数组。

示例
----

远距离重复
~~~~~~~~~~

.. code-block:: text

   nums = [1, 2, 3, 1]
   answer = true

扫描到最后一个 ``1`` 时，此前已经见过 ``1``。

全部不同
~~~~~~~~

.. code-block:: text

   nums = [1, 2, 3, 4]
   answer = false

每个值第一次出现时都不在集合中，扫描结束也没有命中。

多个值重复
~~~~~~~~~~

.. code-block:: text

   nums = [1, 1, 1, 3, 3, 4, 3, 2, 4, 2]
   answer = true

只要遇到第一个重复值就可以结束，不需要继续统计后面的重复。

单元素
~~~~~~

.. code-block:: text

   nums = [7]
   answer = false

只有一个下标，不可能存在两个不同位置保存相同值。

问题抽象
--------

处理当前位置 ``i`` 时，真正需要回答的问题是：

.. code-block:: text

   nums[i] 是否在 nums[0:i] 中出现过？

不需要保存前缀顺序，也不需要保存每个值出现了多少次。一个集合已经足够概括此前见过的所有值：

.. code-block:: text

   seen = 已扫描前缀中出现过的值集合

对每个元素执行两步：

#. 查询当前值是否属于 ``seen``；
#. 若属于，返回 ``true``；否则把它插入 ``seen``。

查询必须发生在插入之前。若先插入当前值再查询，当前值一定能在集合中找到，单元素数组也会被错误判定为包含重复。

为什么选择哈希集合
------------------

常见方案有三种：

.. list-table::
   :header-rows: 1

   * - 方法
     - 时间复杂度
     - 额外空间
     - 特点
   * - 两层枚举
     - ``O(n^2)``
     - ``O(1)``
     - 不需要额外数据结构，输入较大时过慢
   * - 排序后检查相邻元素
     - ``O(n log n)``
     - 取决于是否复制输入
     - 原地排序会改变输入顺序
   * - 哈希集合扫描
     - 平均 ``O(n)``
     - ``O(n)``
     - 可以提前返回，最符合“此前是否出现过”的问题结构

本文采用哈希集合。这里的线性时间是哈希操作平均为 ``O(1)`` 时得到的平均复杂度；具体容器发生严重碰撞时可能退化，不能把它写成无条件的严格 ``O(n)`` 保证。

前缀不变量
----------

在处理下标 ``i`` 之前，维护：

.. code-block:: text

   seen = {nums[0], nums[1], ..., nums[i - 1]}

集合中的每个值都来自当前下标之前，当前元素尚未加入。

初始化
~~~~~~

处理 ``i=0`` 之前，已扫描前缀为空，``seen`` 也为空，不变量成立。

命中集合
~~~~~~~~

若 ``nums[i]`` 已属于 ``seen``，根据不变量，存在某个 ``j<i`` 使：

.. code-block:: text

   nums[j] = nums[i]

两个下标不同，因此题目要求的重复值已经找到，可以返回 ``true``。

未命中集合
~~~~~~~~~~

若 ``nums[i]`` 不属于 ``seen``，说明当前值没有在更早位置出现。把它插入后：

.. code-block:: text

   seen = {nums[0], nums[1], ..., nums[i]}

这正是处理下一个位置前需要维护的状态，不变量继续成立。

正确性证明
----------

**引理一：算法返回 ``true`` 时，数组一定包含重复值。**

算法只会在当前值已经属于 ``seen`` 时返回 ``true``。由前缀不变量，该值必然来自某个更早下标 ``j<i``，所以存在两个不同下标满足 ``nums[j]=nums[i]``。算法不会误报。

**引理二：数组包含重复值时，算法一定返回 ``true``。**

任取一个重复值，考虑它第二次出现的位置 ``i``。第一次出现的位置在 ``i`` 之前，因此处理 ``i`` 前，该值已经根据不变量进入 ``seen``。查询必然命中，算法不会漏报。

**定理：算法返回值满足题目要求。**

引理一证明返回 ``true`` 时结论正确；引理二证明任何重复都能被发现。若扫描结束仍未返回，则每个元素都没有在此前出现过，因此所有元素互不相同，返回 ``false`` 正确。

复杂度
------

设数组长度为 ``n``：

* 每个元素至多进行一次集合查询和一次插入，平均时间复杂度为 ``O(n)``；
* 最坏情况下所有元素都不同，集合保存 ``n`` 个值，额外空间复杂度为 ``O(n)``；
* 若较早发现重复，算法会提前返回，实际扫描和存储的元素数可能小于 ``n``；
* 哈希容器在极端碰撞下可能退化，因此最坏时间取决于具体语言和运行时实现。

十语言实现
----------

C
~

C 标准库没有内建哈希集合，下面使用开放寻址表保存已经见过的整数。``used`` 单独标记槽位是否占用，因此零和负数都能作为普通键。

.. code-block:: c

   #include <stdbool.h>
   #include <stdint.h>
   #include <stdlib.h>

   static uint32_t hash_int(int value) {
       uint32_t x = (uint32_t)value;
       x ^= x >> 16;
       x *= UINT32_C(0x7feb352d);
       x ^= x >> 15;
       x *= UINT32_C(0x846ca68b);
       x ^= x >> 16;
       return x;
   }

   bool containsDuplicate(int *nums, int numsSize) {
       if (numsSize < 2) return false;

       size_t capacity = 8;
       while (capacity < (size_t)numsSize * 2) {
           capacity <<= 1;
       }

       int *keys = (int *)malloc(capacity * sizeof(int));
       unsigned char *used =
           (unsigned char *)calloc(capacity, sizeof(unsigned char));
       const size_t mask = capacity - 1;

       for (int i = 0; i < numsSize; ++i) {
           const int value = nums[i];
           size_t index = (size_t)hash_int(value) & mask;

           while (used[index]) {
               if (keys[index] == value) {
                   free(keys);
                   free(used);
                   return true;
               }
               index = (index + 1) & mask;
           }

           used[index] = 1;
           keys[index] = value;
       }

       free(keys);
       free(used);
       return false;
   }

容量保持为不小于 ``2*n`` 的二次幂，因此负载不超过一半；线性探测遇到同值时返回，遇到空槽时插入。题目约束下容量计算不会溢出；在线评测环境中按内存分配成功的通常合同执行。

C++
~~~

.. code-block:: cpp

   class Solution {
   public:
       bool containsDuplicate(std::vector<int>& nums) {
           std::unordered_set<int> seen;
           seen.reserve(nums.size());

           for (int value : nums) {
               if (!seen.insert(value).second) {
                   return true;
               }
           }
           return false;
       }
   };

需要 ``<unordered_set>`` 与 ``<vector>``。``insert`` 的布尔结果表示当前键是否为新插入。

Python
~~~~~~

.. code-block:: python

   class Solution:
       def containsDuplicate(self, nums: list[int]) -> bool:
           seen: set[int] = set()

           for value in nums:
               if value in seen:
                   return True
               seen.add(value)

           return False

集合在查询失败后才插入当前值，对应前缀不变量。

Java
~~~~

.. code-block:: java

   class Solution {
       public boolean containsDuplicate(int[] nums) {
           java.util.HashSet<Integer> seen = new java.util.HashSet<>();

           for (int value : nums) {
               if (!seen.add(value)) {
                   return true;
               }
           }
           return false;
       }
   }

``HashSet.add`` 在值已经存在时返回 ``false``，因此一次调用同时完成查询和插入。

Rust
~~~~

.. code-block:: rust

   impl Solution {
       pub fn contains_duplicate(nums: Vec<i32>) -> bool {
           use std::collections::HashSet;

           let mut seen = HashSet::with_capacity(nums.len());
           for value in nums {
               if !seen.insert(value) {
                   return true;
               }
           }
           false
       }
   }

``HashSet::insert`` 返回是否插入了新值；重复值会得到 ``false``。

Go
~~

.. code-block:: go

   func containsDuplicate(nums []int) bool {
       seen := make(map[int]struct{}, len(nums))

       for _, value := range nums {
           if _, exists := seen[value]; exists {
               return true
           }
           seen[value] = struct{}{}
       }
       return false
   }

映射值使用空结构体，因为集合只关心键是否存在，不需要附加数据。

TypeScript
~~~~~~~~~~

.. code-block:: typescript

   function containsDuplicate(nums: number[]): boolean {
       const seen = new Set<number>();

       for (const value of nums) {
           if (seen.has(value)) {
               return true;
           }
           seen.add(value);
       }
       return false;
   }

官方整数范围远小于 JavaScript ``number`` 的精确整数上限，因此按整数值比较没有精度问题。

C#
~~

.. code-block:: csharp

   public class Solution {
       public bool ContainsDuplicate(int[] nums) {
           var seen = new System.Collections.Generic.HashSet<int>();

           foreach (int value in nums) {
               if (!seen.Add(value)) {
                   return true;
               }
           }
           return false;
       }
   }

``HashSet<int>.Add`` 在重复键上返回 ``false``。

Julia
~~~~~

.. code-block:: julia

   function contains_duplicate(nums::Vector{Int})::Bool
       seen = Set{Int}()

       for value in nums
           value in seen && return true
           push!(seen, value)
       end
       return false
   end

查询发生在 ``push!`` 之前，函数不会修改输入向量。

R
~

.. code-block:: r

   contains_duplicate <- function(nums) {
     anyDuplicated(nums) != 0L
   }

``anyDuplicated`` 返回第一个重复元素的位置；没有重复时返回 ``0``。这里直接把它转换为题目需要的布尔结果。

关键易错点
----------

* 先插入当前值再查询，使元素与自身匹配；
* 为了排序而直接改写输入，却仍声称输入保持不变；
* 使用列表而非集合保存已见值，使成员查询退化为线性；
* 已经发现重复后仍继续扫描和统计无关信息；
* 把哈希集合的平均 ``O(n)`` 写成所有实现都严格保证的最坏 ``O(n)``；
* C 开放寻址使用合法整数作为空槽哨兵，导致该整数无法正确存储。

知识联系
--------

本题展示了“用最小摘要状态回答未来问题”的基本模式。当前元素只需要知道某个值是否在此前出现过，因此前缀可以压缩成集合。

若题目要求返回首次出现的位置，可以把集合改成“值到下标”的映射；若要求统计出现次数，可以改成“值到计数”的映射；若要求判断距离不超过 ``k`` 的重复，则集合还必须随着窗口移动删除过旧元素。

自检问题
--------

#. 为什么集合中只保存值，不需要保存出现次数？
#. 为什么查询必须发生在插入当前值之前？
#. 若数组存在重复，为什么考虑某个值的第二次出现就足以证明算法一定发现它？
#. 排序方案与哈希方案在时间、空间和输入修改方面有什么差异？
#. 为什么哈希集合的总时间通常写为平均 ``O(n)``？

参考答案
~~~~~~~~

#. 题目只问重复是否存在，第二次出现时立即返回，次数大于一的信息不会再被使用。
#. 先插入会让当前元素命中自身，无法保证两个相等值来自不同下标。
#. 第一次出现已经进入集合，所以第二次出现查询时必然命中。
#. 排序通常为 ``O(n log n)``，原地排序会改写输入；哈希平均为 ``O(n)``，需要 ``O(n)`` 集合空间且可提前返回。
#. 查询和插入平均为 ``O(1)``，碰撞严重时可能退化，严格保证取决于具体实现。