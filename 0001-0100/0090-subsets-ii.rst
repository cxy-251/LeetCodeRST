0090. Subsets II
================

题目信息
--------

:题号: 0090
:难度: Medium
:主题: 数组、回溯、排序、同层去重
:原题: `LeetCode 0090 <https://leetcode.com/problems/subsets-ii/>`_
:访问状态: Available
:教学重点: 排序聚类、同层代表、重复副本可选、独立结果快照

题目重述
--------

给定一个可能包含重复元素的整数数组 ``nums``，返回所有不同子集。每个输入位置最多使用一次，结果中
不能出现两个元素多重集相同的子集；子集顺序和结果顺序均不作要求。

题目保证 ``0 <= len(nums) <= 10``，元素位于 ``[-10, 10]``。主实现先排序工作数组：C、C++、
Python、Java、Go、TypeScript、C# 和 Julia 会改变传入可变容器的元素顺序；Rust 消费输入向量；R
在函数局部创建排序副本。

自建示例
--------

.. code-block:: text

   输入：nums = [1, 2, 2]
   输出：[[], [1], [1,2], [1,2,2], [2], [2,2]]

两个值为 ``2`` 的输入位置可以共同形成 ``[2,2]``，但不能分别生成两个相同的 ``[2]``。

全部元素相同
~~~~~~~~~~~~

.. code-block:: text

   输入：nums = [4, 4, 4]
   输出：[[], [4], [4,4], [4,4,4]]

结果数量为 ``n + 1``，而不是 ``2^n``。

问题抽象
--------

排序后，相同数值连续出现。递归状态 ``dfs(start)`` 保存一个已经选定的非递减路径，并从
``start..n-1`` 选择下一个输入位置。

在同一递归深度，如果当前候选与前一个候选值相同，只保留该值的第一个兄弟分支：

.. code-block:: text

   index > start AND nums[index] == nums[index - 1]  ->  skip

该规则只去除同层重复选择。选择某个副本进入下一层后，后续相同副本仍可继续选择，因此不会丢失
``[2,2]``、``[2,2,2]`` 等合法子集。

解法选择
--------

.. list-table::
   :header-rows: 1

   * - 方法
     - 时间复杂度
     - 工作空间
     - 定位
   * - 排序后回溯，同层跳过重复值
     - ``O(n log n + P)``
     - ``O(n)``
     - 主解法；直接生成唯一结果
   * - 先生成 ``2^n`` 个位置子集再使用集合去重
     - ``Theta(n × 2^n)``
     - ``Theta(n × 2^n)``
     - 会构造大量注定重复的中间结果
   * - 按值频次枚举每个值选择 ``0..count`` 次
     - ``Theta(P)``
     - ``O(n)``
     - 同样可靠，但需要额外频次分组状态

其中 ``P`` 表示全部返回子集中元素数量的总和。

主解法：排序后同层去重回溯
--------------------------

状态定义与核心不变量
~~~~~~~~~~~~~~~~~~~~

递归入口 ``dfs(start)`` 维护：

* ``path`` 由严格递增的输入下标产生，元素值非递减；
* ``path`` 本身已经是一个合法且尚未重复提交的子集；
* ``start`` 是下一次允许选择的最小下标；
* 当前层尚未生成的扩展只能从 ``start..n-1`` 选择；
* 每个相同候选值在当前层最多建立一个兄弟分支。

进入节点时先复制 ``path`` 到结果。随后枚举候选，选择、递归并撤销最后一个元素。

为什么只跳过同层重复值
~~~~~~~~~~~~~~~~~~~~~~

假设当前层的连续候选值都是 ``v``。从第二个 ``v`` 建立的兄弟分支，与从第一个 ``v`` 建立的分支
拥有相同路径值前缀，并且第一个分支的后续候选集合还包含其后的全部 ``v`` 和其他元素。因此第二个
兄弟分支能生成的每个数值子集，都已经由第一个兄弟分支覆盖。

条件必须是 ``index > start``。当第一个 ``v`` 已被加入路径并进入下一层时，新的 ``start`` 也随之
前进；下一层的第二个 ``v`` 是路径增加一个重复副本的唯一方式，不能跳过。

完整性与唯一性
~~~~~~~~~~~~~~

对任意目标子集，把元素按非递减顺序排列，并在每个数值组内选择排序数组中最靠左的尚未使用副本。
这给出一条规范的严格递增下标序列。算法在每层都保留最靠左的同值兄弟，因此一定能够沿该序列到达
目标子集。

