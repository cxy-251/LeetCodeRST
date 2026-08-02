0229. Majority Element II
=========================

题目信息
--------

:题号: 0229
:难度: Medium
:主题: 数组、计数、Boyer-Moore 投票
:原题: `LeetCode 0229 <https://leetcode.com/problems/majority-element-ii/>`_
:重点: 出现次数严格大于 floor(n/3)、答案至多两个、去重、返回顺序不限

题目重述
--------

给定整数数组 ``nums``，返回所有出现次数严格大于 ``floor(n/3)`` 的不同元素，其中 ``n`` 是数组长度。阈值是“严格大于”，出现次数恰好等于 ``floor(n/3)`` 的元素不能加入答案。

数组长度位于 ``[1, 5 * 10^4]``，元素位于 ``[-10^9, 10^9]``。满足条件的不同元素最多有两个；结果中不能重复包含同一个值，多个答案的返回顺序不作要求。题目的进阶目标是在线性时间和常数额外空间内完成。

自建示例
--------

两个元素都超过阈值：

.. code-block:: text

   输入：nums = [4, 2, 4, 3, 2, 4, 2, 5]
   输出：[4, 2]
   解释：n=8，floor(n/3)=2；4 和 2 都出现 3 次，严格大于 2。返回 [2, 4] 也同样合法。

恰好等于阈值不计入：

.. code-block:: text

   输入：nums = [1, 1, 2, 2, 3, 4]
   输出：[]
   解释：floor(6/3)=2，1 和 2 都只出现 2 次，没有任何元素严格超过阈值。

为什么候选最多两个
------------------

若有三个不同元素都出现严格多于 ``n/3`` 次，它们的出现次数总和会严格大于 ``n``，
与数组总长度矛盾。因此只需保留两个可能的候选，而不能在第一遍扫描后直接相信它们的计数；
抵消过程只负责排除不可能者，最终仍需第二遍精确计数。

Boyer--Moore 两候选
------------------

维护 ``candidate1/count1`` 和 ``candidate2/count2``：

#. 当前值等于某个候选时增加对应计数；
#. 否则若某个计数为 0，就用当前值占据该候选位置；
#. 两个候选都不同且计数非零时，同时把两个计数减一。

最后一种操作等价于删除一组三个互不相同的元素。这种删除不会改变任何元素是否能超过 ``n/3`` 的结论，
因为每个真实多数元素即使被成组抵消，仍会在剩余序列中留下可能的候选。第一遍结束后只剩至多两个候选，
第二遍按 ``count > n/3`` 验证严格阈值。

正确性说明
----------

把每次“两候选都非零且遇到第三种值”的减计数看成同时删去一组不同值。任何出现次数超过 ``n/3`` 的元素，
不可能在所有抵消后完全消失：每次抵消至多消耗它一个出现，同时还要消耗两个其他元素；若它全部被消掉，
原数组中它的次数不会超过总数的三分之一。故所有合格元素都在两个候选中。
第二遍直接统计原数组中的真实次数，保留且仅保留严格大于 ``floor(n/3)`` 的候选，保证结果无误且不重复。

C++ 实现
--------

.. code-block:: cpp

   class Solution {
   public:
       std::vector<int> majorityElement(std::vector<int>& nums) {
           int candidate1 = 0, candidate2 = 1;
           int count1 = 0, count2 = 0;

           for (int value : nums) {
               if (value == candidate1) {
                   ++count1;
               } else if (value == candidate2) {
                   ++count2;
               } else if (count1 == 0) {
                   candidate1 = value;
                   count1 = 1;
               } else if (count2 == 0) {
                   candidate2 = value;
                   count2 = 1;
               } else {
                   --count1;
                   --count2;
               }
           }

           count1 = 0;
           count2 = 0;
           for (int value : nums) {
               if (value == candidate1) ++count1;
               if (value == candidate2) ++count2;
           }

           std::vector<int> answer;
           const int threshold = static_cast<int>(nums.size()) / 3;
           if (count1 > threshold) answer.push_back(candidate1);
           if (count2 > threshold && candidate2 != candidate1) {
               answer.push_back(candidate2);
           }
           return answer;
       }
   };

代码分析
--------

两遍扫描均为 ``O(n)``，只保存两个候选及其计数，除返回数组外额外空间为 ``O(1)``。
第二遍不可省略：第一遍的计数是抵消后的相对余额，不是原数组出现次数。候选初始化为两个不同值，
且相等分支先于空计数分支，避免把同一候选重复占用；输入数组不被排序或修改。
