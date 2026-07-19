0078. Subsets
=============

题目信息
--------

:题号: 0078
:难度: Medium
:主题: 回溯、子集、输出枚举
:原题: `LeetCode 0078 <https://leetcode.com/problems/subsets/>`_
:访问状态: Available
:教学重点: 节点即答案、递增下标、结果快照、输出规模

题目重述
--------

给定一个元素互不相同的整数数组 ``nums``，返回它的幂集，也就是所有可能子集。每个输入元素在同一
子集中最多出现一次，结果不能包含重复子集，子集及结果集合的顺序均不作要求。

题目保证 ``1 <= len(nums) <= 10``、``-10 <= nums[i] <= 10``，并且元素互不相同。输入数组只读，
空集必须包含在结果中，每个返回子集都需要独立
快照，后续回溯不能改写已经保存的内容。

自建示例
--------

.. code-block:: text

   输入：nums = [2, 5, 9]
   输出：
   [[], [2], [2,5], [2,5,9], [2,9], [5], [5,9], [9]]

共有 ``2^3 = 8`` 个子集。结果顺序可以不同，只要每个子集恰好出现一次。

问题抽象
--------

回溯路径保存已经选择的元素。参数 ``start`` 表示下一次允许选择的最小下标。与固定长度组合不同，
任意路径长度都代表一个合法子集，因此每次进入递归节点时先保存当前路径，再枚举后续元素。

选择 ``nums[index]`` 后只递归到 ``index + 1``，使路径中的输入下标严格递增。每个子集由唯一的递增
下标序列表示，不需要集合去重。

解法选择
--------

.. list-table::
   :header-rows: 1

   * - 方法
     - 时间复杂度
     - 工作空间
     - 定位
   * - 递增下标回溯
     - ``Theta(n × 2^n)``
     - ``O(n)``
     - 主解法；在每个递归节点提交答案
   * - 位掩码枚举
     - ``Theta(n × 2^n)``
     - ``O(n)``
     - 同样完整，适合强调二进制选择状态

主解法：每个递归节点提交路径
----------------------------

状态定义与核心不变量
~~~~~~~~~~~~~~~~~~~~

递归入口 ``dfs(start)`` 维护：

* ``path`` 包含某个严格递增下标序列对应的元素；
* ``path`` 自身已经是一个合法子集；
* ``start`` 大于路径最后一个输入下标，路径为空时为零；
* 共享当前路径前缀且尚未生成的子集，只能从 ``start..n-1`` 继续选择。

进入节点后立即复制 ``path``。随后依次选择每个可用下标，递归生成包含该元素的全部扩展，再撤销该
选择恢复父层状态。

为什么节点数量恰好是 ``2^n``
~~~~~~~~~~~~~~~~~~~~~~~~~~~~

任意子集都对应唯一的递增输入下标序列。算法从空序列出发，按该序列依次选择下标，因此能到达对应
节点。不同子集的递增序列不同，会在首次不同选择处分离，不会到达同一节点。

反过来，每个递归节点的路径由互不重复的递增下标构成，必然对应一个输入子集。节点与子集形成双射，
所以节点数量和结果数量都恰好为 ``2^n``。

正确性依据
~~~~~~~~~~

**结果合法。** 路径只加入输入中的元素，下一层只允许更大下标，因此同一元素不会重复出现。每次保存的
路径都是合法子集。

**结果完整。** 对任意目标子集，把其元素按输入下标递增排列。每个目标下标都会出现在对应层的循环中，
算法依次选择它们并到达目标路径。

**结果唯一。** 每个子集只有一个递增下标表示。不同递归路径至少在一个选择下标上不同，因此不会生成
重复子集。

**状态可恢复。** 子递归返回后删除最后加入的元素，``path`` 恢复到进入该分支前的父层前缀，后续兄弟
分支不会受到污染。

复杂度
~~~~~~

设 ``n = len(nums)``：

* 结果数量为 ``2^n``；
* 每个元素出现在恰好一半子集中，全部结果共复制 ``n × 2^(n-1)`` 个整数；
* 时间复杂度和返回空间均为 ``Theta(n × 2^n)``；
* 路径与递归栈深度最多为 ``n``，工作空间为 ``O(n)``；
* C 预先分配 ``2^n`` 个行槽位，空集使用 ``NULL`` 行和列长零；
* 任一 C 分配失败时释放全部已完成行，资源失败不属于题目输入域。

核心语言实现
------------

C
~

