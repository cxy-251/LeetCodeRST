0131. Palindrome Partitioning
=============================

题目信息
--------

:题号: 0131
:难度: Medium
:主题: 字符串、动态规划、回溯、枚举
:原题: `LeetCode 0131 <https://leetcode.com/problems/palindrome-partitioning/>`_
:访问状态: Available
:教学重点: 回文区间 DP、切分点回溯、输出敏感复杂度

题目重述
--------

给定一个非空小写英文字符串，把它切分成若干连续非空片段，使每个片段都是回文串。
返回全部合法切分方案。不同方案由切分位置决定，输出顺序没有语义要求。

算法
----

先预计算 ``pal[start][end]``，表示闭区间 ``s[start..end]`` 是否为回文：

.. code-block:: text

   pal[start][end] =
       s[start] == s[end] and
       (end - start < 2 or pal[start + 1][end - 1])

起点从右向左填写，保证查询内部区间时状态已经存在。

随后从位置 ``start`` 回溯。枚举所有 ``end >= start``；若区间是回文，
把该片段加入路径并递归到 ``end + 1``。到达字符串末尾时复制当前路径作为一个答案。

正确性
~~~~~~

DP 公式直接来自回文定义：两端字符相同，且长度不超过二或内部区间也是回文。
填写顺序保证每个状态依赖的内部状态已正确。

回溯只选择 DP 判定为真的区间，所以生成的每个片段都是回文，且片段首尾相接覆盖整个字符串。
任意合法方案都有唯一的片段终点序列；回溯会依次选择这些终点，因此不会遗漏。
不同递归分支首次选择的终点不同，所以不会重复生成同一方案。

复杂度
~~~~~~

预处理时间和空间均为 ``O(n^2)``。设答案数为 ``P``，总输出字符载荷为 ``Z``；
回溯时间至少为 ``Theta(Z)``，不能只报告 DP 成本。递归路径最深 ``O(n)``，
返回结果空间同样由输出规模决定。

核心语言实现
------------

C
~

.. code-block:: c

   #include <stdlib.h>
   #include <string.h>

   typedef struct {
       char *s;
       int n;
       unsigned char pal[16][16];
       char *path[16];
       int depth;
       char ***answers;
       int *columns;
       int size;
   } Context;

   static char *slice(char *s, int start, int end) {
       int n = end - start + 1;
       char *part = malloc((size_t)n + 1U);
       memcpy(part, s + start, (size_t)n);
       part[n] = '\0';
       return part;
   }

   static void save(Context *ctx) {
       char **row = malloc((size_t)ctx->depth * sizeof(*row));
       for (int i = 0; i < ctx->depth; ++i) {
           size_t n = strlen(ctx->path[i]) + 1U;
           row[i] = malloc(n);
           memcpy(row[i], ctx->path[i], n);
       }
       ctx->answers[ctx->size] = row;
       ctx->columns[ctx->size++] = ctx->depth;
   }

   static void dfs(Context *ctx, int start) {
       if (start == ctx->n) {
           save(ctx);
           return;
       }
       for (int end = start; end < ctx->n; ++end) {
           if (ctx->pal[start][end] == 0U) continue;
           ctx->path[ctx->depth++] = slice(ctx->s, start, end);
           dfs(ctx, end + 1);
           free(ctx->path[--ctx->depth]);
       }
   }

   char ***partition(
       char *s,
       int *returnSize,
       int **returnColumnSizes
   ) {
       Context ctx = {0};
       ctx.s = s;
       ctx.n = (int)strlen(s);
       int capacity = 1 << (ctx.n - 1);
       ctx.answers = malloc((size_t)capacity * sizeof(*ctx.answers));
       ctx.columns = malloc((size_t)capacity * sizeof(*ctx.columns));

       for (int start = ctx.n - 1; start >= 0; --start) {
           for (int end = start; end < ctx.n; ++end) {
               ctx.pal[start][end] = (unsigned char)(
                   s[start] == s[end] &&
                   (end - start < 2 || ctx.pal[start + 1][end - 1])
               );
           }
       }
       dfs(&ctx, 0);
       *returnSize = ctx.size;
       *returnColumnSizes = ctx.columns;
       return ctx.answers;
   }

C++
~~~

