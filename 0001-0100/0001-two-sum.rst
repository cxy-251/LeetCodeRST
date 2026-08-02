0001. Two Sum
=============

题目信息
--------

:题号: 0001
:难度: Easy
:主题: 数组、哈希表、排序、双指针
:原题: `LeetCode 0001 <https://leetcode.com/problems/two-sum/>`_
:重点: 二元组搜索空间、补数等价转换、单调排除、历史前缀索引

题目重述
--------

给定整数数组 ``nums`` 和整数 ``target``，需要找到两个不同下标 ``i`` 和 ``j``，使
``nums[i] + nums[j] == target``，并返回这两个零基下标。

数组长度范围为 ``[2, 10^4]``，元素和目标值位于 ``[-10^9, 10^9]``。题目不保证数组有序，
也不要求返回的两个下标按升序排列。平台保证恰好存在一个有效答案，同一个位置不能使用两次。

自建示例
--------

普通补数命中：

.. code-block:: text

   输入：nums = [4, 1, 9, 5], target = 10
   输出：[1, 2]
   解释：nums[1] + nums[2] = 1 + 9 = 10

相同数值来自不同位置：

.. code-block:: text

   输入：nums = [4, 1, 4, 10], target = 8
   输出：[0, 2]
   解释：两个 4 的数值相同，但下标不同；当前位置不能与自己配对。

C++ 实现
--------

.. code-block:: cpp

   #include <algorithm>
   #include <unordered_map>
   #include <utility>
   #include <vector>

   class Solution {
   private:
       std::vector<int> bruteForce(
           const std::vector<int>& nums,
           int target
       ) {
           for (int left = 0; left < static_cast<int>(nums.size()); ++left) {
               for (int right = left + 1;
                    right < static_cast<int>(nums.size());
                    ++right) {
                   if (nums[left] + nums[right] == target) {
                       return {left, right};
                   }
               }
           }
           return {};
       }

       std::vector<int> sortAndTwoPointers(
           const std::vector<int>& nums,
           int target
       ) {
           std::vector<std::pair<int, int>> items;
           items.reserve(nums.size());

           for (int index = 0;
                index < static_cast<int>(nums.size());
                ++index) {
               items.emplace_back(nums[index], index);  // 排序副本同时保留原始下标
           }

           std::sort(items.begin(), items.end());

           int left = 0;
           int right = static_cast<int>(items.size()) - 1;

           while (left < right) {
               const long long sum =
                   static_cast<long long>(items[left].first) +
                   items[right].first;

               if (sum == target) {
                   return {items[left].second, items[right].second};
               }
               if (sum < target) {
                   ++left;  // 当前左值与区间最大值配对仍过小，可排除该左值
               } else {
                   --right;  // 当前右值与区间最小值配对仍过大，可排除该右值
               }
           }

           return {};
       }

       std::vector<int> onePassHash(
           const std::vector<int>& nums,
           int target
       ) {
           std::unordered_map<int, int> seen;
           seen.reserve(nums.size());

           for (int index = 0;
                index < static_cast<int>(nums.size());
                ++index) {
               const int need = target - nums[index];
               const auto found = seen.find(need);  // 查询范围只包含历史前缀

               if (found != seen.end()) {
                   return {found->second, index};
               }

               seen[nums[index]] = index;  // 保存一个可用的历史下标
           }

           return {};
       }

   public:
       std::vector<int> twoSum(std::vector<int>& nums, int target) {
           return onePassHash(nums, target);  // 标准入口采用期望 O(n) 的主解法
       }
   };

题解
----

原始搜索空间：所有不同下标对
~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

最直接的思路是检查所有 ``i < j`` 的下标对。长度为 ``n`` 的数组共有：

.. math::

   \binom{n}{2} = \frac{n(n - 1)}{2}

个候选对。``bruteForce`` 的外层固定左下标，内层枚举其后的右下标，每个不同下标对
恰好检查一次，因此一定能覆盖答案。

它的重复工作在于：固定一个新位置后，仍然要逐个访问其他位置，反复询问“目标补数
是否存在”。数组本身没有提供按数值直接定位下标的能力，所以一次补数查找需要线性扫描，
全部候选合计形成二次时间。

等价转换：从求和条件到补数查询
~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

对任意两个位置，题目条件：

.. math::

   nums[i] + nums[j] = target

可以改写为：

