0032. Longest Valid Parentheses
===============================

题目信息
--------

:题号: 0032
:题名: Longest Valid Parentheses
:难度: Hard
:类型: Algorithms
:主题: 字符串、动态规划、栈、双向扫描
:原题: `LeetCode 0032 <https://leetcode.com/problems/longest-valid-parentheses/>`_
:教学重点: 连续区间、结尾状态、匹配前驱、失效边界、双向计数

题目重述
--------

给定只包含 ``'('`` 与 ``')'`` 的字符串，返回最长连续合法括号子串的长度。结果必须来自连续区间，不能跳过字符重新拼接。

自建示例
--------

.. code-block:: text

   s = ")()())"
   最长合法子串是下标 1..4 的 "()()"，长度 4。

.. code-block:: text

   s = "()(())("
   前六个字符可由相邻合法段和嵌套合法段连接为整体，答案 6。

C++ 实现
--------

.. code-block:: cpp

   #include <algorithm>
   #include <stack>
   #include <string>
   #include <vector>

   class Solution {
   private:
       bool validRange(const std::string& s, int left, int right) {
           int balance = 0;
           for (int i = left; i <= right; ++i) {
               balance += s[i] == '(' ? 1 : -1;
               if (balance < 0) return false;
           }
           return balance == 0;
       }

       int bruteForce(const std::string& s) {
           int best = 0;
           for (int left = 0; left < static_cast<int>(s.size()); ++left)
               for (int right = left + 1; right < static_cast<int>(s.size()); right += 2)
                   if (validRange(s, left, right)) best = std::max(best, right - left + 1);
           return best;
       }

       int dynamicProgramming(const std::string& s) {
           std::vector<int> dp(s.size(), 0);
           int best = 0;
           for (int i = 1; i < static_cast<int>(s.size()); ++i) {
               if (s[i] != ')') continue;
               if (s[i - 1] == '(') {
                   dp[i] = 2 + (i >= 2 ? dp[i - 2] : 0);
               } else {
                   int opening = i - dp[i - 1] - 1;
                   if (opening >= 0 && s[opening] == '(') {
                       dp[i] = dp[i - 1] + 2 + (opening >= 1 ? dp[opening - 1] : 0);
                   }
               }
               best = std::max(best, dp[i]);
           }
           return best;
       }

       int indexStack(const std::string& s) {
           std::stack<int> boundaries;
           boundaries.push(-1);
           int best = 0;
           for (int i = 0; i < static_cast<int>(s.size()); ++i) {
               if (s[i] == '(') {
                   boundaries.push(i);
               } else {
                   boundaries.pop();
                   if (boundaries.empty()) boundaries.push(i);
                   else best = std::max(best, i - boundaries.top());
               }
           }
           return best;
       }

       int bidirectionalCounts(const std::string& s) {
           int best = 0, left = 0, right = 0;
           for (char ch : s) {
               ch == '(' ? ++left : ++right;
               if (left == right) best = std::max(best, 2 * right);
               else if (right > left) left = right = 0;
           }
           left = right = 0;
           for (int i = static_cast<int>(s.size()) - 1; i >= 0; --i) {
               s[i] == '(' ? ++left : ++right;
               if (left == right) best = std::max(best, 2 * left);
               else if (left > right) left = right = 0;
           }
           return best;
       }

   public:
       int longestValidParentheses(std::string s) {
           return dynamicProgramming(s);
       }
   };

题解
----

区间枚举为什么重复验证
~~~~~~~~~~~~~~~~~~~~~~

暴力方法枚举所有偶数长度区间，再从头计算平衡值。相邻区间会反复扫描同一字符。优化方向是让状态描述“已经验证完成的连续合法后缀”，使新右括号只查询前面少量位置。

``dp[i]`` 为什么表示以 i 结尾的最长合法长度
~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

左括号不能成为合法串末尾，因此只有 ``s[i] == ')'`` 才可能令 ``dp[i]`` 非零。固定结尾后，最右侧右括号只有两种匹配结构。

相邻括号分支
~~~~~~~~~~~~

若 ``s[i-1] == '('``，末尾新增一对 ``()``。它可以接在 ``i-2`` 结尾的合法后缀之后：

.. math::

   dp[i]=2+(i\ge2?dp[i-2]:0)

嵌套与拼接分支
~~~~~~~~~~~~~~

