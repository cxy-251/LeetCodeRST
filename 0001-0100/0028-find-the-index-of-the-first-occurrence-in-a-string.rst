0028. Find the Index of the First Occurrence in a String
========================================================

题目信息
--------

:题号: 0028
:难度: Easy
:主题: 字符串、模式匹配、KMP
:原题: `LeetCode 0028 <https://leetcode.com/problems/find-the-index-of-the-first-occurrence-in-a-string/>`_
:重点: 连续子串、首次出现、零基下标、未找到返回 -1

题目重述
--------

给定两个字符串 ``haystack`` 和 ``needle``，在 ``haystack`` 中寻找与 ``needle`` 完全相同的连续子串，返回第一次出现位置的零基起始下标；若不存在，返回 ``-1``。

``haystack`` 和 ``needle`` 的长度均位于 ``[1, 10^4]``，并且只包含小写英文字母。

自建示例
--------

模式出现多次：

.. code-block:: text

   输入：haystack = "abracadabra", needle = "abra"
   输出：0
   解释："abra" 分别从下标 0 和 7 开始出现，应返回较早的下标 0。

首次匹配位于中间：

.. code-block:: text

   输入：haystack = "mississippi", needle = "issip"
   输出：4
   解释：从下标 4 开始的连续五个字符是 "issip"。

模式不存在：

.. code-block:: text

   输入：haystack = "algorithm", needle = "rhythm"
   输出：-1
   解释：文本中没有与 needle 完全相同的连续子串。

C++ 实现
--------

.. code-block:: cpp

   #include <string>
   #include <vector>

   class Solution {
   private:
       int libraryFind(const std::string& text, const std::string& pattern) {
           auto pos = text.find(pattern);
           return pos == std::string::npos ? -1 : static_cast<int>(pos);
       }

       int naive(const std::string& text, const std::string& pattern) {
           if (pattern.empty()) return 0;
           if (pattern.size() > text.size()) return -1;
           for (int start = 0; start + static_cast<int>(pattern.size()) <= static_cast<int>(text.size()); ++start) {
               int offset = 0;
               while (offset < static_cast<int>(pattern.size()) &&
                      text[start + offset] == pattern[offset]) ++offset;
               if (offset == static_cast<int>(pattern.size())) return start;
           }
           return -1;
       }

       std::vector<int> buildPrefix(const std::string& pattern) {
           std::vector<int> prefix(pattern.size());
           for (int i = 1; i < static_cast<int>(pattern.size()); ++i) {
               int matched = prefix[i - 1];
               while (matched > 0 && pattern[i] != pattern[matched]) matched = prefix[matched - 1];
               if (pattern[i] == pattern[matched]) ++matched;
               prefix[i] = matched;
           }
           return prefix;
       }

       int kmp(const std::string& text, const std::string& pattern) {
           if (pattern.empty()) return 0;
           auto prefix = buildPrefix(pattern);
           int matched = 0;
           for (int i = 0; i < static_cast<int>(text.size()); ++i) {
               while (matched > 0 && text[i] != pattern[matched]) matched = prefix[matched - 1];
               if (text[i] == pattern[matched]) ++matched;
               if (matched == static_cast<int>(pattern.size())) return i - matched + 1;
           }
           return -1;
       }

   public:
       int strStr(std::string haystack, std::string needle) {
           return kmp(haystack, needle);
       }
   };

题解
----

朴素起点枚举为何最坏重复比较
~~~~~~~~~~~~~~~~~~~~~~~~~~~~

文本长度 ``n``、模式长度 ``m`` 时，合法起点只有 ``0`` 到 ``n-m``。朴素方法按递增起点逐字符验证，第一个成功
位置必然最早；但重复模式可能在每个起点匹配很长前缀后才失配，最坏 ``O(nm)``。

前缀函数保存哪些可复用字符
~~~~~~~~~~~~~~~~~~~~~~~~~~

