0001. Two Sum
=============

题目信息
--------

:题号: 0001
:难度: Easy
:主题: 数组、哈希表、排序、双指针
:原题: `LeetCode 0001 <https://leetcode.com/problems/two-sum/>`_
:重点: 从枚举下标对推导到补数查询，再分别利用有序性和历史前缀索引消除重复搜索

题目重述
--------

给定整数数组 ``nums`` 和整数 ``target``，需要找到两个不同下标 ``i`` 和 ``j``，使 ``nums[i] + nums[j] == target``，并返回这两个零基下标。

每个位置最多使用一次。数组不保证有序，返回的两个下标也不要求按升序排列。题目保证恰好存在一个有效答案。

约束条件：

* ``2 <= nums.length <= 10^4``；
* ``-10^9 <= nums[i] <= 10^9``；
* ``-10^9 <= target <= 10^9``。

自建示例
--------

* 普通命中：``nums = [4, 1, 9, 5]``、``target = 10``，下标 ``1`` 和 ``2`` 对应的数值之和为 ``10``，返回 ``[1, 2]``；
* 相同数值：``nums = [4, 1, 4, 10]``、``target = 8``，两个 ``4`` 来自不同位置，返回 ``[0, 2]``；
* 负数参与：``nums = [-3, 7, 2, 11]``、``target = 4``，返回 ``[0, 1]``；
* 最小规模：``nums = [-5, 100]``、``target = 95``，数组只有两个元素，返回 ``[0, 1]``。

C++ 实现
--------

.. code-block:: cpp

   #include <algorithm>
   #include <unordered_map>
   #include <utility>
   #include <vector>

   class Solution {
   private:
       std::vector<int> bruteForce(
           const std::vector<int>& nums,
           int target
       ) {
           for (int left = 0; left < static_cast<int>(nums.size()); ++left) {
               for (int right = left + 1;
                    right < static_cast<int>(nums.size());
                    ++right) {
                   const long long sum =
                       static_cast<long long>(nums[left]) + nums[right];

                   if (sum == target) {
                       return {left, right};
                   }
               }
           }

           return {};
       }

       std::vector<int> sortAndTwoPointers(
           const std::vector<int>& nums,
           int target
       ) {
           std::vector<std::pair<int, int>> items;
           items.reserve(nums.size());

           for (int index = 0;
                index < static_cast<int>(nums.size());
                ++index) {
               items.emplace_back(nums[index], index);
           }

           std::sort(items.begin(), items.end());

           int left = 0;
           int right = static_cast<int>(items.size()) - 1;

           while (left < right) {
               const long long sum =
                   static_cast<long long>(items[left].first) +
                   items[right].first;

               if (sum == target) {
                   return {items[left].second, items[right].second};
               }

               if (sum < target) {
                   ++left;
               } else {
                   --right;
               }
           }

           return {};
       }

       std::vector<int> onePassHash(
           const std::vector<int>& nums,
           int target
       ) {
           std::unordered_map<int, int> seen;
           seen.reserve(nums.size());

           for (int index = 0;
                index < static_cast<int>(nums.size());
                ++index) {
               const int need = target - nums[index];
               const auto found = seen.find(need);

               if (found != seen.end()) {
                   return {found->second, index};
               }

               seen[nums[index]] = index;
           }

           return {};
       }

   public:
       std::vector<int> twoSum(std::vector<int>& nums, int target) {
           return onePassHash(nums, target);
       }
   };

题解
----

原始搜索空间
~~~~~~~~~~~~

最直接的方法是枚举所有 ``i < j`` 的下标对。长度为 ``n`` 的数组共有 ``n(n - 1) / 2`` 个不同下标对，``bruteForce`` 恰好把这些候选全部检查一次，因此不会漏掉答案。

一次候选检查只需要常数时间，真正的问题是候选数量达到二次规模。固定一个位置后，代码仍要逐个访问其他位置，反复寻找能够与当前值组成 ``target`` 的元素。

这里的重复工作不是加法本身，而是“在剩余元素中寻找指定数值”。

补数转换
~~~~~~~~

条件 ``nums[i] + nums[j] == target`` 可以改写为 ``nums[i] == target - nums[j]``。当当前位置 ``j`` 已经确定时，另一个位置需要保存的数值也随之确定，这个数值就是补数 ``target - nums[j]``。

问题因此从“枚举两个未知位置”转变为：顺序选择一个当前位置，再查询它的补数是否存在，以及补数位于哪个下标。

接下来有两条不同的优化路线：排序通过有序性批量排除候选，哈希表则直接为已经扫描过的元素建立按数值查询的索引。

排序双指针
~~~~~~~~~~

