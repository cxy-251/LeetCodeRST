0041. First Missing Positive
============================

题目信息
--------

:题号: 0041. 缺失的第一个正数
:难度: Hard
:主题: 数组、哈希集合、原地哈希、循环置换
:原题: `LeetCode 0041 <https://leetcode.com/problems/first-missing-positive/>`_
:重点: 从记录正整数是否出现，推导到用数组下标充当值域槽位，并在线性时间内完成原地归位

题目重述
--------

给定一个未排序整数数组 ``nums``，返回其中没有出现的最小正整数。

算法必须达到 ``O(n)`` 时间复杂度，并且只使用 ``O(1)`` 额外空间。允许原地修改数组。

数组长度位于 ``[1, 10^5]``，元素可以是任意 32 位有符号整数，因此可能包含负数、零、重复正数以及远大于数组
长度的数。

自建示例
--------

* ``nums = [3, 4, -1, 1]``，返回 ``2``；
* ``nums = [1, 2, 0]``，返回 ``3``；
* ``nums = [7, 8, 9, 11, 12]``，返回 ``1``；
* ``nums = [1, 1, 2, 2]``，返回 ``3``；
* ``nums = [1, 2, 3, 4]``，返回 ``5``。

C++ 实现
--------

.. code-block:: cpp

   #include <algorithm>
   #include <unordered_set>
   #include <vector>

   class Solution {
   private:
       int sortAndScan(std::vector<int> nums) {
           std::sort(nums.begin(), nums.end());
           int expected = 1;
           for (int value : nums) {
               if (value < expected) {
                   continue;
               }
               if (value == expected) {
                   ++expected;
                   continue;
               }
               break;
           }
           return expected;
       }

       int recordWithHashSet(const std::vector<int>& nums) {
           std::unordered_set<int> present;
           const int n = static_cast<int>(nums.size());
           for (int value : nums) {
               if (value >= 1 && value <= n) {
                   present.insert(value);
               }
           }
           for (int candidate = 1; candidate <= n; ++candidate) {
               if (present.count(candidate) == 0) {
                   return candidate;
               }
           }
           return n + 1;
       }

       int placeValuesIntoOwnSlots(std::vector<int>& nums) {
           const int n = static_cast<int>(nums.size());
           for (int index = 0; index < n; ++index) {
               while (nums[index] >= 1 && nums[index] <= n) {
                   const int target = nums[index] - 1;
                   if (nums[target] == nums[index]) {
                       break;
                   }
                   std::swap(nums[index], nums[target]);
               }
           }

           for (int index = 0; index < n; ++index) {
               if (nums[index] != index + 1) {
                   return index + 1;
               }
           }
           return n + 1;
       }

   public:
       int firstMissingPositive(std::vector<int>& nums) {
           return placeValuesIntoOwnSlots(nums);
       }
   };

题解
----

排序扫描
~~~~~~~~

排序后从 ``expected = 1`` 开始扫描：

* 当前值小于 ``expected``，它是非正数或重复值，直接跳过；
* 当前值等于 ``expected``，说明该正整数存在，令 ``expected`` 加一；
* 当前值大于 ``expected``，有序性保证后面不会再出现 ``expected``，可以停止。

``sortAndScan`` 准确表达了“从 1 开始寻找首个缺口”，但排序需要 ``O(n log n)`` 时间。

有效答案范围
~~~~~~~~~~~~

长度为 ``n`` 的数组中，答案只可能位于 ``[1, n + 1]``。

若 ``1`` 到 ``n`` 中有任意一个值缺失，最小缺失正整数必然在该范围内；若它们全部出现，答案就是 ``n + 1``。
因此负数、零和大于 ``n`` 的值都与答案判定无关。

``recordWithHashSet`` 只记录 ``[1, n]`` 中出现过的值，再从 ``1`` 到 ``n`` 查询首个缺失项。它把时间降到
``O(n)``，但集合需要 ``O(n)`` 额外空间。

下标槽位
~~~~~~~~

