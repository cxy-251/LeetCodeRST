0557. Reverse Words in a String III
===================================

题目信息
--------

:题号: 0557
:难度: Easy
:主题: 句子、单词内反转、单词顺序、空格保留
:原题: `LeetCode 0557 <https://leetcode.com/problems/reverse-words-in-a-string-iii/>`_
:重点: 只反转每个单词内部字符、单词排列顺序不变、单词之间仍由一个空格分隔

题目重述
--------

给定一个由单词和空格组成的字符串 ``s``。分别反转每个单词中的字符顺序，但保持各单词在句子中的先后顺序以及单词之间的空格位置不变。

输入中单词之间恰好有一个空格，开头和结尾没有空格。返回处理后的完整字符串；不能把单词顺序整体反转。

自建示例
--------

多个不同长度的单词：

.. code-block:: text

   输入：s = "GPU code runs"
   输出："UPG edoc snur"
   解释：三个单词分别在内部反转，原来的单词顺序保持不变。

单字符单词：

.. code-block:: text

   输入：s = "a bc"
   输出："a cb"
   解释：单字符单词反转后不变，第二个单词由 bc 变为 cb。

按空格定位每个单词并原地反转
----------------------------

用两个指针确定一个连续非空单词的起止位置，调用 ``reverse`` 只改变该区间；跳过空格后继续处理下一个单词。由于从不交换空格或单词区间的顺序，原句布局保持不变。

C++ 实现
--------

.. code-block:: cpp

   class Solution {
   public:
       std::string reverseWords(std::string s) {
           int begin = 0;
           while (begin < static_cast<int>(s.size())) {
               int end = begin;
               while (end < static_cast<int>(s.size()) && s[end] != ' ') {
                   ++end;
               }
               std::reverse(s.begin() + begin, s.begin() + end);
               begin = end + 1;
           }
           return s;
       }
   };

代码分析
--------

每个单词边界只由空格确定，局部反转不会影响其他字符；单词长度为 1 时区间反转也保持原样。时间复杂度为 ``O(n)``，额外空间复杂度为 ``O(1)``（不计输入副本）。
