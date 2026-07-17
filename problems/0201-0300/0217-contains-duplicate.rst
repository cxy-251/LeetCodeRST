0217. Contains Duplicate
========================

题目信息
--------

:题号: 0217
:难度: Easy
:主题: 哈希集合、流式扫描、不变量、开放寻址
:原题: `LeetCode 0217 <https://leetcode.com/problems/contains-duplicate/>`_
:访问状态: Available
:教学重点: 已见集合不变量、先查询后插入、哈希平均与最坏复杂度、C 开放寻址、R 整数键

精确契约
--------

给定整数数组 ``nums``，判断是否存在两个不同下标 ``i`` 与 ``j``，满足 ``nums[i]=nums[j]``。

本文采用以下合同：

* 相同值必须来自两个不同数组位置；
* 重复元素可以相邻，也可以相隔很远；
* 负数、零和整数边界值都按整数值比较；
* 输入数组保持只读，不排序、不改写元素；
* 存在至少一对重复值时返回 ``true``，全部元素互不相同时返回 ``false``；
* 官方输入至少包含一个元素；本文把空数组扩展为返回 ``false``。

这里判断的是“是否存在重复值”，不需要返回重复值、下标或重复次数。找到第一对以后即可提前结束。

自建示例
--------

远距离重复
~~~~~~~~~~

.. code-block:: text

   nums = [1,2,3,1]
   answer = true

扫描最后一个 1 时，集合中已经保存第一个 1。

全部不同
~~~~~~~~

.. code-block:: text

   nums = [1,2,3,4]
   answer = false

扫描结束仍未命中集合，说明每个值只出现一次。

相邻重复
~~~~~~~~

.. code-block:: text

   nums = [1,1]
   answer = true

第二个元素立即命中。

单元素与空数组扩展
~~~~~~~~~~~~~~~~~~

.. code-block:: text

   [7] -> false
   []  -> false

只有一个位置时，不可能找到两个不同下标。

负数、零和极值
~~~~~~~~~~~~~~

.. code-block:: text

   [-1,0,2,-1]                    -> true
   [INT_MIN,0,INT_MAX,INT_MIN]    -> true
   [INT_MIN,0,INT_MAX]            -> false

实现不能把 0、``INT_MIN`` 或 ``INT_MAX`` 当作“空槽哨兵”，因为它们都是合法数组值。

问题抽象与解法选择
------------------

扫描到位置 ``i`` 时，只需知道当前值是否在更早位置出现过。最直接的状态是一个集合：

.. code-block:: text

   seen = 已扫描前缀中出现过的值集合

每个元素执行：

#. 查询 ``nums[i]`` 是否属于 ``seen``；
#. 若属于，返回 ``true``；
#. 若不属于，把它插入 ``seen`` 并继续。

查询必须发生在插入之前。若先插入再查询，当前元素会命中自己，单元素数组也会被错误判定为重复。

其他方案
~~~~~~~~

.. list-table::
   :header-rows: 1

   * - 方法
     - 时间
     - 额外空间
     - 取舍
   * - 两层比较
     - ``O(n^2)``
     - ``O(1)``
     - 无哈希分配，适合作为 C 分配失败时的正确性回退
   * - 排序后检查相邻项
     - ``O(n log n)``
     - 依排序实现而定
     - 原地排序会修改输入；复制后排序额外使用 ``O(n)`` 空间
   * - 哈希集合
     - 平均 ``O(n)``
     - ``O(n)``
     - 主解法，可提前结束，输入保持只读

本文主解法使用哈希集合。复杂度中的“平均”依赖哈希分布、负载控制与运行时实现，不能写成无条件保证线性。

已见集合不变量
--------------

在处理下标 ``i`` 之前维护：

.. code-block:: text

   seen = { nums[0], nums[1], ..., nums[i-1] }

集合只记录值，不记录出现次数。因为算法一旦看到第二次出现就结束，所以在尚未结束的状态中，已扫描前缀本身没有重复值。

初始化
~~~~~~

``i=0`` 前没有已扫描元素，``seen`` 为空，恰好等于空前缀的值集合。

命中集合
~~~~~~~~

若 ``nums[i]`` 已在 ``seen`` 中，根据不变量，存在某个 ``j<i`` 使 ``nums[j]=nums[i]``。两个下标不同，因此已经找到合法重复对。

未命中并插入
~~~~~~~~~~~~

若当前值不在集合中，前缀 ``nums[0:i]`` 内不存在与它相同的更早值。插入后：

