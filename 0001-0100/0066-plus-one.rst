0066. Plus One
==============

题目信息
--------

:题号: 0066
:难度: Easy
:主题: 数组、十进制进位、反向扫描
:原题: `LeetCode 0066 <https://leetcode.com/problems/plus-one/>`_
:重点: 末位加一、连续 9 进位、最高位扩展、无前导零

题目重述
--------

非空数组 ``digits`` 按从最高位到最低位的顺序表示一个非负十进制整数。除整数 0 外，表示中没有前导零。返回该整数加一后的数字数组。

约束为 ``1 <= digits.length <= 100``、``0 <= digits[i] <= 9``。

自建示例
--------

.. code-block:: text

   输入：digits = [3,4,8]
   输出：[3,4,9]

末位不是 9，加一后无需继续进位。

.. code-block:: text

   输入：digits = [8,9,9]
   输出：[9,0,0]

末尾两个 9 变为 0，进位传到最高位。

.. code-block:: text

   输入：digits = [9,9]
   输出：[1,0,0]

所有原有数位都产生进位，因此结果长度增加 1。

C++ 实现
--------

.. code-block:: cpp

   #include <vector>

   class Solution {
   private:
       std::vector<int> propagateOne(std::vector<int> digits) {
           for (int index = static_cast<int>(digits.size()) - 1; index >= 0; --index) {
               if (digits[index] < 9) {
                   ++digits[index];
                   return digits;
               }
               digits[index] = 0;
           }
           digits.insert(digits.begin(), 1);
           return digits;
       }

   public:
       std::vector<int> plusOne(std::vector<int>& digits) {
           return propagateOne(digits);
       }
   };

题解
----

为什么不把数字数组转换成整数
~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

数组长度可远超 64 位整数范围，先转换再加一会在中间步骤溢出，即使最终只需要增加 1。数字数组本身已经是十进制表示，直接模拟进位既避免了宽度限制，也保留了题目要求的数字数组形式。

加一只会影响哪些位置
~~~~~~~~~~~~~~~~~~~~

从最低位开始：

* 当前位小于 9，直接加一，进位结束，更高位保持不变；
* 当前位等于 9，加一后变 0，进位继续向左；
* 越过最高位仍有进位，说明所有位都是 9，需要在最前面增加 1。

部分进位状态
~~~~~~~~~~~~

.. list-table::
   :header-rows: 1

   * - 当前数组
     - 处理位置
     - 动作
   * - ``[4,9,9]``
     - 最后一位 9
     - 变为 0，继续进位
   * - ``[4,9,0]``
     - 中间位 9
     - 变为 0，继续进位
   * - ``[4,0,0]``
     - 首位 4
     - 加一为 5，立即返回

为什么遇到非 9 可以立即返回
~~~~~~~~~~~~~~~~~~~~~~~~~~

该位加一不会产生新进位，所有更高位与原数相同；所有更低位已经因连续进位变为 0。此时结果已经完整，无需继续扫描。

全 9 为什么恰好多一位
~~~~~~~~~~~~~~~~~~~~

``99...9 + 1 = 100...0``。循环把原有 ``n`` 位全部置零，越过最高位后只需在前面加入一个 1，结果长度为 ``n+1``，不存在其他形式。

为什么没有前导零问题
~~~~~~~~~~~~~~~~~~~~

输入除单个 0 外没有前导零。普通情况不改变最高位为零；全 9 情况新增最高位 1。因而输出仍是规范十进制表示。

为什么结果数值正确
~~~~~~~~~~~~~~~~~~

处理过的后缀等价于十进制加一的进位链：每个 9 变 0 并向左传递 1；首个非 9 吸收进位并增加 1。若不存在非 9，新增最高位 1。两种情况都与十进制定义一致。

复杂度来源
~~~~~~~~~~

最坏扫描全部 ``n`` 位，时间 ``O(n)``。当前 ``plusOne`` 把输入复制给 ``propagateOne``，因此不修改调用者的数组；除返回数组外还需要 ``O(n)`` 的工作副本。若接口允许直接改写输入并把该副本改为引用传递，额外工作空间可以降为 ``O(1)``。

九语言实现
----------

C
~

.. code-block:: c

   int*plusOne(int*digits,int n,int*returnSize){for(int i=n-1;i>=0;i--){if(digits[i]<9){digits[i]++;*returnSize=n;return digits;}digits[i]=0;}int*out=calloc((size_t)n+1,sizeof(int));out[0]=1;*returnSize=n+1;return out;}

Python
~~~~~~

.. code-block:: python

   class Solution:
       def plusOne(self, digits: list[int]) -> list[int]:
           for index in range(len(digits) - 1, -1, -1):
               if digits[index] < 9:
                   digits[index] += 1
                   return digits
               digits[index] = 0
           return [1] + digits

Java
~~~~

.. code-block:: java

   class Solution {public int[] plusOne(int[]digits){for(int i=digits.length-1;i>=0;i--){if(digits[i]<9){digits[i]++;return digits;}digits[i]=0;}int[]out=new int[digits.length+1];out[0]=1;return out;}}

Rust
~~~~

.. code-block:: rust

   impl Solution {pub fn plus_one(mut digits:Vec<i32>)->Vec<i32>{for i in(0..digits.len()).rev(){if digits[i]<9{digits[i]+=1;return digits}digits[i]=0}digits.insert(0,1);digits}}

Go
~~

.. code-block:: go

   func plusOne(digits []int)[]int{for i:=len(digits)-1;i>=0;i--{if digits[i]<9{digits[i]++;return digits};digits[i]=0};return append([]int{1},digits...)}

TypeScript
~~~~~~~~~~

.. code-block:: typescript

   function plusOne(digits:number[]):number[]{for(let i=digits.length-1;i>=0;i--){if(digits[i]<9){digits[i]++;return digits;}digits[i]=0;}return [1,...digits];}

C#
~~

.. code-block:: csharp

   public class Solution {public int[] PlusOne(int[]digits){for(int i=digits.Length-1;i>=0;i--){if(digits[i]<9){digits[i]++;return digits;}digits[i]=0;}int[]output=new int[digits.Length+1];output[0]=1;return output;}}

Julia
~~~~~

.. code-block:: julia

   function plus_one(digits::Vector{Int})
       for i in length(digits):-1:1;if digits[i]<9;digits[i]+=1;return digits;end;digits[i]=0;end
       pushfirst!(digits,1);digits
   end

R
~

.. code-block:: r

   plus_one <- function(digits){for(i in length(digits):1L){if(digits[[i]]<9L){digits[[i]]<-digits[[i]]+1L;return(digits)};digits[[i]]<-0L};c(1L,digits)}
