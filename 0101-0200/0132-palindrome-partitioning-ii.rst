0132. Palindrome Partitioning II
================================

题目信息
--------

:题号: 0132
:难度: Hard
:主题: 字符串、区间动态规划、前缀最优值
:原题: `LeetCode 0132 <https://leetcode.com/problems/palindrome-partitioning-ii/>`_
:重点: 连续回文片段、最少切割、整串回文返回零

题目重述
--------

给定一个只包含小写英文字母的非空字符串 ``s``，在字符之间进行若干次切割，使得到的每个连续非空片段都是回文串。返回完成合法切分所需的最少切割次数；若整个字符串本身就是回文串，则返回 ``0``。

约束为 ``1 <= s.length <= 2000``。

自建示例
--------

.. code-block:: text

   输入：s = "racecarx"
   输出：1
   解释：在最后一个字符前切一刀，得到 "racecar" | "x"，两个片段都是回文串。

.. code-block:: text

   输入：s = "abacdc"
   输出：1
   解释：切分为 "aba" | "cdc" 只需一刀；整串不是回文，因此不可能用零刀完成。

C++ 实现
--------

.. code-block:: cpp

   #include <algorithm>
   #include <string>
   #include <vector>

   class Solution {
   private:
       bool isPalindrome(const std::string& s, int l, int r) {
           while (l < r) if (s[l++] != s[r--]) return false;
           return true;
       }

       int memoDfs(const std::string& s, int start, std::vector<int>& memo) {
           if (start == static_cast<int>(s.size())) return -1;
           if (memo[start] != -2) return memo[start];
           int best = s.size();
           for (int end = start; end < static_cast<int>(s.size()); ++end)
               if (isPalindrome(s, start, end))
                   best = std::min(best, 1 + memoDfs(s, end + 1, memo));
           return memo[start] = best;
       }

       int tableDp(const std::string& s) {
           int n = s.size();
           std::vector<std::vector<char>> palindrome(n, std::vector<char>(n));
           for (int l = n - 1; l >= 0; --l)
               for (int r = l; r < n; ++r)
                   palindrome[l][r] = s[l] == s[r] &&
                       (r - l <= 2 || palindrome[l + 1][r - 1]);
           std::vector<int> cuts(n + 1);
           cuts[0] = -1;
           for (int end = 1; end <= n; ++end) {
               cuts[end] = end - 1;
               for (int start = 0; start < end; ++start)
                   if (palindrome[start][end - 1])
                       cuts[end] = std::min(cuts[end], cuts[start] + 1);
           }
           return cuts[n];
       }

       int centerExpansion(const std::string& s) {
           int n = s.size();
           std::vector<int> cuts(n + 1);
           for (int i = 0; i <= n; ++i) cuts[i] = i - 1;
           for (int center = 0; center < n; ++center) {
               for (int l = center, r = center; l >= 0 && r < n && s[l] == s[r]; --l, ++r)
                   cuts[r + 1] = std::min(cuts[r + 1], cuts[l] + 1);
               for (int l = center, r = center + 1; l >= 0 && r < n && s[l] == s[r]; --l, ++r)
                   cuts[r + 1] = std::min(cuts[r + 1], cuts[l] + 1);
           }
           return cuts[n];
       }

   public:
       int minCut(std::string s) {
           return tableDp(s);
       }
   };

题解
----

最后一个片段如何划分方案
~~~~~~~~~~~~~~~~~~~~~~~~

对前 ``end`` 个字符，设最后一个片段是 ``s[start..end-1]``。只要它是回文，前面的最优切法与这一段之间增加一刀：

.. code-block:: text

   cuts[end] = min(cuts[start] + 1)

为什么 cuts[0] = -1
~~~~~~~~~~~~~~~~~~~~

空前缀没有真实片段。若第一段从 0 开始，转移得到 ``cuts[0]+1=0``，正好表示整段回文不需要切割。若初始化为 0，会把第一段误计为一刀。

状态演化
~~~~~~~~

.. list-table::
   :header-rows: 1

   * - 前缀
     - 可选最后回文段
     - 最少切割
   * - ``"a"``
     - ``"a"``
     - 0
   * - ``"aa"``
     - ``"a"``、``"aa"``
     - 0
   * - ``"aab"``
     - ``"b"``
     - 1

为什么前缀最优可以复用
~~~~~~~~~~~~~~~~~~~~~~

最后一个片段确定后，之前的切割与后段内部无关；若前缀不是最优，可替换成更少切割而保持最后一段不变。因此最优子结构成立。

中心扩展的取舍
~~~~~~~~~~~~~~

每个回文都有唯一中心，扩展时可以直接更新对应前缀答案，省去 ``O(n²)`` 回文表空间。但更新顺序更难证明，二维表加前缀 DP 更清晰。

复杂度来源
~~~~~~~~~~

回文表和前缀转移均为 ``O(n²)`` 时间；表方法使用 ``O(n²)`` 空间。中心扩展仍为 ``O(n²)`` 时间，但只需 ``O(n)`` 状态。

九语言实现
----------

C
~

