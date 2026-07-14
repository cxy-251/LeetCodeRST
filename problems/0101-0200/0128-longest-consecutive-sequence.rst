0128. Longest Consecutive Sequence
==================================

题目信息
--------

:题号: 0128
:难度: Medium
:主题: 数组、哈希集合、连续整数、去重
:原题: `LeetCode 0128 <https://leetcode.com/problems/longest-consecutive-sequence/>`_
:访问状态: Available
:教学重点: 只从连续段起点扩展、重复值去重、期望线性复杂度

题目重述
--------

给定一个未排序整数数组，返回其中最长连续整数序列的长度。序列中的值必须逐次增加 ``1``，
这些值在原数组中的位置和顺序没有要求。算法目标时间复杂度为 ``O(n)``。

本文采用以下精确契约：

* 数组长度可以为 ``0``；
* 元素位于 ``[-10^9, 10^9]``，可安全表示为 32 位有符号整数；
* 重复值只代表同一个集合元素，不增加序列长度；
* 输入数组只读，算法不排序也不改写调用者可观察的数据；
* 返回最长连续值集合的元素数量，空数组返回 ``0``。

自建示例
--------

无序输入
~~~~~~~~

.. code-block:: text

   nums = [100, 4, 200, 1, 3, 2]
   最长连续序列 = [1, 2, 3, 4]
   输出 = 4

重复值
~~~~~~

.. code-block:: text

   nums = [1, 2, 2, 3]
   输出 = 3

第二个 ``2`` 不会让序列长度变成 ``4``。

包含负数
~~~~~~~~

.. code-block:: text

   nums = [-2, -1, 0, 2]
   输出 = 3

问题抽象
--------

把全部值放入集合后，一个值 ``x`` 是连续段起点，当且仅当集合中不存在 ``x - 1``。
只有起点才向右查询 ``x + 1``、``x + 2``，直到第一个缺失值。

若从每个值都向右扫描，同一长序列会被重复遍历，最坏达到 ``O(n^2)``。
起点判定让每个连续段只被完整扫描一次。

解法选择
--------

.. list-table::
   :header-rows: 1

   * - 方法
     - 时间复杂度
     - 工作空间
     - 定位
   * - 哈希集合 + 起点扫描
     - 期望 ``O(n)``
     - ``O(n)``
     - 主解法；满足目标复杂度
   * - 排序后线性扫描
     - ``O(n log n)``
     - 取决于排序实现
     - 简单稳定，但不满足目标时间
   * - 从每个值向右查找
     - 最坏 ``O(n^2)``
     - ``O(n)``
     - 缺少起点过滤

主解法：只从连续段起点扩展
----------------------------

建立集合
~~~~~~~~

先把所有元素加入哈希集合，自动消除重复值。后续成员查询只关心某个整数是否存在，
不关心它在原数组中出现了几次或位于哪个下标。

起点判定
~~~~~~~~

对集合中的每个唯一值 ``value``：

* 若 ``value - 1`` 也存在，``value`` 位于某个连续段内部，不从这里扫描；
* 若 ``value - 1`` 不存在，``value`` 是该连续段唯一的最小值，从这里向右扩展。

唯一性来自整数全序：一段连续整数只有一个最小值，也只有该值缺少前驱。

向右扩展
~~~~~~~~

从起点令 ``current = value``、``length = 1``。只要 ``current + 1`` 存在，就递增两者。
扩展结束时，``length`` 正好是该完整连续段的大小，用它更新全局最大值。

核心不变量
~~~~~~~~~~

处理集合中的每个值时保持：

* 集合恰好包含输入出现过的全部唯一整数；
* 只有缺少前驱的值会触发完整向右扫描；
* 扫描期间 ``[value, current]`` 中的每个整数都存在于集合；
* ``length = current - value + 1``；
* ``best`` 是已经完成扫描的连续段最大长度；
* 输入数组未被修改。

正确性依据
~~~~~~~~~~

**起点合法性。** 若 ``value - 1`` 不存在，则任何包含 ``value`` 且向左连续延伸的序列都无法更长，
所以 ``value`` 是其所在连续段的最小值。

