0120. Triangle
==============

题目信息
--------

:题号: 0120
:难度: Medium
:主题: 数组、动态规划、滚动状态
:原题: `LeetCode 0120 <https://leetcode.com/problems/triangle/>`_
:访问状态: Available
:教学重点: 自底向上覆盖

题目重述
--------

给定三角形数字数组，返回从顶到底、每步走到下一行同列或右邻的最小路径和。

自建示例
--------

.. code-block:: text

   输入：triangle = [[2],[3,4],[6,5,7],[4,1,8,3]]
   输出：11

问题抽象
--------

复制最后一行作为 ``dp``，从倒数第二行向上，令 ``dp[j]=triangle[i][j]+min(dp[j],dp[j+1])``。

主解法：自底向上 DP
-------------

思路
~~~~

自底向上 DP。 自底向上覆盖

核心状态与不变量
~~~~~~~~~~~~~~~~

复制最后一行作为 ``dp``，从倒数第二行向上，令 ``dp[j]=triangle[i][j]+min(dp[j],dp[j+1])``。

正确性依据
~~~~~~~~~~

在处理第 ``i`` 行前，``dp[j]`` 是从下一行位置 ``j`` 到底的最小和。当前位置只有两个合法后继，取较小者后不变量上移；最终 ``dp[0]`` 为答案。

复杂度与语言边界
~~~~~~~~~~~~~~~~

总元素数为 ``N``，时间 ``O(N)``；DP ``O(rows)``。若复用输入最后一行则会修改输入，当前实现使用副本。

核心语言实现
------------

C
~

.. code-block:: c

   int minimumTotal(int**triangle,int triangleSize,int*triangleColSize) {
       (void)triangleColSize;
       int n=triangleSize;
       int dp[n];
       for(int j=0;j<n;j++)dp[j]=triangle[n-1][j];
       for(int i=n-2;i>=0;i--)for(int
           j=0;j<=i;j++)dp[j]=triangle[i][j]+(dp[j]<dp[j+1]?dp[j]:dp[j+1]);
       return dp[0];
   }
C++
~~~

.. code-block:: cpp

   class Solution {
       public:int minimumTotal(vector<vector<int>>&t) {
           vector<int>dp=t.back();
           for(int i=t.size()-2;i>=0;--i)for(int j=0;j<=i;j++)dp[j]=t[i][j]+min(dp[j],dp[j+1]);
           return dp[0];
       }
   };
Python
~~~~~~

.. code-block:: python

   class Solution:

       def minimumTotal(self, triangle: list[list[int]]) -> int:
           dp = triangle[-1].copy()
           for i in range(len(triangle) - 2, -1, -1):
               for j in range(i + 1):
                   dp[j] = triangle[i][j] + min(dp[j], dp[j + 1])
           return dp[0]
Java
~~~~

.. code-block:: java

   class Solution {
       public int minimumTotal(List<List<Integer>>t) {
           int n=t.size();
           int[]dp=new int[n];
           for(int j=0;j<n;j++)dp[j]=t.get(n-1).get(j);
           for(int i=n-2;i>=0;i--)for(int
               j=0;j<=i;j++)dp[j]=t.get(i).get(j)+Math.min(dp[j],dp[j+1]);
           return dp[0];
       }
   }
Rust
~~~~

.. code-block:: rust

   impl Solution {
       pub fn minimum_total(t:Vec<Vec<i32>>)->i32 {
           let mut dp=t.last().unwrap().clone();
           for i in(0..t.len()-1).rev() {
               for j in 0..=i {
                   dp[j]=t[i][j]+dp[j].min(dp[j+1]);
               }
           }
           dp[0]
       }
   }
Go
~~

.. code-block:: go

   func minimumTotal(t [][]int) int {
   	dp := append([]int(nil), t[len(t)-1]...)
   	for i := len(t) - 2; i >= 0; i-- {
   		for j := 0; j <= i; j++ {
   			if dp[j+1] < dp[j] {
   				dp[j] = dp[j+1]
   			}
   			dp[j] += t[i][j]
   		}
   	}
   	return dp[0]
   }
TypeScript
~~~~~~~~~~

.. code-block:: typescript

   function minimumTotal(t: number[][]): number {
       const dp = [...t[t.length - 1]];
       for (let i = t.length - 2; i >= 0; i--)
           for (let j = 0; j <= i; j++)
               dp[j] = t[i][j] +
                   Math.min(dp[j], dp[j + 1]);
       return dp[0];
   }
C#
~~

.. code-block:: csharp

   public class Solution {
       public int MinimumTotal(IList<IList<int>>t) {
           int n=t.Count;
           int[]dp=t[n-1].ToArray();
           for(int i=n-2;i>=0;i--)for(int j=0;j<=i;j++)dp[j]=t[i][j]+Math.Min(dp[j],dp[j+1]);
           return dp[0];
       }
   }
Julia
~~~~~

.. code-block:: julia

   function minimum_total(t::Vector{Vector{Int}})::Int
       dp=copy(t[end])
       for i in length(t)-1:-1:1, j in 1:i
           dp[j]=t[i][j]+min(dp[j],dp[j+1])
       end
       dp[1]
   end
R
~

.. code-block:: r

   minimum_total <- function(t) {
       dp<-t[[length(t)]]
       if(length(t)>1L)for(i in seq.int(length(t)-1L,1L,by=-1L))for(j in
       seq_len(i))dp[[j]]<-t[[i]][[j]]+min(dp[[j]],dp[[j+1L]])
       dp[[1L]]
   }
验证计划与证据
--------------

* 固定用例覆盖正常输入、最小输入、退化结构和无解路径；
* 对小规模输入使用独立暴力或枚举基准进行静态对拍设计；
* 检查十语言函数签名、空值、下标、所有权和返回结构；
* 当前批次对 C、C++、Java、Go、TypeScript 执行编译或严格类型检查，对 Python 执行语法解析；Rust、C#、Julia、R 完成接口、括号、作用域和所有权静态检查。

关键边界
--------

* 单行直接返回该值。
* 允许负数，不能做非负剪枝。

易错点
------

* 更新方向与覆盖依赖不匹配。
* 把矩形边界用于三角形。

本题新增知识
------------

* 自底向上覆盖
* 题号 0120 的主解法状态与证明

本题强化知识
------------

* 十语言接口一致性与边界契约
* 递归栈、输出载荷和语言适配器成本分层

关联题目
--------

* `0119. Pascal's Triangle II <0119-pascals-triangle-ii.rst>`_；

最小自检
--------

#. ``自底向上 DP`` 维护的核心状态是什么？
#. 终止条件为什么与题目目标等价？
#. 哪个边界最容易造成跨语言接口差异？
#. 复杂度是否包含递归栈、返回结果和语言适配器？

答案要点
~~~~~~~~

在处理第 ``i`` 行前，``dp[j]`` 是从下一行位置 ``j`` 到底的最小和。当前位置只有两个合法后继，取较小者后不变量上移；最终 ``dp[0]`` 为答案。
