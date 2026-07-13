0137. Single Number II
======================

题目信息
--------

:题号: 0137
:难度: Medium
:主题: 数组、位运算、有限状态机
:原题: `LeetCode 0137 <https://leetcode.com/problems/single-number-ii/>`_
:访问状态: Available
:教学重点: 每位模三状态

题目重述
--------

数组中除一个元素出现一次外，其余元素恰好出现三次，返回单独元素。

自建示例
--------

.. code-block:: text

   输入：nums = [2,2,3,2]
   输出：3

   输入：nums = [0,1,0,1,0,1,99]
   输出：99

问题抽象
--------

``ones`` 保存出现次数模 3 为 1 的位，``twos`` 保存模 3 为 2 的位；对每个数按布尔状态转移更新。

主解法：位状态机
----------

思路
~~~~

位状态机。 每位模三状态

核心状态与不变量
~~~~~~~~~~~~~~~~

``ones`` 保存出现次数模 3 为 1 的位，``twos`` 保存模 3 为 2 的位；对每个数按布尔状态转移更新。

正确性依据
~~~~~~~~~~

每一位独立经历 00→01→10→00 的三态循环。出现三次的位回到 0，出现一次的位留在 ``ones``；位并行运算组合出唯一整数。

复杂度与语言边界
~~~~~~~~~~~~~~~~

时间 ``O(n)``；空间 ``O(1)``。必须使用固定宽度整数语义处理负数。

核心语言实现
------------

C
~

.. code-block:: c

   int singleNumber(int*a,int n) {
       unsigned ones=0,twos=0;
       for(int i=0;i<n;i++) {
           ones=(ones^(unsigned)a[i])&~twos;
           twos=(twos^(unsigned)a[i])&~ones;
       }
       return(int)ones;
   }
C++
~~~

.. code-block:: cpp

   class Solution {
       public:int singleNumber(vector<int>&a) {
           unsigned ones=0,twos=0;
           for(int x:a) {
               ones=(ones^(unsigned)x)&~twos;
               twos=(twos^(unsigned)x)&~ones;
           }
           return(int)ones;
       }
   };
Python
~~~~~~

.. code-block:: python

   class Solution:

       def singleNumber(self, a: list[int]) -> int:
           ones = twos = 0
           mask = (1 << 32) - 1
           for x in a:
               x &= mask
               ones = (ones ^ x) & ~twos & mask
               twos = (twos ^ x) & ~ones & mask
           return ones if ones < 1 << 31 else ones - (1 << 32)
Java
~~~~

.. code-block:: java

   class Solution {
       public int singleNumber(int[]a) {
           int ones=0,twos=0;
           for(int x:a) {
               ones=(ones^x)&~twos;
               twos=(twos^x)&~ones;
           }
           return ones;
       }
   }
Rust
~~~~

.. code-block:: rust

   impl Solution {
       pub fn single_number(a:Vec<i32>)->i32 {
           let(mut ones,mut twos)=(0,0);
           for x in a {
               ones=(ones^x)&!twos;
               twos=(twos^x)&!ones;
           }
           ones
       }
   }
Go
~~

.. code-block:: go

   func singleNumber(a []int) int {
   	ones, twos := 0, 0
   	for _, x := range a {
   		ones = (ones ^ x) &^ twos
   		twos = (twos ^ x) &^ ones
   	}
   	return ones
   }
TypeScript
~~~~~~~~~~

.. code-block:: typescript

   function singleNumber(a: number[]): number {
       let ones = 0, twos = 0;
       for (const x of a) {
           ones = (ones ^ x) & ~twos;
           twos = (twos ^ x) & ~ones;
       }
       return ones;
   }
C#
~~

.. code-block:: csharp

   public class Solution {
       public int SingleNumber(int[]a) {
           int ones=0,twos=0;
           foreach(int x in a) {
               ones=(ones^x)&~twos;
               twos=(twos^x)&~ones;
           }
           return ones;
       }
   }
Julia
~~~~~

.. code-block:: julia

   function single_number(a::Vector{Int})::Int
       ones=0
       twos=0
       for x in a
           ones=(ones⊻x)&~twos
           twos=(twos⊻x)&~ones
       end
       ones
   end
R
~

.. code-block:: r

   single_number <- function(a) {
       ones<-0L
       twos<-0L
       for(x in a) {
           ones<-bitwAnd(bitwXor(ones,x),bitwNot(twos))
           twos<-bitwAnd(bitwXor(twos,x),bitwNot(ones))
       }
       ones
   }
验证计划与证据
--------------

* 固定用例覆盖正常输入、最小输入、退化结构和无解路径；
* 对小规模输入使用独立暴力或枚举基准进行静态对拍设计；
* 检查十语言函数签名、空值、下标、所有权和返回结构；
* 当前批次对 C、C++、Java、Go、TypeScript 执行编译或严格类型检查，对 Python 执行语法解析；Rust、C#、Julia、R 完成接口、括号、作用域和所有权静态检查。

关键边界
--------

* 负数按二补码位模式参与。
* 更新 ``ones`` 与 ``twos`` 的先后必须与公式匹配。

易错点
------

* 使用无界整数补码时忘记掩码语义。
* 两个状态更新都读取已更新值而公式未证明。

本题新增知识
------------

* 每位模三状态
* 题号 0137 的主解法状态与证明

本题强化知识
------------

* 十语言接口一致性与边界契约
* 递归栈、输出载荷和语言适配器成本分层

关联题目
--------

* `0136. Single Number <0136-single-number.rst>`_；

最小自检
--------

#. ``位状态机`` 维护的核心状态是什么？
#. 终止条件为什么与题目目标等价？
#. 哪个边界最容易造成跨语言接口差异？
#. 复杂度是否包含递归栈、返回结果和语言适配器？

答案要点
~~~~~~~~

每一位独立经历 00→01→10→00 的三态循环。出现三次的位回到 0，出现一次的位留在 ``ones``；位并行运算组合出唯一整数。
