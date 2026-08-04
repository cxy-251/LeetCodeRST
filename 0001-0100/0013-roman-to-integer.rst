0013. Roman to Integer
======================

题目信息
--------

:题号: 0013
:难度: Easy
:主题: 字符串、映射、相邻关系
:原题: `LeetCode 0013 <https://leetcode.com/problems/roman-to-integer/>`_
:重点: 从全部符号相加的失败出发，用右侧更大单位决定当前符号应加还是应减

题目重述
--------

给定一个合法罗马数字字符串 ``s``，返回它表示的整数。

七个基本符号为 ``I=1``、``V=5``、``X=10``、``L=50``、``C=100``、``D=500``、``M=1000``。
通常符号按非增数值排列并相加；六种减法组合 ``IV``、``IX``、``XL``、``XC``、``CD``、``CM``
表示较小符号从其右侧较大符号中扣除。

字符串长度位于 ``[1, 15]``，只包含上述七种字符，并保证是 ``[1, 3999]`` 范围内整数的规范表示。
本题不需要验证 ``IC``、``VX`` 等非法写法。

自建示例
--------

* 全部相加：``s = "VIII"``，返回 ``8``；
* 单个减法组合：``s = "IX"``，计算为 ``-1 + 10``，返回 ``9``；
* 多个减法组合：``s = "CDXLIV"``，计算为 ``400 + 40 + 4``，返回 ``444``；
* 加法与减法混合：``s = "MCMXLIV"``，返回 ``1944``；
* 重复大单位：``s = "MMMDCCLXXXVIII"``，返回 ``3788``；
* 最小值：``s = "I"``，返回 ``1``。

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

       int compareNeighbors(const std::string& s) {
           int result = 0;
           for (int index = 0; index < static_cast<int>(s.size()); ++index) {
               const int current = value(s[index]);
               if (index + 1 < static_cast<int>(s.size()) && current < value(s[index + 1])) {
                   result -= current;
               } else {
                   result += current;
               }
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

全部相加的缺口
~~~~~~~~~~~~~~

若把每个符号都作为正数相加，``VI`` 会正确得到 ``6``，``IV`` 却会错误得到 ``6``。两个字符串包含相同
符号，区别只在顺序：较小值位于较大值左侧时，它不再是独立加数，而是减法单位的左半部分。

因此解析的核心不是识别某个字符本身，而是判断当前符号右侧是否出现了使它转为负贡献的更大单位。

相邻比较
~~~~~~~~

规范罗马数字中的减法符号紧邻它所修饰的较大符号。从左向右扫描时：

* 当前值小于下一值，当前符号应减去；
* 当前值大于或等于下一值，当前符号应加上；
* 最后一个符号右侧没有单位，必然相加。

``compareNeighbors`` 直接实现这一规则。例如 ``CM`` 被计算为 ``-100 + 1000``，而 ``MC`` 被计算为
``1000 + 100``。

右侧基准
~~~~~~~~

相邻比较需要在每轮读取下一个字符。换一个扫描方向后，可以把已经看见的右侧信息压缩成一个整数。

``scanFromRight`` 从末尾开始，维护 ``rightMaximum``，表示右侧已经处理区域中的最大符号值：

* ``current < rightMaximum`` 时，当前符号位于更大单位左侧，应作为负贡献；
* ``current >= rightMaximum`` 时，当前符号属于正常加法段，应相加并更新右侧最大值。

合法输入保证减法组合符合罗马规范，因此不需要额外判断 ``I`` 只能放在 ``V`` 或 ``X`` 前。

状态推演
~~~~~~~~

对 ``MCMXLIV`` 从右向左扫描：

.. list-table::
   :header-rows: 1

   * - 字符
     - 当前值
     - 右侧最大值
     - 动作
     - 累计值
   * - ``V``
     - 5
     - 0
     - 加 5，更新为 5
     - 5
   * - ``I``
     - 1
     - 5
     - 减 1
     - 4
   * - ``L``
     - 50
     - 5
     - 加 50，更新为 50
     - 54
   * - ``X``
     - 10
     - 50
     - 减 10
     - 44
   * - ``M``
     - 1000
     - 50
     - 加 1000，更新为 1000
     - 1044
   * - ``C``
     - 100
     - 1000
     - 减 100
     - 944
   * - ``M``
     - 1000
     - 1000
     - 加 1000
     - 1944

局部贡献
~~~~~~~~

每个符号在规范表示中只有两种角色：普通加法单位，或某个减法组合中的较小单位。右侧较大值已经出现时，
当前角色可以立即确定，不需要等待更多字符。

减法组合 ``XY`` 由两次独立贡献 ``-value(X) + value(Y)`` 恢复；普通加法序列中的每个符号都贡献正值。
两种结构覆盖整个合法字符串，所以所有局部贡献之和就是原整数。

代码演进
~~~~~~~~

``compareNeighbors`` 每轮通过下一字符判断当前符号的正负，直接对应减法组合的局部定义。

``scanFromRight`` 删除下一字符访问，把整个已处理右侧压缩为 ``rightMaximum``。当前值一旦小于这个基准，就
必然属于减法贡献；否则它成为新的加法基准。

公开入口采用 ``scanFromRight``。两种方法都只扫描一次，右向扫描的状态定义更统一，最后一个字符也不需要
单独处理。

复杂度分析
~~~~~~~~~~

设字符串长度为 ``n``。两种方法都访问每个字符一次，每次执行常数次映射、比较和加减，时间复杂度为
``O(n)``，工作空间为 ``O(1)``。题目保证输入合法，所以算法只负责转换，不承担语法验证成本。
