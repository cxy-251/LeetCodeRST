0097. Interleaving String
=========================

题目信息
--------

:题号: 0097
:难度: Medium
:主题: 字符串、动态规划、记忆化搜索、滚动数组
:原题: `LeetCode 0097 <https://leetcode.com/problems/interleaving-string/>`_
:重点: 两个来源顺序保持、长度守恒、字符来源选择、完整使用

题目重述
--------

给定字符串 ``s1``、``s2`` 和 ``s3``，判断能否在保持 ``s1`` 与 ``s2`` 各自字符相对顺序的前提下，从两个字符串交替取字符组成 ``s3``。可以连续从同一来源取多个字符，但必须恰好使用 ``s1`` 和 ``s2`` 的全部字符。

约束为 ``0 <= s1.length, s2.length <= 100``、``0 <= s3.length <= 200``，字符串只包含小写英文字母。

自建示例
--------

.. code-block:: text

   输入：s1 = "ab", s2 = "cd", s3 = "acbd"
   输出：true

字符来源顺序为 ``a(s1), c(s2), b(s1), d(s2)``，两个原字符串内部顺序都保持不变。

.. code-block:: text

   输入：s1 = "ab", s2 = "cd", s3 = "adcb"
   输出：false

取出 ``a``、``d`` 后，目标要求先取 ``c``；但 ``d`` 位于 ``s2`` 的 ``c`` 之后，已经违反了 ``s2`` 的相对顺序。

C++ 实现
--------

.. code-block:: cpp

   #include <string>
   #include <utility>
   #include <vector>

   class Solution {
   private:
       bool plainDfs(const std::string& a, const std::string& b,
                     const std::string& target, int i, int j) {
           if (i == static_cast<int>(a.size()) && j == static_cast<int>(b.size())) return true;
           int position = i + j;
           return (i < static_cast<int>(a.size()) && a[i] == target[position] &&
                   plainDfs(a,b,target,i+1,j)) ||
                  (j < static_cast<int>(b.size()) && b[j] == target[position] &&
                   plainDfs(a,b,target,i,j+1));
       }

       bool memoDfs(const std::string& a, const std::string& b,
                    const std::string& target, int i, int j,
                    std::vector<std::vector<int>>& memo) {
           if (i == static_cast<int>(a.size()) && j == static_cast<int>(b.size())) return true;
           int& cached = memo[i][j];
           if (cached != -1) return cached;
           int position = i + j;
           bool possible = false;
           if (i < static_cast<int>(a.size()) && a[i] == target[position])
               possible = memoDfs(a,b,target,i+1,j,memo);
           if (!possible && j < static_cast<int>(b.size()) && b[j] == target[position])
               possible = memoDfs(a,b,target,i,j+1,memo);
           return cached = possible;
       }

       bool tableDp(const std::string& a, const std::string& b,
                    const std::string& target) {
           std::vector dp(a.size()+1, std::vector<char>(b.size()+1));
           dp[0][0] = true;
           for (int i = 0; i <= static_cast<int>(a.size()); ++i)
               for (int j = 0; j <= static_cast<int>(b.size()); ++j) {
                   if (i > 0 && a[i-1] == target[i+j-1]) dp[i][j] |= dp[i-1][j];
                   if (j > 0 && b[j-1] == target[i+j-1]) dp[i][j] |= dp[i][j-1];
               }
           return dp[a.size()][b.size()];
       }

       bool rollingDp(std::string a, std::string b, const std::string& target) {
           if (b.size() > a.size()) std::swap(a,b);
           std::vector<char> dp(b.size()+1);
           dp[0] = true;
           for (int j = 1; j <= static_cast<int>(b.size()); ++j)
               dp[j] = dp[j-1] && b[j-1] == target[j-1];
           for (int i = 1; i <= static_cast<int>(a.size()); ++i) {
               dp[0] = dp[0] && a[i-1] == target[i-1];
               for (int j = 1; j <= static_cast<int>(b.size()); ++j)
                   dp[j] = (dp[j] && a[i-1] == target[i+j-1]) ||
                           (dp[j-1] && b[j-1] == target[i+j-1]);
           }
           return dp[b.size()];
       }

   public:
       bool isInterleave(std::string s1, std::string s2, std::string s3) {
           if (s1.size() + s2.size() != s3.size()) return false;
           return rollingDp(s1,s2,s3);
       }
   };

题解
----

朴素递归为什么会重复
~~~~~~~~~~~~~~~~~~

当两个来源当前字符都等于目标字符时，递归会分成两支。不同选择序列可能再次到达相同的消费量 ``(i,j)``，此后剩余问题完全相同，却被重复搜索，最坏呈指数增长。

双前缀状态保存什么
~~~~~~~~~~~~~~~~~~

