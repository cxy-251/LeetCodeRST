0044. Wildcard Matching
=======================

题目信息
--------

:题号: 0044
:难度: Hard
:主题: 字符串、动态规划、贪心、受控回退
:原题: `LeetCode 0044 <https://leetcode.com/problems/wildcard-matching/>`_
:重点: 问号单字符、星号任意长度、最近星号回退、整串匹配

题目重述
--------

判断模式 ``p`` 是否匹配整个字符串 ``s``。普通字符只能匹配自身，``?`` 恰好匹配一个字符，``*`` 可以匹配任意长度序列，包括空串。字符串和模式都必须被完整消费。

自建示例
--------

.. code-block:: text

   s = "adceb", p = "*a*b" -> true
   s = "acdcb", p = "a*c?b" -> false
   s = "abefcdgiescdfimde", p = "ab*cd?i*de" -> true

最后一例需要在后续失配时多次扩大前一个星号的覆盖范围。

C++ 实现
--------

.. code-block:: cpp

   #include <string>
   #include <vector>

   class Solution {
   private:
       bool recursive(const std::string& s, const std::string& p, int i, int j) {
           if (j == static_cast<int>(p.size())) return i == static_cast<int>(s.size());
           if (p[j] == '*') {
               return recursive(s, p, i, j + 1) ||
                      (i < static_cast<int>(s.size()) && recursive(s, p, i + 1, j));
           }
           bool first = i < static_cast<int>(s.size()) && (p[j] == '?' || p[j] == s[i]);
           return first && recursive(s, p, i + 1, j + 1);
       }

       bool dynamicProgramming(const std::string& s, const std::string& p) {
           std::vector<std::vector<char>> dp(s.size() + 1, std::vector<char>(p.size() + 1, false));
           dp[0][0] = true;
           for (int j = 1; j <= static_cast<int>(p.size()); ++j)
               if (p[j - 1] == '*') dp[0][j] = dp[0][j - 1];
           for (int i = 1; i <= static_cast<int>(s.size()); ++i) {
               for (int j = 1; j <= static_cast<int>(p.size()); ++j) {
                   if (p[j - 1] == '*') dp[i][j] = dp[i][j - 1] || dp[i - 1][j];
                   else if (p[j - 1] == '?' || p[j - 1] == s[i - 1]) dp[i][j] = dp[i - 1][j - 1];
               }
           }
           return dp[s.size()][p.size()];
       }

       bool greedy(const std::string& s, const std::string& p) {
           int i = 0, j = 0;
           int star = -1, matched_after_star = -1;
           while (i < static_cast<int>(s.size())) {
               if (j < static_cast<int>(p.size()) && (p[j] == '?' || p[j] == s[i])) {
                   ++i; ++j;
               } else if (j < static_cast<int>(p.size()) && p[j] == '*') {
                   star = j++;
                   matched_after_star = i;
               } else if (star != -1) {
                   j = star + 1;
                   i = ++matched_after_star;
               } else {
                   return false;
               }
           }
           while (j < static_cast<int>(p.size()) && p[j] == '*') ++j;
           return j == static_cast<int>(p.size());
       }

   public:
       bool isMatch(std::string s, std::string p) {
           return greedy(s, p);
       }
   };

题解
----

星号为什么产生两个递归分支
~~~~~~~~~~~~~~~~~~~~~~~~~~

状态 ``match(i,j)`` 表示两个后缀是否匹配。普通字符和 ``?`` 只能同时推进；``*`` 有两种选择：匹配空串并推进模式，或吞掉一个字符串字符并保留星号。直接递归会反复访问相同状态，最坏指数级。

动态规划如何保存所有分配可能
~~~~~~~~~~~~~~~~~~~~~~~~~~~~

``dp[i][j]`` 表示前 ``i`` 个字符串字符与前 ``j`` 个模式字符是否匹配。星号转移为：

.. code-block:: text

   dp[i][j] = dp[i][j-1]     # 星号匹配空串
           or dp[i-1][j]     # 星号再匹配一个字符

普通字符或问号匹配时继承 ``dp[i-1][j-1]``。空字符串只能被连续星号匹配。

贪心保存哪两个星号状态
~~~~~~~~~~~~~~~~~~~~~~

线性状态方法保存最近一次看到的星号下标 ``star``，以及该星号当前已经覆盖到的字符串末端 ``matched_after_star``。首次遇到星号时先让它匹配空串；若后续普通匹配失败，就回到星号之后，并让该星号比上次多覆盖一个字符。

为什么只需要最近的星号
~~~~~~~~~~~~~~~~~~~~~~

模式在最近星号之前的部分已经与字符串某个前缀成功对齐。若后续失败，扩大最近星号即可改变星号之后的对齐起点；更早星号的调整也只会改变传递到最近星号之前的长度，而最近星号已经能吸收任意额外字符，因此无需保存完整回溯栈。

受控回退过程
~~~~~~~~~~~~

.. list-table::
   :header-rows: 1

   * - 情况
     - 动作
     - 含义
   * - 普通字符或 ``?`` 匹配
     - ``i++``、``j++``
     - 同时消费一位
   * - 遇到 ``*``
     - 记录 ``star``，模式先前进
     - 先假设星号为空
   * - 失配且已有星号
     - 回到 ``star+1``，字符串起点加一
     - 星号多吞一个字符
   * - 失配且没有星号
     - 返回 false
     - 不存在可调整分配

为什么每次扩张不会漏掉更短方案
~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

某个星号覆盖长度按 ``0,1,2,...`` 依次尝试。只有当前长度导致后续确定性匹配失败时才扩张，因此所有更短覆盖都已被排除。若存在某个可行覆盖长度，算法最终会到达它；到达后继续向右匹配。

