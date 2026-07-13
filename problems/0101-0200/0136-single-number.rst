0136. Single Number
===================

题目信息
--------

:题号: 0136
:难度: Easy
:主题: 数组、位运算
:原题: `LeetCode 0136 <https://leetcode.com/problems/single-number/>`_
:访问状态: Available
:教学重点: 异或消除成对元素

题目重述
--------

数组中除一个元素只出现一次外，其余元素恰好出现两次，返回单独元素。

自建示例
--------

.. code-block:: text

   输入：nums = [4,1,2,1,2]
   输出：4

问题抽象
--------

从 0 开始异或全部值。

主解法：全数组异或
-----------

思路
~~~~

全数组异或。 异或消除成对元素

核心状态与不变量
~~~~~~~~~~~~~~~~

从 0 开始异或全部值。

正确性依据
~~~~~~~~~~

异或满足交换、结合，且 ``x xor x = 0``、``0 xor y = y``。成对元素全部抵消，剩下唯一元素。

复杂度与语言边界
~~~~~~~~~~~~~~~~

时间 ``O(n)``；空间 ``O(1)``。按目标整数位宽进行位运算。

核心语言实现
------------

C
~

.. code-block:: c

   int singleNumber(int*a,int n) {
       int x=0;
       for(int i=0;i<n;i++)x^=a[i];
       return x;
   }
C++
~~~

.. code-block:: cpp

   class Solution {
       public:int singleNumber(vector<int>&a) {
           return accumulate(a.begin(),a.end(),0,bit_xor<int>());
       }
   };
Python
~~~~~~

.. code-block:: python

   class Solution:

       def singleNumber(self, a: list[int]) -> int:
           x = 0
           for v in a:
               x ^= v
           return x
Java
~~~~

.. code-block:: java

   class Solution {
       public int singleNumber(int[]a) {
           int x=0;
           for(int v:a)x^=v;
           return x;
       }
   }
Rust
~~~~

.. code-block:: rust

   impl Solution {
       pub fn single_number(a:Vec<i32>)->i32 {
           a.into_iter().fold(0,|x,v|x^v)
       }
   }
Go
~~

.. code-block:: go

   func singleNumber(a []int) int {
   	x := 0
   	for _, v := range a {
   		x ^= v
   	}
   	return x
   }
TypeScript
~~~~~~~~~~

.. code-block:: typescript

   function singleNumber(a: number[]): number {
       return a.reduce((x, v) => x ^ v, 0);
   }
C#
~~

.. code-block:: csharp

   public class Solution {
       public int SingleNumber(int[]a) {
           int x=0;
           foreach(int v in a)x^=v;
           return x;
       }
   }
Julia
~~~~~

.. code-block:: julia

   single_number(a::Vector{Int})=foldl(xor,a
   init=0)
R
~

.. code-block:: r

   single_number <- function(a)Reduce(bitwXor,a,init=0L)
验证计划与证据
--------------

* 固定用例覆盖正常输入、最小输入、退化结构和无解路径；
* 对小规模输入使用独立暴力或枚举基准进行静态对拍设计；
* 检查十语言函数签名、空值、下标、所有权和返回结构；
* 当前批次对 C、C++、Java、Go、TypeScript 执行编译或严格类型检查，对 Python 执行语法解析；Rust、C#、Julia、R 完成接口、括号、作用域和所有权静态检查。

关键边界
--------

* 唯一元素可以为负数或 0。
* 输入保证非空。

易错点
------

* 使用求和公式可能溢出。
* 把逻辑异或与按位异或混淆。

本题新增知识
------------

* 异或消除成对元素
* 题号 0136 的主解法状态与证明

本题强化知识
------------

* 十语言接口一致性与边界契约
* 递归栈、输出载荷和语言适配器成本分层

关联题目
--------

* `0137. Single Number II <0137-single-number-ii.rst>`_；

最小自检
--------

#. ``全数组异或`` 维护的核心状态是什么？
#. 终止条件为什么与题目目标等价？
#. 哪个边界最容易造成跨语言接口差异？
#. 复杂度是否包含递归栈、返回结果和语言适配器？

答案要点
~~~~~~~~

异或满足交换、结合，且 ``x xor x = 0``、``0 xor y = y``。成对元素全部抵消，剩下唯一元素。
