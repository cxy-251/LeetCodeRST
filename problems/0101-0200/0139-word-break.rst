0139. Word Break
================

题目信息
--------

:题号: 0139
:难度: Medium
:主题: 字符串、动态规划、哈希集合
:原题: `LeetCode 0139 <https://leetcode.com/problems/word-break/>`_
:访问状态: Available
:教学重点: 可达前缀状态

题目重述
--------

判断字符串能否被切分成一个或多个词典单词，词典词可重复使用。

自建示例
--------

.. code-block:: text

   输入：s = "leetcode", wordDict = ["leet","code"]
   输出：true

   输入：s = "catsandog", wordDict = ["cats","dog","sand","and","cat"]
   输出：false

问题抽象
--------

``dp[i]`` 表示前 ``i`` 个字符可切分。若存在 ``j<i`` 使 ``dp[j]`` 为真且 ``s[j:i]`` 在词典，则 ``dp[i]`` 为真。

主解法：前缀 DP
-----------

思路
~~~~

前缀 DP。 可达前缀状态

核心状态与不变量
~~~~~~~~~~~~~~~~

``dp[i]`` 表示前 ``i`` 个字符可切分。若存在 ``j<i`` 使 ``dp[j]`` 为真且 ``s[j:i]`` 在词典，则 ``dp[i]`` 为真。

正确性依据
~~~~~~~~~~

任意合法切分最后一个词有唯一左端点 ``j``，其前缀必须可切分；算法枚举所有 ``j``，故完整。每个成立转移拼接一个词典词，故不会产生非法解。

复杂度与语言边界
~~~~~~~~~~~~~~~~

朴素时间 ``O(n^2)`` 次查找，子串构造可能再乘长度；DP ``O(n)``，词典存储按输入计。可用最大词长限制 ``j``。

核心语言实现
------------

C
~

.. code-block:: c

   #include <stdbool.h>
   #include <stdlib.h>
   #include <string.h>
   bool wordBreak(char*s,char**dict,int n) {
       int m=strlen(s);
       bool*dp=calloc((size_t)m+1,sizeof(*dp));
       dp[0]=true;
       for(int i=1;i<=m;i++)for(int k=0;k<n;k++) {
           int len=strlen(dict[k]);
           if(len<=i&&dp[i-len]&&strncmp(s+i-len,dict[k],len)==0) {
               dp[i]=true;
               break;
           }
       }
       bool ans=dp[m];
       free(dp);
       return ans;
   }
C++
~~~

.. code-block:: cpp

   class Solution {
       public:bool wordBreak(string s,vector<string>&dict) {
           unordered_set<string>d(dict.begin(),dict.end());
           vector<char>dp(s.size()+1);
           dp[0]=1;
           for(int i=1;i<=(int)s.size();i++)for(int j=0;j<i;j++)if(dp[j]&&d.count(s.substr(j,i-j))) {
               dp[i]=1;
               break;
           }
           return dp.back();
       }
   };
Python
~~~~~~

.. code-block:: python

   class Solution:

       def wordBreak(self, s: str, wordDict: list[str]) -> bool:
           words = set(wordDict)
           dp = [True] + [False] * len(s)
           for i in range(1, len(s) + 1):
               dp[i] = any((dp[j] and s[j:i] in words for j in range(i)))
           return dp[-1]
Java
~~~~

.. code-block:: java

   class Solution {
       public boolean wordBreak(String s,List<String>dict) {
           Set<String>d=new HashSet<>(dict);
           boolean[]dp=new boolean[s.length()+1];
           dp[0]=true;
           for(int i=1;i<=s.length();i++)for(int
               j=0;j<i;j++)if(dp[j]&&d.contains(s.substring(j,i))) {
               dp[i]=true;
               break;
           }
           return dp[s.length()];
       }
   }
Rust
~~~~

.. code-block:: rust

   use std::collections::HashSet;
   impl Solution {
       pub fn word_break(s:String,dict:Vec<String>)->bool {
           let d:HashSet<String>=dict.into_iter().collect();
           let n=s.len();
           let mut dp=vec![false;
           n+1];
           dp[0]=true;
           for i in 1..=n {
               for j in 0..i {
                   if dp[j]&&d.contains(&s[j..i]) {
                       dp[i]=true;
                       break;
                   }
               }
           }
           dp[n]
       }
   }
