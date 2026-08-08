0128. Longest Consecutive Sequence
==================================

题目信息
--------

:题号: 0128. 最长连续序列
:难度: Medium
:主题: 数组、哈希集合、连续段、摊还分析
:原题: `LeetCode 0128 <https://leetcode.com/problems/longest-consecutive-sequence/>`_
:重点: 用集合摆脱原下标顺序，只从连续段唯一左端扩展，使全部内层扫描总量保持线性

题目重述
--------

给定未排序整数数组 ``nums``，找出其中可以组成的最长连续整数序列长度。连续指的是数值依次增加 ``1``，
与元素在原数组中的排列位置无关；重复值不能重复增加长度。空数组返回 ``0``，并要求算法达到 ``O(n)``
时间复杂度。

自建示例
--------

* ``nums = [14, 7, 9, 8, 20, 10, 7, 13, 12]``：连续段有 ``7..10``、``12..14`` 和
  ``20``，最长长度为 ``4``；第二个 ``7`` 不增加长度；
* ``nums = [1, 2, 0, -1, 8]``：原数组顺序混乱，但数值 ``-1, 0, 1, 2`` 连续，返回 ``4``；
* ``nums = []``：没有连续段，返回 ``0``；
* ``nums = [INT_MIN, INT_MIN + 1, INT_MAX]``：最长长度为 ``2``，边界值的前驱和后继判断不能发生
  有符号整数溢出。

C++ 实现
--------

.. code-block:: cpp

   #include <algorithm>
   #include <climits>
   #include <unordered_set>
   #include <vector>

   class Solution {
   private:
       int sortAndScan(std::vector<int> nums) {
           if (nums.empty()) {
               return 0;
           }
           std::sort(nums.begin(), nums.end());
           int currentLength = 1;
           int bestLength = 1;

           for (int index = 1; index < static_cast<int>(nums.size()); ++index) {
               if (nums[index] == nums[index - 1]) {
                   continue;
               }
               if (static_cast<long long>(nums[index - 1]) + 1 == nums[index]) {
                   ++currentLength;
               } else {
                   currentLength = 1;
               }
               bestLength = std::max(bestLength, currentLength);
           }
           return bestLength;
       }

       int expandFromEveryValue(const std::vector<int>& nums) {
           std::unordered_set<int> values(nums.begin(), nums.end());
           int bestLength = 0;
           for (int value : values) {
               int current = value;
               int currentLength = 1;
               while (current != INT_MAX && values.count(current + 1)) {
                   ++current;
                   ++currentLength;
               }
               bestLength = std::max(bestLength, currentLength);
           }
           return bestLength;
       }

       int expandOnlyFromStarts(const std::vector<int>& nums) {
           std::unordered_set<int> values(nums.begin(), nums.end());
           int bestLength = 0;

           for (int value : values) {
               const bool hasPredecessor =
                   value != INT_MIN && values.count(value - 1);
               if (hasPredecessor) {
                   continue;
               }

               int current = value;
               int currentLength = 1;
               while (current != INT_MAX && values.count(current + 1)) {
                   ++current;
                   ++currentLength;
               }
               bestLength = std::max(bestLength, currentLength);
           }
           return bestLength;
       }

   public:
       int longestConsecutive(std::vector<int>& nums) {
           return expandOnlyFromStarts(nums);
       }
   };

题解
----

先去掉原数组顺序这个干扰
~~~~~~~~~~~~~~~~~~~~~~~~

题目寻找的是数值集合中的连续段，而不是原数组中的连续子数组。``[3, 1, 2]`` 能组成 ``1, 2, 3``；
``[1, 1, 2]`` 的两个 ``1`` 也只能代表同一个整数。因此状态只需要回答“值 ``x`` 是否出现”，下标和出现
次数都不是答案所需信息。

方案一：排序后恢复数值顺序
~~~~~~~~~~~~~~~~~~~~~~~~~~~~