.. code-block:: cpp

   #include <string>
   #include <vector>

   class Solution {
   public:
       std::vector<std::vector<std::string>> partition(std::string s) {
           int n = static_cast<int>(s.size());
           std::vector palindrome(n, std::vector<bool>(n, false));
           for (int start = n - 1; start >= 0; --start) {
               for (int end = start; end < n; ++end) {
                   palindrome[start][end] =
                       s[start] == s[end] &&
                       (end - start < 2 || palindrome[start + 1][end - 1]);
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
                   if (!palindrome[start][end]) continue;
                   path.push_back(s.substr(start, end - start + 1));
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

   class Solution:
       def partition(self, s: str) -> list[list[str]]:
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

           answers: list[list[str]] = []
           path: list[str] = []

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
                       (end - start < 2 || palindrome[start + 1][end - 1]);
               }
           }

           List<List<String>> answers = new ArrayList<>();
           backtrack(s, 0, palindrome, new ArrayList<>(), answers);
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
               if (!palindrome[start][end]) continue;
               path.add(s.substring(start, end + 1));
               backtrack(s, end + 1, palindrome, path, answers);
               path.remove(path.size() - 1);
           }
       }
   }

Rust
~~~~

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
                       (end - start < 2 || palindrome[start + 1][end - 1]);
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
           dfs(&s, 0, &palindrome, &mut Vec::new(), &mut answers);
           answers
       }
   }

Go
~~

.. code-block:: go

   func partition(s string) [][]string {
       n := len(s)
       pal := make([][]bool, n)
       for i := range pal {
           pal[i] = make([]bool, n)
       }
       for start := n - 1; start >= 0; start-- {
           for end := start; end < n; end++ {
               pal[start][end] = s[start] == s[end] &&
                   (end-start < 2 || pal[start+1][end-1])
           }
       }
       answers := make([][]string, 0)
       path := make([]string, 0)
       var dfs func(int)
       dfs = func(start int) {
           if start == n {
               answers = append(answers, append([]string(nil), path...))
               return
           }
           for end := start; end < n; end++ {
               if !pal[start][end] {
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
           {length: n},
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
               if (!palindrome[start][end]) continue;
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

   public class Solution {
       public IList<IList<string>> Partition(string s) {
           int n = s.Length;
           bool[,] pal = new bool[n, n];
           for (int start = n - 1; start >= 0; --start) {
               for (int end = start; end < n; ++end) {
                   pal[start, end] = s[start] == s[end] &&
                       (end - start < 2 || pal[start + 1, end - 1]);
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
                   if (!pal[start, end]) continue;
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

.. code-block:: julia

   function palindrome_partitions(s::String)
       n = ncodeunits(s)
       pal = falses(n, n)
       for start in n:-1:1
           for stop in start:n
               pal[start, stop] = s[start] == s[stop] &&
                   (stop - start < 2 || pal[start + 1, stop - 1])
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
               pal[start, stop] || continue
               push!(path, String(SubString(s, start, stop)))
               dfs(stop + 1)
               pop!(path)
           end
       end
       dfs(1)
       answers
   end

R
~

.. code-block:: r

   palindrome_partitions <- function(s) {
     chars <- strsplit(s, "", fixed = TRUE)[[1L]]
     n <- length(chars)
     palindrome <- matrix(FALSE, n, n)
     for (start in n:1L) {
       for (stop in start:n) {
         inside <- stop - start < 2L ||
           palindrome[start + 1L, stop - 1L]
         palindrome[start, stop] <- chars[[start]] == chars[[stop]] &&
           inside
       }
     }

     answers <- list()
     path <- character(0)
     dfs <- function(start) {
       if (start == n + 1L) {
         answers[[length(answers) + 1L]] <<- path
         return(invisible(NULL))
       }
       for (stop in start:n) {
         if (!palindrome[start, stop]) next
         path <<- c(path, paste0(chars[start:stop], collapse = ""))
         dfs(stop + 1L)
         path <<- path[-length(path)]
       }
       invisible(NULL)
     }
     dfs(1L)
     answers
   }

关键边界
--------

* 单字符只有一种切分；
* 整个字符串是回文时，完整字符串只是答案之一；
* 重复字符可能产生大量方案，必须计入输出成本；
* 路径加入片段后，递归返回时必须撤销；
* C、Julia 和 R 的适配器会显式物化子串。

最小自检
--------

#. 为什么 DP 的起点要从右向左填写？
#. 为什么每个合法切分都对应唯一的终点序列？
#. 为什么总复杂度必须包含输出载荷？
