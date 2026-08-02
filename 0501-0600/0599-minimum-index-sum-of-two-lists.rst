0599. Minimum Index Sum of Two Lists
===================================

题目信息
--------

:题号: 0599
:难度: Easy
:主题: 两个字符串列表、公共元素、索引和、并列答案
:原题: `LeetCode 0599 <https://leetcode.com/problems/minimum-index-sum-of-two-lists/>`_
:重点: 字符串必须同时出现于两表、比较两个零基下标之和、返回全部最小并列项、顺序不限

题目重述
--------

给定两个不含重复字符串的列表 ``list1`` 和 ``list2``。对于同时出现在两个列表中的字符串，计算它在 ``list1`` 和 ``list2`` 中的零基下标之和。

返回所有下标和达到最小值的公共字符串。题目保证至少存在一个公共字符串；若多个字符串并列最小，必须全部返回，结果顺序不限。

自建示例
--------

只有一个最优公共字符串：

.. code-block:: text

   输入：list1 = ["A","B","C"]，list2 = ["C","A","D"]
   输出：["A"]
   解释：A 的下标和为 0+1=1，C 的下标和为 2+0=2，因此只返回 A。

多个字符串并列：

.. code-block:: text

   输入：list1 = ["a","b","c"]，list2 = ["b","a","d"]
   输出：["a","b"]
   解释：a 和 b 的下标和都为 1，二者都达到最小值；输出顺序可以不同。

哈希定位并维护最小下标和
------------------------

先记录 ``list1`` 中每个字符串的下标，再扫描 ``list2``。遇到公共字符串时计算两个下标之和；若严格小于当前最优值就清空答案并替换，若相等则追加，这样可以保留全部并列项。

C++ 实现
--------

.. code-block:: cpp

   class Solution {
   public:
       std::vector<std::string> findRestaurant(
           std::vector<std::string>& list1,
           std::vector<std::string>& list2) {
           std::unordered_map<std::string, int> position;
           for (int i = 0; i < static_cast<int>(list1.size()); ++i) {
               position[list1[i]] = i;
           }

           std::vector<std::string> answer;
           int best = INT_MAX;
           for (int i = 0; i < static_cast<int>(list2.size()); ++i) {
               auto it = position.find(list2[i]);
               if (it == position.end()) continue;
               int sum = it->second + i;
               if (sum < best) {
                   best = sum;
                   answer.clear();
                   answer.push_back(list2[i]);
               } else if (sum == best) {
                   answer.push_back(list2[i]);
               }
           }
           return answer;
       }
   };

代码分析
--------

哈希表把 ``list1`` 的查找从线性扫描降为平均常数时间；``list2`` 按顺序扫描时，答案只在发现更小或相等的下标和时更新，既不会遗漏并列项，也不会保留旧的较差项。时间复杂度为平均 ``O(|list1| + |list2|)``，额外空间复杂度为 ``O(|list1|)``。
