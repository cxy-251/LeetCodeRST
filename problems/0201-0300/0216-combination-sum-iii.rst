0216. Combination Sum III
=========================

题目信息
--------

:题号: 0216
:难度: Medium
:主题: 回溯、组合枚举、可达范围剪枝
:原题: `LeetCode 0216 <https://leetcode.com/problems/combination-sum-iii/>`_
:访问状态: Available
:教学重点: 用严格递增路径唯一表示组合，并依据剩余槽位的最小和、最大和剪去无解状态

精确契约
--------

从 ``1`` 到 ``9`` 中选择恰好 ``k`` 个互不相同的数字，使它们的和等于 ``n``，返回所有合法组合。

官方约束为：

* ``2 <= k <= 9``；
* ``1 <= n <= 60``；
* 每个数字只能使用一次；
* 结果中不能包含重复组合；
* 组合和组合之间的返回顺序不作要求。

本文让每个组合内部保持严格递增。这个顺序不是额外限制：任意一组互不相同的数字都只有一种递增排列，因而它可以同时解决“数字不可重复”和“组合不可重复”两个问题。

示例
----

单一答案
~~~~~~~~

.. code-block:: text

   k = 3, n = 7
   answer = [[1, 2, 4]]

``1+2+4=7``。``[1,4,2]`` 只是同一组合的另一种排列，不应再次生成。

多个答案
~~~~~~~~

.. code-block:: text

   k = 3, n = 9
   answer = [
       [1, 2, 6],
       [1, 3, 5],
       [2, 3, 4]
   ]

每个结果都恰好包含三个互不相同的数字。

目标过小
~~~~~~~~

.. code-block:: text

   k = 4, n = 1
   answer = []

选择四个不同数字时，最小可能和为 ``1+2+3+4=10``，已经超过目标。

目标过大
~~~~~~~~

.. code-block:: text

   k = 2, n = 18
   answer = []

两个不同数字的最大和为 ``8+9=17``，无法达到 18。

使用全部数字
~~~~~~~~~~~~

.. code-block:: text

   k = 9, n = 45
   answer = [[1, 2, 3, 4, 5, 6, 7, 8, 9]]

当 ``k=9`` 时只能选择全部数字，它们的和为 45。

搜索状态
--------

回溯过程逐步构造一个严格递增组合。递归状态由四部分组成：

``start``
   下一层允许选择的最小数字。

``slots``
   还需要选择多少个数字。

``remaining``
   还需要凑出的和。

``path``
   当前已经选择的严格递增前缀。

初始状态为：

.. code-block:: text

   start = 1
   slots = k
   remaining = n
   path = []

本层选择 ``value`` 后进入：

.. code-block:: text

   start = value + 1
   slots = slots - 1
   remaining = remaining - value

下一层只能选择更大的数字，因此同一数字不会再次使用，同一组合也不会通过不同排列重复出现。

搜索不变量
----------

每次进入递归函数时维护：

#. ``path`` 中的数字都在 ``1..9`` 内，并且严格递增；
#. ``len(path)+slots=k``；
#. ``sum(path)+remaining=n``；
#. 后续候选只能来自 ``start..9``。

初始路径为空，不变量成立。选择 ``value>=start`` 后，下一层从 ``value+1`` 开始，严格递增性继续成立；同时槽位减少 1、剩余和减少 ``value``，数量和总和关系也继续成立。

终止条件
--------

当 ``slots=0`` 时，路径已经包含恰好 ``k`` 个数字：

* 若 ``remaining=0``，保存当前路径的副本；
* 若 ``remaining!=0``，数量已经用完，当前分支无解。

不能只在 ``remaining=0`` 时提交，因为路径可能还不足 ``k`` 个数字；也不能只在路径长度达到 ``k`` 时提交，因为总和可能不等于 ``n``。

可达范围剪枝
------------

回溯枚举的候选只有九个，直接搜索已经可以完成题目。为了让状态含义更清楚，并避免进入确定无解的分支，可以根据剩余槽位计算可达和范围。

候选数量不足
~~~~~~~~~~~~

若从 ``start`` 到 9 的数字数量少于 ``slots``，当前状态无法填满组合：

.. code-block:: text

   start + slots - 1 > 9

此时立即返回。

最小可达和
~~~~~~~~~~

要让后续和尽可能小，应选择：

.. code-block:: text

   start, start+1, ..., start+slots-1

