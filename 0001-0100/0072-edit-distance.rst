0072. Edit Distance
===================

题目信息
--------

:题号: 0072
:难度: Medium
:主题: 字符串、动态规划、状态压缩
:原题: `LeetCode 0072 <https://leetcode.com/problems/edit-distance/>`_
:重点: 插入删除替换、前缀状态、空串边界、最少操作数

题目重述
--------

给定字符串 ``word1`` 和 ``word2``，每次可以插入一个字符、删除一个字符或替换一个字符。返回把 ``word1`` 转换为 ``word2`` 所需的最少操作次数。

约束为 ``0 <= word1.length, word2.length <= 500``，两个字符串只包含小写英文字母。

自建示例
--------

.. code-block:: text

   输入：word1 = "stone", word2 = "money"
   输出：3

可以把 ``s`` 替换为 ``m``，删除 ``t``，再把末尾 ``e`` 替换为 ``y``，共 3 次操作。

.. code-block:: text

   输入：word1 = "abc", word2 = "yabd"
   输出：2

在开头插入 ``y``，再把 ``c`` 替换为 ``d``。

C++ 实现
--------

.. code-block:: cpp

   #include <algorithm>
   #include <string>
   #include <vector>

   class Solution {
   private:
       int plainRecursion(const std::string& a, const std::string& b, int i, int j) {
           if (i == 0) return j;
           if (j == 0) return i;
           if (a[i - 1] == b[j - 1]) return plainRecursion(a, b, i - 1, j - 1);
           return 1 + std::min({
               plainRecursion(a, b, i - 1, j - 1),
               plainRecursion(a, b, i - 1, j),
               plainRecursion(a, b, i, j - 1)
           });
       }

       int memoDfs(const std::string& a, const std::string& b, int i, int j,
                   std::vector<std::vector<int>>& memo) {
           if (i == 0) return j;
           if (j == 0) return i;
           int& cached = memo[i][j];
           if (cached != -1) return cached;
           if (a[i - 1] == b[j - 1]) return cached = memoDfs(a, b, i - 1, j - 1, memo);
           return cached = 1 + std::min({
               memoDfs(a, b, i - 1, j - 1, memo),
               memoDfs(a, b, i - 1, j, memo),
               memoDfs(a, b, i, j - 1, memo)
           });
       }

       int tableDp(const std::string& a, const std::string& b) {
           int m = a.size(), n = b.size();
           std::vector<std::vector<int>> dp(m + 1, std::vector<int>(n + 1));
           for (int i = 0; i <= m; ++i) dp[i][0] = i;
           for (int j = 0; j <= n; ++j) dp[0][j] = j;
           for (int i = 1; i <= m; ++i)
               for (int j = 1; j <= n; ++j)
                   dp[i][j] = a[i - 1] == b[j - 1]
                       ? dp[i - 1][j - 1]
                       : 1 + std::min({dp[i - 1][j - 1], dp[i - 1][j], dp[i][j - 1]});
           return dp[m][n];
       }

       int rollingDp(const std::string& a, const std::string& b) {
           if (b.size() > a.size()) return rollingDp(b, a);
           int m = a.size(), n = b.size();
           std::vector<int> dp(n + 1);
           for (int j = 0; j <= n; ++j) dp[j] = j;
           for (int i = 1; i <= m; ++i) {
               int diagonal = dp[0];
               dp[0] = i;
               for (int j = 1; j <= n; ++j) {
                   int up = dp[j];
                   if (a[i - 1] == b[j - 1]) dp[j] = diagonal;
                   else dp[j] = 1 + std::min({diagonal, up, dp[j - 1]});
                   diagonal = up;
               }
           }
           return dp[n];
       }

   public:
       int minDistance(std::string word1, std::string word2) {
           return rollingDp(word1, word2);
       }
   };

题解
----

递归为什么重复
~~~~~~~~~~~~~~

从两个字符串末尾考虑，字符不同时可尝试替换、删除或插入。不同操作序列会反复到达相同的前缀长度对 ``(i,j)``，朴素递归形成指数级分支。

前缀状态保存什么
~~~~~~~~~~~~~~~~

定义 ``dp[i][j]`` 为把 ``word1`` 前 ``i`` 个字符变成 ``word2`` 前 ``j`` 个字符的最少操作数。状态只关心已处理前缀，不需要保存具体操作历史。

空串边界为何是长度
~~~~~~~~~~~~~~~~~~

把长度为 ``i`` 的前缀变为空串只能删除 ``i`` 次；把空串变成长度为 ``j`` 的前缀只能插入 ``j`` 次，所以 ``dp[i][0]=i``、``dp[0][j]=j``。

三种末操作如何对应旧状态
~~~~~~~~~~~~~~~~~~~~~~~~

若末字符相同，不需要新操作，直接继承 ``dp[i-1][j-1]``。若不同：替换来自左上；删除 ``word1`` 末字符来自上方；向 ``word1`` 末尾插入目标字符来自左方。

.. code-block:: text

   dp[i][j] = 1 + min(
       dp[i-1][j-1],  替换
       dp[i-1][j],    删除
       dp[i][j-1]     插入
   )

为什么只看最后一步就完整
~~~~~~~~~~~~~~~~~~~~~~~~

任意最优编辑序列的最后一步必属于三类之一。删除最后一步后，剩余部分必须是对应前缀子问题的最优解，否则替换为更短编辑序列可继续改进原答案。

一维数组中三个旧值在哪里
~~~~~~~~~~~~~~~~~~~~~~~~

逐行从左向右更新：覆盖前 ``dp[j]`` 是上方；更新后的 ``dp[j-1]`` 是左方；变量 ``diagonal`` 保存覆盖前的左上。每轮结束把旧上方交给下一列作为新对角。