Go
~~

.. code-block:: go

   func wordBreak(s string, dict []string) bool {
   	d := map[string]bool{}
   	for _, w := range dict {
   		d[w] = true
   	}
   	dp := make([]bool, len(s)+1)
   	dp[0] = true
   	for i := 1; i <= len(s); i++ {
   		for j := 0; j < i; j++ {
   			if dp[j] && d[s[j:i]] {
   				dp[i] = true
   				break
   			}
   		}
   	}
   	return dp[len(s)]
   }
TypeScript
~~~~~~~~~~

.. code-block:: typescript

   function wordBreak(s: string, dict: string[]): boolean {
       const d = new Set(dict), dp = Array(s.length + 1).fill(false);
       dp[0] = true;
       for (let i = 1; i <= s.length; i++)
           for (let j = 0; j < i; j++)
               if (dp[j] &&
                   d.has(s.slice(j, i))) {
                   dp[i] = true;
                   break;
               }
       return dp[s.length];
   }
C#
~~

.. code-block:: csharp

   public class Solution {
       public bool WordBreak(string s,IList<string>dict) {
           var d=new HashSet<string>(dict);
           bool[]dp=new bool[s.Length+1];
           dp[0]=true;
           for(int i=1;i<=s.Length;i++)for(int
               j=0;j<i;j++)if(dp[j]&&d.Contains(s.Substring(j,i-j))) {
               dp[i]=true;
               break;
           }
           return dp[s.Length];
       }
   }
Julia
~~~~~

.. code-block:: julia

   function word_break(s::String,dict::Vector{String})::Bool
       b=codeunits(s)
       d=Set(dict)
       n=length(b)
       dp=falses(n+1)
       dp[1]=true
       for i in 1:n
           for j in 0:i-1
               if dp[j+1]&&String(b[j+1:i]) in d
                   dp[i+1]=true
                   break
               end
           end
       end
       dp[end]
   end
R
~

.. code-block:: r

   word_break <- function(s,dict) {
       b<-utf8ToInt(s)
       n<-length(b)
       d<-new.env(hash=TRUE,parent=emptyenv())
       for(w in dict)d[[w]]<-TRUE
       dp<-rep(FALSE,n+1L)
       dp[[1L]]<-TRUE
       for(i in seq_len(n))for(j in 0L:(i-1L))if(dp[[j+1L]]&&!is.null(d[[intToUtf8(b[(j+1L):i])]])) {
           dp[[i+1L]]<-TRUE
           break
       }
       dp[[n+1L]]
   }
验证计划与证据
--------------

* 固定用例覆盖正常输入、最小输入、退化结构和无解路径；
* 对小规模输入使用独立暴力或枚举基准进行静态对拍设计；
* 检查十语言函数签名、空值、下标、所有权和返回结构；
* 当前批次对 C、C++、Java、Go、TypeScript 执行编译或严格类型检查，对 Python 执行语法解析；Rust、C#、Julia、R 完成接口、括号、作用域和所有权静态检查。

关键边界
--------

* 空串按 DP 定义可切分，但平台输入通常非空。
* 词典可能含不同长度单词。

易错点
------

* 贪心选择最长或最短词。
* 忘记 ``dp[0]=true``。

本题新增知识
------------

* 可达前缀状态
* 题号 0139 的主解法状态与证明

本题强化知识
------------

* 十语言接口一致性与边界契约
* 递归栈、输出载荷和语言适配器成本分层

关联题目
--------

* `0140. Word Break II <0140-word-break-ii.rst>`_；
* `0115. Distinct Subsequences <0115-distinct-subsequences.rst>`_；

最小自检
--------

#. ``前缀 DP`` 维护的核心状态是什么？
#. 终止条件为什么与题目目标等价？
#. 哪个边界最容易造成跨语言接口差异？
#. 复杂度是否包含递归栈、返回结果和语言适配器？

答案要点
~~~~~~~~

任意合法切分最后一个词有唯一左端点 ``j``，其前缀必须可切分；算法枚举所有 ``j``，故完整。每个成立转移拼接一个词典词，故不会产生非法解。