.. math::

   nums[i] = target - nums[j]

当扫描到当前下标 ``j`` 时，当前值已经确定，真正需要回答的问题变成：

   前缀 ``[0, j)`` 中是否出现过数值 ``target - nums[j]``；若出现，它位于哪个下标？

这一步转换把“枚举两个位置”拆成“顺序选择当前位置”和“查询一个指定数值”。排序双指针
通过排序获得可批量排除候选的单调性；一次遍历哈希表则直接为历史前缀建立按数值查询的
索引。

排序双指针：利用单调性排除整组候选
~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

``sortAndTwoPointers`` 先复制出 ``(数值, 原始下标)``。排序会改变元素位置，而题目要求
返回原始下标，所以排序对象必须同时保存原始位置；当前实现对副本排序，调用者的输入数组
保持原状。

排序后令 ``left`` 指向剩余区间最小值，``right`` 指向最大值：

* 若当前和小于 ``target``，那么固定 ``items[left]``，它与区间最大值
  ``items[right]`` 配对仍然过小；改用区间内任何更小的右值只会让和继续减小。因此所有
  以当前 ``left`` 为一端的剩余候选都不可能成为答案，可以一次性右移 ``left``；
* 若当前和大于 ``target``，固定 ``items[right]``，它与区间最小值
  ``items[left]`` 配对仍然过大；改用任何更大的左值只会让和继续增大。因此所有以当前
  ``right`` 为一端的剩余候选都可以一次性排除，左移 ``right``；
* 若当前和等于 ``target``，两个元素保存的原始下标就是答案。

两个指针每次移动都基于有序性排除一整组不可能候选，而不是只检查并放弃一个下标对。

哈希表：为历史前缀建立反向索引
~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

主解法需要同时回答“补数是否出现过”和“补数位于哪个下标”。集合只能回答成员是否存在，
无法直接返回题目要求的下标，因此使用映射：

.. code-block:: text

   键：已经处理过的数值
   值：该数值在历史前缀中的一个下标

处理 ``index`` 之前，``seen`` 只描述前缀 ``[0, index)``。算法先查询 ``need``，命中时
表中的下标一定小于当前下标，两者天然是不同位置；查询未命中后再写入当前值，使当前元素
从下一轮开始进入历史前缀。

算法成立只要求 ``seen[value]`` 保存一个有效的历史下标。保存第一次出现位置、最近一次
出现位置或其他历史位置都能组成合法下标对。当前 C++ 实现直接覆盖旧值，因此保存最近一次
历史下标；查询与写入的先后顺序才是避免当前位置匹配自己的关键条件。

主解法状态演化
~~~~~~~~~~~~~~

使用自建示例 ``nums = [4, 1, 4, 10]``、``target = 8``：

.. list-table::
   :header-rows: 1

   * - ``index``
     - ``value``
     - ``need``
     - 查询前的 ``seen``
     - 动作
   * - 0
     - 4
     - 4
     - ``{}``
     - 未命中，写入 ``4 -> 0``
   * - 1
     - 1
     - 7
     - ``{4: 0}``
     - 未命中，写入 ``1 -> 1``
   * - 2
     - 4
     - 4
     - ``{4: 0, 1: 1}``
     - 命中 ``4 -> 0``，返回 ``[0, 2]``

第一轮处理下标 0 时，哈希表仍为空，所以该位置不能匹配自己。第二个 4 到达时，第一个 4
已经属于历史前缀，查询才能得到两个不同下标。

解法对比与主解法选择
~~~~~~~~~~~~~~~~~~~~

.. list-table::
   :header-rows: 1

   * - 方法
     - 时间复杂度
     - 工作空间
     - 优化依据
   * - 暴力枚举
     - ``O(n²)``
     - ``O(1)``
     - 逐个检查全部 ``n(n - 1) / 2`` 个下标对
   * - 排序双指针
     - ``O(n log n)``
     - ``O(n)``
     - 利用有序性批量排除固定左端或右端的候选
   * - 一次遍历哈希表
     - 期望 ``O(n)``
     - ``O(n)``
     - 把历史前缀中的补数查询变为期望常数时间

本文 C++ 主解法采用一次遍历哈希表。它在顺序扫描过程中直接维护题目需要的反向索引，不
需要排序，也能立即返回原始下标。

为什么历史前缀查询不会重复位置或遗漏答案
~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

