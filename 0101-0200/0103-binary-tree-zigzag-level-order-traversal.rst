0103. Binary Tree Zigzag Level Order Traversal
==============================================

题目信息
--------

:题号: 0103. 二叉树的锯齿形层序遍历
:难度: Medium
:主题: 二叉树、广度优先搜索、队列、下标映射
:原题: `LeetCode 0103 <https://leetcode.com/problems/binary-tree-zigzag-level-order-traversal/>`_
:重点: 分离节点发现顺序与行内输出顺序，再把奇数层反转压缩为目标下标映射

题目重述
--------

给定二叉树根节点 ``root``，逐层返回所有节点值，但相邻层的行内方向必须交替：深度 ``0`` 从左到右，
深度 ``1`` 从右到左，深度 ``2`` 再从左到右，依此类推。

每个深度单独形成一个子数组，结果只包含实际存在的节点，不为空孩子保留占位。空树返回空数组；遍历过程
不修改树。

树中节点总数在 ``0..2000`` 范围内，节点值在 ``-100..100`` 范围内。

自建示例
--------

* 多层稀疏树：``root = [8,4,12,2,6,10,14,null,3]``，返回
  ``[[8],[12,4],[2,6,10,14],[3]]``；
* 反向层含缺口：``root = [1,2,3,null,5,null,7]``，返回 ``[[1],[3,2],[5,7]]``。第二层反向输出，
  第三层恢复从左到右，空孩子不占位置；
* 单节点：``root = [9]``，返回 ``[[9]]``，方向切换不会产生额外空行；
* 空树：``root = []``，返回 ``[]``。

C++ 实现
--------

.. code-block:: cpp

   #include <algorithm>
   #include <queue>
   #include <utility>
   #include <vector>

   class Solution {
   private:
       std::vector<std::vector<int>> collectThenReverse(TreeNode* root) {
           if (!root) {
               return {};
           }
           std::vector<std::vector<int>> levels;
           std::queue<TreeNode*> pending;
           pending.push(root);
           bool leftToRight = true;
           while (!pending.empty()) {
               const int levelSize = static_cast<int>(pending.size());
               std::vector<int> level;
               level.reserve(levelSize);
               for (int count = 0; count < levelSize; ++count) {
                   TreeNode* node = pending.front();
                   pending.pop();
                   level.push_back(node->val);
                   if (node->left) {
                       pending.push(node->left);
                   }
                   if (node->right) {
                       pending.push(node->right);
                   }
               }
               if (!leftToRight) {
                   std::reverse(level.begin(), level.end());
               }
               levels.push_back(std::move(level));
               leftToRight = !leftToRight;
           }
           return levels;
       }

       std::vector<std::vector<int>> writeToTargetPositions(TreeNode* root) {
           if (!root) {
               return {};
           }
           std::vector<std::vector<int>> levels;
           std::queue<TreeNode*> pending;
           pending.push(root);
           bool leftToRight = true;
           while (!pending.empty()) {
               const int levelSize = static_cast<int>(pending.size());
               std::vector<int> level(levelSize);
               for (int index = 0; index < levelSize; ++index) {
                   TreeNode* node = pending.front();
                   pending.pop();
                   const int targetIndex = leftToRight ? index : levelSize - 1 - index;
                   level[targetIndex] = node->val;
                   if (node->left) {
                       pending.push(node->left);
                   }
                   if (node->right) {
                       pending.push(node->right);
                   }
               }
               levels.push_back(std::move(level));
               leftToRight = !leftToRight;
           }
           return levels;
       }

   public:
       std::vector<std::vector<int>> zigzagLevelOrder(TreeNode* root) {
           return writeToTargetPositions(root);
       }
   };

题解
----

两个顺序
~~~~~~~~

锯齿形要求同时处理两个不同的顺序：先确定哪些节点属于当前层，再决定这些节点在当前行中的排列方向。
前者是节点发现顺序，后者是结果写入顺序。若把两者混在一起，反向层很容易破坏下一层的自然位置关系。

例如根的左右孩子为 ``4``、``12``。深度 ``1`` 应输出 ``[12,4]``，但深度 ``2`` 仍要先考虑 ``4`` 的
孩子，再考虑 ``12`` 的孩子。当前行从右向左展示，不表示下一层也应先从右侧父节点扩展。

