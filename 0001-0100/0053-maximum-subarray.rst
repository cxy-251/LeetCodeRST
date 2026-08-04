0053. Maximum Subarray
======================

题目信息
--------

:题号: 0053
:难度: Medium
:主题: 数组、前缀和、动态规划、分治
:原题: `LeetCode 0053 <https://leetcode.com/problems/maximum-subarray/>`_
:重点: 从重复计算区间和，推导到只保留以前一位置结尾的最优非空子数组

题目重述
--------

给定整数数组 ``nums``，从中选择一个至少包含一个元素的连续子数组，返回该子数组的最大元素和。

子数组必须连续且不能为空。数组全部为负数时，答案不是 0，而是其中最大的单个元素。

约束为 ``1 <= nums.length <= 10^5``、``-10^4 <= nums[i] <= 10^4``。

自建示例
--------

.. code-block:: text

   输入：nums = [-4,2,3,-8,5,6,-2]
   输出：11

最大和子数组为 ``[5,6]``，元素和为 ``11``。虽然前面的 ``[2,3]`` 也是正和区间，连接中间的 ``-8``
后只得到 ``8``，不如从 ``5`` 重新开始。

.. code-block:: text

   输入：nums = [-9,-2,-7]
   输出：-2

所有非空连续子数组的和都为负，最优选择是单个元素 ``-2``。

.. code-block:: text

   输入：nums = [4,-1,2,1,-7,3]
   输出：6

最大和子数组为 ``[4,-1,2,1]``。局部出现负数并不表示必须立即截断；只要此前累计贡献仍为正，继续连接仍可能更优。

C++ 实现
--------