.. list-table::
   :header-rows: 1

   * - 名称
     - 二维位置
     - 一维来源
   * - 替换/匹配
     - ``dp[i-1][j-1]``
     - ``diagonal``
   * - 删除
     - ``dp[i-1][j]``
     - 覆盖前 ``dp[j]``
   * - 插入
     - ``dp[i][j-1]``
     - 更新后 ``dp[j-1]``

为什么交换字符串可节省空间
~~~~~~~~~~~~~~~~~~~~~~~~~~

滚动数组长度由第二个字符串决定。若让较短字符串作为列，空间从 ``O(n)`` 收缩为 ``O(min(m,n))``；编辑距离对交换两个字符串对称，结果不变。

复杂度来源
~~~~~~~~~~

朴素递归指数级；记忆化和二维 DP 为 ``O(mn)`` 时间、``O(mn)`` 空间；一维压缩仍为 ``O(mn)`` 时间，空间 ``O(min(m,n))``。

九语言实现
----------

C
~

.. code-block:: c

   int minDistance(char*a,char*b){int m=strlen(a),n=strlen(b);int*dp=malloc((n+1)*sizeof(int));for(int j=0;j<=n;j++)dp[j]=j;for(int i=1;i<=m;i++){int diag=dp[0];dp[0]=i;for(int j=1;j<=n;j++){int up=dp[j];dp[j]=a[i-1]==b[j-1]?diag:1+fmin(diag,fmin(up,dp[j-1]));diag=up;}}int ans=dp[n];free(dp);return ans;}

Python
~~~~~~

.. code-block:: python

   class Solution:
       def minDistance(self, a: str, b: str) -> int:
           if len(b)>len(a): a,b=b,a
           dp=list(range(len(b)+1))
           for i,x in enumerate(a,1):
               diagonal=dp[0];dp[0]=i
               for j,y in enumerate(b,1):
                   up=dp[j];dp[j]=diagonal if x==y else 1+min(diagonal,up,dp[j-1]);diagonal=up
           return dp[-1]

Java
~~~~

.. code-block:: java

   class Solution {public int minDistance(String a,String b){int[]dp=new int[b.length()+1];for(int j=0;j<dp.length;j++)dp[j]=j;for(int i=1;i<=a.length();i++){int diag=dp[0];dp[0]=i;for(int j=1;j<=b.length();j++){int up=dp[j];dp[j]=a.charAt(i-1)==b.charAt(j-1)?diag:1+Math.min(diag,Math.min(up,dp[j-1]));diag=up;}}return dp[b.length()];}}

Rust
~~~~

.. code-block:: rust

   impl Solution {pub fn min_distance(a:String,b:String)->i32{let(a,b)=(a.as_bytes(),b.as_bytes());let mut dp:Vec<i32>=(0..=b.len()as i32).collect();for i in 1..=a.len(){let mut diag=dp[0];dp[0]=i as i32;for j in 1..=b.len(){let up=dp[j];dp[j]=if a[i-1]==b[j-1]{diag}else{1+diag.min(up.min(dp[j-1]))};diag=up}}dp[b.len()]}}

Go
~~

.. code-block:: go

   func minDistance(a,b string)int{dp:=make([]int,len(b)+1);for j:=range dp{dp[j]=j};for i:=1;i<=len(a);i++{diag:=dp[0];dp[0]=i;for j:=1;j<=len(b);j++{up:=dp[j];if a[i-1]==b[j-1]{dp[j]=diag}else{dp[j]=1+min(diag,min(up,dp[j-1]))};diag=up}};return dp[len(b)]}

TypeScript
~~~~~~~~~~

.. code-block:: typescript

   function minDistance(a:string,b:string):number{const dp=Array.from({length:b.length+1},(_,i)=>i);for(let i=1;i<=a.length;i++){let diag=dp[0];dp[0]=i;for(let j=1;j<=b.length;j++){const up=dp[j];dp[j]=a[i-1]===b[j-1]?diag:1+Math.min(diag,up,dp[j-1]);diag=up;}}return dp[b.length];}

C#
~~

.. code-block:: csharp

   public class Solution {public int MinDistance(string a,string b){int[]dp=new int[b.Length+1];for(int j=0;j<dp.Length;j++)dp[j]=j;for(int i=1;i<=a.Length;i++){int diag=dp[0];dp[0]=i;for(int j=1;j<=b.Length;j++){int up=dp[j];dp[j]=a[i-1]==b[j-1]?diag:1+Math.Min(diag,Math.Min(up,dp[j-1]));diag=up;}}return dp[^1];}}

Julia
~~~~~

.. code-block:: julia

   function min_distance(a::String,b::String)
       x=collect(a);y=collect(b);dp=collect(0:length(y))
       for i in eachindex(x);diag=dp[1];dp[1]=i;for j in eachindex(y);up=dp[j+1];dp[j+1]=x[i]==y[j] ? diag : 1+min(diag,up,dp[j]);diag=up;end;end
       dp[end]
   end

R
~

.. code-block:: r

   min_distance <- function(a,b){x<-strsplit(a,"",fixed=TRUE)[[1]];y<-strsplit(b,"",fixed=TRUE)[[1]];dp<-0:length(y);if(length(x)>0)for(i in seq_along(x)){diag<-dp[[1]];dp[[1]]<-i;if(length(y)>0)for(j in seq_along(y)){up<-dp[[j+1L]];dp[[j+1L]]<-if(x[[i]]==y[[j]])diag else 1L+min(diag,up,dp[[j]]);diag<-up}};dp[[length(dp)]]}