在每轮处理 ``index`` 之前，维持以下性质：``seen`` 中每个键都来自前缀
``[0, index)``，其值是该键在该前缀中的一个有效下标。

初始时 ``index = 0``，历史前缀为空，``seen`` 也为空，性质成立。若当前补数未命中，
写入 ``nums[index] -> index`` 后，映射覆盖的范围扩展到 ``[0, index]``，正好成为下一轮
需要的历史前缀，性质继续成立。

假设唯一答案位于 ``a < b``。处理 ``b`` 之前，位置 ``a`` 已经进入历史前缀，所以
``seen`` 中保存着数值 ``nums[a]`` 的某个历史下标。此时：

.. math::

   need = target - nums[b] = nums[a]

查询必然命中。返回的旧下标小于 ``b``，与当前下标不同；键值等于 ``need``，所以两处数值
之和等于 ``target``，返回结果合法。由答案的较大下标 ``b`` 必然被扫描到，算法也不会遗漏
答案。

复杂度来源
~~~~~~~~~~

``bruteForce`` 检查 ``n(n - 1) / 2`` 个候选对，每次只做常数工作，因此时间复杂度为
``O(n²)``，工作空间为 ``O(1)``。

``sortAndTwoPointers`` 构造 ``n`` 个 ``(数值, 原始下标)`` 对需要 ``O(n)`` 时间和空间；
排序需要 ``O(n log n)`` 时间；两个指针总共至多移动 ``n - 1`` 次，需要 ``O(n)`` 时间。
总时间由排序主导，为 ``O(n log n)``，工作空间为 ``O(n)``。

``onePassHash`` 对每个元素执行一次哈希查询，并在未返回时执行一次写入。标准哈希表的查询
和写入期望为 ``O(1)``，因此总时间为期望 ``O(n)``；最多保存 ``n`` 个不同键，工作空间为
``O(n)``。极端碰撞时，实际最坏时间取决于容器的冲突处理策略。返回结果固定包含两个下标，
结果空间为 ``O(1)``。

九语言实现
----------

C
~

C 标准库没有哈希表，下面使用开放寻址和线性探测。容量取不小于 ``2n`` 的最小二次幂，
最多插入 ``n`` 个不同键，因此装载率不超过一半。表中没有删除操作，探测遇到空槽即可确定
目标键不存在。

.. code-block:: c

   #include <stdint.h>
   #include <stdlib.h>

   typedef struct {
       int key;
       int index;
       unsigned char used;
   } HashEntry;

   static size_t hash_int(int key) {
       uint32_t value = (uint32_t)key;
       value ^= value >> 16;
       value *= 0x7feb352dU;
       value ^= value >> 15;
       return (size_t)value;
   }

   static size_t find_slot(
       const HashEntry* table,
       size_t capacity,
       int key
   ) {
       size_t slot = hash_int(key) & (capacity - 1U);

       while (table[slot].used && table[slot].key != key) {
           slot = (slot + 1U) & (capacity - 1U);  // 线性探测下一个槽位
       }

       return slot;
   }

   int* twoSum(
       int* nums,
       int numsSize,
       int target,
       int* returnSize
   ) {
       *returnSize = 0;

       size_t capacity = 1U;
       while (capacity < (size_t)numsSize * 2U) {
           capacity <<= 1U;  // 二次幂容量支持位掩码取模
       }

       HashEntry* table = calloc(capacity, sizeof(HashEntry));
       if (table == NULL) {
           return NULL;
       }

       for (int index = 0; index < numsSize; ++index) {
           const int need = target - nums[index];
           const size_t need_slot = find_slot(table, capacity, need);

           if (table[need_slot].used) {
               int* answer = malloc(2U * sizeof(int));
               if (answer == NULL) {
                   free(table);
                   return NULL;
               }

               answer[0] = table[need_slot].index;
               answer[1] = index;
               *returnSize = 2;

               free(table);
               return answer;
           }

           const size_t value_slot =
               find_slot(table, capacity, nums[index]);
           table[value_slot].key = nums[index];
           table[value_slot].index = index;  // 当前实现保存最近一次历史下标
           table[value_slot].used = 1U;
       }

       free(table);
       return NULL;
   }