**内部节点跳过安全。** 若 ``value - 1`` 存在，则 ``value`` 与前驱属于同一连续段。
该段会从更小的唯一起点完整扫描，当前值再次扫描只会重复工作，不会产生新答案。

**扩展完整性。** 循环每次检查下一个整数是否存在。只要存在就纳入当前段；首次缺失时，
任何更大的整数都无法与当前段保持逐次加一的连续性，因此该段已经完整。

**无遗漏。** 任意非空连续段都有唯一最小值，最小值的前驱不在集合，所以算法一定从它开始扫描。

**最优性。** 每个连续段的真实长度都会被计算一次，``best`` 取全部段长度的最大值，
因此等于题目要求的最长长度。

**终止性。** 外层遍历有限集合；内层每次严格增加 ``current``，并在遇到缺失值时结束。

为什么期望总时间是 O(n)
~~~~~~~~~~~~~~~~~~~~~~~~

外层访问每个唯一值一次。内层扫描只会从连续段起点启动；同一集合元素只属于一个连续段，
并且只会在该段的唯一完整扫描中作为 ``current`` 被经过一次。

因此全部内层成功查询的总次数不超过唯一元素数，另有每段一次失败查询。
在哈希集合成员查询期望 ``O(1)`` 的假设下，总时间期望 ``O(n)``。

复杂度与数值边界
~~~~~~~~~~~~~~~~

* 建集与扫描期望时间 ``O(n)``，哈希碰撞下最坏可能退化；
* 集合保存至多 ``n`` 个唯一整数，工作空间 ``O(n)``；
* 返回值是整数，返回载荷 ``O(1)``；
* C 自建开放寻址集合，容量保持为二的幂且负载率不超过二分之一；
* C/C++/C#/Julia 对类型最小值和最大值显式守卫，形成超出官方输入域的防御性扩展；
* Java 使用 ``long`` 计算前驱键，再确认仍在 ``int`` 范围内；
* TypeScript ``number`` 可以精确表示全部 32 位整数及其相邻值；
* R 适配器按官方 32 位输入域转成整数，字符串键只用于哈希环境，不改变数值语义。

核心语言实现
------------

C
~

C 版本遍历哈希表槽位而不是原数组，确保重复输入不会重复扫描同一连续段。

.. code-block:: c

   #include <limits.h>
   #include <stdbool.h>
   #include <stddef.h>
   #include <stdint.h>
   #include <stdlib.h>

   typedef struct {
       int *keys;
       unsigned char *used;
       size_t capacity;
   } IntSet;

   static uint32_t mix_key(int value) {
       uint32_t key = (uint32_t)value;
       key ^= key >> 16;
       key *= UINT32_C(0x7feb352d);
       key ^= key >> 15;
       key *= UINT32_C(0x846ca68b);
       key ^= key >> 16;
       return key;
   }

   static size_t find_slot(const IntSet *set, int value) {
       size_t mask = set->capacity - 1U;
       size_t slot = (size_t)mix_key(value) & mask;
       while (set->used[slot] != 0U && set->keys[slot] != value) {
           slot = (slot + 1U) & mask;
       }
       return slot;
   }

   static bool set_contains(const IntSet *set, int value) {
       size_t slot = find_slot(set, value);
       return set->used[slot] != 0U;
   }

   static void set_insert(IntSet *set, int value) {
       size_t slot = find_slot(set, value);
       if (set->used[slot] == 0U) {
           set->used[slot] = 1U;
           set->keys[slot] = value;
       }
   }

   int longestConsecutive(int *nums, int numsSize) {
       if (numsSize == 0) {
           return 0;
       }

       size_t capacity = 1U;
       size_t target = (size_t)numsSize * 2U;
       while (capacity < target) {
           capacity <<= 1U;
       }

       IntSet set = {
           .keys = malloc(capacity * sizeof(*set.keys)),
           .used = calloc(capacity, sizeof(*set.used)),
           .capacity = capacity,
       };
       if (set.keys == NULL || set.used == NULL) {
           free(set.keys);
           free(set.used);
           return 0;
       }

       for (int i = 0; i < numsSize; ++i) {
           set_insert(&set, nums[i]);
       }

       int best = 0;
       for (size_t slot = 0; slot < capacity; ++slot) {
           if (set.used[slot] == 0U) {
               continue;
           }
           int value = set.keys[slot];
           if (value != INT_MIN && set_contains(&set, value - 1)) {
               continue;
           }

           int current = value;
           int length = 1;
           while (current != INT_MAX &&
                  set_contains(&set, current + 1)) {
               ++current;
               ++length;
           }
           if (length > best) {
               best = length;
           }
       }

       free(set.keys);
       free(set.used);
       return best;
   }