最小可达和为：

.. code-block:: text

   minimum = slots * (2*start + slots - 1) / 2

若 ``remaining < minimum``，任何后续选择都会超过剩余目标，当前分支无解。

最大可达和
~~~~~~~~~~

要让后续和尽可能大，应选择 ``1..9`` 中最大的 ``slots`` 个数字：

.. code-block:: text

   10-slots, 11-slots, ..., 9

最大可达和为：

.. code-block:: text

   maximum = slots * (19 - slots) / 2

在候选数量充足的前提下，这些数字都位于允许区间 ``start..9``。若 ``remaining > maximum``，当前分支同样无解。

候选上界
~~~~~~~~

本层选择一个数字后，还要留下 ``slots-1`` 个更大的数字。因此本层最多选择：

.. code-block:: text

   10 - slots

例如还需选择三个数字时，本层最大只能选 7，才能把 8 和 9 留给后续位置。

状态恢复与结果快照
------------------

数组或列表实现通常执行：

.. code-block:: text

   path.push(value)
   dfs(value + 1, slots - 1, remaining - value)
   path.pop()

递归返回后必须撤销本层选择，使下一个兄弟分支重新从进入本层前的路径开始。

找到答案时保存的是 ``path`` 的副本。若把同一个可变列表直接放进结果，后续 ``pop`` 和新的选择会继续修改已经记录的答案。

正确性证明
----------

**引理一：搜索生成的每条路径都由互不相同且严格递增的 ``1..9`` 数字组成。**

每层只从 ``start..9`` 中选择；选择 ``value`` 后，下一层的起点变为 ``value+1``。因此后续数字严格大于此前数字，不会重复使用任何值。

**引理二：算法提交的每个结果都是合法组合。**

算法只在 ``slots=0`` 且 ``remaining=0`` 时提交。由搜索不变量，此时路径长度为 ``k``、路径和为 ``n``；再结合引理一，结果满足数字范围、互不相同和数量要求。

**引理三：每个合法组合都会被搜索到。**

任取合法组合，并把它唯一地写成递增序列 ``c1<c2<...<ck``。第一层候选包含 ``c1``；选择 ``c1`` 后，下一层候选包含 ``c2``，依此类推，所以存在一条搜索路径按顺序选择全部 ``ci``。合法组合的剩余数字之和必然位于该状态的最小可达和与最大可达和之间，候选数量也足够，因此这条路径不会被剪掉。

**引理四：每个合法组合只会提交一次。**

搜索路径必须严格递增，而一个组合只有一种严格递增排列。因此同一组数字不可能通过另一条排列路径再次生成。

**定理：算法恰好返回全部合法组合且没有重复。**

引理二保证所有输出都合法；引理三保证没有遗漏；引理四保证没有重复。

复杂度
------

候选全集只有九个数字：

* 搜索树至多考察 ``1..9`` 的全部子集，节点数量为 ``O(2^9)``；
* 每次保存答案需要复制 ``k`` 个数字。若答案数为 ``A``，输出复制成本为 ``O(Ak)``；
* 递归深度和当前路径长度最多为 ``k``，不计返回结果时额外空间为 ``O(k)``；
* 返回结果本身占 ``O(Ak)`` 空间。

``2^9`` 在本题中是固定上限，但保留这个表达式能说明回溯搜索来自子集枚举。

十语言实现
----------

C
~