``prefix[i]`` 是模式前缀 ``pattern[0:i+1]`` 的最长相等真前后缀长度。若已匹配部分失配，文本后缀中仍可能保留
一个等于模式前缀的片段；回退到 ``prefix[matched-1]`` 就能复用它，而不是把匹配长度清零。

.. list-table::
   :header-rows: 1

   * - 已匹配模式
     - 失配
     - ``matched`` 回退
     - 保留依据
   * - ``abab``
     - 新字符无法匹配 ``c``
     - 4 -> 2
     - 后缀 ``ab`` 等于模式前缀 ``ab``
   * - ``ab``
     - 重新比较当前字符
     - 2 -> 3
     - 当前字符匹配模式下标 2

为什么构造前缀函数也使用相同回退
~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

计算 ``prefix[i]`` 时，已知 ``pattern[0:matched]`` 等于当前位置之前的后缀。若新字符失配，更长边界不成立，但该
边界本身的最长边界仍可能成立，因此继续跳到 ``prefix[matched-1]``。每次回退严格缩短候选长度。

为什么文本指针不回退
~~~~~~~~~~~~~~~~~~~~

回退后的模式前缀已经等于文本已读部分的后缀，之前文本字符无需重新读取。文本下标始终向右；``matched`` 的总增加
与总回退都是线性数量，所以扫描为 ``O(n)``。

为什么第一次完整匹配就是最早起点
~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

文本从左到右处理。匹配长度首次达到 ``m`` 时，结束位置最早，对应起点 ``i-m+1``。若存在更早完整匹配，它应在
更早的结束位置已经触发返回。

复杂度来源
~~~~~~~~~~

前缀函数 ``O(m)``，文本扫描 ``O(n)``，总时间 ``O(n+m)``，额外空间 ``O(m)``。朴素方法空间 ``O(1)``，最坏
``O(nm)``；标准库方法隐藏具体实现。

九语言实现
----------

C
~

.. code-block:: c

   int strStr(char* text, char* pattern) {
       int n=(int)strlen(text),m=(int)strlen(pattern);if(m==0)return 0;
       int* pi=calloc((size_t)m,sizeof(int));
       for(int i=1;i<m;i++){int j=pi[i-1];while(j>0&&pattern[i]!=pattern[j])j=pi[j-1];if(pattern[i]==pattern[j])j++;pi[i]=j;}
       int j=0;for(int i=0;i<n;i++){while(j>0&&text[i]!=pattern[j])j=pi[j-1];if(text[i]==pattern[j])j++;if(j==m){free(pi);return i-m+1;}}
       free(pi);return -1;
   }

Python
~~~~~~

.. code-block:: python

   class Solution:
       def strStr(self, text: str, pattern: str) -> int:
           if not pattern: return 0
           pi = [0] * len(pattern)
           for i in range(1, len(pattern)):
               j = pi[i - 1]
               while j and pattern[i] != pattern[j]: j = pi[j - 1]
               if pattern[i] == pattern[j]: j += 1
               pi[i] = j
           j = 0
           for i, char in enumerate(text):
               while j and char != pattern[j]: j = pi[j - 1]
               if char == pattern[j]: j += 1
               if j == len(pattern): return i - j + 1
           return -1

Java
~~~~

.. code-block:: java

   class Solution {
       public int strStr(String text,String pattern){
           if(pattern.isEmpty())return 0;int m=pattern.length();int[] pi=new int[m];
           for(int i=1;i<m;i++){int j=pi[i-1];while(j>0&&pattern.charAt(i)!=pattern.charAt(j))j=pi[j-1];if(pattern.charAt(i)==pattern.charAt(j))j++;pi[i]=j;}
           int j=0;for(int i=0;i<text.length();i++){while(j>0&&text.charAt(i)!=pattern.charAt(j))j=pi[j-1];if(text.charAt(i)==pattern.charAt(j))j++;if(j==m)return i-m+1;}return -1;
       }
   }

Rust
~~~~