C++
~~~

.. code-block:: cpp

   #include <climits>
   #include <unordered_set>
   #include <vector>

   class Solution {
   public:
       int longestConsecutive(std::vector<int>& nums) {
           std::unordered_set<int> values(nums.begin(), nums.end());
           int best = 0;

           for (int value : values) {
               if (value != INT_MIN && values.contains(value - 1)) {
                   continue;
               }

               int current = value;
               int length = 1;
               while (current != INT_MAX &&
                      values.contains(current + 1)) {
                   ++current;
                   ++length;
               }
               if (length > best) {
                   best = length;
               }
           }
           return best;
       }
   };

Python
~~~~~~

.. code-block:: python

   class Solution:
       def longestConsecutive(self, nums: list[int]) -> int:
           values = set(nums)
           best = 0

           for value in values:
               if value - 1 in values:
                   continue

               current = value
               length = 1
               while current + 1 in values:
                   current += 1
                   length += 1
               best = max(best, length)

           return best

Java
~~~~

.. code-block:: java

   import java.util.HashSet;
   import java.util.Set;

   class Solution {
       public int longestConsecutive(int[] nums) {
           Set<Integer> values = new HashSet<>();
           for (int value : nums) {
               values.add(value);
           }

           int best = 0;
           for (int value : values) {
               long predecessor = (long) value - 1L;
               if (predecessor >= Integer.MIN_VALUE &&
                   values.contains((int) predecessor)) {
                   continue;
               }

               int current = value;
               int length = 1;
               while (current != Integer.MAX_VALUE &&
                      values.contains(current + 1)) {
                   ++current;
                   ++length;
               }
               best = Math.max(best, length);
           }
           return best;
       }
   }

Rust
~~~~

.. code-block:: rust

   use std::collections::HashSet;

   impl Solution {
       pub fn longest_consecutive(nums: Vec<i32>) -> i32 {
           let values: HashSet<i32> = nums.into_iter().collect();
           let mut best = 0_i32;

           for &value in &values {
               if value.checked_sub(1).is_some_and(|previous| {
                   values.contains(&previous)
               }) {
                   continue;
               }

               let mut current = value;
               let mut length = 1_i32;
               while let Some(next) = current.checked_add(1) {
                   if !values.contains(&next) {
                       break;
                   }
                   current = next;
                   length += 1;
               }
               best = best.max(length);
           }
           best
       }
   }

Go
~~

.. code-block:: go

   func longestConsecutive(nums []int) int {
       values := make(map[int]struct{}, len(nums))
       for _, value := range nums {
           values[value] = struct{}{}
       }

       best := 0
       for value := range values {
           if _, ok := values[value-1]; ok {
               continue
           }

           current := value
           length := 1
           for {
               if _, ok := values[current+1]; !ok {
                   break
               }
               current++
               length++
           }
           if length > best {
               best = length
           }
       }
       return best
   }

TypeScript
~~~~~~~~~~

.. code-block:: typescript

   function longestConsecutive(nums: number[]): number {
       const values = new Set(nums);
       let best = 0;

       for (const value of values) {
           if (values.has(value - 1)) {
               continue;
           }

           let current = value;
           let length = 1;
           while (values.has(current + 1)) {
               current++;
               length++;
           }
           best = Math.max(best, length);
       }
       return best;
   }

C#
~~

.. code-block:: csharp

   using System;
   using System.Collections.Generic;

   public class Solution {
       public int LongestConsecutive(int[] nums) {
           var values = new HashSet<int>(nums);
           int best = 0;

           foreach (int value in values) {
               if (value != int.MinValue && values.Contains(value - 1)) {
                   continue;
               }

               int current = value;
               int length = 1;
               while (current != int.MaxValue &&
                      values.Contains(current + 1)) {
                   current++;
                   length++;
               }
               best = Math.Max(best, length);
           }
           return best;
       }
   }

