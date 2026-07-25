1993. Operations on Tree
========================

题目信息
--------

:题号: 1993
:难度: Medium
:主题: 树、设计、搜索
:原题: `LeetCode 1993 <https://leetcode.com/problems/operations-on-tree/>`_
:重点: 支持锁定、解锁与升级，升级要求节点未锁、祖先未锁且至少一个后代已锁

题目重述
--------

实现 ``LockingTree``。用户可锁定未锁节点、解锁自己锁定的节点；升级节点时需满足自身与祖先均未锁、至少一个后代已锁，成功后解锁全部后代并锁定当前节点。

自建示例
--------

.. code-block:: text

   输入：parent = [-1,0,0]；lock(1,10)；upgrade(0,5)
   输出：[null,true,true]
   解释：节点 0 未锁且有已锁后代 1，升级后节点 1 解锁、节点 0 由用户 5 锁定。

.. code-block:: text

   输入：parent = [-1,0]；upgrade(1,7)
   输出：[null,false]
   解释：叶节点 1 没有已锁后代。
