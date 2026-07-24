1381. Design a Stack With Increment Operation
=============================================

题目信息
--------

:题号: 1381
:难度: Medium
:主题: 设计题、栈、区间增量
:原题: `LeetCode 1381 <https://leetcode.com/problems/design-a-stack-with-increment-operation/>`_
:重点: 栈容量固定；满栈时 ``push`` 无效，空栈时 ``pop`` 返回 ``-1``，``increment`` 增加最底部若干元素

题目重述
--------

实现 ``CustomStack`` 类。构造函数接收最大容量 ``maxSize``。``push(x)`` 在未满时把 ``x`` 压栈；``pop()`` 弹出并返回栈顶，空栈返回 ``-1``；``increment(k,val)`` 把栈底开始的前 ``min(k,当前大小)`` 个元素都增加 ``val``。

各次方法调用共享同一个栈状态。

``1 <= maxSize <= 1000``，方法调用总数不超过 ``1000``。

自建示例
--------

增量作用于栈底指定数量元素：

.. code-block:: text

   输入：maxSize = 3；push(1)，push(2)，increment(2,5)，pop()，pop()，pop()
   输出：[7,6,-1]
   解释：增量后栈从底到顶为 [6,7]，随后依次弹出。

满栈时额外压入被忽略：

.. code-block:: text

   输入：maxSize = 1；push(4)，push(9)，pop()
   输出：4
   解释：第二次 push 不改变栈。