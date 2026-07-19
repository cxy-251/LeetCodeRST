0131. Palindrome Partitioning
=============================

题目信息
--------

:题号: 0131
:难度: Medium
:主题: 字符串、区间动态规划、回溯、路径枚举
:原题: `LeetCode 0131 <https://leetcode.com/problems/palindrome-partitioning/>`_
:访问状态: Available
:教学重点: 回文区间预处理、切分位置图、路径快照、输出敏感复杂度

题目重述与精确契约
------------------

给定字符串 ``s``，在字符之间选择若干切分位置，使每个得到的连续非空片段都是回文串。
返回全部合法切分方案。

本文采用官方输入域与接口：

* ``1 <= len(s) <= 16``；
* ``s`` 只包含小写英文字母，因此十语言都可以按 ASCII 字节或等价代码单元比较；
* 一个方案中的片段按原字符串从左到右排列，首尾相接且恰好覆盖 ``s``；
* 每个片段必须非空，片段内部不能跳过字符；
* 返回全部方案且不重复；方案之间的排列顺序没有语义要求；
* 输入字符串只读，算法不改写调用者可观察的数据；
* C 接口返回堆上二维字符串及每行列数，成功后由平台释放；托管语言返回各自的字符串列表。

官方输入不包含空字符串。若自行把输入域扩展到空串，需要先约定“空分割”是否作为唯一方案；
本文实现不把该扩展混入官方契约。

自建示例
--------

同时存在长短回文
~~~~~~~~~~~~~~~~

.. code-block:: text

   输入：s = "aab"
   输出：[["a", "a", "b"], ["aa", "b"]]

第一种方案选择两个切点，第二种方案把前两个 ``a`` 合为一个回文片段。

整串回文仍不是唯一方案
~~~~~~~~~~~~~~~~~~~~~~

.. code-block:: text

   输入：s = "efe"
   输出可以是：[["e", "f", "e"], ["efe"]]

整串 ``"efe"`` 是回文，但逐字符切分也始终合法。

没有长度大于一的回文
~~~~~~~~~~~~~~~~~~~~

.. code-block:: text

   输入：s = "abc"
   输出：[["a", "b", "c"]]

单字符一定是回文，因此合法输入至少存在一个方案。

问题抽象
--------

长度为 ``n`` 的字符串有 ``n - 1`` 个字符间隙，每个间隙都可选择“切”或“不切”。
直接枚举全部 ``2^(n-1)`` 个切点集合，再反复扫描片段判断回文，会重复检查相同区间。

可以把位置 ``0, 1, ..., n`` 看成一张有向无环图的顶点。若闭区间
``s[start..end]`` 是回文，就建立一条边

.. code-block:: text

   start -> end + 1

从顶点 ``0`` 到顶点 ``n`` 的每条路径都依次给出一组回文片段；反过来，每个合法分割也给出
唯一的位置路径。问题因此分成两层：

#. 用区间动态规划一次性回答“任意子串是否回文”；
#. 在位置 DAG 上回溯枚举从 ``0`` 到 ``n`` 的全部路径。

解法选择
--------

.. list-table::
   :header-rows: 1

   * - 方法
     - 时间特征
     - 工作空间
     - 定位
   * - 枚举切点并逐段检查
     - 最坏 ``O(n^2 2^n)``
     - ``O(n)`` 递归路径
     - 重复扫描相同区间
   * - 回文区间 DP + 回溯
     - ``O(n^2)`` 预处理，加输出敏感枚举
     - ``O(n^2)`` 加递归路径
     - 主解法；状态清晰且跨语言稳定
   * - 回溯时记忆每个区间
     - 同样可避免重复回文判断
     - 最坏 ``O(n^2)``
     - 缓存时机和枚举逻辑更分散

本题必须返回全部方案，指数级输出无法消除。主解法的目标不是把总时间伪装成多项式，
而是把重复的回文判断压缩为 ``O(1)`` 查询，并让剩余成本对应真实搜索和返回载荷。

主解法：区间 DP 后枚举位置路径
--------------------------------

回文状态
~~~~~~~~

定义布尔表 ``pal[start][end]``：

.. code-block:: text

   pal[start][end] = s[start..end] 是否为回文