Julia
~~~~~

.. code-block:: julia

   function longest_consecutive(nums::Vector{Int})::Int
       values = Set(nums)
       best = 0

       for value in values
           if value != typemin(Int) && (value - 1) in values
               continue
           end

           current = value
           length = 1
           while current != typemax(Int) && (current + 1) in values
               current += 1
               length += 1
           end
           best = max(best, length)
       end
       return best
   end

R
~

R 的整数输入按官方范围安全转换。哈希环境的键加前缀，避免把负号或数值文本与其他名称语义混淆。

.. code-block:: r

   longest_consecutive <- function(nums) {
     values <- unique(as.integer(nums))
     if (length(values) == 0L) {
       return(0L)
     }

     present <- new.env(hash = TRUE, parent = emptyenv())
     key_of <- function(value) paste0("k", value)
     for (value in values) {
       assign(key_of(value), TRUE, envir = present)
     }

     best <- 0L
     for (value in values) {
       if (exists(key_of(value - 1L), envir = present,
                  inherits = FALSE)) {
         next
       }

       current <- value
       length <- 1L
       while (exists(key_of(current + 1L), envir = present,
                     inherits = FALSE)) {
         current <- current + 1L
         length <- length + 1L
       }
       best <- max(best, length)
     }
     return(best)
   }

关键边界与易错点
----------------

* 重复值必须先按集合语义去重；
* 只从缺少 ``value - 1`` 的值开始扫描；
* 原数组顺序与答案无关，不能把题目误解为最长连续子数组；
* 空输入返回 ``0``；
* 若从每个值都向右扫描，最坏复杂度会退化到 ``O(n^2)``；
* 固定宽整数语言需要防止最小值减一和最大值加一溢出；
* 哈希集合给出的是期望线性时间，不应声称无条件最坏 ``O(n)``；
* C 不能遍历原数组重复启动相同序列，否则大量重复值会放大工作量。

验证证据
--------

本题使用排序去重后的线性扫描作为独立基准。验证覆盖：

* Python 穷举长度 ``0`` 至 ``7``、值域 ``[-2, 2]`` 的 97,656 个数组，并完成 5000 组随机对拍；
* C 与 C++ 各 1000 组随机对拍，并通过严格警告；
* C 与 C++ 通过 AddressSanitizer 与 UndefinedBehaviorSanitizer；
* Java、Go、TypeScript 各 1000 组随机对拍；
* Rust、C#、Julia、R 完成接口、整数边界、集合与作用域静态检查；
* RST 解析、十语言代码块数量、TOML 和 100 列代码硬限制检查通过。

知识更新
--------

``algorithm.consecutive_sequence_start_filter``
   仅当 ``value - 1`` 缺失时扫描连续段，使每个连续段只被完整遍历一次。

``proof.unique_minimum_represents_run``
   任意非空连续整数段有唯一最小值，且只有它缺少集合内前驱，因此起点与连续段一一对应。

``complexity.hash_expected_linear``
   哈希成员查询通常是期望 ``O(1)``；完整算法期望 ``O(n)``，对抗性碰撞下最坏界需要单独说明。

关联题目
--------

* `0127. Word Ladder <0127-word-ladder.rst>`_：同样使用哈希集合避免重复状态，但状态空间是字符串图；
* 排序方案可作为本题独立验证基准，但主解法利用集合把排序成本降为期望线性。

最小自检
--------

#. 为什么 ``value - 1`` 存在时可以跳过当前值？
#. 为什么全部内层成功查询总数是 ``O(n)``，而不是每个起点各 ``O(n)``？
#. 重复值为什么不能增加序列长度？
#. 固定宽整数语言需要守卫哪两个表达式？

答案要点
~~~~~~~~

#. 当前值位于某段内部，该段会由更小的唯一起点完整扫描。
#. 只有每段唯一最小值启动扫描，每个唯一元素只在所属段中被经过一次。
#. 题目要求连续整数集合，不是数组位置或出现次数。
#. ``value - 1`` 与 ``current + 1`` 可能在类型边界溢出。
