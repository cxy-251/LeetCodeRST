0066. Plus One
==============

题目信息
--------

:题号: 0066
:难度: Easy
:主题: 数组、十进制进位、反向扫描
:原题: `LeetCode 0066 <https://leetcode.com/problems/plus-one/>`_
:教学重点: 连续 9 后缀、进位终止、全 9 扩位、整数宽度

题目重述
--------

非空数组 ``digits`` 按高位到低位表示一个非负十进制整数，除 0 本身外没有前导零。返回该整数加一后的数字数组。输入可能有上百位，不能依赖固定宽整数保存完整数值。

自建示例
--------

.. code-block:: text

   [1,2,7] -> [1,2,8]
   [4,9,9] -> [5,0,0]
   [9,9,9] -> [1,0,0,0]
   [0]     -> [1]

C++ 实现
--------

.. code-block:: cpp

   #include <algorithm>
   #include <vector>

   class Solution {
   private:
       std::vector<int> convertToInteger(const std::vector<int>& digits) {
           long long value = 0;
           for (int digit : digits) value = value * 10 + digit;
           ++value;
           if (value == 0) return {0};
           std::vector<int> result;
           while (value > 0) { result.push_back(value % 10); value /= 10; }
           std::reverse(result.begin(), result.end());
           return result;
       }

       std::vector<int> genericAddition(std::vector<int> digits, int addend) {
           int carry = addend;
           for (int index = static_cast<int>(digits.size()) - 1; index >= 0 && carry > 0; --index) {
               int total = digits[index] + carry;
               digits[index] = total % 10;
               carry = total / 10;
           }
           while (carry > 0) {
               digits.insert(digits.begin(), carry % 10);
               carry /= 10;
           }
           return digits;
       }

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

为什么整数转换不可靠
~~~~~~~~~~~~~~~~~~

数组长度可远超 64 位整数范围。逐位构造固定宽整数会溢出，即使最终只加 1。数字数组本身已经是十进制表示，直接模拟竖式运算即可。

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

通用加法与专用加一的关系
~~~~~~~~~~~~~~~~~~~~~~~~

通用竖式维护 ``total`` 和 ``carry``，可以处理任意小加数。加一时 ``carry`` 初始为 1，且每轮只有“非 9 后终止”或“9 变 0”两种情况，专用实现可以省去除法和显式进位变量。

为什么没有前导零问题
~~~~~~~~~~~~~~~~~~~~

输入除单个 0 外没有前导零。普通情况不改变最高位为零；全 9 情况新增最高位 1。因而输出仍是规范十进制表示。

为什么结果数值正确
~~~~~~~~~~~~~~~~~~

处理过的后缀等价于十进制加一的进位链：每个 9 变 0 并向左传递 1；首个非 9 吸收进位并增加 1。若不存在非 9，新增最高位 1。两种情况都与十进制定义一致。

复杂度来源
~~~~~~~~~~

最坏扫描全部 ``n`` 位，时间 ``O(n)``。除返回数组外，原地版本额外空间 ``O(1)``；若复制输入以保持只读，复制成本和结果空间为 ``O(n)``。

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
