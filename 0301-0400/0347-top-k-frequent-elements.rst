0347. Top K Frequent Elements
=============================

题目信息
--------

:题号: 0347
:难度: Medium
:主题: 整数数组、出现频率、前 k 个不同元素、结果唯一
:原题: `LeetCode 0347 <https://leetcode.com/problems/top-k-frequent-elements/>`_
:重点: 按元素出现次数比较、返回 k 个不同值、答案集合保证唯一、返回顺序不限

题目重述
--------

给定整数数组 ``nums`` 和整数 ``k``，统计每个不同整数在数组中的出现次数，返回出现频率最高的 ``k`` 个不同元素。

数组长度位于 ``[1, 10^5]``，元素位于 ``[-10^4, 10^4]``，``k`` 位于 ``[1, nums 中不同元素的数量]``。题目保证频率边界不会造成多个不同答案集合，也就是所需的前 ``k`` 个元素是唯一确定的；结果中的排列顺序不限。进阶要求时间复杂度优于 ``O(n log n)``。

自建示例
--------

频率排名清晰且包含负数：

.. code-block:: text

   输入：nums = [4, 4, 4, -2, -2, 7, 7, 7, 7, 9]，k = 2
   输出：[7, 4]
   解释：7 出现 4 次，4 出现 3 次，它们是频率最高的两个不同元素；输出顺序可以交换。

只需要一个元素：

.. code-block:: text

   输入：nums = [5, 5, 1]，k = 1
   输出：[5]
   解释：5 的出现次数高于 1，因此唯一答案是 5。

频率本身就是桶的下标
----------------------

先统计每个值的出现次数。频率的范围从 1 到 ``nums.size()``，因此可以建立同样按频率编号的桶，把值放入 ``bucket[count]``。从最高频率向下扫描桶，取出恰好 ``k`` 个不同值；不需要对所有值按比较器排序，频率边界的唯一性由题目保证。

C++ 实现
--------

.. code-block:: cpp

   class Solution {
   public:
       std::vector<int> topKFrequent(
           std::vector<int>& nums, int k) {
           std::unordered_map<int, int> frequency;
           for (int value : nums) ++frequency[value];

           std::vector<std::vector<int>> bucket(nums.size() + 1);
           for (const auto& entry : frequency) {
               bucket[entry.second].push_back(entry.first);
           }

           std::vector<int> result;
           for (int count = static_cast<int>(nums.size());
                count >= 1 && static_cast<int>(result.size()) < k;
                --count) {
               for (int value : bucket[count]) {
                   result.push_back(value);
                   if (static_cast<int>(result.size()) == k) break;
               }
           }
           return result;
       }
   };

代码分析
--------

桶按出现次数排列，反向扫描自然得到从高到低的频率顺序；每个不同值只进入一个桶，所以不会重复输出。哈希统计和桶扫描平均为线性时间，时间复杂度为 ``O(n)``，额外空间为 ``O(n)``。结果不要求排序，桶内顺序无需额外规定。
