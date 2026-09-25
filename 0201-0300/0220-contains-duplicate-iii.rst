0220. Contains Duplicate III
===========================

题目信息
--------

:题号: 0220. 存在重复元素 III
:难度: Hard
:主题: 滑动窗口、有序集合、区间查询、整数溢出
:原题: `LeetCode 0220 <https://leetcode.com/problems/contains-duplicate-iii/>`_
:重点: 下标和值的双重限制、闭区间查询、窗口顺序、宽整数运算

题目重述
--------

给定整数数组 ``nums``、非负整数 ``indexDiff`` 和 ``valueDiff``，判断是否存在不同下标 ``i``、``j``，同时满足：

.. code-block:: text

   |i - j| <= indexDiff
   |nums[i] - nums[j]| <= valueDiff

两个限制必须由同一对下标满足；只返回布尔值，不修改数组。数组值可能接近整数边界，所以差值和查询区间不能依赖 ``int``
发生溢出后的结果。``indexDiff=0`` 时不存在可用的不同下标对。

自建示例
--------

两个条件同时成立：``nums=[8,2,5,8]``、``indexDiff=3``、``valueDiff=0`` 返回 ``true``，首尾两个 8 同值且距离为 3。

只有值域条件看似成立：``nums=[1,4,9]``、``indexDiff=2``、``valueDiff=3`` 返回 ``false``；1 与 4 的值差合格，
但 4 与 9 的值差不合格，没有一对同时通过两个限制。

只有全局值相近但下标过远：``nums=[1,5,9,1]``、``indexDiff=2``、``valueDiff=3`` 返回 ``false``，
两个 1 的距离为 3；窗口内的值差也都至少为 4。若值为 ``INT_MIN`` 和 ``INT_MAX``，代码仍必须安全地判断它们相差很远。

C++ 实现
--------

.. code-block:: cpp

   #include <set>
   #include <vector>

   class Solution {
   public:
       bool containsNearbyAlmostDuplicate(std::vector<int>& nums,
                                           int indexDiff, int valueDiff) {
           if (indexDiff <= 0 || valueDiff < 0) return false;

           std::multiset<long long> window;
           for (int index = 0; index < static_cast<int>(nums.size()); ++index) {
               if (index > indexDiff) {
                   auto expired = window.find(static_cast<long long>(
                       nums[index - indexDiff - 1]));
                   window.erase(expired);
               }

               const long long value = nums[index];
               const long long lower = value - static_cast<long long>(valueDiff);
               const long long upper = value + static_cast<long long>(valueDiff);
               auto candidate = window.lower_bound(lower);
               if (candidate != window.end() && *candidate <= upper) return true;
               window.insert(value);
           }
           return false;
       }
   };

题解
----

从下标对枚举到两个可维护的范围
~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

枚举所有 ``i < j`` 并同时检查两个不等式最直接，但最坏需要 ``O(n^2)`` 次比较。先按下标排序或按值排序也不能一次解决：
扫描位置增加时，合法下标集合会不断滑动；同时题目还要求在活动集合中查找一个值域邻居。

固定当前下标 ``i`` 后，旧下标只有 ``[i-indexDiff, i-1]`` 可能合法。窗口之外的元素以后只会更远，先把它们删除，
就把全局位置对压缩为活动窗口。设当前值为 ``x``，窗口中的合法旧值必须落在闭区间
``[x-valueDiff, x+valueDiff]``；这不是哈希集合的精确相等查询，而是有序值域的范围查询。

选择有序集合后，``lower_bound(lower)`` 找到第一个不小于下界的候选：若它不存在或已经大于上界，后面的值只会更大，
整个区间内没有答案；若它不大于上界，它本身就与 ``x`` 的差值不超过 ``valueDiff``。一次查找因此取代了窗口内的线性比较。

状态不变量与操作顺序
~~~~~~~~~~~~~~~~~~~~~

