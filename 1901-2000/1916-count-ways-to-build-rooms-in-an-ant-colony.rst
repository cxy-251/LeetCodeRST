1916. Count Ways to Build Rooms in an Ant Colony
================================================

题目信息
--------

:题号: 1916
:难度: Hard
:主题: 树、组合数学、拓扑顺序
:原题: `LeetCode 1916 <https://leetcode.com/problems/count-ways-to-build-rooms-in-an-ant-colony/>`_
:重点: 每个房间只能在其父房间建成后施工，统计合法建造顺序

题目重述
--------

``prevRoom[i]`` 表示建造房间 ``i`` 前必须先建成的父房间。房间 0 最先建造，返回满足所有依赖关系的建造顺序数量并取模。

自建示例
--------

.. code-block:: text

   输入：prevRoom = [-1,0,0]
   输出：2
   解释：房间 0 后，房间 1 与 2 可以按任意顺序建造。

.. code-block:: text

   输入：prevRoom = [-1,0,1]
   输出：1
   解释：唯一合法顺序是 0、1、2。
