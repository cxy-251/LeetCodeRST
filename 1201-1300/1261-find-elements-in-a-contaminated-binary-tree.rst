1261. Find Elements in a Contaminated Binary Tree
=================================================

题目信息
--------

:题号: 1261
:难度: Medium
:主题: 设计题、二叉树、值恢复、查询
:原题: `LeetCode 1261 <https://leetcode.com/problems/find-elements-in-a-contaminated-binary-tree/>`_
:重点: 根节点恢复为 ``0``，值为 ``x`` 的节点左右孩子分别恢复为 ``2x+1`` 和 ``2x+2``；对象支持多次 ``find`` 查询

题目重述
--------

一棵二叉树的所有节点值都被污染为 ``-1``。原树满足固定编号规则：根节点值为 ``0``；若节点值为 ``x``，其左孩子存在时值为 ``2x + 1``，右孩子存在时值为 ``2x + 2``。

实现 ``FindElements`` 类，在构造时根据树结构恢复所有节点值。``find(target)`` 判断恢复后的树中是否存在值为 ``target`` 的节点，各次查询共享同一棵恢复后的树。

树中节点数不超过 ``10^4``，树高不超过 ``20``，``0 <= target <= 10^6``，``find`` 调用次数不超过 ``10^4``。

自建示例
--------

根据结构恢复深层节点编号：

.. code-block:: text

   输入：
   ["FindElements","find","find"]
   [[[-1,-1,-1,null,-1]],[4],[3]]
   输出：[null,true,false]
   解释：恢复后树为 [0,1,2,null,4]，其中存在 4，但不存在 3。

单节点树只包含编号零：

.. code-block:: text

   输入：
   ["FindElements","find"]
   [[[-1]],[0]]
   输出：[null,true]
   解释：根节点恢复为 0。