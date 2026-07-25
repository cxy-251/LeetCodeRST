1443. Minimum Time to Collect All Apples in a Tree
==================================================

题目信息
--------

:题号: 1443
:难度: Medium
:主题: 树、深度优先搜索、子树统计
:原题: `LeetCode 1443 <https://leetcode.com/problems/minimum-time-to-collect-all-apples-in-a-tree/>`_
:重点: 从节点 ``0`` 出发，经过一条边耗时一秒，收集全部苹果后必须返回节点 ``0``；只需往返包含苹果的分支

题目重述
--------

给定一棵包含 ``n`` 个节点的无向树，节点编号为 ``0`` 到 ``n-1``，``edges`` 给出边，``hasApple[i]`` 表示节点 ``i`` 是否有苹果。

从节点 ``0`` 出发，沿边移动，每条边耗时一秒。收集所有苹果后必须回到节点 ``0``。请返回完成任务所需的最少时间。

``1 <= n <= 10^5``，``edges.length == n - 1``，输入保证构成一棵树。

自建示例
--------

最深苹果所在路径上的边都需往返：

.. code-block:: text

   输入：n = 3, edges = [[0,1],[1,2]], hasApple = [false,false,true]
   输出：4
   解释：需要经过两条边到达节点 2，再沿原路返回，共四秒。

没有任何苹果时无需移动：

.. code-block:: text

   输入：n = 2, edges = [[0,1]], hasApple = [false,false]
   输出：0
   解释：起点已经满足收集全部苹果的要求。