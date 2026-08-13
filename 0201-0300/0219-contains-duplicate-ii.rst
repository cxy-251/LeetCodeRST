0219. Contains Duplicate II
==========================

题目信息
--------

:题号: 0219. 存在重复元素 II
:难度: Easy
:主题: 滑动窗口、哈希集合、下标距离
:原题: `LeetCode 0219 <https://leetcode.com/problems/contains-duplicate-ii/>`_
:重点: 最近 K 个位置、窗口过期、先查询再插入

题目重述
--------

给定整数数组 ``nums`` 和非负整数 ``k``，判断是否存在不同下标 ``i``、``j``，同时满足
``nums[i] == nums[j]`` 与 ``|i-j| <= k``。只返回布尔值；值相同但距离超过 ``k`` 的下标对不算答案，输入数组不需要修改。

自建示例
--------

``nums = [1,2,3,1], k = 3`` 返回 ``true``，两个 1 的距离正好为 3。
``nums = [1,2,3,1], k = 2`` 返回 ``false``：重复值存在，但唯一的一对距离为 3，不能把全局重复误当成局部重复。

``nums = [1,0,1,1], k = 1`` 返回 ``true``，最后两个 1 相邻；第一个 1 虽然也重复，却已经离开当前允许窗口。

从全局重复到活动下标窗口
------------------------

0217 的全局哈希集合可以回答“值是否出现过”，但无法回答旧值的位置是否足够近。若保存每个值的所有下标，查询时还要在列表中
寻找距离边界，或者在每次插入时维护额外结构。

扫描到下标 ``i`` 时，能够与它配对的旧下标只能在 ``[i-k, i-1]``。因此只保留最近 ``k`` 个已经扫描的元素：窗口之外的下标
以后只会更远，永久不可能满足距离条件，可以安全删除。窗口内只需保存值的存在性，遇到相同值即可返回成功。

状态不变量
----------

在处理 ``nums[i]`` 之前，集合 ``window`` 包含且只包含区间 ``[max(0,i-k), i-1]`` 中的不同值。转移顺序为：

1. 查询当前值是否已在 ``window``；命中表示存在合法旧下标，立即返回 ``true``；
2. 未命中时插入当前值；
3. 若 ``i >= k``，删除刚刚离开下一轮窗口的 ``nums[i-k]``。

先查再插入保证当前元素不会和自己配对。插入前没有命中时，窗口内没有重复值，因此删除一个值不会误删另一份代表；若窗口内早已
有同值，算法在此前一次查询就已经返回了 ``true``。

C++ 实现
--------

.. code-block:: cpp

   class Solution {
   private:
       static bool containsByLastIndex(const std::vector<int>& nums, int k) {
           std::unordered_map<int, int> last;
           for (int index = 0; index < static_cast<int>(nums.size()); ++index) {
               auto position = last.find(nums[index]);
               if (position != last.end() && index - position->second <= k) {
                   return true;
               }
               last[nums[index]] = index;
           }
           return false;
       }

       static bool containsByWindow(const std::vector<int>& nums, int k) {
           if (k <= 0) return false;
           std::unordered_set<int> window;
           window.reserve(static_cast<std::size_t>(k) + 1);

           for (int index = 0; index < static_cast<int>(nums.size()); ++index) {
               if (window.find(nums[index]) != window.end()) return true;
               window.insert(nums[index]);
               if (index >= k) window.erase(nums[index - k]);
           }
           return false;
       }

   public:
       bool containsNearbyDuplicate(std::vector<int>& nums, int k) {
           return containsByWindow(nums, k);
       }
   };

题解
----

状态走读
~~~~~~~~

对 ``nums=[1,2,3,1]``、``k=2``，窗口只保存至多两个历史位置：

.. list-table::
   :header-rows: 1

   * - 当前下标和值
     - 查询前窗口
     - 操作
     - 下一状态
   * - ``0:1``
     - ``{}``
     - 未命中，插入 1
     - ``{1}``
   * - ``1:2``
     - ``{1}``
     - 未命中，插入 2
     - ``{1,2}``
   * - ``2:3``
     - ``{1,2}``
     - 未命中，插入 3，删除下标 0 的 1
     - ``{2,3}``
   * - ``3:1``
     - ``{2,3}``
     - 未命中，插入 1，删除下标 1 的 2
     - ``{3,1}``

最后一个 1 不再看到第一个 1，因为它们距离为 3；这正是删除过期状态而不是维护全局集合的效果。

两种窗口实现的取舍
~~~~~~~~~~~~~~~~~~

``containsByLastIndex`` 为每个值只保留最近一次下标。对当前值，最近一次出现的位置最有希望满足距离限制；如果它已经太远，
更早出现的位置只会更远，因此可以被覆盖。它的时间和空间都是期望 ``O(n)``，但状态含义是“每个值的最近代表”。

``containsByWindow`` 则直接保存允许配对的全部值，状态更贴近题目中的下标区间，且在当前窗口中发现重复后立即结束。主入口选择窗口法，
因为删除 ``i-k`` 后集合就与下一轮的允许历史完全同构；两种方法都不修改输入，区别只在保存的索引信息多少。

代码分析
~~~~~~~~

删除写在插入之后，删除的下标是 ``index-k``：处理当前元素时它仍是合法旧位置，下一轮开始时才应离开窗口。若把删除写成
``index-k-1``，窗口会多保留一个位置，错误接受距离 ``k+1`` 的重复；若先删除当前窗口再查询，则会丢掉恰好距离为 ``k`` 的合法配对。

``k <= 0`` 直接返回 ``false``，因为不同下标的距离至少为 1。``reserve`` 只是减少哈希扩容；集合只保存值，不需要存储下标，
因为窗口边界已经由扫描位置隐式表达。

复杂度与边界
~~~~~~~~~~~~

窗口法每个元素最多插入、删除一次，哈希操作期望为 ``O(1)``，总时间期望 ``O(n)``，额外空间 ``O(min(n,k))``；最近下标法时间
期望 ``O(n)``、空间 ``O(n)``。哈希极端碰撞时严格最坏时间可能退化。``k >= n`` 时窗口覆盖全部已扫描历史，算法退化为全局重复检测；
单元素数组和 ``k=0`` 均没有合法下标对。
