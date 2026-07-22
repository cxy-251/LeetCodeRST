0297. Serialize and Deserialize Binary Tree
===========================================

题目信息
--------

:题号: 0297
:难度: Hard
:主题: 设计、二叉树、序列化、深度优先搜索、广度优先搜索
:原题: `LeetCode 0297 <https://leetcode.com/problems/serialize-and-deserialize-binary-tree/>`_
:教学重点: 空节点标记、结构唯一恢复、对象所有权

题目重述
--------

实现 ``Codec`` 类的 ``string serialize(TreeNode* root)`` 与 ``TreeNode* deserialize(string data)``。序列化结果必须保留节点值和完整拓扑，使反序列化得到结构和值均相同的新树。平台不限制编码格式，但要求两方法互相兼容；空树必须可表示，节点数最多约 ``10^4``。

自建示例
--------

.. code-block:: text

   输入树：层序 [1,2,3,null,4]
   serialize 后再 deserialize
   输出树：[1,2,3,null,4]
   说明：空孩子位置必须被编码。
