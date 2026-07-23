0131. Palindrome Partitioning
=============================

题目信息
--------

:题号: 0131
:难度: Medium
:主题: 字符串、区间动态规划、回溯、路径枚举
:原题: `LeetCode 0131 <https://leetcode.com/problems/palindrome-partitioning/>`_
:重点: 连续非空片段、全部回文切分、完整覆盖、结果顺序不限

题目重述
--------

给定只包含小写英文字母的字符串 ``s``，在若干字符边界处切分它，使得到的每个片段都是非空回文串。返回所有能够按原顺序完整覆盖 ``s`` 的合法切分方案；每个方案是片段数组，多个方案的返回顺序不限。

约束为 ``1 <= s.length <= 16``。

自建示例
--------

.. code-block:: text

   输入：s = "abba"
   输出：[["a","b","b","a"],["a","bb","a"],["abba"]]
   解释：这三种方案中的每个片段都是回文串，并且都按原顺序完整覆盖字符串；结果顺序可以不同。

.. code-block:: text

   输入：s = "abc"
   输出：[["a","b","c"]]
   解释：不存在长度大于 1 的回文片段，因此只能把每个字符单独作为一段。

C++ 实现
--------

.. code-block:: cpp

   #include <string>
   #include <vector>

   class Solution {
   private:
       bool isPalindrome(const std::string& s, int left, int right) {
           while (left < right) if (s[left++] != s[right--]) return false;
           return true;
       }

       void directDfs(const std::string& s, int start,
                      std::vector<std::string>& path,
                      std::vector<std::vector<std::string>>& result) {
           if (start == static_cast<int>(s.size())) { result.push_back(path); return; }
           for (int end = start; end < static_cast<int>(s.size()); ++end) {
               if (!isPalindrome(s, start, end)) continue;
               path.push_back(s.substr(start, end - start + 1));
               directDfs(s, end + 1, path, result);
               path.pop_back();
           }
       }

       std::vector<std::vector<char>> buildPalindromeTable(const std::string& s) {
           int n = s.size();
           std::vector<std::vector<char>> palindrome(n, std::vector<char>(n));
           for (int left = n - 1; left >= 0; --left)
               for (int right = left; right < n; ++right)
                   palindrome[left][right] = s[left] == s[right] &&
                       (right - left <= 2 || palindrome[left + 1][right - 1]);
           return palindrome;
       }

       void tableDfs(const std::string& s, int start,
                     const std::vector<std::vector<char>>& palindrome,
                     std::vector<std::string>& path,
                     std::vector<std::vector<std::string>>& result) {
           if (start == static_cast<int>(s.size())) { result.push_back(path); return; }
           for (int end = start; end < static_cast<int>(s.size()); ++end) {
               if (!palindrome[start][end]) continue;
               path.push_back(s.substr(start, end - start + 1));
               tableDfs(s, end + 1, palindrome, path, result);
               path.pop_back();
           }
       }

   public:
       std::vector<std::vector<std::string>> partition(std::string s) {
           auto palindrome = buildPalindromeTable(s);
           std::vector<std::vector<std::string>> result;
           std::vector<std::string> path;
           tableDfs(s, 0, palindrome, path, result);
           return result;
       }
   };

题解
----

位置 DAG 如何表达切分
~~~~~~~~~~~~~~~~~~~~~

把字符边界 ``0..n`` 视为顶点。若 ``s[start..end]`` 是回文，就有一条 ``start -> end+1`` 的边。每条从 0 到 ``n`` 的路径恰好对应一组完整切分。

回文表如何递推
~~~~~~~~~~~~~~

区间 ``[left,right]`` 是回文，当且仅当两端字符相同，并且内部区间也是回文：

.. code-block:: text

   palindrome[left][right] =
       s[left] == s[right] &&
       (right-left <= 2 || palindrome[left+1][right-1])

因此 ``left`` 必须从右向左计算，保证内部状态已经存在。

路径状态
~~~~~~~~