若两条递归路径生成相同数值序列，在它们首次选择不同下标的层级，两个候选值必然相同。该层只允许
最靠左同值候选建立分支，第二条路径会被跳过。因此不同递归节点不会提交相同子集。

正确性依据
~~~~~~~~~~

**结果合法。** 路径只从输入位置选择，每次递归都把 ``start`` 移到已选下标之后，同一位置不会重复使用。

**结果完整。** 每个目标多重集都存在“每层选择最靠左可用副本”的规范下标表示，所有规范分支都会被遍历。

**结果唯一。** 同层相同数值只有一个代表分支；不同数值路径或不同重复次数对应不同结果。

**快照独立。** 保存答案时复制当前路径，后续 ``pop`` 不会改写已经返回的子集。

**终止性。** 每次递归令 ``start`` 严格增加，递归深度最多为 ``n``。

复杂度与资源
~~~~~~~~~~~~

设不同子集数量为 ``S``，全部结果中元素总数为 ``P``：

* 排序时间为 ``O(n log n)``；
* 每个递归节点对应一个唯一结果，路径快照总成本为 ``Theta(P)``；
* 总时间为 ``O(n log n + P)``，最坏为 ``Theta(n × 2^n)``；
* 路径和递归栈工作空间为 ``O(n)``；
* 返回空间为 ``Theta(S + P)``，其中 ``S`` 计入行容器元数据；
* C 预留最多 ``2^n`` 个行槽位，任一分配失败时释放全部已完成行；
* R 使用环境保存结果行，避免每次追加都复制整张结果列表，最终转换为普通列表返回。

核心语言实现
------------

C
~

.. code-block:: c

   #include <stdbool.h>
   #include <stddef.h>
   #include <stdlib.h>
   #include <string.h>

   static int compare_ints(const void *left, const void *right) {
       const int first = *(const int *)left;
       const int second = *(const int *)right;
       return (first > second) - (first < second);
   }

   typedef struct {
       const int *nums;
       int nums_size;
       int **rows;
       int *columns;
       int *path;
       int size;
       bool failed;
   } SubsetsContext;

   static void build_subsets(
       SubsetsContext *context,
       int start,
       int depth
   ) {
       if (context->failed) {
           return;
       }

       int *row = NULL;
       if (depth > 0) {
           row = malloc((size_t)depth * sizeof(*row));
           if (row == NULL) {
               context->failed = true;
               return;
           }
           memcpy(row, context->path, (size_t)depth * sizeof(*row));
       }

       context->rows[context->size] = row;
       context->columns[context->size] = depth;
       ++context->size;

       for (int index = start; index < context->nums_size; ++index) {
           if (index > start && context->nums[index] == context->nums[index - 1]) {
               continue;
           }
           context->path[depth] = context->nums[index];
           build_subsets(context, index + 1, depth + 1);
       }
   }

   int **subsetsWithDup(
       int *nums,
       int numsSize,
       int *returnSize,
       int **returnColumnSizes
   ) {
       *returnSize = 0;
       *returnColumnSizes = NULL;
       if (numsSize > 1) {
           qsort(nums, (size_t)numsSize, sizeof(*nums), compare_ints);
       }

       const int capacity = 1 << numsSize;
       int **rows = malloc((size_t)capacity * sizeof(*rows));
       int *columns = malloc((size_t)capacity * sizeof(*columns));
       int *path = NULL;
       if (numsSize > 0) {
           path = malloc((size_t)numsSize * sizeof(*path));
       }

       if (rows == NULL || columns == NULL ||
           (numsSize > 0 && path == NULL)) {
           free(rows);
           free(columns);
           free(path);
           return NULL;
       }

       SubsetsContext context = {
           nums, numsSize, rows, columns, path, 0, false
       };
       build_subsets(&context, 0, 0);
       free(path);

       if (context.failed) {
           for (int index = 0; index < context.size; ++index) {
               free(rows[index]);
           }
           free(rows);
           free(columns);
           return NULL;
       }

       *returnSize = context.size;
       *returnColumnSizes = columns;
       return rows;
   }

C++
~~~

.. code-block:: cpp

   #include <algorithm>
   #include <vector>

   class Solution {
       void dfs(
           const std::vector<int>& nums,
           int start,
           std::vector<int>& path,
           std::vector<std::vector<int>>& result
       ) {
           result.push_back(path);

           for (int index = start;
                index < static_cast<int>(nums.size());
                ++index) {
               if (index > start && nums[index] == nums[index - 1]) {
                   continue;
               }
               path.push_back(nums[index]);
               dfs(nums, index + 1, path, result);
               path.pop_back();
           }
       }

   public:
       std::vector<std::vector<int>> subsetsWithDup(
           std::vector<int>& nums
       ) {
           std::sort(nums.begin(), nums.end());
           std::vector<std::vector<int>> result;
           std::vector<int> path;
           result.reserve(1U << nums.size());
           dfs(nums, 0, path, result);
           return result;
       }
   };

