0013. Roman to Integer
======================

题目信息
--------

:题号: 0013
:难度: Easy
:主题: 字符串、映射、相邻关系
:原题: `LeetCode 0013 <https://leetcode.com/problems/roman-to-integer/>`_
:重点: 把规范罗马串拆成单符号与减法对，再把减法对展开为由右侧较大值决定的正负贡献

题目重述
--------

给定一个合法罗马数字字符串 ``s``，返回它表示的整数。

七个基本符号为 ``I=1``、``V=5``、``X=10``、``L=50``、``C=100``、``D=500``、``M=1000``。
通常符号按非增数值排列并相加；六种减法组合 ``IV``、``IX``、``XL``、``XC``、``CD``、``CM``
表示用右侧较大值减去左侧较小值。

字符串长度位于 ``[1, 15]``，只包含上述七种字符，并保证是 ``[1, 3999]`` 范围内整数的规范表示。
因此只需完成转换，不需要识别或修复 ``IC``、``VX`` 等非法写法。

自建示例
--------

* 只有加法符号：``s = "VIII"``，计算为 ``5 + 1 + 1 + 1``，返回 ``8``；
* 单个减法对：``s = "IX"``，计算为 ``10 - 1``，返回 ``9``；
* 多个减法对：``s = "CDXLIV"``，计算为 ``400 + 40 + 4``，返回 ``444``；
* 混合结构：``s = "MCMXLIV"``，计算为 ``1000 + 900 + 40 + 4``，返回 ``1944``；
* 单个符号：``s = "I"``，返回 ``1``。

C++ 实现
--------

.. code-block:: cpp

   #include <string>

   class Solution {
   private:
       int value(char symbol) {
           switch (symbol) {
               case 'I': return 1;
               case 'V': return 5;
               case 'X': return 10;
               case 'L': return 50;
               case 'C': return 100;
               case 'D': return 500;
               default: return 1000;
           }
       }

       int parseTokens(const std::string& s) {
           int result = 0;
           int index = 0;
           while (index < static_cast<int>(s.size())) {
               const int current = value(s[index]);
               if (index + 1 < static_cast<int>(s.size())) {
                   const int next = value(s[index + 1]);
                   if (current < next) {
                       result += next - current;
                       index += 2;
                       continue;
                   }
               }
               result += current;
               ++index;
           }
           return result;
       }

       int scanFromRight(const std::string& s) {
           int result = 0;
           int rightMaximum = 0;
           for (int index = static_cast<int>(s.size()) - 1; index >= 0; --index) {
               const int current = value(s[index]);
               if (current < rightMaximum) {
                   result -= current;
               } else {
                   result += current;
                   rightMaximum = current;
               }
           }
           return result;
       }

   public:
       int romanToInt(std::string s) {
           return scanFromRight(s);
       }
   };

题解
----

直接相加的缺口
~~~~~~~~~~~~~~

若把每个符号都作为正数相加，``VI`` 会正确得到 ``6``，``IV`` 却会错误得到 ``6``。区别不在符号本身，
而在较小符号是否位于较大符号左侧。

规范罗马串可以从左到右拆成两类单位：

* 一个普通符号，例如 ``M``、``D``、``III`` 中的每个 ``I``；
* 一个允许的减法对，例如 ``CM``、``XL``、``IV``。

题目保证输入合法，所以只要相邻值出现上升，当前两个字符就必然构成允许的减法对。

按单位解析
~~~~~~~~~~

``parseTokens`` 从左向右读取当前符号。若下一符号更大，就把两者作为一个减法单位，加入
``next - current`` 并前进两格；否则加入当前值并前进一格。

以 ``MCMXLIV`` 为例，它被依次拆为：

``M | CM | XL | IV``

各单位贡献 ``1000``、``900``、``40``、``4``，总和为 ``1944``。每个字符只属于一个单位，不会遗漏或
重复计算。

带符号贡献
~~~~~~~~~~

减法对 ``XY`` 的数值可以展开为：

``value(Y) - value(X) = -value(X) + value(Y)``。

因此不必真的把两个字符组合后再处理。只要知道当前较小符号的右侧存在更大值，就可以把当前值减去；其余符号
全部加上。

规范表示按十进制位从高到低排列，每个位置内部只有减法对会出现数值上升。于是从右向左扫描时：

* 当前值小于右侧已见最大值，它就是某个减法对的左半部分，应减去；
* 当前值不小于右侧最大值，它属于普通加法单位，应加上，并成为新的右侧最大值。

状态不变量
~~~~~~~~~~

``scanFromRight`` 每轮开始时维护两个事实：

* ``result`` 已经等于右侧处理区域的正确数值贡献；
* ``rightMaximum`` 是该区域出现过的最大符号值。

加入当前字符时，``current < rightMaximum`` 恰好表示它位于更大单位左侧。减去当前值后，右侧区域的解释保持
正确；否则当前值作为普通单位加入，并更新最大值。循环结束后，整个字符串的每个字符都已经获得唯一的正负
贡献。

对 ``MCMXLIV``，从右向左得到贡献序列：

``+V -I +L -X +M -C +M``

即 ``5 - 1 + 50 - 10 + 1000 - 100 + 1000 = 1944``。

代码演进
~~~~~~~~

``parseTokens`` 直接按照题目规则识别单符号与减法对，结构最接近罗马数字的书写定义。

``scanFromRight`` 把减法对展开为两个带符号贡献。相邻字符成对消费、索引跳两格和末尾边界判断全部消失，只需
维护右侧最大值。

公开入口采用 ``scanFromRight``。它与按单位解析具有相同的线性时间，状态更少，并能用一个循环统一处理所有
字符。

复杂度分析
~~~~~~~~~~

设字符串长度为 ``n``。两种方法都只访问每个字符常数次，时间复杂度为 ``O(n)``，工作空间为 ``O(1)``。
字符到数值的映射只有七种分支，单次查询为常数时间。
