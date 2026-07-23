0449. Serialize and Deserialize BST
===================================

题目信息
--------

:题号: 0449
:难度: Medium
:主题: 二叉搜索树、序列化、反序列化、结构恢复
:原题: `LeetCode 0449 <https://leetcode.com/problems/serialize-and-deserialize-bst/>`_
:重点: 编码格式可自行设计、空树必须可往返、反序列化后结构和值一致、两个方法必须互相兼容

题目重述
--------

设计 ``Codec`` 类，实现 ``serialize(root)`` 和 ``deserialize(data)``。``serialize`` 把一棵二叉搜索树转换为字符串；``deserialize`` 根据该字符串重建一棵与原树节点值和拓扑结构都相同的二叉搜索树。

题目不限制具体字符串格式，只要求编码与解码方法完全兼容，并且编码应尽量紧凑。空树也必须有可识别的表示，并能解码回 ``null``。树中节点数位于 ``[0, 10^4]``，节点值位于 ``[0, 10^4]``，输入保证满足二叉搜索树性质。

自建示例
--------

包含不同形态的左右子树：

.. code-block:: text

   输入树：根节点 8；左孩子 3，右孩子 10；节点 3 的右孩子为 6
   操作：data = serialize(root)，然后 deserialize(data)
   输出：重建树仍具有 8 / 3 / 10 / 6 的相同父子关系
   解释：往返过程不仅要保留节点值集合，还必须恢复原来的树结构。

空树往返：

.. code-block:: text

   输入：root = null
   输出：deserialize(serialize(null)) = null
   解释：空树必须由编码格式明确表示，不能在解码时产生节点。
