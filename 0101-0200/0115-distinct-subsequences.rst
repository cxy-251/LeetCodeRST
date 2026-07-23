0115. Distinct Subsequences
===========================

题目信息
--------

:题号: 0115
:难度: Hard
:主题: 字符串、动态规划、组合计数、滚动数组
:原题: `LeetCode 0115 <https://leetcode.com/problems/distinct-subsequences/>`_
:重点: 使用或跳过、前缀计数、逆序覆盖、中间计数饱和

题目重述
--------

给定字符串 ``s`` 和 ``t``，统计从 ``s`` 删除若干字符且保持相对顺序后得到 ``t`` 的方案数。不同方案按保留的 ``s`` 下标集合区分，即使字符值相同也可能是不同方案。最终答案保证适合 32 位有符号整数。

自建示例
--------

.. code-block:: text

   s = "rabbbit", t = "rabbit" -> 3
   三个 b 中选择两个，删除位置不同形成三种方案。

.. code-block:: text

   s = "aaaaa", t = "aa" -> 10
   等价于从 5 个下标中选择 2 个。

C++ 实现
--------

.. code-block:: cpp

   #include <algorithm>
   #include <climits>
   #include <string>
   #include <vector>

   class Solution {
   private:
       long long memoDfs(const std::string& s, const std::string& t,
                         int i, int j,
                         std::vector<std::vector<long long>>& memo) {
           if (j == static_cast<int>(t.size())) return 1;
           if (static_cast<int>(s.size()) - i < static_cast<int>(t.size()) - j)
               return 0;
           long long& cached = memo[i][j];
           if (cached != -1) return cached;
           long long ways = memoDfs(s, t, i + 1, j, memo);
           if (s[i] == t[j]) ways += memoDfs(s, t, i + 1, j + 1, memo);
           return cached = ways;
       }

       int tableDp(const std::string& s, const std::string& t) {
           int n = s.size(), m = t.size();
           std::vector<std::vector<unsigned long long>> dp(
               n + 1, std::vector<unsigned long long>(m + 1));
           for (int i = 0; i <= n; ++i) dp[i][0] = 1;
           for (int i = 1; i <= n; ++i)
               for (int j = 1; j <= m; ++j) {
                   dp[i][j] = dp[i - 1][j];
                   if (s[i - 1] == t[j - 1]) dp[i][j] += dp[i - 1][j - 1];
               }
           return static_cast<int>(dp[n][m]);
       }

       int rollingDp(const std::string& s, const std::string& t) {
           if (t.size() > s.size()) return 0;
           const unsigned long long limit =
               static_cast<unsigned long long>(INT_MAX) + 1;
           std::vector<unsigned long long> dp(t.size() + 1);
           dp[0] = 1;
           for (char source : s) {
               for (int j = static_cast<int>(t.size()); j >= 1; --j) {
                   if (source == t[j - 1])
                       dp[j] = std::min(limit, dp[j] + dp[j - 1]);
               }
           }
           return static_cast<int>(dp[t.size()]);
       }

   public:
       int numDistinct(std::string s, std::string t) {
           return rollingDp(s, t);
       }
   };

题解
----

方案为什么按下标而不是字符值区分
~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

删除操作选择的是源字符串位置。两个相同字符若来自不同下标，后续可选位置范围也不同，因此必须分别计数，不能把重复字符压成一个值。

二维前缀状态
~~~~~~~~~~~~

定义 ``dp[i][j]``：使用 ``s`` 前 ``i`` 个字符形成 ``t`` 前 ``j`` 个字符的方案数。空目标只有一种方案——删除全部已处理源字符，所以 ``dp[i][0]=1``；非空目标无法由空源形成，``dp[0][j]=0``。

使用或跳过如何划分全部方案
~~~~~~~~~~~~~~~~~~~~~~~~~~

观察源前缀最后字符 ``s[i-1]``：

* 不使用它：方案数 ``dp[i-1][j]``；
* 若它等于 ``t[j-1]``，把它作为目标最后字符：方案数 ``dp[i-1][j-1]``。

两类方案按是否包含下标 ``i-1`` 划分，互斥且覆盖全部可能，因此可以直接相加。

.. code-block:: text

   dp[i][j] = dp[i-1][j]
   if s[i-1] == t[j-1]:
       dp[i][j] += dp[i-1][j-1]

一维数组为什么必须逆序更新
~~~~~~~~~~~~~~~~~~~~~~~~~~

处理一个新的源字符时，``dp[j]`` 应读取上一轮的 ``dp[j-1]``。若从左向右更新，``dp[j-1]`` 已经包含当前源字符，当前字符可能在同一方案中被使用两次。逆序更新保证右侧读取的左邻居仍属于旧源前缀。

.. list-table::
   :header-rows: 1

   * - 处理源字符
     - 目标状态更新
     - 含义
   * - ``r``
     - ``dp[1] += dp[0]``
     - 用当前 r 形成目标 r
   * - 第一个 ``b``
     - 更新目标第一个 b
     - 当前下标可被选
   * - 后续 ``b``
     - 从右向左累加
     - 不会在一次更新中重复使用同一下标

目标更长为何可以立即返回 0
~~~~~~~~~~~~~~~~~~~~~~~~~~

