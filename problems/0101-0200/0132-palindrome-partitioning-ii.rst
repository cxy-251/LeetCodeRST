0132. Palindrome Partitioning II
==================================

题目信息
--------

:题号: 0132
:难度: Hard
:主题: 动态规划、回文区间、前缀最优值
:原题: `LeetCode 0132 <https://leetcode.com/problems/palindrome-partitioning-ii/>`_
:访问状态: Available
:教学重点: 回文表、最后一段分解、最少切割次数

题目重述
--------

给定一个非空小写英文字母字符串，将它切分为若干回文子串。返回所需的最少切割次数。
整个字符串已经是回文时返回 ``0``。

算法
----

令 ``pal[start][end]`` 表示闭区间 ``s[start..end]`` 是否为回文。按 ``end`` 从左到右计算，
同一 ``end`` 下按 ``start`` 从右到左计算：

.. code-block:: text

   pal[start][end] =
       s[start] == s[end]
       and (end - start <= 1 or pal[start + 1][end - 1])

令 ``cuts[end]`` 表示前缀 ``s[0..end]`` 的最少切割次数。枚举所有以 ``end`` 结尾的回文段：

.. code-block:: text

   start == 0  ->  candidate = 0
   start > 0   ->  candidate = cuts[start - 1] + 1

取最小候选即可。

正确性
~~~~~~

任意最优分割都有唯一的最后一段 ``s[start..end]``，该段必须是回文。若 ``start == 0``，
整个前缀无需切割；否则前面的 ``s[0..start-1]`` 必须采用其最优切法，再增加最后一刀。
算法枚举全部可能的最后回文段，因此不会漏掉最优解；采用更差的前缀切法也不可能改善总切割数。

复杂度
~~~~~~

回文表和转移都需要 ``O(n^2)`` 时间，回文表占 ``O(n^2)`` 空间，``cuts`` 占 ``O(n)`` 空间。
Julia 使用 ``codeunits`` 只创建轻量包装；R 会物化字符向量，但总空间仍由回文表主导。

核心语言实现
------------

C
~

.. code-block:: c

   #include <stdbool.h>
   #include <stdlib.h>
   #include <string.h>

   int minCut(char *s) {
       int n = (int)strlen(s);
       bool *pal = calloc((size_t)n * (size_t)n, sizeof(*pal));
       int *cuts = malloc((size_t)n * sizeof(*cuts));
       if (pal == NULL || cuts == NULL) {
           free(pal);
           free(cuts);
           return 0;
       }

       for (int end = 0; end < n; ++end) {
           cuts[end] = end;
           for (int start = end; start >= 0; --start) {
               bool inner = end - start <= 1 ||
                   pal[(size_t)(start + 1) * (size_t)n + end - 1];
               if (s[start] == s[end] && inner) {
                   pal[(size_t)start * (size_t)n + end] = true;
                   int candidate = start == 0 ? 0 : cuts[start - 1] + 1;
                   if (candidate < cuts[end]) cuts[end] = candidate;
               }
           }
       }

       int answer = cuts[n - 1];
       free(pal);
       free(cuts);
       return answer;
   }

C++
~~~

.. code-block:: cpp

   #include <algorithm>
   #include <string>
   #include <vector>

   class Solution {
   public:
       int minCut(std::string s) {
           int n = static_cast<int>(s.size());
           std::vector<std::vector<char>> pal(
               n, std::vector<char>(n, false)
           );
           std::vector<int> cuts(n);

           for (int end = 0; end < n; ++end) {
               cuts[end] = end;
               for (int start = end; start >= 0; --start) {
                   bool inner = end - start <= 1 ||
                       pal[start + 1][end - 1];
                   if (s[start] == s[end] && inner) {
                       pal[start][end] = true;
                       int candidate =
                           start == 0 ? 0 : cuts[start - 1] + 1;
                       cuts[end] = std::min(cuts[end], candidate);
                   }
               }
           }
           return cuts[n - 1];
       }
   };

Python
~~~~~~

.. code-block:: python

   class Solution:
       def minCut(self, s: str) -> int:
           n = len(s)
           pal = [[False] * n for _ in range(n)]
           cuts = list(range(n))

           for end in range(n):
               for start in range(end, -1, -1):
                   inner = (
                       end - start <= 1
                       or pal[start + 1][end - 1]
                   )
                   if s[start] == s[end] and inner:
                       pal[start][end] = True
                       candidate = (
                           0 if start == 0 else cuts[start - 1] + 1
                       )
                       cuts[end] = min(cuts[end], candidate)
           return cuts[-1]

Java
~~~~

.. code-block:: java

   class Solution {
       public int minCut(String s) {
           int n = s.length();
           boolean[][] pal = new boolean[n][n];
           int[] cuts = new int[n];

           for (int end = 0; end < n; ++end) {
               cuts[end] = end;
               for (int start = end; start >= 0; --start) {
                   boolean inner = end - start <= 1 ||
                       pal[start + 1][end - 1];
                   if (s.charAt(start) == s.charAt(end) && inner) {
                       pal[start][end] = true;
                       int candidate =
                           start == 0 ? 0 : cuts[start - 1] + 1;
                       cuts[end] = Math.min(cuts[end], candidate);
                   }
               }
           }
           return cuts[n - 1];
       }
   }