对 ``start <= end``，

.. code-block:: text

   pal[start][end] =
       s[start] == s[end]
       and (
           end - start < 2
           or pal[start + 1][end - 1]
       )

长度为一或二时，不需要读取内部区间；更长区间只有在两端相等且内部是回文时才成立。
``start`` 从右向左填写，``end`` 从 ``start`` 向右填写。需要的
``pal[start + 1][end - 1]`` 因而已经完成。

回溯状态
~~~~~~~~

``dfs(start)`` 表示：前缀 ``s[0..start-1]`` 已经由 ``path`` 合法覆盖，现在枚举后缀
``s[start..n-1]`` 的全部回文分割。

在当前层枚举 ``end = start..n-1``：

* 若 ``pal[start][end]`` 为假，这个终点不能成为下一段；
* 若为真，把 ``s[start..end]`` 加入 ``path``，递归到 ``end + 1``；
* 子调用返回后撤销最后一个片段，使下一个兄弟分支看到原路径；
* 当 ``start == n`` 时，复制 ``path`` 保存为独立答案。

状态与核心不变量
~~~~~~~~~~~~~~~~

每次进入 ``dfs(start)`` 时保持：

* ``0 <= start <= n``；
* ``path`` 中每个字符串都是 ``s`` 的连续非空回文片段；
* ``path`` 按原顺序恰好覆盖半开前缀 ``s[0..start)``，既不重叠也不留空洞；
* 当前调用只追加和撤销自己的最后一个片段，返回后恢复父调用的 ``path``；
* 已保存的答案是独立快照，不会被后续回溯修改；
* ``pal`` 只读且已经正确覆盖全部 ``start <= end`` 的区间；
* 输入 ``s`` 从未被修改。

正确性证明
----------

引理一：回文表判定正确
~~~~~~~~~~~~~~~~~~~~~~

对区间长度归纳。长度一显然是回文；长度二当且仅当两个字符相等。对长度至少三的区间，
根据回文定义，它是回文当且仅当两端字符相等且删除两端后的内部区间也是回文。
内部区间更短，并且填写顺序保证其状态已经正确，所以转移式对当前区间也正确。
归纳后，``pal`` 对所有闭区间都给出准确判定。

引理二：回溯产生的每个方案都合法
~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

回溯只在 ``pal[start][end]`` 为真时追加片段。由引理一，该片段是非空回文串。
递归起点更新为 ``end + 1``，所以新片段紧接已覆盖前缀，不重叠也不跳过字符。
只有在 ``start == n`` 时保存，此时路径恰好覆盖整个字符串。因此每个返回方案都合法。

引理三：不会遗漏合法方案
~~~~~~~~~~~~~~~~~~~~~~~~

任取一个合法方案，记其片段终点依次为
``end_1 < end_2 < ... < end_k = n - 1``。第一个片段是回文，所以根调用一定会枚举并接受
``end_1``；进入下一层后，同理会接受 ``end_2``。逐段应用后，算法沿这条分支到达 ``n``
并保存该方案。因此任意合法方案都能生成。

引理四：不会重复
~~~~~~~~~~~~~~~~

一个分割由严格递增的终点序列唯一决定。两条不同的回溯分支必然在首次不同选择处采用不同终点，
从而得到不同的第一处切分位置；它们不可能表示同一方案。因此每个方案只生成一次。

快照、终止与副作用
~~~~~~~~~~~~~~~~~~

保存答案时，各实现复制当前路径容器；需要独立字符串的语言也物化片段。
后续 ``pop`` 或覆盖只作用于工作路径，不会改变历史答案。

每次递归都令 ``start`` 至少增加一，并且最大为 ``n``，所以深度不超过 ``n``；
每层终点循环有限，算法必然终止。``pal``、``path`` 和答案容器均为新建对象，输入字符串只被读取，
所以调用者观察不到输入修改。

复杂度与输出载荷
----------------

令：

* ``n`` 为字符串长度；
* ``P`` 为合法分割方案数，``P <= 2^(n-1)``；
* ``K`` 为全部答案包含的片段总数；
* ``Z`` 为全部答案字符串的逻辑字符总量。每个方案都完整覆盖原串，所以 ``Z = nP``；
* ``C`` 为回溯所有节点实际执行的候选终点检查次数。

