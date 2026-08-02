0010. Regular Expression Matching
=================================

题目信息
--------

:题号: 0010
:难度: Hard
:主题: 字符串、递归、记忆化、动态规划
:原题: `LeetCode 0010 <https://leetcode.com/problems/regular-expression-matching/>`_
:重点: 完整匹配、点号单字符匹配、星号修饰前项、模式合法性

题目重述
--------

给定字符串 ``s`` 和模式 ``p``，判断模式能否匹配字符串的全部字符。模式中的小写英文字母只匹配自身，``.`` 匹配任意单个字符，``*`` 修饰它前面的一个模式元素，表示该元素可以连续出现零次或多次；``*`` 不是独立的通配符，不能脱离前置元素单独匹配字符。

匹配必须覆盖整个字符串，不能只匹配其中一段。``s`` 和 ``p`` 的长度均位于 ``[1, 20]``；``s`` 只包含小写英文字母，``p`` 只包含小写英文字母、``.`` 和 ``*``。题目保证每个 ``*`` 前都有可修饰的有效元素。

自建示例
--------

星号重复多次：

.. code-block:: text

   输入：s = "miss", p = "mis*"
   输出：true
   解释：模式中的 s* 可以匹配字符串末尾连续出现的两个 s。

完整匹配失败：

.. code-block:: text

   输入：s = "cab", p = "c.*d"
   输出：false
   解释：.* 可以匹配 "ab"，但模式末尾还要求一个 d，无法与已经耗尽的字符串匹配。

星号选择零次：

.. code-block:: text

   输入：s = "b", p = "a*b"
   输出：true
   解释：a* 选择出现零次，剩余的 b 与字符串中的 b 匹配。

C++ 实现
--------

.. code-block:: cpp

   #include <string>
   #include <vector>

   class Solution {
   private:
       bool directDfs(
           const std::string& s,
           const std::string& p,
           int i,
           int j
       ) {
           if (j == static_cast<int>(p.size())) {
               return i == static_cast<int>(s.size());
           }

           const bool first_match =
               i < static_cast<int>(s.size()) &&
               (p[j] == s[i] || p[j] == '.');

           if (
               j + 1 < static_cast<int>(p.size()) &&
               p[j + 1] == '*'
           ) {
               return directDfs(s, p, i, j + 2) ||
                   (first_match && directDfs(s, p, i + 1, j));
           }

           return first_match && directDfs(s, p, i + 1, j + 1);
       }

       bool memoDfs(
           const std::string& s,
           const std::string& p,
           int i,
           int j,
           std::vector<std::vector<int>>& memo
       ) {
           int& cached = memo[i][j];
           if (cached != -1) {
               return cached == 1;
           }

           bool answer;
           if (j == static_cast<int>(p.size())) {
               answer = i == static_cast<int>(s.size());
           } else {
               const bool first_match =
                   i < static_cast<int>(s.size()) &&
                   (p[j] == s[i] || p[j] == '.');

               if (
                   j + 1 < static_cast<int>(p.size()) &&
                   p[j + 1] == '*'
               ) {
                   answer = memoDfs(s, p, i, j + 2, memo) ||
                       (first_match && memoDfs(s, p, i + 1, j, memo));
               } else {
                   answer = first_match &&
                       memoDfs(s, p, i + 1, j + 1, memo);
               }
           }

           cached = answer ? 1 : 0;
           return answer;
       }

       bool bottomUp(const std::string& s, const std::string& p) {
           const int m = static_cast<int>(s.size());
           const int n = static_cast<int>(p.size());
           std::vector<std::vector<char>> dp(
               m + 1,
               std::vector<char>(n + 1, false)
           );
           dp[m][n] = true;

           for (int i = m; i >= 0; --i) {
               for (int j = n - 1; j >= 0; --j) {
                   const bool first_match =
                       i < m && (p[j] == s[i] || p[j] == '.');

                   if (j + 1 < n && p[j + 1] == '*') {
                       dp[i][j] = dp[i][j + 2] ||
                           (first_match && dp[i + 1][j]);
                   } else {
                       dp[i][j] = first_match && dp[i + 1][j + 1];
                   }
               }
           }

           return dp[0][0];
       }

   public:
       bool isMatch(std::string s, std::string p) {
           return bottomUp(s, p);
       }
   };

