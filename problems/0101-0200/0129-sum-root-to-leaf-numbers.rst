0129. Sum Root to Leaf Numbers
==============================

题目信息
--------

:题号: 0129
:难度: Medium
:主题: 二叉树、深度优先搜索、路径状态
:原题: `LeetCode 0129 <https://leetcode.com/problems/sum-root-to-leaf-numbers/>`_
:访问状态: Available
:教学重点: 十进制前缀累积、叶节点结算、只读遍历

题目重述
--------

二叉树每个节点保存一个十进制数字。每条根到叶路径按顺序组成一个整数，
返回所有根到叶整数之和。例如路径 ``1 -> 2 -> 3`` 表示 ``123``。
树非空，节点值位于 ``0`` 到 ``9``，输入树只读。

算法
----

深度优先遍历时携带当前前缀 ``prefix``。进入值为 ``digit`` 的节点后：

.. code-block:: text

   current = prefix * 10 + digit

若当前节点是叶节点，``current`` 就是一条完整路径对应的整数；否则递归计算左右子树并相加。
调用 ``dfs(node, prefix)`` 时，``prefix`` 始终表示从根到 ``node`` 父节点的数字序列。

正确性
~~~~~~

乘十为旧数字腾出个位，再加当前数字，因此 ``current`` 正确表示根到当前节点的路径。
叶节点贡献该完整整数。非叶节点的完整路径要么进入左子树，要么进入右子树，二者互不重叠；
递归结果相加恰好覆盖当前子树的全部根到叶路径。

复杂度
~~~~~~

每个节点访问一次，时间 ``O(n)``。递归栈 ``O(h)``，其中 ``h`` 是树高；输入树不修改。

核心语言实现
------------

.. include:: 0129-sum-root-to-leaf-numbers-code-1.inc

.. include:: 0129-sum-root-to-leaf-numbers-code-2.inc

.. include:: 0129-sum-root-to-leaf-numbers-code-3.inc

.. include:: 0129-sum-root-to-leaf-numbers-code-4.inc

.. include:: 0129-sum-root-to-leaf-numbers-code-5.inc

.. include:: 0129-sum-root-to-leaf-numbers-code-6.inc

.. include:: 0129-sum-root-to-leaf-numbers-code-7.inc

关键边界
--------

* 单节点树直接返回根节点数字；
* 前导零自然保留路径语义，例如 ``0 -> 1`` 表示 ``1``；
* 只有左右孩子都为空时才结算；
* 前缀通过参数传递，不需要回溯恢复，也不会修改树节点。

最小自检
--------

#. 为什么更新公式是 ``prefix * 10 + digit``？
#. 为什么空子树返回 ``0``？
#. 为什么必须在真正叶节点处结算？