回文表需要 ``Theta(n^2)`` 时间和空间。枚举阶段执行 ``Theta(C)`` 次表查询；
构造片段、复制路径和保存输出的成本按语言落在 ``O(K + Z)`` 内。于是通用表达为
``O(n^2 + C + K + Z)``，且 ``C = O(n 2^(n-1))``。最坏输出本身已有
``Z = Theta(n 2^(n-1))``，因此指数成本是题目返回全部方案的必然结果，不能只写 ``O(n^2)``。

不计返回结果时，核心工作空间为 ``Theta(n^2)`` 的回文表、``O(n)`` 的递归栈和工作路径。
返回值逻辑载荷为 ``Theta(K + Z)``。

语言实现还有这些真实差异：

* C、C++、Python、Java、Rust、C#、Julia 与 R 在建立答案片段时复制字符，成本计入 ``Z``；
* Go 的 ``s[start:end]`` 只创建字符串头并共享不可变原串，返回结果会保留原字符串；
  物理新增主要是 ``O(K)`` 个字符串头和路径快照，但逻辑输出字符量仍是 ``Z``；
* TypeScript 的 ``slice`` 是否共享存储由运行时实现决定，按可移植上界把字符物化计入 ``Z``；
* C++ 的平台签名按值接收 ``std::string``，调用边界还可能复制 ``O(n)`` 字符；
* Julia 的 ``codeunits(s)`` 是 ``O(1)`` 包装，片段转换为 ``String`` 时才复制字节；
* R 先物化 ``O(n)`` 字符向量，并用显式环境保存递归共享状态；快照和 ``paste0`` 成本计入输出。

核心语言实现
------------

C
~

C 版本在任何分配失败时停止搜索，释放工作路径和此前已经保存的所有结果，并把输出元数据恢复为空。
官方长度上界使固定 ``pal[16][16]`` 和 ``path[16]`` 安全；答案外层数组按实际数量倍增。

.. code-block:: c

   #include <stdbool.h>
   #include <stddef.h>
   #include <stdlib.h>
   #include <string.h>

   typedef struct {
       const char *s;
       int n;
       unsigned char pal[16][16];
       char *path[16];
       int depth;
       char ***answers;
       int *columns;
       size_t size;
       size_t capacity;
       bool failed;
   } Context;

   static char *copy_range(const char *s, int start, int end) {
       size_t length = (size_t)(end - start + 1);
       char *part = malloc(length + 1U);
       if (part == NULL) {
           return NULL;
       }
       memcpy(part, s + start, length);
       part[length] = '\0';
       return part;
   }

   static bool reserve_results(Context *ctx) {
       if (ctx->size < ctx->capacity) {
           return true;
       }

       size_t new_capacity = ctx->capacity == 0U
           ? 4U
           : ctx->capacity * 2U;
       char ***new_answers =
           malloc(new_capacity * sizeof(*new_answers));
       int *new_columns =
           malloc(new_capacity * sizeof(*new_columns));
       if (new_answers == NULL || new_columns == NULL) {
           free(new_answers);
           free(new_columns);
           return false;
       }

       if (ctx->size > 0U) {
           memcpy(
               new_answers,
               ctx->answers,
               ctx->size * sizeof(*new_answers)
           );
           memcpy(
               new_columns,
               ctx->columns,
               ctx->size * sizeof(*new_columns)
           );
       }
       free(ctx->answers);
       free(ctx->columns);
       ctx->answers = new_answers;
       ctx->columns = new_columns;
       ctx->capacity = new_capacity;
       return true;
   }

   static void save_path(Context *ctx) {
       if (!reserve_results(ctx)) {
           ctx->failed = true;
           return;
       }

       char **row = malloc((size_t)ctx->depth * sizeof(*row));
       if (row == NULL) {
           ctx->failed = true;
           return;
       }

       int copied = 0;
       for (; copied < ctx->depth; ++copied) {
           size_t length = strlen(ctx->path[copied]) + 1U;
           row[copied] = malloc(length);
           if (row[copied] == NULL) {
               for (int i = 0; i < copied; ++i) {
                   free(row[i]);
               }
               free(row);
               ctx->failed = true;
               return;
           }
           memcpy(row[copied], ctx->path[copied], length);
       }

       ctx->answers[ctx->size] = row;
       ctx->columns[ctx->size] = ctx->depth;
       ++ctx->size;
   }

   static void search(Context *ctx, int start) {
       if (start == ctx->n) {
           save_path(ctx);
           return;
       }

       for (int end = start; end < ctx->n && !ctx->failed; ++end) {
           if (ctx->pal[start][end] == 0U) {
               continue;
           }

           char *part = copy_range(ctx->s, start, end);
           if (part == NULL) {
               ctx->failed = true;
               break;
           }
           ctx->path[ctx->depth++] = part;
           search(ctx, end + 1);
           free(ctx->path[--ctx->depth]);
       }
   }

   static void free_saved_results(Context *ctx) {
       for (size_t row = 0; row < ctx->size; ++row) {
           for (int column = 0; column < ctx->columns[row]; ++column) {
               free(ctx->answers[row][column]);
           }
           free(ctx->answers[row]);
       }
       free(ctx->answers);
       free(ctx->columns);
   }

   char ***partition(
       char *s,
       int *returnSize,
       int **returnColumnSizes
   ) {
       *returnSize = 0;
       *returnColumnSizes = NULL;

       Context ctx = {0};
       ctx.s = s;
       ctx.n = (int)strlen(s);
       if (ctx.n < 1 || ctx.n > 16) {
           return NULL;
       }

       for (int start = ctx.n - 1; start >= 0; --start) {
           for (int end = start; end < ctx.n; ++end) {
               ctx.pal[start][end] = (unsigned char)(
                   s[start] == s[end] &&
                   (
                       end - start < 2 ||
                       ctx.pal[start + 1][end - 1] != 0U
                   )
               );
           }
       }

       search(&ctx, 0);
       if (ctx.failed) {
           free_saved_results(&ctx);
           return NULL;
       }

       *returnSize = (int)ctx.size;
       *returnColumnSizes = ctx.columns;
       return ctx.answers;
   }