Rust
~~~~

.. code-block:: rust

   impl Solution {
       pub fn min_cut(s: String) -> i32 {
           let bytes = s.as_bytes();
           let n = bytes.len();
           let mut pal = vec![vec![false; n]; n];
           let mut cuts: Vec<usize> = (0..n).collect();

           for end in 0..n {
               for start in (0..=end).rev() {
                   let inner = end - start <= 1 ||
                       pal[start + 1][end - 1];
                   if bytes[start] == bytes[end] && inner {
                       pal[start][end] = true;
                       let candidate = if start == 0 {
                           0
                       } else {
                           cuts[start - 1] + 1
                       };
                       cuts[end] = cuts[end].min(candidate);
                   }
               }
           }
           cuts[n - 1] as i32
       }
   }

Go
~~

.. code-block:: go

   func minCut(s string) int {
       n := len(s)
       pal := make([][]bool, n)
       cuts := make([]int, n)
       for i := range pal {
           pal[i] = make([]bool, n)
       }

       for end := 0; end < n; end++ {
           cuts[end] = end
           for start := end; start >= 0; start-- {
               inner := end-start <= 1 ||
                   pal[start+1][end-1]
               if s[start] == s[end] && inner {
                   pal[start][end] = true
                   candidate := 0
                   if start > 0 {
                       candidate = cuts[start-1] + 1
                   }
                   if candidate < cuts[end] {
                       cuts[end] = candidate
                   }
               }
           }
       }
       return cuts[n-1]
   }

TypeScript
~~~~~~~~~~

.. code-block:: typescript

   function minCut(s: string): number {
       const n = s.length;
       const pal = Array.from(
           { length: n },
           () => Array<boolean>(n).fill(false),
       );
       const cuts = Array.from({ length: n }, (_, i) => i);

       for (let end = 0; end < n; end++) {
           for (let start = end; start >= 0; start--) {
               const inner =
                   end - start <= 1 || pal[start + 1][end - 1];
               if (s[start] === s[end] && inner) {
                   pal[start][end] = true;
                   const candidate =
                       start === 0 ? 0 : cuts[start - 1] + 1;
                   cuts[end] = Math.min(cuts[end], candidate);
               }
           }
       }
       return cuts[n - 1];
   }

C#
~~

.. code-block:: csharp

   public class Solution {
       public int MinCut(string s) {
           int n = s.Length;
           bool[,] pal = new bool[n, n];
           int[] cuts = new int[n];

           for (int end = 0; end < n; ++end) {
               cuts[end] = end;
               for (int start = end; start >= 0; --start) {
                   bool inner = end - start <= 1 ||
                       pal[start + 1, end - 1];
                   if (s[start] == s[end] && inner) {
                       pal[start, end] = true;
                       int candidate =
                           start == 0 ? 0 : cuts[start - 1] + 1;
                       cuts[end] = Math.Min(cuts[end], candidate);
                   }
               }
           }
           return cuts[n - 1];
       }
   }

Julia
~~~~~

.. code-block:: julia

   function min_cut(s::String)::Int
       bytes = codeunits(s)
       n = length(bytes)
       pal = falses(n, n)
       cuts = collect(0:n-1)

       for last in 1:n
           for first in last:-1:1
               inner = last - first <= 1 ||
                       pal[first + 1, last - 1]
               if bytes[first] == bytes[last] && inner
                   pal[first, last] = true
                   candidate = first == 1 ? 0 : cuts[first - 1] + 1
                   cuts[last] = min(cuts[last], candidate)
               end
           end
       end
       return cuts[n]
   end

R
~

.. code-block:: r

   min_cut <- function(s) {
     chars <- strsplit(s, "", fixed = TRUE)[[1L]]
     n <- length(chars)
     pal <- matrix(FALSE, nrow = n, ncol = n)
     cuts <- seq.int(0L, n - 1L)

     for (last in seq_len(n)) {
       for (first in seq.int(last, 1L, by = -1L)) {
         inner <- last - first <= 1L ||
           pal[first + 1L, last - 1L]
         if (chars[[first]] == chars[[last]] && inner) {
           pal[first, last] <- TRUE
           candidate <- if (first == 1L) {
             0L
           } else {
             cuts[[first - 1L]] + 1L
           }
           cuts[[last]] <- min(cuts[[last]], candidate)
         }
       }
     }
     cuts[[n]]
   }

关键边界
--------

* 单字符答案为 ``0``；
* 整串回文时 ``cuts[n-1]`` 会被更新为 ``0``；
* ``cuts[end]`` 初始设为 ``end``，对应每个字符单独成段；
* 回文状态依赖更短的内部区间，计算顺序必须保证该状态已经可用；
* 返回切割次数，不是回文片段数量。

最小自检
--------

#. 为什么只枚举最后一个回文片段就足以得到全局最优？
#. ``start == 0`` 时为什么候选值是 ``0``？
#. 为什么 ``cuts[end]`` 的安全上界是 ``end``？
