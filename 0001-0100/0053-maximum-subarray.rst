0053. Maximum Subarray
======================

题目信息
--------

:题号: 0053
:难度: Medium
:主题: 数组、动态规划、前缀和
:原题: `LeetCode 0053 <https://leetcode.com/problems/maximum-subarray/>`_
:重点: 从枚举连续区间，推导到只保留以前一位置结尾的最优非空子数组

题目重述
--------

给定整数数组 ``nums``，选择一个至少包含一个元素的连续子数组，返回该子数组的最大元素和。

子数组必须连续且不能为空。因此数组全部为负数时，答案是最大的单个元素，而不是空子数组的和 0。

约束为 ``1 <= nums.length <= 10^5``、``-10^4 <= nums[i] <= 10^4``。

自建示例
--------

.. code-block:: text

   输入：nums = [-4,2,3,-8,5,6,-2]
   输出：11

最大和子数组为 ``[5,6]``，元素和为 ``11``。前面的正和区间 ``[2,3]`` 若跨过 ``-8`` 再连接
``[5,6]``，总和只有 ``8``，因此应从 ``5`` 重新开始。

.. code-block:: text

   输入：nums = [-9,-2,-7]
   输出：-2

所有非空连续子数组的和都为负，最优选择是单个元素 ``-2``。

.. code-block:: text

   输入：nums = [4,-1,2,1,-7,3]
   输出：6

最大和子数组为 ``[4,-1,2,1]``。区间中出现负数并不表示必须截断；只要此前累计贡献仍为正，连接它仍可能
优于从当前位置重新开始。

C++ 实现
--------

.. code-block:: cpp

   #include <algorithm>
   #include <climits>
   #include <vector>

   class Solution {
   private:
       int enumerateSubarrays(const std::vector<int>& nums) {
           const int n = static_cast<int>(nums.size());
           int best = INT_MIN;
           for (int left = 0; left < n; ++left) {
               int sum = 0;
               for (int right = left; right < n; ++right) {
                   sum += nums[right];
                   best = std::max(best, sum);
               }
           }
           return best;
       }

       int dynamicProgramming(const std::vector<int>& nums) {
           const int n = static_cast<int>(nums.size());
           std::vector<int> ending(n);
           ending[0] = nums[0];
           int best = ending[0];
           for (int i = 1; i < n; ++i) {
               ending[i] = std::max(nums[i], ending[i - 1] + nums[i]);
               best = std::max(best, ending[i]);
           }
           return best;
       }

       int prefixMinimum(const std::vector<int>& nums) {
           int prefix = 0;
           int minimumPrefix = 0;
           int best = INT_MIN;
           for (int value : nums) {
               prefix += value;
               best = std::max(best, prefix - minimumPrefix);
               minimumPrefix = std::min(minimumPrefix, prefix);
           }
           return best;
       }

       int kadane(const std::vector<int>& nums) {
           int endingHere = nums[0];
           int best = nums[0];
           for (int i = 1; i < static_cast<int>(nums.size()); ++i) {
               endingHere = std::max(nums[i], endingHere + nums[i]);
               best = std::max(best, endingHere);
           }
           return best;
       }

   public:
       int maxSubArray(std::vector<int>& nums) {
           return kadane(nums);
       }
   };

题解
----

从定义出发：枚举所有连续子数组
~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

连续子数组由左端点 ``left`` 和右端点 ``right`` 唯一确定。固定左端点后，右端点每向右移动一格，只需把
新元素加入累计和：

.. code-block:: text

   sum(left, right) = sum(left, right - 1) + nums[right]

``enumerateSubarrays`` 因而能枚举全部候选，并避免为每个区间重新扫描求和。数组共有 ``O(n²)`` 个非空连续
子数组，所以该方法时间为 ``O(n²)``、额外空间为 ``O(1)``。

它的瓶颈已经不是求和，而是仍然显式枚举每一对左右端点。要继续优化，需要把许多左端点候选压缩成一个足够
继续向右扩展的状态。

固定右端点后，候选只分为两类
~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

定义：

.. code-block:: text

   ending[i] = 必须以 i 作为右端点的非空连续子数组最大和

任何以 ``i`` 结尾的非空连续子数组只有两类：

1. 只包含 ``nums[i]``，即从当前位置重新开始；
2. 在某个以 ``i-1`` 结尾的非空连续子数组后追加 ``nums[i]``。

