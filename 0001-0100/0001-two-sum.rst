0001. Two Sum
=============

题目信息
--------

:题号: 0001
:难度: Easy
:主题: 数组、哈希表、排序、双指针
:原题: `LeetCode 0001 <https://leetcode.com/problems/two-sum/>`_
:教学重点: 二元组搜索、原始下标保留、前缀补数查询、一次遍历哈希表

题目重述
--------

给定整数数组 ``nums`` 和整数 ``target``，需要找到两个不同下标 ``i`` 和 ``j``，
使 ``nums[i] + nums[j] == target``，并返回这两个零基下标。

数组长度范围为 ``[2, 10^4]``，元素和目标值位于 ``[-10^9, 10^9]``。平台保证
恰好存在一个有效答案，两个下标的返回顺序均可。实现只读取输入数组，不改变元素
内容或排列。Julia 和 R 的容器使用一基索引，返回结果仍转换为题目要求的零基下标。

自建示例
--------

普通补数命中：

.. code-block:: text

   输入：nums = [4, 1, 9, 6], target = 10
   输出：[1, 2]
   解释：nums[1] + nums[2] = 1 + 9 = 10

相同数值必须来自不同位置：

.. code-block:: text

   输入：nums = [3, 3], target = 6
   输出：[0, 1]
   解释：两个 3 的数值相同，但下标不同；当前位置不能与自己配对。

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
               items.emplace_back(nums[index], index);  // 排序前保留原始下标
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
                   ++left;  // 当前最小值过小，只能增大左端
               } else {
                   --right;  // 当前最大值过大，只能减小右端
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
               const auto found = seen.find(need);  // 先查补数，再记录当前值

               if (found != seen.end()) {
                   return {found->second, index};
               }

               seen.emplace(nums[index], index);  // 保留该数值第一次出现的位置
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

问题抽象
~~~~~~~~

这道题是在无序数组中寻找一个满足固定和值的下标对。暴力方法直接枚举所有
``i < j``；排序方法把数值变成有序序列，从而用左右指针排除不可能区间；哈希方法
则把问题改写为前缀查询：

处理下标 ``i`` 时，只需判断前缀 ``[0, i)`` 中是否出现过补数
``target - nums[i]``。因此主解法维护“已处理数值到其原始下标”的映射，每次完成
一次期望常数时间的补数查询。

各解法说明
~~~~~~~~~~

``bruteForce`` 枚举每个 ``left`` 与其后的所有 ``right``。它直接覆盖全部合法下标
对，不需要额外数据结构，但同一个补数会在不同循环中被反复查找。

``sortAndTwoPointers`` 先建立 ``(数值, 原始下标)`` 数组并按数值排序。若左右端之和
小于目标值，继续保留当前左端不可能得到更大的和，因此左指针右移；若和大于目标值，
右指针左移。排序提供单调性，但需要复制数据并保留原始下标。

``onePassHash`` 在扫描过程中保存已经出现的值。当前值只与过去的元素匹配，补数查询
成功时即可返回两个原始下标。它用 ``O(n)`` 工作空间消除了内层线性扫描。

解法对比与主解法选择
~~~~~~~~~~~~~~~~~~~~

.. list-table::
   :header-rows: 1

   * - 方法
     - 时间复杂度
     - 工作空间
     - 实际代价
   * - 暴力枚举
     - ``O(n²)``
     - ``O(1)``
     - 对每个位置重新扫描后续元素
   * - 排序双指针
     - ``O(n log n)``
     - ``O(n)``
     - 复制并排序 ``(数值, 原始下标)`` 数组
   * - 一次遍历哈希表
     - 期望 ``O(n)``
     - ``O(n)``
     - 依赖哈希表的平均常数时间查询

九语言实现统一采用一次遍历哈希表。它保留原数组顺序，直接返回原始下标，并在标准
哈希假设下获得最低的期望时间复杂度。

主解法
~~~~~~

``seen`` 保存当前下标之前出现过的数值及其第一次出现位置。处理 ``index`` 时先计算
``need = target - nums[index]`` 并查询 ``seen``；命中时，旧下标与 ``index`` 必然
不同，可以立即返回。未命中后才记录当前值，因此 ``[3, 3]`` 这类输入会在处理第二个
``3`` 时找到第一个 ``3``，而不会让第一个元素与自己配对。

假设唯一答案位于 ``a < b``。扫描到 ``b`` 之前，``nums[a]`` 已经写入 ``seen``；
此时 ``need == nums[a]``，查询必然命中，所以算法不会遗漏答案。返回的旧下标来自
``[0, b)``，当前下标为 ``b``，并且两数之和经过补数等式确认，因此不会返回非法下标对。

在标准哈希实现下，每个元素执行一次期望 ``O(1)`` 查询和写入，总时间为期望
``O(n)``，工作空间为 ``O(n)``。极端哈希碰撞下，实际最坏时间取决于各语言容器的
冲突处理策略；返回数组只包含两个下标，占用 ``O(1)`` 结果空间。

九语言实现
----------

C
~

C 标准库没有哈希表，下面使用装载率不超过一半的开放寻址表。``find_slot`` 通过线性
探测返回目标键所在槽位，或第一个可写入的空槽位。

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
       HashEntry* table,
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
           capacity <<= 1U;  // 2 的幂支持位掩码取模
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

           if (!table[value_slot].used) {
               table[value_slot].key = nums[index];
               table[value_slot].index = index;  // 保留第一次出现的位置
               table[value_slot].used = 1U;
           }
       }

       free(table);
       return NULL;
   }

开放寻址表的平均查询和写入为 ``O(1)``，因此平均总时间为 ``O(n)``；极端碰撞时可能
退化为 ``O(n²)``。表容量为 ``O(n)``，返回数组由调用者负责释放。

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

               seen.setdefault(value, index)  # 保留第一次出现的位置

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

               seen.putIfAbsent(nums[index], index);  // 保留第一次出现的位置
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

               seen.entry(value).or_insert(index as i32); // 保留第一次出现的位置
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

           if _, exists := seen[value]; !exists {
               seen[value] = index // 保留第一次出现的位置
           }
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

           if (!seen.has(value)) {
               seen.set(value, index); // 保留第一次出现的位置
           }
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

               seen.TryAdd(nums[index], index); // 保留第一次出现的位置
           }

           return Array.Empty<int>();
       }
   }

Julia
~~~~~

Julia 使用一基循环下标，写入哈希表和返回结果时转换为零基下标。

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

           get!(seen, value, index - 1) # 保留第一次出现的零基下标
       end

       return Int[]
   end

R
~

R 使用环境作为哈希表，并将数值转换为环境键。循环采用一基下标，保存和返回时统一
转换为零基下标。

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
           if (!exists(value_key, envir = seen, inherits = FALSE)) {
               assign(value_key, index - 1L, envir = seen) # 保留第一次出现的位置
           }
       }

       integer(0)
   }
