0217. Contains Duplicate
========================

题目信息
--------

:题号: 0217
:难度: Easy
:主题: 数组、哈希集合、排序
:原题: `LeetCode 0217 <https://leetcode.com/problems/contains-duplicate/>`_
:重点: 任意值至少出现两次、下标必须不同、存在性判断、负数和零同样参与

题目重述
--------

给定整数数组 ``nums``，若数组中存在某个数值至少出现两次，返回 ``true``；若每个数值都只出现一次，返回 ``false``。重复要求来自两个不同数组位置，数值可以是负数、零或正数。

数组长度位于 ``[1, 10^5]``，每个元素位于 ``[-10^9, 10^9]``。题目只判断是否存在任意重复值，不要求返回重复元素、出现次数或下标；函数无需修改输入数组。

自建示例
--------

重复值相隔多个位置：

.. code-block:: text

   输入：nums = [6, 2, 9, 6]
   输出：true
   解释：数值 6 分别出现在下标 0 和 3，因此数组中存在重复元素。

所有元素互不相同：

.. code-block:: text

   输入：nums = [3, -2, 8, 0]
   输出：false
   解释：四个数值各出现一次，没有任何两个不同下标保存相同值。

集合算法
--------

从左到右扫描数组，维护集合 ``seen``：

* 扫描第 ``i`` 个元素前，``seen`` 保存 ``nums[0..i-1]`` 中出现过的所有不同值；
* 若 ``nums[i]`` 已在 ``seen`` 中，则存在更早下标 ``j<i`` 使两值相等，立即返回 ``true``；
* 否则把 ``nums[i]`` 加入集合并继续；
* 扫描结束仍未命中，返回 ``false``。

伪代码：

.. code-block:: text

   seen = empty set
   for value in nums:
       if value in seen:
           return true
       insert value into seen
   return false

核心不变量
----------

扫描位置 ``i`` 之前：

.. code-block:: text

   seen = set(nums[0:i])

并且前缀 ``nums[0:i]`` 中没有重复值。若此前已有重复，算法已经提前返回，不会进入当前状态。

处理 ``nums[i]``：

* 已存在于集合：它与某个前缀元素相等，发现重复；
* 不存在于集合：插入后集合变成 ``set(nums[0:i+1])``，且新前缀仍无重复。

正确性证明
----------

**引理一：集合不变量始终成立。**

初始前缀为空，集合为空。若当前值不在集合中，插入后集合恰好增加该值，对应扩展后的前缀不同值集合。

**引理二：算法返回 ``true`` 时数组确实包含重复值。**

命中集合说明当前值等于某个更早位置的值，两个下标不同。

**引理三：数组包含重复值时算法一定返回 ``true``。**

取某个重复值第二次出现的位置。第一次出现后它已经在集合中，因此第二次扫描时一定命中。

**定理：算法当且仅当数组包含重复值时返回 ``true``。**

由引理二和引理三直接得到。

复杂度
------

* 哈希集合平均查询和插入为 ``O(1)``，总时间复杂度为平均 ``O(n)``；
* 最坏情况下没有重复，需要保存全部 ``n`` 个不同值，额外空间为 ``O(n)``；
* 发现重复后提前返回，实际工作量可能小于 ``n``；
* 输入数组保持不变。

排序替代方案
------------

先排序，再检查相邻元素：

* 时间复杂度通常为 ``O(n log n)``；
* 若允许原地排序，核心额外空间可较小；
* 会改变输入数组顺序；
* 若使用复制后排序，还需要 ``O(n)`` 副本空间。

集合方案优先保证平均线性时间和输入不变；排序方案适合哈希不可用或输入变异可接受的场景。

C++ 实现
--------

.. code-block:: cpp

   class Solution {
   public:
       bool containsDuplicate(std::vector<int>& nums) {
           std::unordered_set<int> seen;
           seen.reserve(nums.size());
           for (int value : nums) {
               if (!seen.insert(value).second) return true;
           }
           return false;
       }
   };

代码分析
--------

扫描到当前值时，``seen`` 恰好保存此前所有位置出现过的值；插入失败说明该值已经在更早位置出现，得到一对不同下标，立即返回真。插入成功则把当前值纳入后续检查。扫描结束仍未发现失败插入时，每个值只出现一次，返回假。这个状态只关心“是否出现过”，不需要保存每个下标。

例如 ``[4,1,7,4]`` 在最后一个元素处第二次插入 4 失败，因此返回真；``[4,1,7]`` 的三次插入都成功，返回假。哈希集合平均查询和插入为常数时间，每个元素处理一次，平均时间复杂度为 ``O(n)``，额外空间复杂度为 ``O(n)``；输入顺序和元素值均不被修改。

十语言实现
----------

C
~

C 标准库没有哈希集合。本实现使用开放寻址和线性探测。容量保持为二的幂，并至少大于元素数量的两倍，避免表装满。

