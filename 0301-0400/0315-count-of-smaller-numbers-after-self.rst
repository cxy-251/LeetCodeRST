0315. Count of Smaller Numbers After Self
=========================================

题目信息
--------

:题号: 0315
:难度: Hard
:主题: 数组、右侧元素、严格比较、按原下标返回
:原题: `LeetCode 0315 <https://leetcode.com/problems/count-of-smaller-numbers-after-self/>`_
:重点: 只统计当前位置右侧的元素、必须严格小于、结果位置与原数组一一对应

题目重述
--------

给定整数数组 ``nums``，构造同样长度的数组 ``counts``。对每个下标 ``i``，``counts[i]`` 等于所有满足 ``j > i`` 且 ``nums[j] < nums[i]`` 的下标 ``j`` 的数量。

比较必须是严格小于，因此与当前值相等的右侧元素不计入。``nums`` 的长度位于 ``[1, 10^5]``，每个元素位于 ``[-10^4, 10^4]``。返回结果必须保持原下标顺序，最后一个位置右侧没有元素，所以其统计值一定为 ``0``。

自建示例
--------

包含重复值：

.. code-block:: text

   输入：nums = [4, 1, 3, 1]
   输出：[3, 0, 1, 0]
   解释：4 的右侧三个值都比它小；第一个 1 右侧没有严格更小值；3 的右侧只有最后一个 1 更小。

相等值不算更小：

.. code-block:: text

   输入：nums = [2, 2]
   输出：[0, 0]
   解释：右侧的 2 与当前值相等，不满足严格小于。

从右向左，把右侧变成已处理集合
--------------------------------

如果从左向右处理 ``nums[i]``，右侧元素还没有进入数据结构；从右向左扫描则相反：处理下标 ``i`` 时，树状数组中恰好保存了所有下标大于 ``i`` 的元素。问题就变成统计已加入集合中有多少值严格小于 ``nums[i]``，统计完成后再把当前值加入，供更左侧位置使用。

树状数组需要有序的离散下标，因此先复制数组、排序并去重，把每个原值映射为从 1 开始的排名。值小于当前值对应的正是 ``rank - 1`` 及以前的排名；查询这个前缀而不是查询 ``rank``，会自动排除相等值，保持题目要求的严格比较。

C++ 实现
--------

.. code-block:: cpp

   class Solution {
       std::vector<int> tree;

       void add(int index) {
           for (int i = index; i < static_cast<int>(tree.size());
                i += i & -i) {
               ++tree[i];
           }
       }

       int query(int index) const {
           int result = 0;
           for (int i = index; i > 0; i -= i & -i) {
               result += tree[i];
           }
           return result;
       }

   public:
       std::vector<int> countSmaller(std::vector<int>& nums) {
           std::vector<int> values = nums;
           std::sort(values.begin(), values.end());
           values.erase(std::unique(values.begin(), values.end()),
                        values.end());
           tree.assign(values.size() + 1, 0);

           std::vector<int> result(nums.size(), 0);
           for (int i = static_cast<int>(nums.size()) - 1; i >= 0; --i) {
               int rank = static_cast<int>(
                   std::lower_bound(values.begin(), values.end(), nums[i])
                       - values.begin()) + 1;
               result[i] = query(rank - 1);
               add(rank);
           }
           return result;
       }
   };

代码分析
--------

扫描方向保证树状数组的元素来源就是“当前位置右侧”，结果数组按原下标直接写回，不需要在最后重新排列。离散化只改变比较顺序，不改变小于、等于的关系；查询 ``rank - 1`` 是排除重复值的关键。排序离散化需要 ``O(n log n)``，之后每个位置一次查询和一次更新，时间仍为 ``O(n log n)``，额外空间为 ``O(n)``。
