0216. Combination Sum III
=========================

题目信息
--------

:题号: 0216
:难度: Medium
:主题: 回溯、组合、剪枝
:原题: `LeetCode 0216 <https://leetcode.com/problems/combination-sum-iii/>`_
:重点: 从 1 到 9 选择、恰好 k 个、每个数字最多一次、组合不重复

题目重述
--------

从整数 ``1`` 到 ``9`` 中选择恰好 ``k`` 个互不相同的数字，使这些数字的总和等于 ``n``，返回所有满足条件的组合。每个数字在同一个组合中最多使用一次，组合内数字的排列顺序不产生新答案。

``k`` 位于 ``[2, 9]``，``n`` 位于 ``[1, 60]``。结果中不能出现重复组合；每个组合只包含 ``1..9`` 范围内的数字且长度必须正好为 ``k``。若没有可行组合，返回空列表；不同组合之间的返回顺序不作要求。

自建示例
--------

存在多个两数组合：

.. code-block:: text

   输入：k = 2，n = 11
   输出：[[2,9],[3,8],[4,7],[5,6]]
   解释：这些数对都由两个不同的 1..9 数字组成且和为 11；[1,10] 超出取值范围，交换同一数对的顺序不算新组合。

目标超过可达到的最大和：

.. code-block:: text

   输入：k = 4，n = 35
   输出：[]
   解释：从 1..9 中选四个不同数字的最大和是 6+7+8+9=30，因此无法达到 35。

状态定义
--------

递归状态为：

.. code-block:: text

   search(start, slots, remaining, path)

含义：

* 下一候选数字最小为 ``start``；
* 还必须选择恰好 ``slots`` 个数字；
* 这些数字的和必须等于 ``remaining``；
* ``path`` 保存已经选择的严格递增前缀。

每次选择 ``value`` 后递归到：

.. code-block:: text

   search(value + 1, slots - 1, remaining - value, path + [value])

下一起点是 ``value+1``，因此数字不会重复，路径也始终递增。

基本情况
--------

当 ``slots==0``：

* ``remaining==0`` 时，当前路径恰好满足数量和总和要求，提交结果；
* 否则丢弃。

在进入基本情况前不能仅因为 ``remaining==0`` 就提交，因为还可能没有选满 ``k`` 个数字。

上下界剪枝
----------

当前还需选择 ``slots`` 个数字，候选范围是 ``start..9``。

数量剪枝
~~~~~~~~

可用数字数量为：

.. code-block:: text

   10 - start

若：

.. code-block:: text

   10 - start < slots

则无法选满，立即返回。

最小可达和
~~~~~~~~~~

选择当前可用的最小 ``slots`` 个数字：

.. code-block:: text

   start + (start+1) + ... + (start+slots-1)

使用等差数列公式：

.. code-block:: text

   minimum = slots * (2*start + slots - 1) / 2

若 ``remaining < minimum``，任何选择都太大，立即返回。

最大可达和
~~~~~~~~~~

从 ``1..9`` 中最大的 ``slots`` 个数字是：

.. code-block:: text

   9 + 8 + ... + (10-slots)

其和为：

.. code-block:: text

   maximum = slots * (19 - slots) / 2

若 ``remaining > maximum``，即使选择最大的数字也不够，立即返回。

循环中的提前停止
----------------

当前层枚举：

.. code-block:: text

   value = start .. 9

至少要给后续保留 ``slots-1`` 个更大数字，因此当前值最大为：

.. code-block:: text

   10 - slots

选择某个 ``value`` 后，还需要：

.. code-block:: text

   next_slots = slots - 1
   next_remaining = remaining - value

后续最小和为：

.. code-block:: text

   value+1 + value+2 + ... + value+next_slots

若 ``next_remaining`` 小于这个最小和，后续更大的 ``value`` 只会使情况更差，所以当前层可以直接 ``break``。

若 ``next_remaining`` 大于后续能取得的最大和，只能 ``continue`` 尝试更大的当前值；更大的当前值会减少剩余目标，可能使状态变得可行。

正确性证明
----------

**引理一：每条递归路径中的数字严格递增。**

下一层起点始终为当前值加一，因此后续选择必然更大。