若 ``s[i-1] == ')'``，前面已有长度 ``dp[i-1]`` 的合法段。它左边紧邻位置
``opening = i - dp[i-1] - 1`` 必须是 ``'('``，才能与当前右括号配对。配对后还要把 ``opening-1`` 结尾的合法段拼接进来：

.. math::

   dp[i]=dp[i-1]+2+dp[opening-1]

最后一项正是 ``()(())`` 这类“前段 + 新闭合段”能够合并为更长连续区间的原因。

状态演化
~~~~~~~~

.. list-table::
   :header-rows: 1

   * - ``i``
     - 字符
     - 结构
     - ``dp[i]``
   * - 1
     - ``)``
     - ``()``
     - 2
   * - 3
     - ``(``
     - 不能结尾
     - 0
   * - 4
     - ``)``
     - 内层 ``()``
     - 2
   * - 5
     - ``)``
     - 闭合 ``(())`` 并拼接前面的 ``()``
     - 6

下标栈如何保存最近阻断位置
~~~~~~~~~~~~~~~~~~~~~~~~~~

栈底初始为 ``-1``，其余元素是未匹配左括号下标。右括号弹栈后，若栈非空，新栈顶就是当前合法后缀左侧最近阻断位置，长度为 ``i - top``；若栈空，当前右括号无法匹配，它成为新的阻断边界。

双向计数为什么需要扫描两次
~~~~~~~~~~~~~~~~~~~~~~~~~~

从左向右计数时，右括号多于左括号就可重置，但无法处理末尾多余左括号；反向扫描使用对称规则，在左括号多于右括号时重置。两次扫描共同覆盖两种不平衡方向，并把额外空间降为常数。

为什么 DP 不会遗漏最长区间
~~~~~~~~~~~~~~~~~~~~~~~~~~

任意合法子串都以右括号结束。处理它的末位时，末尾要么直接形成 ``()``，要么闭合一个此前已合法的后缀；两种转移完整覆盖。``dp[i]`` 还合并紧邻左侧合法段，因此记录的是以 ``i`` 结尾的最长连续合法串。对所有结尾取最大值即为全局答案。

复杂度来源
~~~~~~~~~~

暴力方法最坏 ``O(n^3)``。动态规划和下标栈均为 ``O(n)`` 时间、``O(n)`` 空间；双向计数为 ``O(n)`` 时间、``O(1)`` 空间。标准入口采用动态规划，因为状态转移最直接展示区间如何连接。

九语言实现
----------

C
~

.. code-block:: c

   int longestValidParentheses(char *s) {
       int n = (int)strlen(s), best = 0;
       int *dp = calloc((size_t)n, sizeof(int));
       for (int i = 1; i < n; ++i) if (s[i] == ')') {
           if (s[i - 1] == '(') dp[i] = 2 + (i >= 2 ? dp[i - 2] : 0);
           else {
               int opening = i - dp[i - 1] - 1;
               if (opening >= 0 && s[opening] == '(')
                   dp[i] = dp[i - 1] + 2 + (opening >= 1 ? dp[opening - 1] : 0);
           }
           if (dp[i] > best) best = dp[i];
       }
       free(dp); return best;
   }

Python
~~~~~~

.. code-block:: python

   class Solution:
       def longestValidParentheses(self, s: str) -> int:
           dp = [0] * len(s)
           best = 0
           for i in range(1, len(s)):
               if s[i] != ")":
                   continue
               if s[i - 1] == "(":
                   dp[i] = 2 + (dp[i - 2] if i >= 2 else 0)
               else:
                   opening = i - dp[i - 1] - 1
                   if opening >= 0 and s[opening] == "(":
                       dp[i] = dp[i - 1] + 2 + (dp[opening - 1] if opening >= 1 else 0)
               best = max(best, dp[i])
           return best

Java
~~~~

.. code-block:: java

   class Solution {
       public int longestValidParentheses(String s) {
           int[] dp = new int[s.length()]; int best = 0;
           for (int i = 1; i < s.length(); i++) if (s.charAt(i) == ')') {
               if (s.charAt(i - 1) == '(') dp[i] = 2 + (i >= 2 ? dp[i - 2] : 0);
               else {
                   int opening = i - dp[i - 1] - 1;
                   if (opening >= 0 && s.charAt(opening) == '(')
                       dp[i] = dp[i - 1] + 2 + (opening >= 1 ? dp[opening - 1] : 0);
               }
               best = Math.max(best, dp[i]);
           }
           return best;
       }
   }

