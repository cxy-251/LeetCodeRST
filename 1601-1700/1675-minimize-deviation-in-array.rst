1675. Minimize Deviation in Array
=================================

题目信息
--------

:题号: 1675
:难度: Hard
:主题: 贪心、优先队列
:原题: `LeetCode 1675 <https://leetcode.com/problems/minimize-deviation-in-array/>`_
:重点: 偶数可反复除二，奇数可乘二一次；最小化最大值与最小值之差

题目重述
--------

对数组元素执行合法操作任意次，返回最终数组偏差 ``max-min`` 的最小可能值。

自建示例
--------

.. code-block:: text

   输入：nums = [1,2,3,4]
   输出：1
   解释：可得到 [2,2,3,2]，最大值与最小值之差为 1。

.. code-block:: text

   输入：nums = [8]
   输出：0
   解释：单元素数组偏差始终为零。