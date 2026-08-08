0001. Two Sum
=============

题目信息
--------

:题号: 0001. 两数之和
:难度: Easy
:主题: 数组、哈希表、排序、双指针
:原题: `LeetCode 0001 <https://leetcode.com/problems/two-sum/>`_
:重点: 从枚举下标对推导到补数查询，再利用有序性或哈希索引消除重复搜索

题目重述
--------

给定整数数组 ``nums`` 和整数 ``target``，需要找到两个不同的零基下标 ``i`` 和 ``j``，使 ``nums[i] + nums[j] == target``，并返回这两个下标。

同一个位置不能重复使用。数组不保证有序，返回的两个下标也不要求按升序排列。题目保证恰好存在一个有效答案。

约束条件：

* ``2 <= nums.length <= 10^4``；
* ``-10^9 <= nums[i] <= 10^9``；
* ``-10^9 <= target <= 10^9``。

自建示例
--------

* 普通命中：``nums = [4, 1, 9, 5]``、``target = 10``，数值 ``1`` 和 ``9`` 位于下标 ``1``、``2``，返回 ``[1, 2]``；
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
       std::vector<int> bruteForce(const std::vector<int>& nums, int target) {
           for (int left = 0; left < static_cast<int>(nums.size()); ++left) {
               for (int right = left + 1; right < static_cast<int>(nums.size()); ++right) {
                   const long long sum = static_cast<long long>(nums[left]) + nums[right];
                   if (sum == target) {
                       return {left, right};
                   }
               }
           }
           return {};
       }

       std::vector<int> sortAndTwoPointers(const std::vector<int>& nums, int target) {
           std::vector<std::pair<int, int>> items;
           items.reserve(nums.size());
           for (int index = 0; index < static_cast<int>(nums.size()); ++index) {
               items.emplace_back(nums[index], index);
           }
           std::sort(items.begin(), items.end());
           int left = 0;
           int right = static_cast<int>(items.size()) - 1;
           while (left < right) {
               const long long sum = static_cast<long long>(items[left].first) + items[right].first;
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

       std::vector<int> twoPassHash(const std::vector<int>& nums, int target) {
           std::unordered_map<int, int> indexByValue;
           indexByValue.reserve(nums.size());
           for (int index = 0; index < static_cast<int>(nums.size()); ++index) {
               indexByValue[nums[index]] = index;
           }
           for (int index = 0; index < static_cast<int>(nums.size()); ++index) {
               const int need = target - nums[index];
               const auto found = indexByValue.find(need);
               if (found != indexByValue.end() && found->second != index) {
                   return {index, found->second};
               }
           }
           return {};
       }

       std::vector<int> onePassHash(const std::vector<int>& nums, int target) {
           std::unordered_map<int, int> seen;
           seen.reserve(nums.size());
           for (int index = 0; index < static_cast<int>(nums.size()); ++index) {
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

最直接的方法是枚举所有 ``i < j`` 的下标对。长度为 ``n`` 的数组共有 ``n(n - 1) / 2`` 个不同下标对，``bruteForce`` 恰好把这些候选全部检查一次，因此不会遗漏答案。

一次候选检查只做一次加法和比较，真正的瓶颈是候选数量达到二次规模。固定一个位置后，内层循环仍要逐个访问其后的元素，反复寻找能够与当前值组成 ``target`` 的数。

重复工作不是计算两数之和，而是“在其余元素中寻找一个指定数值”。

补数转换
~~~~~~~~

条件 ``nums[i] + nums[j] == target`` 可以改写为 ``nums[i] == target - nums[j]``。当当前位置 ``j`` 已经确定时，另一个位置需要具有的数值也随之确定，这个数值就是补数 ``target - nums[j]``。

问题由“同时枚举两个未知位置”转变为：选择一个当前位置，再查询它的补数是否存在以及补数位于哪个下标。

这个转换产生两条优化路线：排序让候选具有单调性，可以批量排除不可能的下标；哈希表则直接建立从数值到下标的索引，使补数查询不再线性扫描。

排序双指针
~~~~~~~~~~

原数组无序时，当前和过大或过小都不能确定应排除哪个元素。``sortAndTwoPointers`` 先建立 ``(数值, 原始下标)`` 副本并按数值排序，使剩余区间具有单调性，同时避免修改输入并保留最终需要返回的原始下标。

令 ``left`` 指向剩余区间最小值，``right`` 指向最大值：

* 当前和小于 ``target`` 时，最小值与区间最大值配对仍然过小，它与区间内任何更小的数配对只会更小，因此可以排除当前 ``left``；
* 当前和大于 ``target`` 时，最大值与区间最小值配对仍然过大，它与区间内任何更大的数配对只会更大，因此可以排除当前 ``right``；
* 当前和等于 ``target`` 时，两个元素保存的原始下标就是答案。

暴力法每次只检查并排除一个下标对，双指针每次移动都排除以当前端点为一端的一整组候选。代价是构造副本并排序，总时间由排序主导。

完整哈希索引
~~~~~~~~~~~~

另一条路线是直接解决补数查询。``twoPassHash`` 第一遍扫描建立 ``数值 -> 下标`` 的完整索引，第二遍对每个位置查询补数。

查询命中后还必须检查 ``found->second != index``。例如只有一个数值 ``4`` 时，查询补数 ``4`` 可能得到当前位置本身，而题目禁止同一个位置使用两次。若数组中存在两个相同的答案值，映射保存其中一个下标，扫描另一个位置时就能通过不同下标检查。

完整索引把每次补数搜索从线性扫描降为期望常数时间，使总时间降到期望 ``O(n)``。不过它把“建立索引”和“寻找答案”分成两次遍历，即使答案很早出现，也要先保存整个数组。

历史前缀索引
~~~~~~~~~~~~

扫描到 ``index`` 时，答案的另一个位置只需从已经处理过的前缀 ``[0, index)`` 中寻找。于是可以把建立索引和查询答案合并到同一轮扫描中。

``onePassHash`` 在处理当前元素时先查询 ``need = target - nums[index]``。此时 ``seen`` 只包含更早的位置，查询命中后得到的下标天然与 ``index`` 不同，不再需要显式比较下标。查询失败后再写入当前值，使它从下一轮开始成为历史前缀的一部分。

查询与写入的顺序不能交换。若先写入当前值，补数与当前值相同时，当前位置可能立即匹配自己。先查询、后写入把“两个下标必须不同”直接编码进了状态范围。

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

第一个 ``4`` 到达时，历史前缀为空，所以它不能与自己配对。第二个 ``4`` 到达时，第一个 ``4`` 已经进入历史前缀，两个不同位置才形成答案。

代码演进
~~~~~~~~

``bruteForce`` 使用两层循环枚举两个未知位置。补数转换确定了第二个位置必须具有的数值，后续优化都围绕“如何更快找到补数”展开。

``sortAndTwoPointers`` 通过排序建立单调性，把内层逐个尝试改成左右端点移动；它删除了内层线性枚举，但增加了带原始下标的副本和排序过程。

``twoPassHash`` 不再依赖元素顺序，而是建立完整的数值索引。排序副本和双指针消失，补数可以直接查询；代码需要两次遍历，并显式排除当前位置与自己匹配。

``onePassHash`` 进一步把完整索引缩减为历史前缀索引。第二次遍历和不同下标判断同时消失，代码只保留一次顺序扫描、一次补数查询和一次历史状态写入。

四种实现对应四层认识：

* 不利用结构时，枚举全部下标对；
* 利用有序性时，一次排除整组候选；
* 建立完整索引时，直接查询补数；
* 只索引历史前缀时，在一次遍历中完成查询与建表。

公开入口采用 ``onePassHash``，因为它不修改输入、不需要排序，并能在期望线性时间内返回原始下标。

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
   * - 两次遍历哈希表
     - 期望 ``O(n)``
     - ``O(n)``
     - 先建立完整索引，再查询补数
   * - 一次遍历哈希表
     - 期望 ``O(n)``
     - ``O(n)``
     - 边扫描边维护历史前缀索引

哈希表查询和写入的平均时间为 ``O(1)``，因此两种哈希方案的期望总时间都是 ``O(n)``。极端哈希冲突下的最坏时间取决于容器实现，不能把它们写成严格线性。