.. list-table::
   :header-rows: 1

   * - 起点
     - 可选回文
     - 路径
   * - 0
     - ``"a"``、``"aa"``
     - 分成两棵子树
   * - 1
     - ``"a"``
     - ``["a","a"]``
   * - 2
     - ``"b"``
     - 到达末端并保存快照

为什么追加与撤销必须对称
~~~~~~~~~~~~~~~~~~~~~~~~

进入子树前把当前片段追加到共享路径；返回后删除同一片段。到达末端时复制当前路径，结果不会被之后的撤销修改。

为什么不重不漏
~~~~~~~~~~~~~~

任意合法方案的每段都是表中一条边，回溯会按其终点顺序走到末端，因此不漏。不同方案至少有一个切点不同，对应不同位置路径，因此不会重复。

复杂度来源
~~~~~~~~~~

回文表需要 ``O(n²)`` 时间和空间。合法方案数可能达到指数级；枚举与复制结果的时间必须与全部输出字符总量成正比，递归深度最多 ``O(n)``。

九语言实现
----------

C
~

.. code-block:: c

   static int pal(const char*s,int l,int r){while(l<r)if(s[l++]!=s[r--])return 0;return 1;}
   static void dfs(char*s,int n,int start,char**path,int depth,char****out,int**cols,int*size,int*cap){if(start==n){if(*size==*cap){*cap*=2;*out=realloc(*out,(size_t)*cap*sizeof(char**));*cols=realloc(*cols,(size_t)*cap*sizeof(int));}char**row=malloc((size_t)depth*sizeof(char*));for(int i=0;i<depth;i++){row[i]=malloc(strlen(path[i])+1);strcpy(row[i],path[i]);}(*out)[*size]=row;(*cols)[(*size)++]=depth;return;}for(int e=start;e<n;e++)if(pal(s,start,e)){int len=e-start+1;path[depth]=malloc((size_t)len+1);memcpy(path[depth],s+start,(size_t)len);path[depth][len]='\0';dfs(s,n,e+1,path,depth+1,out,cols,size,cap);free(path[depth]);}}
   char***partition(char*s,int*returnSize,int**returnColumnSizes){int n=strlen(s),cap=4,size=0;char***out=malloc((size_t)cap*sizeof(char**));int*cols=malloc((size_t)cap*sizeof(int));char**path=malloc((size_t)n*sizeof(char*));dfs(s,n,0,path,0,&out,&cols,&size,&cap);free(path);*returnSize=size;*returnColumnSizes=cols;return out;}

Python
~~~~~~

.. code-block:: python

   class Solution:
       def partition(self, s: str) -> list[list[str]]:
           n=len(s); p=[[False]*n for _ in range(n)]
           for l in range(n-1,-1,-1):
               for r in range(l,n): p[l][r]=s[l]==s[r] and (r-l<=2 or p[l+1][r-1])
           out=[]; path=[]
           def dfs(start):
               if start==n: out.append(path.copy()); return
               for end in range(start,n):
                   if p[start][end]: path.append(s[start:end+1]); dfs(end+1); path.pop()
           dfs(0); return out

Java
~~~~

.. code-block:: java

   class Solution {public List<List<String>> partition(String s){int n=s.length();boolean[][]p=new boolean[n][n];for(int l=n-1;l>=0;l--)for(int r=l;r<n;r++)p[l][r]=s.charAt(l)==s.charAt(r)&&(r-l<=2||p[l+1][r-1]);List<List<String>>o=new ArrayList<>();dfs(s,0,p,new ArrayList<>(),o);return o;}void dfs(String s,int st,boolean[][]p,List<String>path,List<List<String>>o){if(st==s.length()){o.add(new ArrayList<>(path));return;}for(int e=st;e<s.length();e++)if(p[st][e]){path.add(s.substring(st,e+1));dfs(s,e+1,p,path,o);path.remove(path.size()-1);}}}

Rust
~~~~

