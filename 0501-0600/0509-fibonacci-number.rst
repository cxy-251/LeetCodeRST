0509. Fibonacci Number
======================

题目信息
--------

:题号: 0509
:难度: Easy
:主题: 递推序列、两个基例、非负下标
:原题: `LeetCode 0509 <https://leetcode.com/problems/fibonacci-number/>`_
:重点: F(0)=0、F(1)=1、从 F(2) 起等于前两项之和、输入是序列下标

题目重述
--------

斐波那契数列定义为 ``F(0) = 0``、``F(1) = 1``，并且对所有 ``n >= 2``，有 ``F(n) = F(n - 1) + F(n - 2)``。给定整数 ``n``，返回 ``F(n)``。

``n`` 位于 ``[0, 30]``。需要特别保留 ``n = 0`` 和 ``n = 1`` 两个基例；返回的是第 ``n`` 项的数值，而不是前 ``n`` 项列表。

自建示例
--------

普通递推项：

.. code-block:: text

   输入：n = 7
   输出：13
   解释：数列从 F(0) 开始依次为 0、1、1、2、3、5、8、13，因此 F(7)=13。

零下标基例：

.. code-block:: text

   输入：n = 0
   输出：0
   解释：定义直接规定 F(0)=0。

只保留相邻两项
--------------

递推关系在计算第 ``i`` 项时只需要前两项，因此不必保存完整数组。初始化 ``a = F(0)``、``b = F(1)``，每轮令新项为 ``a + b``，再向前移动两个变量；``n`` 为 0 或 1 时直接返回定义值。

C++ 实现
--------

.. code-block:: cpp

   class Solution {
   public:
       int fib(int n) {
           if (n < 2) return n;
           int previous = 0;
           int current = 1;
           for (int i = 2; i <= n; ++i) {
               int next = previous + current;
               previous = current;
               current = next;
           }
           return current;
       }
   };

代码分析
--------

循环不变量是 ``previous = F(i-2)``、``current = F(i-1)``，更新后得到下一项且不改变定义基例。时间复杂度为 ``O(n)``，额外空间复杂度为 ``O(1)``。