**引理二：算法不会生成重复组合。**

每个组合只有唯一的升序表示。算法只生成升序路径，因此同一集合不可能由不同顺序重复产生。

**引理三：剪枝不会删除可行解。**

* 数量不足时无法选满；
* ``remaining < minimum`` 时，任何合法选择和都至少为 ``minimum``；
* ``remaining > maximum`` 时，任何合法选择和都至多为 ``maximum``。

这些条件都是可行性的必要条件。

**引理四：循环提前停止安全。**

若当前 ``value`` 已使后续剩余和小于最小可达和，更大的 ``value`` 会进一步减小剩余和并提高后续候选下界，不可能恢复可行。

**引理五：每个合法组合都会被枚举。**

设合法组合升序为 ``a1<a2<...<ak``。根状态会枚举 ``a1``；选择后下一起点为 ``a1+1``，会枚举 ``a2``，依次直到 ``ak``。合法组合满足所有可达上下界，不会被剪枝，最终在 ``slots=0`` 且 ``remaining=0`` 时提交。

**定理：算法返回且仅返回全部合法组合。**

引理一和基本情况保证提交结果满足取值、互异、数量和总和要求；引理二保证不重复；引理三、四、五保证无遗漏。

复杂度
------

候选集合固定为 9 个数字。搜索树叶子数最多为：

.. code-block:: text

   C(9, k)

回溯工作量可写为 ``O(C(9,k) * k)``，因为每个结果需要复制长度 ``k`` 的路径。由于 9 是题目常数，在官方约束下总搜索规模很小。

递归深度为 ``k``，路径工作空间为 ``O(k)``。返回结果本身占 ``O(Z*k)``，其中 ``Z`` 是答案数量。

C++ 实现
--------

.. code-block:: cpp

   class Solution {
   private:
       static int minSum(int start, int count) {
           return count * (2 * start + count - 1) / 2;
       }

       static int maxSum(int count) {
           return count * (19 - count) / 2;
       }

       void search(int start, int slots, int remaining,
                   std::vector<int>& path,
                   std::vector<std::vector<int>>& answer) {
           if (slots == 0) {
               if (remaining == 0) answer.push_back(path);
               return;
           }
           if (start > 9 || start + slots - 1 > 9) return;

           int minimum = minSum(start, slots);
           int maximum = maxSum(slots);
           if (remaining < minimum || remaining > maximum) return;

           for (int value = start; value <= 9; ++value) {
               path.push_back(value);
               search(value + 1, slots - 1, remaining - value,
                      path, answer);
               path.pop_back();
           }
       }

   public:
       std::vector<std::vector<int>> combinationSum3(int k, int n) {
           std::vector<std::vector<int>> answer;
           std::vector<int> path;
           search(1, k, n, path, answer);
           return answer;
       }
   };

代码分析
--------

递归状态 ``(start, slots, remaining)`` 表示下一个数字至少从 ``start`` 选择，还要选 ``slots`` 个数，且它们的和必须为 ``remaining``。每次选择 ``value`` 后递归到 ``value+1``，所以路径严格递增，天然保证每个数字只用一次；数字范围被限制在 1 到 9，不需要额外去重。

剪枝不是固定深度的形式检查，而是由剩余可选集合的最小和、最大和推出：若还选 ``slots`` 个数，最小只能是 ``start`` 起的连续 ``slots`` 个，最大只能是 9 向下的 ``slots`` 个。``remaining`` 落在这个区间之外时，无论后续如何选都不可能成功。比如 ``k=3,n=9`` 时，路径 ``[1,2]`` 还需一个 6，继续搜索；路径 ``[1,8]`` 已经不可能再选出大于 8 且不超过 9 的两个空位，会被边界条件直接剪掉。

叶节点只有在 ``slots==0`` 且 ``remaining==0`` 时加入答案，因此每个结果恰好包含 ``k`` 个不同数字且和为 ``n``。候选组合总数至多为 ``C(9,k)``，复制每个答案需要 ``O(k)``，回溯时间复杂度为 ``O(C(9,k) * k)``，递归路径和调用栈额外空间为 ``O(k)``，不计返回结果载荷。

十语言实现
----------

C
~

