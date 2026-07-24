0715. Range Module
========================================================================================================================

题目信息
--------

:题号: 0715
:难度: Hard
:主题: 设计、半开区间、区间状态
:原题: `LeetCode 0715 <https://leetcode.com/problems/range-module/>`_
:重点: 所有操作作用于实数半开区间 ``[left, right)``；查询要求区间内每一个实数都已被跟踪，对象状态跨调用持续变化

题目重述
--------

实现 ``RangeModule`` 类，用于维护当前被跟踪的实数范围。所有范围都使用半开区间 ``[left, right)``，表示满足 ``left <= x < right`` 的全部实数。

新建对象时没有任何范围被跟踪，并支持以下操作：

* ``addRange(left, right)``：把 ``[left, right)`` 内尚未被跟踪的所有实数加入跟踪范围；
* ``queryRange(left, right)``：仅当 ``[left, right)`` 内每一个实数当前都被跟踪时返回 ``true``，否则返回 ``false``；
* ``removeRange(left, right)``：停止跟踪 ``[left, right)`` 内当前已被跟踪的所有实数。

同一个对象必须在多次调用之间保留范围状态。每次调用都满足 ``1 <= left < right <= 10^9``，三种方法的调用总数最多为 ``10^4``。

自建示例
--------

重叠加入后移除超出左边界的范围：

.. code-block:: text

   输入：
   操作 = ["RangeModule", "addRange", "addRange", "queryRange", "removeRange", "queryRange", "queryRange"]
   参数 = [[], [3,7], [6,10], [4,9], [1,5], [3,6], [5,10]]
   输出：[null, null, null, true, null, false, true]
   解释：两个加入区间合并后覆盖 [3,10)，所以 [4,9) 完全被跟踪。移除 [1,5) 只会实际删除其中已跟踪的 [3,5)，此后 [3,6) 含未跟踪部分而返回 false，[5,10) 仍被完整跟踪。

相邻半开区间可以覆盖完整查询范围：

.. code-block:: text

   输入：
   操作 = ["RangeModule", "addRange", "addRange", "queryRange"]
   参数 = [[], [2,4], [4,7], [2,7]]
   输出：[null, null, null, true]
   解释：[2,4) 与 [4,7) 在边界 4 处首尾相接，二者合起来覆盖 [2,7) 内的每一个实数。