Rust
~~~~

.. code-block:: rust

   impl Solution {
       pub fn longest_valid_parentheses(s: String) -> i32 {
           let bytes = s.as_bytes(); let mut dp = vec![0usize; bytes.len()]; let mut best = 0usize;
           for i in 1..bytes.len() { if bytes[i] == b')' {
               if bytes[i - 1] == b'(' { dp[i] = 2 + if i >= 2 { dp[i - 2] } else { 0 }; }
               else if i >= dp[i - 1] + 1 {
                   let opening = i - dp[i - 1] - 1;
                   if bytes[opening] == b'(' { dp[i] = dp[i - 1] + 2 + if opening >= 1 { dp[opening - 1] } else { 0 }; }
               }
               best = best.max(dp[i]);
           }}
           best as i32
       }
   }

Go
~~

.. code-block:: go

   func longestValidParentheses(s string) int {
       dp := make([]int, len(s)); best := 0
       for i := 1; i < len(s); i++ { if s[i] == ')' {
           if s[i-1] == '(' { dp[i] = 2; if i >= 2 { dp[i] += dp[i-2] } } else {
               opening := i - dp[i-1] - 1
               if opening >= 0 && s[opening] == '(' { dp[i] = dp[i-1] + 2; if opening >= 1 { dp[i] += dp[opening-1] } }
           }
           if dp[i] > best { best = dp[i] }
       }}
       return best
   }

TypeScript
~~~~~~~~~~

.. code-block:: typescript

   function longestValidParentheses(s: string): number {
       const dp = new Array<number>(s.length).fill(0); let best = 0;
       for (let i = 1; i < s.length; i++) if (s[i] === ")") {
           if (s[i - 1] === "(") dp[i] = 2 + (i >= 2 ? dp[i - 2] : 0);
           else {
               const opening = i - dp[i - 1] - 1;
               if (opening >= 0 && s[opening] === "(") dp[i] = dp[i - 1] + 2 + (opening >= 1 ? dp[opening - 1] : 0);
           }
           best = Math.max(best, dp[i]);
       }
       return best;
   }

C#
~~

.. code-block:: csharp

   public class Solution {
       public int LongestValidParentheses(string s) {
           int[] dp = new int[s.Length]; int best = 0;
           for (int i = 1; i < s.Length; i++) if (s[i] == ')') {
               if (s[i - 1] == '(') dp[i] = 2 + (i >= 2 ? dp[i - 2] : 0);
               else {
                   int opening = i - dp[i - 1] - 1;
                   if (opening >= 0 && s[opening] == '(') dp[i] = dp[i - 1] + 2 + (opening >= 1 ? dp[opening - 1] : 0);
               }
               best = System.Math.Max(best, dp[i]);
           }
           return best;
       }
   }

Julia
~~~~~

.. code-block:: julia

   function longest_valid_parentheses(s::String)
       chars = collect(s); dp = zeros(Int, length(chars)); best = 0
       for i in 2:length(chars)
           chars[i] == ')' || continue
           if chars[i - 1] == '('
               dp[i] = 2 + (i >= 3 ? dp[i - 2] : 0)
           else
               opening = i - dp[i - 1] - 1
               if opening >= 1 && chars[opening] == '('
                   dp[i] = dp[i - 1] + 2 + (opening >= 2 ? dp[opening - 1] : 0)
               end
           end
           best = max(best, dp[i])
       end
       best
   end

R
~

.. code-block:: r

   longest_valid_parentheses <- function(s) {
     chars <- strsplit(s, "", fixed = TRUE)[[1]]; n <- length(chars)
     if (n == 0L) return(0L)
     dp <- integer(n); best <- 0L
     if (n >= 2L) for (i in 2:n) if (chars[[i]] == ")") {
       if (chars[[i - 1L]] == "(") dp[[i]] <- 2L + if (i >= 3L) dp[[i - 2L]] else 0L
       else {
         opening <- i - dp[[i - 1L]] - 1L
         if (opening >= 1L && chars[[opening]] == "(") dp[[i]] <- dp[[i - 1L]] + 2L + if (opening >= 2L) dp[[opening - 1L]] else 0L
       }
       best <- max(best, dp[[i]])
     }
     best
   }