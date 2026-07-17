0216. Combination Sum III
=========================

题目信息
--------

:题号: 0216
:难度: Medium
:主题: 回溯、组合枚举、状态恢复、上下界剪枝
:原题: `LeetCode 0216 <https://leetcode.com/problems/combination-sum-iii/>`_
:访问状态: Available
:教学重点: 严格递增选择、唯一生成路径、剩余槽位与剩余和、可达和剪枝、二维结果所有权

精确契约
--------

从整数 ``1`` 到 ``9`` 中选择恰好 ``k`` 个互不相同的数字，使它们的和等于 ``n``，返回全部合法组合。

本文采用以下合同：

* 每个数字只能来自闭区间 ``[1,9]``；
* 每个数字最多使用一次；
* 每个结果必须恰好包含 ``k`` 个数字；
* 组合内数字按严格递增顺序保存；
* 组合之间不因排列顺序重复；
* 返回顺序不影响正确性；
* 输入 ``k`` 与 ``n`` 不被修改；
* 不存在合法组合时返回空结果。

严格递增不仅是输出格式，也是搜索状态的一部分。选择 ``value`` 后，下一层只能从 ``value+1`` 开始，
所以同一数字不会重复使用，同一集合也不会以不同排列再次出现。

自建示例
--------

单一答案
~~~~~~~~

.. code-block:: text

   k = 3, n = 7
   answer = [[1,2,4]]

``1+2+4=7``。``[1,4,2]`` 与它表示同一组合，不应再次生成。

多个答案
~~~~~~~~

.. code-block:: text

   k = 3, n = 9
   answer = [
       [1,2,6],
       [1,3,5],
       [2,3,4]
   ]

每个组合都包含三个互不相同的数字，且内部严格递增。

剩余和过小
~~~~~~~~~~

.. code-block:: text

   k = 4, n = 1
   answer = []

即使选择最小的四个数字 ``1+2+3+4=10``，也已经超过目标。

使用全部数字
~~~~~~~~~~~~

.. code-block:: text

   k = 9, n = 45
   answer = [[1,2,3,4,5,6,7,8,9]]

这是唯一能够选择九个不同数字的组合。

剩余和过大
~~~~~~~~~~

.. code-block:: text

   k = 2, n = 18
   answer = []

最大的两个不同数字之和为 ``8+9=17``，无法达到 18。

问题抽象
--------

搜索过程逐步构造一个严格递增序列。每个递归状态需要回答：

#. 下一个数字最小可以是多少；
#. 还需要选择多少个数字；
#. 还需要凑出多少和；
#. 当前已经选择了哪些数字。

定义状态：

``start``
   下一层允许选择的最小数字。

``slots``
   仍需填充的数字个数。

``remaining``
   仍需凑出的目标和。

``path``
   当前已选择的严格递增前缀。

初始状态为：

.. code-block:: text

   start = 1
   slots = k
   remaining = n
   path = []

选择数字 ``value`` 后转移为：

.. code-block:: text

   start = value + 1
   slots = slots - 1
   remaining = remaining - value
   path = path + [value]

搜索不变量
----------

每次进入递归函数时维护：

#. ``path`` 中所有数字都在 ``1..9``；
#. ``path`` 严格递增，因此不存在重复数字；
#. ``start`` 大于 ``path`` 的最后一个数字；空路径时 ``start=1``；
#. ``len(path)+slots=k``；
#. ``sum(path)+remaining=n``；
#. 尚未选择的数字只能来自 ``start..9``。

初始化时路径为空，前四项显然成立。选择 ``value>=start`` 后，下一层从 ``value+1`` 开始，
严格递增性与不重复性继续成立；槽位和剩余和同步减少，数量与总和守恒。

终止条件
--------

当 ``slots=0`` 时，已经选择了恰好 ``k`` 个数字：

* 若 ``remaining=0``，当前路径满足数量和总和要求，提交它的快照；
* 若 ``remaining!=0``，数量已经用尽，不能再修正总和，不提交。

不能在 ``remaining=0`` 时无条件提交，因为路径可能尚不足 ``k`` 个数字。
也不能在路径长度达到 ``k`` 时无条件提交，因为总和可能不等于 ``n``。

最小可达和剪枝
--------------

