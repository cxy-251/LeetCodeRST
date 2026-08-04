0012. Integer to Roman
======================

题目信息
--------

:题号: 0012
:难度: Medium
:主题: 字符串、查表、贪心
:原题: `LeetCode 0012 <https://leetcode.com/problems/integer-to-roman/>`_
:重点: 把减法写法纳入合法单位，并从按十进制位展开推导到按最大罗马单位逐段消耗

题目重述
--------

给定范围 ``[1, 3999]`` 内的整数 ``num``，返回它的规范罗马数字表示。

七个基本符号为 ``I=1``、``V=5``、``X=10``、``L=50``、``C=100``、``D=500``、``M=1000``。
通常按照数值从大到小排列并相加；以下六种情况采用减法写法：``IV=4``、``IX=9``、``XL=40``、
``XC=90``、``CD=400``、``CM=900``。

减法写法只发生在对应十进制位内，例如 ``49`` 必须写成 ``XLIX``，不能写成跨位减法 ``IL``。

自建示例
--------

* 多个减法单位：``num = 2944``，分解为 ``2000 + 900 + 40 + 4``，返回 ``"MMCMXLIV"``；
* 全部使用加法单位：``num = 3888``，返回 ``"MMMDCCCLXXXVIII"``；
* 同一位的上界形式：``num = 999``，分解为 ``900 + 90 + 9``，返回 ``"CMXCIX"``；
* 跨位减法禁止：``num = 49``，返回 ``"XLIX"``；
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
           return thousands[num / 1000] + hundreds[num / 100 % 10] + tens[num / 10 % 10] + ones[num % 10];
       }

       std::string greedyUnits(int num) {
           static const std::array<int, 13> values{1000, 900, 500, 400, 100, 90, 50, 40, 10, 9, 5, 4, 1};
           static const std::array<std::string, 13> symbols{
               "M", "CM", "D", "CD", "C", "XC", "L", "XL", "X", "IX", "V", "IV", "I"
           };
           std::string result;
           for (int index = 0; index < static_cast<int>(values.size()); ++index) {
               const int count = num / values[index];
               num %= values[index];
               for (int used = 0; used < count; ++used) {
                   result += symbols[index];
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

十进制位模板
~~~~~~~~~~~~

输入最多四位，并且每个十进制位只有十种可能。以百位为例：

``0, C, CC, CCC, CD, D, DC, DCC, DCCC, CM``

分别对应百位数字 ``0`` 到 ``9``。十位和个位具有完全相同的结构，只需把符号替换为对应数量级；千位在
题目范围内只可能是空串、``M``、``MM`` 或 ``MMM``。

``byDecimalPlaces`` 分别取出千、百、十、个位并查表连接。它把全部规则提前展开，转换时只执行四次索引。

减法单位
~~~~~~~~

若值表只包含七个基本符号，``4`` 会被写成 ``IIII``，``9`` 会被写成 ``VIIII``。问题不在于最后几个字符
需要修补，而在于 ``IV`` 和 ``IX`` 本身就是规范表示中不可再拆的选择单位。

把 ``4``、``9``、``40``、``90``、``400``、``900`` 连同对应符号加入值表后，所有允许的减法结构都与
普通符号使用相同的选择逻辑。算法不再需要输出后回退修改。

降序单位
~~~~~~~~

将十三个合法单位按数值降序排列。处理当前单位 ``value`` 时，商 ``num / value`` 表示该单位在当前位置最多
出现多少次，余数 ``num % value`` 则交给更小单位继续表示。

例如 ``2944`` 的状态依次为：

.. list-table::
   :header-rows: 1

   * - 当前值
     - 单位
     - 次数
     - 追加
     - 余数
   * - 2944
     - 1000
     - 2
     - ``MM``
     - 944
   * - 944
     - 900
     - 1
     - ``CM``
     - 44
   * - 44
     - 40
     - 1
     - ``XL``
     - 4
   * - 4
     - 4
     - 1
     - ``IV``
     - 0

最终得到 ``MMCMXLIV``。

贪心选择
~~~~~~~~

规范罗马数字按数值从大到小书写。当前剩余值能够容纳某个最大单位时，该单位就是当前输出中能够使用的最大
合法前缀。

若跳过它而只使用更小单位，需要用更多字符表示同样数值，或者形成 ``IIII``、``VIIII``、``CCCC`` 等
非规范结构。值表已经包含每个数量级的合法减法单位，因此选择当前最大单位不会阻断后续规范表示。

每次取商后，余数严格小于当前单位，后续只需访问更小单位。输出顺序天然保持非增，不需要回溯。

代码演进
~~~~~~~~

``byDecimalPlaces`` 把每个十进制位的十种写法全部列出。它最直接地反映罗马规则与十进制位之间的对应关系，
代价是四张具有相似结构的表。

``greedyUnits`` 提取十三个可复用的罗马单位。四张按位表被替换为一张降序值表；商决定重复次数，余数决定
下一状态。同一循环同时处理基本符号与减法组合。

公开入口采用 ``greedyUnits``。它仍然只处理常量规模的单位表，并更直接展示“规范单位从大到小消耗整数”的
通用转换过程。

复杂度分析
~~~~~~~~~~

题目范围固定为 ``[1, 3999]``，四张按位表和十三项单位表均为常量规模，两种方法的时间与工作空间都可以
记为 ``O(1)``。返回字符串最长只有常量数量字符；若推广输入范围，贪心方法的时间与单位表大小和输出长度
相关。