C++
~~~

代码只使用 C++17 能力。``answers.push_back(path)`` 复制路径容器和其中的字符串，
因此历史答案不受 ``path.pop_back()`` 影响。

.. code-block:: cpp

   #include <string>
   #include <vector>

   class Solution {
   public:
       std::vector<std::vector<std::string>> partition(
           std::string s
       ) {
           const int n = static_cast<int>(s.size());
           std::vector<std::vector<unsigned char>> palindrome(
               n,
               std::vector<unsigned char>(n, 0U)
           );
           for (int start = n - 1; start >= 0; --start) {
               for (int end = start; end < n; ++end) {
                   palindrome[start][end] = static_cast<unsigned char>(
                       s[start] == s[end] &&
                       (
                           end - start < 2 ||
                           palindrome[start + 1][end - 1] != 0U
                       )
                   );
               }
           }

           std::vector<std::vector<std::string>> answers;
           std::vector<std::string> path;
           auto dfs = [&](auto&& self, int start) -> void {
               if (start == n) {
                   answers.push_back(path);
                   return;
               }
               for (int end = start; end < n; ++end) {
                   if (palindrome[start][end] == 0U) {
                       continue;
                   }
                   path.push_back(
                       s.substr(start, end - start + 1)
                   );
                   self(self, end + 1);
                   path.pop_back();
               }
           };
           dfs(dfs, 0);
           return answers;
       }
   };

Python
~~~~~~

.. code-block:: python

   from typing import List


   class Solution:
       def partition(self, s: str) -> List[List[str]]:
           n = len(s)
           palindrome = [[False] * n for _ in range(n)]
           for start in range(n - 1, -1, -1):
               for end in range(start, n):
                   palindrome[start][end] = (
                       s[start] == s[end]
                       and (
                           end - start < 2
                           or palindrome[start + 1][end - 1]
                       )
                   )

           answers: List[List[str]] = []
           path: List[str] = []

           def dfs(start: int) -> None:
               if start == n:
                   answers.append(path.copy())
                   return

               for end in range(start, n):
                   if not palindrome[start][end]:
                       continue
                   path.append(s[start : end + 1])
                   dfs(end + 1)
                   path.pop()

           dfs(0)
           return answers

