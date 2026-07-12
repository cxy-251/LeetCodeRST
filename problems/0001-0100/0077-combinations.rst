0077. Combinations
==================

题目信息
--------

:题号: 0077
:难度: Medium
:主题: 回溯、组合、剪枝
:原题: `LeetCode 0077 <https://leetcode.com/problems/combinations/>`_
:访问状态: Available
:教学重点: 严格递增路径、剩余容量剪枝、结果快照、输出复杂度

题目重述
--------

给定整数 ``n`` 和 ``k``，返回从 ``1`` 到 ``n`` 中选出恰好 ``k`` 个不同整数的全部组合。组合内部按
递增顺序保存，结果集合顺序不作要求。

题目保证 ``1 <= n <= 20``、``1 <= k <= n``。输入是标量，不发生修改。每个返回组合必须拥有独立
快照，后续回溯不能改写已经保存的答案。

自建示例
--------

.. code-block:: text

   输入：n = 5，k = 3
   输出：
   [[1,2,3], [1,2,4], [1,2,5], [1,3,4], [1,3,5],
    [1,4,5], [2,3,4], [2,3,5], [2,4,5], [3,4,5]]

当 ``k = n`` 时只有 ``[1,2,...,n]`` 一个答案；当 ``k = 1`` 时每个单独数字形成一个答案。

问题抽象
--------

回溯路径保存已经选择的严格递增前缀。参数 ``start`` 表示下一项允许选择的最小数字。选择 ``value`` 后
递归到 ``value + 1``，因此同一集合只会以递增顺序生成一次，不需要额外去重。

若当前还需要 ``needed`` 个数字，候选起点最大只能是：

.. code-block:: text

   last_start = n - needed + 1

从更大的数字开始时，连同它右侧全部数字也不足以填满路径，可以直接剪枝。

解法选择
--------

.. list-table::
   :header-rows: 1

   * - 方法
     - 时间复杂度
     - 额外空间
     - 定位
   * - 严格递增回溯并做容量剪枝
     - ``O(C(n,k) × k)``
     - ``O(k)`` 工作空间
     - 主解法；直接生成全部答案
   * - 枚举 ``2^n`` 个子集后筛选长度
     - ``O(2^n × n)``
     - ``O(n)`` 工作空间
     - 访问大量不可能成为答案的节点

主解法：严格递增回溯
--------------------

状态定义与核心不变量
~~~~~~~~~~~~~~~~~~~~

递归入口维护：

* ``path`` 长度为 ``depth``，其中数字严格递增且都位于 ``1..n``；
* ``start`` 大于 ``path`` 最后一个数字，若路径为空则为 1；
* 所有以更小首个未选数字开头的分支已经完整生成；
* 尚未生成的答案，若共享当前前缀，其下一项必定位于 ``start..last_start``。

当路径长度达到 ``k`` 时，它已经是一个合法组合，应复制为独立结果。递归返回后撤销最后一次选择，恢复
父层路径，再探索下一个候选。

容量剪枝为何安全
~~~~~~~~~~~~~~~~

当前还需 ``needed = k - depth`` 个数字。若选择 ``value``，可使用的数字总数为 ``n - value + 1``。
合法选择必须满足：

.. code-block:: text

   n - value + 1 >= needed
   value <= n - needed + 1

因此循环只需要到 ``last_start``。被跳过的更大候选没有足够后继数字，不可能扩展成长度 ``k`` 的组合。

正确性依据
~~~~~~~~~~

**生成结果合法。** 每次递归只选择至少为 ``start`` 的数字，并把下一层起点设为 ``value + 1``，所以
路径严格递增、没有重复且位于 ``1..n``。只在长度等于 ``k`` 时保存，故每个结果都是合法组合。

**生成结果完整。** 任意合法组合 ``a1 < a2 < ... < ak``。根层循环包含 ``a1``，进入该分支后下一层
循环包含 ``a2``，依此类推。容量剪枝不会删除该路径，因为组合自身提供了足够的剩余数字。因此每个合法
组合都能到达一个叶子。

