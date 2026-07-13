0135. Candy
===========

题目信息
--------

:题号: 0135
:难度: Hard
:主题: 数组、贪心、双向约束
:原题: `LeetCode 0135 <https://leetcode.com/problems/candy/>`_
:访问状态: Available
:教学重点: 左右单调需求取最大

题目重述
--------

每个孩子至少一颗糖；评分更高的孩子必须比相邻评分更低者多。返回最少糖果总数。

自建示例
--------

.. code-block:: text

   输入：ratings = [1,0,2]
   输出：5

   输入：ratings = [1,2,2]
   输出：4

问题抽象
--------

左到右计算满足左邻约束的最少糖数，右到左计算右邻约束，并对每个位置取两者最大值。

主解法：两次扫描
----------

思路
~~~~

两次扫描。 左右单调需求取最大

核心状态与不变量
~~~~~~~~~~~~~~~~

左到右计算满足左邻约束的最少糖数，右到左计算右邻约束，并对每个位置取两者最大值。

正确性依据
~~~~~~~~~~

左数组是仅考虑左边不等式的逐点最小解，右扫描同理。任意合法分配必须至少达到两者，因此最大值是下界；该最大值同时满足两个方向约束，所以是全局最小。

复杂度与语言边界
~~~~~~~~~~~~~~~~

时间 ``O(n)``；保存左数组时空间 ``O(n)``，右需求可用标量滚动。

核心语言实现
------------

C
~

.. code-block:: c

   #include <stdlib.h>
   int candy(int*r,int n) {
       int*left=malloc((size_t)n*sizeof(*left));
       for(int i=0;i<n;i++)left[i]=1;
       for(int i=1;i<n;i++)if(r[i]>r[i-1])left[i]=left[i-1]+1;
       int right=1,total=0;
       for(int i=n-1;i>=0;i--) {
           if(i<n-1&&r[i]>r[i+1])right++;
           else right=1;
           total+=left[i]>right?left[i]:right;
       }
       free(left);
       return total;
   }
C++
~~~

.. code-block:: cpp

   class Solution {
       public:int candy(vector<int>&r) {
           int n=r.size();
           vector<int>l(n,1);
           for(int i=1;i<n;i++)if(r[i]>r[i-1])l[i]=l[i-1]+1;
           int right=1,total=0;
           for(int i=n-1;i>=0;i--) {
               right=(i<n-1&&r[i]>r[i+1])?right+1:1;
               total+=max(l[i],right);
           }
           return total;
       }
   };
Python
~~~~~~

.. code-block:: python

   class Solution:

       def candy(self, r: list[int]) -> int:
           n = len(r)
           left = [1] * n
           for i in range(1, n):
               if r[i] > r[i - 1]:
                   left[i] = left[i - 1] + 1
           total = 0
           right = 1
           for i in range(n - 1, -1, -1):
               right = right + 1 if i < n - 1 and r[i] > r[i + 1] else 1
               total += max(left[i], right)
           return total
Java
~~~~

.. code-block:: java

   class Solution {
       public int candy(int[]r) {
           int n=r.length;
           int[]l=new int[n];
           Arrays.fill(l,1);
           for(int i=1;i<n;i++)if(r[i]>r[i-1])l[i]=l[i-1]+1;
           int right=1,total=0;
           for(int i=n-1;i>=0;i--) {
               right=i<n-1&&r[i]>r[i+1]?right+1:1;
               total+=Math.max(l[i],right);
           }
           return total;
       }
   }
Rust
~~~~

.. code-block:: rust

   impl Solution {
       pub fn candy(r:Vec<i32>)->i32 {
           let n=r.len();
           let mut l=vec![1;
           n];
           for i in 1..n {
               if r[i]>r[i-1] {
                   l[i]=l[i-1]+1;
               }
           }
           let(mut right,mut total)=(1,0);
           for i in(0..n).rev() {
               right=if i+1<n&&r[i]>r[i+1] {
                   right+1
               } else {
                   1
               };
               total+=l[i].max(right);
           }
           total
       }
   }
Go
~~

