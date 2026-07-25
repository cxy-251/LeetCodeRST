1441. Build an Array With Stack Operations
==========================================

题目信息
--------

:题号: 1441
:难度: Medium
:主题: 数组、栈、模拟
:原题: `LeetCode 1441 <https://leetcode.com/problems/build-an-array-with-stack-operations/>`_
:重点: 按顺序读取 ``1`` 到 ``n``，每读一个数必须先 ``Push``；不属于目标时立即 ``Pop``，构造完目标后停止

题目重述
--------

给定严格递增数组 ``target`` 和整数 ``n``。从数据流 ``1,2,...,n`` 依次读取数字，只能执行 ``Push`` 把当前数字压栈，或执行 ``Pop`` 删除栈顶。

请返回一组操作，使最终栈内容按顺序恰好等于 ``target``。一旦目标数组构造完成就停止读取；题目保证答案存在。

``1 <= target.length <= 100``，``1 <= target[i] <= n <= 100``，``target`` 严格递增。

自建示例
--------

跳过的流元素需要先压栈再弹出：

.. code-block:: text

   输入：target = [2,3], n = 4
   输出：["Push","Pop","Push","Push"]
   解释：读取 1 后弹出，随后保留 2 和 3；目标完成后不再读取 4。

目标只包含第一个元素时立即结束：

.. code-block:: text

   输入：target = [1], n = 1
   输出：["Push"]
   解释：第一次压栈后已经得到目标数组。