开放寻址表在装载率不超过一半时保持较短的期望探测序列，因此平均总时间为 ``O(n)``；
极端碰撞时，单次探测可能达到 ``O(n)``，总时间可能退化为 ``O(n²)``。表占用 ``O(n)``
空间，成功返回的数组由调用者负责释放。

Python
~~~~~~

.. code-block:: python

   class Solution:
       def twoSum(
           self,
           nums: list[int],
           target: int,
       ) -> list[int]:
           seen: dict[int, int] = {}

           for index, value in enumerate(nums):
               need = target - value
               if need in seen:
                   return [seen[need], index]

               seen[value] = index  # 保存最近一次历史下标

           return []

Java
~~~~

.. code-block:: java

   import java.util.HashMap;
   import java.util.Map;

   class Solution {
       public int[] twoSum(int[] nums, int target) {
           Map<Integer, Integer> seen = new HashMap<>();

           for (int index = 0; index < nums.length; index++) {
               int need = target - nums[index];

               if (seen.containsKey(need)) {
                   return new int[] {seen.get(need), index};
               }

               seen.put(nums[index], index);  // 保存最近一次历史下标
           }

           return new int[0];
       }
   }

Rust
~~~~

.. code-block:: rust

   use std::collections::HashMap;

   impl Solution {
       pub fn two_sum(nums: Vec<i32>, target: i32) -> Vec<i32> {
           let mut seen: HashMap<i32, i32> =
               HashMap::with_capacity(nums.len());

           for (index, value) in nums.into_iter().enumerate() {
               let need = target - value;

               if let Some(&old_index) = seen.get(&need) {
                   return vec![old_index, index as i32];
               }

               seen.insert(value, index as i32);  // 保存最近一次历史下标
           }

           Vec::new()
       }
   }

Go
~~

.. code-block:: go

   func twoSum(nums []int, target int) []int {
       seen := make(map[int]int, len(nums))

       for index, value := range nums {
           need := target - value
           if oldIndex, ok := seen[need]; ok {
               return []int{oldIndex, index}
           }

           seen[value] = index // 保存最近一次历史下标
       }

       return []int{}
   }

TypeScript
~~~~~~~~~~

.. code-block:: typescript

   function twoSum(nums: number[], target: number): number[] {
       const seen = new Map<number, number>();

       for (let index = 0; index < nums.length; index += 1) {
           const value = nums[index];
           const need = target - value;
           const oldIndex = seen.get(need);

           if (oldIndex !== undefined) { // 下标 0 也是有效查询结果
               return [oldIndex, index];
           }

           seen.set(value, index); // 保存最近一次历史下标
       }

       return [];
   }

C#
~~

.. code-block:: csharp

   using System;
   using System.Collections.Generic;

   public class Solution {
       public int[] TwoSum(int[] nums, int target) {
           var seen = new Dictionary<int, int>();

           for (int index = 0; index < nums.Length; index++) {
               int need = target - nums[index];

               if (seen.TryGetValue(need, out int oldIndex)) {
                   return new[] {oldIndex, index};
               }

               seen[nums[index]] = index; // 保存最近一次历史下标
           }

           return Array.Empty<int>();
       }
   }

Julia
~~~~~

Julia 的循环下标从一开始，映射中保存和最终返回的下标统一转换为题目要求的零基下标。

.. code-block:: julia

   function two_sum(
       nums::Vector{Int},
       target::Int,
   )::Vector{Int}
       seen = Dict{Int, Int}()

       for (index, value) in pairs(nums)
           need = target - value
           if haskey(seen, need)
               return [seen[need], index - 1] # 返回零基下标
           end

           seen[value] = index - 1 # 保存最近一次历史下标
       end

       return Int[]
   end

R
~

R 使用环境作为哈希表，并将整数转换为环境键。循环采用一基下标，映射中保存和最终返回的
下标统一转换为零基下标。

.. code-block:: r

   two_sum <- function(nums, target) {
       seen <- new.env(hash = TRUE, parent = emptyenv())

       for (index in seq_along(nums)) {
           value <- nums[[index]]
           need_key <- as.character(target - value)

           if (exists(need_key, envir = seen, inherits = FALSE)) {
               old_index <- get(need_key, envir = seen, inherits = FALSE)
               return(c(old_index, index - 1L)) # 返回零基下标
           }

           value_key <- as.character(value)
           assign(value_key, index - 1L, envir = seen) # 保存最近一次历史下标
       }

       integer(0)
   }
