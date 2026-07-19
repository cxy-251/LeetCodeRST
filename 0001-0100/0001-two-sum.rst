0001. Two Sum
=============

题目信息
--------

:题号: 0001
:难度: Easy
:主题: 数组、哈希表
:原题: `LeetCode 0001 <https://leetcode.com/problems/two-sum/>`_
:访问状态: Available
:教学重点: 一次遍历哈希表、补数、各语言映射容器

题目重述
--------

给定一个整数数组和目标值，需要找到两个不同位置，使这两个位置上的数之和等于目标值。
题目保证存在唯一答案，返回这两个位置的下标即可。

Julia 和 R 的数组从 1 开始计数；为了与题目接口保持一致，本题实现仍返回从 0
开始的下标。

自建示例
--------

.. code-block:: text

   输入：nums = [4, 1, 9, 6], target = 10
   输出：[1, 2]
   解释：nums[1] + nums[2] = 1 + 9 = 10

问题抽象
--------

遍历到当前值 ``value`` 时，真正需要寻找的是补数（complement）
``target - value``。如果补数已经出现，哈希表中保存的旧下标与当前下标就是答案。

解法选择
--------

.. list-table::
   :header-rows: 1

   * - 方法
     - 时间复杂度
     - 空间复杂度
     - 定位
   * - 一次遍历哈希表
     - 期望 ``O(n)``
     - ``O(n)``
     - 主解法
   * - 暴力枚举
     - ``O(n²)``
     - ``O(1)``
     - 用于理解优化来源
   * - 排序后双指针
     - ``O(n log n)``
     - ``O(n)``
     - 需要额外保存原下标

主解法：一次遍历哈希表
----------------------

思路
~~~~

哈希表保存“已经遍历过的数值到其下标”的映射。对当前值先查补数，再把当前值
放入表中。查询发生在插入之前，因此同一个数组元素不会被重复使用。

核心不变量
~~~~~~~~~~

处理下标 ``i`` 之前，哈希表只包含区间 ``[0, i)`` 中已经出现的元素。若补数
存在于表中，它一定来自更早的位置，与 ``i`` 是两个不同下标。

正确性依据
~~~~~~~~~~

假设唯一答案位于 ``a < b``。遍历到 ``b`` 时，``nums[a]`` 已经在哈希表中，
而当前计算的补数正是 ``target - nums[b] = nums[a]``，算法会返回 ``a`` 和
``b``。由于只查询过去的元素，算法不会重复使用当前位置。

复杂度
~~~~~~

* 时间复杂度：除 C 的开放寻址实现外，各语言通常为期望 ``O(n)``；
* 空间复杂度：``O(n)``；
* C 版本使用开放寻址哈希表，平均为 ``O(n)``，极端碰撞时可能退化。

核心语言实现
~~~~~~~~~~~~

C
^

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

   int* twoSum(
       int* nums,
       int numsSize,
       int target,
       int* returnSize
   ) {
       size_t capacity = 1;
       while (capacity < (size_t)numsSize * 2U) {
           capacity <<= 1U;  // 2 的幂便于用位运算取模
       }

       HashEntry* table = calloc(capacity, sizeof(HashEntry));
       if (table == NULL) {
           *returnSize = 0;
           return NULL;
       }

       for (int i = 0; i < numsSize; ++i) {
           const int need = target - nums[i];
           size_t slot = hash_int(need) & (capacity - 1U);

           while (table[slot].used) {
               if (table[slot].key == need) {
                   int* answer = malloc(2U * sizeof(int));
                   if (answer == NULL) {
                       free(table);
                       *returnSize = 0;
                       return NULL;
                   }

                   answer[0] = table[slot].index;
                   answer[1] = i;
                   free(table);
                   *returnSize = 2;
                   return answer;
               }
               slot = (slot + 1U) & (capacity - 1U);
           }

           slot = hash_int(nums[i]) & (capacity - 1U);
           while (table[slot].used &&
                  table[slot].key != nums[i]) {
               slot = (slot + 1U) & (capacity - 1U);
           }

           if (!table[slot].used) {
               table[slot].key = nums[i];
               table[slot].index = i;
               table[slot].used = 1;
           }
       }

       free(table);
       *returnSize = 0;
       return NULL;
   }

C++
^^^

.. code-block:: cpp

   class Solution {
   public:
       std::vector<int> twoSum(
           const std::vector<int>& nums,
           int target
       ) {
           std::unordered_map<int, int> seen;

           for (int index = 0;
                index < static_cast<int>(nums.size());
                ++index) {
               const int need = target - nums[index];
               const auto found = seen.find(need);

               if (found != seen.end()) {
                   return {found->second, index};
               }

               seen.emplace(nums[index], index);
           }

           return {};
       }
   };

Python
^^^^^^

.. code-block:: python

   class Solution:
       def twoSum(
           self,
           nums: list[int],
           target: int,
       ) -> list[int]:
           seen: dict[int, int] = {}  # 键是数值，值是旧下标

           for index, value in enumerate(nums):
               need = target - value
               if need in seen:  # ``in`` 查询字典中的键
                   return [seen[need], index]

               seen[value] = index

           return []

Java
^^^^