.. code-block:: c

   #include <stdlib.h>

   typedef struct {
       int **rows;
       int size;
       int capacity;
       int *column_sizes;
       int failed;
   } Result;

   static int min_sum(int start, int slots) {
       return slots * (2 * start + slots - 1) / 2;
   }

   static int max_sum(int slots) {
       return slots * (19 - slots) / 2;
   }

   static void append_result(Result *result, const int *path, int length) {
       if (result->size == result->capacity) {
           int new_capacity = result->capacity == 0 ? 4 : result->capacity * 2;
           int **new_rows = realloc(result->rows, new_capacity * sizeof(int *));
           if (new_rows == NULL) {
               result->failed = 1;
               return;
           }
           result->rows = new_rows;
           int *new_columns = realloc(
               result->column_sizes,
               new_capacity * sizeof(int)
           );
           if (new_columns == NULL) {
               result->failed = 1;
               return;
           }
           result->column_sizes = new_columns;
           result->capacity = new_capacity;
       }

       int *copy = malloc(length * sizeof(int));
       if (copy == NULL) {
           result->failed = 1;
           return;
       }
       for (int i = 0; i < length; ++i) copy[i] = path[i];
       result->rows[result->size] = copy;
       result->column_sizes[result->size] = length;
       ++result->size;
   }

   static void search(
       int start,
       int slots,
       int remaining,
       int *path,
       int depth,
       Result *result
   ) {
       if (result->failed) return;
       if (slots == 0) {
           if (remaining == 0) append_result(result, path, depth);
           return;
       }
       if (10 - start < slots) return;
       if (remaining < min_sum(start, slots)) return;
       if (remaining > max_sum(slots)) return;

       const int max_value = 10 - slots;
       for (int value = start; value <= max_value; ++value) {
           const int next_slots = slots - 1;
           const int next_remaining = remaining - value;
           if (next_slots == 0) {
               if (next_remaining == 0) {
                   path[depth] = value;
                   append_result(result, path, depth + 1);
               }
               continue;
           }

           const int next_min = min_sum(value + 1, next_slots);
           if (next_remaining < next_min) break;
           if (next_remaining > max_sum(next_slots)) continue;

           path[depth] = value;
           search(
               value + 1,
               next_slots,
               next_remaining,
               path,
               depth + 1,
               result
           );
       }
   }

   int **combinationSum3(
       int k,
       int n,
       int *returnSize,
       int **returnColumnSizes
   ) {
       Result result = {NULL, 0, 0, NULL, 0};
       int path[9];

       search(1, k, n, path, 0, &result);

       if (result.failed) {
           for (int i = 0; i < result.size; ++i) free(result.rows[i]);
           free(result.rows);
           free(result.column_sizes);
           *returnSize = 0;
           *returnColumnSizes = NULL;
           return NULL;
       }

       *returnSize = result.size;
       *returnColumnSizes = result.column_sizes;
       return result.rows;
   }

C 实现会增长结果指针数组。若第二次 ``realloc`` 失败，第一次成功后的新指针仍保存在结构中，最终统一释放，不丢失所有权。调用方负责释放每一行、行数组和列长度数组。

C++
~~~

.. code-block:: cpp

   class Solution {
       static int minSum(int start, int slots) {
           return slots * (2 * start + slots - 1) / 2;
       }

       static int maxSum(int slots) {
           return slots * (19 - slots) / 2;
       }

       static void search(
           int start,
           int slots,
           int remaining,
           std::vector<int>& path,
           std::vector<std::vector<int>>& result
       ) {
           if (slots == 0) {
               if (remaining == 0) result.push_back(path);
               return;
           }
           if (10 - start < slots) return;
           if (remaining < minSum(start, slots)) return;
           if (remaining > maxSum(slots)) return;

           const int maxValue = 10 - slots;
           for (int value = start; value <= maxValue; ++value) {
               const int nextSlots = slots - 1;
               const int nextRemaining = remaining - value;
               if (nextSlots > 0) {
                   const int nextMin = minSum(value + 1, nextSlots);
                   if (nextRemaining < nextMin) break;
                   if (nextRemaining > maxSum(nextSlots)) continue;
               } else if (nextRemaining != 0) {
                   continue;
               }

               path.push_back(value);
               search(
                   value + 1,
                   nextSlots,
                   nextRemaining,
                   path,
                   result
               );
               path.pop_back();
           }
       }

   public:
       std::vector<std::vector<int>> combinationSum3(int k, int n) {
           std::vector<std::vector<int>> result;
           std::vector<int> path;
           path.reserve(k);
           search(1, k, n, path, result);
           return result;
       }
   };