**不会重复。** 每个组合只有唯一的严格递增排列。递归路径由该排列唯一决定，不同分支在首次不同选择处
分离，所以同一组合不会被生成两次。

**终止性。** 每次递归路径长度增加一，最大深度为 ``k``；每层候选区间有限，递归树有限。

复杂度
~~~~~~

共有 ``C(n,k)`` 个答案，每个答案需要复制 ``k`` 个整数，所以不可避免的时间和返回空间均为
``Theta(C(n,k) × k)``。

除返回结果外：

* 路径和递归栈深度均为 ``O(k)``；
* 剪枝减少无效内部节点，但不改变输出主导的渐进上界；
* C 预先计算 ``C(n,k)`` 作为外层容量，并为每个叶子分配独立行；
* C 任一分配失败时释放已完成的全部行，返回 ``NULL``；资源失败不属于题目输入域。

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
       int n;
       int k;
       int **rows;
       int *columns;
       int *path;
       size_t size;
       size_t capacity;
       bool failed;
   } CombineContext;

   static size_t combination_count(int n, int k) {
       int choose = k;
       if (choose > n - choose) {
           choose = n - choose;
       }

       size_t count = 1;
       for (int index = 1; index <= choose; ++index) {
           count = count * (size_t)(n - choose + index) / (size_t)index;
       }
       return count;
   }

   static void build_combinations(
       CombineContext *context,
       int start,
       int depth
   ) {
       if (context->failed) {
           return;
       }
       if (depth == context->k) {
           int *row = malloc((size_t)context->k * sizeof(*row));
           if (row == NULL) {
               context->failed = true;
               return;
           }
           memcpy(row, context->path, (size_t)context->k * sizeof(*row));
           context->rows[context->size] = row;
           context->columns[context->size] = context->k;
           ++context->size;
           return;
       }

       const int needed = context->k - depth;
       const int last_start = context->n - needed + 1;
       for (int value = start; value <= last_start; ++value) {
           context->path[depth] = value;
           build_combinations(context, value + 1, depth + 1);
       }
   }

   int **combine(int n, int k, int *returnSize, int **returnColumnSizes) {
       *returnSize = 0;
       *returnColumnSizes = NULL;

       const size_t capacity = combination_count(n, k);
       int **rows = malloc(capacity * sizeof(*rows));
       int *columns = malloc(capacity * sizeof(*columns));
       int *path = malloc((size_t)k * sizeof(*path));
       if (rows == NULL || columns == NULL || path == NULL) {
           free(rows);
           free(columns);
           free(path);
           return NULL;
       }

       CombineContext context = {
           n, k, rows, columns, path, 0, capacity, false
       };
       build_combinations(&context, 1, 0);
       free(path);

       if (context.failed || context.size != context.capacity) {
           for (size_t index = 0; index < context.size; ++index) {
               free(rows[index]);
           }
           free(rows);
           free(columns);
           return NULL;
       }

       *returnSize = (int)context.size;
       *returnColumnSizes = columns;
       return rows;
   }

C++
~~~

.. code-block:: cpp

   #include <vector>

   class Solution {
   public:
       std::vector<std::vector<int>> combine(int n, int k) {
           std::vector<std::vector<int>> result;
           std::vector<int> path;
           backtrack(1, n, k, path, result);
           return result;
       }

   private:
       static void backtrack(
           int start,
           int n,
           int k,
           std::vector<int>& path,
           std::vector<std::vector<int>>& result
       ) {
           if (static_cast<int>(path.size()) == k) {
               result.push_back(path);
               return;
           }

           const int needed = k - static_cast<int>(path.size());
           const int lastStart = n - needed + 1;
           for (int value = start; value <= lastStart; ++value) {
               path.push_back(value);
               backtrack(value + 1, n, k, path, result);
               path.pop_back();
           }
       }
   };