题解
----

从匹配路径枚举到后缀状态
~~~~~~~~~~~~~~~~~~~~~~~~

直接递归会枚举 ``*`` 的不同重复次数。决定后续结果所需的信息只有两个位置：字符串尚未匹配部分的起点
``i`` 和模式尚未处理部分的起点 ``j``。定义：

.. code-block:: text

   match(i, j) = s[i:] 能否被 p[j:] 完整匹配

当 ``j == len(p)`` 时，只有 ``i == len(s)`` 才成功。字符串先耗尽时不能立即失败，因为剩余模式可能是
``a*b*c*``，每组都可选择零次。

普通字符和点号为什么同时前进一步
~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

当前位置能够匹配一个字符的条件是：

.. code-block:: text

   first_match = i < len(s) 且 (p[j] == s[i] 或 p[j] == '.')

若当前元素后面没有 ``*``，它必须恰好消费一个字符，因此转移为：

.. math::

   match(i,j)=first\_match \land match(i+1,j+1)

字符串位置和模式位置必须同时前进；只移动其中一个都会改变“一个模式元素匹配一个字符”的语义。

星号两条分支为什么覆盖所有重复次数
~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

当 ``p[j + 1] == '*'`` 时，当前元素出现次数只有两类：

* 零次：跳过 ``元素 + *``，进入 ``match(i, j + 2)``；
* 至少一次：先匹配一个字符，字符串前进而模式停留，进入 ``match(i + 1, j)``。

第二条分支每次只消费一个字符并保留模式位置，下一状态仍可选择继续消费或停止，因此覆盖一次、两次及更多次。
两条分支合并为：

.. math::

   match(i,j)=match(i,j+2)\lor(first\_match\land match(i+1,j))

递归为什么产生重复后缀
~~~~~~~~~~~~~~~~~~~~

在 ``s = "aaaa"``、``p = "a*a*"`` 中，不同的重复次数分配会到达相同 ``(i, j)``。朴素递归会反复展开
同一个后缀问题。记忆化表为每个状态保存未计算、假、真三种值，使最多 ``(m + 1)(n + 1)`` 个状态各计算一次。

动态规划为什么必须从后向前填表
~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

自底向上表 ``dp[i][j]`` 使用同一后缀定义。转移依赖：

* ``dp[i][j + 2]``；
* ``dp[i + 1][j]``；
* ``dp[i + 1][j + 1]``。

因此 ``i`` 和 ``j`` 都从大到小遍历，计算当前格时右侧、下侧和右下格已经得到结果。唯一直接为真的空状态是
``dp[m][n]``，表示字符串和模式同时耗尽。

状态演化
~~~~~~~~

对 ``s = "aab"``、``p = "c*a*b"``：

.. list-table::
   :header-rows: 1

   * - 状态
     - 当前模式
     - 选择
     - 后继状态
   * - ``(0, 0)``
     - ``c*``
     - ``c`` 不匹配 ``a``，只能零次
     - ``(0, 2)``
   * - ``(0, 2)``
     - ``a*``
     - 消费第一个 ``a``
     - ``(1, 2)``
   * - ``(1, 2)``
     - ``a*``
     - 再消费一个 ``a``
     - ``(2, 2)``
   * - ``(2, 2)``
     - ``a*``
     - 当前 ``b`` 不匹配，结束重复
     - ``(2, 4)``
   * - ``(2, 4)``
     - ``b``
     - 同时消费字符和模式
     - ``(3, 5)``

