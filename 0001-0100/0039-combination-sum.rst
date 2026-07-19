0039. Combination Sum
=====================

题目信息
--------

:题号: 0039
:难度: Medium
:主题: 回溯、排序、组合枚举、可重复选择、剪枝
:原题: `LeetCode 0039 <https://leetcode.com/problems/combination-sum/>`_
:访问状态: Available
:教学重点: 非递减路径、起点下标、当前元素可复用、正数剪枝、答案不重不漏

题目重述
--------

给定一个由互不相同正整数组成的数组 ``candidates`` 和正整数 ``target``。可以不限次数地使用
每个候选数，找出所有元素和恰好等于 ``target`` 的不同组合。

组合内部顺序不影响答案。例如 ``[2, 2, 3]`` 与 ``[3, 2, 2]`` 是同一个组合，只能返回一次。
答案顺序没有要求。

自建示例
--------

普通情况
~~~~~~~~

.. code-block:: text

   candidates = [2, 3, 6, 7]
   target = 7
   输出：[[2, 2, 3], [7]]

同一候选可复用
~~~~~~~~~~~~~~

.. code-block:: text

   candidates = [2, 3, 5]
   target = 8
   输出：[[2, 2, 2, 2], [2, 3, 3], [3, 5]]

没有答案
~~~~~~~~

.. code-block:: text

   candidates = [4, 6]
   target = 5
   输出：[]

候选值等于目标
~~~~~~~~~~~~~~

.. code-block:: text

   candidates = [3, 8, 10]
   target = 8
   输出：[[8]]

问题抽象
--------

将候选数组升序排列，并在递归中维护：

* ``start``：本层允许选择的最小候选下标；
* ``remaining``：当前路径距离目标还差多少；
* ``path``：已经选择的非递减数字序列。

本层从 ``start`` 开始枚举候选 ``candidates[index]``。选择后递归仍传入 ``index``，表示当前数字
可以继续使用。由于后续只能选择当前下标或更大的下标，``path`` 始终非递减，同一个多重集合只会
按一种顺序生成。

解法选择
--------

.. list-table::
   :header-rows: 1

   * - 方法
     - 时间复杂度
     - 额外空间
     - 取舍
   * - 排序 + 起点约束回溯
     - 输出敏感的指数级
     - ``O(target / min)``
     - 主解法；自然去除排列重复并支持元素复用
   * - 动态规划只判断可达性
     - 伪多项式
     - ``O(target)``
     - 只能判断是否存在，不能直接枚举全部组合
   * - 枚举所有有序选择序列再去重
     - 更高指数级
     - 很高
     - 大量生成 ``[2,3]`` 与 ``[3,2]`` 等重复排列

主解法：非递减路径回溯
----------------------

状态含义
~~~~~~~~

递归 ``search(start, remaining)`` 表示：

* 只允许使用下标 ``start`` 及之后的候选；
* 每个允许候选仍可使用任意次；
* 需要枚举所有和为 ``remaining`` 的非递减后缀，并接在当前 ``path`` 后面。

终止条件：

* ``remaining == 0``：当前路径恰好构成答案，复制并保存；
* 当前候选大于 ``remaining``：数组已排序，后续候选只会更大，可结束本层循环。

为什么递归传入 index
~~~~~~~~~~~~~~~~~~~~

选择 ``candidates[index]`` 后继续传入 ``index``，使同一数字仍可再次被选中。例如构造
``[2, 2, 3]`` 时，第一次选择 2 后下一层仍能从 2 开始。

若传入 ``index + 1``，每个候选最多使用一次，会变成 0040 的选择模型。

核心不变量
~~~~~~~~~~

进入 ``search(start, remaining)`` 时：

* ``path`` 中的元素来自候选数组且按非递减顺序排列；
* ``sum(path) + remaining == target``；
* 后续只允许选择下标不小于 ``start`` 的候选；
* 当前递归子树中的每个叶子都对应以 ``path`` 为前缀的唯一组合。

选择一个不超过 ``remaining`` 的候选后，路径和增加该值，``remaining`` 同量减少，不变量继续成立。

正确性依据
~~~~~~~~~~

先证明生成的每个答案合法。算法只从候选数组中选数；每次选择后从 ``remaining`` 减去该正数；
只有 ``remaining == 0`` 时才保存路径，因此所有输出组合的和恰好等于 ``target``。

再证明不会重复。任何组合都可唯一写成非递减序列。算法限制下标单调不减，因此只会沿这一个顺序
生成该组合，不会生成它的其他排列。

最后证明不会遗漏。取任意合法组合并按非递减顺序排列。它的第一个值对应某个候选下标，算法在
根层会枚举该下标；由于递归继续允许当前下标，组合中的重复值也能依次选择；后续更大值的下标
不小于当前下标，因此整条选择序列都存在于搜索树中。其和最终使 ``remaining`` 变为 0，答案会
被保存。

复杂度
~~~~~~

设最小候选为 ``m``，递归深度最多 ``target / m``。搜索树在最坏情况下呈指数增长；精确复杂度
取决于候选值、目标值和答案数量，通常写为输出敏感的指数级。