字符串结束后为何只能剩星号
~~~~~~~~~~~~~~~~~~~~~~~~~~

字符串已完全消费时，普通字符和 ``?`` 都还需要一个字符，无法匹配空后缀；只有 ``*`` 能匹配空串。因此跳过模式末尾连续星号后，必须恰好到达模式末尾。

复杂度来源
~~~~~~~~~~

递归最坏指数级；动态规划为 ``O(mn)`` 时间和空间。贪心回退只使用固定状态，额外空间 ``O(1)``；实际输入通常接近线性，但同一段模式可能在星号逐步扩张时被重复扫描，严格最坏时间上界为 ``O(mn)``。

九语言实现
----------

C
~

.. code-block:: c

   bool isMatch(char *s, char *p) {
       int i=0,j=0,star=-1,matched=-1;
       while(s[i]!='\0'){
           if(p[j]!='\0'&&(p[j]=='?'||p[j]==s[i])){++i;++j;}
           else if(p[j]=='*'){star=j++;matched=i;}
           else if(star!=-1){j=star+1;i=++matched;}
           else return false;
       }
       while(p[j]=='*')++j;
       return p[j]=='\0';
   }

Python
~~~~~~

.. code-block:: python

   class Solution:
       def isMatch(self, s: str, p: str) -> bool:
           i = j = 0
           star = matched = -1
           while i < len(s):
               if j < len(p) and (p[j] == "?" or p[j] == s[i]): i += 1; j += 1
               elif j < len(p) and p[j] == "*": star = j; matched = i; j += 1
               elif star != -1: matched += 1; i = matched; j = star + 1
               else: return False
           while j < len(p) and p[j] == "*": j += 1
           return j == len(p)

Java
~~~~

.. code-block:: java

   class Solution {public boolean isMatch(String s,String p){int i=0,j=0,star=-1,matched=-1;while(i<s.length()){if(j<p.length()&&(p.charAt(j)=='?'||p.charAt(j)==s.charAt(i))){i++;j++;}else if(j<p.length()&&p.charAt(j)=='*'){star=j++;matched=i;}else if(star!=-1){j=star+1;i=++matched;}else return false;}while(j<p.length()&&p.charAt(j)=='*')j++;return j==p.length();}}

Rust
~~~~

.. code-block:: rust

   impl Solution {pub fn is_match(s:String,p:String)->bool{let(a,b)=(s.as_bytes(),p.as_bytes());let(mut i,mut j,mut star,mut matched)=(0usize,0usize,None,0usize);while i<a.len(){if j<b.len()&&(b[j]==b'?'||b[j]==a[i]){i+=1;j+=1}else if j<b.len()&&b[j]==b'*'{star=Some(j);j+=1;matched=i}else if let Some(k)=star{matched+=1;i=matched;j=k+1}else{return false}}while j<b.len()&&b[j]==b'*'{j+=1}j==b.len()}}

Go
~~

.. code-block:: go

   func isMatch(s,p string)bool{i,j,star,matched:=0,0,-1,-1;for i<len(s){if j<len(p)&&(p[j]=='?'||p[j]==s[i]){i++;j++}else if j<len(p)&&p[j]=='*'{star=j;j++;matched=i}else if star!=-1{matched++;i=matched;j=star+1}else{return false}};for j<len(p)&&p[j]=='*'{j++};return j==len(p)}

TypeScript
~~~~~~~~~~

.. code-block:: typescript

   function isMatch(s:string,p:string):boolean{let i=0,j=0,star=-1,matched=-1;while(i<s.length){if(j<p.length&&(p[j]==="?"||p[j]===s[i])){i++;j++;}else if(j<p.length&&p[j]==="*"){star=j++;matched=i;}else if(star!==-1){j=star+1;i=++matched;}else return false;}while(j<p.length&&p[j]==="*")j++;return j===p.length;}

C#
~~

.. code-block:: csharp

   public class Solution {public bool IsMatch(string s,string p){int i=0,j=0,star=-1,matched=-1;while(i<s.Length){if(j<p.Length&&(p[j]=='?'||p[j]==s[i])){i++;j++;}else if(j<p.Length&&p[j]=='*'){star=j++;matched=i;}else if(star!=-1){j=star+1;i=++matched;}else return false;}while(j<p.Length&&p[j]=='*')j++;return j==p.Length;}}

Julia
~~~~~

.. code-block:: julia

   function wildcard_match(s::String,p::String)::Bool
       a=collect(s);b=collect(p);i=j=1;star=0;matched=0
       while i<=length(a)
           if j<=length(b)&&(b[j]=='?'||b[j]==a[i]);i+=1;j+=1
           elseif j<=length(b)&&b[j]=='*';star=j;j+=1;matched=i
           elseif star!=0;matched+=1;i=matched;j=star+1
           else;return false;end
       end
       while j<=length(b)&&b[j]=='*';j+=1;end
       j>length(b)
   end

R
~

.. code-block:: r

   wildcard_match <- function(s,p){a<-strsplit(s,"")[[1]];b<-strsplit(p,"")[[1]];i<-1L;j<-1L;star<-0L;matched<-0L
     while(i<=length(a)){if(j<=length(b)&&(b[[j]]=="?"||b[[j]]==a[[i]])){i<-i+1L;j<-j+1L}else if(j<=length(b)&&b[[j]]=="*"){star<-j;j<-j+1L;matched<-i}else if(star!=0L){matched<-matched+1L;i<-matched;j<-star+1L}else return(FALSE)}
     while(j<=length(b)&&b[[j]]=="*")j<-j+1L;j>length(b)
   }