数组本身已有 ``n`` 个槽位，下标 ``0..n-1`` 恰好可以记录值 ``1..n``：

.. code-block:: text

   值 1 -> 下标 0
   值 2 -> 下标 1
   ...
   值 x -> 下标 x - 1

若有效值 ``x`` 出现，就尽量把一个 ``x`` 放到 ``nums[x - 1]``。整理完成后，槽位 ``index`` 中若不是
``index + 1``，就说明该正整数没有出现。

这不是完整排序。算法只关心有效值是否进入自己的槽位；非正数、超范围值和多余重复值可以留在任意位置。

原地归位不变量
~~~~~~~~~~~~~~

外层处理下标 ``index`` 时，只要当前值 ``x = nums[index]`` 位于 ``[1, n]``，就计算目标槽位 ``x - 1``。

若目标槽位尚未保存 ``x``，交换 ``nums[index]`` 与 ``nums[x - 1]``。交换后，值 ``x`` 已经进入正确槽位，但当前位置
得到另一个值；这个新值也可能需要归位，因此必须继续使用 ``while``，而不是立即处理下一个下标。

若 ``nums[x - 1] == x``，目标槽位已经记录了值 ``x``。此时继续交换不会产生新状态：

* 当前值本来就在正确槽位时，无需移动；
* 当前值是重复副本时，存在性已经由目标槽位记录。

所以该条件既避免无效交换，也防止重复值造成死循环。

每次真正交换都会把一个有效值永久放入自己的槽位。其他不同值具有不同目标槽位；重复的同值又会被停止条件拦截，
因此已经正确的槽位不会被合法交换破坏。成功交换总数最多为 ``n``，两层循环合计仍为线性工作量。

状态演化
~~~~~~~~

对 ``[3, 4, -1, 1]``：

.. list-table::
   :header-rows: 1

   * - 当前下标
     - 数组状态
     - 动作
   * - 0
     - ``[3, 4, -1, 1]``
     - 值 3 与槽位 2 交换
   * - 0
     - ``[-1, 4, 3, 1]``
     - 当前值无效，进入下一下标
   * - 1
     - ``[-1, 4, 3, 1]``
     - 值 4 与槽位 3 交换
   * - 1
     - ``[-1, 1, 3, 4]``
     - 新值 1 与槽位 0 交换
   * - 1
     - ``[1, -1, 3, 4]``
     - 当前值无效，结束归位

最终下标 ``1`` 没有保存值 ``2``，因此答案为 ``2``。

首个缺口
~~~~~~~~

归位结束后，若有效值 ``x`` 在原数组中出现过，至少一个副本会进入槽位 ``x - 1``；后续重复副本只会看到该槽位
已经保存 ``x`` 后停止。

因此最终从左向右扫描时，第一处 ``nums[index] != index + 1`` 就表示值 ``index + 1`` 缺失。更小的槽位全部正确，
说明所有更小正整数都存在，所以它就是最小缺失正整数。若所有槽位都正确，说明 ``1..n`` 全部出现，返回
``n + 1``。

代码演进
~~~~~~~~

``sortAndScan`` 通过排序恢复正整数顺序，正确但需要 ``O(n log n)`` 时间。

``recordWithHashSet`` 改为记录 ``[1, n]`` 中每个值是否出现，达到线性时间，代价是线性额外空间。

``placeValuesIntoOwnSlots`` 保留相同的存在性模型，把集合键 ``x`` 映射为数组槽位 ``x - 1``。原数组由此成为固定
值域哈希表，同时满足线性时间和常量额外空间，公开入口采用该方法。

复杂度分析
~~~~~~~~~~

* 排序扫描：时间 ``O(n log n)``；当前实现按值传参，额外空间 ``O(n)``；
* 哈希集合：期望时间 ``O(n)``，额外空间 ``O(n)``；
* 原地归位：每个槽位最多被永久固定一次，归位与最终扫描合计 ``O(n)`` 时间，额外空间 ``O(1)``。
