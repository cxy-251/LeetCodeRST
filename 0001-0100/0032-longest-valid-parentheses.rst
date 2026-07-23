0032. Longest Valid Parentheses
===============================

题目信息
--------

:题号: 0032
:难度: Hard
:主题: 字符串、栈、动态规划、双向扫描
:原题: `LeetCode 0032 <https://leetcode.com/problems/longest-valid-parentheses/>`_
:重点: 连续子串、有效圆括号、最长长度、无法跨越失效边界

题目重述
--------

给定一个只包含 ``'('`` 和 ``')'`` 的字符串 ``s``，返回其中最长有效括号连续子串的长度。

有效括号串中的每个左括号都由后面的右括号闭合，并且任意前缀中右括号数量都不超过左括号数量。答案只统计原字符串中的连续片段，不能跳过字符拼接。

``s`` 的长度位于 ``[0, 3 * 10^4]``。

自建示例
--------

合法区间后出现多余右括号：

.. code-block:: text

   输入：s = "(()())())("
   输出：8
   解释：下标 0 到 7 的子串 "(()())()" 有效，长度为 8；后面的多余右括号会终止该连续区间。

最长区间从中间开始：

.. code-block:: text

   输入：s = ")(()())"
   输出：6
   解释：开头的右括号无法参与有效子串，后面的 "(()())" 长度为 6。

不存在配对：

.. code-block:: text

   输入：s = "((("
   输出：0
   解释：没有右括号可以闭合任何左括号。

C++ 实现
--------

