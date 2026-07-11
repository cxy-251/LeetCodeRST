0040. Combination Sum II
========================

题目信息
--------

:题号: 0040
:难度: Medium
:主题: 回溯、排序、同层去重、一次性选择、组合枚举
:原题: `LeetCode 0040 <https://leetcode.com/problems/combination-sum-ii/>`_
:访问状态: Available
:教学重点: 每个下标只用一次、同层跳过重复值、不同层允许相同值、排序剪枝

题目重述
--------

给定正整数数组 ``candidates`` 和正整数 ``target``。数组中可能含重复值，每个数组位置最多使用
一次。返回所有元素和等于 ``target`` 的不同组合。

组合内部顺序不影响答案。即使两组选择使用了不同下标，只要最终数值序列相同，也只能返回一次。

自建示例
--------

.. code-block:: text

   candidates = [10, 1, 2, 7, 6, 1, 5], target = 8
   输出：[[1, 1, 6], [1, 2, 5], [1, 7], [2, 6]]

   candidates = [1, 1, 1, 2], target = 3
   输出：[[1, 1, 1], [1, 2]]

第二个示例中的三个 ``1`` 来自三个不同下标。数值可以重复，数组位置不能复用。

问题抽象
--------

先把数组升序排列。递归 ``search(start, remaining)`` 只从下标 ``start`` 及之后选择元素：

* 选择 ``index`` 后递归传入 ``index + 1``，保证该位置只使用一次；
* 若 ``index > start`` 且当前值等于前一个值，则跳过当前值，删除同一递归层的等价分支；
* 若当前值大于 ``remaining``，后续值只会更大，可结束本层循环。

同层跳过不会禁止组合中出现多个相同值。选择第一个 ``1`` 进入下一层后，新的 ``start`` 已变化，
下一层仍可选择后面的 ``1``。

解法选择
--------

.. list-table::
   :header-rows: 1

   * - 方法
     - 时间复杂度
     - 额外空间
     - 取舍
   * - 排序 + 一次性下标回溯 + 同层去重
     - ``O(2^n)`` 上界
     - ``O(n)``
     - 主解法；搜索阶段直接避免重复答案
   * - 枚举全部下标子集后集合去重
     - ``O(2^n × n)``
     - 很高
     - 先制造重复，再承担序列哈希或字符串化成本
   * - 按不同值的频次枚举使用数量
     - 指数级
     - ``O(u)``
     - 可行，建模和实现比本题主线更复杂

主解法：排序后的同层去重回溯
----------------------------

状态含义
~~~~~~~~

进入 ``search(start, remaining)`` 时：

* ``path`` 对应一组互不相同的已选下标；
* ``path`` 数值非递减；
* ``sum(path) + remaining == target``；
* 后续只能从 ``start`` 及之后选择；
* 当前层尚未使用两个相同值启动等价分支。

为什么条件是 index > start
~~~~~~~~~~~~~~~~~~~~~~~~~~

考虑排序数组 ``[1a, 1b, 1c, 2]``：

* 根层选择 ``1a`` 后，根层跳过 ``1b`` 和 ``1c``，避免三棵相同的首选子树；
* 进入下一层后，``start`` 指向 ``1b``，它是该层第一个 ``1``，因此仍可选择；
* 再下一层可选择 ``1c``，所以 ``[1, 1, 1]`` 不会被漏掉。

若写成 ``index > 0``，所有深层相邻重复值都会被跳过，合法的多重复值组合会消失。

核心不变量
~~~~~~~~~~

每层循环开始时，已处理的候选要么被完整搜索，要么因与本层前一个值相同而被证明等价。选择一个
候选后，``remaining`` 减去该正数，递归起点移动到下一位置；撤销后恢复父层路径。

正确性依据
~~~~~~~~~~

合法性：递归始终传入 ``index + 1``，同一下标不会再次使用；只有 ``remaining == 0`` 时保存，
所以每个输出组合的和恰好为目标。

无重复：排序后相同值连续。固定路径前缀和递归层时，只保留第一个相同值启动分支。后续等值下标
启动的分支拥有相同数值选择和更短的可用后缀，不会产生新的数值组合。