.. code-block:: c

   #include <stdbool.h>
   #include <stdlib.h>

   enum { MAX_COMBINATIONS = 126 };

   typedef struct {
       int **rows;
       int *columns;
       int size;
       int k;
       int path[9];
       bool failed;
   } Context;

   static int minimum_sum(int start, int slots) {
       return slots * (2 * start + slots - 1) / 2;
   }

   static int maximum_sum(int slots) {
       return slots * (19 - slots) / 2;
   }

   static void save_path(Context *context) {
       int *row = (int *)malloc((size_t)context->k * sizeof(int));
       if (row == NULL) {
           context->failed = true;
           return;
       }
       for (int i = 0; i < context->k; ++i) {
           row[i] = context->path[i];
       }
       context->rows[context->size] = row;
       context->columns[context->size] = context->k;
       ++context->size;
   }

   static void search(
       Context *context,
       int start,
       int slots,
       int remaining,
       int depth
   ) {
       if (context->failed) return;
       if (slots == 0) {
           if (remaining == 0) save_path(context);
           return;
       }
       if (start + slots - 1 > 9) return;
       if (remaining < minimum_sum(start, slots) ||
           remaining > maximum_sum(slots)) {
           return;
       }

       const int upper = 10 - slots;
       for (int value = start; value <= upper; ++value) {
           if (value > remaining) break;
           context->path[depth] = value;
           search(
               context,
               value + 1,
               slots - 1,
               remaining - value,
               depth + 1
           );
       }
   }

   int **combinationSum3(
       int k,
       int n,
       int *returnSize,
       int **returnColumnSizes
   ) {
       *returnSize = 0;
       *returnColumnSizes = NULL;

       Context context = {0};
       context.rows = (int **)malloc(
           MAX_COMBINATIONS * sizeof(int *)
       );
       context.columns = (int *)malloc(
           MAX_COMBINATIONS * sizeof(int)
       );
       context.k = k;

       if (context.rows == NULL || context.columns == NULL) {
           free(context.rows);
           free(context.columns);
           return NULL;
       }

       search(&context, 1, k, n, 0);

       if (context.failed) {
           for (int i = 0; i < context.size; ++i) free(context.rows[i]);
           free(context.rows);
           free(context.columns);
           return NULL;
       }
       if (context.size == 0) {
           free(context.rows);
           free(context.columns);
           return NULL;
       }

       *returnSize = context.size;
       *returnColumnSizes = context.columns;
       return context.rows;
   }

九个候选中同一长度的组合最多有 ``C(9,4)=126`` 个，因此固定的行指针容量足够。每个答案行仍单独分配并交给调用方释放。

C++
~~~

.. code-block:: cpp

   class Solution {
       std::vector<std::vector<int>> answer;
       std::vector<int> path;

       static int minimumSum(int start, int slots) {
           return slots * (2 * start + slots - 1) / 2;
       }

       static int maximumSum(int slots) {
           return slots * (19 - slots) / 2;
       }

       void dfs(int start, int slots, int remaining) {
           if (slots == 0) {
               if (remaining == 0) answer.push_back(path);
               return;
           }
           if (start + slots - 1 > 9) return;
           if (remaining < minimumSum(start, slots) ||
               remaining > maximumSum(slots)) return;

           for (int value = start; value <= 10 - slots; ++value) {
               if (value > remaining) break;
               path.push_back(value);
               dfs(value + 1, slots - 1, remaining - value);
               path.pop_back();
           }
       }

   public:
       std::vector<std::vector<int>> combinationSum3(int k, int n) {
           dfs(1, k, n);
           return answer;
       }
   };

需要 ``<vector>``。``push_back`` 后递归，返回时 ``pop_back`` 恢复路径。

Python
~~~~~~

.. code-block:: python

   class Solution:
       def combinationSum3(self, k: int, n: int) -> list[list[int]]:
           answer: list[list[int]] = []
           path: list[int] = []

           def dfs(start: int, slots: int, remaining: int) -> None:
               if slots == 0:
                   if remaining == 0:
                       answer.append(path.copy())
                   return
               if start + slots - 1 > 9:
                   return

               minimum = slots * (2 * start + slots - 1) // 2
               maximum = slots * (19 - slots) // 2
               if remaining < minimum or remaining > maximum:
                   return

               for value in range(start, 11 - slots):
                   if value > remaining:
                       break
                   path.append(value)
                   dfs(value + 1, slots - 1, remaining - value)
                   path.pop()

           dfs(1, k, n)
           return answer

``path.copy()`` 保存当前答案快照；直接保存 ``path`` 会受到后续回溯修改。

Java
~~~~

.. code-block:: java

   class Solution {
       private final java.util.List<java.util.List<Integer>> answer =
           new java.util.ArrayList<>();
       private final java.util.List<Integer> path =
           new java.util.ArrayList<>();

       public java.util.List<java.util.List<Integer>> combinationSum3(
           int k,
           int n
       ) {
           dfs(1, k, n);
           return answer;
       }

       private void dfs(int start, int slots, int remaining) {
           if (slots == 0) {
               if (remaining == 0) {
                   answer.add(new java.util.ArrayList<>(path));
               }
               return;
           }
           if (start + slots - 1 > 9) return;

           int minimum = slots * (2 * start + slots - 1) / 2;
           int maximum = slots * (19 - slots) / 2;
           if (remaining < minimum || remaining > maximum) return;

           for (int value = start; value <= 10 - slots; ++value) {
               if (value > remaining) break;
               path.add(value);
               dfs(value + 1, slots - 1, remaining - value);
               path.remove(path.size() - 1);
           }
       }
   }