.. code-block:: cpp

   #include <algorithm>
   #include <string>
   #include <vector>

   class Solution {
   private:
       int enumerateStarts(const std::string& s) {
           int best = 0;
           for (int start = 0; start < static_cast<int>(s.size()); ++start) {
               int balance = 0;
               for (int end = start; end < static_cast<int>(s.size()); ++end) {
                   balance += s[end] == '(' ? 1 : -1;
                   if (balance < 0) break;
                   if (balance == 0) best = std::max(best, end - start + 1);
               }
           }
           return best;
       }

       int indexStack(const std::string& s) {
           std::vector<int> stack{-1};
           int best = 0;
           for (int i = 0; i < static_cast<int>(s.size()); ++i) {
               if (s[i] == '(') {
                   stack.push_back(i);
               } else {
                   stack.pop_back();
                   if (stack.empty()) {
                       stack.push_back(i);
                   } else {
                       best = std::max(best, i - stack.back());
                   }
               }
           }
           return best;
       }

       int dynamicProgramming(const std::string& s) {
           std::vector<int> dp(s.size(), 0);
           int best = 0;
           for (int i = 1; i < static_cast<int>(s.size()); ++i) {
               if (s[i] == '(') continue;
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

       int bidirectionalCounters(const std::string& s) {
           int best = 0;
           int left = 0, right = 0;
           for (char c : s) {
               c == '(' ? ++left : ++right;
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

枚举起点为什么达到平方时间
~~~~~~~~~~~~~~~~~~~~~~~~~~

固定每个起点向右维护括号余额，余额为零时得到有效候选，负数时后续无法修复当前起点。不同起点仍重复扫描相同后缀，
最坏 ``O(n^2)``。

下标栈如何记录最近不可跨越边界
~~~~~~~~~~~~~~~~~~~~~~~~~~~~

栈保存未匹配左括号下标，底部还保存最近一个无法匹配的右括号位置。初始哨兵 ``-1`` 表示字符串开始前的边界。

遇到左括号入栈；遇到右括号先弹出：

* 弹出后栈非空，当前有效后缀长度为 ``i - stack.back()``；
* 弹出后栈空，当前右括号无法匹配，把它作为新的失效边界入栈。

为什么栈顶之后的区间必然有效
~~~~~~~~~~~~~~~~~~~~~~~~~~~~

右括号成功匹配后，栈顶要么是更早未匹配左括号，要么是失效右括号边界。当前匹配已经清除了栈顶之后的全部未闭合
左括号，因此 ``(stack.back(), i]`` 是以 ``i`` 结束的最长有效后缀。

动态规划状态如何直接保存以当前位置结束的答案
~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

定义 ``dp[i]`` 为以 ``s[i]`` 结束的最长有效子串长度。左括号不能结束有效串，所以其值为 0。右括号有两种情况：

#. 前一字符是左括号：形成 ``()``，再接上 ``dp[i-2]``；
#. 前一字符是右括号：跳过 ``dp[i-1]`` 覆盖的有效段，检查位置 ``i-dp[i-1]-1`` 是否是可配对左括号。

第二种情况下还要加上该左括号之前紧邻的有效段 ``dp[opening-1]``，才能连接嵌套段与前置段。

状态演化
~~~~~~~~

对 ``()(())``：

.. list-table::
   :header-rows: 1

   * - ``i``
     - 字符
     - ``dp[i]``
     - 来源
   * - 0
     - ``(``
     - 0
     - 不能结束有效串
   * - 1
     - ``)``
     - 2
     - ``()``
   * - 2
     - ``(``
     - 0
     - 不能结束有效串
   * - 3
     - ``(``
     - 0
     - 不能结束有效串
   * - 4
     - ``)``
     - 2
     - 内层 ``()``
   * - 5
     - ``)``
     - 6
     - 配对位置 2，再连接 ``dp[1]=2``

为什么转移不会跨越无效字符
~~~~~~~~~~~~~~~~~~~~~~~~~~

``dp[i-1]`` 只描述紧贴 ``i-1`` 结束的有效段。跳过该段后检查的 ``opening`` 是当前右括号唯一可能连接的左边界；若
它不存在或不是左括号，``dp[i]`` 保持零。连接 ``dp[opening-1]`` 也只吸收紧邻左边界之前的有效段，不跨越间隔。

双向计数为什么需要两个方向
~~~~~~~~~~~~~~~~~~~~~~~~~~

左到右扫描在右括号过多时重置，能识别所有不被多余右括号截断的有效段，但无法处理末尾多余左括号。右到左对称扫描
在左括号过多时重置，补足这些情况。两次都在左右计数相等时更新长度。

复杂度来源
~~~~~~~~~~

栈与动态规划均为 ``O(n)`` 时间、``O(n)`` 空间。双向计数为 ``O(n)`` 时间、``O(1)`` 空间。本文标准入口采用
动态规划，因为状态明确给出每个结束位置的最长有效长度。

九语言实现
----------

C
~

.. code-block:: c

   int longestValidParentheses(char* s) {
       int n=(int)strlen(s),best=0;int* dp=calloc((size_t)n,sizeof(int));
       for(int i=1;i<n;i++)if(s[i]==')'){
           if(s[i-1]=='(')dp[i]=2+(i>=2?dp[i-2]:0);
           else{int opening=i-dp[i-1]-1;if(opening>=0&&s[opening]=='(')dp[i]=dp[i-1]+2+(opening>=1?dp[opening-1]:0);}
           if(dp[i]>best)best=dp[i];
       }
       free(dp);return best;
   }

Python
~~~~~~

.. code-block:: python

   class Solution:
       def longestValidParentheses(self, s: str) -> int:
           dp=[0]*len(s);best=0
           for i in range(1,len(s)):
               if s[i]==")":
                   if s[i-1]=="(": dp[i]=2+(dp[i-2] if i>=2 else 0)
                   else:
                       opening=i-dp[i-1]-1
                       if opening>=0 and s[opening]=="(":
                           dp[i]=dp[i-1]+2+(dp[opening-1] if opening>=1 else 0)
                   best=max(best,dp[i])
           return best

Java
~~~~

.. code-block:: java

   class Solution {
       public int longestValidParentheses(String s){
           int[] dp=new int[s.length()];int best=0;
           for(int i=1;i<s.length();i++)if(s.charAt(i)==')'){
               if(s.charAt(i-1)=='(')dp[i]=2+(i>=2?dp[i-2]:0);
               else{int opening=i-dp[i-1]-1;if(opening>=0&&s.charAt(opening)=='(')dp[i]=dp[i-1]+2+(opening>=1?dp[opening-1]:0);}
               best=Math.max(best,dp[i]);
           }return best;
       }
   }

Rust
~~~~

.. code-block:: rust

   impl Solution {
       pub fn longest_valid_parentheses(s:String)->i32{
           let s=s.as_bytes();let mut dp=vec![0usize;s.len()];let mut best=0;
           for i in 1..s.len(){if s[i]==b')'{if s[i-1]==b'(' {dp[i]=2+if i>=2{dp[i-2]}else{0};}else if i>dp[i-1]{let opening=i-dp[i-1]-1;if s[opening]==b'(' {dp[i]=dp[i-1]+2+if opening>=1{dp[opening-1]}else{0};}}best=best.max(dp[i]);}}best as i32
       }
   }

Go
~~

.. code-block:: go

   func longestValidParentheses(s string)int{
       dp:=make([]int,len(s));best:=0
       for i:=1;i<len(s);i++{if s[i]==')'{if s[i-1]=='(' {dp[i]=2;if i>=2{dp[i]+=dp[i-2]}}else{opening:=i-dp[i-1]-1;if opening>=0&&s[opening]=='(' {dp[i]=dp[i-1]+2;if opening>=1{dp[i]+=dp[opening-1]}}};if dp[i]>best{best=dp[i]}}};return best
   }

TypeScript
~~~~~~~~~~

.. code-block:: typescript

   function longestValidParentheses(s:string):number{
       const dp=new Array(s.length).fill(0);let best=0;
       for(let i=1;i<s.length;i++)if(s[i]===")"){if(s[i-1]==="(")dp[i]=2+(i>=2?dp[i-2]:0);else{const opening=i-dp[i-1]-1;if(opening>=0&&s[opening]==="(")dp[i]=dp[i-1]+2+(opening>=1?dp[opening-1]:0);}best=Math.max(best,dp[i]);}return best;
   }

C#
~~

.. code-block:: csharp

   public class Solution {
       public int LongestValidParentheses(string s){
           int[] dp=new int[s.Length];int best=0;
           for(int i=1;i<s.Length;i++)if(s[i]==')'){if(s[i-1]=='(')dp[i]=2+(i>=2?dp[i-2]:0);else{int opening=i-dp[i-1]-1;if(opening>=0&&s[opening]=='(')dp[i]=dp[i-1]+2+(opening>=1?dp[opening-1]:0);}best=Math.Max(best,dp[i]);}return best;
       }
   }

Julia
~~~~~

.. code-block:: julia

   function longest_valid_parentheses(s::String)
       chars=collect(s);dp=zeros(Int,length(chars));best=0
       for i in 2:length(chars)
           if chars[i]==')'
               if chars[i-1]=='(';dp[i]=2+(i>=3 ? dp[i-2] : 0)
               else;opening=i-dp[i-1]-1;if opening>=1&&chars[opening]=='(';dp[i]=dp[i-1]+2+(opening>=2 ? dp[opening-1] : 0);end;end
               best=max(best,dp[i])
           end
       end;best
   end

R
~

.. code-block:: r

   longest_valid_parentheses <- function(s) {
       chars<-strsplit(s,"",fixed=TRUE)[[1]];n<-length(chars);dp<-integer(n);best<-0L
       if(n>=2L)for(i in 2:n)if(chars[[i]]==")"){
           if(chars[[i-1L]]=="(")dp[[i]]<-2L+if(i>=3L)dp[[i-2L]]else 0L
           else{opening<-i-dp[[i-1L]]-1L;if(opening>=1L&&chars[[opening]]=="(")dp[[i]]<-dp[[i-1L]]+2L+if(opening>=2L)dp[[opening-1L]]else 0L}
           best<-max(best,dp[[i]])
       };best
   }