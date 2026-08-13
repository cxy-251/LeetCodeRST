0220. Contains Duplicate III
===========================

题目信息
--------

:题号: 0220. 存在重复元素 III
:难度: Hard
:主题: 滑动窗口、有序集合、区间查询、整数溢出
:原题: `LeetCode 0220 <https://leetcode.com/problems/contains-duplicate-iii/>`_
:重点: 同时满足下标和值差限制、``lower_bound`` 区间查询、宽类型边界

题目重述
--------

给定整数数组 ``nums``、非负整数 ``indexDiff`` 和 ``valueDiff``，判断是否存在不同下标 ``i``、``j``，满足：

.. code-block:: text

   |i - j| <= indexDiff
   |nums[i] - nums[j]| <= valueDiff

只返回真假，不修改数组。数组元素可能接近 32 位整数上下界，所以差值计算不能在 ``int`` 中直接相减后再比较。

自建示例
--------

下标窗口与值窗口必须同时成立：

.. code-block:: text

   nums = [1,5,9,1,5,9], indexDiff = 2, valueDiff = 3
   输出 = false

重复的 1 相距 3，超过下标限制；相邻窗口内的值差至少为 4，也不满足值限制。

``nums = [8,2,5,8]``、``indexDiff = 3``、``valueDiff = 0`` 返回 ``true``，首尾两个 8 同值且距离 3。
若当前值是 ``INT_MAX``、窗口中旧值是 ``INT_MIN``，数学差值远超 ``int`` 可表示范围，代码仍必须安全地判断为不相近。

两个约束的交集
--------------

全局枚举所有下标对需要 ``O(n^2)``，每一对同时检查两个条件。先利用下标限制：扫描到 ``i`` 时，未来可能的旧下标只有
``[i-indexDiff, i-1]``；窗口之外的元素以后只会更远，可以永久删除。

在窗口内，当前值 ``x`` 的合法旧值必须落在闭区间 ``[x-valueDiff, x+valueDiff]``。哈希集合只能回答“是否相等”，
不能找值域邻居；有序集合能用 ``lower_bound(lower)`` 找到第一个不小于下界的值。若这个最小候选不超过上界，就存在合法值；
如果它已经大于上界，集合中其他候选只会更大，因此无需继续检查。

状态不变量与操作顺序
--------------------

处理 ``nums[i]`` 前，``window`` 保存且只保存下标 ``[max(0,i-indexDiff), i-1]`` 的值。每轮顺序为：

1. 删除刚刚离开下一轮窗口的下标 ``i-indexDiff-1``；
2. 在剩余窗口中查询当前值的合法值域；
3. 查询失败后才插入当前值。

若先插入再查询，当前元素会和自己配对；若晚删一个位置，会接受距离 ``indexDiff+1`` 的候选；若早删一个位置，会漏掉恰好距离
``indexDiff`` 的合法配对。所有边界 ``x ± valueDiff`` 先提升到 ``long long``，避免有符号溢出改变区间方向。

C++ 实现
--------

.. code-block:: cpp

   class Solution {
   public:
       bool containsNearbyAlmostDuplicate(std::vector<int>& nums,
                                           int indexDiff, int valueDiff) {
           if (indexDiff <= 0 || valueDiff < 0) return false;

           std::set<long long> window;
           for (int index = 0; index < static_cast<int>(nums.size()); ++index) {
               if (index > indexDiff) {
                   window.erase(static_cast<long long>(
                       nums[index - indexDiff - 1]));
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

状态走读
~~~~~~~~

对 ``nums=[1,5,9,1]``、``indexDiff=2``、``valueDiff=3``，窗口和查询区间如下：

.. list-table::
   :header-rows: 1

   * - 当前值
     - 删除后窗口
     - 当前允许值域
     - 结论
   * - 1（下标 0）
     - ``{}``
     - ``[-2,4]``
     - 无候选，插入 1
   * - 5（下标 1）
     - ``{1}``
     - ``[2,8]``
     - 集合中没有不小于 2 的值，返回尾迭代器，插入 5
   * - 9（下标 2）
     - ``{1,5}``
     - ``[6,12]``
     - 第一个不小于 6 的值不存在，插入 9
   * - 1（下标 3）
     - 删除下标 0 后为 ``{5,9}``
     - ``[-2,4]``
     - 没有候选，首个 1 已过期

表中第二行的 ``lower_bound(2)`` 实际返回尾部，说明值 1 虽然存在，却不在当前值域内；有序集合查询的是邻近范围，不是全局相等。

为什么只看 lower_bound
~~~~~~~~~~~~~~~~~~~~~~

集合按升序排列。``lower_bound(lower)`` 是所有不小于下界的值中最小者：若它大于 ``upper``，后面每个值都更大；若它不大于
``upper``，它本身已经满足闭区间条件。因而一次迭代器查询覆盖了整个值域，不需要向前后线性扫描。

``std::set`` 而不是 ``std::multiset`` 也足够：如果窗口里已经存在相同值，当前值的允许区间必然包含它，查询会立即返回；只有在
未找到合法配对时才插入，所以到达插入语句的路径上窗口没有两个会形成答案的重复值。删除一个过期值不会误删仍在窗口中的同值代表。

方案取舍与代码分析
~~~~~~~~~~~~~~~~~~

暴力枚举最容易验证但为每个下标对重复检查；排序不能直接使用，因为窗口随扫描移动，频繁删除和插入会破坏一次性排序；
哈希分桶可以把值域划分成宽度 ``valueDiff+1`` 的桶，期望线性时间，但负数整除、桶内邻居和溢出边界使状态更复杂。
主解使用有序集合，以 ``O(log w)`` 的确定性操作直接表达“窗口内的值域区间查询”，其中 ``w`` 是窗口大小。

删除索引使用 ``index > indexDiff``，正好在当前元素与最旧保留元素的距离已经超过限制时移除它。查询在插入前进行，
让状态永远表示“历史元素”而不是包括当前元素的候选集合；宽类型转换发生在减法之前，而不是得到溢出结果后再转换。

复杂度与边界
~~~~~~~~~~~~

窗口大小 ``w <= min(n,indexDiff)``。每个元素至多一次查找、插入和删除，每次为 ``O(log w)``，总时间 ``O(n log w)``，
额外空间 ``O(w)``。``indexDiff=0`` 没有两个不同下标可配对；``valueDiff=0`` 退化为窗口内精确重复检测；负值、最大最小整数
通过 ``long long`` 区间计算处理，不会因溢出把一个极远的值误判为相近。
