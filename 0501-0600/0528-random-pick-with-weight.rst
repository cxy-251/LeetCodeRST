0528. Random Pick with Weight
=============================

题目信息
--------

:题号: 0528
:难度: Medium
:主题: 权重数组、随机下标、概率比例、对象调用
:原题: `LeetCode 0528 <https://leetcode.com/problems/random-pick-with-weight/>`_
:重点: 返回零基下标、每个下标概率等于其权重占总权重的比例、重复调用相互独立

题目重述
--------

使用正整数数组 ``w`` 初始化一个对象。每次调用 ``pickIndex()`` 时，随机返回一个零基下标 ``i``，其被选中的概率应为 ``w[i] / sum(w)``。

所有权重都为正，因此每个下标都有非零概率。概率按下标而不是按权重值分组；即使两个位置权重相同，它们仍是两个独立结果。对象在多次调用中保持同一组权重。

自建示例
--------

三个下标具有不同概率：

.. code-block:: text

   输入：w = [1,3,2]
   输出：pickIndex() 可返回 0、1 或 2
   解释：总权重为 6，三个下标的返回概率分别为 1/6、1/2 和 1/3。

相同权重等概率：

.. code-block:: text

   输入：w = [4,4]
   输出：pickIndex() 返回 0 或 1
   解释：两个下标各占总权重的一半，因此概率均为 1/2。

前缀权重把概率变成整数区间
--------------------------

把权重累加成前缀和，例如 ``[1,3,2]`` 对应区间 ``[1]``、``[2..4]``、``[5..6]``。在 ``1..total`` 中均匀抽取一个整数，再用 ``lower_bound`` 找到第一个前缀和不小于它的下标；第 ``i`` 个下标恰好占有 ``w[i]`` 个整数。

权重只在构造时建立，后续调用不改变前缀数组，随机抽取彼此独立。

C++ 实现
--------

.. code-block:: cpp

   class Solution {
       std::vector<long long> prefix;
       std::mt19937 generator{std::random_device{}()};

   public:
       Solution(std::vector<int>& w) {
           long long total = 0;
           for (int weight : w) {
               total += weight;
               prefix.push_back(total);
           }
       }

       int pickIndex() {
           std::uniform_int_distribution<long long> distribution(
               1, prefix.back());
           long long value = distribution(generator);
           return static_cast<int>(std::lower_bound(
               prefix.begin(), prefix.end(), value) - prefix.begin());
       }
   };

代码分析
--------

前缀区间长度与权重一一对应，均匀抽取整数后落入下标 ``i`` 的概率为 ``w[i]/total``。构造时间和空间复杂度为 ``O(n)``，每次查询二分耗时 ``O(log n)``，额外查询空间为 ``O(1)``。
