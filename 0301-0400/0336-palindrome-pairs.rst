0336. Palindrome Pairs
======================

题目信息
--------

:题号: 0336
:难度: Hard
:主题: 字符串数组、下标对、字符串拼接、回文
:原题: `LeetCode 0336 <https://leetcode.com/problems/palindrome-pairs/>`_
:重点: ``i`` 与 ``j`` 必须不同、拼接顺序影响结果、空字符串可以参与、返回所有有序下标对

题目重述
--------

给定互不相同的字符串数组 ``words``，返回所有满足 ``i != j`` 且 ``words[i] + words[j]`` 是回文字符串的有序下标对 ``[i, j]``。

``words`` 的长度位于 ``[1, 5000]``，每个字符串长度位于 ``[0, 300]``，字符只包含小写英文字母。空字符串是合法输入项；若另一个单词本身是回文，它与空字符串按两个拼接方向可能分别形成答案。``[i,j]`` 与 ``[j,i]`` 是不同候选，结果顺序不限，但不能重复返回同一个下标对。

自建示例
--------

反转单词与空字符串同时出现：

.. code-block:: text

   输入：words = ["abc", "cba", "x", ""]
   输出：[[0,1], [1,0], [2,3], [3,2]]
   解释："abc"+"cba" 和反向拼接都为回文；"x" 本身是回文，所以它与空字符串的两个拼接顺序也都合法。

没有可组成回文的单词对：

.. code-block:: text

   输入：words = ["ab", "cd"]
   输出：[]
   解释：两个可能的拼接 "abcd" 和 "cdab" 都不是回文。

在每个拼接边界切开
--------------------

考虑固定的 ``words[i]``，如果它与另一个单词拼接后是回文，那么两词的边界一定把这个回文划分成两段。对每个切分位置 ``split``，记前缀为 ``prefix``、后缀为 ``suffix``：若 ``suffix`` 本身是回文，前缀的反转就可以放在它左侧；若 ``prefix`` 是回文，后缀的反转就可以放在它右侧。把所需的反转字符串放入哈希表查找，就不需要枚举另一个单词并实际拼接。

切分位置包含两端，因此能覆盖空字符串参与的情况；同一回文单词与空字符串可能在端点切分中被重复发现，结果用集合按下标对去重。只有找到的下标与 ``i`` 不同，才能满足题目的 ``i != j``。

C++ 实现
--------

.. code-block:: cpp

   class Solution {
       bool isPalindrome(const std::string& word,
                         int left, int right) {
           while (left < right) {
               if (word[left++] != word[right--]) return false;
           }
           return true;
       }

   public:
       std::vector<std::vector<int>> palindromePairs(
           std::vector<std::string>& words) {
           std::unordered_map<std::string, int> index;
           for (int i = 0; i < static_cast<int>(words.size()); ++i) {
               index[words[i]] = i;
           }

           std::set<std::pair<int, int>> uniquePairs;
           for (int i = 0; i < static_cast<int>(words.size()); ++i) {
               const std::string& word = words[i];
               int length = static_cast<int>(word.size());
               for (int split = 0; split <= length; ++split) {
                   if (isPalindrome(word, split, length - 1)) {
                       std::string need = word.substr(0, split);
                       std::reverse(need.begin(), need.end());
                       auto it = index.find(need);
                       if (it != index.end() && it->second != i) {
                           uniquePairs.insert({i, it->second});
                       }
                   }

                   if (isPalindrome(word, 0, split - 1)) {
                       std::string need = word.substr(split);
                       std::reverse(need.begin(), need.end());
                       auto it = index.find(need);
                       if (it != index.end() && it->second != i) {
                           uniquePairs.insert({it->second, i});
                       }
                   }
               }
           }

           std::vector<std::vector<int>> result;
           for (const auto& pair : uniquePairs) {
               result.push_back({pair.first, pair.second});
           }
           return result;
       }
   };

代码分析
--------

``isPalindrome`` 对空区间也返回真，因此 ``split == 0`` 和 ``split == length`` 能自然处理空前缀或空后缀。两种方向分别对应回文边界的左右两侧，避免漏掉有序下标对；集合只去掉同一对被不同切分重复产生的情况。设单词总长度为 ``L``、最大长度为 ``m``，朴素边界检查总成本约为 ``O(Lm)``，哈希查找为平均常数，额外空间为反转临时串和结果集合。
