0010. Regular Expression Matching
=================================

题目信息
--------

* 原题：`LeetCode 10 <https://leetcode.com/problems/regular-expression-matching/>`_
* 难度：Hard

题目重述
--------

实现一个只包含普通字符、``.`` 和 ``*`` 的完整字符串匹配器。``.`` 可以匹配任意单个字符；``*`` 表示它前面的元素可以重复零次或多次。匹配必须覆盖整个输入字符串，而不是只匹配其中一段。

问题抽象
--------

令 ``dp[i][j]`` 表示 ``s`` 的前 ``i`` 个字符是否能被 ``p`` 的前 ``j`` 个字符完整匹配。

若 ``p[j-1]`` 不是 ``*``，当前字符能匹配时有：

``dp[i][j] = dp[i-1][j-1]``。

若 ``p[j-1]`` 是 ``*``，它与前一个模式字符组成一个整体：

* 重复零次：``dp[i][j-2]``；
* 重复至少一次：当前字符能匹配 ``p[j-2]``，并且 ``dp[i-1][j]`` 为真。

主解法：二维动态规划
--------------------

初始化 ``dp[0][0] = true``。空字符串只能被形如 ``a*b*c*`` 的模式匹配，因此对空字符串单独初始化星号列。

核心不变量：计算 ``dp[i][j]`` 时，它依赖的更短字符串状态、或更短模式状态都已经完成。

正确性依据
~~~~~~~~~~

非星号模式必须消耗输入和模式各一个字符，因此唯一来源是左上状态。星号模式的所有合法匹配可按重复次数分成零次和至少一次两类：零次删除 ``x*``；至少一次先让 ``x`` 匹配当前字符，再保留同一个 ``x*`` 去匹配更短输入。两类互斥且覆盖全部情况，所以转移完整。

复杂度
~~~~~~

设字符串长度为 ``m``，模式长度为 ``n``。时间复杂度为 ``O(mn)``，空间复杂度为 ``O(mn)``。

C
~

.. code-block:: c

   bool isMatch(char *s, char *p) {
       int m = strlen(s), n = strlen(p);
       bool dp[m + 1][n + 1];
       memset(dp, 0, sizeof(dp));
       dp[0][0] = true;
       for (int j = 2; j <= n; ++j)
           if (p[j - 1] == '*') dp[0][j] = dp[0][j - 2];
       for (int i = 1; i <= m; ++i) {
           for (int j = 1; j <= n; ++j) {
               if (p[j - 1] != '*') {
                   bool same = p[j - 1] == '.' || p[j - 1] == s[i - 1];
                   dp[i][j] = same && dp[i - 1][j - 1];
               } else if (j >= 2) {
                   bool same = p[j - 2] == '.' || p[j - 2] == s[i - 1];
                   dp[i][j] = dp[i][j - 2] || (same && dp[i - 1][j]);
               }
           }
       }
       return dp[m][n];
   }

C++
~~~

.. code-block:: cpp

   class Solution {
   public:
       bool isMatch(string s, string p) {
           int m = s.size(), n = p.size();
           vector<vector<bool>> dp(m + 1, vector<bool>(n + 1));
           dp[0][0] = true;
           for (int j = 2; j <= n; ++j)
               if (p[j - 1] == '*') dp[0][j] = dp[0][j - 2];
           for (int i = 1; i <= m; ++i)
               for (int j = 1; j <= n; ++j)
                   if (p[j - 1] != '*') {
                       bool same = p[j - 1] == '.' || p[j - 1] == s[i - 1];
                       dp[i][j] = same && dp[i - 1][j - 1];
                   } else if (j >= 2) {
                       bool same = p[j - 2] == '.' || p[j - 2] == s[i - 1];
                       dp[i][j] = dp[i][j - 2] || (same && dp[i - 1][j]);
                   }
           return dp[m][n];
       }
   };

Python
~~~~~~