完整性：取任意合法答案并按非递减顺序排列。若它在某层使用了后面的某个等值下标，可替换为该层
最早可用的等值下标；替换后剩余可选后缀不会缩小。因此同层保留的第一个值足以覆盖所有合法
数值组合，逐层搜索最终会到达该答案。

复杂度
~~~~~~

设数组长度为 ``n``：

* 下标子集数量上界为 ``2^n``，搜索时间上界为 ``O(2^n)``，复制输出还需答案总长度；
* 排序为 ``O(n log n)``；
* 递归深度和路径长度最多 ``n``，不计输出的额外空间为 ``O(n)``。

核心语言实现
------------

C
~

.. code-block:: c

   #include <stdlib.h>
   #include <string.h>

   struct Result {
       int **rows;
       int *sizes;
       int count;
       int capacity;
       int *path;
       int path_length;
   };

   static int compare_int(const void *left, const void *right) {
       int a = *(const int *)left;
       int b = *(const int *)right;
       return (a > b) - (a < b);
   }

   static void append_path(struct Result *result) {
       if (result->count == result->capacity) {
           result->capacity *= 2;
           result->rows = realloc(
               result->rows,
               (size_t)result->capacity * sizeof(int *)
           );
           result->sizes = realloc(
               result->sizes,
               (size_t)result->capacity * sizeof(int)
           );
       }

       int *copy = malloc(
           (size_t)result->path_length * sizeof(int)
       );
       memcpy(
           copy,
           result->path,
           (size_t)result->path_length * sizeof(int)
       );
       result->rows[result->count] = copy;
       result->sizes[result->count] = result->path_length;
       ++result->count;
   }

   static void search(
       const int *candidates,
       int candidate_count,
       int start,
       int remaining,
       struct Result *result
   ) {
       if (remaining == 0) {
           append_path(result);
           return;
       }

       for (int index = start; index < candidate_count; ++index) {
           if (index > start &&
               candidates[index] == candidates[index - 1]) {
               continue;
           }

           int value = candidates[index];
           if (value > remaining) {
               break;
           }

           result->path[result->path_length++] = value;
           search(
               candidates,
               candidate_count,
               index + 1,
               remaining - value,
               result
           );
           --result->path_length;
       }
   }

   int **combinationSum2(
       int *candidates,
       int candidatesSize,
       int target,
       int *returnSize,
       int **returnColumnSizes
   ) {
       qsort(
           candidates,
           (size_t)candidatesSize,
           sizeof(int),
           compare_int
       );

       struct Result result;
       result.capacity = 16;
       result.count = 0;
       result.rows = malloc(
           (size_t)result.capacity * sizeof(int *)
       );
       result.sizes = malloc(
           (size_t)result.capacity * sizeof(int)
       );
       result.path = malloc(
           (size_t)candidatesSize * sizeof(int)
       );
       result.path_length = 0;

       search(
           candidates,
           candidatesSize,
           0,
           target,
           &result
       );

       free(result.path);
       *returnSize = result.count;
       *returnColumnSizes = result.sizes;
       return result.rows;
   }

C++
~~~

.. code-block:: cpp

   class Solution {
       std::vector<std::vector<int>> answers;
       std::vector<int> path;

       void search(
           const std::vector<int>& candidates,
           int start,
           int remaining
       ) {
           if (remaining == 0) {
               answers.push_back(path);
               return;
           }

           for (int index = start;
                index < static_cast<int>(candidates.size());
                ++index) {
               if (index > start &&
                   candidates[index] == candidates[index - 1]) {
                   continue;
               }
               int value = candidates[index];
               if (value > remaining) {
                   break;
               }

               path.push_back(value);
               search(candidates, index + 1, remaining - value);
               path.pop_back();
           }
       }

   public:
       std::vector<std::vector<int>> combinationSum2(
           std::vector<int>& candidates,
           int target
       ) {
           answers.clear();
           path.clear();
           std::sort(candidates.begin(), candidates.end());
           search(candidates, 0, target);
           return answers;
       }
   };

Python
~~~~~~

.. code-block:: python

   class Solution:
       def combinationSum2(
           self,
           candidates: list[int],
           target: int,
       ) -> list[list[int]]:
           candidates.sort()
           answers: list[list[int]] = []
           path: list[int] = []

           def search(start: int, remaining: int) -> None:
               if remaining == 0:
                   answers.append(path.copy())
                   return

               for index in range(start, len(candidates)):
                   if index > start and candidates[index] == candidates[index - 1]:
                       continue
                   value = candidates[index]
                   if value > remaining:
                       break

                   path.append(value)
                   search(index + 1, remaining - value)
                   path.pop()

           search(0, target)
           return answers

