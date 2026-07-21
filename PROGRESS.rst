下一次接续任务
============

当前目标
--------

处理 ``0106. Construct Binary Tree from Inorder and Postorder Traversal``。

* 目标文件：``0101-0200/0106-construct-binary-tree-from-inorder-and-postorder-traversal.rst``；
* 文件类型：公开算法题完整题解；
* 当前状态：目标文件已存在，执行全文审查与整改；
* 完成后下一入口：``0107. Binary Tree Level Order Traversal II``。

本轮工作
--------

#. 核对值互异、后序末尾根和返回新树语义；
#. 在 C++ 中实现切片、显式区间和反向后序游标；
#. 使用中序位置哈希表划分左右值域；
#. 推导反向消费顺序必须先右后左；
#. 与 0105 的前序游标形成对偶；
#. 分析时间、索引表和递归栈并完成九语言实现；
#. 让正文在 R 实现结束。

本轮完成条件
------------

#. 第一百零六题形成“后序尾根 → 中序定位 → 反向游标 → 先右后左构造”的推导链；
#. 完成后入口推进到 ``0107. Binary Tree Level Order Traversal II``；
#. 第一百零六题与新的 ``PROGRESS.rst`` 组成一个原子提交。
