0228. Summary Ranges
====================

题目信息
--------

:题号: 0228
:难度: Easy
:主题: 数组、区间、顺序扫描、字符串格式
:原题: `LeetCode 0228 <https://leetcode.com/problems/summary-ranges/>`_
:重点: 严格递增且无重复、最小连续区间、单点与区间的不同格式、整数边界

题目重述
--------

给定一个已经严格递增且没有重复值的整数数组 ``nums``，用若干互不重叠的连续整数区间恰好覆盖数组中的全部数字，并返回这些区间的字符串表示。每个数字只能属于一个返回区间，返回顺序与数组中的先后顺序一致。

若一个区间只包含单个整数 ``a``，表示为 ``"a"``；若包含从 ``a`` 到 ``b`` 的至少两个连续整数，表示为 ``"a->b"``。数组长度位于 ``[0, 20]``，元素可以达到 32 位有符号整数的最小值或最大值，因此判断相邻连续性时不能让 ``nums[i] + 1`` 发生溢出。

自建示例
--------

混合单点与连续段：

.. code-block:: text

   输入：nums = [-3, -2, 0, 2, 3, 4, 7]
   输出：["-3->-2", "0", "2->4", "7"]
   解释：-3 与 -2 连续；0 和 7 各自孤立；2、3、4 构成一个完整连续段。

空数组：

.. code-block:: text

   输入：nums = []
   输出：[]
   解释：没有数字需要覆盖，因此返回空字符串数组。

一次扫描合并连续段
------------------

数组已经严格递增，所以一个区间从 ``nums[start]`` 开始向右延伸时，只需检查相邻元素是否连续。
当 ``nums[j+1]`` 不等于 ``nums[j]+1``，当前段在 ``j`` 结束；下一段从 ``j+1`` 重新开始。
判断时把 ``nums[j]`` 转成 ``long long``，避免当前值为 ``INT_MAX`` 时计算 ``nums[j]+1`` 溢出。

长度为 1 的段输出一个数字，长度大于 1 的段输出 ``start->end``。由于每个元素只被一个正在构造的段覆盖，
扫描顺序天然保证区间不重叠且结果有序。

正确性说明
----------

循环开始时 ``start`` 指向当前尚未输出段的第一个元素，``i`` 扫描该段的末端。只要相邻差为 1，
严格递增数组中的中间整数没有缺失，可以继续合并；一旦不连续，任何跨过这个断点的区间都会包含缺失整数，
所以必须结束当前段。对每个段按其长度选择两种格式，循环结束后再输出最后一段，恰好覆盖全部输入值。

C++ 实现
--------

.. code-block:: cpp

   class Solution {
   public:
       std::vector<std::string> summaryRanges(std::vector<int>& nums) {
           std::vector<std::string> answer;
           const int n = static_cast<int>(nums.size());
           int start = 0;

           while (start < n) {
               int end = start;
               while (end + 1 < n &&
                      static_cast<long long>(nums[end]) + 1 == nums[end + 1]) {
                   ++end;
               }

               if (start == end) {
                   answer.push_back(std::to_string(nums[start]));
               } else {
                   answer.push_back(std::to_string(nums[start]) + "->" +
                                    std::to_string(nums[end]));
               }
               start = end + 1;
           }
           return answer;
       }
   };

代码分析
--------

``end`` 只向右移动，所有元素最多参与一次连续性判断，时间复杂度为 ``O(n)``；不计返回字符串本身，
额外工作空间为 ``O(1)``。格式化输出的空间属于题目要求的结果，不用于保存额外的查找结构。
