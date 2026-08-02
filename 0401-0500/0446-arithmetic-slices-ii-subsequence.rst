0446. Arithmetic Slices II - Subsequence
========================================

题目信息
--------

:题号: 0446
:难度: Hard
:主题: 子序列、等差数列、长度至少三、按下标计数
:原题: `LeetCode 0446 <https://leetcode.com/problems/arithmetic-slices-ii-subsequence/>`_
:重点: 子序列不要求连续但必须保持下标顺序、相邻差值固定、不同下标选择分别计数

题目重述
--------

给定整数数组 ``nums``，统计其中长度至少为 3 的等差子序列数量。子序列通过删除任意数量元素得到，保留元素的下标顺序不能改变，但它们在原数组中不必连续。

一个子序列是等差序列，当且仅当任意相邻两项的差值都相同。由不同下标集合形成的子序列需要分别计数，即使它们的数值序列完全相同。``nums.length`` 位于 ``[1, 1000]``，元素在 32 位有符号整数范围内，题目保证最终答案适合 32 位有符号整数。

自建示例
--------

连续数组中存在三条等差子序列：

.. code-block:: text

   输入：nums = [1, 3, 5, 7]
   输出：3
   解释：合法子序列为 [1,3,5]、[3,5,7] 和 [1,3,5,7]。

重复值按下标组合计数：

.. code-block:: text

   输入：nums = [2, 2, 2, 2]
   输出：5
   解释：任取三个下标有 4 种，取全部四个下标有 1 种；它们的公差都为 0，总计 5 条。

按结尾位置和公差累积子序列
--------------------------

设 ``dp[i][d]`` 表示以 ``nums[i]`` 结尾、公差为 ``d``、长度至少为 2 的等差子序列数量。枚举前一个下标 ``j < i``，令 ``d = nums[i] - nums[j]``：单独的二元组 ``(j, i)`` 给 ``dp[i][d]`` 增加 1，而所有已经以 ``j`` 结尾且公差相同的序列都可以追加 ``nums[i]``，其中长度至少为 2 的部分会形成题目要求的长度至少为 3 的答案。

差值必须使用 ``long long``，因为两个 32 位整数相减可能超出 ``int``。状态按下标存储，即使数值相同，只要选择的下标不同就会自然地分别计数。

C++ 实现
--------

.. code-block:: cpp

   class Solution {
   public:
       int numberOfArithmeticSlices(std::vector<int>& nums) {
           int n = static_cast<int>(nums.size());
           std::vector<std::unordered_map<long long, long long>> dp(n);
           long long answer = 0;

           for (int i = 0; i < n; ++i) {
               for (int j = 0; j < i; ++j) {
                   long long difference =
                       static_cast<long long>(nums[i]) - nums[j];
                   long long previous = 0;
                   auto it = dp[j].find(difference);
                   if (it != dp[j].end()) previous = it->second;

                   dp[i][difference] += previous + 1;
                   answer += previous;
               }
           }
           return static_cast<int>(answer);
       }
   };

代码分析
--------

每个 ``previous`` 状态追加当前元素后长度至少增加到 3，因此只把它加入答案；新增的二元组只作为未来延伸的中间状态，不会被误计入。状态按“结尾下标 + 公差”区分，覆盖了重复值和不同下标选择。共有 ``O(n^2)`` 个下标对，平均时间复杂度为 ``O(n^2)``，状态空间复杂度为 ``O(n^2)``。