.. code-block:: text

   seen = { nums[0], ..., nums[i] }

不变量为下一位置继续成立。

正确性证明
----------

引理一：算法返回 true 时数组确实包含重复值
~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

算法只在当前值已经属于 ``seen`` 时返回 ``true``。由已见集合不变量，集合中的该值来自某个更早下标 ``j<i``，
所以 ``nums[j]=nums[i]`` 且两个下标不同。返回 ``true`` 不会产生误报。

引理二：数组存在重复值时算法一定返回 true
~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

假设数组中存在重复值。选择该值第二次出现的最早位置 ``i``，并令 ``j<i`` 是它此前的一次出现。
处理 ``i`` 之前，不变量保证 ``nums[j]`` 已在 ``seen`` 中，因此查询 ``nums[i]`` 必然命中并返回 ``true``。
算法不会漏报。

引理三：扫描结束未命中时所有元素互不相同
~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

若算法处理完全部位置仍未返回，则每个 ``nums[i]`` 在插入前都不属于更早前缀的值集合。
因此不存在 ``j<i`` 满足 ``nums[j]=nums[i]``。任意两个不同下标总能按较小者、较大者写成 ``j<i``，
所以数组中不存在重复对。

定理：算法返回值满足题目合同
~~~~~~~~~~~~~~~~~~~~~~~~~~~~

引理一保证返回 ``true`` 时结论可靠；引理二保证任何重复都会被发现；引理三保证返回 ``false`` 时数组确实无重复。
因此算法正确。

终止性
~~~~~~

外层扫描下标每轮增加 1，最多处理 ``n`` 个元素。哈希表探测在保持空槽的实现中最终遇到目标值或空槽；
托管集合操作也在单次调用完成后返回。算法必然终止。

哈希复杂度的准确边界
--------------------

设数组长度为 ``n``：

* 在常见哈希表模型中，查询和插入平均为 ``O(1)``，总平均时间为 ``O(n)``；
* 已见集合最多保存 ``n`` 个不同值，额外空间为 ``O(n)``；
* 找到重复值时可提前返回，实际保存数量可能小于 ``n``；
* 对抗碰撞、严重聚簇或某些实现退化时，单次操作可能达到 ``O(n)``，总最坏时间可达 ``O(n^2)``；
* 不同标准库对哈希随机化、扩容与最坏情况的保证不同，本文不把平均界写成所有平台的严格保证；
* 返回值只有一个布尔量，没有线性输出载荷。

C 开放寻址设计
--------------

C 标准库没有统一哈希集合。本文实现固定容量的线性探测表，并把所有资源和失败语义显式展开。

容量与负载
~~~~~~~~~~

若有 ``n`` 个输入元素，申请不小于 ``2*n`` 的二次幂容量。即使全部元素不同，负载因子也不超过 ``1/2``。
因此插入前总有空槽，线性探测不会绕表一整圈后仍找不到终点。

容量计算逐步检查：

* ``2*n`` 的乘法是否溢出 ``size_t``；
* 二次幂翻倍是否溢出；
* ``capacity*sizeof(int)`` 是否溢出；
* 两块数组是否都分配成功。

C 平台签名没有错误返回通道。发生容量溢出或分配失败时，本文释放已取得资源并退回精确的两层比较，
保持返回值正确；代价是失败路径时间变为 ``O(n^2)``。

独立占用标记
~~~~~~~~~~~~

表包含两个并行数组：

``values``
   保存已经插入的整数值。

``occupied``
   保存槽位是否已使用。

查询 ``values[index]`` 前必须先检查 ``occupied[index]``。这样 0、``INT_MIN``、``INT_MAX`` 和任意其他
``int`` 都能作为普通键，不需要保留某个整数哨兵。

负数与整数极值哈希
~~~~~~~~~~~~~~~~~~

先把 ``int`` 转换为 ``uint32_t``。C 对有符号整数转换到无符号整数规定为模 ``2^32`` 映射，
不会产生负数组下标。随后使用固定宽度无符号混合函数，再用：

.. code-block:: text

   index = hash & (capacity - 1)

映射到二次幂表。所有乘法和移位都在 ``uint32_t`` 上进行，溢出按无符号模运算定义。

线性探测
~~~~~~~~

若槽位已占用且值不同，就移动到：

.. code-block:: text

   index = (index + 1) & (capacity - 1)

遇到相同值时发现重复；遇到空槽时插入。因为负载不超过一半，未命中查询一定会遇到空槽。