Python
~~~~~~

.. code-block:: python

   class Solution:
       def combine(self, n: int, k: int) -> list[list[int]]:
           result: list[list[int]] = []
           path: list[int] = []

           def backtrack(start: int) -> None:
               if len(path) == k:
                   result.append(path.copy())
                   return

               needed = k - len(path)
               last_start = n - needed + 1
               for value in range(start, last_start + 1):
                   path.append(value)
                   backtrack(value + 1)
                   path.pop()

           backtrack(1)
           return result

Java
~~~~

.. code-block:: java

   import java.util.ArrayList;
   import java.util.List;

   class Solution {
       public List<List<Integer>> combine(int n, int k) {
           List<List<Integer>> result = new ArrayList<>();
           List<Integer> path = new ArrayList<>(k);
           backtrack(1, n, k, path, result);
           return result;
       }

       private void backtrack(
           int start,
           int n,
           int k,
           List<Integer> path,
           List<List<Integer>> result
       ) {
           if (path.size() == k) {
               result.add(new ArrayList<>(path));
               return;
           }

           int needed = k - path.size();
           int lastStart = n - needed + 1;
           for (int value = start; value <= lastStart; ++value) {
               path.add(value);
               backtrack(value + 1, n, k, path, result);
               path.remove(path.size() - 1);
           }
       }
   }

Rust
~~~~

.. code-block:: rust

   impl Solution {
       pub fn combine(n: i32, k: i32) -> Vec<Vec<i32>> {
           fn backtrack(
               start: i32,
               n: i32,
               k: usize,
               path: &mut Vec<i32>,
               result: &mut Vec<Vec<i32>>,
           ) {
               if path.len() == k {
                   result.push(path.clone());
                   return;
               }

               let needed = k - path.len();
               let last_start = n - needed as i32 + 1;
               for value in start..=last_start {
                   path.push(value);
                   backtrack(value + 1, n, k, path, result);
                   path.pop();
               }
           }

           let mut result = Vec::new();
           let mut path = Vec::with_capacity(k as usize);
           backtrack(1, n, k as usize, &mut path, &mut result);
           result
       }
   }

Go
~~

.. code-block:: go

   func combine(n int, k int) [][]int {
       result := make([][]int, 0)
       path := make([]int, 0, k)

       var backtrack func(int)
       backtrack = func(start int) {
           if len(path) == k {
               snapshot := append([]int(nil), path...)
               result = append(result, snapshot)
               return
           }

           needed := k - len(path)
           lastStart := n - needed + 1
           for value := start; value <= lastStart; value++ {
               path = append(path, value)
               backtrack(value + 1)
               path = path[:len(path)-1]
           }
       }

       backtrack(1)
       return result
   }

TypeScript
~~~~~~~~~~

.. code-block:: typescript

   function combine(n: number, k: number): number[][] {
       const result: number[][] = [];
       const path: number[] = [];

       function backtrack(start: number): void {
           if (path.length === k) {
               result.push([...path]);
               return;
           }

           const needed = k - path.length;
           const lastStart = n - needed + 1;
           for (let value = start; value <= lastStart; value += 1) {
               path.push(value);
               backtrack(value + 1);
               path.pop();
           }
       }

       backtrack(1);
       return result;
   }

C#
~~

.. code-block:: csharp

   using System.Collections.Generic;

   public class Solution {
       public IList<IList<int>> Combine(int n, int k) {
           var result = new List<IList<int>>();
           var path = new List<int>(k);
           Backtrack(1, n, k, path, result);
           return result;
       }

       private static void Backtrack(
           int start,
           int n,
           int k,
           List<int> path,
           List<IList<int>> result
       ) {
           if (path.Count == k) {
               result.Add(new List<int>(path));
               return;
           }

           int needed = k - path.Count;
           int lastStart = n - needed + 1;
           for (int value = start; value <= lastStart; ++value) {
               path.Add(value);
               Backtrack(value + 1, n, k, path, result);
               path.RemoveAt(path.Count - 1);
           }
       }
   }

