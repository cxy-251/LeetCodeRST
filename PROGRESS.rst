下一次接续任务
============

当前目标
--------

处理 ``0104. Maximum Depth of Binary Tree``。

* 目标文件：``0101-0200/0104-maximum-depth-of-binary-tree.rst``；
* 文件类型：公开算法题完整题解；
* 当前状态：目标文件已存在，执行全文审查与整改；
* 完成后下一入口：``0105. Construct Binary Tree from Preorder and Inorder Traversal``。

本轮工作
--------

#. 核对空树、单节点和按节点数定义的深度；
#. 在 C++ 中实现携带深度 DFS、层序 BFS 和后序递归；
#. 推导 ``1 + max(left,right)``；
#. 使用左右高度不同的树展示后序汇总；
#. 解释退化树的递归栈上界；
#. 分析树高和最大层宽并完成九语言实现；
#. 让正文在 R 实现结束。

本轮完成条件
------------

#. 第一百零四题形成“空树基例 → 左右子树深度 → 后序取最大 → 当前节点加一”的推导链；
#. 完成后入口推进到 ``0105. Construct Binary Tree from Preorder and Inorder Traversal``；
#. 第一百零四题与新的 ``PROGRESS.rst`` 组成一个原子提交。