.. code-block:: rust

   impl Solution {
       pub fn str_str(text:String,pattern:String)->i32{
           if pattern.is_empty(){return 0}let t=text.as_bytes();let p=pattern.as_bytes();let mut pi=vec![0;p.len()];
           for i in 1..p.len(){let mut j=pi[i-1];while j>0&&p[i]!=p[j]{j=pi[j-1];}if p[i]==p[j]{j+=1;}pi[i]=j;}
           let mut j=0;for i in 0..t.len(){while j>0&&t[i]!=p[j]{j=pi[j-1];}if t[i]==p[j]{j+=1;}if j==p.len(){return (i+1-j) as i32;}}-1
       }
   }

Go
~~

.. code-block:: go

   func strStr(text,pattern string)int{
       if len(pattern)==0{return 0};pi:=make([]int,len(pattern))
       for i:=1;i<len(pattern);i++{j:=pi[i-1];for j>0&&pattern[i]!=pattern[j]{j=pi[j-1]};if pattern[i]==pattern[j]{j++};pi[i]=j}
       j:=0;for i:=0;i<len(text);i++{for j>0&&text[i]!=pattern[j]{j=pi[j-1]};if text[i]==pattern[j]{j++};if j==len(pattern){return i-j+1}};return -1
   }

TypeScript
~~~~~~~~~~

.. code-block:: typescript

   function strStr(text:string,pattern:string):number{
       if(pattern.length===0)return 0;const pi=new Array(pattern.length).fill(0);
       for(let i=1;i<pattern.length;i++){let j=pi[i-1];while(j>0&&pattern[i]!==pattern[j])j=pi[j-1];if(pattern[i]===pattern[j])j++;pi[i]=j;}
       let j=0;for(let i=0;i<text.length;i++){while(j>0&&text[i]!==pattern[j])j=pi[j-1];if(text[i]===pattern[j])j++;if(j===pattern.length)return i-j+1;}return -1;
   }

C#
~~

.. code-block:: csharp

   public class Solution {
       public int StrStr(string text,string pattern){
           if(pattern.Length==0)return 0;int[] pi=new int[pattern.Length];
           for(int i=1;i<pattern.Length;i++){int j=pi[i-1];while(j>0&&pattern[i]!=pattern[j])j=pi[j-1];if(pattern[i]==pattern[j])j++;pi[i]=j;}
           int matched=0;for(int i=0;i<text.Length;i++){while(matched>0&&text[i]!=pattern[matched])matched=pi[matched-1];if(text[i]==pattern[matched])matched++;if(matched==pattern.Length)return i-matched+1;}return -1;
       }
   }

Julia
~~~~~

.. code-block:: julia

   function str_str(text::String, pattern::String)
       isempty(pattern) && return 0
       t=collect(text);p=collect(pattern);pi=zeros(Int,length(p))
       for i in 2:length(p);j=pi[i-1];while j>0&&p[i]!=p[j+1];j=pi[j];end;if p[i]==p[j+1];j+=1;end;pi[i]=j;end
       j=0;for i in eachindex(t);while j>0&&t[i]!=p[j+1];j=pi[j];end;if t[i]==p[j+1];j+=1;end;if j==length(p);return i-j;end;end;-1
   end

R
~

.. code-block:: r

   str_str <- function(text, pattern) {
       t <- strsplit(text,"",fixed=TRUE)[[1]]; p <- strsplit(pattern,"",fixed=TRUE)[[1]]
       m <- length(p); if (m == 0L) return(0L); pi <- integer(m)
       if (m >= 2L) for (i in 2:m) { j <- pi[[i-1L]]; while (j>0L && p[[i]]!=p[[j+1L]]) j<-pi[[j]]; if(p[[i]]==p[[j+1L]])j<-j+1L; pi[[i]]<-j }
       j <- 0L
       for (i in seq_along(t)) { while(j>0L&&t[[i]]!=p[[j+1L]])j<-pi[[j]];if(t[[i]]==p[[j+1L]])j<-j+1L;if(j==m)return(i-j) }
       -1L
   }