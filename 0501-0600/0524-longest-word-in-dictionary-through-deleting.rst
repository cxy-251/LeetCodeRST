0524. Longest Word in Dictionary through Deleting
==================================================

题目信息
--------

:题号: 0524
:难度: Medium
:主题: 字符串、字典、子序列、长度与字典序
:原题: `LeetCode 0524 <https://leetcode.com/problems/longest-word-in-dictionary-through-deleting/>`_
:重点: 只能从源字符串删除字符、候选必须来自 dictionary、优先长度最长、并列取字典序最小

题目重述
--------

给定字符串 ``s`` 和字符串数组 ``dictionary``。可以从 ``s`` 中删除任意字符，但不能改变剩余字符的相对顺序。找出字典中能够通过这种方式得到的单词。

在所有可行单词中，返回长度最长者；若有多个长度相同的候选，返回字典序最小者。若没有任何候选，返回空字符串 ``""``。不能重新排列 ``s`` 中的字符，也不能返回不在字典中的字符串。

自建示例
--------

最长长度并列时比较字典序：

.. code-block:: text

   输入：s = "abpcd"，dictionary = ["ale","abc","abd"]
   输出："abc"
   解释："abc" 和 "abd" 都能按顺序从 s 中取得且长度同为 3；"abc" 的字典序更小。

没有可行单词：

.. code-block:: text

   输入：s = "xyz"，dictionary = ["xyzz","za"]
   输出：""
   解释：两个字典单词都不是 s 的子序列。

逐词验证并按优先级更新答案
--------------------------

对每个字典词用双指针判断它是否是 ``s`` 的子序列：源串指针向右扫描，匹配到候选字符时推进候选指针。可行词之间先比较长度，长度相同时按字典序较小者优先。

候选词本身不能重排，验证只允许跳过 ``s`` 的字符，正好符合删除操作的定义。

C++ 实现
--------

.. code-block:: cpp

   class Solution {
       bool canDeleteTo(const std::string& source,
                        const std::string& word) {
           int wanted = 0;
           for (char character : source) {
               if (wanted < static_cast<int>(word.size()) &&
                   character == word[wanted]) {
                   ++wanted;
               }
           }
           return wanted == static_cast<int>(word.size());
       }

   public:
       std::string findLongestWord(std::string s,
                                   std::vector<std::string>& dictionary) {
           std::string answer;
           for (const std::string& word : dictionary) {
               if (!canDeleteTo(s, word)) continue;
               if (word.size() > answer.size() ||
                   (word.size() == answer.size() && word < answer)) {
                   answer = word;
               }
           }
           return answer;
       }
   };

代码分析
--------

双指针只保留源串中按顺序出现的字符，证明了可行性判定；更新条件先比较长度、再比较字典序，正好实现题目规定的全序优先级。设源串长度为 ``n``、字典有 ``q`` 个词、总长度为 ``L``，时间复杂度为 ``O(qn + L)``，额外空间复杂度为 ``O(1)``。
