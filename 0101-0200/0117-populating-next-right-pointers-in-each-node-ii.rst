0117. Populating Next Right Pointers in Each Node II
===================================================

题目信息
--------

:题号: 0117. 填充每个节点的下一个右侧节点指针 II
:难度: Medium
:主题: 一般二叉树、层序遍历、横向链、虚拟头节点
:原题: `LeetCode 0117 <https://leetcode.com/problems/populating-next-right-pointers-in-each-node-ii/>`_
:重点: 固定孩子公式在稀疏树中失效后，改为扫描当前层并按出现顺序串联下一层所有非空孩子

题目重述
--------

给定一棵普通二叉树的根节点 ``root``。每个节点还有一个 ``next`` 指针，需要令它指向同一层紧邻的右侧
非空节点；本层最右节点的 ``next`` 必须为 ``nullptr``。树可以任意缺少左孩子或右孩子，完成后返回原根。

树中节点总数在 ``0..6000`` 范围内，节点值在 ``-100..100`` 范围内。进阶目标是只使用常量额外空间，
不能用与层宽成正比的辅助队列作为最终方案。

自建示例
--------

* 跨过空孩子：``root = [8,4,12,null,6,10,null,5,null,null,11]``，用 ``#`` 表示层尾时，结果为
  ``[8,#,4,12,#,6,10,#,5,11,#]``；
* 只有右孩子：``root = [1,null,2,null,3]``，每层只有一个节点，三个 ``next`` 都应为空；
* 单节点：``root = [7]``，返回原节点且 ``next == nullptr``；
* 空树：``root = []``，返回 ``nullptr``。

C++ 实现
--------

.. code-block:: cpp

   #include <queue>

   class Solution {
   private:
       Node* connectWithQueue(Node* root) {
           if (!root) {
               return nullptr;
           }
           std::queue<Node*> pending;
           pending.push(root);
           while (!pending.empty()) {
               const int levelSize = static_cast<int>(pending.size());
               Node* previous = nullptr;
               for (int count = 0; count < levelSize; ++count) {
                   Node* node = pending.front();
                   pending.pop();
                   if (previous) {
                       previous->next = node;
                   }
                   previous = node;
                   if (node->left) {
                       pending.push(node->left);
                   }
                   if (node->right) {
                       pending.push(node->right);
                   }
               }
               previous->next = nullptr;
           }
           return root;
       }

       Node* connectWithExistingLevels(Node* root) {
           if (!root) {
               return nullptr;
           }
           root->next = nullptr;
           Node* levelStart = root;
           while (levelStart) {
               Node dummy(0);
               Node* tail = &dummy;
               for (Node* current = levelStart; current; current = current->next) {
                   if (current->left) {
                       tail->next = current->left;
                       tail = tail->next;
                   }
                   if (current->right) {
                       tail->next = current->right;
                       tail = tail->next;
                   }
               }
               tail->next = nullptr;
               levelStart = dummy.next;
           }
           return root;
       }

   public:
       Node* connect(Node* root) {
           return connectWithExistingLevels(root);
       }
   };

题解
----

通用队列基线
~~~~~~~~~~~~

``connectWithQueue`` 按层弹出节点，用 ``previous`` 把当前节点接在本层上一个节点之后，层末显式连接空指针；
同时按左、右顺序把非空孩子加入下一层。层大小快照保证连接不会跨越深度。

这版对任意二叉树都正确，因为队列显式保存了下一层所有实际节点及其左右顺序。代价是最大层宽为 ``w`` 时，
需要 ``O(w)`` 辅助空间。要达到常量空间，必须让已经写入树中的 ``next`` 自己承担横向遍历通道。

固定公式失效
~~~~~~~~~~~~

完美树中可以固定连接 ``current.left -> current.right``，再连接
``current.right -> current.next.left``。普通树中三处节点都可能缺失：当前父节点可能只有一个孩子，右侧
相邻父节点也可能没有左孩子，最近的下一层节点甚至位于若干父节点之后。

因此问题不再是计算两个固定字段，而是：沿当前层从左到右扫描所有父节点，把遇到的非空孩子按“每个父节点
先左后右”的顺序组成一条新链。这个孩子序列恰好就是下一层从左到右的实际节点序列，空槽位自然被跳过。

虚拟头与链尾
~~~~~~~~~~~~

``connectWithExistingLevels`` 使用栈上的虚拟节点 ``dummy`` 和指针 ``tail`` 构造下一层：

.. code-block:: text

   tail->next = child
   tail = child

``tail`` 初始指向 ``dummy``，所以第一个非空孩子自动写入 ``dummy.next``；后续孩子依次接到真实链尾，不必
为“这是第一个孩子”单独分支。当前层扫描完后，``dummy.next`` 是下一层起点，``tail->next = nullptr``
明确封闭层尾。

若当前层全是叶节点，没有发现任何孩子，``tail`` 仍指向虚拟节点，置空操作让 ``dummy.next`` 保持空，
随后 ``levelStart`` 变为空并结束。虚拟节点只在当前循环栈帧中辅助构链，不会进入返回树。

逐层不变量
~~~~~~~~~~

处理某层前，该层已由 ``next`` 从 ``levelStart`` 连到层尾空指针。根层通过显式设置 ``root->next = nullptr``
建立基础情况。内层沿这条链扫描父节点并完成下一层；外层再令 ``levelStart = dummy.next``，复用刚生成的链。

每个非空孩子只会在其唯一父节点处被发现一次。父节点顺序从左到右，同一父节点先追加左孩子再追加右孩子，
所以新链既不重复也不遗漏，并保持层内顺序。算法只沿本轮已经重建完成的当前层链移动，不会依赖下一层节点
原有的旧 ``next`` 值。

稀疏层走读
~~~~~~~~~~

对 ``[8,4,12,null,6,10,null,5,null,null,11]``：

.. list-table::
   :header-rows: 1

   * - 当前层父节点
     - 发现的非空孩子
     - 构造中的下一层链
   * - 8
     - 4、12
     - ``4 -> 12``
   * - 4
     - 6
     - ``6``
   * - 12
     - 10
     - ``6 -> 10``
   * - 6
     - 5
     - ``5``
   * - 10
     - 11
     - ``5 -> 11``

节点 ``5`` 与 ``11`` 的父节点之间存在多个空孩子位置，但构链只处理实际节点，因此它们直接成为同层相邻
节点。每轮结束再写层尾空指针，得到 ``5 -> 11 -> null``。

主解与复杂度
~~~~~~~~~~~~

公开入口采用虚拟头与链尾方案。与队列法相比，队列中的“下一层节点序列”被直接写进节点的 ``next`` 字段；
状态只剩当前层起点、当前父节点、虚拟头和链尾几个指针。

每个节点作为孩子追加一次，并在下一轮作为父节点扫描一次，时间 ``O(n)``。队列基线空间 ``O(w)``；主解
除节点已有的 ``next`` 字段外只用常数个指针，额外空间 ``O(1)``。所有修改发生在原节点上。
