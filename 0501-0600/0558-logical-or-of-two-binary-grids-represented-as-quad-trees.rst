0558. Logical OR of Two Binary Grids Represented as Quad-Trees
==============================================================

题目信息
--------

:题号: 0558
:难度: Medium
:主题: 四叉树、二进制网格、逐格逻辑或、结构压缩
:原题: `LeetCode 0558 <https://leetcode.com/problems/logical-or-of-two-binary-grids-represented-as-quad-trees/>`_
:重点: 两棵树表示同尺寸网格、结果按逐格 OR 定义、叶节点表示整块同值区域、可合并四个相同叶子

题目重述
--------

给定两棵四叉树 ``quadTree1`` 和 ``quadTree2``，它们分别表示两个尺寸相同的二进制方阵。叶节点的 ``val`` 表示其覆盖区域全部为 ``0`` 或全部为 ``1``，非叶节点通过四个子节点表示四个象限。

对两个原始网格的对应位置执行逻辑或，构造并返回结果网格的四叉树。若某个区域的所有格子在结果中相同，可以用一个叶节点表示；四个子区域都成为相同值叶节点时，允许合并为一个叶节点。

自建示例
--------

一个网格整块为 1：

.. code-block:: text

   输入：quadTree1 是 val=true 的叶节点，quadTree2 表示任意同尺寸网格
   输出：val=true 的叶节点
   解释：1 与任意二进制值执行逻辑或都得到 1，因此整个结果区域均为 1。

一个网格整块为 0：

.. code-block:: text

   输入：quadTree1 是 val=false 的叶节点，quadTree2 表示另一网格
   输出：与 quadTree2 表示相同网格的四叉树
   解释：0 与另一格值执行逻辑或后保持另一格值不变。