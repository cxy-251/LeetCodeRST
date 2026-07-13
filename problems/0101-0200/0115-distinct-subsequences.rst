0115. Distinct Subsequences
===========================

题目信息
--------

:题号: 0115
:难度: Hard
:主题: 字符串、动态规划、计数
:原题: `LeetCode 0115 <https://leetcode.com/problems/distinct-subsequences/>`_
:访问状态: Available
:教学重点: 一维 DP 逆序更新

题目重述
--------

给定字符串 ``s`` 和 ``t``，计算从 ``s`` 删除若干字符后得到 ``t`` 的不同下标选择方案数。

自建示例
--------

.. code-block:: text

   输入：s = "rabbbit", t = "rabbit"
   输出：3

   输入：s = "babgbag", t = "bag"
   输出：5

问题抽象
--------

``dp[j]`` 表示当前扫描前缀中形成 ``t[0:j]`` 的方案数。扫描 ``s`` 的字符时从右向左更新，相等则 ``dp[j] += dp[j-1]``。

主解法：一维计数 DP
-------------

思路
~~~~

一维计数 DP。 一维 DP 逆序更新

核心状态与不变量
~~~~~~~~~~~~~~~~

``dp[j]`` 表示当前扫描前缀中形成 ``t[0:j]`` 的方案数。扫描 ``s`` 的字符时从右向左更新，相等则 ``dp[j] += dp[j-1]``。

正确性依据
~~~~~~~~~~

每个方案对当前字符只有不用或用作目标第 ``j`` 个字符两类互斥选择。逆序更新保证 ``dp[j-1]`` 仍来自上一轮前缀，因此递推完整且无重复。

复杂度与语言边界
~~~~~~~~~~~~~~~~

设 ``m=|s|``、``n=|t|``。时间 ``O(mn)``，DP ``O(n)``；字符适配器可能另有 ``O(m+n)`` 物化。

核心语言实现
------------

C
~

.. code-block:: c

   #include <stdlib.h>
   long long numDistinct(char*s,char*t) {
       int n=0;
       while(t[n])n++;
       long long*dp=calloc((size_t)n+1,sizeof(*dp));
       dp[0]=1;
       for(int i=0;s[i];i++)for(int j=n;j>=1;j--)if(s[i]==t[j-1])dp[j]+=dp[j-1];
       long long ans=dp[n];
       free(dp);
       return ans;
   }
C++
~~~

.. code-block:: cpp

   class Solution {
       public:unsigned long long numDistinct(string s,string t) {
           vector<unsigned long long>dp(t.size()+1);
           dp[0]=1;
           for(char c:s)for(int j=t.size();j>=1;--j)if(c==t[j-1])dp[j]+=dp[j-1];
           return dp.back();
       }
   };
Python
~~~~~~

.. code-block:: python

   class Solution:

       def numDistinct(self, s: str, t: str) -> int:
           dp = [1] + [0] * len(t)
           for c in s:
               for j in range(len(t), 0, -1):
                   if c == t[j - 1]:
                       dp[j] += dp[j - 1]
           return dp[-1]
Java
~~~~

.. code-block:: java

   class Solution {
       public int numDistinct(String s,String t) {
           long[]dp=new long[t.length()+1];
           dp[0]=1;
           for(int i=0;i<s.length();i++)for(int
               j=t.length();j>=1;j--)if(s.charAt(i)==t.charAt(j-1))dp[j]+=dp[j-1];
           return (int)dp[t.length()];
       }
   }
Rust
~~~~

.. code-block:: rust

   impl Solution {
       pub fn num_distinct(s:String,t:String)->i32 {
           let(s,t)=(s.as_bytes(),t.as_bytes());
           let mut dp=vec![0u64;
           t.len()+1];
           dp[0]=1;
           for &c in s {
               for j in(1..=t.len()).rev() {
                   if c==t[j-1] {
                       dp[j]+=dp[j-1];
                   }
               }
           }
           dp[t.len()]as i32
       }
   }
Go
~~

.. code-block:: go

   func numDistinct(s, t string) int {
   	dp := make([]uint64, len(t)+1)
   	dp[0] = 1
   	for i := 0; i < len(s); i++ {
   		for j := len(t); j >= 1; j-- {
   			if s[i] == t[j-1] {
   				dp[j] += dp[j-1]
   			}
   		}
   	}
   	return int(dp[len(t)])
   }
TypeScript
~~~~~~~~~~

.. code-block:: typescript

   function numDistinct(s: string, t: string): number {
       const dp = Array(t.length + 1).fill(0);
       dp[0] = 1;
       for (const c of s)
           for (let j = t.length; j >= 1; j--)
               if (c === t[j - 1])
                   dp[j] += dp[j -
                       1];
       return dp[t.length];
   }
C#
~~

.. code-block:: csharp

   public class Solution {
       public int NumDistinct(string s,string t) {
           long[]dp=new long[t.Length+1];
           dp[0]=1;
           foreach(char c in s)for(int j=t.Length;j>=1;--j)if(c==t[j-1])dp[j]+=dp[j-1];
           return(int)dp[t.Length];
       }
   }
Julia
~~~~~

.. code-block:: julia

   function num_distinct(s::String,t::String)::Int
       a=codeunits(s)
       b=codeunits(t)
       dp=zeros(Int,length(b)+1)
       dp[1]=1
       for c in a, j in (length(b)+1):-1:2
           c==b[j-1]&&(dp[j]+=dp[j-1])
       end
       dp[end]
   end
R
~

.. code-block:: r

   num_distinct <- function(s,t) {
       a<-utf8ToInt(s)
       b<-utf8ToInt(t)
       dp<-numeric(length(b)+1L)
       dp[[1L]]<-1
       for(c in a)if(length(b)>0L)for(j in
       seq.int(length(b)+1L,2L,by=-1L))if(c==b[[j-1L]])dp[[j]]<-dp[[j]]+dp[[j-1L]]
       dp[[length(dp)]]
   }
验证计划与证据
--------------

* 固定用例覆盖正常输入、最小输入、退化结构和无解路径；
* 对小规模输入使用独立暴力或枚举基准进行静态对拍设计；
* 检查十语言函数签名、空值、下标、所有权和返回结构；
* 当前批次对 C、C++、Java、Go、TypeScript 执行编译或严格类型检查，对 Python 执行语法解析；Rust、C#、Julia、R 完成接口、括号、作用域和所有权静态检查。

关键边界
--------

* 空目标有 1 种方案。
* 源串短于目标时答案为 0。
* 计数类型必须容纳平台保证的答案范围。

易错点
------

* 正序更新会在同一源字符上重复使用。
* 把不同下标方案误按结果字符串去重。

本题新增知识
------------

* 一维 DP 逆序更新
* 题号 0115 的主解法状态与证明

本题强化知识
------------

* 十语言接口一致性与边界契约
* 递归栈、输出载荷和语言适配器成本分层

关联题目
--------

* `0097. Interleaving String <../0001-0100/0097-interleaving-string.rst>`_；
* `0139. Word Break <0139-word-break.rst>`_；

最小自检
--------

#. ``一维计数 DP`` 维护的核心状态是什么？
#. 终止条件为什么与题目目标等价？
#. 哪个边界最容易造成跨语言接口差异？
#. 复杂度是否包含递归栈、返回结果和语言适配器？

答案要点
~~~~~~~~

每个方案对当前字符只有不用或用作目标第 ``j`` 个字符两类互斥选择。逆序更新保证 ``dp[j-1]`` 仍来自上一轮前缀，因此递推完整且无重复。