* 每个搜索节点处理一次选择或回退；
* 每个答案还需要复制其路径；
* 递归栈与路径额外空间为 ``O(target / m)``，不计输出结果。

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
           int value = candidates[index];
           if (value > remaining) {
               break;
           }

           result->path[result->path_length++] = value;
           search(
               candidates,
               candidate_count,
               index,
               remaining - value,
               result
           );
           --result->path_length;
       }
   }

   int **combinationSum(
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
           (size_t)(target / candidates[0] + 1) * sizeof(int)
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

结果二维数组及各行由调用者按平台约定释放。输入候选数组会被原地排序。

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
               int value = candidates[index];
               if (value > remaining) {
                   break;
               }

               path.push_back(value);
               search(candidates, index, remaining - value);
               path.pop_back();
           }
       }

   public:
       std::vector<std::vector<int>> combinationSum(
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
       def combinationSum(
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
                   value = candidates[index]
                   if value > remaining:
                       break

                   path.append(value)
                   search(index, remaining - value)
                   path.pop()

           search(0, target)
           return answers

Java
~~~~

.. code-block:: java

   class Solution {
       private final List<List<Integer>> answers = new ArrayList<>();
       private final List<Integer> path = new ArrayList<>();

       public List<List<Integer>> combinationSum(
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
               int value = candidates[index];
               if (value > remaining) {
                   break;
               }

               path.add(value);
               search(candidates, index, remaining - value);
               path.remove(path.size() - 1);
           }
       }
   }

Rust
~~~~

.. code-block:: rust

   impl Solution {
       pub fn combination_sum(
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
                   let value = candidates[index];
                   if value > remaining {
                       break;
                   }

                   path.push(value);
                   search(
                       candidates,
                       index,
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

   func combinationSum(candidates []int, target int) [][]int {
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
               value := candidates[index]
               if value > remaining {
                   break
               }

               path = append(path, value)
               search(index, remaining-value)
               path = path[:len(path)-1]
           }
       }

       search(0, target)
       return answers
   }

TypeScript
~~~~~~~~~~

.. code-block:: typescript

   function combinationSum(
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
               const value = candidates[index];
               if (value > remaining) {
                   break;
               }

               path.push(value);
               search(index, remaining - value);
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

       public IList<IList<int>> CombinationSum(
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
               int value = candidates[index];
               if (value > remaining) {
                   break;
               }

               path.Add(value);
               Search(candidates, index, remaining - value);
               path.RemoveAt(path.Count - 1);
           }
       }
   }

Julia
~~~~~

.. code-block:: julia

   function combination_sum(
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
               value = candidates[index]
               value > remaining && break

               push!(path, value)
               search(index, remaining - value)
               pop!(path)
           end
       end

       search(1, target)
       return answers
   end

Julia 使用一基候选下标；递归传入同一个 ``index`` 仍表示当前候选可以复用。

R
~

.. code-block:: r

   combination_sum <- function(candidates, target) {
     candidates <- sort(candidates)
     answers <- list()
     path <- integer(0)

     search <- function(start, remaining) {
       if (remaining == 0L) {
         answers[[length(answers) + 1L]] <<- path
         return(invisible(NULL))
       }

       for (index in start:length(candidates)) {
         value <- candidates[[index]]
         if (value > remaining) {
           break
         }

         path <<- c(path, value)
         search(index, remaining - value)
         path <<- path[-length(path)]
       }

       invisible(NULL)
     }

     search(1L, target)
     answers
   }

题目保证候选数组非空。R 的闭包使用 ``<<-`` 修改当前函数环境中的路径和答案集合。

关键边界
--------

* 候选值全部大于目标：根层立即剪枝，返回空列表；
* 某个候选恰好等于剩余值：选择后 ``remaining`` 变为 0；
* 最小候选可重复很多次：递归深度可能接近 ``target / min``；
* 候选输入顺序无序：必须先排序，才能安全使用 ``value > remaining`` 的 ``break``；
* 所有候选为正数：``remaining`` 严格下降，搜索一定终止。

易错点
------

* 选择后递归传入 ``index + 1``，错误地禁止候选复用；
* 每层都从 0 开始，生成同一组合的不同排列；
* 保存答案时直接保存可变 ``path`` 引用，后续回退会修改历史答案；
* 忘记回退最后一个元素，污染兄弟分支；
* 未排序却在遇到大值时 ``break``，可能漏掉后面的较小候选；
* 候选含 0 或负数时仍使用同一模型，递归可能无法终止；本题正数约束十分关键。

新增与强化知识
--------------

新增
~~~~

* 组合枚举可用单调起点下标消除排列重复；
* 递归传入当前下标或下一下标，分别表达“可复用”和“仅一次”；
* 正数与排序共同支持按剩余值剪枝；
* 组合复杂度通常需要按搜索树和输出规模描述。

强化
~~~~

* 0017、0022、0037 的回溯框架继续复用“选择、递归、撤销”；
* 0015、0018 的排序去重思想在本题转化为非递减路径约束；
* 可变路径保存答案时必须复制；
* 正确性证明应分别覆盖合法性、无重复和完整性。

最小自检
--------

#. 为什么选择候选后递归仍传入当前 ``index``？
#. 为什么每层不能重新从下标 0 开始？
#. 排序后遇到 ``value > remaining`` 为什么可以直接结束本层？
#. 为什么题目的正数约束保证递归终止？
#. 保存答案时为什么必须复制 ``path``？

答案要点
~~~~~~~~

#. 当前候选允许不限次数使用。
#. 会生成相同多重集合的不同排列，造成重复。
#. 后续候选只会更大，都不可能放入当前剩余值。
#. 每次选择都会让 ``remaining`` 严格减小，且不会低于 0 后继续递归。
#. 回溯会继续修改同一个路径对象，历史答案需要独立快照。
