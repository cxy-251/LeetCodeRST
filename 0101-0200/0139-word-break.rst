0139. Word Break
================

题目信息
--------

:题号: 0139
:难度: Medium
:主题: 动态规划、字符串匹配、位置图可达性
:原题: `LeetCode 0139 <https://leetcode.com/problems/word-break/>`_
:教学重点: 空前缀单位元、可达位置传播、完整覆盖

题目重述
--------

给定非空小写字符串 ``s`` 和非空字典，判断能否把 ``s`` 完整切成一个或多个字典词。字典词可以重复使用，只返回布尔值。

自建示例
--------

.. code-block:: text

   s = "mintmint", dict = ["mint"] -> true
   s = "applepenx", dict = ["apple","pen"] -> false

C++ 实现
--------

.. code-block:: cpp

   #include <string>
   #include <unordered_set>
   #include <vector>

   class Solution {
   private:
       bool plainDfs(const std::string& s, int start,
                     const std::unordered_set<std::string>& dictionary) {
           if (start == static_cast<int>(s.size())) return true;
           for (int end = start + 1; end <= static_cast<int>(s.size()); ++end)
               if (dictionary.count(s.substr(start, end - start)) &&
                   plainDfs(s, end, dictionary)) return true;
           return false;
       }

       bool memoDfs(const std::string& s, int start,
                    const std::unordered_set<std::string>& dictionary,
                    std::vector<int>& memo) {
           if (start == static_cast<int>(s.size())) return true;
           if (memo[start] != -1) return memo[start];
           for (int end = start + 1; end <= static_cast<int>(s.size()); ++end)
               if (dictionary.count(s.substr(start, end - start)) &&
                   memoDfs(s, end, dictionary, memo)) return memo[start] = 1;
           return memo[start] = 0;
       }

       bool prefixDp(const std::string& s,
                     const std::vector<std::string>& words) {
           int n = s.size();
           std::vector<char> reachable(n + 1);
           reachable[0] = true;
           for (int start = 0; start < n; ++start) {
               if (!reachable[start]) continue;
               for (const std::string& word : words) {
                   int end = start + word.size();
                   if (end <= n && s.compare(start, word.size(), word) == 0)
                       reachable[end] = true;
               }
           }
           return reachable[n];
       }

   public:
       bool wordBreak(std::string s, std::vector<std::string>& wordDict) {
           return prefixDp(s, wordDict);
       }
   };

题解
----

字符边界图
~~~~~~~~~~

字符串有 ``n+1`` 个切分位置。若字典词 ``word`` 与 ``s[start:end]`` 相同，就存在一条 ``start -> end`` 的有向边。题目等价于判断顶点 ``n`` 是否从 0 可达。

状态定义
~~~~~~~~

``reachable[i]`` 表示前 ``i`` 个字符能被字典词完整覆盖。初始化 ``reachable[0]=true``，空前缀是传播的单位元，不代表公开答案中使用空单词。

.. list-table::
   :header-rows: 1

   * - 起点
     - 状态
     - 匹配词
     - 新状态
   * - 0
     - 可达
     - ``"mint"``
     - 4 可达
   * - 4
     - 可达
     - ``"mint"``
     - 8 可达
   * - 8
     - 终点
     - —
     - 返回真

为什么只从可达位置传播
~~~~~~~~~~~~~~~~~~~~~~

即使某个后缀能匹配字典词，若它之前的前缀无法完整切分，该边也不能属于从 0 出发的合法路径。跳过不可达起点既正确，也避免无效比较。

为什么字典词可以重复使用
~~~~~~~~~~~~~~~~~~~~~~~~

字典只提供边标签，不是一次性资源。每个可达位置都可以重新尝试全部词，因此同一词可在不同位置多次出现。

为什么最终状态足够
~~~~~~~~~~~~~~~~~~

每次传播只沿真实字典词覆盖的连续片段前进，所以任何可达状态对应合法切分；任意合法切分又是一系列字典边，按拓扑顺序会逐步把终点标为可达。

