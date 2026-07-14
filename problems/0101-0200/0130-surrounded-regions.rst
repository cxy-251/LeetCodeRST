0130. Surrounded Regions
========================

题目信息
--------

:题号: 0130
:难度: Medium
:主题: 网格、广度优先搜索、连通分量、原地修改
:原题: `LeetCode 0130 <https://leetcode.com/problems/surrounded-regions/>`_
:访问状态: Available
:教学重点: 边界连通补集、入队即标记、两阶段改写

题目重述
--------

给定只含 ``X`` 和 ``O`` 的矩形网格。若一个 ``O`` 连通区域没有接触网格边界，
把该区域全部改成 ``X``；与边界连通的 ``O`` 必须保留。相邻关系只包含上下左右。

算法
----

真正需要保留的是所有“从边界能够到达的 ``O``”。先从四条边上的 ``O`` 启动 BFS，
并在入队时改成临时标记 ``#``；C++ 版本使用等价的递归 DFS 标记。搜索结束后：

* 剩余 ``O`` 与边界不连通，改成 ``X``；
* 临时标记 ``#`` 属于安全区域，恢复成 ``O``。

这把“判断哪些区域被包围”转化为“标记其补集”。

正确性
~~~~~~

边界上的 ``O`` 显然不能被包围。BFS 沿四方向访问，恰好标记所有与某个边界 ``O``
处于同一连通分量的单元格，因此所有 ``#`` 都必须保留，且所有必须保留的 ``O`` 都会被标记。

搜索后仍为 ``O`` 的单元格不与边界连通，其整个连通分量无法到达边界，所以被 ``X`` 包围。
最终翻转和恢复因此得到唯一正确网格。

复杂度
~~~~~~

每个单元格至多处理一次，时间 ``O(mn)``。BFS 队列最坏 ``O(mn)``；C++ 的递归栈最坏
``O(mn)``。除 R 适配器返回新矩阵外，其余实现原地修改输入网格。

核心语言实现
------------

.. include:: 0130-surrounded-regions-code-1.inc

.. include:: 0130-surrounded-regions-code-2.inc

.. include:: 0130-surrounded-regions-code-3.inc

.. include:: 0130-surrounded-regions-code-4.inc

.. include:: 0130-surrounded-regions-code-5.inc

.. include:: 0130-surrounded-regions-code-6.inc

.. include:: 0130-surrounded-regions-code-7.inc

.. include:: 0130-surrounded-regions-code-8.inc

.. include:: 0130-surrounded-regions-code-9.inc

.. include:: 0130-surrounded-regions-code-10.inc

关键边界
--------

* 空网格或零列网格无需处理；
* 单行、单列网格的所有 ``O`` 都在边界上，不会被翻转；
* 入队时立即标记，避免同一单元格重复入队；
* 临时标记必须在第二次扫描中恢复；
* 对角线不构成连通。

最小自检
---------

#. 为什么从边界出发比逐个判断内部区域更直接？
#. 为什么入队时就要标记？
#. 搜索结束后仍为 ``O`` 为什么一定可翻转？
