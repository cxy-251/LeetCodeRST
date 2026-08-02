0472. Concatenated Words
========================

题目信息
--------

:题号: 0472
:难度: Hard
:主题: 单词数组、字符串拼接、较短单词、结果集合
:原题: `LeetCode 0472 <https://leetcode.com/problems/concatenated-words/>`_
:重点: 目标词必须由至少两个较短单词完整拼接、单词可重复使用、不能使用目标词自身作为唯一组成部分

题目重述
--------

给定互不相同的非空小写单词数组 ``words``，返回其中所有拼接词。拼接词必须能够由数组中的至少两个较短单词首尾连接而成，并且拼接后恰好覆盖目标词的全部字符。

组成单词可以重复使用，例如一个目标词可以由同一个较短单词拼接多次。目标词不能只用自身一次来证明成立。``words.length`` 位于 ``[1, 10^4]``，单词长度位于 ``[1, 30]``，全部单词字符总数不超过 ``10^5``。结果顺序不限。

自建示例
--------

包含重复使用组成词：

.. code-block:: text

   输入：words = ["cat", "dog", "catdog", "dogcat", "catcat"]
   输出：["catdog", "dogcat", "catcat"]
   解释：前两个结果分别由 cat 和 dog 的不同顺序拼接；catcat 使用单词 cat 两次。

没有拼接词：

.. code-block:: text

   输入：words = ["red", "blue", "green"]
   输出：[]
   解释：任一单词都无法由数组中的至少两个较短单词完整组成。

按长度加入字典并做前缀切分
--------------------------

先按单词长度排序。判断当前单词时，集合中只包含已经处理过的单词，因而不会把当前单词自身作为唯一组成部分；对当前字符串做动态规划，``reachable[i]`` 表示前 ``i`` 个字符能由集合中的单词拼出。若 ``reachable[i]`` 为真且 ``word[i..j)`` 在集合中，就把 ``reachable[j]`` 设为真。

当 ``reachable[length]`` 为真时，至少经过了两个较短单词；判断结束后再把当前单词放入集合，供更长的单词使用。单词可重复使用，因为同一个集合单词可以在不同的切分位置被查到。

C++ 实现
--------

.. code-block:: cpp

   class Solution {
   public:
       std::vector<std::string> findAllConcatenatedWordsInADict(
           std::vector<std::string>& words) {
           std::sort(words.begin(), words.end(),
                     [](const std::string& left, const std::string& right) {
                         return left.size() < right.size();
                     });

           std::unordered_set<std::string> dictionary;
           std::vector<std::string> result;
           for (const std::string& word : words) {
               int n = static_cast<int>(word.size());
               std::vector<bool> reachable(n + 1, false);
               reachable[0] = true;
               for (int begin = 0; begin < n; ++begin) {
                   if (!reachable[begin]) continue;
                   for (int end = begin + 1; end <= n; ++end) {
                       if (dictionary.count(word.substr(begin, end - begin))) {
                           reachable[end] = true;
                       }
                   }
               }
               if (reachable[n]) result.push_back(word);
               dictionary.insert(word);
           }
           return result;
       }
   };

代码分析
--------

按长度处理保证组成词短于当前目标，避免“自身一次匹配”造成假阳性；布尔状态的每次转移都对应一个真实的单词边界，所以终点可达就代表完整拼接。设最大单词长度为 ``L``，哈希查找平均常数时总时间约为 ``O(sum |word| * L^2)``（包含子串构造），额外空间为 ``O(sum |word|)``。
