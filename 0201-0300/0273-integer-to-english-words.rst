0273. Integer to English Words
==============================

题目信息
--------

:题号: 0273
:难度: Hard
:主题: 整数表示、英文数字、字符串格式
:原题: `LeetCode 0273 <https://leetcode.com/problems/integer-to-english-words/>`_
:重点: 按十亿、百万、千和百位数量级表达、零值单独处理、单词间不能出现多余空格

题目重述
--------

给定一个非负整数 ``num``，返回它对应的英文数字字符串。数值应使用标准的 ``Billion``、``Million``、``Thousand`` 和 ``Hundred`` 等数量级词，并把每个非零部分按从高位到低位排列。

``num`` 位于 ``[0, 2^31 - 1]``。当输入为 ``0`` 时返回 ``"Zero"``。结果中的英文单词首字母采用题目示例所示的大写形式，相邻单词之间恰好使用一个空格，字符串开头和结尾都不能有空格；不添加英文口语中的 ``and``。

自建示例
--------

中间三位组含零：

.. code-block:: text

   输入：num = 1005
   输出："One Thousand Five"
   解释：1005 由一个千和五个一组成，百位与十位为零，因此不会产生对应单词，也不会留下多余空格。

两位整数：

.. code-block:: text

   输入：num = 42
   输出："Forty Two"
   解释：42 由四十和二组成，两个单词之间使用一个空格。

零值：

.. code-block:: text

   输入：num = 0
   输出："Zero"
   解释：零不按普通数量级拆分，题目规定直接返回单词 Zero。

按三位一组拆分
--------------

英文数量级每隔三位变化一次，因此把数字从高到低拆成 Billion、Million、Thousand 和末组三位。
每个非零三位组先用 ``underThousand`` 转成 ``1..999`` 的英文，再追加它对应的数量级单词；
值为 0 的组完全跳过。统一使用“追加单词并在必要时补一个空格”的方式，可避免组之间和结果两端多余空格。

三位组内部再按百位、十位和个位处理：20 以上使用 ``Tens`` 与个位，10 到 19 使用独立的 ``Teens``，
百位非零时追加 ``One Hundred`` 等。``num=0`` 是唯一不经过分组的特殊情况，直接返回 ``Zero``。

正确性说明
----------

三位分组是十进制表示的无损拆分，高位组先输出且每个数量级只在对应组非零时出现。
``underThousand`` 对任意 0 到 999 按百、十、个位覆盖互斥情形，并保持数值的位序；
把所有非零组按原顺序拼接后，恰好表达原数字，跳过零组不会改变数值也不会生成空白占位词。

C++ 实现
--------

.. code-block:: cpp

   class Solution {
       const std::vector<std::string> below_20{
           "", "One", "Two", "Three", "Four", "Five", "Six", "Seven",
           "Eight", "Nine", "Ten", "Eleven", "Twelve", "Thirteen",
           "Fourteen", "Fifteen", "Sixteen", "Seventeen", "Eighteen", "Nineteen"
       };
       const std::vector<std::string> tens{
           "", "", "Twenty", "Thirty", "Forty", "Fifty", "Sixty",
           "Seventy", "Eighty", "Ninety"
       };

       std::string underThousand(int value) const {
           std::string result;
           if (value >= 100) {
               result += below_20[value / 100] + " Hundred";
               value %= 100;
               if (value != 0) result += " ";
           }
           if (value >= 20) {
               result += tens[value / 10];
               value %= 10;
               if (value != 0) result += " ";
           }
           if (value > 0) result += below_20[value];
           return result;
       }

   public:
       std::string numberToWords(int num) {
           if (num == 0) return "Zero";

           const std::vector<int> scales{1000000000, 1000000, 1000, 1};
           const std::vector<std::string> names{
               "Billion", "Million", "Thousand", ""
           };
           std::string result;
           for (int i = 0; i < static_cast<int>(scales.size()); ++i) {
               const int group = num / scales[i];
               num %= scales[i];
               if (group == 0) continue;

               if (!result.empty()) result += " ";
               result += underThousand(group);
               if (!names[i].empty()) result += " " + names[i];
           }
           return result;
       }
   };

代码分析
--------

最多处理四个三位组和固定大小的词表，算法时间复杂度为 ``O(1)``（更准确地说与输出长度成正比），
额外空间为固定词表及结果字符串。分组时用整数除法和取余，不需要浮点数，也不会把 0 组错误写成数量级词。
