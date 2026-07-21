下一次接续任务
============

当前目标
--------

处理 ``0116. Populating Next Right Pointers in Each Node``。

* 目标文件：``0101-0200/0116-populating-next-right-pointers-in-each-node.rst``；
* 文件类型：公开算法题完整题解；
* 当前状态：目标文件已存在，执行全文审查与整改；
* 完成后下一入口：``0117. Populating Next Right Pointers in Each Node II``。

本轮工作
--------

#. 核对完美二叉树前提、层尾空指针和原地修改；
#. 在 C++ 中实现队列 BFS、递归镜像连接和常数空间层链遍历；
#. 推导同父孩子连接与跨父孩子连接；
#. 使用三层完美树展示 ``5 -> 6`` 的跨父链接；
#. 解释已建 ``next`` 链如何成为下一轮横向通道；
#. 分析层宽、递归栈和常数额外空间并完成九语言实现；
#. 让正文在 R 实现结束。

本轮完成条件
------------

#. 第一百一十六题形成“当前层已有 next 链 → 同父连接 → 跨父连接 → 下一层链完整”的推导链；
#. 完成后入口推进到 ``0117. Populating Next Right Pointers in Each Node II``；
#. 第一百一十六题与新的 ``PROGRESS.rst`` 组成一个原子提交。
