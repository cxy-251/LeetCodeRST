1656. Design an Ordered Stream
==============================

题目信息
--------

:题号: 1656
:难度: Easy
:主题: 设计题、数组、指针
:原题: `LeetCode 1656 <https://leetcode.com/problems/design-an-ordered-stream/>`_
:重点: 插入键值后，从当前指针开始返回最长连续已填区间并推进指针

题目重述
--------

实现 ``OrderedStream``，键范围为 ``1..n`` 且每个键只插入一次。``insert(idKey,value)`` 保存值，并返回从当前指针开始连续存在的值列表；若指针位置尚未填充则返回空列表。

自建示例
--------

.. code-block:: text

   输入：["OrderedStream","insert","insert","insert"], [[3],[3,"c"],[1,"a"],[2,"b"]]
   输出：[null,[],["a"],["b","c"]]
   解释：插入 2 后连续区间 2、3 一并输出。

.. code-block:: text

   输入：["OrderedStream","insert"], [[1],[1,"x"]]
   输出：[null,["x"]]
   解释：唯一键立即形成连续区间。