Julia
~~~~~

.. code-block:: julia

   function combine(n::Int, k::Int)::Vector{Vector{Int}}
       result = Vector{Vector{Int}}()
       path = Int[]

       function backtrack(start::Int)
           if length(path) == k
               push!(result, copy(path))
               return
           end

           needed = k - length(path)
           last_start = n - needed + 1
           if start > last_start
               return
           end

           for value in start:last_start
               push!(path, value)
               backtrack(value + 1)
               pop!(path)
           end
       end

       backtrack(1)
       return result
   end

R
~

.. code-block:: r

   combine <- function(n, k) {
     result <- list()
     path <- integer(k)

     backtrack <- function(start, depth) {
       if (depth > k) {
         result[[length(result) + 1L]] <<- as.integer(path)
         return(invisible(NULL))
       }

       needed <- k - depth + 1L
       last_start <- n - needed + 1L
       if (start > last_start) {
         return(invisible(NULL))
       }

       for (value in seq.int(start, last_start)) {
         path[depth] <<- value
         backtrack(value + 1L, depth + 1L)
       }
       invisible(NULL)
     }

     backtrack(1L, 1L)
     result
   }

验证计划与证据
--------------

* 固定用例覆盖 ``k=1``、``k=n``、一般组合和最大输出附近的规模；
* Python 将输出规范化为元组集合，与 ``itertools.combinations`` 随机对拍；
* C、C++、Java、Go、TypeScript 编译并检查数量、递增性、唯一性和快照独立性；
* Rust、C#、Julia、R 在缺少运行时的环境中执行静态控制流和接口检查。

关键边界
--------

* 路径必须严格递增；否则同一集合会产生多个排列；
* 保存答案时必须复制路径，不能保存随后会被撤销的共享容器；
* ``last_start`` 由剩余所需数量推导，不能使用固定 ``n`` 作为所有层上界；
* C 的 ``C(20,10)=184756``，外层数量和 ``returnSize`` 都在 32 位有符号整数范围内；
* R 使用固定长度路径并在叶子创建整数快照，避免每层反复拼接路径。

易错点
------

* 下一层仍从 ``value`` 开始会重复选择同一数字；
* 用 ``n-k+1`` 作为所有深度的固定上界，会错误删除后续层候选；
* C 只释放外层数组而遗漏已经分配的结果行，会在失败路径泄漏；
* 复杂度只写 ``O(C(n,k))`` 会遗漏每个答案复制 ``k`` 个整数的成本。

本题新增知识
------------

* 严格递增路径与无重复组合之间的一一对应；
* 根据剩余路径长度计算每层最后合法起点；
* 用组合数推导输出规模和 C 的精确外层容量。

本题强化知识
------------

* 可变回溯路径的选择、递归、撤销和答案快照；
* 按前缀划分搜索树的完整性与无重复证明；
* 输出敏感复杂度。

关联题目
--------

* `0022. Generate Parentheses <0022-generate-parentheses.rst>`_
* `0039. Combination Sum <0039-combination-sum.rst>`_
* `0046. Permutations <0046-permutations.rst>`_

最小自检
--------

#. ``start`` 为什么必须比路径最后一个数字大？
#. 当前还需要 ``needed`` 个数字时，最大候选为何是 ``n-needed+1``？
#. 保存答案时为什么必须复制 ``path``？
#. 准确的输出主导复杂度是什么？

答案要点
~~~~~~~~

严格递增顺序为每个集合提供唯一表示。若起点超过 ``n-needed+1``，剩余数字数量不足。路径随后会继续
修改和撤销，所以叶子必须保存快照；时间和返回空间都由 ``Theta(C(n,k) × k)`` 主导。