Java
~~~~

.. code-block:: java

   class Solution {
       private final List<List<Integer>> answers = new ArrayList<>();
       private final List<Integer> path = new ArrayList<>();

       public List<List<Integer>> combinationSum2(
           int[] candidates,
           int target
       ) {
           answers.clear();
           path.clear();
           Arrays.sort(candidates);
           search(candidates, 0, target);
           return answers;
       }

       private void search(
           int[] candidates,
           int start,
           int remaining
       ) {
           if (remaining == 0) {
               answers.add(new ArrayList<>(path));
               return;
           }

           for (int index = start; index < candidates.length; ++index) {
               if (index > start &&
                   candidates[index] == candidates[index - 1]) {
                   continue;
               }
               int value = candidates[index];
               if (value > remaining) {
                   break;
               }

               path.add(value);
               search(candidates, index + 1, remaining - value);
               path.remove(path.size() - 1);
           }
       }
   }

Rust
~~~~

.. code-block:: rust

   impl Solution {
       pub fn combination_sum2(
           mut candidates: Vec<i32>,
           target: i32,
       ) -> Vec<Vec<i32>> {
           fn search(
               candidates: &[i32],
               start: usize,
               remaining: i32,
               path: &mut Vec<i32>,
               answers: &mut Vec<Vec<i32>>,
           ) {
               if remaining == 0 {
                   answers.push(path.clone());
                   return;
               }

               for index in start..candidates.len() {
                   if index > start &&
                       candidates[index] == candidates[index - 1]
                   {
                       continue;
                   }
                   let value = candidates[index];
                   if value > remaining {
                       break;
                   }

                   path.push(value);
                   search(
                       candidates,
                       index + 1,
                       remaining - value,
                       path,
                       answers,
                   );
                   path.pop();
               }
           }

           candidates.sort_unstable();
           let mut answers = Vec::new();
           let mut path = Vec::new();
           search(
               &candidates,
               0,
               target,
               &mut path,
               &mut answers,
           );
           answers
       }
   }

Go
~~

.. code-block:: go

   import "sort"

   func combinationSum2(candidates []int, target int) [][]int {
       sort.Ints(candidates)
       answers := make([][]int, 0)
       path := make([]int, 0)

       var search func(int, int)
       search = func(start int, remaining int) {
           if remaining == 0 {
               copyOfPath := append([]int(nil), path...)
               answers = append(answers, copyOfPath)
               return
           }

           for index := start; index < len(candidates); index++ {
               if index > start &&
                   candidates[index] == candidates[index-1] {
                   continue
               }
               value := candidates[index]
               if value > remaining {
                   break
               }

               path = append(path, value)
               search(index+1, remaining-value)
               path = path[:len(path)-1]
           }
       }

       search(0, target)
       return answers
   }

TypeScript
~~~~~~~~~~

.. code-block:: typescript

   function combinationSum2(
       candidates: number[],
       target: number,
   ): number[][] {
       candidates.sort((left, right) => left - right);
       const answers: number[][] = [];
       const path: number[] = [];

       const search = (start: number, remaining: number): void => {
           if (remaining === 0) {
               answers.push([...path]);
               return;
           }

           for (let index = start; index < candidates.length; index++) {
               if (index > start &&
                   candidates[index] === candidates[index - 1]) {
                   continue;
               }
               const value = candidates[index];
               if (value > remaining) {
                   break;
               }

               path.push(value);
               search(index + 1, remaining - value);
               path.pop();
           }
       };

       search(0, target);
       return answers;
   }

C#
~~

.. code-block:: csharp

   public class Solution {
       private readonly IList<IList<int>> answers =
           new List<IList<int>>();
       private readonly List<int> path = new List<int>();

       public IList<IList<int>> CombinationSum2(
           int[] candidates,
           int target
       ) {
           answers.Clear();
           path.Clear();
           System.Array.Sort(candidates);
           Search(candidates, 0, target);
           return answers;
       }

       private void Search(
           int[] candidates,
           int start,
           int remaining
       ) {
           if (remaining == 0) {
               answers.Add(new List<int>(path));
               return;
           }

           for (int index = start; index < candidates.Length; ++index) {
               if (index > start &&
                   candidates[index] == candidates[index - 1]) {
                   continue;
               }
               int value = candidates[index];
               if (value > remaining) {
                   break;
               }

               path.Add(value);
               Search(candidates, index + 1, remaining - value);
               path.RemoveAt(path.Count - 1);
           }
       }
   }