.. code-block:: python

   class Solution:
       def isMatch(self, s: str, p: str) -> bool:
           m, n = len(s), len(p)
           dp = [[False] * (n + 1) for _ in range(m + 1)]
           dp[0][0] = True
           for j in range(2, n + 1):
               if p[j - 1] == "*":
                   dp[0][j] = dp[0][j - 2]
           for i in range(1, m + 1):
               for j in range(1, n + 1):
                   if p[j - 1] != "*":
                       same = p[j - 1] in (".", s[i - 1])
                       dp[i][j] = same and dp[i - 1][j - 1]
                   elif j >= 2:
                       same = p[j - 2] in (".", s[i - 1])
                       dp[i][j] = dp[i][j - 2] or (same and dp[i - 1][j])
           return dp[m][n]

Java
~~~~

.. code-block:: java

   class Solution {
       public boolean isMatch(String s, String p) {
           int m = s.length(), n = p.length(); boolean[][] dp = new boolean[m + 1][n + 1];
           dp[0][0] = true;
           for (int j = 2; j <= n; j++) if (p.charAt(j - 1) == '*') dp[0][j] = dp[0][j - 2];
           for (int i = 1; i <= m; i++) for (int j = 1; j <= n; j++) {
               if (p.charAt(j - 1) != '*') {
                   boolean same = p.charAt(j - 1) == '.' || p.charAt(j - 1) == s.charAt(i - 1);
                   dp[i][j] = same && dp[i - 1][j - 1];
               } else if (j >= 2) {
                   boolean same = p.charAt(j - 2) == '.' || p.charAt(j - 2) == s.charAt(i - 1);
                   dp[i][j] = dp[i][j - 2] || same && dp[i - 1][j];
               }
           }
           return dp[m][n];
       }
   }

Rust
~~~~

.. code-block:: rust

   impl Solution {
       pub fn is_match(s: String, p: String) -> bool {
           let (s, p) = (s.as_bytes(), p.as_bytes());
           let (m, n) = (s.len(), p.len());
           let mut dp = vec![vec![false; n + 1]; m + 1]; dp[0][0] = true;
           for j in 2..=n { if p[j - 1] == b'*' { dp[0][j] = dp[0][j - 2]; } }
           for i in 1..=m { for j in 1..=n {
               if p[j - 1] != b'*' {
                   let same = p[j - 1] == b'.' || p[j - 1] == s[i - 1];
                   dp[i][j] = same && dp[i - 1][j - 1];
               } else if j >= 2 {
                   let same = p[j - 2] == b'.' || p[j - 2] == s[i - 1];
                   dp[i][j] = dp[i][j - 2] || same && dp[i - 1][j];
               }
           }} dp[m][n]
       }
   }

Go
~~

.. code-block:: go

   func isMatch(s string, p string) bool {
       m, n := len(s), len(p); dp := make([][]bool, m+1)
       for i := range dp { dp[i] = make([]bool, n+1) }; dp[0][0] = true
       for j := 2; j <= n; j++ { if p[j-1] == '*' { dp[0][j] = dp[0][j-2] } }
       for i := 1; i <= m; i++ { for j := 1; j <= n; j++ {
           if p[j-1] != '*' { same := p[j-1] == '.' || p[j-1] == s[i-1]; dp[i][j] = same && dp[i-1][j-1]
           } else if j >= 2 { same := p[j-2] == '.' || p[j-2] == s[i-1]; dp[i][j] = dp[i][j-2] || same && dp[i-1][j] }
       }}; return dp[m][n]
   }

TypeScript
~~~~~~~~~~

