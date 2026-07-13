0118. Pascal's Triangle
=======================

题目信息
--------

:题号: 0118
:难度: Easy
:主题: 数组、动态规划
:原题: `LeetCode 0118 <https://leetcode.com/problems/pascals-triangle/>`_
:访问状态: Available
:教学重点: 相邻上一行求和

题目重述
--------

生成杨辉三角前 ``numRows`` 行，每行首尾为 1，中间等于上一行相邻两数之和。

自建示例
--------

.. code-block:: text

   输入：numRows = 5
   输出：[[1],[1,1],[1,2,1],[1,3,3,1],[1,4,6,4,1]]

问题抽象
--------

创建长度递增的行，首尾设为 1，中间位置读取上一行 ``j-1`` 与 ``j``。

主解法：逐行 DP
-----------

思路
~~~~

逐行 DP。 相邻上一行求和

核心状态与不变量
~~~~~~~~~~~~~~~~

创建长度递增的行，首尾设为 1，中间位置读取上一行 ``j-1`` 与 ``j``。

正确性依据
~~~~~~~~~~

边界位置定义为 1；每个中间位置按杨辉递推唯一确定。由行号归纳，生成的每一行均正确。

复杂度与语言边界
~~~~~~~~~~~~~~~~

输出元素数 ``R=numRows(numRows+1)/2``，时间和输出空间均 ``O(R)``；除输出外额外 ``O(1)``。

核心语言实现
------------

C
~

.. code-block:: c

   #include <stdlib.h>
   int** generate(int numRows,int*returnSize,int**returnColumnSizes) {
       int**rows=malloc((size_t)numRows*sizeof(*rows));
       int*cols=malloc((size_t)numRows*sizeof(*cols));
       for(int i=0;i<numRows;i++) {
           cols[i]=i+1;
           rows[i]=malloc((size_t)(i+1)*sizeof(**rows));
           rows[i][0]=rows[i][i]=1;
           for(int j=1;j<i;j++)rows[i][j]=rows[i-1][j-1]+rows[i-1][j];
       }
       *returnSize=numRows;
       *returnColumnSizes=cols;
       return rows;
   }
C++
~~~

.. code-block:: cpp

   class Solution {
       public:vector<vector<int>>generate(int n) {
           vector<vector<int>>a;
           for(int i=0;i<n;i++) {
               vector<int>r(i+1,1);
               for(int j=1;j<i;j++)r[j]=a[i-1][j-1]+a[i-1][j];
               a.push_back(move(r));
           }
           return a;
       }
   };
Python
~~~~~~

.. code-block:: python

   class Solution:

       def generate(self, numRows: int) -> list[list[int]]:
           ans = []
           for i in range(numRows):
               row = [1] * (i + 1)
               for j in range(1, i):
                   row[j] = ans[-1][j - 1] + ans[-1][j]
               ans.append(row)
           return ans
Java
~~~~

.. code-block:: java

   class Solution {
       public List<List<Integer>>generate(int n) {
           List<List<Integer>>a=new ArrayList<>();
           for(int i=0;i<n;i++) {
               List<Integer>r=new ArrayList<>(Collections.nCopies(i+1,1));
               for(int j=1;j<i;j++)r.set(j,a.get(i-1).get(j-1)+a.get(i-1).get(j));
               a.add(r);
           }
           return a;
       }
   }
Rust
~~~~

.. code-block:: rust

   impl Solution {
       pub fn generate(n:i32)->Vec<Vec<i32>> {
           let mut a=vec![];
           for i in 0..n as usize {
               let mut r=vec![1;
               i+1];
               for j in 1..i {
                   r[j]=a[i-1][j-1]+a[i-1][j];
               }
               a.push(r);
           }
           a
       }
   }
Go
~~

.. code-block:: go

   func generate(n int) [][]int {
   	a := make([][]int, 0, n)
   	for i := 0; i < n; i++ {
   		r := make([]int, i+1)
   		for j := range r {
   			r[j] = 1
   		}
   		for j := 1; j < i; j++ {
   			r[j] = a[i-1][j-1] + a[i-1][j]
   		}
   		a = append(a, r)
   	}
   	return a
   }
TypeScript
~~~~~~~~~~

.. code-block:: typescript

   function generate(n: number): number[][] {
       const a: number[][] = [];
       for (let i = 0; i < n; i++) {
           const r = Array(i + 1).fill(1);
           for (let j = 1; j < i; j++)
               r[j] = a[i - 1][j - 1] + a[i - 1][j];
           a.push(r);
       }
       return a;
   }
C#
~~

.. code-block:: csharp

   public class Solution {
       public IList<IList<int>> Generate(int n) {
           var a=new List<IList<int>>();
           for(int i=0;i<n;i++) {
               var r=Enumerable.Repeat(1,i+1).ToList();
               for(int j=1;j<i;j++)r[j]=a[i-1][j-1]+a[i-1][j];
               a.Add(r);
           }
           return a;
       }
   }
Julia
~~~~~

.. code-block:: julia

   function generate_pascal(n::Int)
       a=Vector{Vector{Int}}()
       for i in 1:n
           r=ones(Int,i)
           for j in 2:i-1
               r[j]=a[i-1][j-1]+a[i-1][j]
           end
           push!(a,r)
       end
       a
   end
R
~

.. code-block:: r

   generate_pascal <- function(n) {
       a<-vector("list",n)
       for(i in seq_len(n)) {
           r<-rep.int(1L,i)
           if(i>2L)for(j in 2L:(i-1L))r[[j]]<-a[[i-1L]][[j-1L]]+a[[i-1L]][[j]]
           a[[i]]<-r
       }
       a
   }
验证计划与证据
--------------

* 固定用例覆盖正常输入、最小输入、退化结构和无解路径；
* 对小规模输入使用独立暴力或枚举基准进行静态对拍设计；
* 检查十语言函数签名、空值、下标、所有权和返回结构；
* 当前批次对 C、C++、Java、Go、TypeScript 执行编译或严格类型检查，对 Python 执行语法解析；Rust、C#、Julia、R 完成接口、括号、作用域和所有权静态检查。

关键边界
--------

* ``numRows=1`` 只返回 ``[[1]]``。
* 每行必须独立分配。

易错点
------

* 复用同一行数组。
* 中间循环包含首尾导致越界。

本题新增知识
------------

* 相邻上一行求和
* 题号 0118 的主解法状态与证明

本题强化知识
------------

* 十语言接口一致性与边界契约
* 递归栈、输出载荷和语言适配器成本分层

关联题目
--------

* `0119. Pascal's Triangle II <0119-pascals-triangle-ii.rst>`_；
* `0120. Triangle <0120-triangle.rst>`_；

最小自检
--------

#. ``逐行 DP`` 维护的核心状态是什么？
#. 终止条件为什么与题目目标等价？
#. 哪个边界最容易造成跨语言接口差异？
#. 复杂度是否包含递归栈、返回结果和语言适配器？

答案要点
~~~~~~~~

边界位置定义为 1；每个中间位置按杨辉递推唯一确定。由行号归纳，生成的每一行均正确。