.. code-block:: cpp

   #include <algorithm>
   #include <climits>
   #include <vector>

   class Solution {
   private:
       int enumerateAndSum(const std::vector<int>& nums) {
           const int n = static_cast<int>(nums.size());
           int best = INT_MIN;
           for (int left = 0; left < n; ++left) {
               for (int right = left; right < n; ++right) {
                   int sum = 0;
                   for (int i = left; i <= right; ++i) sum += nums[i];
                   best = std::max(best, sum);
               }
           }
           return best;
       }

       int extendRight(const std::vector<int>& nums) {
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

       struct Segment {
           int total;
           int prefix;
           int suffix;
           int best;
       };

       Segment divide(const std::vector<int>& nums, int left, int right) {
           if (left == right) {
               int value = nums[left];
               return {value, value, value, value};
           }

           int middle = left + (right - left) / 2;
           Segment a = divide(nums, left, middle);
           Segment b = divide(nums, middle + 1, right);
           return {
               a.total + b.total,
               std::max(a.prefix, a.total + b.prefix),
               std::max(b.suffix, b.total + a.suffix),
               std::max({a.best, b.best, a.suffix + b.prefix})
           };
       }

       int divideAndConquer(const std::vector<int>& nums) {
           return divide(nums, 0, static_cast<int>(nums.size()) - 1).best;
       }

   public:
       int maxSubArray(std::vector<int>& nums) {
           return kadane(nums);
       }
   };

题解
----

第一步：完整枚举定义中的所有候选
~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

连续子数组由左端点 ``left`` 和右端点 ``right`` 唯一确定。最直接的方法枚举所有 ``left <= right``，再扫描
``[left,right]`` 求和。

数组共有 ``O(n²)`` 个非空区间，每个区间求和最坏需要 ``O(n)``，因此 ``enumerateAndSum`` 的时间为
``O(n³)``。它完整表达了题意，也暴露出真正的浪费：相邻区间共享绝大多数元素，却反复从头求和。

第二步：固定左端点时复用上一个区间和
~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

固定 ``left`` 后，右端点从左向右移动：

.. code-block:: text

   sum(left, right) = sum(left, right - 1) + nums[right]

因此只需维护一个累计和。``extendRight`` 仍枚举全部 ``O(n²)`` 个区间，但每个区间只做常数工作，时间降为
``O(n²)``，额外空间为 ``O(1)``。

进一步优化不能再只加速“某个已选区间的求和”，而要避免枚举全部左右端点。

第三步：固定右端点时只需要此前最小前缀
~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

定义前缀和 ``prefix[k]`` 为前 ``k`` 个元素之和，则区间 ``[left,right]`` 的和为：

.. code-block:: text

   prefix[right + 1] - prefix[left]

固定 ``right`` 后，``prefix[right + 1]`` 已确定。要使区间和最大，只需在此前的
``prefix[0..right]`` 中选择最小值。因此扫描时维护：

.. code-block:: text

   prefix         当前前缀和
   minimumPrefix  当前前缀之前出现过的最小前缀和

代码必须先用 ``prefix - minimumPrefix`` 更新答案，再把当前 ``prefix`` 纳入后续候选。这样左端点一定不晚于
当前元素，得到的始终是非空区间。

以 ``[-4,2,3,-8,5,6,-2]`` 为例，前缀和依次为：

.. code-block:: text

   0, -4, -2, 1, -7, -2, 4, 2

处理前缀 ``4`` 时，此前最小前缀是 ``-7``，差值 ``4 - (-7) = 11``，对应 ``[5,6]``。

第四步：把左端点选择压缩成“是否连接上一段”
~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

前缀最小值从左端点角度求解。还可以从右端点角度建立更直接的动态规划状态：

.. code-block:: text

   endingHere = 必须以当前位置 i 结尾的非空连续子数组最大和

任何以 ``i`` 结尾的非空连续子数组只有两类：

1. 只包含 ``nums[i]``，从当前位置重新开始；
2. 把 ``nums[i]`` 接到某个以 ``i-1`` 结尾的非空连续子数组后面。

第二类中，只需连接以 ``i-1`` 结尾的最大和。若连接一个更差的旧区间，再加上相同的 ``nums[i]``，结果仍然
更差。因此转移完整压缩为：

.. code-block:: text

   endingHere = max(nums[i], previousEnding + nums[i])
   best       = max(best, endingHere)

``previousEnding`` 为负时，连接它会降低当前和，所以重新开始；它为非负时，连接不会比单独使用当前元素差。
这不是额外的贪心假设，而是上述两个完整候选取最大后的直接结论。

状态演化
~~~~~~~~

对 ``[-4,2,3,-8,5,6,-2]``：

.. list-table::
   :header-rows: 1

   * - 当前值
     - 连接旧区间
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

在 ``-8`` 处，最佳结尾和变为 ``-3``。它仍必须被保留，因为状态要求区间以当前位置结尾；全局答案
``best`` 则继续保留此前的 ``5``。下一步遇到 ``5`` 时，算法比较连接后的 ``2`` 与重新开始的 ``5``，从而
丢弃负贡献前缀。

为什么必须用首元素初始化
~~~~~~~~~~~~~~~~~~~~~~~~

题目要求子数组非空。若把 ``endingHere`` 和 ``best`` 初始化为 0，输入 ``[-9,-2,-7]`` 会错误返回不存在的空
子数组之和 0。

使用 ``nums[0]`` 初始化后，每个 ``endingHere`` 都对应一个真实非空区间，每个 ``best`` 也来自真实候选，
全负数组自然返回最大的单个元素。

为什么 Kadane 不重不漏
~~~~~~~~~~~~~~~~~~~~~~

归纳假设 ``previousEnding`` 是所有以 ``i-1`` 结尾区间中的最大和。任何以 ``i`` 结尾的区间，要么长度为 1，
要么删除末尾 ``nums[i]`` 后成为一个以 ``i-1`` 结尾的区间。两类候选分别由转移式的两项覆盖，因此
``endingHere`` 正确。

每个非空连续子数组都有唯一右端点。``best`` 依次比较每个右端点对应的最优区间，所以最终覆盖全部候选，
得到全局最大和。

分治为什么需要四项区间摘要
~~~~~~~~~~~~~~~~~~~~~~~~~~

若把数组分为左右两段，一个区间的最优子数组只有三种位置：完全在左段、完全在右段、跨越中点。为了在常数
时间合并两段，需要每段返回：

.. code-block:: text

   total   整段总和
   prefix  必须从区间左端开始的最大和
   suffix  必须在区间右端结束的最大和
   best    区间内部任意非空子数组的最大和

跨界最优值只能是 ``left.suffix + right.prefix``。其余三项也能由左右摘要常数时间得到。递归树有 ``O(n)``
个节点，每个节点只做常数工作，因此 ``divideAndConquer`` 的时间也是 ``O(n)``，递归栈为 ``O(log n)``。

复杂度来源
~~~~~~~~~~

``enumerateAndSum`` 为 ``O(n³)``；``extendRight`` 为 ``O(n²)``。``prefixMinimum`` 与 ``kadane`` 都只扫描一次，
时间 ``O(n)``、额外空间 ``O(1)``。分治摘要为 ``O(n)`` 时间、``O(log n)`` 栈空间。

主入口调用 ``kadane``。它不修改输入，只保留当前结尾最大和与全局最大和。