.. code-block:: rust

   impl Solution {pub fn partition(s:String)->Vec<Vec<String>>{fn dfs(s:&[u8],st:usize,p:&Vec<Vec<bool>>,path:&mut Vec<String>,o:&mut Vec<Vec<String>>){if st==s.len(){o.push(path.clone());return}for e in st..s.len(){if p[st][e]{path.push(String::from_utf8(s[st..=e].to_vec()).unwrap());dfs(s,e+1,p,path,o);path.pop();}}}let b=s.as_bytes();let n=b.len();let mut p=vec![vec![false;n];n];for l in(0..n).rev(){for r in l..n{p[l][r]=b[l]==b[r]&&(r-l<=2||p[l+1][r-1]);}}let mut o=vec![];dfs(b,0,&p,&mut vec![],&mut o);o}}

Go
~~

.. code-block:: go

   func partition(s string)[][]string{n:=len(s);p:=make([][]bool,n);for i:=range p{p[i]=make([]bool,n)};for l:=n-1;l>=0;l--{for r:=l;r<n;r++{p[l][r]=s[l]==s[r]&&(r-l<=2||p[l+1][r-1])}};o:=[][]string{};path:=[]string{};var dfs func(int);dfs=func(st int){if st==n{row:=append([]string{},path...);o=append(o,row);return};for e:=st;e<n;e++{if p[st][e]{path=append(path,s[st:e+1]);dfs(e+1);path=path[:len(path)-1]}}};dfs(0);return o}

TypeScript
~~~~~~~~~~

.. code-block:: typescript

   function partition(s:string):string[][]{const n=s.length,p=Array.from({length:n},()=>Array(n).fill(false)),out:string[][]=[],path:string[]=[];for(let l=n-1;l>=0;l--)for(let r=l;r<n;r++)p[l][r]=s[l]===s[r]&&(r-l<=2||p[l+1][r-1]);const dfs=(st:number)=>{if(st===n){out.push([...path]);return;}for(let e=st;e<n;e++)if(p[st][e]){path.push(s.slice(st,e+1));dfs(e+1);path.pop();}};dfs(0);return out;}

C#
~~

.. code-block:: csharp

   public class Solution {public IList<IList<string>> Partition(string s){int n=s.Length;var p=new bool[n,n];for(int l=n-1;l>=0;l--)for(int r=l;r<n;r++)p[l,r]=s[l]==s[r]&&(r-l<=2||p[l+1,r-1]);var o=new List<IList<string>>();var path=new List<string>();void Dfs(int st){if(st==n){o.Add(new List<string>(path));return;}for(int e=st;e<n;e++)if(p[st,e]){path.Add(s.Substring(st,e-st+1));Dfs(e+1);path.RemoveAt(path.Count-1);}}Dfs(0);return o;}}

Julia
~~~~~

.. code-block:: julia

   function partition_palindromes(s::String)
       a=collect(s);n=length(a);p=falses(n,n)
       for l in n:-1:1,r in l:n;p[l,r]=a[l]==a[r]&&(r-l<=2||p[l+1,r-1]);end
       out=Vector{Vector{String}}();path=String[]
       function dfs(st);st>n&&(push!(out,copy(path));return);for e in st:n;if p[st,e];push!(path,String(a[st:e]));dfs(e+1);pop!(path);end;end;end
       dfs(1);out
   end

R
~

.. code-block:: r

   partition_palindromes <- function(s){a<-strsplit(s,"",fixed=TRUE)[[1L]];n<-length(a);p<-matrix(FALSE,n,n);for(l in n:1L)for(r in l:n)p[l,r]<-a[l]==a[r]&&(r-l<=2L||p[l+1L,r-1L]);out<-list();path<-character();dfs<-function(st){if(st>n){out[[length(out)+1L]]<<-path;return()};for(e in st:n)if(p[st,e]){path<<-c(path,paste0(a[st:e],collapse=""));dfs(e+1L);path<<-head(path,-1L)}};dfs(1L);out}