.. code-block:: c

   #include <stdbool.h>
   #include <stdint.h>
   #include <stdlib.h>

   static uint64_t mix64(uint64_t value) {
       value ^= value >> 30;
       value *= UINT64_C(0xbf58476d1ce4e5b9);
       value ^= value >> 27;
       value *= UINT64_C(0x94d049bb133111eb);
       value ^= value >> 31;
       return value;
   }

   bool containsDuplicate(int *nums, int numsSize) {
       if (numsSize < 2) return false;

       size_t capacity = 1;
       while (capacity < (size_t)numsSize * 2) {
           capacity <<= 1;
       }

       int *keys = (int *)malloc(capacity * sizeof(int));
       unsigned char *used = (unsigned char *)calloc(capacity, 1);
       if (keys == NULL || used == NULL) {
           free(keys);
           free(used);
           return false;
       }

       for (int i = 0; i < numsSize; ++i) {
           size_t index = (size_t)(
               mix64((uint64_t)(int64_t)nums[i]) & (capacity - 1)
           );

           while (used[index] != 0) {
               if (keys[index] == nums[i]) {
                   free(keys);
                   free(used);
                   return true;
               }
               index = (index + 1) & (capacity - 1);
           }

           used[index] = 1;
           keys[index] = nums[i];
       }

       free(keys);
       free(used);
       return false;
   }

分配失败时返回 ``false``，这是布尔接口无法表达资源错误的限制；工程接口应提供错误通道。

C++
~~~

.. code-block:: cpp

   class Solution {
   public:
       bool containsDuplicate(const std::vector<int>& nums) {
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

需要 ``<unordered_set>`` 与 ``<vector>``。参数使用常量引用，输入不修改。

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

Python 整数和集合对象有运行时对象开销，但渐近空间仍为 ``O(n)``。

Java
~~~~

.. code-block:: java

   class Solution {
       public boolean containsDuplicate(int[] nums) {
           Set<Integer> seen = new HashSet<>();
           for (int value : nums) {
               if (!seen.add(value)) {
                   return true;
               }
           }
           return false;
       }
   }

需要 ``java.util.HashSet`` 与 ``java.util.Set``。``Integer`` 装箱增加实际内存成本。

Rust
~~~~

.. code-block:: rust

   use std::collections::HashSet;

   impl Solution {
       pub fn contains_duplicate(nums: Vec<i32>) -> bool {
           let mut seen = HashSet::with_capacity(nums.len());
           for value in nums {
               if !seen.insert(value) {
                   return true;
               }
           }
           false
       }
   }

``Vec`` 按值传入，循环消费数组元素；整数实现 ``Copy``，集合保存值副本。

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

``struct{}{}`` 作为集合占位值，不携带额外业务数据。

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

官方整数范围可由 ``number`` 精确表示；输入数组不修改。

C#
~~

.. code-block:: csharp

   public class Solution {
       public bool ContainsDuplicate(int[] nums) {
           var seen = new HashSet<int>();
           foreach (int value in nums) {
               if (!seen.Add(value)) {
                   return true;
               }
           }
           return false;
       }
   }

需要 ``System.Collections.Generic``。``HashSet<int>`` 直接保存值类型。

Julia
~~~~~

.. code-block:: julia

   function contains_duplicate(nums::Vector{Int})::Bool
       seen = Set{Int}()
       sizehint!(seen, length(nums))

       for value in nums
           if value in seen
               return true
           end
           push!(seen, value)
       end
       false
   end

``sizehint!`` 只提供容量提示，不改变集合语义。

R
~

R 的 environment 哈希键必须是字符串，因此将整数值转换为稳定十进制键。前缀 ``v:`` 避免与环境保留绑定命名混淆。

.. code-block:: r

   contains_duplicate <- function(nums) {
     seen <- new.env(hash = TRUE, parent = emptyenv())

     for (value in nums) {
       key <- paste0("v:", format(value, scientific = FALSE, trim = TRUE))
       if (exists(key, envir = seen, inherits = FALSE)) {
         return(TRUE)
       }
       assign(key, TRUE, envir = seen)
     }
     FALSE
   }

官方整数处于精确表示范围；输入向量不修改。

关键易错点
----------

* 只比较相邻输入元素，却没有先排序；
* 把出现次数“恰好两次”误写成重复条件；
* 遇到第一个元素就先判断集合大小，没有建立正确前缀状态；
* 用集合长度小于数组长度作为答案，却额外构造整套集合，失去提前返回；
* 声称哈希集合最坏时间一定为 ``O(n)``；
* 使用原地排序方案却声称输入不修改；
* C 哈希表容量可能装满，导致线性探测无法终止；
* R 直接把任意整数文本当环境键而不考虑名称约束和格式稳定性。

知识联系
--------

本题是“前缀状态 + 当前元素”模式的最小实例。后续问题会增加约束：

* ``0219 Contains Duplicate II``：重复值还必须满足下标距离；
* ``0220 Contains Duplicate III``：同时限制下标距离和数值距离；
* ``0001 Two Sum``：集合升级为“值到下标”的映射；
* 流式去重：集合状态持续跨数据批次保存。

自检问题
--------

#. 集合在扫描位置 ``i`` 前精确表示什么？
#. 为什么第二次出现某值时一定会命中？
#. 集合方案为什么可以提前返回？
#. 排序方案在什么条件下更合适？
#. C 的开放寻址表为什么需要保留空槽？

参考答案
~~~~~~~~

#. 前缀 ``nums[0:i]`` 中出现过的所有不同值。
#. 第一次出现后已经插入集合，第二次查询时该值仍存在。
#. 任意一个重复已经足以确定最终布尔答案。
#. 哈希不可用、输入允许重排，或后续还需要有序数组时。
#. 线性探测依赖遇到未使用槽判断查找失败；表装满会失去终止条件。