Python
~~~~~~

.. code-block:: python

   class Solution:
       def subsetsWithDup(self, nums: list[int]) -> list[list[int]]:
           nums.sort()
           result: list[list[int]] = []
           path: list[int] = []

           def dfs(start: int) -> None:
               result.append(path.copy())

               for index in range(start, len(nums)):
                   if index > start and nums[index] == nums[index - 1]:
                       continue
                   path.append(nums[index])
                   dfs(index + 1)
                   path.pop()

           dfs(0)
           return result

Java
~~~~

.. code-block:: java

   import java.util.ArrayList;
   import java.util.Arrays;
   import java.util.List;

   class Solution {
       public List<List<Integer>> subsetsWithDup(int[] nums) {
           Arrays.sort(nums);
           List<List<Integer>> result = new ArrayList<>();
           List<Integer> path = new ArrayList<>();
           dfs(nums, 0, path, result);
           return result;
       }

       private void dfs(
           int[] nums,
           int start,
           List<Integer> path,
           List<List<Integer>> result
       ) {
           result.add(new ArrayList<>(path));

           for (int index = start; index < nums.length; ++index) {
               if (index > start && nums[index] == nums[index - 1]) {
                   continue;
               }
               path.add(nums[index]);
               dfs(nums, index + 1, path, result);
               path.remove(path.size() - 1);
           }
       }
   }

Rust
~~~~

.. code-block:: rust

   impl Solution {
       pub fn subsets_with_dup(mut nums: Vec<i32>) -> Vec<Vec<i32>> {
           fn dfs(
               nums: &[i32],
               start: usize,
               path: &mut Vec<i32>,
               result: &mut Vec<Vec<i32>>,
           ) {
               result.push(path.clone());

               for index in start..nums.len() {
                   if index > start && nums[index] == nums[index - 1] {
                       continue;
                   }
                   path.push(nums[index]);
                   dfs(nums, index + 1, path, result);
                   path.pop();
               }
           }

           nums.sort_unstable();
           let mut result = Vec::with_capacity(1usize << nums.len());
           let mut path = Vec::with_capacity(nums.len());
           dfs(&nums, 0, &mut path, &mut result);
           result
       }
   }

Go
~~

.. code-block:: go

   import "sort"

   func subsetsWithDup(nums []int) [][]int {
       sort.Ints(nums)
       result := make([][]int, 0, 1<<len(nums))
       path := make([]int, 0, len(nums))

       var dfs func(int)
       dfs = func(start int) {
           snapshot := append([]int(nil), path...)
           result = append(result, snapshot)

           for index := start; index < len(nums); index++ {
               if index > start && nums[index] == nums[index-1] {
                   continue
               }
               path = append(path, nums[index])
               dfs(index + 1)
               path = path[:len(path)-1]
           }
       }

       dfs(0)
       return result
   }

TypeScript
~~~~~~~~~~

.. code-block:: typescript

   function subsetsWithDup(nums: number[]): number[][] {
       nums.sort((first, second) => first - second);
       const result: number[][] = [];
       const path: number[] = [];

       const dfs = (start: number): void => {
           result.push([...path]);

           for (let index = start; index < nums.length; index += 1) {
               if (index > start && nums[index] === nums[index - 1]) {
                   continue;
               }
               path.push(nums[index]);
               dfs(index + 1);
               path.pop();
           }
       };

       dfs(0);
       return result;
   }

C#
~~

.. code-block:: csharp

   using System;
   using System.Collections.Generic;

   public class Solution {
       public IList<IList<int>> SubsetsWithDup(int[] nums) {
           Array.Sort(nums);
           var result = new List<IList<int>>();
           var path = new List<int>();
           Dfs(nums, 0, path, result);
           return result;
       }

       private static void Dfs(
           int[] nums,
           int start,
           List<int> path,
           List<IList<int>> result
       ) {
           result.Add(new List<int>(path));

           for (int index = start; index < nums.Length; ++index) {
               if (index > start && nums[index] == nums[index - 1]) {
                   continue;
               }
               path.Add(nums[index]);
               Dfs(nums, index + 1, path, result);
               path.RemoveAt(path.Count - 1);
           }
       }
   }

