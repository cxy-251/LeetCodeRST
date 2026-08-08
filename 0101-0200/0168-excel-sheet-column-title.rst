0168. Excel Sheet Column Title
==============================

题目信息
--------

:题号: 0168. Excel 表列名称
:难度: Easy
:主题: 数学、双射进制、字符串
:原题: `LeetCode 0168 <https://leetcode.com/problems/excel-sheet-column-title/>`_
:重点: 从一基字母位推导商和余数，用“先减一”把每位映射到普通的 0..25

题目重述
--------

给定正整数 ``columnNumber``，返回 Excel 中对应的列名称。列号从 1 开始，``1..26``
依次对应 ``A..Z``；之后是 ``AA、AB``，以此类推。

列名称只包含大写英文字母。它看似二十六进制，但没有表示零的字符：每一位的取值是
``A..Z`` 对应的 ``1..26``，而不是普通进制的 ``0..25``。

自建示例
--------

.. code-block:: text

   输入：columnNumber = 26
   输出："Z"

   26 仍由一个字母表示，不能按普通二十六进制写成两位。

.. code-block:: text

   输入：columnNumber = 52
   输出："AZ"

   最低位是 Z，剩余高位是 A。

.. code-block:: text

   输入：columnNumber = 703
   输出："AAA"

   702 对应 ZZ，下一个列号进入三位名称。

C++ 实现
--------

.. code-block:: cpp

   #include <algorithm>
   #include <string>

   class Solution {
   public:
       std::string convertToTitle(int columnNumber) {
           std::string reversed_title;

           while (columnNumber > 0) {
               --columnNumber;
               int digit = columnNumber % 26;
               reversed_title.push_back(
                   static_cast<char>('A' + digit));
               columnNumber /= 26;
           }

           std::reverse(
               reversed_title.begin(), reversed_title.end());
           return reversed_title;
       }
   };

题解
----

枚举列名没有利用数值结构
~~~~~~~~~~~~~~~~~~~~~~~~

从 ``A`` 开始依次生成 ``B、...、Z、AA``，数到目标列时停止，当然可以得到答案；但它
把所有较小列名都当成搜索空间，工作量与 ``columnNumber`` 成正比。真正需要的是像进制
转换一样，直接从列号求出每一位。

普通二十六进制不能直接套用。普通进制中余数 0 是合法最低位，而 Excel 没有零字符，
并把 ``Z`` 当作第 26 个数字。若直接计算 ``columnNumber % 26``，列号 26 会得到余数
0，却没有字符可映射；列号 52 也会在最低位遇到同样问题。

从一基位推导递推式
~~~~~~~~~~~~~~~~~~

设最低位字母代表 ``digit``，其数值范围为 ``1..26``。任意正列号都能唯一写成：

.. code-block:: text

   columnNumber = higher * 26 + digit
   其中 1 <= digit <= 26

为了使用计算机方便的余数 ``0..25``，把等式两边先减一：

.. code-block:: text

   zeroBasedDigit = (columnNumber - 1) % 26
   higher         = (columnNumber - 1) / 26

``zeroBasedDigit`` 的 ``0..25`` 正好映射到 ``A..Z``。这就是循环中先执行
``--columnNumber``，再取模和整除的原因；减一不是边界补丁，而是把一基数字系统转换成
零基运算的完整推导。

状态如何缩小
~~~~~~~~~~~~

每轮取出当前最低位后，整除得到尚未编码的高位 ``higher``。只要它仍大于 0，就重复同样
过程。列号每轮约缩小到原来的二十六分之一，不需要生成任何位于目标之前的列名。

取模天然先得到最低位。若每次把字符插到字符串开头，已有字符会反复后移；代码将字符
追加到 ``reversed_title``，最后一次反转，把构造过程保持在线性于答案长度的范围内。

具体走读
~~~~~~~~

对列号 52：

.. code-block:: text

   当前列号  减一后  余数  字母  剩余高位  反向结果
   52        51      25    Z     1         Z
   1         0       0    A     0         ZA

循环结束后反转 ``"ZA"``，得到 ``"AZ"``。

边界 26 的第一轮是 ``25 % 26 = 25``，直接得到 ``Z``，剩余高位为 0；边界 27 则先
得到最低位 ``A``，再从高位 1 得到另一个 ``A``，结果是 ``AA``。这些位置正是普通取模
最容易出错的地方。

正确性
~~~~~~

每轮递推都唯一分解出合法的最低位 ``digit`` 和更小的非负高位 ``higher``；写出的字母
与该最低位一一对应。不断整除最终必到 0，此时所有高位都已处理。反转只恢复从高位到
低位的书写顺序，不改变每一位。由唯一分解可知，最终列名既能还原原列号，也不可能与
另一个列号共享同一表示。

复杂度
~~~~~~

设答案长度为 ``k = O(log_26 columnNumber)``。循环和最终反转都需要 ``O(k)`` 时间；
除返回字符串外只使用常数状态，额外空间为 ``O(1)``，返回字符串占 ``O(k)``。