十语言实现
----------

C
~

.. code-block:: c

   #include <stdbool.h>
   #include <stddef.h>
   #include <stdint.h>
   #include <stdlib.h>

   static bool contains_duplicate_quadratic(
       const int *nums,
       int nums_size
   ) {
       for (int i = 0; i < nums_size; ++i) {
           for (int j = i + 1; j < nums_size; ++j) {
               if (nums[i] == nums[j]) return true;
           }
       }
       return false;
   }

   static uint32_t mix_u32(uint32_t value) {
       value ^= value >> 16;
       value *= UINT32_C(0x7feb352d);
       value ^= value >> 15;
       value *= UINT32_C(0x846ca68b);
       value ^= value >> 16;
       return value;
   }

   bool containsDuplicate(int *nums, int numsSize) {
       if (numsSize < 2) return false;

       const size_t size_max = (size_t)-1;
       const size_t count = (size_t)numsSize;

       if (count > size_max / 2) {
           return contains_duplicate_quadratic(nums, numsSize);
       }
       const size_t required = count * 2;

       size_t capacity = 1;
       while (capacity < required) {
           if (capacity > size_max / 2) {
               return contains_duplicate_quadratic(nums, numsSize);
           }
           capacity <<= 1;
       }

       if (capacity > size_max / sizeof(int)) {
           return contains_duplicate_quadratic(nums, numsSize);
       }

       int *values = (int *)malloc(capacity * sizeof(int));
       unsigned char *occupied =
           (unsigned char *)calloc(capacity, sizeof(unsigned char));

       if (values == NULL || occupied == NULL) {
           free(values);
           free(occupied);
           return contains_duplicate_quadratic(nums, numsSize);
       }

       const size_t mask = capacity - 1;
       for (int i = 0; i < numsSize; ++i) {
           const int value = nums[i];
           size_t index = (size_t)mix_u32((uint32_t)value) & mask;

           while (occupied[index] != 0) {
               if (values[index] == value) {
                   free(values);
                   free(occupied);
                   return true;
               }
               index = (index + 1) & mask;
           }

           occupied[index] = 1;
           values[index] = value;
       }

       free(values);
       free(occupied);
       return false;
   }

C 主路径不修改输入。``occupied`` 与 ``values`` 分离，任何 ``int`` 都可存储。
容量或分配失败时释放资源并使用无分配的精确回退，因此不会把资源失败误报成“无重复”。

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

需要 ``<unordered_set>`` 与 ``<vector>``。``insert`` 返回的布尔分量表示是否真的插入了新键；
输入向量按引用接收但没有被修改。标准库哈希容器的复杂度按平均情形报告。

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

Python 整数按值比较，集合保存整数对象引用。集合操作通常为平均常数时间；输入列表保持不变。

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

``HashSet<Integer>`` 会装箱 ``int``。``add`` 在键已存在时返回 ``false``，数组不被修改。

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

平台签名按值取得 ``Vec<i32>``，循环移动其中的 ``i32`` 值，但不重排或改写缓冲区。
``HashSet::insert`` 在键原已存在时返回 ``false``。

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

空结构体不携带业务载荷。切片元素只读；映射查询返回的 ``exists`` 区分键是否存在。

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

官方整数范围可由 ``number`` 精确表示。ECMAScript ``Set`` 使用 SameValueZero 相等语义；
对本题有限整数，它与普通整数相等一致，输入数组不变。具体哈希实现和最坏复杂度由运行时决定。

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

``HashSet<int>.Add`` 在重复键上返回 ``false``，值类型不需要业务层装箱，输入数组保持只读。

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

Julia 的 ``Set`` 按 ``isequal`` 与哈希协同判断键。对整数值语义与数值相等一致；
函数不修改传入向量。

R
~

.. code-block:: r

   contains_duplicate <- function(nums) {
     seen <- new.env(hash = TRUE, parent = emptyenv())

     integer_key <- function(value) {
       if (value == 0) {
         return("i:0")
       }
       paste0("i:", sprintf("%.0f", value))
     }

     for (value in nums) {
       key <- integer_key(value)
       if (exists(key, envir = seen, inherits = FALSE)) {
         return(TRUE)
       }
       seen[[key]] <- TRUE
     }

     FALSE
   }

