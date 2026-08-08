0012. Integer to Roman
======================

题目信息
--------

:题号: 0012. 整数转罗马数字
:难度: Medium
:主题: 字符串、查表、贪心
:原题: `LeetCode 0012 <https://leetcode.com/problems/integer-to-roman/>`_
:重点: 先确定每个十进制位的唯一规范模板，再把四组模板展开为降序罗马单位表

题目重述
--------

给定范围 ``[1, 3999]`` 内的整数 ``num``，返回它的规范罗马数字表示。

七个基本符号为 ``I=1``、``V=5``、``X=10``、``L=50``、``C=100``、``D=500``、``M=1000``。
通常按照数值从大到小书写并相加；以下六个组合采用减法写法：``IV=4``、``IX=9``、``XL=40``、
``XC=90``、``CD=400``、``CM=900``。

减法只能发生在同一个十进制位内。例如 ``49`` 由 ``40`` 和 ``9`` 分别转换为 ``XL`` 与 ``IX``，结果是
``XLIX``，不能跨越十位和个位写成 ``IL``。

自建示例
--------

* 普通加法形式：``num = 58``，分解为 ``50 + 8``，返回 ``"LVIII"``；
* 多个减法组合：``num = 2944``，分解为 ``2000 + 900 + 40 + 4``，返回 ``"MMCMXLIV"``；
* 每一位都是 9：``num = 999``，返回 ``"CMXCIX"``；
* 禁止跨位减法：``num = 49``，返回 ``"XLIX"``；
* 最小值：``num = 1``，返回 ``"I"``；
* 最大值：``num = 3999``，返回 ``"MMMCMXCIX"``。

C++ 实现
--------

.. code-block:: cpp

   #include <array>
   #include <string>

   class Solution {
   private:
       std::string byDecimalPlaces(int num) {
           static const std::array<std::string, 4> thousands{"", "M", "MM", "MMM"};
           static const std::array<std::string, 10> hundreds{
               "", "C", "CC", "CCC", "CD", "D", "DC", "DCC", "DCCC", "CM"
           };
           static const std::array<std::string, 10> tens{
               "", "X", "XX", "XXX", "XL", "L", "LX", "LXX", "LXXX", "XC"
           };
           static const std::array<std::string, 10> ones{
               "", "I", "II", "III", "IV", "V", "VI", "VII", "VIII", "IX"
           };
           return thousands[num / 1000] + hundreds[num / 100 % 10] +
               tens[num / 10 % 10] + ones[num % 10];
       }

       std::string greedyUnits(int num) {
           static const std::array<int, 13> values{1000, 900, 500, 400, 100, 90, 50, 40, 10, 9, 5, 4, 1};
           static const std::array<std::string, 13> symbols{
               "M", "CM", "D", "CD", "C", "XC", "L", "XL", "X", "IX", "V", "IV", "I"
           };
           std::string result;
           for (int index = 0; index < static_cast<int>(values.size()); ++index) {
               while (num >= values[index]) {
                   result += symbols[index];
                   num -= values[index];
               }
           }
           return result;
       }

   public:
       std::string intToRoman(int num) {
           return greedyUnits(num);
       }
   };

题解
----

单个数位
~~~~~~~~

罗马数字的规范规则可以先缩小到一个十进制位。设当前位的 ``1``、``5``、``10`` 单位分别记为
``one``、``five``、``ten``，数字 ``0`` 到 ``9`` 的结构固定为：

.. code-block:: text

   0      -> ""
   1..3   -> one 重复 1..3 次
   4      -> one + five
   5..8   -> five + one 重复 0..3 次
   9      -> one + ten

个位使用 ``I``、``V``、``X``，十位使用 ``X``、``L``、``C``，百位使用 ``C``、``D``、``M``。
千位在题目范围内只需要重复 ``M`` 零到三次。

因此每个十进制位都有唯一的规范文本，并且各位从高到低直接连接即可。``byDecimalPlaces`` 把这四组局部结果
完整列成表，分别取出千位、百位、十位和个位后完成连接。

减法单位
~~~~~~~~

若转换过程只认识七个基本符号，``4`` 会被拆成 ``IIII``，``9`` 会被拆成 ``VIIII``，与上面的规范模板
冲突。``IV`` 和 ``IX`` 不是输出完成后的修补规则，而是个位模板中的完整单位。

同理，``XL``、``XC``、``CD``、``CM`` 也必须与普通符号一起参与选择。加入这六项后，完整单位表为：

.. code-block:: text

   1000, 900, 500, 400, 100, 90, 50, 40, 10, 9, 5, 4, 1

这张表只是把千、百、十、个位的局部模板按数值降序展开，并没有引入新的罗马数字规则。

最大单位
~~~~~~~~

``greedyUnits`` 从最大单位开始，只要当前剩余值能够容纳该单位，就追加对应符号并扣除它。

这里的正确性不是来自“任意数值单位都可以使用最大值贪心”，而是来自已经确定的数位模板。对任意一个数位：

* 数字为 ``9`` 时，规范前缀必须是该位的 ``9`` 单位；
* 数字位于 ``5`` 到 ``8`` 时，必须先使用 ``5`` 单位，再追加若干 ``1`` 单位；
* 数字为 ``4`` 时，必须使用 ``4`` 单位；
* 数字位于 ``0`` 到 ``3`` 时，只使用对应数量的 ``1`` 单位。

降序表的访问顺序恰好执行这四种情况。一个数位处理完成后，剩余值不足以再次使用该位的更大单位，循环自然
进入下一十进制位，因此不会产生跨位减法或非法重复。

例如 ``2944`` 的选择顺序是：

.. code-block:: text

   2944 -> M  -> 1944
   1944 -> M  -> 944
    944 -> CM -> 44
     44 -> XL -> 4
      4 -> IV -> 0

连接得到 ``MMCMXLIV``，与按位模板 ``2000 + 900 + 40 + 4`` 完全一致。

代码演进
~~~~~~~~

``byDecimalPlaces`` 直接保存每个数位的十种规范结果，转换时只做四次索引。它最清楚地展示了规则来源，
但百位、十位和个位三张表具有相同结构。

``greedyUnits`` 把这些重复模板压缩成十三个合法单位。四次独立查表被替换为同一个降序循环；每次追加的符号
都是当前数位规范模板的下一个片段。

公开入口采用 ``greedyUnits``。它比按位表更紧凑，同时保留了规范表示从高位到低位生成的顺序。

复杂度分析
~~~~~~~~~~

题目把输入限制在 ``[1, 3999]``，十进制位数、单位表长度和输出长度都有常量上界，因此两种方法的时间与
工作空间都可记为 ``O(1)``。不计返回字符串，贪心实现只维护剩余整数、单位下标和结果构造状态。
