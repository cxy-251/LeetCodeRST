0290. Word Pattern
=================

题目信息
--------

:题号: 0290
:难度: Easy
:主题: 字符串、单词序列、双射映射
:原题: `LeetCode 0290 <https://leetcode.com/problems/word-pattern/>`_
:重点: 模式字符与单词必须一一对应、相同字符映射相同单词、不同字符不能共享单词、数量必须一致

题目重述
--------

给定只包含小写英文字母的模式串 ``pattern``，以及由若干小写英文单词组成的字符串 ``s``。``s`` 中相邻单词由一个空格分隔，并且没有前导或尾随空格。判断单词序列是否完全遵循模式串。

所谓遵循模式，是指模式字符与单词之间存在双射：同一个模式字符在每次出现时必须对应同一个单词；两个不同模式字符不能对应同一个单词；同时单词数量必须恰好等于 ``pattern`` 的字符数量，不能有多余或缺失。

``pattern`` 的长度位于 ``[1, 300]``，``s`` 的长度位于 ``[1, 3000]``，其中的单词只包含小写英文字母。函数只返回布尔结果，不需要返回具体映射。

自建示例
--------

双向对应成立：

.. code-block:: text

   输入：pattern = "abba"，s = "red blue blue red"
   输出：true
   解释：a 始终对应 red，b 始终对应 blue，并且两个字符没有映射到同一个单词。

不同字符错误地共享单词：

.. code-block:: text

   输入：pattern = "ab"，s = "same same"
   输出：false
   解释：a 和 b 是不同字符，却都对应 same，违反一一对应关系。

数量不一致：

.. code-block:: text

   输入：pattern = "abc"，s = "one two"
   输出：false
   解释：模式有三个字符，但字符串只有两个单词，无法逐项建立映射。

字符与单词的双向映射
--------------------

先按空格解析出单词序列，并检查单词数是否等于 ``pattern`` 长度。随后同步扫描：

.. code-block:: text

   pattern_to_word[pattern[i]] = words[i]
   word_to_pattern[words[i]] = pattern[i]

同一方向的旧映射必须一致，反方向也必须一致；只有两个方向都没有冲突时才登记新配对。
只维护字符到单词的单向表会错误接受 ``ab`` 与 ``same same``，所以反向表不可省略。

正确性说明
----------

单词数量相等保证每个模式位置都有且只有一个对应位置。扫描前缀时，两个映射表记录的正是此前所有配对；
若发现源字符对应不同单词或不同字符共享一个单词，任何双射都不可能满足，返回假；
否则加入的新配对保持双向唯一性。扫描结束时所有位置都满足同一映射，因而返回真当且仅当存在合法双射。

C++ 实现
--------

.. code-block:: cpp

   class Solution {
   public:
       bool wordPattern(const std::string& pattern, const std::string& s) {
           std::istringstream input(s);
           std::vector<std::string> words;
           std::string word;
           while (input >> word) words.push_back(word);
           if (words.size() != pattern.size()) return false;

           std::unordered_map<char, std::string> pattern_to_word;
           std::unordered_map<std::string, char> word_to_pattern;
           for (int i = 0; i < static_cast<int>(pattern.size()); ++i) {
               const char letter = pattern[i];
               const std::string& current = words[i];

               auto pattern_it = pattern_to_word.find(letter);
               if (pattern_it != pattern_to_word.end() &&
                   pattern_it->second != current) return false;
               auto word_it = word_to_pattern.find(current);
               if (word_it != word_to_pattern.end() &&
                   word_it->second != letter) return false;

               pattern_to_word[letter] = current;
               word_to_pattern[current] = letter;
           }
           return true;
       }
   };

代码分析
--------

解析字符串和映射扫描均为线性；哈希表平均时间复杂度为 ``O(|s|)``，额外空间为不同单词数和模式字符数之和。
``istringstream`` 按空格提取单词，符合题目没有前导、尾随和重复分隔空格的输入合同；输入字符串不被修改。
