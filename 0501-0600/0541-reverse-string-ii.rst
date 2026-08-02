0541. Reverse String II
=======================

题目信息
--------

:题号: 0541
:难度: Easy
:主题: 字符串分块、每 2k 个字符、局部反转、尾部规则
:原题: `LeetCode 0541 <https://leetcode.com/problems/reverse-string-ii/>`_
:重点: 每个 2k 分组只反转前 k 个字符、尾部少于 k 时全部反转、尾部介于 k 与 2k 时只反转前 k 个

题目重述
--------

给定字符串 ``s`` 和正整数 ``k``。从字符串开头起，每连续 ``2k`` 个字符视为一组，把每组的前 ``k`` 个字符反转，后 ``k`` 个字符保持原顺序。

若最后剩余字符少于 ``k`` 个，则把这些字符全部反转；若剩余字符数量不少于 ``k`` 但少于 ``2k``，则只反转其中前 ``k`` 个字符。返回处理后的字符串。

自建示例
--------

尾部介于 k 与 2k 之间：

.. code-block:: text

   输入：s = "abcdefghij"，k = 3
   输出："cbadefihgj"
   解释：前六个字符中 abc 被反转；剩余 ghij 有四个字符，只反转前 3 个得到 ihgj。

尾部少于 k：

.. code-block:: text

   输入：s = "abcd"，k = 6
   输出："dcba"
   解释：整个字符串长度小于 k，因此全部反转。

以 ``2k`` 为步长处理局部区间
----------------------------

从下标 0 开始，每次定位一个长度最多为 ``2k`` 的块，只反转该块的前 ``k`` 个字符；``std::min(i+k, n)`` 自动处理尾部不足 ``k`` 的情况。块的后半段从未被传给反转区间，因此保持原序。

C++ 实现
--------

.. code-block:: cpp

   class Solution {
   public:
       std::string reverseStr(std::string s, int k) {
           for (int begin = 0; begin < static_cast<int>(s.size());
                begin += 2 * k) {
               int end = std::min(begin + k,
                                  static_cast<int>(s.size()));
               std::reverse(s.begin() + begin, s.begin() + end);
           }
           return s;
       }
   };

代码分析
--------

每个字符恰好属于一个长度 ``2k`` 的处理块，块内只有前 ``k`` 个位置被反转；最后一个块的三种长度关系由截断边界统一覆盖。时间复杂度为 ``O(n)``，额外空间复杂度为 ``O(1)``（不计输入副本）。