.. code-block:: go

   func candy(r []int) int {
   	n := len(r)
   	l := make([]int, n)
   	for i := range l {
   		l[i] = 1
   	}
   	for i := 1; i < n; i++ {
   		if r[i] > r[i-1] {
   			l[i] = l[i-1] + 1
   		}
   	}
   	right, total := 1, 0
   	for i := n - 1; i >= 0; i-- {
   		if i < n-1 && r[i] > r[i+1] {
   			right++
   		} else {
   			right = 1
   		}
   		if l[i] > right {
   			total += l[i]
   		} else {
   			total += right
   		}
   	}
   	return total
   }
TypeScript
~~~~~~~~~~

.. code-block:: typescript

   function candy(r: number[]): number {
       const n = r.length, l = Array(n).fill(1);
       for (let i = 1; i < n; i++)
           if (r[i] > r[i - 1])
               l[i] = l[i - 1] + 1;
       let right = 1, total = 0;
       for (let i = n - 1; i >= 0; i--) {
           right = i < n - 1 && r[i] > r[i + 1] ? right + 1 : 1;
           total += Math.max(l[i], right);
       }
       return total;
   }
C#
~~

.. code-block:: csharp

   public class Solution {
       public int Candy(int[]r) {
           int n=r.Length;
           int[]l=Enumerable.Repeat(1,n).ToArray();
           for(int i=1;i<n;i++)if(r[i]>r[i-1])l[i]=l[i-1]+1;
           int right=1,total=0;
           for(int i=n-1;i>=0;i--) {
               right=i<n-1&&r[i]>r[i+1]?right+1:1;
               total+=Math.Max(l[i],right);
           }
           return total;
       }
   }
Julia
~~~~~

.. code-block:: julia

   function candy(r::Vector{Int})::Int
       n=length(r)
       l=ones(Int,n)
       for i in 2:n
           r[i]>r[i-1]&&(l[i]=l[i-1]+1)
       end
       right=1
       total=0
       for i in n:-1:1
           right=i<n&&r[i]>r[i+1] ? right+1 : 1
           total+=max(l[i],right)
       end
       total
   end
R
~

.. code-block:: r

   candy <- function(r) {
       n<-length(r)
       left<-rep.int(1L,n)
       if(n>1L)for(i in 2L:n)if(r[[i]]>r[[i-1L]])left[[i]]<-left[[i-1L]]+1L
       right<-1L
       total<-0L
       for(i in seq.int(n,1L,by=-1L)) {
           right<-if(i<n&&r[[i]]>r[[i+1L]])right+1L else 1L
           total<-total+max(left[[i]],right)
       }
       total
   }
验证计划与证据
--------------

* 固定用例覆盖正常输入、最小输入、退化结构和无解路径；
* 对小规模输入使用独立暴力或枚举基准进行静态对拍设计；
* 检查十语言函数签名、空值、下标、所有权和返回结构；
* 当前批次对 C、C++、Java、Go、TypeScript 执行编译或严格类型检查，对 Python 执行语法解析；Rust、C#、Julia、R 完成接口、括号、作用域和所有权静态检查。

关键边界
--------

* 相等评分不要求不同糖数。
* 单个孩子答案 1。

易错点
------

* 只做单向扫描。
* 把相等评分也强制递增。

本题新增知识
------------

* 左右单调需求取最大
* 题号 0135 的主解法状态与证明

本题强化知识
------------

* 十语言接口一致性与边界契约
* 递归栈、输出载荷和语言适配器成本分层

关联题目
--------

* `0042. Trapping Rain Water <../0001-0100/0042-trapping-rain-water.rst>`_；

最小自检
--------

#. ``两次扫描`` 维护的核心状态是什么？
#. 终止条件为什么与题目目标等价？
#. 哪个边界最容易造成跨语言接口差异？
#. 复杂度是否包含递归栈、返回结果和语言适配器？

答案要点
~~~~~~~~

左数组是仅考虑左边不等式的逐点最小解，右扫描同理。任意合法分配必须至少达到两者，因此最大值是下界；该最大值同时满足两个方向约束，所以是全局最小。
