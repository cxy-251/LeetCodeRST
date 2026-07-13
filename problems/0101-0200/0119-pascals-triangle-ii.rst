0119. Pascal's Triangle II
==========================

题目信息
--------

:题号: 0119
:难度: Easy
:主题: 数组、动态规划、组合数
:原题: `LeetCode 0119 <https://leetcode.com/problems/pascals-triangle-ii/>`_
:访问状态: Available
:教学重点: 一维逆序更新

题目重述
--------

返回杨辉三角第 ``rowIndex`` 行，行号从 0 开始。

自建示例
--------

.. code-block:: text

   输入：rowIndex = 3
   输出：[1,3,3,1]

问题抽象
--------

初始化全 1 数组；对每一行从右向左执行 ``row[j] += row[j-1]``。

主解法：一维逆序 DP
-------------

思路
~~~~

一维逆序 DP。 一维逆序更新

核心状态与不变量
~~~~~~~~~~~~~~~~

初始化全 1 数组；对每一行从右向左执行 ``row[j] += row[j-1]``。

正确性依据
~~~~~~~~~~

逆序使右侧旧值在本轮尚未被覆盖，更新恰对应上一行相邻两项之和。归纳后数组等于目标行。

复杂度与语言边界
~~~~~~~~~~~~~~~~

时间 ``O(k^2)``，空间 ``O(k)``，其中 ``k=rowIndex``；返回载荷 ``O(k)``。

核心语言实现
------------

C
~

.. code-block:: c

   #include <stdlib.h>
   int* getRow(int k,int*returnSize) {
       int*r=malloc((size_t)(k+1)*sizeof(*r));
       for(int i=0;i<=k;i++)r[i]=1;
       for(int i=2;i<=k;i++)for(int j=i-1;j>=1;j--)r[j]+=r[j-1];
       *returnSize=k+1;
       return r;
   }
C++
~~~

.. code-block:: cpp

   class Solution {
       public:vector<int>getRow(int k) {
           vector<int>r(k+1,1);
           for(int i=2;i<=k;i++)for(int j=i-1;j>=1;j--)r[j]+=r[j-1];
           return r;
       }
   };
Python
~~~~~~

.. code-block:: python

   class Solution:

       def getRow(self, k: int) -> list[int]:
           row = [1] * (k + 1)
           for i in range(2, k + 1):
               for j in range(i - 1, 0, -1):
                   row[j] += row[j - 1]
           return row
Java
~~~~

.. code-block:: java

   class Solution {
       public List<Integer>getRow(int k) {
           Integer[]r=new Integer[k+1];
           Arrays.fill(r,1);
           for(int i=2;i<=k;i++)for(int j=i-1;j>=1;j--)r[j]+=r[j-1];
           return Arrays.asList(r);
       }
   }
Rust
~~~~

.. code-block:: rust

   impl Solution {
       pub fn get_row(k:i32)->Vec<i32> {
           let mut r=vec![1;
           k as usize+1];
           for i in 2..=k as usize {
               for j in(1..i).rev() {
                   r[j]+=r[j-1];
               }
           }
           r
       }
   }
Go
~~

.. code-block:: go

   func getRow(k int) []int {
   	r := make([]int, k+1)
   	for i := range r {
   		r[i] = 1
   	}
   	for i := 2; i <= k; i++ {
   		for j := i - 1; j >= 1; j-- {
   			r[j] += r[j-1]
   		}
   	}
   	return r
   }
TypeScript
~~~~~~~~~~

.. code-block:: typescript

   function getRow(k: number): number[] {
       const r = Array(k + 1).fill(1);
       for (let i = 2; i <= k; i++)
           for (let j = i - 1; j >= 1; j--)
               r[j] += r[j - 1];
       return r;
   }
C#
~~

.. code-block:: csharp

   public class Solution {
       public IList<int> GetRow(int k) {
           int[]r=Enumerable.Repeat(1,k+1).ToArray();
           for(int i=2;i<=k;i++)for(int j=i-1;j>=1;j--)r[j]+=r[j-1];
           return r;
       }
   }
Julia
~~~~~

.. code-block:: julia

   function get_row(k::Int)
       r=ones(Int,k+1)
       for i in 3:k+1, j in i-1:-1:2
           r[j]+=r[j-1]
       end
       r
   end
R
~

.. code-block:: r

   get_row <- function(k) {
       r<-rep.int(1L,k+1L)
       if(k>=2L)for(i in 2L:k)for(j in seq.int(i,2L,by=-1L))r[[j]]<-r[[j]]+r[[j-1L]]
       r
   }
验证计划与证据
--------------

* 固定用例覆盖正常输入、最小输入、退化结构和无解路径；
* 对小规模输入使用独立暴力或枚举基准进行静态对拍设计；
* 检查十语言函数签名、空值、下标、所有权和返回结构；
* 当前批次对 C、C++、Java、Go、TypeScript 执行编译或严格类型检查，对 Python 执行语法解析；Rust、C#、Julia、R 完成接口、括号、作用域和所有权静态检查。

关键边界
--------

* ``rowIndex=0`` 返回 ``[1]``。
* 逆序范围必须为空安全。

易错点
------

* 正序更新污染依赖。
* 把行号和长度混淆。

本题新增知识
------------

* 一维逆序更新
* 题号 0119 的主解法状态与证明

本题强化知识
------------

* 十语言接口一致性与边界契约
* 递归栈、输出载荷和语言适配器成本分层

关联题目
--------

* `0118. Pascal's Triangle <0118-pascals-triangle.rst>`_；

最小自检
--------

#. ``一维逆序 DP`` 维护的核心状态是什么？
#. 终止条件为什么与题目目标等价？
#. 哪个边界最容易造成跨语言接口差异？
#. 复杂度是否包含递归栈、返回结果和语言适配器？

答案要点
~~~~~~~~

逆序使右侧旧值在本轮尚未被覆盖，更新恰对应上一行相邻两项之和。归纳后数组等于目标行。
