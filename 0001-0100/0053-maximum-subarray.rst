0053. Maximum Subarray
======================

题目信息
--------

:题号: 0053. 最大子数组和
:难度: Medium
:主题: 数组、动态规划、前缀和
:原题: `LeetCode 0053 <https://leetcode.com/problems/maximum-subarray/>`_
:重点: 从枚举连续区间，推导到只保留以前一位置结尾的最优非空子数组

题目重述
--------

给定整数数组 ``nums``，选择一个至少包含一个元素的连续子数组，返回该子数组的最大元素和。

子数组必须连续且不能为空。因此数组全部为负数时，答案是最大的单个元素，而不是空子数组的和 ``0``。

约束为 ``1 <= nums.length <= 10^5``、``-10^4 <= nums[i] <= 10^4``。

自建示例
--------

.. code-block:: text

   输入：nums = [-4,2,3,-8,5,6,-2]
   输出：11
   解释：最大和子数组为 [5,6]。跨过 -8 连接前后两段只能得到 8。

.. code-block:: text

   输入：nums = [-9,-2,-7]
   输出：-2
   解释：所有非空连续子数组的和都为负，最优选择是单个元素 -2。

.. code-block:: text

   输入：nums = [4,-1,2,1,-7,3]
   输出：6
   解释：最大和子数组为 [4,-1,2,1]。区间中出现负数并不意味着必须截断。

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

           for (int index = 1; index < n; ++index) {
               ending[index] = std::max(
                   nums[index],
                   ending[index - 1] + nums[index]
               );
               best = std::max(best, ending[index]);
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

           for (int index = 1;
                index < static_cast<int>(nums.size());
                ++index) {
               endingHere = std::max(
                   nums[index],
                   endingHere + nums[index]
               );
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

区间枚举基线
~~~~~~~~~~~~

连续子数组由左端点 ``left`` 和右端点 ``right`` 唯一确定。固定左端点后，右端点每向右移动一格，只需把新元素加入
累计和：

.. code-block:: text

   sum(left, right) = sum(left, right - 1) + nums[right]

``enumerateSubarrays`` 因而能枚举全部候选，同时避免为每个区间重新求和。数组共有 ``O(n²)`` 个非空连续子数组，
所以显式枚举端点仍需平方时间。

继续优化的关键不是更快地计算某个区间和，而是压缩同一右端点对应的全部左端点选择。

右端点状态
~~~~~~~~~~

定义：

.. code-block:: text

   ending[i] = 必须以 i 为右端点的非空连续子数组最大和

任何以 ``i`` 结尾的非空连续子数组只有两种来源：

* 从 ``nums[i]`` 重新开始；
* 把 ``nums[i]`` 接到一个以 ``i-1`` 结尾的非空连续子数组后面。

第二类只需保留 ``ending[i-1]``。所有候选都追加同一个 ``nums[i]``，此前和最大的候选追加后仍然最大。因此：

.. code-block:: text

   ending[i] = max(nums[i], ending[i-1] + nums[i])

每个非空连续子数组都有唯一右端点。对每个右端点保留该类中的最大和，再在所有 ``ending[i]`` 中取最大值，就覆盖了
全部候选。

右端点不变量
~~~~~~~~~~~~

从左向右处理到下标 ``i`` 后，保持两个状态：

* ``endingHere`` 是所有以 ``i`` 结尾的非空连续子数组中的最大和；
* ``best`` 是前缀 ``nums[0..i]`` 内全部非空连续子数组的最大和。

转移也可以写成：

.. code-block:: text

   endingHere = nums[i] + max(0, previousEnding)

若 ``previousEnding`` 为负，连接它只会降低结果，当前最优区间应从 ``nums[i]`` 重新开始；若它为正，连接它会提高
结果。被丢弃的是总贡献为负的整个前缀，不是所有包含负数的区间。``[4,-1,2,1]`` 中的 ``-1`` 仍可保留，因为
此前累计贡献在扩展过程中仍有价值。

随后执行：

.. code-block:: text

   best = max(best, endingHere)

这一步同时保留可能早已结束的全局最优区间。循环结束时，``best`` 已比较每个可能右端点，因此就是答案。

初始值必须取 ``nums[0]``。这样 ``endingHere`` 和 ``best`` 从一开始就代表真实的非空区间；若初始化为 ``0``，
全负数组会错误选择不存在的空子数组。

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

在 ``-8`` 处，``endingHere`` 必须继续表示以当前位置结尾的最优区间，所以变为 ``-3``；``best`` 仍保留此前的
``5``。遇到下一个 ``5`` 时，重新开始优于连接负贡献前缀。

状态压缩
~~~~~~~~

``dynamicProgramming`` 用数组保存全部 ``ending[i]``，清楚展示了状态定义和转移。

由于 ``ending[i]`` 只依赖 ``ending[i-1]``，可以用 ``endingHere`` 覆盖上一状态，得到 ``kadane``。搜索空间没有
变化，额外空间从 ``O(n)`` 降为 ``O(1)``。公开入口采用这一实现。

最小前缀视角
~~~~~~~~~~~~

定义 ``prefix[k]`` 为前 ``k`` 个元素之和，则区间 ``[left,right]`` 的和为：

.. code-block:: text

   prefix[right + 1] - prefix[left]

固定右端点后，当前前缀已经确定。要使区间和最大，只需减去此前出现过的最小前缀。因此 ``prefixMinimum`` 在扫描时
维护当前前缀和与此前最小前缀和。

代码先用 ``prefix - minimumPrefix`` 更新答案，再把当前 ``prefix`` 纳入最小值。这个顺序保证被减去的前缀位于
当前右端点之前，候选区间始终非空。该方法与 Kadane 从不同方向压缩同一批区间候选，时间和空间复杂度相同。

复杂度分析
~~~~~~~~~~

``enumerateSubarrays`` 枚举 ``O(n²)`` 个区间，时间 ``O(n²)``、额外空间 ``O(1)``。

``dynamicProgramming``、``prefixMinimum`` 和 ``kadane`` 都只扫描一次，时间 ``O(n)``。DP 数组使用 ``O(n)``
额外空间，后两种方法使用 ``O(1)`` 额外空间。主入口不修改输入数组。