需要 ``<vector>``。

Python
~~~~~~

.. code-block:: python

   class Solution:
       def combinationSum3(self, k: int, n: int) -> list[list[int]]:
           result: list[list[int]] = []
           path: list[int] = []

           def min_sum(start: int, slots: int) -> int:
               return slots * (2 * start + slots - 1) // 2

           def max_sum(slots: int) -> int:
               return slots * (19 - slots) // 2

           def search(start: int, slots: int, remaining: int) -> None:
               if slots == 0:
                   if remaining == 0:
                       result.append(path.copy())
                   return
               if 10 - start < slots:
                   return
               if remaining < min_sum(start, slots):
                   return
               if remaining > max_sum(slots):
                   return

               max_value = 10 - slots
               for value in range(start, max_value + 1):
                   next_slots = slots - 1
                   next_remaining = remaining - value
                   if next_slots > 0:
                       if next_remaining < min_sum(value + 1, next_slots):
                           break
                       if next_remaining > max_sum(next_slots):
                           continue
                   elif next_remaining != 0:
                       continue

                   path.append(value)
                   search(value + 1, next_slots, next_remaining)
                   path.pop()

           search(1, k, n)
           return result

Java
~~~~

.. code-block:: java

   class Solution {
       public List<List<Integer>> combinationSum3(int k, int n) {
           List<List<Integer>> result = new ArrayList<>();
           search(1, k, n, new ArrayList<>(), result);
           return result;
       }

       private void search(
           int start,
           int slots,
           int remaining,
           List<Integer> path,
           List<List<Integer>> result
       ) {
           if (slots == 0) {
               if (remaining == 0) result.add(new ArrayList<>(path));
               return;
           }
           if (10 - start < slots) return;
           if (remaining < minSum(start, slots)) return;
           if (remaining > maxSum(slots)) return;

           int maxValue = 10 - slots;
           for (int value = start; value <= maxValue; ++value) {
               int nextSlots = slots - 1;
               int nextRemaining = remaining - value;
               if (nextSlots > 0) {
                   if (nextRemaining < minSum(value + 1, nextSlots)) break;
                   if (nextRemaining > maxSum(nextSlots)) continue;
               } else if (nextRemaining != 0) {
                   continue;
               }

               path.add(value);
               search(value + 1, nextSlots, nextRemaining, path, result);
               path.remove(path.size() - 1);
           }
       }

       private int minSum(int start, int slots) {
           return slots * (2 * start + slots - 1) / 2;
       }

       private int maxSum(int slots) {
           return slots * (19 - slots) / 2;
       }
   }

需要 ``java.util.ArrayList`` 与 ``java.util.List``。

Rust
~~~~

.. code-block:: rust

   impl Solution {
       pub fn combination_sum3(k: i32, n: i32) -> Vec<Vec<i32>> {
           fn min_sum(start: i32, slots: i32) -> i32 {
               slots * (2 * start + slots - 1) / 2
           }

           fn max_sum(slots: i32) -> i32 {
               slots * (19 - slots) / 2
           }

           fn search(
               start: i32,
               slots: i32,
               remaining: i32,
               path: &mut Vec<i32>,
               result: &mut Vec<Vec<i32>>,
           ) {
               if slots == 0 {
                   if remaining == 0 { result.push(path.clone()); }
                   return;
               }
               if 10 - start < slots { return; }
               if remaining < min_sum(start, slots) { return; }
               if remaining > max_sum(slots) { return; }

               let max_value = 10 - slots;
               for value in start..=max_value {
                   let next_slots = slots - 1;
                   let next_remaining = remaining - value;
                   if next_slots > 0 {
                       if next_remaining < min_sum(value + 1, next_slots) { break; }
                       if next_remaining > max_sum(next_slots) { continue; }
                   } else if next_remaining != 0 {
                       continue;
                   }

                   path.push(value);
                   search(
                       value + 1,
                       next_slots,
                       next_remaining,
                       path,
                       result,
                   );
                   path.pop();
               }
           }

           let mut result = Vec::new();
           let mut path = Vec::with_capacity(k as usize);
           search(1, k, n, &mut path, &mut result);
           result
       }
   }