子序列不能增加字符数量。若 ``len(t) > len(s)``，无法选择足够多的源下标，不需要建立状态数组。

为什么需要处理巨大中间状态
~~~~~~~~~~~~~~~~~~~~~~~~~~

题目只保证最终 ``dp[m]`` 适合 32 位，较短目标前缀的方案数仍可能非常大。固定宽语言把状态饱和到 ``INT_MAX+1``。转移只有非负加法；若一个饱和状态真正贡献到最终状态，后续计数也会超过 32 位，与最终答案保证矛盾。因此饱和不会改变合法最终答案，却能避免溢出。

为什么最终状态正确
~~~~~~~~~~~~~~~~~~

按源前缀长度归纳。基础行和列正确；每次转移把全部方案按是否使用当前下标唯一划分，并从已经正确的更短源前缀状态累加。处理完整 ``s`` 后，``dp[len(t)]`` 正是全部合法下标序列数量。

复杂度来源
~~~~~~~~~~

设 ``n=len(s)``、``m=len(t)``。二维和一维 DP 时间均为 ``O(nm)``；二维空间 ``O(nm)``，一维逆序状态空间 ``O(m)``。记忆化最多访问相同数量的状态并使用递归栈。

九语言实现
----------

C
~

.. code-block:: c

   int numDistinct(char*s,char*t){int n=strlen(s),m=strlen(t);if(m>n)return 0;unsigned long long limit=2147483648ULL,*dp=calloc((size_t)m+1,sizeof(*dp));dp[0]=1;for(int i=0;i<n;i++)for(int j=m;j>=1;j--)if(s[i]==t[j-1]){unsigned long long x=dp[j]+dp[j-1];dp[j]=x>limit?limit:x;}int out=(int)dp[m];free(dp);return out;}

Python
~~~~~~

.. code-block:: python

   class Solution:
       def numDistinct(self, s: str, t: str) -> int:
           if len(t) > len(s): return 0
           dp = [1] + [0] * len(t)
           for source in s:
               for j in range(len(t), 0, -1):
                   if source == t[j - 1]: dp[j] += dp[j - 1]
           return dp[-1]

Java
~~~~

.. code-block:: java

   class Solution {public int numDistinct(String s,String t){if(t.length()>s.length())return 0;long limit=2147483648L;long[]dp=new long[t.length()+1];dp[0]=1;for(int i=0;i<s.length();i++)for(int j=t.length();j>=1;j--)if(s.charAt(i)==t.charAt(j-1))dp[j]=Math.min(limit,dp[j]+dp[j-1]);return(int)dp[t.length()];}}

Rust
~~~~

.. code-block:: rust

   impl Solution {pub fn num_distinct(s:String,t:String)->i32{if t.len()>s.len(){return 0}let(a,b)=(s.as_bytes(),t.as_bytes());let mut dp=vec![0u64;b.len()+1];dp[0]=1;for &x in a{for j in(1..=b.len()).rev(){if x==b[j-1]{dp[j]=(dp[j]+dp[j-1]).min(i32::MAX as u64+1)}}}dp[b.len()]as i32}}

Go
~~

.. code-block:: go

   func numDistinct(s,t string)int{if len(t)>len(s){return 0};const limit int64=2147483648;dp:=make([]int64,len(t)+1);dp[0]=1;for i:=range s{for j:=len(t);j>=1;j--{if s[i]==t[j-1]{dp[j]+=dp[j-1];if dp[j]>limit{dp[j]=limit}}}};return int(dp[len(t)])}

TypeScript
~~~~~~~~~~

.. code-block:: typescript

   function numDistinct(s:string,t:string):number{if(t.length>s.length)return 0;const limit=2147483648,dp=Array(t.length+1).fill(0);dp[0]=1;for(const x of s)for(let j=t.length;j>=1;j--)if(x===t[j-1])dp[j]=Math.min(limit,dp[j]+dp[j-1]);return dp[t.length];}

C#
~~

.. code-block:: csharp

   public class Solution {public int NumDistinct(string s,string t){if(t.Length>s.Length)return 0;const long limit=2147483648L;var dp=new long[t.Length+1];dp[0]=1;foreach(char x in s)for(int j=t.Length;j>=1;j--)if(x==t[j-1])dp[j]=Math.Min(limit,dp[j]+dp[j-1]);return(int)dp[t.Length];}}

Julia
~~~~~

.. code-block:: julia

   function num_distinct(s::String,t::String)
       a=collect(s);b=collect(t);length(b)>length(a)&&return 0;limit=Int64(2147483648);dp=zeros(Int64,length(b)+1);dp[1]=1
       for x in a;for j in length(b):-1:1;if x==b[j];dp[j+1]=min(limit,dp[j+1]+dp[j]);end;end;end
       Int(dp[end])
   end

R
~

.. code-block:: r

   num_distinct <- function(s,t){a<-strsplit(s,"",fixed=TRUE)[[1L]];b<-strsplit(t,"",fixed=TRUE)[[1L]];if(length(b)>length(a))return(0L);limit<-2147483648;dp<-c(1,rep(0,length(b)));for(x in a)for(j in length(b):1L)if(x==b[[j]])dp[[j+1L]]<-min(limit,dp[[j+1L]]+dp[[j]]);as.integer(dp[[length(b)+1L]])}