Julia
~~~~~

.. code-block:: julia

   function combination_sum_ii(
       candidates::Vector{Int},
       target::Int,
   )::Vector{Vector{Int}}
       sort!(candidates)
       answers = Vector{Vector{Int}}()
       path = Int[]

       function search(start::Int, remaining::Int)
           if remaining == 0
               push!(answers, copy(path))
               return
           end

           for index in start:length(candidates)
               if index > start &&
                  candidates[index] == candidates[index - 1]
                   continue
               end
               value = candidates[index]
               value > remaining && break

               push!(path, value)
               search(index + 1, remaining - value)
               pop!(path)
           end
       end

       search(1, target)
       return answers
   end

Julia 的空 ``UnitRange`` 不会产生元素，因此起点越过末尾时循环自然结束。

R
~

.. code-block:: r

   combination_sum_ii <- function(candidates, target) {
     candidates <- sort(candidates)
     answers <- list()
     path <- integer(0)

     search <- function(start, remaining) {
       if (remaining == 0L) {
         answers[[length(answers) + 1L]] <<- path
         return(invisible(NULL))
       }
       if (start > length(candidates)) {
         return(invisible(NULL))
       }

       for (index in start:length(candidates)) {
         if (index > start &&
             candidates[[index]] == candidates[[index - 1L]]) {
           next
         }
         value <- candidates[[index]]
         if (value > remaining) {
           break
         }

         path <<- c(path, value)
         search(index + 1L, remaining - value)
         path <<- path[-length(path)]
       }

       invisible(NULL)
     }

     search(1L, target)
     answers
   }

R 的 ``(n + 1):n`` 会生成反向序列，因此必须在进入循环前显式检查后缀是否已耗尽。

关键边界
--------

* 多个相同值可同时使用，只要来自不同下标；
* 某个值在同层只启动一次分支，在更深层仍可再次出现；
* 数组全部由相同值组成时，答案至多有一种对应长度；
* 候选大于剩余值时，排序保证后续全部不可选；
* 每个下标只能一次，递归深度不超过数组长度。

易错点
------

* 像 0039 一样递归传入 ``index``，错误复用同一下标；
* 使用 ``index > 0`` 而不是 ``index > start``，漏掉 ``[1, 1]``；
* 未排序便跳过相邻值或按剩余值 ``break``；
* 保存路径时没有复制；
* 先生成重复组合再用集合去重，隐藏重复产生的真正原因；
* 在 R 中未处理起点越过数组末尾，错误访问反向下标序列。

新增与强化知识
--------------

新增
~~~~

* 同层去重删除等价决策，不同层保留重复值；
* 数组位置的一次性使用由 ``index + 1`` 表达；
* 去重条件必须同时依赖值相等和递归层起点；
* 完整性可用“最早可用等值下标”证明。

强化
~~~~

* 0039 与本题只改变两个局部规则，却对应不同选择语义；
* 排序同时服务于组合规范化、重复值相邻和剩余值剪枝；
* 回溯继续遵守选择、递归、撤销的对称结构；
* 正确性证明继续覆盖合法性、无重复和不遗漏。

最小自检
--------

#. 为什么选择后递归传入 ``index + 1``？
#. 为什么跳过条件必须是 ``index > start``？
#. ``[1a, 1b, 2]`` 中如何生成 ``[1, 1]``？
#. 为什么根层可以跳过 ``1b`` 启动的分支？
#. 排序同时承担哪三项作用？

答案要点
~~~~~~~~

#. 当前数组位置只能使用一次，下一层只能看其后缀。
#. 只删除同层等价首选；更深层仍需允许后续相同值。
#. 根层选择 ``1a``，下一层选择 ``1b``。
#. 它能生成的数值组合都可由 ``1a`` 分支生成。
#. 统一组合顺序、让重复值相邻、支持按剩余值停止循环。
