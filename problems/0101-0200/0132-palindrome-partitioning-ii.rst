0132. Palindrome Partitioning II
================================

题目信息
--------

:题号: 0132
:难度: Hard
:主题: 字符串、动态规划
:原题: `LeetCode 0132 <https://leetcode.com/problems/palindrome-partitioning-ii/>`_
:访问状态: Available
:教学重点: 中心扩展更新最少切割

题目重述
--------

返回把字符串切成回文子串所需的最少切割次数。

自建示例
--------

.. code-block:: text

   输入：s = "aab"
   输出：1

问题抽象
--------

``cuts[i]`` 表示前 ``i`` 个字符最少切割，初始化 ``cuts[i]=i-1``。枚举每个奇偶回文中心，扩展得到区间 ``[l,r]``，更新 ``cuts[r+1]=min(cuts[r+1], cuts[l]+1)``。

主解法：中心扩展加前缀 DP
----------------

思路
~~~~

中心扩展加前缀 DP。 中心扩展更新最少切割

核心状态与不变量
~~~~~~~~~~~~~~~~

``cuts[i]`` 表示前 ``i`` 个字符最少切割，初始化 ``cuts[i]=i-1``。枚举每个奇偶回文中心，扩展得到区间 ``[l,r]``，更新 ``cuts[r+1]=min(cuts[r+1], cuts[l]+1)``。

正确性依据
~~~~~~~~~~

每个回文片段都会由唯一中心扩展枚举。若最优最后片段是 ``s[l:r]``，其前缀最优值加一次切割形成候选；所有候选取最小，归纳得到每个前缀最优。

复杂度与语言边界
~~~~~~~~~~~~~~~~

时间 ``O(n^2)``；DP ``O(n)``；字符适配器按语言另计。

核心语言实现
------------

C
~

.. code-block:: c

   #include <stdlib.h>
   #include <string.h>
   int minCut(char*s) {
       int n=strlen(s);
       if(!n)return 0;
       int*c=malloc((size_t)(n+1)*sizeof(*c));
       for(int i=0;i<=n;i++)c[i]=i-1;
       for(int m=0;m<n;m++) {
           for(int l=m,r=m;l>=0&&r<n&&s[l]==s[r];l--,r++)if(c[l]+1<c[r+1])c[r+1]=c[l]+1;
           for(int l=m,r=m+1;l>=0&&r<n&&s[l]==s[r];l--,r++)if(c[l]+1<c[r+1])c[r+1]=c[l]+1;
       }
       int a=c[n];
       free(c);
       return a;
   }
C++
~~~

.. code-block:: cpp

   class Solution {
       public:int minCut(string s) {
           int n=s.size();
           if(!n)return 0;
           vector<int>c(n+1);
           for(int i=0;i<=n;i++)c[i]=i-1;
           for(int m=0;m<n;m++) {
               for(int l=m,r=m;l>=0&&r<n&&s[l]==s[r];l--,r++)c[r+1]=min(c[r+1],c[l]+1);
               for(int l=m,r=m+1;l>=0&&r<n&&s[l]==s[r];l--,r++)c[r+1]=min(c[r+1],c[l]+1);
           }
           return c[n];
       }
   };
Python
~~~~~~

.. code-block:: python

   class Solution:

       def minCut(self, s: str) -> int:
           n = len(s)
           if n == 0:
               return 0
           cuts = [i - 1 for i in range(n + 1)]
           for m in range(n):
               l = r = m
               while l >= 0 and r < n and (s[l] == s[r]):
                   cuts[r + 1] = min(cuts[r + 1], cuts[l] + 1)
                   l -= 1
                   r += 1
               l, r = (m, m + 1)
               while l >= 0 and r < n and (s[l] == s[r]):
                   cuts[r + 1] = min(cuts[r + 1], cuts[l] + 1)
                   l -= 1
                   r += 1
           return cuts[n]
Java
~~~~

.. code-block:: java

   class Solution {
       public int minCut(String s) {
           int n=s.length();
           if(n==0)return 0;
           int[]c=new int[n+1];
           for(int i=0;i<=n;i++)c[i]=i-1;
           for(int m=0;m<n;m++) {
               for (int l = m, r = m; l >= 0 && r < n && s.charAt(l) == s.charAt(r); l--, r++) c[r
                   + 1] = Math.min(c[r + 1], c[l] + 1);
               for (int l = m, r = m + 1; l >= 0 && r < n && s.charAt(l) == s.charAt(r); l--, r++)
                   c[r + 1] = Math.min(c[r + 1], c[l] + 1);
           }
           return c[n];
       }
   }
Rust
~~~~

.. code-block:: rust

   impl Solution {
       pub fn min_cut(s:String)->i32 {
           let b=s.as_bytes();
           let n=b.len();
           if n==0 {
               return 0
           }
           let mut c:(Vec<i32>)=(0..=n).map(|i|i as i32-1).collect();
           for m in 0..n {
               let(mut l,mut r)=(m as isize,m);
               while l>=0&&r<n&&b[l as usize]==b[r] {
                   c[r+1]=c[r+1].min(c[l as usize]+1);
                   l-=1;
                   r+=1;
               }
               let(mut l,mut r)=(m as isize,m+1);
               while l>=0&&r<n&&b[l as usize]==b[r] {
                   c[r+1]=c[r+1].min(c[l as usize]+1);
                   l-=1;
                   r+=1;
               }
           }
           c[n]
       }
   }