Go
~~

.. code-block:: go

   func combinationSum3(k int, n int) [][]int {
       minSum := func(start int, slots int) int {
           return slots * (2*start + slots - 1) / 2
       }
       maxSum := func(slots int) int {
           return slots * (19 - slots) / 2
       }

       result := make([][]int, 0)
       path := make([]int, 0, k)

       var search func(int, int, int)
       search = func(start int, slots int, remaining int) {
           if slots == 0 {
               if remaining == 0 {
                   copyPath := append([]int(nil), path...)
                   result = append(result, copyPath)
               }
               return
           }
           if 10-start < slots || remaining < minSum(start, slots) ||
               remaining > maxSum(slots) {
               return
           }

           maxValue := 10 - slots
           for value := start; value <= maxValue; value++ {
               nextSlots := slots - 1
               nextRemaining := remaining - value
               if nextSlots > 0 {
                   if nextRemaining < minSum(value+1, nextSlots) { break }
                   if nextRemaining > maxSum(nextSlots) { continue }
               } else if nextRemaining != 0 {
                   continue
               }

               path = append(path, value)
               search(value+1, nextSlots, nextRemaining)
               path = path[:len(path)-1]
           }
       }

       search(1, k, n)
       return result
   }

TypeScript
~~~~~~~~~~

.. code-block:: typescript

   function combinationSum3(k: number, n: number): number[][] {
       const result: number[][] = [];
       const path: number[] = [];

       const minSum = (start: number, slots: number): number =>
           slots * (2 * start + slots - 1) / 2;
       const maxSum = (slots: number): number =>
           slots * (19 - slots) / 2;

       const search = (start: number, slots: number, remaining: number): void => {
           if (slots === 0) {
               if (remaining === 0) result.push([...path]);
               return;
           }
           if (10 - start < slots) return;
           if (remaining < minSum(start, slots)) return;
           if (remaining > maxSum(slots)) return;

           const maxValue = 10 - slots;
           for (let value = start; value <= maxValue; value += 1) {
               const nextSlots = slots - 1;
               const nextRemaining = remaining - value;
               if (nextSlots > 0) {
                   if (nextRemaining < minSum(value + 1, nextSlots)) break;
                   if (nextRemaining > maxSum(nextSlots)) continue;
               } else if (nextRemaining !== 0) {
                   continue;
               }

               path.push(value);
               search(value + 1, nextSlots, nextRemaining);
               path.pop();
           }
       };

       search(1, k, n);
       return result;
   }

C#
~~

.. code-block:: csharp

   public class Solution {
       public IList<IList<int>> CombinationSum3(int k, int n) {
           var result = new List<IList<int>>();
           var path = new List<int>(k);
           Search(1, k, n, path, result);
           return result;
       }

       private static void Search(
           int start,
           int slots,
           int remaining,
           List<int> path,
           List<IList<int>> result
       ) {
           if (slots == 0) {
               if (remaining == 0) result.Add(new List<int>(path));
               return;
           }
           if (10 - start < slots || remaining < MinSum(start, slots) ||
               remaining > MaxSum(slots)) return;

           int maxValue = 10 - slots;
           for (int value = start; value <= maxValue; ++value) {
               int nextSlots = slots - 1;
               int nextRemaining = remaining - value;
               if (nextSlots > 0) {
                   if (nextRemaining < MinSum(value + 1, nextSlots)) break;
                   if (nextRemaining > MaxSum(nextSlots)) continue;
               } else if (nextRemaining != 0) {
                   continue;
               }

               path.Add(value);
               Search(value + 1, nextSlots, nextRemaining, path, result);
               path.RemoveAt(path.Count - 1);
           }
       }

       private static int MinSum(int start, int slots) =>
           slots * (2 * start + slots - 1) / 2;

       private static int MaxSum(int slots) =>
           slots * (19 - slots) / 2;
   }