复杂度来源
~~~~~~~~~~

设字符串长度 ``n``、字典词数 ``D``、最大词长 ``L``。定点比较的最坏时间 ``O(nDL)``，状态数组 ``O(n)``。按所有切点枚举子串的常见实现为 ``O(n²)`` 次匹配。

九语言实现
----------

C
~

.. code-block:: c

   bool wordBreak(char*s,char**words,int count){int n=strlen(s);bool*r=calloc((size_t)n+1,sizeof(bool));r[0]=true;for(int start=0;start<n;start++)if(r[start])for(int j=0;j<count;j++){int len=strlen(words[j]);if(start+len<=n&&!strncmp(s+start,words[j],(size_t)len))r[start+len]=true;}bool out=r[n];free(r);return out;}

Python
~~~~~~

.. code-block:: python

   class Solution:
       def wordBreak(self, s: str, wordDict: list[str]) -> bool:
           reachable=[False]*(len(s)+1); reachable[0]=True
           for start in range(len(s)):
               if not reachable[start]: continue
               for word in wordDict:
                   if s.startswith(word,start): reachable[start+len(word)]=True
           return reachable[-1]

Java
~~~~

.. code-block:: java

   class Solution {public boolean wordBreak(String s,List<String>words){boolean[]r=new boolean[s.length()+1];r[0]=true;for(int st=0;st<s.length();st++)if(r[st])for(String w:words)if(st+w.length()<=s.length()&&s.startsWith(w,st))r[st+w.length()]=true;return r[s.length()];}}

Rust
~~~~

.. code-block:: rust

   impl Solution {pub fn word_break(s:String,words:Vec<String>)->bool{let b=s.as_bytes();let mut r=vec![false;b.len()+1];r[0]=true;for st in 0..b.len(){if !r[st]{continue}for w in &words{let x=w.as_bytes();if st+x.len()<=b.len()&&&b[st..st+x.len()]==x{r[st+x.len()]=true;}}}r[b.len()]}}

Go
~~

.. code-block:: go

   func wordBreak(s string,words []string)bool{r:=make([]bool,len(s)+1);r[0]=true;for st:=0;st<len(s);st++{if !r[st]{continue};for _,w:=range words{if st+len(w)<=len(s)&&s[st:st+len(w)]==w{r[st+len(w)]=true}}};return r[len(s)]}

TypeScript
~~~~~~~~~~

.. code-block:: typescript

   function wordBreak(s:string,words:string[]):boolean{const r=Array(s.length+1).fill(false);r[0]=true;for(let st=0;st<s.length;st++)if(r[st])for(const w of words)if(s.startsWith(w,st))r[st+w.length]=true;return r[s.length];}

C#
~~

.. code-block:: csharp

   public class Solution {public bool WordBreak(string s,IList<string>words){var r=new bool[s.Length+1];r[0]=true;for(int st=0;st<s.Length;st++)if(r[st])foreach(var w in words)if(st+w.Length<=s.Length&&s.AsSpan(st,w.Length).SequenceEqual(w))r[st+w.Length]=true;return r[s.Length];}}

Julia
~~~~~

.. code-block:: julia

   function word_break(s,words)
       a=collect(codeunits(s));r=falses(length(a)+1);r[1]=true
       for st in 0:length(a)-1;r[st+1]||continue;for w in words;b=collect(codeunits(w));if st+length(b)<=length(a)&&a[st+1:st+length(b)]==b;r[st+length(b)+1]=true;end;end;end;r[end]
   end

R
~

.. code-block:: r

   word_break <- function(s,words){n<-nchar(s,type="bytes");reachable<-rep(FALSE,n+1L);reachable[[1L]]<-TRUE;if(n>0L)for(st in 0:(n-1L))if(reachable[[st+1L]])for(w in words){len<-nchar(w,type="bytes");if(st+len<=n&&substr(s,st+1L,st+len)==w)reachable[[st+len+1L]]<-TRUE};reachable[[n+1L]]}