最终字符串与模式同时耗尽，答案为真。

为什么 ``dp[0][0]`` 代表完整匹配
~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

每个状态只判断两个完整后缀。普通元素覆盖唯一的一次消费方式，星号分支覆盖零次和至少一次的全部情况；所有转移
最终都到达更短的字符串后缀或模式后缀。由后缀长度归纳，每个 ``dp[i][j]`` 都准确表示对应后缀能否完整匹配，
所以 ``dp[0][0]`` 正是整个字符串与整个模式的答案。

复杂度来源
~~~~~~~~~~

朴素递归在连续星号下可能产生指数级分支。记忆化和动态规划均有 ``O(mn)`` 个状态，每个状态只做常数工作，
时间复杂度 ``O(mn)``，表空间 ``O(mn)``；记忆化还使用 ``O(m+n)`` 递归栈。

九语言实现
----------

以下实现统一使用自底向上动态规划。

C
~

.. code-block:: c

   #include <stdbool.h>
   #include <stdlib.h>
   #include <string.h>

   bool isMatch(char* s, char* p) {
       int m = (int)strlen(s), n = (int)strlen(p);
       bool* dp = calloc((size_t)(m + 1) * (n + 1), sizeof(bool));
       #define AT(i, j) dp[(i) * (n + 1) + (j)]
       AT(m, n) = true;
       for (int i = m; i >= 0; --i) {
           for (int j = n - 1; j >= 0; --j) {
               bool first = i < m && (p[j] == s[i] || p[j] == '.');
               if (j + 1 < n && p[j + 1] == '*')
                   AT(i, j) = AT(i, j + 2) || (first && AT(i + 1, j));
               else
                   AT(i, j) = first && AT(i + 1, j + 1);
           }
       }
       bool answer = AT(0, 0);
       free(dp);
       return answer;
       #undef AT
   }

Python
~~~~~~

.. code-block:: python

   class Solution:
       def isMatch(self, s: str, p: str) -> bool:
           m, n = len(s), len(p)
           dp = [[False] * (n + 1) for _ in range(m + 1)]
           dp[m][n] = True
           for i in range(m, -1, -1):
               for j in range(n - 1, -1, -1):
                   first = i < m and p[j] in (s[i], ".")
                   if j + 1 < n and p[j + 1] == "*":
                       dp[i][j] = dp[i][j + 2] or (first and dp[i + 1][j])
                   else:
                       dp[i][j] = first and dp[i + 1][j + 1]
           return dp[0][0]

Java
~~~~

.. code-block:: java

   class Solution {
       public boolean isMatch(String s, String p) {
           int m = s.length(), n = p.length();
           boolean[][] dp = new boolean[m + 1][n + 1];
           dp[m][n] = true;
           for (int i = m; i >= 0; --i) {
               for (int j = n - 1; j >= 0; --j) {
                   boolean first = i < m &&
                       (p.charAt(j) == s.charAt(i) || p.charAt(j) == '.');
                   if (j + 1 < n && p.charAt(j + 1) == '*')
                       dp[i][j] = dp[i][j + 2] || (first && dp[i + 1][j]);
                   else
                       dp[i][j] = first && dp[i + 1][j + 1];
               }
           }
           return dp[0][0];
       }
   }

Rust
~~~~

.. code-block:: rust

   impl Solution {
       pub fn is_match(s: String, p: String) -> bool {
           let s = s.as_bytes();
           let p = p.as_bytes();
           let (m, n) = (s.len(), p.len());
           let mut dp = vec![vec![false; n + 1]; m + 1];
           dp[m][n] = true;
           for i in (0..=m).rev() {
               for j in (0..n).rev() {
                   let first = i < m && (p[j] == s[i] || p[j] == b'.');
                   dp[i][j] = if j + 1 < n && p[j + 1] == b'*' {
                       dp[i][j + 2] || (first && dp[i + 1][j])
                   } else {
                       first && dp[i + 1][j + 1]
                   };
               }
           }
           dp[0][0]
       }
   }