``new ArrayList<>(path)`` 创建独立答案，避免后续删除路径元素时修改结果。

Rust
~~~~

.. code-block:: rust

   impl Solution {
       pub fn combination_sum3(k: i32, n: i32) -> Vec<Vec<i32>> {
           fn dfs(
               start: i32,
               slots: i32,
               remaining: i32,
               path: &mut Vec<i32>,
               answer: &mut Vec<Vec<i32>>,
           ) {
               if slots == 0 {
                   if remaining == 0 {
                       answer.push(path.clone());
                   }
                   return;
               }
               if start + slots - 1 > 9 {
                   return;
               }

               let minimum = slots * (2 * start + slots - 1) / 2;
               let maximum = slots * (19 - slots) / 2;
               if remaining < minimum || remaining > maximum {
                   return;
               }

               for value in start..=(10 - slots) {
                   if value > remaining {
                       break;
                   }
                   path.push(value);
                   dfs(
                       value + 1,
                       slots - 1,
                       remaining - value,
                       path,
                       answer,
                   );
                   path.pop();
               }
           }

           let mut answer = Vec::new();
           let mut path = Vec::with_capacity(k as usize);
           dfs(1, k, n, &mut path, &mut answer);
           answer
       }
   }

``path.clone()`` 只在发现答案时执行，递归过程继续复用同一条路径缓冲区。

Go
~~

.. code-block:: go

   func combinationSum3(k int, n int) [][]int {
       answer := make([][]int, 0)
       path := make([]int, 0, k)

       var dfs func(start int, slots int, remaining int)
       dfs = func(start int, slots int, remaining int) {
           if slots == 0 {
               if remaining == 0 {
                   snapshot := append([]int(nil), path...)
                   answer = append(answer, snapshot)
               }
               return
           }
           if start+slots-1 > 9 {
               return
           }

           minimum := slots * (2*start + slots - 1) / 2
           maximum := slots * (19 - slots) / 2
           if remaining < minimum || remaining > maximum {
               return
           }

           for value := start; value <= 10-slots; value++ {
               if value > remaining {
                   break
               }
               path = append(path, value)
               dfs(value+1, slots-1, remaining-value)
               path = path[:len(path)-1]
           }
       }

       dfs(1, k, n)
       return answer
   }

``append([]int(nil), path...)`` 复制切片内容，避免答案共享回溯缓冲区。

TypeScript
~~~~~~~~~~

.. code-block:: typescript

   function combinationSum3(k: number, n: number): number[][] {
       const answer: number[][] = [];
       const path: number[] = [];

       function dfs(start: number, slots: number, remaining: number): void {
           if (slots === 0) {
               if (remaining === 0) answer.push([...path]);
               return;
           }
           if (start + slots - 1 > 9) return;

           const minimum = slots * (2 * start + slots - 1) / 2;
           const maximum = slots * (19 - slots) / 2;
           if (remaining < minimum || remaining > maximum) return;

           for (let value = start; value <= 10 - slots; value += 1) {
               if (value > remaining) break;
               path.push(value);
               dfs(value + 1, slots - 1, remaining - value);
               path.pop();
           }
       }

       dfs(1, k, n);
       return answer;
   }

展开语法 ``[...path]`` 创建独立结果数组。

C#
~~

.. code-block:: csharp

   public class Solution {
       private readonly System.Collections.Generic.List<
           System.Collections.Generic.IList<int>
       > answer = new();
       private readonly System.Collections.Generic.List<int> path = new();

       public System.Collections.Generic.IList<
           System.Collections.Generic.IList<int>
       > CombinationSum3(int k, int n) {
           Dfs(1, k, n);
           return answer;
       }

       private void Dfs(int start, int slots, int remaining) {
           if (slots == 0) {
               if (remaining == 0) {
                   answer.Add(new System.Collections.Generic.List<int>(path));
               }
               return;
           }
           if (start + slots - 1 > 9) return;

           int minimum = slots * (2 * start + slots - 1) / 2;
           int maximum = slots * (19 - slots) / 2;
           if (remaining < minimum || remaining > maximum) return;

           for (int value = start; value <= 10 - slots; ++value) {
               if (value > remaining) break;
               path.Add(value);
               Dfs(value + 1, slots - 1, remaining - value);
               path.RemoveAt(path.Count - 1);
           }
       }
   }

