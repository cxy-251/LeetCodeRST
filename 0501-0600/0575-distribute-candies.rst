0575. Distribute Candies
========================

题目信息
--------

:题号: 0575
:难度: Easy
:主题: 糖果类型、固定分配数量、不同种类、最大化
:原题: `LeetCode 0575 <https://leetcode.com/problems/distribute-candies/>`_
:重点: 糖果总数为偶数、妹妹必须得到恰好一半、同类型可重复、返回最多不同类型数

题目重述
--------

给定偶数长度数组 ``candyType``，每个元素表示一颗糖果的类型。所有糖果要平均分给哥哥和妹妹，因此妹妹会得到恰好 ``candyType.length / 2`` 颗糖果。

在可以自由选择分配方式的前提下，返回妹妹最多能够得到多少种不同类型的糖果。同一类型的多颗糖只贡献一种类型，但仍占用妹妹的糖果数量。

自建示例
--------

种类数多于妹妹可得数量：

.. code-block:: text

   输入：candyType = [1,1,2,3,3,4]
   输出：3
   解释：妹妹只能得到 3 颗糖，可以各选类型 1、2、3 或其他三个不同类型，因此最多有 3 种。

全部糖果同类型：

.. code-block:: text

   输入：candyType = [5,5,5,5]
   输出：1
   解释：妹妹得到两颗糖，但无论如何都只有类型 5。

不同类型数受两个上限约束
------------------------

妹妹最多拿 ``n/2`` 颗糖，因此不同类型数不可能超过这个数量；同时也不可能超过全部糖果中的不同类型总数。只要每种类型至少选一颗，取这两个上限的较小值就能构造出最优分配。

C++ 实现
--------

.. code-block:: cpp

   class Solution {
   public:
       int distributeCandies(std::vector<int>& candyType) {
           std::unordered_set<int> types(candyType.begin(),
                                         candyType.end());
           return std::min(static_cast<int>(types.size()),
                           static_cast<int>(candyType.size() / 2));
       }
   };

代码分析
--------

较小的上限是必要条件，按不同类型各取一颗并用重复糖果填满剩余数量即可达到，因此也是充分条件。时间复杂度为 ``O(n)`` 平均，额外空间复杂度为 ``O(n)``。
