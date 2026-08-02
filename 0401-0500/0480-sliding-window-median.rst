0480. Sliding Window Median
===========================

题目信息
--------

:题号: 0480
:难度: Hard
:主题: 连续窗口、中位数、奇偶长度、浮点结果
:原题: `LeetCode 0480 <https://leetcode.com/problems/sliding-window-median/>`_
:重点: 窗口长度固定为 ``k``、每次右移一位、偶数窗口取中间两数平均、按窗口顺序返回

题目重述
--------

给定整数数组 ``nums`` 和整数 ``k``，长度为 ``k`` 的连续窗口从数组最左端开始，每次向右移动一个位置，直到覆盖最后 ``k`` 个元素。返回每个窗口的中位数组成的数组。

把窗口元素排序后，若 ``k`` 为奇数，中位数是正中间的元素；若 ``k`` 为偶数，中位数是中间两个元素的算术平均值。``nums.length`` 位于 ``[1, 10^5]``，元素在 32 位有符号整数范围内，``k`` 位于 ``[1, nums.length]``。答案允许 ``10^-5`` 以内的浮点误差。

自建示例
--------

奇数长度窗口：

.. code-block:: text

   输入：nums = [2,1,4,7,2]，k = 3
   输出：[2.0,4.0,4.0]
   解释：三个窗口排序后分别为 [1,2,4]、[1,4,7]、[2,4,7]，中间值依次为 2、4、4。

偶数长度窗口：

.. code-block:: text

   输入：nums = [1,5,2,8]，k = 2
   输出：[3.0,3.5,5.0]
   解释：每个窗口包含两个数，中位数分别是 (1+5)/2、(5+2)/2、(2+8)/2。

两个有序集合维护窗口中位位置
------------------------------

把当前窗口拆成 ``lower`` 和 ``upper`` 两个多重集合：``lower`` 保存较小的一半，且最多比 ``upper`` 多一个元素；``upper`` 保存较大的一半。每次加入或移除元素后，移动两个集合的边界元素恢复大小平衡，于是奇数窗口的中位数是 ``lower`` 最大值，偶数窗口的中位数是两边界的平均值。

使用 ``multiset`` 而不是 ``set``，因为窗口中可能有重复数字；删除时只删除一个与待移出值相等的迭代器。插入新元素和移除旧元素都发生在窗口右移的同一轮。

C++ 实现
--------

.. code-block:: cpp

   class Solution {
       std::multiset<long long> lower;
       std::multiset<long long> upper;

       void rebalance() {
           while (lower.size() > upper.size() + 1) {
               auto it = std::prev(lower.end());
               upper.insert(*it);
               lower.erase(it);
           }
           while (lower.size() < upper.size()) {
               auto it = upper.begin();
               lower.insert(*it);
               upper.erase(it);
           }
       }

       void add(long long value) {
           if (lower.empty() || value <= *lower.rbegin()) {
               lower.insert(value);
           } else {
               upper.insert(value);
           }
           rebalance();
       }

       void eraseValue(long long value) {
           auto lowerIt = lower.find(value);
           if (lowerIt != lower.end()) {
               lower.erase(lowerIt);
           } else {
               upper.erase(upper.find(value));
           }
           rebalance();
       }

       double median(int k) {
           if (k % 2 == 1) return static_cast<double>(*lower.rbegin());
           return (*lower.rbegin() + *upper.begin()) / 2.0;
       }

   public:
       std::vector<double> medianSlidingWindow(std::vector<int>& nums, int k) {
           lower.clear();
           upper.clear();
           std::vector<double> result;
           for (int i = 0; i < static_cast<int>(nums.size()); ++i) {
               add(nums[i]);
               if (i >= k) eraseValue(nums[i - k]);
               if (i >= k - 1) result.push_back(median(k));
           }
           return result;
       }
   };

代码分析
--------

平衡后 ``lower`` 的大小在奇数窗口时比 ``upper`` 多一、偶数窗口时相等，并且所有 ``lower`` 元素不大于所有 ``upper`` 元素，因此边界正好给出中位数。每个元素只插入和删除一次，时间复杂度为 ``O(n log k)``，额外空间复杂度为 ``O(k)``。