第二类中，只需要保留 ``ending[i-1]``。因为所有候选都追加同一个 ``nums[i]``，此前和更大的区间追加后仍然
更大，其他以 ``i-1`` 结尾的区间不可能反超。因此：

.. code-block:: text

   ending[i] = max(nums[i], ending[i-1] + nums[i])

这一步把“当前右端点对应的全部左端点”压缩成一个数。

为什么还需要全局答案
~~~~~~~~~~~~~~~~~~~~

``ending[i]`` 强制子数组在 ``i`` 结束，但全局最优子数组未必延伸到数组末尾。因此还要维护：

.. code-block:: text

   best = max(best, ending[i])

每个非空连续子数组都有唯一右端点。对每个右端点只保留该类中的最大和，再在所有右端点之间取最大值，就覆盖
了全部候选。

负贡献前缀为什么可以丢弃
~~~~~~~~~~~~~~~~~~~~~~~~

转移式也可以写成：

.. code-block:: text

   ending[i] = nums[i] + max(0, ending[i-1])

当 ``ending[i-1]`` 为负时，把它接到 ``nums[i]`` 前面只会降低结果，因此应从 ``nums[i]`` 重新开始；当它为
正时，连接它能提高结果；等于 0 时，两种选择相同。

这里删除的不是“包含负数的区间”。一个区间内部可以含负数，例如 ``[4,-1,2,1]``。真正可以删除的是总贡献
已经为负的整个前缀。

状态演化
~~~~~~~~

对 ``[-4,2,3,-8,5,6,-2]``：

.. list-table::
   :header-rows: 1

   * - 当前值
     - 连接上一段
     - 重新开始
     - ``endingHere``
     - ``best``
   * - -4
     - —
     - -4
     - -4
     - -4
   * - 2
     - -2
     - 2
     - 2
     - 2
   * - 3
     - 5
     - 3
     - 5
     - 5
   * - -8
     - -3
     - -8
     - -3
     - 5
   * - 5
     - 2
     - 5
     - 5
     - 5
   * - 6
     - 11
     - 6
     - 11
     - 11
   * - -2
     - 9
     - -2
     - 9
     - 11

在 ``-8`` 处，``endingHere`` 必须表示以该位置结尾的最优区间，所以它变为 ``-3``；全局答案 ``best``
仍保留此前的 ``5``。下一步遇到 ``5`` 时，连接旧区间得到 ``2``，重新开始得到 ``5``，负贡献前缀被自然
丢弃。

从 DP 数组到 Kadane 状态压缩
~~~~~~~~~~~~~~~~~~~~~~~~~~~~

``ending[i]`` 只依赖 ``ending[i-1]``，不需要保存整张数组。用变量 ``endingHere`` 覆盖上一状态，即得到主入口
调用的 ``kadane``：时间仍为 ``O(n)``，额外空间从 ``O(n)`` 降为 ``O(1)``。

为什么必须用首元素初始化
~~~~~~~~~~~~~~~~~~~~~~~~

题目要求子数组非空。若把 ``endingHere`` 和 ``best`` 初始化为 0，输入 ``[-9,-2,-7]`` 会错误返回不存在的空
子数组之和 0。

使用 ``nums[0]`` 初始化后，每个状态始终对应一个真实的非空区间，全负数组自然返回最大的单个元素。

等价的线性视角：最小前缀和
~~~~~~~~~~~~~~~~~~~~~~~~~~

定义 ``prefix[k]`` 为前 ``k`` 个元素之和，则：

.. code-block:: text

   sum(left, right) = prefix[right + 1] - prefix[left]

固定右端点后，当前前缀已经确定。要使区间和最大，只需减去此前出现过的最小前缀。因此
``prefixMinimum`` 维护当前前缀和与此前最小前缀和，也能在线性时间求解。

代码先用 ``prefix - minimumPrefix`` 更新答案，再把当前 ``prefix`` 纳入最小值。这个顺序保证被减去的前缀
严格位于当前右端点之前，候选区间始终非空。

复杂度来源
~~~~~~~~~~

``enumerateSubarrays`` 枚举 ``O(n²)`` 个区间，时间 ``O(n²)``、额外空间 ``O(1)``。
``dynamicProgramming``、``prefixMinimum`` 和 ``kadane`` 都只扫描一次，时间 ``O(n)``；其中 DP 数组使用
``O(n)`` 空间，后两种方法使用 ``O(1)`` 额外空间。主入口调用 ``kadane``，且不修改输入数组。