Go
~~

.. code-block:: go

   func isMatch(s string, p string) bool {
       m, n := len(s), len(p)
       dp := make([][]bool, m+1)
       for i := range dp { dp[i] = make([]bool, n+1) }
       dp[m][n] = true
       for i := m; i >= 0; i-- {
           for j := n-1; j >= 0; j-- {
               first := i < m && (p[j] == s[i] || p[j] == '.')
               if j+1 < n && p[j+1] == '*' {
                   dp[i][j] = dp[i][j+2] || (first && dp[i+1][j])
               } else {
                   dp[i][j] = first && dp[i+1][j+1]
               }
           }
       }
       return dp[0][0]
   }

TypeScript
~~~~~~~~~~

.. code-block:: typescript

   function isMatch(s: string, p: string): boolean {
       const m = s.length, n = p.length;
       const dp = Array.from({ length: m + 1 }, () => Array(n + 1).fill(false));
       dp[m][n] = true;
       for (let i = m; i >= 0; --i) {
           for (let j = n - 1; j >= 0; --j) {
               const first = i < m && (p[j] === s[i] || p[j] === ".");
               dp[i][j] = j + 1 < n && p[j + 1] === "*"
                   ? dp[i][j + 2] || (first && dp[i + 1][j])
                   : first && dp[i + 1][j + 1];
           }
       }
       return dp[0][0];
   }

C#
~~

.. code-block:: csharp

   public class Solution {
       public bool IsMatch(string s, string p) {
           int m = s.Length, n = p.Length;
           bool[,] dp = new bool[m + 1, n + 1];
           dp[m, n] = true;
           for (int i = m; i >= 0; --i) {
               for (int j = n - 1; j >= 0; --j) {
                   bool first = i < m && (p[j] == s[i] || p[j] == '.');
                   dp[i, j] = j + 1 < n && p[j + 1] == '*'
                       ? dp[i, j + 2] || (first && dp[i + 1, j])
                       : first && dp[i + 1, j + 1];
               }
           }
           return dp[0, 0];
       }
   }

Julia
~~~~~

.. code-block:: julia

   function is_match(s::String, p::String)::Bool
       a, b = collect(s), collect(p)
       m, n = length(a), length(b)
       dp = falses(m + 1, n + 1)
       dp[m + 1, n + 1] = true
       for i in m:-1:0, j in (n - 1):-1:0
           first = i < m && (b[j + 1] == a[i + 1] || b[j + 1] == '.')
           if j + 1 < n && b[j + 2] == '*'
               dp[i + 1, j + 1] = dp[i + 1, j + 3] ||
                   (first && dp[i + 2, j + 1])
           else
               dp[i + 1, j + 1] = first && dp[i + 2, j + 2]
           end
       end
       dp[1, 1]
   end

R
~

.. code-block:: r

   isMatch <- function(s, p) {
       a <- strsplit(s, "", fixed = TRUE)[[1]]
       b <- strsplit(p, "", fixed = TRUE)[[1]]
       m <- length(a); n <- length(b)
       dp <- matrix(FALSE, nrow = m + 1L, ncol = n + 1L)
       dp[m + 1L, n + 1L] <- TRUE
       for (i in m:0) {
           if (n == 0L) next
           for (j in (n - 1L):0) {
               first <- i < m && (b[j + 1L] == a[i + 1L] || b[j + 1L] == ".")
               if (j + 1L < n && b[j + 2L] == "*") {
                   dp[i + 1L, j + 1L] <- dp[i + 1L, j + 3L] ||
                       (first && dp[i + 2L, j + 1L])
               } else {
                   dp[i + 1L, j + 1L] <- first && dp[i + 2L, j + 2L]
               }
           }
       }
       dp[1L, 1L]
   }