Go
~~

.. code-block:: go

   func minCut(s string) int {
   	n := len(s)
   	if n == 0 {
   		return 0
   	}
   	c := make([]int, n+1)
   	for i := range c {
   		c[i] = i - 1
   	}
   	for m := 0; m < n; m++ {
   		for l, r := m, m; l >= 0 && r < n && s[l] == s[r]; l, r = l-1, r+1 {
   			if c[l]+1 < c[r+1] {
   				c[r+1] = c[l] + 1
   			}
   		}
   		for l, r := m, m+1; l >= 0 && r < n && s[l] == s[r]; l, r = l-1, r+1 {
   			if c[l]+1 < c[r+1] {
   				c[r+1] = c[l] + 1
   			}
   		}
   	}
   	return c[n]
   }
TypeScript
~~~~~~~~~~

.. code-block:: typescript

   function minCut(s: string): number {
       const n = s.length;
       if (!n)
           return 0;
       const c = Array.from({ length: n + 1 }, (_, i) => i - 1);
       for (let m = 0; m < n; m++) {
           for (let l = m, r = m; l >= 0 && r < n && s[l] === s[r]; l--, r++)
               c[r + 1] =
                   Math.min(c[r + 1], c[l] + 1);
           for (let l = m, r = m + 1; l >= 0 && r < n && s[l] === s[r]; l--, r++)
               c[r + 1] =
                   Math.min(c[r + 1], c[l] + 1);
       }
       return c[n];
   }
C#
~~

.. code-block:: csharp

   public class Solution {
       public int MinCut(string s) {
           int n=s.Length;
           if(n==0)return 0;
           int[]c=new int[n+1];
           for(int i=0;i<=n;i++)c[i]=i-1;
           for(int m=0;m<n;m++) {
               for(int l=m,r=m;l>=0&&r<n&&s[l]==s[r];l--,r++)c[r+1]=Math.Min(c[r+1],c[l]+1);
               for(int l=m,r=m+1;l>=0&&r<n&&s[l]==s[r];l--,r++)c[r+1]=Math.Min(c[r+1],c[l]+1);
           }
           return c[n];
       }
   }
Julia
~~~~~

.. code-block:: julia

   function min_cut(s::String)::Int
       b=codeunits(s)
       n=length(b)
       n==0&&return 0
       c=collect(-1:n-1)
       for m in 1:n
           l=m
           r=m
           while l>=1&&r<=n&&b[l]==b[r]
               c[r+1]=min(c[r+1],c[l]+1)
               l-=1
               r+=1
           end
           l=m
           r=m+1
           while l>=1&&r<=n&&b[l]==b[r]
               c[r+1]=min(c[r+1],c[l]+1)
               l-=1
               r+=1
           end
       end
       c[end]
   end
R
~

.. code-block:: r

   min_cut <- function(s) {
       b<-utf8ToInt(s)
       n<-length(b)
       if(n==0L)return(0L)
       cuts<-(-1L):(n-1L)
       for(m in seq_len(n)) {
           l<-m
           r<-m
           while(l>=1L&&r<=n&&b[[l]]==b[[r]]) {
               cuts[[r+1L]]<-min(cuts[[r+1L]],cuts[[l]]+1L)
               l<-l-1L
               r<-r+1L
           }
           l<-m
           r<-m+1L
           while(l>=1L&&r<=n&&b[[l]]==b[[r]]) {
               cuts[[r+1L]]<-min(cuts[[r+1L]],cuts[[l]]+1L)
               l<-l-1L
               r<-r+1L
           }
       }
       cuts[[n+1L]]
   }
验证计划与证据
--------------

* 固定用例覆盖正常输入、最小输入、退化结构和无解路径；
* 对小规模输入使用独立暴力或枚举基准进行静态对拍设计；
* 检查十语言函数签名、空值、下标、所有权和返回结构；
* 当前批次对 C、C++、Java、Go、TypeScript 执行编译或严格类型检查，对 Python 执行语法解析；Rust、C#、Julia、R 完成接口、括号、作用域和所有权静态检查。

关键边界
--------

* 空串返回 0 时需单独处理，避免 ``-1`` 暴露。
* 整个字符串回文时答案 0。

易错点
------

* 把片段数和切割数混淆。
* 只扩展奇数回文。

本题新增知识
------------

* 中心扩展更新最少切割
* 题号 0132 的主解法状态与证明

本题强化知识
------------

* 十语言接口一致性与边界契约
* 递归栈、输出载荷和语言适配器成本分层

关联题目
--------

* `0131. Palindrome Partitioning <0131-palindrome-partitioning.rst>`_；

最小自检
--------

#. ``中心扩展加前缀 DP`` 维护的核心状态是什么？
#. 终止条件为什么与题目目标等价？
#. 哪个边界最容易造成跨语言接口差异？
#. 复杂度是否包含递归栈、返回结果和语言适配器？

答案要点
~~~~~~~~

每个回文片段都会由唯一中心扩展枚举。若最优最后片段是 ``s[l:r]``，其前缀最优值加一次切割形成候选；所有候选取最小，归纳得到每个前缀最优。
