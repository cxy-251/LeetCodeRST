1622. Fancy Sequence
====================

题目信息
--------

:题号: 1622
:难度: Hard
:主题: 设计题、仿射变换、模运算
:原题: `LeetCode 1622 <https://leetcode.com/problems/fancy-sequence/>`_
:重点: 支持追加、全体加法、全体乘法和按下标查询，所有值按 ``10^9+7`` 取模

题目重述
--------

实现 ``Fancy`` 类。``append`` 在末尾加入值，``addAll`` 给当前所有元素加常数，``multAll`` 给当前所有元素乘常数，``getIndex`` 返回指定下标当前值；下标越界返回 ``-1``。

自建示例
--------

.. code-block:: text

   输入：["Fancy","append","addAll","append","multAll","getIndex","getIndex"], [[],[2],[3],[4],[2],[0],[1]]
   输出：[null,null,null,null,null,10,8]
   解释：序列依次变为 [2]、[5]、[5,4]、[10,8]。

.. code-block:: text

   输入：["Fancy","getIndex"], [[],[0]]
   输出：[null,-1]
   解释：空序列没有下标 0。