最直观的方法复制并排序数组，让相邻数值真正相邻。扫描时跳过重复值；当前值等于前一不同值加一就延长
当前段，否则开始长度为一的新段。``sortAndScan`` 直接、稳定，正确性来自排序后的全序，但排序耗时
``O(n log n)``，没有满足题目希望的线性时间。

方案二：集合查询后继
~~~~~~~~~~~~~~~~~~~~

哈希集合同时完成两次压缩：相同值只保留一份，任意整数是否存在可以期望 ``O(1)`` 查询。于是可以对每个
值不断询问 ``value + 1``、``value + 2`` 是否存在。``expandFromEveryValue`` 得到的每次扩展都是真实连续
段，却仍有隐藏的二次重复：对于长度为 ``k`` 的段，它会从第一个值扫描 ``k`` 个，从第二个扫描 ``k-1``
个，直到段尾，总工作为 ``1 + 2 + ... + k = O(k^2)``。

结构信息：每个连续段只有一个合法起点
~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

若 ``x - 1`` 也在集合中，``x`` 一定处于某段内部；从它向右扩展得到的所有内容，都会在该段更小的值启动
时被覆盖。只有前驱不存在的值才可能是完整连续段的左端。因此主解先做前驱测试，内部值直接跳过，只从
唯一左端一路查询后继。

这个判断删除的不是候选答案，而是同一答案的重复入口。任意连续段 ``a, a+1, ..., b`` 都满足：``a-1``
不存在，所以算法一定从 ``a`` 启动；对任意 ``x > a``，``x-1`` 存在，所以不会再次启动。

具体走读
~~~~~~~~

对集合 ``{7, 8, 9, 10, 12, 13, 14, 20}``：

.. list-table::
   :header-rows: 1

   * - 当前值
     - 前驱状态
     - 动作
   * - ``8``、``9``、``10``
     - 前驱存在
     - 都是 ``7..10`` 的内部值，跳过
   * - ``7``
     - ``6`` 不存在
     - 扩展 ``7, 8, 9, 10``，长度 ``4``
   * - ``12``
     - ``11`` 不存在
     - 扩展 ``12, 13, 14``，长度 ``3``
   * - ``20``
     - ``19`` 不存在
     - 单点段，长度 ``1``

哈希集合的遍历顺序不确定，不影响结论。即使先看到内部值也只会跳过；段左端迟早会被遍历并负责完整计数。

为何嵌套循环仍是线性
~~~~~~~~~~~~~~~~~~~~

代码表面上有 ``for`` 加 ``while``，但不能简单相乘。每个不同整数要么接受一次前驱检查，要么在所属连续
段从左端扩展时被访问；不同连续段互不重叠。所有 ``while`` 的成功次数之和不超过集合大小，所以构建集合、
外层检查和全部扩展的期望总时间都是 ``O(n)``。

边界状态与代码对应
~~~~~~~~~~~~~~~~~~

``value - 1`` 在 ``value == INT_MIN`` 时会溢出，``current + 1`` 在 ``INT_MAX`` 时同理。主解分别先判断
``value != INT_MIN`` 与 ``current != INT_MAX``，再执行算术；这不是改变连续定义，而是说明 32 位整数域的
两端不可能再有可表示的前驱或后继。排序基线则把加一提升到 ``long long`` 后比较。

``bestLength`` 从零开始，使空集合自然返回零；非空段从长度一开始，再为每个真实后继增加一。公开入口选择
``expandOnlyFromStarts``：它以 ``O(n)`` 额外集合空间换取期望线性时间。排序法适合空间或哈希行为受限的场景，
但时间为 ``O(n log n)``；从每个值扩展只用于暴露重复工作，不应作为实际方案。

复杂度分析
~~~~~~~~~~

主解期望时间 ``O(n)``、空间 ``O(n)``；哈希表极端碰撞时的最坏性能取决于容器实现。排序方案时间
``O(n log n)``，由于代码排序输入副本，工作空间为 ``O(n)``。