定义 ``state(i,j)``：``s1`` 前 ``i`` 个字符与 ``s2`` 前 ``j`` 个字符，能否组成 ``s3`` 前 ``i+j`` 个字符。两个消费量已确定目标下标，不需要额外记录 ``s3`` 位置。

最后字符为何只有两个来源
~~~~~~~~~~~~~~~~~~~~~~~~

任意非空合法交错前缀的最后字符要么是 ``s1[i-1]``，要么是 ``s2[j-1]``：

.. code-block:: text

   state(i,j) =
       state(i-1,j) AND s1[i-1] == s3[i+j-1]
       OR
       state(i,j-1) AND s2[j-1] == s3[i+j-1]

两类来源覆盖全部方案；即使字符值相同，它们仍代表消费不同来源位置的状态路径。

长度检查为何必须先做
~~~~~~~~~~~~~~~~~~~~

交错过程不删除、不复制字符。若 ``len(s1)+len(s2) != len(s3)``，不可能同时使用全部来源字符并恰好生成目标，可以在读取任何目标下标前直接失败。

初始化如何处理空来源
~~~~~~~~~~~~~~~~~~~~

``state(0,0)=true``。第一行只能从 ``s2`` 连续取字符，因此依赖左邻居；第一列只能从 ``s1`` 连续取字符，因此依赖上邻居。字符首次不匹配后，后续同一边界状态都保持假。

一行数组为何要从左向右更新
~~~~~~~~~~~~~~~~~~~~~~~~~~

进入新行时，``dp[j]`` 是上一行的 ``state(i-1,j)``；从左向右更新后，``dp[j-1]`` 已是当前行的 ``state(i,j-1)``。这正好对应两个来源。若从右向左更新，左邻居仍是上一行状态，转移语义错误。

状态演化的关键分叉
~~~~~~~~~~~~~~~~~~

当两个来源当前字符相同时，局部选择不能靠字符值决定。例如 ``s1="ab"``、``s2="ab"``、``s3="aabb"``：目标前两个 ``a`` 可以分别来自两个来源，处理到第三个字符时两个来源的当前字符又都是 ``b``。DP 不贪心选择某一来源，而是保留所有可达的 ``(i,j)``；后续字符会自动淘汰无法继续匹配的路径，因此不会因局部同字符选择而错过答案。

为什么最终状态充分
~~~~~~~~~~~~~~~~~~

按 ``i+j`` 归纳：基础空前缀正确；转移只从已正确形成更短目标前缀的状态追加一个匹配字符，因此得到合法交错。反之任意合法交错的最后字符必来自某一来源，删除它后得到对应前驱状态，所以不会遗漏。

复杂度来源
~~~~~~~~~~

状态数 ``(m+1)(n+1)``，每个状态常数转移，时间 ``O(mn)``。完整 DP 和记忆化使用 ``O(mn)`` 空间；把较短字符串作为列后，一行 DP 使用 ``O(min(m,n))`` 空间。

九语言实现
----------

C
~

.. code-block:: c

   bool isInterleave(char*a,char*b,char*t){int m=strlen(a),n=strlen(b);if(m+n!=(int)strlen(t))return false;if(n>m){char*x=a;a=b;b=x;int z=m;m=n;n=z;}bool*dp=calloc(n+1,sizeof(bool));dp[0]=true;for(int j=1;j<=n;j++)dp[j]=dp[j-1]&&b[j-1]==t[j-1];for(int i=1;i<=m;i++){dp[0]=dp[0]&&a[i-1]==t[i-1];for(int j=1;j<=n;j++)dp[j]=(dp[j]&&a[i-1]==t[i+j-1])||(dp[j-1]&&b[j-1]==t[i+j-1]);}bool out=dp[n];free(dp);return out;}

Python
~~~~~~

.. code-block:: python

   class Solution:
       def isInterleave(self, a: str, b: str, target: str) -> bool:
           if len(a)+len(b)!=len(target): return False
           if len(b)>len(a): a,b=b,a
           dp=[False]*(len(b)+1);dp[0]=True
           for j in range(1,len(b)+1):dp[j]=dp[j-1] and b[j-1]==target[j-1]
           for i in range(1,len(a)+1):
               dp[0]=dp[0] and a[i-1]==target[i-1]
               for j in range(1,len(b)+1):dp[j]=(dp[j] and a[i-1]==target[i+j-1]) or (dp[j-1] and b[j-1]==target[i+j-1])
           return dp[-1]

Java
~~~~

.. code-block:: java

   class Solution {public boolean isInterleave(String a,String b,String t){if(a.length()+b.length()!=t.length())return false;if(b.length()>a.length()){String x=a;a=b;b=x;}boolean[]dp=new boolean[b.length()+1];dp[0]=true;for(int j=1;j<=b.length();j++)dp[j]=dp[j-1]&&b.charAt(j-1)==t.charAt(j-1);for(int i=1;i<=a.length();i++){dp[0]&=a.charAt(i-1)==t.charAt(i-1);for(int j=1;j<=b.length();j++)dp[j]=dp[j]&&a.charAt(i-1)==t.charAt(i+j-1)||dp[j-1]&&b.charAt(j-1)==t.charAt(i+j-1);}return dp[b.length()];}}