需要 ``System.Collections.Generic``。

Julia
~~~~~

.. code-block:: julia

   function combination_sum3(k::Int, n::Int)::Vector{Vector{Int}}
       min_sum(start, slots) = slots * (2 * start + slots - 1) ÷ 2
       max_sum(slots) = slots * (19 - slots) ÷ 2

       result = Vector{Vector{Int}}()
       path = Int[]

       function search(start::Int, slots::Int, remaining::Int)
           if slots == 0
               remaining == 0 && push!(result, copy(path))
               return
           end
           10 - start < slots && return
           remaining < min_sum(start, slots) && return
           remaining > max_sum(slots) && return

           max_value = 10 - slots
           for value in start:max_value
               next_slots = slots - 1
               next_remaining = remaining - value
               if next_slots > 0
                   next_remaining < min_sum(value + 1, next_slots) && break
                   next_remaining > max_sum(next_slots) && continue
               elseif next_remaining != 0
                   continue
               end

               push!(path, value)
               search(value + 1, next_slots, next_remaining)
               pop!(path)
           end
       end

       search(1, k, n)
       result
   end

R
~

.. code-block:: r

   combination_sum3 <- function(k, n) {
     min_sum <- function(start, slots) {
       slots * (2 * start + slots - 1) / 2
     }
     max_sum <- function(slots) {
       slots * (19 - slots) / 2
     }

     result <- list()
     path <- integer(0)

     search <- function(start, slots, remaining) {
       if (slots == 0L) {
         if (remaining == 0L) result[[length(result) + 1L]] <<- path
         return(invisible(NULL))
       }
       if (10L - start < slots) return(invisible(NULL))
       if (remaining < min_sum(start, slots)) return(invisible(NULL))
       if (remaining > max_sum(slots)) return(invisible(NULL))

       max_value <- 10L - slots
       for (value in seq.int(start, max_value)) {
         next_slots <- slots - 1L
         next_remaining <- remaining - value
         if (next_slots > 0L) {
           if (next_remaining < min_sum(value + 1L, next_slots)) break
           if (next_remaining > max_sum(next_slots)) next
         } else if (next_remaining != 0L) {
           next
         }

         path <<- c(path, value)
         search(value + 1L, next_slots, next_remaining)
         path <<- path[-length(path)]
       }
       invisible(NULL)
     }

     search(1L, as.integer(k), as.integer(n))
     result
   }

关键易错点
----------

* 允许重复使用同一个数字；
* 生成不同排列并在最后去重；
* 只检查总和，不检查数量恰好为 ``k``；
* ``remaining==0`` 时提前提交未选满路径；
* 最大可达和错误地从 ``start`` 计算，遗漏始终可以选择更大的数字；
* 当后续剩余和过大时错误地 ``break``；
* 提交路径时没有复制可变容器；
* 忘记回溯撤销最后一个数字。

知识联系
--------

这道题的候选域固定且很小，重点不是渐近复杂度，而是如何定义可验证状态并做安全剪枝。

更一般的组合问题中，常见剪枝模板是：

* 剩余槽位数量；
* 剩余候选数量；
* 剩余目标与最小、最大可达值；
* 候选单调性带来的 ``break`` 与 ``continue`` 区别。

自检问题
--------

#. 为什么路径必须严格递增？
#. ``remaining < minimum`` 和 ``remaining > maximum`` 分别说明什么？
#. 为什么剩余和过小时可以 ``break``，过大时通常只能 ``continue``？
#. 为什么 ``remaining==0`` 仍不一定可以提交？
#. 输出复杂度为什么要乘以 ``k``？

参考答案
~~~~~~~~

#. 它同时保证数字不重复，并让每个组合只有一种生成顺序。
#. 前者说明最小合法选择都太大，后者说明最大合法选择仍不够。
#. 更大的当前值会让剩余和更小且后续下界更高；但当前剩余和过大时，更大的当前值可能使它降到可行范围。
#. 还必须确认已经选满恰好 ``k`` 个数字。
#. 每个结果都需要复制或构造长度为 ``k`` 的序列。