创建新的 ``List<int>`` 保存答案快照，字段 ``path`` 只用于当前搜索路径。

Julia
~~~~~

.. code-block:: julia

   function combination_sum3(k::Int, n::Int)::Vector{Vector{Int}}
       answer = Vector{Vector{Int}}()
       path = Int[]

       function dfs(start::Int, slots::Int, remaining::Int)
           if slots == 0
               remaining == 0 && push!(answer, copy(path))
               return
           end
           start + slots - 1 > 9 && return

           minimum = slots * (2 * start + slots - 1) ÷ 2
           maximum = slots * (19 - slots) ÷ 2
           (remaining < minimum || remaining > maximum) && return

           for value in start:(10 - slots)
               value > remaining && break
               push!(path, value)
               dfs(value + 1, slots - 1, remaining - value)
               pop!(path)
           end
       end

       dfs(1, k, n)
       answer
   end

``copy(path)`` 固化答案；``pop!`` 恢复当前路径。

R
~

.. code-block:: r

   combination_sum3 <- function(k, n) {
     answer <- list()
     path <- integer(0)

     dfs <- function(start, slots, remaining) {
       if (slots == 0L) {
         if (remaining == 0L) {
           answer[[length(answer) + 1L]] <<- path
         }
         return(invisible(NULL))
       }
       if (start + slots - 1L > 9L) return(invisible(NULL))

       minimum <- slots * (2L * start + slots - 1L) / 2L
       maximum <- slots * (19L - slots) / 2L
       if (remaining < minimum || remaining > maximum) {
         return(invisible(NULL))
       }

       for (value in seq.int(start, 10L - slots)) {
         if (value > remaining) break
         path <<- c(path, value)
         dfs(value + 1L, slots - 1L, remaining - value)
         path <<- path[-length(path)]
       }
       invisible(NULL)
     }

     dfs(1L, as.integer(k), as.integer(n))
     answer
   }

R 的列表赋值保存当前数值向量；递归返回后删除最后一个元素恢复路径。

关键易错点
----------

* 下一层仍从当前数字开始，导致同一数字被重复使用；
* 每层都从 1 开始，导致同一组合按不同排列重复生成；
* ``remaining=0`` 时忽略路径长度，提交不足 ``k`` 个数字的结果；
* 路径长度达到 ``k`` 时忽略剩余和；
* 递归返回后忘记撤销本层选择，污染兄弟分支；
* 保存可变路径本身而不是副本，导致所有答案随后一起变化；
* 最小可达和没有从当前 ``start`` 计算；
* 本层候选取得过大，没有为剩余槽位留下足够数字。

知识联系
--------

这道题是组合型回溯的标准模型：

* ``start`` 把排列树压缩成组合树；
* ``slots`` 控制结果长度；
* ``remaining`` 控制目标和；
* 最小值与最大值界判断当前状态是否还有可能完成。

相同结构可以迁移到固定长度子集、组合总和、从有序候选中选取若干元素，以及带上下界的搜索问题。候选包含重复值时，还需要在同一搜索层跳过相同候选；候选允许重复使用时，下一层起点应保持为当前位置而不是移动到下一个位置。

自检问题
--------

#. 为什么严格递增路径可以同时保证数字不重复和组合不重复？
#. 为什么必须同时检查 ``slots=0`` 与 ``remaining=0`` 才能提交答案？
#. 状态 ``(start, slots)`` 的最小可达和如何计算？
#. 为什么本层候选最大只能到 ``10-slots``？
#. 为什么找到答案时必须复制 ``path``？

参考答案
~~~~~~~~

#. 每个数字只能向更大的数字转移，因此不会重复使用；同一集合只有一种递增排列，因此不会按不同顺序重复生成。
#. 前者保证数量恰好为 ``k``，后者保证总和恰好为 ``n``，缺少任一条件都可能提交非法结果。
#. 选择从 ``start`` 开始的连续 ``slots`` 个最小整数，和为 ``slots*(2*start+slots-1)/2``。
#. 选择当前值后还需留下 ``slots-1`` 个更大的数字，超过该上界将没有足够候选填满路径。
#. 回溯会继续修改同一个可变路径；副本才能保存发现答案时的内容。