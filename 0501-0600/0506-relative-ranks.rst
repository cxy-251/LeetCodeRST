0506. Relative Ranks
====================

题目信息
--------

:题号: 0506
:难度: Easy
:主题: 唯一分数、降序排名、奖牌名称、原下标对应
:原题: `LeetCode 0506 <https://leetcode.com/problems/relative-ranks/>`_
:重点: 分数互不相同、最高三名使用固定字符串、其余返回十进制名次、结果保持运动员原顺序

题目重述
--------

给定整数数组 ``score``，其中 ``score[i]`` 是第 ``i`` 名运动员的得分，所有得分互不相同。按得分从高到低确定名次，并返回与原数组下标一一对应的字符串数组。

第 1、2、3 名分别写为 ``"Gold Medal"``、``"Silver Medal"`` 和 ``"Bronze Medal"``；第 4 名及以后写为对应十进制名次。输出顺序不是排名顺序，而是输入运动员的原顺序。

自建示例
--------

输入顺序与名次顺序不同：

.. code-block:: text

   输入：score = [88,92,75,99]
   输出：["Bronze Medal","Silver Medal","4","Gold Medal"]
   解释：99、92、88、75 分别位列第 1 至第 4 名，再把名次写回各自原下标。

只有一名运动员：

.. code-block:: text

   输入：score = [42]
   输出：["Gold Medal"]
   解释：唯一运动员排名第一。

排序下标而不是改写得分
----------------------

把 ``(score, originalIndex)`` 按得分降序排列，排序后数组位置 ``rank`` 就是名次 ``rank + 1``。将前三名映射为奖牌文本，其余名次转成十进制字符串并写回原下标，因而不会丢失输入顺序。

C++ 实现
--------

.. code-block:: cpp

   class Solution {
   public:
       std::vector<std::string> findRelativeRanks(
           std::vector<int>& score) {
           std::vector<std::pair<int, int>> order;
           for (int i = 0; i < static_cast<int>(score.size()); ++i) {
               order.push_back({score[i], i});
           }
           std::sort(order.begin(), order.end(),
                     [](const auto& left, const auto& right) {
                         return left.first > right.first;
                     });

           std::vector<std::string> result(score.size());
           const std::string medals[3] = {
               "Gold Medal", "Silver Medal", "Bronze Medal"};
           for (int rank = 0; rank < static_cast<int>(order.size()); ++rank) {
               int index = order[rank].second;
               result[index] = rank < 3
                   ? medals[rank]
                   : std::to_string(rank + 1);
           }
           return result;
       }
   };

代码分析
--------

得分互不相同使排序后的顺序唯一；保存原下标让排名标签回到对应运动员，而不是按排名顺序返回。排序耗时 ``O(n log n)``，结果和排序数组额外占用 ``O(n)`` 空间。