R 的 ``numeric`` 双精度可以精确表示全部 32 位整数值。键使用固定前缀和无小数十进制表示，
并把正零、负零统一为 ``i:0``；不同 32 位整数不会映射为同一键。
``parent=emptyenv()`` 与 ``inherits=FALSE`` 防止把父环境对象误判为已见键。输入向量不被修改。

人工静态推演
------------

``[1,2,3,1]``
   前三个值依次插入；最后一个 1 查询命中，返回 ``true``。

``[1,2,3,4]``
   每次查询都未命中，扫描结束返回 ``false``。

``[1,1]``
   第二个 1 命中第一步插入的键。

单元素与空数组
   集合不会出现第二次命中，返回 ``false``。

``[-1,0,2,-1]``
   负数按完整整数值作为键，末尾 -1 命中。

整数极值
   C 使用独立占用标记和 ``uint32_t`` 哈希，R 使用规范十进制键；
   ``INT_MIN``、0 与 ``INT_MAX`` 不会与空槽或彼此混淆。

静态审查记录
------------

本题未运行、未编译、未对拍、未穷举，也未执行 sanitizer。已人工核对：

* 查询发生在插入之前；
* ``seen`` 在位置 ``i`` 前恰好等于前缀 ``nums[0:i]`` 的值集合；
* 返回 ``true`` 的可靠性与存在重复时的完备性；
* 空数组、单元素、相邻重复、远距离重复、负数、零与整数极值；
* 十语言集合插入返回值、键相等语义和输入只读状态；
* 平均 ``O(n)`` 与碰撞最坏 ``O(n^2)`` 的区分；
* C 的 ``2*n``、二次幂翻倍和分配大小溢出检查；
* C 的独立 ``occupied`` 数组、低负载、探测终止和资源释放；
* C 容量或分配失败后的精确二次回退；
* R 的空父环境、非继承查询和一一对应十进制整数键。

剩余风险是十语言代码没有经过目标平台编译或执行；各标准库哈希表的常数、随机化和最坏行为依具体运行时实现。

关键易错点
----------

* 先插入再查询，使当前元素与自身匹配；
* 使用某个合法整数作为 C 空槽哨兵；
* 对负整数直接取可能为负的模并作为数组下标；
* 表装满后仍无限线性探测；
* 分配失败直接返回 ``false``，把资源错误混同为无重复；
* 把哈希方法写成严格保证 ``O(n)``；
* 用排序实现却声称输入没有被修改；
* R 使用会受科学计数法、舍入或父环境继承影响的键。

知识联系
--------

本题是“前缀摘要状态”的最小示例：处理当前元素时，只保存回答未来问题所需的信息。
若还要返回第一次出现位置，可把集合改成“值到下标”的映射；若要统计频率，则改成“值到计数”的映射；
若数据持续到达，完全相同的集合不变量可以直接用于流式重复检测。

开放寻址还展示了三个通用工程原则：

* 元数据与业务值分离，避免哨兵与合法输入冲突；
* 容量和负载决定探测能否终止以及平均性能；
* 没有错误通道的接口需要明确资源失败策略，不能静默改变算法语义。

自检问题
--------

#. 为什么必须在插入当前值之前查询集合？
#. 扫描结束未命中为什么能推出所有元素两两不同？
#. 为什么哈希集合只能报告平均 ``O(n)``，不能无条件报告保证线性？
#. C 为什么需要独立的 ``occupied`` 数组？
#. C 表容量至少为 ``2*n`` 有什么作用？
#. 把负 ``int`` 转成 ``uint32_t`` 后再哈希解决了什么问题？
#. R 为什么要设置 ``parent=emptyenv()`` 并使用 ``inherits=FALSE``？
#. C 分配失败时为什么退回两层比较而不是返回 ``false``？

参考答案
~~~~~~~~

#. 若先插入，当前元素会立即命中自己，无法保证两个下标不同。
#. 每个位置在插入前都不等于任何更早元素；任意不同下标可按先后次序归入这种比较。
#. 碰撞和聚簇可能使单次操作退化为线性，标准库的严格保证也各不相同。
#. 任意 ``int`` 都是合法键，独立元数据才能无冲突地区分空槽。
#. 最多插入 ``n`` 个不同值时负载不超过一半，未命中探测必然遇到空槽。
#. 转换和混合都在定义良好的无符号域进行，不会产生负数组下标，并保留所有位模式。
#. 防止环境查询沿父链命中无关名称，使集合只包含显式插入的整数键。
#. 平台布尔返回值没有错误状态；精确回退保持答案正确，只改变失败路径性能。