状态 ``(start, slots, remaining)`` 至少需要选择 ``slots`` 个递增数字。能够取得的最小和来自：

.. code-block:: text

   start, start+1, ..., start+slots-1

若 ``start+slots-1>9``，剩余候选数量不足，状态无解。

否则最小可达和为等差数列：

.. code-block:: text

   minimum =
       slots * (2*start + slots - 1) / 2

若 ``remaining < minimum``，任何合法后续选择的和都至少为 ``minimum``，当前剩余和过小，可以安全剪枝。

最大可达和剪枝
--------------

只要剩余候选数量足够，能够取得的最大和来自 ``1..9`` 中最大的 ``slots`` 个数字：

.. code-block:: text

   10-slots, 11-slots, ..., 9

其和为：

.. code-block:: text

   maximum =
       slots * (19 - slots) / 2

在当前状态已经确认 ``start+slots-1<=9``。因此这些最大的 ``slots`` 个数字都位于允许区间 ``start..9``：
由 ``start<=10-slots`` 可知最小的那个 ``10-slots`` 不小于 ``start``。

若 ``remaining > maximum``，任何后续组合都无法达到剩余和，可以安全剪枝。

候选上界
--------

当前还要选择 ``slots`` 个数字。若本层选择 ``value``，后面还要保留 ``slots-1`` 个更大的数字。
因此本层最大候选为：

.. code-block:: text

   10 - slots

例如还需选择 3 个数字时，本层最多选择 7，才能为后续保留 8 和 9。
循环只枚举：

.. code-block:: text

   value = start .. 10-slots

这不是额外的启发式剪枝，而是候选数量约束的直接结果。

状态恢复与结果快照
------------------

数组或列表实现通常执行：

.. code-block:: text

   path.push(value)
   dfs(...)
   path.pop()

递归调用返回后必须移除本层加入的数字，使兄弟分支看到进入本层前的相同路径。
这称为状态恢复。

发现答案时必须保存 ``path`` 的独立快照，而不能只保存同一个可变容器的引用。
否则后续 ``pop`` 或新的 ``push`` 会同时改变已经记录的答案。

正确性证明
----------

引理一：搜索产生的每条路径都满足数字范围、不重复与严格递增
~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

初始路径为空。每层只从 ``start..9`` 选择数字；选择 ``value`` 后把下一起点设为 ``value+1``。
因此后续数字严格大于此前所有数字。归纳可得，路径中所有数字位于 ``1..9``，且严格递增、互不相同。

引理二：提交的每个结果都满足题目合同
~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

算法只在 ``slots=0`` 且 ``remaining=0`` 时提交。由不变量，
此时 ``len(path)=k`` 且 ``sum(path)=n``。再结合引理一，提交结果使用 ``1..9`` 中恰好 ``k`` 个不同数字，
内部严格递增，所以每个输出都是合法组合。

引理三：每个合法组合都存在一条搜索路径
~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

任取合法组合 ``C={c1<c2<...<ck}``。初始起点为 1，第一层循环包含 ``c1``。
选择 ``c1`` 后起点变为 ``c1+1``，第二层循环包含 ``c2``；依此类推，第 ``i`` 层包含 ``ci``。
沿这条选择序列到达 ``slots=0`` 时，所选数字之和为 ``n``，因此算法提交该组合。

下面还需说明剪枝不会截断这条路径。若某状态仍能由合法组合补全，则剩余数字：

* 至少达到从 ``start`` 开始的最小可达和；
* 至多达到最大的 ``slots`` 个允许数字之和；
* 数量上保证 ``start+slots-1<=9``。

因此合法路径不会触发任何不可达剪枝。

引理四：每个合法组合只生成一次
~~~~~~~~~~~~~~~~~~~~~~~~~~~~

搜索路径中的数字必须严格递增。一个无序集合只有一种严格递增排列。
因此合法组合 ``{c1,...,ck}`` 只能沿 ``c1,c2,...,ck`` 这一条路径生成，
不会以其他排列重复出现，也不需要结果集合事后去重。

引理五：最小可达和剪枝安全
~~~~~~~~~~~~~~~~~~~~~~~~~~

在状态 ``(start,slots)`` 中，任意 ``slots`` 个严格递增候选的第 ``i`` 个数字至少为 ``start+i``，
所以总和至少为公式中的 ``minimum``。当 ``remaining<minimum`` 时，没有后续选择能恰好得到 ``remaining``，
剪枝只删除无解状态。