.. code-block:: java

   class Solution {
       public int[] twoSum(int[] nums, int target) {
           Map<Integer, Integer> seen = new HashMap<>();

           for (int index = 0; index < nums.length; index++) {
               int need = target - nums[index];

               if (seen.containsKey(need)) {
                   return new int[] {seen.get(need), index};
               }

               seen.putIfAbsent(nums[index], index);
           }

           return new int[0];
       }
   }

Rust
^^^^

.. code-block:: rust

   use std::collections::HashMap;

   impl Solution {
       pub fn two_sum(nums: Vec<i32>, target: i32) -> Vec<i32> {
           let mut seen: HashMap<i32, i32> = HashMap::new();

           for (index, value) in nums.into_iter().enumerate() {
               let need = target - value;

               if let Some(&old_index) = seen.get(&need) {
                   return vec![old_index, index as i32];
               }

               // or_insert 保留第一次出现的位置。
               seen.entry(value).or_insert(index as i32);
           }

           Vec::new()
       }
   }

Go
^^

.. code-block:: go

   func twoSum(nums []int, target int) []int {
       seen := make(map[int]int, len(nums))

       for index, value := range nums {
           need := target - value
           if oldIndex, ok := seen[need]; ok {
               return []int{oldIndex, index}
           }

           if _, exists := seen[value]; !exists {
               seen[value] = index
           }
       }

       return []int{}
   }

TypeScript
^^^^^^^^^^

.. code-block:: typescript

   function twoSum(nums: number[], target: number): number[] {
       const seen = new Map<number, number>();

       for (let index = 0; index < nums.length; index += 1) {
           const value = nums[index];
           const need = target - value;
           const oldIndex = seen.get(need);

           // Map.get 可能返回 0，不能直接用真假值判断。
           if (oldIndex !== undefined) {
               return [oldIndex, index];
           }

           if (!seen.has(value)) {
               seen.set(value, index);
           }
       }

       return [];
   }

C#
^^

.. code-block:: csharp

   public class Solution {
       public int[] TwoSum(int[] nums, int target) {
           var seen = new Dictionary<int, int>();

           for (int index = 0; index < nums.Length; index++) {
               int need = target - nums[index];

               if (seen.TryGetValue(need, out int oldIndex)) {
                   return new[] {oldIndex, index};
               }

               seen.TryAdd(nums[index], index);
           }

           return Array.Empty<int>();
       }
   }

Julia
^^^^^

.. code-block:: julia

   function two_sum(
       nums::Vector{Int},
       target::Int,
   )::Vector{Int}
       seen = Dict{Int, Int}()

       for (index, value) in pairs(nums)
           need = target - value
           if haskey(seen, need)
               # Julia 下标从 1 开始，返回值转换为题目要求的 0 基下标。
               return [seen[need], index - 1]
           end

           get!(seen, value, index - 1)
       end

       return Int[]
   end

R
^

.. code-block:: r

   two_sum <- function(nums, target) {
       seen <- new.env(hash = TRUE, parent = emptyenv())

       for (index in seq_along(nums)) {
           value <- nums[[index]]
           need <- target - value
           key <- as.character(need)

           if (exists(key, envir = seen, inherits = FALSE)) {
               old_index <- get(key, envir = seen, inherits = FALSE)
               # R 下标从 1 开始，返回值转换为题目要求的 0 基下标。
               return(c(old_index, index - 1L))
           }

           value_key <- as.character(value)
           if (!exists(value_key, envir = seen, inherits = FALSE)) {
               assign(value_key, index - 1L, envir = seen)
           }
       }

       integer(0)
   }

对照解法：暴力枚举
------------------

暴力方法枚举所有 ``i < j`` 的下标对，空间复杂度为 ``O(1)``。它没有利用“已经
见过哪些值”这一信息，因此时间复杂度为 ``O(n²)``。主解法可以理解为把内层查找
替换为哈希表的期望 ``O(1)`` 查询。

伪代码如下：

.. code-block:: text

   对每个下标 i：
       对每个下标 j，且 j > i：
           如果 nums[i] + nums[j] == target：
               返回 [i, j]

易错点
------

* 必须先查补数，再插入当前值，否则可能把同一个元素使用两次；
* TypeScript 中下标 ``0`` 是合法值，不能用 ``if (oldIndex)`` 判断查询结果；
* Julia 和 R 的自然下标从 1 开始，本题返回值需要转换为 0 基下标；
* C 的开放寻址表必须保证容量为 2 的幂，并处理内存分配失败；
* 排序双指针会改变元素顺序，必须额外保存原始下标。

本题新增知识
------------

* 哈希表（hash table）把补数查询从线性扫描降为期望常数时间；
* 一次遍历时维护“过去元素”的不变量；
* 十种语言中的映射容器及安全查询方式；
* Julia、R 与题目 0 基下标接口之间的转换。

最小自检
--------

#. 为什么查询补数必须发生在插入当前元素之前？
#. 哈希表中需要保存数值本身，还是保存数值对应的下标？
#. TypeScript 为什么不能直接用 ``if (seen.get(need))``？

答案要点
~~~~~~~~

#. 先插入会允许当前位置匹配自己，违反两个下标必须不同的要求；
#. 键保存数值，值必须保存下标，因为题目要求返回下标；
#. 查询结果可能是合法下标 ``0``，而 ``0`` 在真假判断中会被当作假值。