Julia
~~~~~

.. code-block:: julia

   function subsets_with_dup!(nums::Vector{Int})::Vector{Vector{Int}}
       sort!(nums)
       result = Vector{Vector{Int}}()
       path = Int[]

       function dfs(start::Int)
           push!(result, copy(path))

           for index in start:length(nums)
               if index > start && nums[index] == nums[index - 1]
                   continue
               end
               push!(path, nums[index])
               dfs(index + 1)
               pop!(path)
           end
       end

       dfs(1)
       return result
   end

R
~

.. code-block:: r

   subsets_with_dup <- function(nums) {
     nums <- sort(as.integer(nums))
     rows <- new.env(hash = TRUE, parent = emptyenv())
     size <- 0L

     dfs <- function(start, path) {
       size <<- size + 1L
       assign(as.character(size), path, envir = rows)

       if (start <= length(nums)) {
         for (index in seq.int(start, length(nums))) {
           if (index > start && nums[index] == nums[index - 1L]) {
             next
           }
           dfs(index + 1L, c(path, nums[index]))
         }
       }
     }

     dfs(1L, integer())
     lapply(
       seq_len(size),
       function(index) get(as.character(index), envir = rows, inherits = FALSE)
     )
   }

验证计划与证据
--------------

本批次执行：

* Python 生成 30,000 组长度 ``0..10``、值域 ``[-3,3]`` 的随机数组；
* 独立基准枚举全部位置位掩码，再把每个子集规范化为排序元组并使用集合去重；
* 检查结果集合完全一致、返回行无重复、行内有序以及结果快照互不共享；
* C、C++、Java、Go 和 TypeScript 各执行 10,000 组随机基准对拍；
* C、C++ 额外通过严格警告、ASan 和 UBSan。

Rust、C#、Julia 和 R 在当前环境执行接口、排序修改、索引、递归状态和复制语义的静态检查。

关键边界
--------

* 空数组只返回空集；
* 全部元素相同时只返回选择 ``0..n`` 个副本的 ``n+1`` 个子集；
* 去重条件只在 ``index > start`` 时成立，不能跨递归层跳过重复值；
* 保存结果必须复制路径，不能把同一个可变路径对象重复放入结果；
* 主实现会排序可变输入，调用后原始元素顺序不再保留。

易错点
------

* 使用“只要和前一个值相同就跳过”会连深层的合法重复副本一起删除；
* 不排序就比较相邻值，无法保证所有同值兄弟相邻；
* 用结果集合事后去重虽然可能正确，但会生成重复搜索分支并隐藏真正的规范表示；
* C 在部分行分配失败后必须释放已经提交的每一行和元数据；
* Go、Python、TypeScript 等语言保存 ``path`` 引用而不是副本，会让全部结果最终变成同一个路径状态。

本题新增知识
------------

* 排序后“同层只选择第一个同值候选”的规范代表规则；
* 重复值的数值等价与输入下标身份必须同时跟踪；
* 通过最靠左可用副本建立每个多重集子集的唯一规范路径。

本题强化知识
------------

* 每个递归节点提交一个子集，与 `0078. Subsets <0078-subsets.rst>`_ 的节点快照模型一致；
* 路径快照、撤销和输出载荷需要计入真实复杂度；
* 排序修改输入的语言接口必须明确说明调用后状态。

关联题目
--------

* `0078. Subsets <0078-subsets.rst>`_：输入元素互异，不需要同层去重；
* `0047. Permutations II <0047-permutations-ii.rst>`_：排序后使用同层代表消除重复排列；
* `0040. Combination Sum II <0040-combination-sum-ii.rst>`_：重复候选的同层跳过与下标身份控制。

最小自检
--------

#. 为什么第二个同值兄弟分支能够被第一个同值兄弟完整覆盖？
#. 为什么进入下一层后仍允许选择后续相同值？
#. 每个目标子集的唯一规范下标表示如何定义？
#. 时间复杂度为什么使用输出总载荷 ``P``，而不是只写 ``O(2^n)``？

答案要点
~~~~~~~~

#. 两个兄弟选择产生相同值前缀，第一个分支还能访问第二个及其之后的全部候选。
#. 下一层选择代表增加一个重复副本；跳过它会丢失 ``[v,v]`` 等合法结果。
#. 每个值都选择当前层最靠左的尚未使用副本，形成严格递增下标序列。
#. 每个结果都需要复制其全部元素；总复制量是 ``P``，最坏达到 ``Theta(n × 2^n)``。