.. code-block:: c

   int minCut(char*s){int n=strlen(s);bool*p=calloc((size_t)n*n,sizeof(bool));for(int l=n-1;l>=0;l--)for(int r=l;r<n;r++)p[l*n+r]=s[l]==s[r]&&(r-l<=2||p[(l+1)*n+r-1]);int*cuts=malloc((size_t)(n+1)*sizeof(int));cuts[0]=-1;for(int e=1;e<=n;e++){cuts[e]=e-1;for(int st=0;st<e;st++)if(p[st*n+e-1]&&cuts[st]+1<cuts[e])cuts[e]=cuts[st]+1;}int out=cuts[n];free(p);free(cuts);return out;}

Python
~~~~~~

.. code-block:: python

   class Solution:
       def minCut(self, s: str) -> int:
           n=len(s); p=[[False]*n for _ in range(n)]
           for l in range(n-1,-1,-1):
               for r in range(l,n): p[l][r]=s[l]==s[r] and (r-l<=2 or p[l+1][r-1])
           cuts=[-1]+list(range(n))
           for end in range(1,n+1):
               cuts[end]=min(cuts[start]+1 for start in range(end) if p[start][end-1])
           return cuts[n]

Java
~~~~

.. code-block:: java

   class Solution {public int minCut(String s){int n=s.length();boolean[][]p=new boolean[n][n];for(int l=n-1;l>=0;l--)for(int r=l;r<n;r++)p[l][r]=s.charAt(l)==s.charAt(r)&&(r-l<=2||p[l+1][r-1]);int[]c=new int[n+1];c[0]=-1;for(int e=1;e<=n;e++){c[e]=e-1;for(int st=0;st<e;st++)if(p[st][e-1])c[e]=Math.min(c[e],c[st]+1);}return c[n];}}

Rust
~~~~

.. code-block:: rust

   impl Solution {pub fn min_cut(s:String)->i32{let b=s.as_bytes();let n=b.len();let mut p=vec![vec![false;n];n];for l in(0..n).rev(){for r in l..n{p[l][r]=b[l]==b[r]&&(r-l<=2||p[l+1][r-1]);}}let mut c:Vec<i32>=(0..=n).map(|i|i as i32-1).collect();for e in 1..=n{for st in 0..e{if p[st][e-1]{c[e]=c[e].min(c[st]+1);}}}c[n]}}

Go
~~

.. code-block:: go

   func minCut(s string)int{n:=len(s);p:=make([][]bool,n);for i:=range p{p[i]=make([]bool,n)};for l:=n-1;l>=0;l--{for r:=l;r<n;r++{p[l][r]=s[l]==s[r]&&(r-l<=2||p[l+1][r-1])}};c:=make([]int,n+1);c[0]=-1;for e:=1;e<=n;e++{c[e]=e-1;for st:=0;st<e;st++{if p[st][e-1]&&c[st]+1<c[e]{c[e]=c[st]+1}}};return c[n]}

TypeScript
~~~~~~~~~~

.. code-block:: typescript

   function minCut(s:string):number{const n=s.length,p=Array.from({length:n},()=>Array(n).fill(false)),c=Array(n+1).fill(0);for(let l=n-1;l>=0;l--)for(let r=l;r<n;r++)p[l][r]=s[l]===s[r]&&(r-l<=2||p[l+1][r-1]);c[0]=-1;for(let e=1;e<=n;e++){c[e]=e-1;for(let st=0;st<e;st++)if(p[st][e-1])c[e]=Math.min(c[e],c[st]+1);}return c[n];}

C#
~~

.. code-block:: csharp

   public class Solution {public int MinCut(string s){int n=s.Length;var p=new bool[n,n];for(int l=n-1;l>=0;l--)for(int r=l;r<n;r++)p[l,r]=s[l]==s[r]&&(r-l<=2||p[l+1,r-1]);var c=new int[n+1];c[0]=-1;for(int e=1;e<=n;e++){c[e]=e-1;for(int st=0;st<e;st++)if(p[st,e-1])c[e]=Math.Min(c[e],c[st]+1);}return c[n];}}

Julia
~~~~~

.. code-block:: julia

   function min_cut(s::String)
       a=collect(s);n=length(a);p=falses(n,n)
       for l in n:-1:1,r in l:n;p[l,r]=a[l]==a[r]&&(r-l<=2||p[l+1,r-1]);end
       c=collect(-1:n-1)
       for e in 1:n,st in 1:e;if p[st,e];c[e+1]=min(c[e+1],c[st]+1);end;end;c[n+1]
   end

R
~

.. code-block:: r

   min_cut <- function(s){a<-strsplit(s,"",fixed=TRUE)[[1L]];n<-length(a);p<-matrix(FALSE,n,n);for(l in n:1L)for(r in l:n)p[l,r]<-a[l]==a[r]&&(r-l<=2L||p[l+1L,r-1L]);cuts<-c(-1L,0:(n-1L));for(e in seq_len(n))for(st in seq_len(e))if(p[st,e])cuts[[e+1L]]<-min(cuts[[e+1L]],cuts[[st]]+1L);cuts[[n+1L]]}