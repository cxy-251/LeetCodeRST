0331. Verify Preorder Serialization of a Binary Tree
====================================================

题目信息
--------

:题号: 0331
:难度: Medium
:主题: 栈、字符串、二叉树
:原题: `LeetCode 331 <https://leetcode.com/problems/verify-preorder-serialization-of-a-binary-tree/>`_
:教学重点: 用可用子节点槽位数量验证先序序列，无需真正构建树。

题目重述
--------

给定以逗号分隔的二叉树先序序列，普通值表示非空节点，``#`` 表示空节点。判断该序列是否能完整且无多余节点地描述一棵二叉树。

自建示例
--------

``"9,3,4,#,#,1,#,#,2,#,6,#,#"`` 返回 ``true``；``"1,#"`` 返回 ``false``。