引理六：最大可达和剪枝安全
~~~~~~~~~~~~~~~~~~~~~~~~~~

允许区间内任意 ``slots`` 个不同数字的和，不会超过其中最大的 ``slots`` 个数字之和 ``maximum``。
当 ``remaining>maximum`` 时，没有后续选择能达到该值，剪枝只删除无解状态。

引理七：候选上界不会遗漏合法组合
~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

若本层 ``value>10-slots``，则 ``value`` 之后的整数数量小于 ``slots-1``，
无法填满剩余槽位。任何完整合法组合在当前层的数字都必须满足 ``value<=10-slots``，
所以限制循环上界不会遗漏答案。

定理：算法恰好返回全部合法组合且无重复
~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

引理二保证输出可靠；引理三和剪枝安全性保证所有合法组合都会被找到；
引理四保证每个组合只出现一次。因此算法返回的集合与题目要求完全一致。

终止性
~~~~~~

递归调用每次把 ``slots`` 减少 1，并把 ``start`` 增加到已选数字之后。
``slots`` 最多为 ``k``，候选只来自有限集合 ``1..9``，所以递归深度和分支数都有限，算法必然终止。

复杂度与真实资源
----------------

设候选宇宙大小为 ``U``，本题固定 ``U=9``，输出组合数为 ``A``。

* 搜索树在深度 ``d`` 至多有 ``C(U,d)`` 个严格递增状态；
* 未考虑剪枝时，访问状态数上界为 ``sum(C(U,d), d=0..k)``；
* 每次提交答案需要复制 ``k`` 个数字，因此输出构造至少需要 ``O(A*k)`` 时间；
* 递归栈和当前路径占 ``O(k)``；
* 返回结果载荷占 ``O(A*k)``；
* 可达和剪枝降低实际访问状态数，不改变最坏组合枚举性质。

由于官方候选范围固定为九个数字，搜索规模有常数上界；仍应分别报告当前路径、递归栈和输出载荷，
不能简单写成“空间 ``O(1)``”。

不同语言的结果容器成本：

* C 显式管理行指针数组、列长度数组、每行组合和容量增长；
* C++、Python、Java、Rust、Go、TypeScript、C#、Julia 在提交时复制当前路径；
* R 每次 ``c(path,value)`` 产生新的路径向量，结果环境按索引保存快照；
* 托管语言由垃圾回收器管理容器生命周期，C 的成功结果由调用方释放。

十语言实现
----------

C
~

