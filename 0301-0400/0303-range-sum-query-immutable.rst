0303. Range Sum Query - Immutable
=================================

题目信息
--------

:题号: 0303
:难度: Easy
:主题: 数组、区间和、只读对象、多次查询
:原题: `LeetCode 0303 <https://leetcode.com/problems/range-sum-query-immutable/>`_
:重点: 查询区间包含两个端点、构造后数组不再更新、多次调用共享同一对象状态

题目重述
--------

实现 ``NumArray`` 类。构造函数接收整数数组 ``nums`` 并保存其只读数据；之后可以多次调用 ``sumRange(left, right)``，返回下标从 ``left`` 到 ``right`` 的所有元素之和，两个端点都包含在内。

``nums`` 的长度位于 ``[1, 10^4]``，每个元素位于 ``[-10^5, 10^5]``。每次查询都满足 ``0 <= left <= right < nums.length``，调用 ``sumRange`` 的次数不超过 ``10^4``。各次查询基于构造时的同一数组，题目不提供更新操作。

自建示例
--------

连续进行不同范围的查询：

.. code-block:: text

   输入：NumArray([4, -2, 7, 1])
        sumRange(0, 1)
        sumRange(1, 3)
   输出：2
        6
   解释：第一个闭区间包含 4 和 -2；第二个闭区间包含 -2、7 和 1。两次查询都读取构造时的原数组。

单元素区间：

.. code-block:: text

   输入：NumArray([-6, 3, 8])，sumRange(1, 1)
   输出：3
   解释：左右端点相同，区间只包含下标 1 的一个元素。

前缀和把闭区间变成两个边界
--------------------------

数组构造完成后不会再变化，因此没有必要为每一次查询重新累加。定义 ``prefix[i]`` 为前 ``i`` 个元素的和，也就是原数组下标 ``0`` 到 ``i-1`` 的元素之和；``prefix[0]`` 是空前缀，值为零。

对闭区间 ``[left, right]``，``prefix[right + 1]`` 包含了右端点，而 ``prefix[left]`` 恰好包含左端点之前的所有元素。两者相减后，留下的正是 ``left`` 到 ``right``。使用 ``right + 1`` 是处理闭区间边界的关键，单元素区间也自然成立。

C++ 实现
--------

.. code-block:: cpp

   class NumArray {
       std::vector<long long> prefix;

   public:
       NumArray(std::vector<int>& nums)
           : prefix(nums.size() + 1, 0) {
           for (int i = 0; i < static_cast<int>(nums.size()); ++i) {
               prefix[i + 1] = prefix[i] + nums[i];
           }
       }

       int sumRange(int left, int right) {
           return static_cast<int>(prefix[right + 1] - prefix[left]);
       }
   };

代码分析
--------

前缀数组只在构造时建立一次；查询不读取或修改原数组，只通过两个前缀边界相减得到答案。内部使用 ``long long`` 保存累加值，避免把“若干整数相加”的中间结果过早限制在单个元素的类型中。构造时间为 ``O(n)``，每次查询为 ``O(1)``，额外空间为 ``O(n)``。