.. code-block:: typescript

   function isMatch(s: string, p: string): boolean {
       const m = s.length, n = p.length;
       const dp = Array.from({ length: m + 1 }, () => Array(n + 1).fill(false));
       dp[0][0] = true;
       for (let j = 2; j <= n; j++) if (p[j - 1] === "*") dp[0][j] = dp[0][j - 2];
       for (let i = 1; i <= m; i++) for (let j = 1; j <= n; j++) {
           if (p[j - 1] !== "*") { const same = p[j - 1] === "." || p[j - 1] === s[i - 1]; dp[i][j] = same && dp[i - 1][j - 1]; }
           else if (j >= 2) { const same = p[j - 2] === "." || p[j - 2] === s[i - 1]; dp[i][j] = dp[i][j - 2] || same && dp[i - 1][j]; }
       }
       return dp[m][n];
   }

C#
~~

.. code-block:: csharp

   public class Solution {
       public bool IsMatch(string s, string p) {
           int m = s.Length, n = p.Length; bool[,] dp = new bool[m + 1, n + 1]; dp[0, 0] = true;
           for (int j = 2; j <= n; j++) if (p[j - 1] == '*') dp[0, j] = dp[0, j - 2];
           for (int i = 1; i <= m; i++) for (int j = 1; j <= n; j++) {
               if (p[j - 1] != '*') { bool same = p[j - 1] == '.' || p[j - 1] == s[i - 1]; dp[i, j] = same && dp[i - 1, j - 1]; }
               else if (j >= 2) { bool same = p[j - 2] == '.' || p[j - 2] == s[i - 1]; dp[i, j] = dp[i, j - 2] || same && dp[i - 1, j]; }
           }
           return dp[m, n];
       }
   }

Julia
~~~~~

.. code-block:: julia

   function ismatch(s::String, p::String)::Bool
       ss, pp = collect(s), collect(p); m, n = length(ss), length(pp)
       dp = falses(m + 1, n + 1); dp[1, 1] = true
       for j in 2:n; pp[j] == '*' && (dp[1, j + 1] = dp[1, j - 1]); end
       for i in 1:m, j in 1:n
           if pp[j] != '*'; same = pp[j] == '.' || pp[j] == ss[i]; dp[i + 1, j + 1] = same && dp[i, j]
           elseif j >= 2; same = pp[j - 1] == '.' || pp[j - 1] == ss[i]; dp[i + 1, j + 1] = dp[i + 1, j - 1] || same && dp[i, j + 1]
           end
       end
       return dp[m + 1, n + 1]
   end

R
~

.. code-block:: r

   is_match <- function(s, p) {
     ss <- strsplit(s, "", fixed = TRUE)[[1]]; pp <- strsplit(p, "", fixed = TRUE)[[1]]
     m <- length(ss); n <- length(pp); dp <- matrix(FALSE, m + 1, n + 1); dp[1, 1] <- TRUE
     if (n >= 2) for (j in 2:n) if (pp[j] == "*") dp[1, j + 1] <- dp[1, j - 1]
     if (m >= 1 && n >= 1) for (i in 1:m) for (j in 1:n) {
       if (pp[j] != "*") { same <- pp[j] == "." || pp[j] == ss[i]; dp[i + 1, j + 1] <- same && dp[i, j] }
       else if (j >= 2) { same <- pp[j - 1] == "." || pp[j - 1] == ss[i]; dp[i + 1, j + 1] <- dp[i + 1, j - 1] || same && dp[i, j + 1] }
     }
     dp[m + 1, n + 1]
   }

易错点
------

* ``*`` 修饰前一个模式元素，不能独立消费字符。
* 星号重复至少一次时，模式下标保持不变。
* 必须初始化空字符串与 ``x*`` 组合的匹配状态。
* 本题要求完整匹配，不能使用“找到任意匹配子串”的语义。

自检
----

#. ``a*`` 为什么能匹配空字符串？
#. 为什么重复至少一次使用 ``dp[i-1][j]`` 而不是 ``dp[i-1][j-2]``？
#. ``.*`` 为什么能匹配任意字符串？

答案要点：星号可以取零次；消费一个字符后仍可继续使用同一个星号组合；点号匹配任意单字符，星号允许重复任意次数。