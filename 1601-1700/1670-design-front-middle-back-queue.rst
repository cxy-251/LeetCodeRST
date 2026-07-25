1670. Design Front Middle Back Queue
===================================

题目信息
--------

:题号: 1670
:难度: Medium
:主题: 设计题、双端队列
:原题: `LeetCode 1670 <https://leetcode.com/problems/design-front-middle-back-queue/>`_
:重点: 偶数长度时中间插入位于前半末尾之后，中间删除取两个中间元素中靠前者

题目重述
--------

实现支持在队首、中间、队尾插入和删除的队列。删除空队列时返回 ``-1``，各次方法调用共享队列状态。

自建示例
--------

.. code-block:: text

   输入：["FrontMiddleBackQueue","pushFront","pushBack","pushMiddle","popMiddle"], [[],[1],[3],[2],[]]
   输出：[null,null,null,null,2]
   解释：队列变为 [1,2,3]，中间元素为 2。

.. code-block:: text

   输入：["FrontMiddleBackQueue","popFront"], [[],[]]
   输出：[null,-1]
   解释：空队列删除失败。