处理 ``nums[i]`` 前，``window`` 保存且只保存下标 ``[max(0,i-indexDiff), i-1]`` 的值，每个历史位置占一个副本。
当前轮必须按以下顺序转移：

1. 若 ``i > indexDiff``，删除下标 ``i-indexDiff-1``；它已经不可能与当前或未来位置满足下标距离限制；
2. 把当前值提升为 ``long long``，形成合法值域的上下界，并在历史窗口中做 ``lower_bound``；
3. 查询失败后才插入当前值，使当前下标不会与自己配对。

删除、查询、插入的顺序分别对应“去掉过期候选”“检查两个约束的交集”“让当前元素成为未来候选”。任意调换都会改变题目定义：
先插入会制造距离 0 的自配对，提前删除会丢掉恰好距离为 ``indexDiff`` 的合法位置，晚删除会放进距离为 ``indexDiff+1`` 的旧位置。

状态走读
~~~~~~~~

对 ``nums=[1,5,9,1]``、``indexDiff=2``、``valueDiff=3``，删除过期位置后再做值域查询：

.. list-table::
   :header-rows: 1

   * - 当前下标和值
     - 查询前窗口
     - 合法值域
     - 查询结果与新状态
   * - ``0:1``
     - ``{}``
     - ``[-2,4]``
     - 无候选，插入 1
   * - ``1:5``
     - ``{1}``
     - ``[2,8]``
     - ``lower_bound(2)`` 到尾部，插入 5
   * - ``2:9``
     - ``{1,5}``
     - ``[6,12]``
     - ``lower_bound(6)`` 到尾部，插入 9
   * - ``3:1``
     - 删除下标 0 后为 ``{5,9}``
     - ``[-2,4]``
     - 没有候选，插入 1

最后一步中，值 1 仍在数组前缀里，却因下标 0 已过期而不在窗口；这说明窗口删除的是位置状态，不是数值本身的永久记录。

lower_bound 的充分性
~~~~~~~~~~~~~~~~~~~~

有序集合中的值按升序排列。设 ``candidate`` 是第一个不小于 ``lower`` 的值：

* ``candidate`` 不存在，说明所有窗口值都小于下界；
* ``candidate > upper``，说明它以及后续所有值都超过上界；
* ``candidate <= upper``，它同时位于闭区间 ``[lower, upper]``，与当前值构成合法值差。

所以不需要从下界向后扫描多个值，单个迭代器就覆盖了整个值域条件。使用 ``multiset`` 是为了让每个历史位置保留一份记录，
即使窗口中出现相同值，删除一个过期下标也只删除一个副本；当前值尚未插入，因此不会把自己当成历史位置。

方案取舍与代码走读
~~~~~~~~~~~~~~~~~~~~

哈希集合只能处理精确相等，无法回答“是否存在落在一个闭区间内的值”。桶方法可以把值域按 ``valueDiff+1`` 分桶，
期望时间接近 ``O(n)``，但需要处理负数分桶、相邻桶检查和整数边界；主解使用有序集合，以确定性的 ``O(log w)`` 查询直接表达值域范围，
其中 ``w`` 是窗口大小，代码和不变量更直接。

删除索引写成 ``index - indexDiff - 1``，因为下标差等于 ``indexDiff`` 的位置仍属于本轮候选。边界先转换到 ``long long`` 再相减或相加，
而不是先在 ``int`` 中计算后转换；这样 ``INT_MIN``、``INT_MAX`` 附近的输入不会让值域方向因溢出而改变。

复杂度与边界
~~~~~~~~~~~~

窗口最多包含 ``w = min(n,indexDiff)`` 个历史位置。每个元素至多一次删除、一次 ``lower_bound`` 和一次插入，
每次有序集合操作为 ``O(log w)``，总时间为 ``O(n log w)``，额外空间为 ``O(w)``。``indexDiff=0`` 没有合法下标对，
``valueDiff=0`` 退化为窗口内的精确重复判断；参数非负保证区间上下界的语义正常，防御性分支仍避免异常输入进入后续运算。