Java
~~~~

.. code-block:: java

   import java.util.ArrayList;
   import java.util.List;

   class Solution {
       public List<List<String>> partition(String s) {
           int n = s.length();
           boolean[][] palindrome = new boolean[n][n];
           for (int start = n - 1; start >= 0; --start) {
               for (int end = start; end < n; ++end) {
                   palindrome[start][end] =
                       s.charAt(start) == s.charAt(end) &&
                       (
                           end - start < 2 ||
                           palindrome[start + 1][end - 1]
                       );
               }
           }

           List<List<String>> answers = new ArrayList<>();
           backtrack(
               s,
               0,
               palindrome,
               new ArrayList<>(),
               answers
           );
           return answers;
       }

       private void backtrack(
           String s,
           int start,
           boolean[][] palindrome,
           List<String> path,
           List<List<String>> answers
       ) {
           if (start == s.length()) {
               answers.add(new ArrayList<>(path));
               return;
           }

           for (int end = start; end < s.length(); ++end) {
               if (!palindrome[start][end]) {
                   continue;
               }
               path.add(s.substring(start, end + 1));
               backtrack(s, end + 1, palindrome, path, answers);
               path.remove(path.size() - 1);
           }
       }
   }

Rust
~~~~

Rust 按 ASCII 字节建立区间表；官方小写英文字母保证每个字节边界也是 UTF-8 字符边界。

.. code-block:: rust

   impl Solution {
       pub fn partition(s: String) -> Vec<Vec<String>> {
           let bytes = s.as_bytes();
           let n = bytes.len();
           let mut palindrome = vec![vec![false; n]; n];
           for start in (0..n).rev() {
               for end in start..n {
                   palindrome[start][end] =
                       bytes[start] == bytes[end] &&
                       (
                           end - start < 2 ||
                           palindrome[start + 1][end - 1]
                       );
               }
           }

           fn dfs(
               s: &str,
               start: usize,
               palindrome: &[Vec<bool>],
               path: &mut Vec<String>,
               answers: &mut Vec<Vec<String>>,
           ) {
               if start == s.len() {
                   answers.push(path.clone());
                   return;
               }

               for end in start..s.len() {
                   if !palindrome[start][end] {
                       continue;
                   }
                   path.push(s[start..=end].to_string());
                   dfs(s, end + 1, palindrome, path, answers);
                   path.pop();
               }
           }

           let mut answers = Vec::new();
           let mut path = Vec::new();
           dfs(&s, 0, &palindrome, &mut path, &mut answers);
           answers
       }
   }

Go
~~

Go 的片段是原字符串的只读切片；返回结果会保留 ``s`` 的底层字节，不为每个片段复制字符。

.. code-block:: go

   func partition(s string) [][]string {
       n := len(s)
       palindrome := make([][]bool, n)
       for index := range palindrome {
           palindrome[index] = make([]bool, n)
       }

       for start := n - 1; start >= 0; start-- {
           for end := start; end < n; end++ {
               palindrome[start][end] =
                   s[start] == s[end] &&
                       (
                           end-start < 2 ||
                               palindrome[start+1][end-1]
                       )
           }
       }

       answers := make([][]string, 0)
       path := make([]string, 0, n)
       var dfs func(int)
       dfs = func(start int) {
           if start == n {
               snapshot := append([]string(nil), path...)
               answers = append(answers, snapshot)
               return
           }

           for end := start; end < n; end++ {
               if !palindrome[start][end] {
                   continue
               }
               path = append(path, s[start:end+1])
               dfs(end + 1)
               path = path[:len(path)-1]
           }
       }

       dfs(0)
       return answers
   }

TypeScript
~~~~~~~~~~

.. code-block:: typescript

   function partition(s: string): string[][] {
       const n = s.length;
       const palindrome = Array.from(
           { length: n },
           () => Array<boolean>(n).fill(false),
       );

       for (let start = n - 1; start >= 0; start--) {
           for (let end = start; end < n; end++) {
               palindrome[start][end] =
                   s[start] === s[end] &&
                   (
                       end - start < 2 ||
                       palindrome[start + 1][end - 1]
                   );
           }
       }

       const answers: string[][] = [];
       const path: string[] = [];
       const dfs = (start: number): void => {
           if (start === n) {
               answers.push([...path]);
               return;
           }

           for (let end = start; end < n; end++) {
               if (!palindrome[start][end]) {
                   continue;
               }
               path.push(s.slice(start, end + 1));
               dfs(end + 1);
               path.pop();
           }
       };

       dfs(0);
       return answers;
   }

