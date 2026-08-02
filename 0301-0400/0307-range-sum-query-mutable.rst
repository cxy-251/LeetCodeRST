0307. Range Sum Query - Mutable
===============================

题目信息
--------

:题号: 0307
:难度: Medium
:主题: 数组、可变对象、单点更新、区间和
:原题: `LeetCode 0307 <https://leetcode.com/problems/range-sum-query-mutable/>`_
:重点: 更新会改变后续查询状态、区间包含两个端点、同一对象支持交错调用

题目重述
--------

实现 ``NumArray`` 类。构造函数接收整数数组 ``nums``；``update(index, val)`` 把下标 ``index`` 的元素替换为 ``val``；``sumRange(left, right)`` 返回当前数组中闭区间 ``[left, right]`` 的元素总和。

数组长度位于 ``[1, 3 * 10^4]``，初始元素及更新值均位于 ``[-100, 100]``。更新下标始终有效，查询满足 ``0 <= left <= right < nums.length``。``update`` 与 ``sumRange`` 的总调用次数不超过 ``3 * 10^4``；每次更新都必须影响之后在同一对象上执行的查询。

自建示例
--------

查询与更新交错发生：

.. code-block:: text

   输入：NumArray([4, -1, 6])
        sumRange(0, 2)
        update(1, 5)
        sumRange(0, 2)
        sumRange(1, 1)
   输出：9
        null
        15
        5
   解释：更新把数组从 [4,-1,6] 改为 [4,5,6]；后两次查询都必须读取更新后的值。

用树状数组同时维护更新与查询
------------------------------

不可变版本的前缀和不再适用：修改下标 ``index`` 后，所有右侧前缀都要重新计算。这里使用树状数组（Fenwick tree）保存若干个“低位区间和”。它支持两种互为配合的操作：把某个位置增加一个差值，以及求从下标 0 到某位置的前缀和；两者都只沿树状数组的一条路径移动，时间为 ``O(log n)``。

对象中同时保存当前数组 ``nums``。执行 ``update(index, val)`` 时，先计算 ``delta = val - nums[index]``，把数组中的旧值改成新值，再把这个差值加入树状数组。这样后续的区间查询读到的就是更新后的状态。闭区间和仍由两个前缀和相减得到。

C++ 实现
--------

.. code-block:: cpp

   class NumArray {
       int n;
       std::vector<int> nums;
       std::vector<long long> tree;

       void add(int index, long long delta) {
           for (int i = index + 1; i <= n; i += i & -i) {
               tree[i] += delta;
           }
       }

       long long prefixSum(int index) const {
           long long result = 0;
           for (int i = index + 1; i > 0; i -= i & -i) {
               result += tree[i];
           }
           return result;
       }

   public:
       NumArray(std::vector<int>& values)
           : n(static_cast<int>(values.size())),
             nums(values), tree(n + 1, 0) {
           for (int i = 0; i < n; ++i) {
               add(i, nums[i]);
           }
       }

       void update(int index, int val) {
           long long delta = static_cast<long long>(val) - nums[index];
           nums[index] = val;
           add(index, delta);
       }

       int sumRange(int left, int right) const {
           long long result = prefixSum(right);
           if (left > 0) result -= prefixSum(left - 1);
           return static_cast<int>(result);
       }
   };

代码分析
--------

树状数组使用一位偏移的内部下标，避免了原数组下标 0 在 ``i & -i`` 中没有有效低位的问题。更新数组副本和树状数组必须同步，否则同一次对象上的交错调用会产生错误结果。构造时间为 ``O(n log n)``，每次更新和区间查询均为 ``O(log n)``，额外空间为 ``O(n)``。
