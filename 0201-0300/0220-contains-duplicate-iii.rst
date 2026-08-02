0220. Contains Duplicate III
============================

题目信息
--------

:题号: 0220
:难度: Hard
:主题: 数组、滑动窗口、有序集合、桶
:原题: `LeetCode 0220 <https://leetcode.com/problems/contains-duplicate-iii/>`_
:重点: 不同下标、下标距离与数值距离同时受限、差值溢出、零阈值

题目重述
--------

给定整数数组 ``nums``、非负整数 ``indexDiff`` 和 ``valueDiff``，判断是否存在两个不同的零基下标 ``i``、``j``，使 ``|i-j| <= indexDiff``，并且 ``|nums[i]-nums[j]| <= valueDiff``。两个条件必须由同一对下标同时满足。

``nums`` 的长度范围为 ``[1, 10^5]``，元素位于 ``[-10^9, 10^9]``；``indexDiff`` 位于 ``[0, 10^5]``，``valueDiff`` 位于 ``[0, 10^9]``。数值相减时可能超出较窄整数类型的安全范围。函数返回布尔值，不修改输入数组。

自建示例
--------

两个限制同时成立：

.. code-block:: text

   输入：nums = [12, 4, 10], indexDiff = 2, valueDiff = 2
   输出：true
   解释：下标 0 和 2 的距离为 2，对应数值 12 和 10 的差为 2，均未超过给定上限。

只有数值条件成立：

.. code-block:: text

   输入：nums = [7, 1, 8], indexDiff = 1, valueDiff = 1
   输出：false
   解释：7 与 8 的数值差为 1，但它们的下标距离为 2；相邻位置之间又没有满足数值差限制的组合。

有序窗口
--------

处理下标 ``i`` 时，先把最近 ``indexDiff`` 个历史位置作为候选集合。候选值按有序结构保存，
这样可以直接寻找不小于 ``nums[i] - valueDiff`` 的第一个值；若它不超过
``nums[i] + valueDiff``，就找到了同时满足数值限制的历史元素。

数值区间应在宽整数中计算：

.. code-block:: text

   low  = nums[i] - valueDiff
   high = nums[i] + valueDiff
   candidate = window.lower_bound(low)
   candidate 存在且 candidate <= high  ->  成功

检查之后再加入当前值，并在 ``i >= indexDiff`` 时移除 ``nums[i-indexDiff]``。
这样下标距离恰好为 ``indexDiff`` 的元素仍会参与当前检查，下一轮才离开窗口。
``indexDiff=0`` 时没有两个不同下标能够满足距离条件，可以直接返回 ``false``。

正确性说明
----------

循环开始处理 ``i`` 前，``window`` 包含且只包含下标
``max(0, i-indexDiff)`` 到 ``i-1`` 的值。对这个集合做 ``lower_bound(low)``：
若返回值大于 ``high`` 或不存在，集合中没有落在闭区间 ``[low,high]`` 的数；
否则返回值本身与当前值的差不超过 ``valueDiff``，且其下标与 ``i`` 的距离不超过
``indexDiff``，两个条件同时成立。

处理完当前元素后维护窗口不变量。若整个扫描没有找到候选，则每个位置都排除了所有允许的历史位置，
所以不存在题目要求的下标对；反之，任意合法下标对在较晚下标被处理时必在窗口中并被检查到。

C++ 实现
--------

.. code-block:: cpp

   class Solution {
   public:
       bool containsNearbyAlmostDuplicate(
           std::vector<int>& nums, int indexDiff, int valueDiff) {
           if (indexDiff <= 0 || valueDiff < 0) return false;

           std::set<long long> window;
           for (int i = 0; i < static_cast<int>(nums.size()); ++i) {
               const long long value = nums[i];
               const long long low = value - static_cast<long long>(valueDiff);
               const long long high = value + static_cast<long long>(valueDiff);

               auto it = window.lower_bound(low);
               if (it != window.end() && *it <= high) return true;

               window.insert(value);
               if (i >= indexDiff) {
                   window.erase(static_cast<long long>(nums[i - indexDiff]));
               }
           }
           return false;
       }
   };

代码分析
--------

``std::set`` 同时提供去重和有序查找；当前值自身尚未插入，因此不会把同一位置误当成配对。
它只保存每个值的一份代表，但这不会破坏本算法的不变量：如果窗口中已经有同值的更早位置，
当前值在插入前就会满足 ``|nums[i]-nums[j]|=0``，并立即返回真；能够继续扫描的路径上，活动窗口中不会存在两个相同值。
因此删除最旧位置时按值 ``erase`` 不会误删仍需保留的另一份代表。每次操作为 ``O(log w)``，其中 ``w`` 不超过
``min(n,indexDiff)``，总时间为 ``O(n log w)``，额外空间为 ``O(w)``。使用 ``long long``
计算上下界，避免 ``int`` 加减 ``valueDiff`` 时溢出；输入本身不被改写。
