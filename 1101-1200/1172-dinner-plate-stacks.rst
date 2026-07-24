1172. Dinner Plate Stacks
=========================

题目信息
--------

:题号: 1172
:难度: Hard
:主题: 设计题、栈集合、优先位置
:原题: `LeetCode 1172 <https://leetcode.com/problems/dinner-plate-stacks/>`_
:重点: ``push`` 放入最左侧未满栈，``pop`` 弹出最右侧非空栈，``popAtStack`` 从指定栈弹出；无可弹元素时返回 ``-1``

题目重述
--------

实现 ``DinnerPlates`` 类，维护一列容量都为 ``capacity`` 的栈。``push(val)`` 把值压入当前最左侧尚未满的栈；若现有栈都已满，则在右侧创建新栈。

``pop()`` 从最右侧非空栈弹出并返回栈顶值。``popAtStack(index)`` 从指定编号的栈弹出并返回栈顶值。若对应操作没有可弹出的元素，返回 ``-1``；空的尾部栈不影响后续最右非空栈判断。

``1 <= capacity <= 2 * 10^4``，``1 <= val <= 2 * 10^4``；全部方法调用次数不超过 ``2 * 10^5``。

自建示例
--------

中间空位会被后续压入优先填补：

.. code-block:: text

   输入：
   ["DinnerPlates","push","push","push","popAtStack","push","pop","pop","pop"]
   [[2],[1],[2],[3],[0],[4],[],[],[]]
   输出：[null,null,null,null,2,null,3,4,1]
   解释：弹出第 0 栈的 2 后，push(4) 填入这个最左空位；随后 pop 依次从最右非空栈弹出 3、4、1。

空结构不能弹出元素：

.. code-block:: text

   输入：
   ["DinnerPlates","pop","popAtStack"]
   [[1],[],[0]]
   输出：[null,-1,-1]
   解释：没有任何栈包含元素，两种弹出操作都返回 -1。