0016. 3Sum Closest
==================

题目信息
--------

:题号: 0016. 最接近的三数之和
:难度: Medium
:主题: 数组、排序、双指针
:原题: `LeetCode 0016 <https://leetcode.com/problems/3sum-closest/>`_
:重点: 固定一个数后，用有序和值与目标的大小关系排除一整组数对，并持续保存距离最小的和值

题目重述
--------

给定整数数组 ``nums`` 和整数 ``target``，选择三个不同下标，返回与 ``target`` 最接近的三数之和。

接近程度由 ``abs(sum - target)`` 衡量。题目保证最近和值唯一。返回的是三数之和本身，不是下标、三元组或
最小距离。

数组长度位于 ``[3, 500]``，元素位于 ``[-1000, 1000]``，``target`` 位于 ``[-10^4, 10^4]``。
三数之和与距离都可以由 32 位有符号整数安全保存。

自建示例
--------

* 无法精确命中：``nums = [-5, -1, 2, 6, 9]``、``target = 4``，最近和值为 ``3``；
* 精确命中：``nums = [7, -2, 4, 1]``、``target = 6``，三元组 ``[-2, 1, 7]`` 的和为 ``6``；
* 全部为负：``nums = [-8, -5, -3, -1]``、``target = -10``，最近和值为 ``-9``；
* 目标远大于全部和值：``nums = [1, 2, 5, 8]``、``target = 100``，最大三数之和 ``15`` 最近；
* 最小规模：``nums = [-3, 2, 7]``、``target = 1``，唯一三数之和为 ``6``。

C++ 实现
--------

.. code-block:: cpp

   #include <algorithm>
   #include <cstdlib>
   #include <vector>

   class Solution {
   private:
       int enumerateTriples(const std::vector<int>& nums, int target) {
           int best = nums[0] + nums[1] + nums[2];
           const int n = static_cast<int>(nums.size());
           for (int first = 0; first < n; ++first) {
               for (int second = first + 1; second < n; ++second) {
                   for (int third = second + 1; third < n; ++third) {
                       const int sum = nums[first] + nums[second] + nums[third];
                       if (std::abs(sum - target) < std::abs(best - target)) {
                           best = sum;
                       }
                   }
               }
           }
           return best;
       }

       int sortAndTwoPointers(std::vector<int> nums, int target) {
           std::sort(nums.begin(), nums.end());
           int best = nums[0] + nums[1] + nums[2];
           const int n = static_cast<int>(nums.size());
           for (int first = 0; first + 2 < n; ++first) {
               int left = first + 1;
               int right = n - 1;
               while (left < right) {
                   const int sum = nums[first] + nums[left] + nums[right];
                   if (std::abs(sum - target) < std::abs(best - target)) {
                       best = sum;
                   }
                   if (sum < target) {
                       ++left;
                   } else if (sum > target) {
                       --right;
                   } else {
                       return target;
                   }
               }
           }
           return best;
       }

   public:
       int threeSumClosest(std::vector<int>& nums, int target) {
           return sortAndTwoPointers(nums, target);
       }
   };

题解
----

三重枚举
~~~~~~~~

三个递增下标共有 ``O(n³)`` 种组合。``enumerateTriples`` 逐个计算和值，并在当前距离严格更小时替换
``best``。题目保证最近和值唯一，所以不需要定义距离相等时的额外选择规则。

暴力法已经给出完整答案条件：算法不必保存三元组，只需维护“目前距离目标最近的和值”。需要优化的是候选组合
数量，而不是答案状态。

固定首值
~~~~~~~~

数组排序后固定 ``nums[first]``，剩余问题是在有序后缀中选择两个数，使
``nums[left] + nums[right]`` 尽量接近 ``target - nums[first]``。

令 ``left = first + 1``、``right = n - 1``。在固定 ``first`` 时：

* 右移 ``left``，和值不会减小；
* 左移 ``right``，和值不会增大。

和值相对于目标的位置因此直接决定了唯一有意义的移动方向。

和值偏小
~~~~~~~~

若当前 ``sum < target``，固定 ``first`` 和 ``left``，再选择任意更小的右端 ``k < right``，有：

``nums[first] + nums[left] + nums[k] <= sum < target``。

这些和值都位于目标左侧，并且不大于已经检查的 ``sum``，所以它们到目标的距离不会更小。当前候选记录后，
所有使用当前 ``left`` 与更小右端的组合都可以排除，只需右移 ``left``，尝试把和值提高。

和值偏大
~~~~~~~~

若当前 ``sum > target``，固定 ``first`` 和 ``right``，再选择任意更大的左端 ``k > left``，有：

``nums[first] + nums[k] + nums[right] >= sum > target``。

这些和值都位于目标右侧，并且不小于已经检查的 ``sum``，同样不可能更接近目标。于是可以排除当前
``right`` 与所有更大左端组成的组合，并左移 ``right``，尝试降低和值。

更新顺序
~~~~~~~~

当前和值无论偏小还是偏大，都可能是全局最近答案。因此每轮必须先比较
``abs(sum - target)`` 与 ``abs(best - target)``，再移动指针。

指针移动的证明依赖“当前边界和值已经记录”：被排除的组合不会优于当前和值，而当前和值本身已经进入
``best`` 的比较。若先移动，可能永久跳过这一边界候选。

搜索不变量
~~~~~~~~~~

固定 ``first`` 后，每轮开始时，尚未检查且仍可能优于 ``best`` 的数对都位于闭区间 ``[left, right]`` 中。

每轮先记录当前边界数对，再依据单调性删除一整组不可能更优的组合。指针相遇时，该首值对应的全部潜在更优
数对都已检查或被支配。外层遍历所有 ``first`` 后，``best`` 就是全局最近和值。

精确命中
~~~~~~~~

当 ``sum == target`` 时，距离为 ``0``。绝对距离不可能小于零，因此当前和值已经达到理论最优，可以立即返回
``target``。

代码演进
~~~~~~~~

``enumerateTriples`` 使用三层循环显式选择三个下标，每个候选独立比较距离。

``sortAndTwoPointers`` 固定首值后，用排序建立和值的单调变化。第三层枚举被两个只向中间移动的指针替代；
一次比较即可排除当前左端或右端参与的一整组候选。

公开入口采用 ``sortAndTwoPointers``。它接收输入副本进行排序，不会改变调用者传入的数组。

复杂度分析
~~~~~~~~~~

.. list-table::
   :header-rows: 1

   * - 方法
     - 时间复杂度
     - 工作空间
     - 主要代价
   * - 三重枚举
     - ``O(n³)``
     - ``O(1)``
     - 检查全部三下标组合
   * - 排序双指针
     - ``O(n²)``
     - ``O(n)``
     - 排序副本后，每个首值执行一次线性双指针扫描

排序耗时 ``O(n log n)``，被 ``O(n²)`` 的双指针阶段主导。工作空间中的 ``O(n)`` 来自输入副本；不计返回值。
