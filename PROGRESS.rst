下一次接续任务
============

当前目标
--------

处理 ``0034. Find First and Last Position of Element in Sorted Array``。

* 目标文件：``0001-0100/0034-find-first-and-last-position-of-element-in-sorted-array.rst``；
* 文件类型：公开算法题完整题解；
* 当前状态：目标文件已存在，执行全文审查与整改；
* 完成后下一入口：``0035. Search Insert Position``。

本轮工作
--------

#. 核对非递减数组、重复目标、缺失目标和 ``O(log n)`` 要求；
#. 在 C++ 中实现线性扫描、命中后扩展和两次边界二分；
#. 推导 lower bound、upper bound、半开区间不变量与存在性验证；
#. 使用跟踪表展示重复区间、单次出现、数组边缘和目标缺失；
#. 解释相等值在两种边界中的不同归属；
#. 推导复杂度并完成九语言实现；
#. 让正文在 R 实现结束。

本轮完成条件
------------

#. 第三十四题形成“任意命中不足 → 插入边界 → 两次二分 → 存在性验证”的推导链；
#. 完成后入口推进到 ``0035. Search Insert Position``；
#. 第三十四题与新的 ``PROGRESS.rst`` 组成一个原子提交。