.. code-block:: c

   #include <stdlib.h>
   #include <string.h>

   typedef struct {
       int **rows;
       int *columns;
       int size;
       int capacity;
       int failed;
   } ResultBuffer;

   static int minimum_sum(int start, int slots) {
       return slots * (2 * start + slots - 1) / 2;
   }

   static int maximum_sum(int slots) {
       return slots * (19 - slots) / 2;
   }

   static void free_rows(ResultBuffer *buffer) {
       for (int i = 0; i < buffer->size; ++i) {
           free(buffer->rows[i]);
       }
       free(buffer->rows);
       free(buffer->columns);
       buffer->rows = NULL;
       buffer->columns = NULL;
       buffer->size = 0;
       buffer->capacity = 0;
   }

   static int grow_buffer(ResultBuffer *buffer) {
       const int new_capacity = buffer->capacity == 0 ? 4 : buffer->capacity * 2;
       int **new_rows = (int **)malloc((size_t)new_capacity * sizeof(int *));
       int *new_columns = (int *)malloc((size_t)new_capacity * sizeof(int));

       if (new_rows == NULL || new_columns == NULL) {
           free(new_rows);
           free(new_columns);
           return 0;
       }

       if (buffer->size > 0) {
           memcpy(
               new_rows,
               buffer->rows,
               (size_t)buffer->size * sizeof(int *)
           );
           memcpy(
               new_columns,
               buffer->columns,
               (size_t)buffer->size * sizeof(int)
           );
       }

       free(buffer->rows);
       free(buffer->columns);
       buffer->rows = new_rows;
       buffer->columns = new_columns;
       buffer->capacity = new_capacity;
       return 1;
   }

   static int append_path(
       ResultBuffer *buffer,
       const int *path,
       int path_length
   ) {
       if (buffer->size == buffer->capacity && !grow_buffer(buffer)) {
           return 0;
       }

       int *row = (int *)malloc((size_t)path_length * sizeof(int));
       if (row == NULL) return 0;

       memcpy(row, path, (size_t)path_length * sizeof(int));
       buffer->rows[buffer->size] = row;
       buffer->columns[buffer->size] = path_length;
       ++buffer->size;
       return 1;
   }

   static void search(
       int start,
       int slots,
       int remaining,
       int *path,
       int depth,
       ResultBuffer *buffer
   ) {
       if (buffer->failed) return;

       if (slots == 0) {
           if (remaining == 0 && !append_path(buffer, path, depth)) {
               buffer->failed = 1;
           }
           return;
       }

       if (remaining <= 0 || start + slots - 1 > 9) return;
       if (remaining < minimum_sum(start, slots)) return;
       if (remaining > maximum_sum(slots)) return;

       const int upper = 10 - slots;
       for (int value = start; value <= upper; ++value) {
           if (value > remaining) break;
           path[depth] = value;
           search(
               value + 1,
               slots - 1,
               remaining - value,
               path,
               depth + 1,
               buffer
           );
           if (buffer->failed) return;
       }
   }

   int **combinationSum3(
       int k,
       int n,
       int *returnSize,
       int **returnColumnSizes
   ) {
       ResultBuffer buffer = {NULL, NULL, 0, 0, 0};
       int path[9];

       if (returnSize == NULL || returnColumnSizes == NULL) return NULL;
       *returnSize = 0;
       *returnColumnSizes = NULL;

       search(1, k, n, path, 0, &buffer);

       if (buffer.failed) {
           free_rows(&buffer);
           return NULL;
       }

       *returnSize = buffer.size;
       *returnColumnSizes = buffer.columns;
       return buffer.rows;
   }

C 的容量增长先分别分配新指针数组和新列长度数组，两者都成功后才替换旧数组，避免两次 ``realloc``
只成功一次造成所有权不一致。任一行分配失败时释放已经完成的所有行并返回 ``NULL``。
成功时调用方拥有返回的每一行、行指针数组和 ``returnColumnSizes``。

C++
~~~