C#
~~

.. code-block:: csharp

   using System.Collections.Generic;

   public class Solution {
       public IList<IList<string>> Partition(string s) {
           int n = s.Length;
           bool[,] palindrome = new bool[n, n];
           for (int start = n - 1; start >= 0; --start) {
               for (int end = start; end < n; ++end) {
                   palindrome[start, end] =
                       s[start] == s[end] &&
                       (
                           end - start < 2 ||
                           palindrome[start + 1, end - 1]
                       );
               }
           }

           var answers = new List<IList<string>>();
           var path = new List<string>();

           void Dfs(int start) {
               if (start == n) {
                   answers.Add(new List<string>(path));
                   return;
               }

               for (int end = start; end < n; ++end) {
                   if (!palindrome[start, end]) {
                       continue;
                   }
                   path.Add(s.Substring(start, end - start + 1));
                   Dfs(end + 1);
                   path.RemoveAt(path.Count - 1);
               }
           }

           Dfs(0);
           return answers;
       }
   }

Julia
~~~~~

``codeunits(s)`` 只创建轻量字节视图。官方 ASCII 契约保证区间下标安全；
``String(bytes[start:stop])`` 为保存的片段物化独立字符串。

.. code-block:: julia

   function palindrome_partitions(s::String)::Vector{Vector{String}}
       bytes = codeunits(s)
       n = length(bytes)
       palindrome = falses(n, n)

       for start in n:-1:1
           for stop in start:n
               palindrome[start, stop] =
                   bytes[start] == bytes[stop] &&
                   (
                       stop - start < 2 ||
                       palindrome[start + 1, stop - 1]
                   )
           end
       end

       answers = Vector{Vector{String}}()
       path = String[]

       function dfs(start::Int)
           if start == n + 1
               push!(answers, copy(path))
               return
           end

           for stop in start:n
               palindrome[start, stop] || continue
               push!(path, String(bytes[start:stop]))
               dfs(stop + 1)
               pop!(path)
           end
       end

       dfs(1)
       return answers
   end

R
~

R 版本用 ``environment`` 显式保存递归共享的路径槽位、深度和答案。
这避免把普通局部向量赋值误认为递归调用会自动共享的状态。

.. code-block:: r

   palindrome_partitions <- function(s) {
     chars <- strsplit(s, "", fixed = TRUE)[[1L]]
     n <- length(chars)
     palindrome <- matrix(FALSE, nrow = n, ncol = n)

     for (start in seq.int(n, 1L, by = -1L)) {
       for (stop in seq.int(start, n)) {
         inside <- stop - start < 2L ||
           palindrome[start + 1L, stop - 1L]
         palindrome[start, stop] <-
           chars[[start]] == chars[[stop]] && inside
       }
     }

     state <- new.env(parent = emptyenv())
     state$depth <- 0L
     state$count <- 0L
     path <- new.env(hash = TRUE, parent = emptyenv())
     saved <- new.env(hash = TRUE, parent = emptyenv())

     dfs <- function(start) {
       if (start == n + 1L) {
         snapshot <- vapply(
           seq_len(state$depth),
           function(index) {
             get(as.character(index), envir = path, inherits = FALSE)
           },
           character(1L)
         )
         state$count <- state$count + 1L
         assign(
           as.character(state$count),
           snapshot,
           envir = saved
         )
         return(invisible(NULL))
       }

       for (stop in seq.int(start, n)) {
         if (!palindrome[start, stop]) {
           next
         }

         state$depth <- state$depth + 1L
         key <- as.character(state$depth)
         piece <- paste0(chars[start:stop], collapse = "")
         assign(key, piece, envir = path)
         dfs(stop + 1L)
         rm(list = key, envir = path)
         state$depth <- state$depth - 1L
       }
       invisible(NULL)
     }

     dfs(1L)
     lapply(seq_len(state$count), function(index) {
       get(as.character(index), envir = saved, inherits = FALSE)
     })
   }

