下一次接续任务
============

当前目标
--------

处理 ``0105. Construct Binary Tree from Preorder and Inorder Traversal``。

* 目标文件：``0101-0200/0105-construct-binary-tree-from-preorder-and-inorder-traversal.rst``；
* 文件类型：公开算法题完整题解；
* 当前状态：目标文件已存在，执行全文审查与整改；
* 完成后下一入口：``0106. Construct Binary Tree from Inorder and Postorder Traversal``。

本轮工作
--------

#. 核对值互异、遍历数组一致性和返回新树；
#. 在 C++ 中实现切片分治、区间分治和全局前序游标；
#. 用哈希表常数定位根在中序区间的位置；
#. 推导左区间长度与递归顺序；
#. 使用只有左子树或右子树的输入检查边界；
#. 分析构造节点数、哈希表和递归栈并完成九语言实现；
#. 让正文在 R 实现结束。

本轮完成条件
------------

#. 第一百零五题形成“前序首根 → 中序定位 → 左右值域划分 → 先左后右消费前序”的推导链；
#. 完成后入口推进到 ``0106. Construct Binary Tree from Inorder and Postorder Traversal``；
#. 第一百零五题与新的 ``PROGRESS.rst`` 组成一个原子提交。