数组无序时，当前和过大或过小都不能说明应该移动哪个位置。``sortAndTwoPointers`` 先建立 ``(数值, 原始下标)`` 副本并按数值排序，让剩余候选区间具有单调性，同时保留最终需要返回的原始下标。

令 ``left`` 指向剩余区间最小值，``right`` 指向最大值：

* 当前和小于 ``target`` 时，最小值与区间最大值配对仍然过小，它与更小的右侧元素配对只会更小，因此可以排除当前 ``left``；
* 当前和大于 ``target`` 时，最大值与区间最小值配对仍然过大，它与更大的左侧元素配对只会更大，因此可以排除当前 ``right``；
* 当前和等于 ``target`` 时，两个元素保存的原始下标就是答案。

暴力法每次只排除一个下标对，排序双指针每次移动都排除以某个端点为一端的一整组候选。代价是先排序，并额外保存原始下标。

历史前缀索引
~~~~~~~~~~~~

排序方案利用单调性减少候选，还可以进一步直接解决“寻找补数”这个瓶颈。

扫描到 ``index`` 时，只在已经处理过的前缀 ``[0, index)`` 中寻找 ``need = target - nums[index]``。使用 ``unordered_map`` 保存“数值到历史下标”的映射后，补数查询由线性搜索变为期望常数时间。

查询必须发生在写入当前元素之前。这样，``seen`` 中只包含更早的位置，命中后得到的下标天然与 ``index`` 不同；查询失败后再写入当前值，使它从下一轮开始成为历史前缀的一部分。

映射的值只需要是该数值的一个有效历史下标。当前实现覆盖旧下标并保存最近一次出现位置，不影响正确性，因为题目只要求返回任意一组合法下标。

状态演化
~~~~~~~~

以 ``nums = [4, 1, 4, 10]``、``target = 8`` 为例：

.. list-table::
   :header-rows: 1

   * - ``index``
     - ``value``
     - ``need``
     - 查询前的 ``seen``
     - 动作
   * - 0
     - 4
     - 4
     - ``{}``
     - 未命中，写入 ``4 -> 0``
   * - 1
     - 1
     - 7
     - ``{4: 0}``
     - 未命中，写入 ``1 -> 1``
   * - 2
     - 4
     - 4
     - ``{4: 0, 1: 1}``
     - 命中 ``4 -> 0``，返回 ``[0, 2]``

处理第一个 ``4`` 时，哈希表仍为空，所以它不能与自己配对。处理第二个 ``4`` 时，第一个 ``4`` 已经进入历史前缀，两个不同位置才形成答案。

代码演进
~~~~~~~~

``bruteForce`` 使用两层循环显式枚举两个未知位置。发现第二个位置的数值其实由第一个位置和 ``target`` 唯一确定后，问题转化为补数查询。

``sortAndTwoPointers`` 通过排序获得单调性，把内层逐个尝试改成移动左右端点。代码仍然需要构造副本和排序，因为它依赖全局有序关系来批量排除候选。

``onePassHash`` 不再调整原数组顺序，而是边扫描边为历史前缀建立反向索引。排序、副本、左右指针全部消失，只剩一次遍历、一次补数查询和一次历史状态写入。

因此三种实现对应三层认识：

* 不利用结构时，枚举全部下标对；
* 利用有序性时，一次排除整组候选；
* 为补数建立索引时，直接定位历史位置。

公开入口采用 ``onePassHash``，因为它不修改输入，不需要排序，并能在期望线性时间内返回原始下标。

复杂度分析
~~~~~~~~~~

.. list-table::
   :header-rows: 1

   * - 方法
     - 时间复杂度
     - 工作空间
     - 主要代价
   * - 暴力枚举
     - ``O(n²)``
     - ``O(1)``
     - 检查全部不同下标对
   * - 排序双指针
     - ``O(n log n)``
     - ``O(n)``
     - 构造并排序带原始下标的副本
   * - 一次遍历哈希表
     - 期望 ``O(n)``
     - ``O(n)``
     - 保存历史数值到下标的映射

哈希表查询和写入的平均时间为 ``O(1)``，因此主解法的期望总时间为 ``O(n)``。极端哈希冲突下的最坏时间取决于容器实现，不能简单视为严格线性。

边界处理
~~~~~~~~

* 数组只有两个元素时，只要它们构成题目保证的唯一答案，三种方法都会直接返回这两个下标；
* 两个答案元素数值相同时，先查询后写入可以保证使用两个不同位置；
* 数组包含负数时，补数转换和哈希查询方式不变；
* 排序方案对副本排序，因此不会改变调用者传入的 ``nums``；
* C++ 实现使用 ``long long`` 计算两个元素之和，避免更大数据范围下的加法溢出。