关键边界与易错点
----------------

* ``n = 1`` 时只有单字符方案；不能把非空输入误处理成零个答案；
* 整串是回文时，整串方案只是答案之一，不能发现后立即停止；
* 单字符永远提供一条出边，所以任意合法输入至少能完成一条路径；
* DP 的短区间条件必须短路求值，不能在长度一或二时先读取越界的内部槽位；
* ``start`` 必须从右向左填写，否则 ``pal[start + 1][end - 1]`` 可能尚未计算；
* 保存结果必须复制路径容器；直接保存同一个可变 ``path`` 会让历史答案随后被撤销；
* 回溯返回后必须撤销当前层片段，否则兄弟分支会混入旧选择；
* 输出顺序无关，验证时应规范化方案，而不是依赖容器遍历顺序；
* Go 结果片段共享原字符串；若业务接口要求每段独立存储，需要显式复制并重新计费；
* R 的递归共享状态必须使用显式环境、参数返回或审计后的 ``<<-``，不能依赖调用者栈帧。

验证证据
--------

本次返工使用“枚举全部 ``n - 1`` 个切点集合并逐段直接反转判断”作为独立基准：

* Python 实际运行 ``"a"``、``"aab"``、``"efe"``、``"abc"``、``"aaaa"``、
  ``"abbaeae"`` 六个固定案例；
* Python 使用固定随机种子生成 2,000 个长度 ``1`` 至 ``10``、字母表 ``{a,b,c}`` 的字符串，
  把所有方案规范化为片段元组集合后与独立基准对拍，结果全部一致；
* C++ 主实现以 ``-std=c++17 -Wall -Wextra -Wpedantic -Werror`` 编译，并运行代表案例；
* C 主实现以 C11 严格警告编译，运行代表案例，并通过 AddressSanitizer 与
  UndefinedBehaviorSanitizer；
* Java、Rust、Go、TypeScript、C#、Julia、R 完成接口、索引、短路边界、快照、
  所有权和明显语法的静态检查；未把这些检查表述为运行通过；
* 确认本题只有一个自包含 RST，包含十个语言代码块，不含外部 include 指令，
  且目录中不存在同题 ``.inc`` 分片。

知识更新
--------

``algorithm.palindrome_interval_dp``
   用“端点相等且内部回文”预计算闭区间状态，使枚举阶段每次回文查询为 ``O(1)``。

``proof.partition_cut_sequence_unique``
   每个分割与严格递增的片段终点序列一一对应；该编码同时支撑完整性和无重复证明。

``complexity.enumeration_output_payload``
   枚举题必须报告答案数、片段数和字符载荷；多项式预处理不能覆盖指数级返回结果。

本题强化了位置 DAG 的建模：回文片段是位置间的边，合法分割是从 ``0`` 到 ``n`` 的路径。

关联题目
--------

* `0005. Longest Palindromic Substring
  <../0001-0100/0005-longest-palindromic-substring.rst>`_：同样研究回文区间，但只选择一个最长子串；
* `0126. Word Ladder II <0126-word-ladder-ii.rst>`_：同样返回全部路径，必须计入输出载荷和快照；
* `0132. Palindrome Partitioning II <0132-palindrome-partitioning-ii.rst>`_：
  复用回文区间状态，把“枚举全部路径”改成“求最少切割”。

最小自检
--------

#. 为什么 ``start`` 从右向左填写能保证 DP 依赖已经存在？
#. 为什么一个合法方案恰好对应一条唯一的终点序列？
#. 保存答案时只保存 ``path`` 的引用会发生什么？
#. 为什么总复杂度不能只写回文表的 ``O(n^2)``？

答案要点
~~~~~~~~

#. 当前状态依赖 ``pal[start + 1][end - 1]``；它的起点更大，已在更早的外层迭代完成。
#. 片段连续覆盖原串，每个切点唯一确定一个终点序列，反之亦然。
#. 后续撤销和追加会改写同一工作容器，使历史答案一起变化或最终变空。
#. 题目返回全部方案，最坏有 ``2^(n-1)`` 个；仅写 DP 成本遗漏了搜索与返回载荷。