Rust
~~~~

.. code-block:: rust

   impl Solution {pub fn is_interleave(mut a:String,mut b:String,t:String)->bool{if a.len()+b.len()!=t.len(){return false}if b.len()>a.len(){std::mem::swap(&mut a,&mut b)}let(a,b,t)=(a.as_bytes(),b.as_bytes(),t.as_bytes());let mut dp=vec![false;b.len()+1];dp[0]=true;for j in 1..=b.len(){dp[j]=dp[j-1]&&b[j-1]==t[j-1]}for i in 1..=a.len(){dp[0]=dp[0]&&a[i-1]==t[i-1];for j in 1..=b.len(){dp[j]=dp[j]&&a[i-1]==t[i+j-1]||dp[j-1]&&b[j-1]==t[i+j-1]}}dp[b.len()]}}

Go
~~

.. code-block:: go

   func isInterleave(a,b,t string)bool{if len(a)+len(b)!=len(t){return false};if len(b)>len(a){a,b=b,a};dp:=make([]bool,len(b)+1);dp[0]=true;for j:=1;j<=len(b);j++{dp[j]=dp[j-1]&&b[j-1]==t[j-1]};for i:=1;i<=len(a);i++{dp[0]=dp[0]&&a[i-1]==t[i-1];for j:=1;j<=len(b);j++{dp[j]=dp[j]&&a[i-1]==t[i+j-1]||dp[j-1]&&b[j-1]==t[i+j-1]}};return dp[len(b)]}

TypeScript
~~~~~~~~~~

.. code-block:: typescript

   function isInterleave(a:string,b:string,t:string):boolean{if(a.length+b.length!==t.length)return false;if(b.length>a.length)[a,b]=[b,a];const dp=Array(b.length+1).fill(false);dp[0]=true;for(let j=1;j<=b.length;j++)dp[j]=dp[j-1]&&b[j-1]===t[j-1];for(let i=1;i<=a.length;i++){dp[0]=dp[0]&&a[i-1]===t[i-1];for(let j=1;j<=b.length;j++)dp[j]=dp[j]&&a[i-1]===t[i+j-1]||dp[j-1]&&b[j-1]===t[i+j-1];}return dp[b.length];}

C#
~~

.. code-block:: csharp

   public class Solution {public bool IsInterleave(string a,string b,string t){if(a.Length+b.Length!=t.Length)return false;if(b.Length>a.Length)(a,b)=(b,a);bool[]dp=new bool[b.Length+1];dp[0]=true;for(int j=1;j<=b.Length;j++)dp[j]=dp[j-1]&&b[j-1]==t[j-1];for(int i=1;i<=a.Length;i++){dp[0]=dp[0]&&a[i-1]==t[i-1];for(int j=1;j<=b.Length;j++)dp[j]=dp[j]&&a[i-1]==t[i+j-1]||dp[j-1]&&b[j-1]==t[i+j-1];}return dp[b.Length];}}

Julia
~~~~~

.. code-block:: julia

   function is_interleave(a::String,b::String,t::String)
       aa=codeunits(a);bb=codeunits(b);tt=codeunits(t);length(aa)+length(bb)!=length(tt)&&return false;if length(bb)>length(aa);aa,bb=bb,aa;end
       dp=falses(length(bb)+1);dp[1]=true;for j in 1:length(bb);dp[j+1]=dp[j]&&bb[j]==tt[j];end
       for i in 1:length(aa);dp[1]=dp[1]&&aa[i]==tt[i];for j in 1:length(bb);dp[j+1]=(dp[j+1]&&aa[i]==tt[i+j])||(dp[j]&&bb[j]==tt[i+j]);end;end;dp[end]
   end

R
~

.. code-block:: r

   is_interleave <- function(a,b,t){x<-utf8ToInt(a);y<-utf8ToInt(b);z<-utf8ToInt(t);if(length(x)+length(y)!=length(z))return(FALSE);if(length(y)>length(x)){tmp<-x;x<-y;y<-tmp};dp<-rep(FALSE,length(y)+1L);dp[[1L]]<-TRUE;if(length(y)>0L)for(j in seq_along(y))dp[[j+1L]]<-dp[[j]]&&y[[j]]==z[[j]];if(length(x)>0L)for(i in seq_along(x)){dp[[1L]]<-dp[[1L]]&&x[[i]]==z[[i]];if(length(y)>0L)for(j in seq_along(y))dp[[j+1L]]<-(dp[[j+1L]]&&x[[i]]==z[[i+j]])||(dp[[j]]&&y[[j]]==z[[i+j]])};dp[[length(y)+1L]]}