因此搜索空间仍按普通层序遍历划分：队列始终保存尚未处理的最浅节点，每轮固定当前层大小，父节点从左到右
出队，每个父节点也始终先加入左孩子、再加入右孩子。锯齿方向只作用于当前行，不作用于树的扩展顺序。

先收集再反转
~~~~~~~~~~~~

最直接的正确方案是先生成普通层序结果，再把深度为奇数的行反转。``collectThenReverse`` 将这两个阶段合并到
同一次 BFS 中：每层先按队列顺序写入 ``level``，若 ``leftToRight`` 为假，再反转整行。

这个方案不会漏节点。层大小快照保证一行只接收同一深度的节点；普通 BFS 保证反转前的顺序为从左到右；
对整行反转恰好得到从右到左。方向状态在整行完成后才切换，因此同一层内不会处理中途改变规则。

瓶颈不是渐进复杂度：所有被反转的行合计也只有不超过 ``n`` 个元素，时间仍为 ``O(n)``。多出的工作是
奇数层先按错误的最终方向写一遍，再扫描并交换一遍。题目已经告诉我们当前层的目标方向，可以在首次写入时
直接放到最终位置。

目标下标映射
~~~~~~~~~~~~

队列按从左到右的自然顺序弹出当前层节点。设层大小为 ``levelSize``，当前弹出序号为 ``index``，其中
``0 <= index < levelSize``。最终写入位置为：

.. code-block:: text

   从左到右：targetIndex = index
   从右到左：targetIndex = levelSize - 1 - index

第二个公式把序号 ``0,1,...,levelSize-1`` 映射为逆序的
``levelSize-1,...,1,0``。它是同一组下标上的一一映射，所以每个节点值恰好写入一个槽位，每个槽位也恰好
接收一个值，不需要插入、移动或反转。

``writeToTargetPositions`` 先把 ``level`` 预分配为当前层大小，再按方向计算 ``targetIndex``。与直觉法相比，
队列、层大小快照和孩子入队逻辑全部不变；只把“尾部追加后反转”替换为“直接写入最终下标”。这正是锯齿
要求带来的最小状态变化。

状态走读
~~~~~~~~

对 ``[8,4,12,2,6,10,14,null,3]``，每层开始时的队列仍保持自然的从左到右顺序：

.. list-table::
   :header-rows: 1

   * - 深度
     - 队列中的当前层
     - ``leftToRight``
     - 写入下标
     - 当前行
     - 下一层队列
   * - 0
     - ``[8]``
     - ``true``
     - ``[0]``
     - ``[8]``
     - ``[4,12]``
   * - 1
     - ``[4,12]``
     - ``false``
     - ``[1,0]``
     - ``[12,4]``
     - ``[2,6,10,14]``
   * - 2
     - ``[2,6,10,14]``
     - ``true``
     - ``[0,1,2,3]``
     - ``[2,6,10,14]``
     - ``[3]``
   * - 3
     - ``[3]``
     - ``false``
     - ``[0]``
     - ``[3]``
     - ``[]``

深度 ``1`` 中，``4`` 先出队却写入下标 ``1``，``12`` 后出队写入下标 ``0``；与此同时，孩子仍由 ``4``
开始按左、右方向入队，所以深度 ``2`` 的队列保持 ``[2,6,10,14]``。单节点层的正序和逆序映射都只有
下标 ``0``，不会成为特殊情况。

分支与主解选择
~~~~~~~~~~~~~~

空树在建立队列前返回 ``{}``。非空树中，``levelSize`` 必须在处理本层前保存，否则新入队的孩子会混入
当前行。左右孩子分支只决定哪些实际节点进入下一层，不加入空占位；方向分支只选择写入下标。三类状态各自
承担一个职责，互不污染。

公开入口采用 ``writeToTargetPositions``。它与反转法具有相同的线性复杂度，但每个节点值只写入最终位置
一次，不需要额外的奇数层扫描。双端队列头插也能避免反转，却要再把双端队列转换为返回所需的 ``vector``，
没有比下标映射带来新的状态认识，因此不再保留为第三种实现。

复杂度分析
~~~~~~~~~~

两种方法都让每个节点入队、出队一次，时间为 ``O(n)``；反转法对奇数层的额外扫描总量仍为 ``O(n)``。
队列最多保存一层与下一层的部分节点，工作空间为 ``O(w)``，其中 ``w`` 是最大层宽。每层向量最终属于返回
结果，全部行合计保存 ``n`` 个值，其 ``O(n)`` 空间不计入工作空间。