.. code-block:: c

   #include <stdbool.h>
   #include <stddef.h>
   #include <stdlib.h>
   #include <string.h>

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
           context->path[depth] = context->nums[index];
           build_subsets(context, index + 1, depth + 1);
       }
   }

   int **subsets(
       int *nums,
       int numsSize,
       int *returnSize,
       int **returnColumnSizes
   ) {
       *returnSize = 0;
       *returnColumnSizes = NULL;

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

       if (context.failed || context.size != capacity) {
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
               path.push_back(nums[index]);
               dfs(nums, index + 1, path, result);
               path.pop_back();
           }
       }

   public:
       std::vector<std::vector<int>> subsets(
           std::vector<int>& nums
       ) {
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
       def subsets(self, nums: list[int]) -> list[list[int]]:
           result: list[list[int]] = []
           path: list[int] = []

           def dfs(start: int) -> None:
               result.append(path.copy())

               for index in range(start, len(nums)):
                   path.append(nums[index])
                   dfs(index + 1)
                   path.pop()

           dfs(0)
           return result

Java
~~~~

.. code-block:: java

   import java.util.ArrayList;
   import java.util.List;

   class Solution {
       public List<List<Integer>> subsets(int[] nums) {
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
       pub fn subsets(nums: Vec<i32>) -> Vec<Vec<i32>> {
           fn dfs(
               nums: &[i32],
               start: usize,
               path: &mut Vec<i32>,
               result: &mut Vec<Vec<i32>>,
           ) {
               result.push(path.clone());

               for index in start..nums.len() {
                   path.push(nums[index]);
                   dfs(nums, index + 1, path, result);
                   path.pop();
               }
           }

           let mut result = Vec::with_capacity(1usize << nums.len());
           let mut path = Vec::with_capacity(nums.len());
           dfs(&nums, 0, &mut path, &mut result);
           result
       }
   }

Go
~~

.. code-block:: go

   func subsets(nums []int) [][]int {
       result := make([][]int, 0, 1<<len(nums))
       path := make([]int, 0, len(nums))

       var dfs func(start int)
       dfs = func(start int) {
           snapshot := append([]int(nil), path...)
           result = append(result, snapshot)

           for index := start; index < len(nums); index++ {
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

   function subsets(nums: number[]): number[][] {
       const result: number[][] = [];
       const path: number[] = [];

       const dfs = (start: number): void => {
           result.push([...path]);

           for (let index = start; index < nums.length; index++) {
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

   using System.Collections.Generic;

   public class Solution {
       public IList<IList<int>> Subsets(int[] nums) {
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
               path.Add(nums[index]);
               Dfs(nums, index + 1, path, result);
               path.RemoveAt(path.Count - 1);
           }
       }
   }

Julia
~~~~~

.. code-block:: julia

   function subsets(nums::Vector{Int})::Vector{Vector{Int}}
       result = Vector{Vector{Int}}()
       path = Int[]

       function dfs(start::Int)
           push!(result, copy(path))

           for index in start:length(nums)
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

   subsets <- function(nums) {
     result <- list()
     path <- integer(0)
     n <- length(nums)

     dfs <- function(start) {
       result[[length(result) + 1L]] <<- path

       if (start <= n) {
         for (index in seq.int(start, n)) {
           path <<- c(path, nums[[index]])
           dfs(index + 1L)
           path <<- path[-length(path)]
         }
       }
     }

     dfs(1L)
     result
   }

验证计划与证据
--------------

覆盖空数组、单元素、负数与无序输入；对随机互异数组与位掩码基准比较全部子集，并验证结果数量、
元素来源、无重复和快照独立性。可用语言执行编译、严格类型检查和运行测试。

关键边界
--------

* 题目输入非空；实现也自然覆盖空数组，其幂集只包含空集；
* 输入元素互不相同，算法无需处理重复值去重；
* 保存结果时必须复制路径，不能保存同一个可变容器引用；
* C 的空集行可以为 ``NULL``，其列长必须是零；
* ``n <= 10`` 保证 ``1 << n`` 和结果容量在 32 位整数范围内。

易错点
------

* 只在叶子保存路径，会漏掉长度小于 ``n`` 的子集；
* 每层都从零开始枚举，会生成不同排列和重复集合；
* 保存 ``path`` 本身而不是快照，最终结果可能全部变成同一内容；
* 撤销选择位置错误，会把一个分支的元素带入兄弟分支；
* 把算法工作空间写成 ``O(2^n)``，混淆返回结果与临时状态。

本题新增知识
------------

* 幂集回溯中每个递归节点都是答案，叶子不再是唯一提交位置；
* 子集与严格递增输入下标序列形成一一对应；
* 输出复杂度可以通过“每个元素出现在一半子集中”精确计算。

本题强化知识
------------

* 0077 的可变路径、递增选择和结果快照继续复用；
* 回溯证明继续分为合法性、完整性、唯一性和状态恢复；
* 输出枚举题的时间下界由返回数据总量决定。

关联题目
--------

* `0046. Permutations <0046-permutations.rst>`_
* `0077. Combinations <0077-combinations.rst>`_

最小自检
--------

#. 为什么递归入口就要保存当前路径？
#. ``start`` 如何保证同一子集只生成一次？
#. 为什么全部结果复制的整数数量是 ``n × 2^(n-1)``？
#. 保存结果时直接追加 ``path`` 会发生什么？
#. 空数组应该返回多少个子集？

答案要点
~~~~~~~~

#. 任意长度路径都是合法子集，包括空路径。
#. 后续只能选择更大输入下标，每个集合只有唯一递增下标序列。
#. 每个输入元素在全部子集中的出现与不出现各占一半。
#. 后续 ``push/pop`` 会修改历史答案，必须保存独立快照。
#. 一个，即空集。
