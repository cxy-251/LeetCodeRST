0151. Reverse Words in a String
===============================

题目信息
--------

:题号: 0151
:难度: Medium
:主题: 字符串、双指针、原地整理
:原题: `LeetCode 0151 <https://leetcode.com/problems/reverse-words-in-a-string/>`_
:重点: 单词边界、空格归一化、整体反转与逐词反转

题目重述
--------

给定字符串 ``s``，把其中单词的顺序反转后返回。单词由非空格字符组成；输出不能保留首尾空格，并且相邻单词之间只保留一个空格。

自建示例
--------

.. code-block:: text

   输入："  the   sky is blue  "
   输出："blue is sky the"

C++ 实现
--------

.. code-block:: cpp

   #include <algorithm>
   #include <string>
   #include <vector>

   class Solution {
   private:
       std::string splitAndJoin(const std::string& s) {
           std::vector<std::string> words;
           for (int i = 0, n = s.size(); i < n; ) {
               while (i < n && s[i] == ' ') ++i;
               if (i == n) break;
               int start = i;
               while (i < n && s[i] != ' ') ++i;
               words.push_back(s.substr(start, i - start));
           }
           std::string result;
           for (int i = static_cast<int>(words.size()) - 1; i >= 0; --i) {
               if (!result.empty()) result.push_back(' ');
               result += words[i];
           }
           return result;
       }

       std::string compactAndReverse(std::string s) {
           int write = 0;
           for (int read = 0, n = s.size(); read < n; ) {
               while (read < n && s[read] == ' ') ++read;
               if (read == n) break;
               if (write > 0) s[write++] = ' ';
               while (read < n && s[read] != ' ') s[write++] = s[read++];
           }
           s.resize(write);
           std::reverse(s.begin(), s.end());
           for (int start = 0; start < write; ) {
               int end = start;
               while (end < write && s[end] != ' ') ++end;
               std::reverse(s.begin() + start, s.begin() + end);
               start = end + 1;
           }
           return s;
       }

   public:
       std::string reverseWords(std::string s) {
           return compactAndReverse(std::move(s));
       }
   };

题解
----

空格为何先归一化
~~~~~~~~

输出只允许单词之间一个空格，首尾不能保留空格。先用读写指针把有效单词紧凑写回，得到规范字符串，后续反转不再处理多余空格。

两次反转为何得到目标顺序
~~~~~~~~~~~~~~~~~~~~~~~~

整体反转会同时颠倒单词顺序和单词内部字符；再逐个反转单词，只恢复每个单词内部顺序，单词排列仍保持倒序。

复杂度来源
~~~~~~~~~~

每个字符参加常数次扫描或交换，时间 ``O(n)``。算法在传值字符串上原地整理，除返回字符串外额外空间 ``O(1)``；拆词数组方法需要 ``O(n)`` 额外空间。