.. code-block:: cpp

   class Solution {
       static int minimumSum(int start, int slots) {
           return slots * (2 * start + slots - 1) / 2;
       }

       static int maximumSum(int slots) {
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

           if (remaining <= 0 || start + slots - 1 > 9) return;
           if (remaining < minimumSum(start, slots)) return;
           if (remaining > maximumSum(slots)) return;

           const int upper = 10 - slots;
           for (int value = start; value <= upper; ++value) {
               if (value > remaining) break;
               path.push_back(value);
               search(
                   value + 1,
                   slots - 1,
                   remaining - value,
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

``result.push_back(path)`` 复制当前路径；``pop_back`` 只恢复搜索路径，不会改变已经保存的行。

Python
~~~~~~

.. code-block:: python

   class Solution:
       def combinationSum3(self, k: int, n: int) -> list[list[int]]:
           result: list[list[int]] = []
           path: list[int] = []

           def minimum_sum(start: int, slots: int) -> int:
               return slots * (2 * start + slots - 1) // 2

           def maximum_sum(slots: int) -> int:
               return slots * (19 - slots) // 2

           def search(start: int, slots: int, remaining: int) -> None:
               if slots == 0:
                   if remaining == 0:
                       result.append(path.copy())
                   return

               if remaining <= 0 or start + slots - 1 > 9:
                   return
               if remaining < minimum_sum(start, slots):
                   return
               if remaining > maximum_sum(slots):
                   return

               upper = 10 - slots
               for value in range(start, upper + 1):
                   if value > remaining:
                       break
                   path.append(value)
                   search(value + 1, slots - 1, remaining - value)
                   path.pop()

           search(1, k, n)
           return result

``path.copy()`` 创建结果快照。Python 整数按需扩展，本题数值范围很小。

Java
~~~~

.. code-block:: java

   class Solution {
       private int minimumSum(int start, int slots) {
           return slots * (2 * start + slots - 1) / 2;
       }

       private int maximumSum(int slots) {
           return slots * (19 - slots) / 2;
       }

       private void search(
           int start,
           int slots,
           int remaining,
           java.util.List<Integer> path,
           java.util.List<java.util.List<Integer>> result
       ) {
           if (slots == 0) {
               if (remaining == 0) {
                   result.add(new java.util.ArrayList<>(path));
               }
               return;
           }

           if (remaining <= 0 || start + slots - 1 > 9) return;
           if (remaining < minimumSum(start, slots)) return;
           if (remaining > maximumSum(slots)) return;

           int upper = 10 - slots;
           for (int value = start; value <= upper; ++value) {
               if (value > remaining) break;
               path.add(value);
               search(value + 1, slots - 1, remaining - value, path, result);
               path.remove(path.size() - 1);
           }
       }

       public java.util.List<java.util.List<Integer>> combinationSum3(
           int k,
           int n
       ) {
           java.util.List<java.util.List<Integer>> result =
               new java.util.ArrayList<>();
           java.util.List<Integer> path = new java.util.ArrayList<>(k);
           search(1, k, n, path, result);
           return result;
       }
   }

``new ArrayList<>(path)`` 保存独立结果行；删除末尾元素完成状态恢复。

Rust
~~~~

.. code-block:: rust

   impl Solution {
       fn minimum_sum(start: i32, slots: i32) -> i32 {
           slots * (2 * start + slots - 1) / 2
       }

       fn maximum_sum(slots: i32) -> i32 {
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
               if remaining == 0 {
                   result.push(path.clone());
               }
               return;
           }

           if remaining <= 0 || start + slots - 1 > 9 {
               return;
           }
           if remaining < Self::minimum_sum(start, slots) {
               return;
           }
           if remaining > Self::maximum_sum(slots) {
               return;
           }

           let upper = 10 - slots;
           for value in start..=upper {
               if value > remaining {
                   break;
               }
               path.push(value);
               Self::search(
                   value + 1,
                   slots - 1,
                   remaining - value,
                   path,
                   result,
               );
               path.pop();
           }
       }

       pub fn combination_sum3(k: i32, n: i32) -> Vec<Vec<i32>> {
           let mut result = Vec::new();
           let mut path = Vec::with_capacity(k as usize);
           Self::search(1, k, n, &mut path, &mut result);
           result
       }
   }

可变借用在递归调用返回后结束，随后 ``pop`` 恢复路径；``clone`` 复制答案行。

Go
~~

.. code-block:: go

   func combinationSum3(k int, n int) [][]int {
       result := make([][]int, 0)
       path := make([]int, 0, k)

       minimumSum := func(start int, slots int) int {
           return slots * (2*start + slots - 1) / 2
       }
       maximumSum := func(slots int) int {
           return slots * (19 - slots) / 2
       }

       var search func(start int, slots int, remaining int)
       search = func(start int, slots int, remaining int) {
           if slots == 0 {
               if remaining == 0 {
                   snapshot := append([]int(nil), path...)
                   result = append(result, snapshot)
               }
               return
           }

           if remaining <= 0 || start+slots-1 > 9 {
               return
           }
           if remaining < minimumSum(start, slots) {
               return
           }
           if remaining > maximumSum(slots) {
               return
           }

           upper := 10 - slots
           for value := start; value <= upper; value++ {
               if value > remaining {
                   break
               }
               path = append(path, value)
               search(value+1, slots-1, remaining-value)
               path = path[:len(path)-1]
           }
       }

       search(1, k, n)
       return result
   }

``append([]int(nil), path...)`` 强制复制当前切片内容；仅保存 ``path`` 切片头会共享底层数组并被后续搜索覆盖。

TypeScript
~~~~~~~~~~

.. code-block:: typescript

   function combinationSum3(k: number, n: number): number[][] {
       const result: number[][] = [];
       const path: number[] = [];

       const minimumSum = (start: number, slots: number): number =>
           (slots * (2 * start + slots - 1)) / 2;
       const maximumSum = (slots: number): number =>
           (slots * (19 - slots)) / 2;

       const search = (
           start: number,
           slots: number,
           remaining: number,
       ): void => {
           if (slots === 0) {
               if (remaining === 0) result.push([...path]);
               return;
           }

           if (remaining <= 0 || start + slots - 1 > 9) return;
           if (remaining < minimumSum(start, slots)) return;
           if (remaining > maximumSum(slots)) return;

           const upper = 10 - slots;
           for (let value = start; value <= upper; value += 1) {
               if (value > remaining) break;
               path.push(value);
               search(value + 1, slots - 1, remaining - value);
               path.pop();
           }
       };

       search(1, k, n);
       return result;
   }

展开语法 ``[...path]`` 生成独立数组。所有运算都在安全整数范围内。

C#
~~

.. code-block:: csharp

   public class Solution {
       private static int MinimumSum(int start, int slots) {
           return slots * (2 * start + slots - 1) / 2;
       }

       private static int MaximumSum(int slots) {
           return slots * (19 - slots) / 2;
       }

       private static void Search(
           int start,
           int slots,
           int remaining,
           System.Collections.Generic.List<int> path,
           System.Collections.Generic.List<
               System.Collections.Generic.IList<int>
           > result
       ) {
           if (slots == 0) {
               if (remaining == 0) {
                   result.Add(
                       new System.Collections.Generic.List<int>(path)
                   );
               }
               return;
           }

           if (remaining <= 0 || start + slots - 1 > 9) return;
           if (remaining < MinimumSum(start, slots)) return;
           if (remaining > MaximumSum(slots)) return;

           int upper = 10 - slots;
           for (int value = start; value <= upper; ++value) {
               if (value > remaining) break;
               path.Add(value);
               Search(
                   value + 1,
                   slots - 1,
                   remaining - value,
                   path,
                   result
               );
               path.RemoveAt(path.Count - 1);
           }
       }

       public System.Collections.Generic.IList<
           System.Collections.Generic.IList<int>
       > CombinationSum3(int k, int n) {
           var result = new System.Collections.Generic.List<
               System.Collections.Generic.IList<int>
           >();
           var path = new System.Collections.Generic.List<int>(k);
           Search(1, k, n, path, result);
           return result;
       }
   }

每次提交都构造新的 ``List<int>``；托管容器由运行时回收。

Julia
~~~~~

.. code-block:: julia

   function combination_sum3(k::Int, n::Int)::Vector{Vector{Int}}
       result = Vector{Vector{Int}}()
       path = Int[]

       minimum_sum(start::Int, slots::Int) =
           slots * (2 * start + slots - 1) ÷ 2
       maximum_sum(slots::Int) =
           slots * (19 - slots) ÷ 2

       function search(start::Int, slots::Int, remaining::Int)
           if slots == 0
               remaining == 0 && push!(result, copy(path))
               return
           end

           if remaining <= 0 || start + slots - 1 > 9
               return
           end
           remaining < minimum_sum(start, slots) && return
           remaining > maximum_sum(slots) && return

           upper = 10 - slots
           for value in start:upper
               value > remaining && break
               push!(path, value)
               search(value + 1, slots - 1, remaining - value)
               pop!(path)
           end
       end

       search(1, k, n)
       return result
   end

可行性检查保证 ``start<=upper`` 后才构造 ``start:upper``；``copy(path)`` 保存结果快照。
Julia 数组按共享引用传递，``push!`` 与 ``pop!`` 对当前路径原地生效。

R
~

.. code-block:: r

   combination_sum3 <- function(k, n) {
     collector <- new.env(parent = emptyenv())
     collector$rows <- list()

     minimum_sum <- function(start, slots) {
       slots * (2L * start + slots - 1L) %/% 2L
     }
     maximum_sum <- function(slots) {
       slots * (19L - slots) %/% 2L
     }

     search <- function(start, slots, remaining, path) {
       if (slots == 0L) {
         if (remaining == 0L) {
           collector$rows[[length(collector$rows) + 1L]] <- path
         }
         return(invisible(NULL))
       }

       if (remaining <= 0L || start + slots - 1L > 9L) {
         return(invisible(NULL))
       }
       if (remaining < minimum_sum(start, slots)) {
         return(invisible(NULL))
       }
       if (remaining > maximum_sum(slots)) {
         return(invisible(NULL))
       }

       upper <- 10L - slots
       for (value in seq.int(start, upper)) {
         if (value > remaining) break
         search(
           value + 1L,
           slots - 1L,
           remaining - value,
           c(path, value)
         )
       }
       invisible(NULL)
     }

     search(1L, as.integer(k), as.integer(n), integer())
     collector$rows
   }

R 的每层路径通过参数显式传递，``c(path,value)`` 创建新的向量，不依赖递归调用共享父调用帧中的局部赋值。
结果使用环境作为共享收集器。可行性检查保证 ``seq.int(start,upper)`` 的方向合法。
反复扩展列表和路径会产生额外复制，实际累计分配可高于抽象搜索树的节点计数。

人工静态推演
------------

``k=3,n=7``
   初始最小和为 6、最大和为 24。选择 1 后搜索两个数和 6；选择 2 后只需一个数和 4，
   提交 ``[1,2,4]``。其他分支因可达和或槽位限制退出。

``k=3,n=9``
   依次生成 ``[1,2,6]``、``[1,3,5]``、``[2,3,4]``。严格递增路径阻止任何排列重复。

``k=4,n=1``
   初始最小可达和为 ``1+2+3+4=10``，立即剪枝。

``k=9,n=45``
   初始最小和与最大和都为 45，只能沿 ``1,2,...,9`` 前进并提交唯一答案。

``k=2,n=18``
   初始最大可达和为 17，立即剪枝。

静态审查记录
------------

本题未运行、未编译、未对拍、未穷举，也未执行 sanitizer。已人工核对：

* ``len(path)+slots=k`` 与 ``sum(path)+remaining=n`` 两个守恒关系；
* 严格递增起点同时保证不重复使用和组合唯一性；
* ``slots=0`` 时同时检查 ``remaining=0``；
* 最小可达和公式、最大可达和公式及候选上界 ``10-slots``；
* 所有递归返回后的路径恢复或不可变路径传递；
* 十语言结果快照语义；
* C 容量增长、行分配失败、完整清理和成功所有权；
* Julia/R 一基循环范围与 R 递归状态传递；
* 输出载荷与搜索辅助空间分开报告。

剩余风险是十语言代码没有经过目标平台编译或执行；接口名称、容器类型和 C 调用方释放责任按常见平台合同静态核对。

关键易错点
----------

* 允许下一层继续选择当前数字，导致重复使用；
* 每层都从 1 开始，生成不同排列并重复输出；
* ``remaining=0`` 时路径长度不足也提交；
* 保存可变 ``path`` 引用而不是快照；
* 递归返回后忘记恢复路径；
* 最大可达和使用当前起点之后的错误范围，误删合法状态；
* 候选上界写成 9，产生注定无法填满槽位的分支；
* C 两次独立 ``realloc`` 后只处理一次失败，破坏所有权；
* 把固定候选范围误写成无需报告输出空间。

知识联系
--------

本题展示了组合回溯的三个核心结构：

* 用单调候选起点消除排列重复；
* 用“剩余槽位 + 剩余目标”描述尚未完成的约束；
* 用可实现的最小值和最大值证明剪枝安全。

同类方法可扩展到固定大小子集、组合求和、分割问题和带上下界的约束搜索。
当候选中允许重复使用时，下一层起点是否增加会改变问题合同；不能机械复用本题转移。

自检问题
--------

#. 为什么严格递增选择同时解决“数字不重复”和“组合不重复”？
#. 为什么 ``remaining=0`` 仍不能立即提交？
#. 最小可达和为什么从 ``start`` 开始取连续 ``slots`` 个数字？
#. 最大可达和为什么可以与 ``start`` 无关？
#. 为什么本层候选最大只能是 ``10-slots``？
#. C 为什么不直接连续调用两次 ``realloc`` 扩展两个并行数组？

参考答案
~~~~~~~~

#. 每个数字选择后下一起点变为它加一，因此不会再次使用；一个集合只有一种严格递增排列。
#. 还必须保证已经恰好选择 ``k`` 个数字，即 ``slots=0``。
#. 任意递增候选的第 ``i`` 项至少为 ``start+i``，连续最小值给出所有方案的下界。
#. 在候选数量足够时，允许区间包含全局最大的 ``slots`` 个数字，它们给出可实现上界。
#. 选择更大的值后，剩余比它大的数字不足 ``slots-1`` 个。
#. 其中一次成功、另一次失败会使新旧指针和容量状态难以保持一致；先分配两块新数组再整体替换更安全。
