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

叶节点短路，递归合并四个象限
------------------------------

若任一输入区域是值为 1 的叶节点，整个结果区域必为 1；若一方是值为 0 的叶节点，结果直接等于另一方。只有两方都非叶时才递归计算四个象限，随后检查四个结果是否都是相同值的叶节点，若是则压缩回一个叶节点。

C++ 实现
--------

.. code-block:: cpp

   class Solution {
   public:
       Node* intersect(Node* first, Node* second) {
           if (first->isLeaf) {
               return first->val ? new Node(true, true) : second;
           }
           if (second->isLeaf) {
               return second->val ? new Node(true, true) : first;
           }

           Node* result = new Node(false, false);
           result->topLeft = intersect(first->topLeft, second->topLeft);
           result->topRight = intersect(first->topRight, second->topRight);
           result->bottomLeft = intersect(first->bottomLeft,
                                          second->bottomLeft);
           result->bottomRight = intersect(first->bottomRight,
                                           second->bottomRight);

           Node* children[4] = {
               result->topLeft, result->topRight,
               result->bottomLeft, result->bottomRight
           };
           bool merge = true;
           for (int i = 0; i < 4; ++i) {
               if (!children[i]->isLeaf ||
                   children[i]->val != children[0]->val) {
                   merge = false;
                   break;
               }
           }
           if (merge) {
               return new Node(children[0]->val, true);
           }
           return result;
       }
   };

代码分析
--------

叶节点规则直接对应区域逐格 OR 的恒等关系，非叶区域递归覆盖四个互不重叠象限；四叶合并保持表示的语义不变并压缩结构。每对对应节点最多处理一次，时间复杂度为 ``O(q)``，额外递归空间为 ``O(h)``，其中 ``q`` 为两树展开后的对应节点规模。
