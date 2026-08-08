0116. Populating Next Right Pointers in Each Node
=================================================

题目信息
--------

:题号: 0116. 填充每个节点的下一个右侧节点指针
:难度: Medium
:主题: 完美二叉树、层序遍历、横向链、常量空间
:原题: `LeetCode 0116 <https://leetcode.com/problems/populating-next-right-pointers-in-each-node/>`_
:重点: 从队列保存整层，推导出完美树的同父与跨父两类连接，并复用已建立的 next 链遍历下一层父节点

题目重述
--------

给定一棵完美二叉树的根节点 ``root``。每个节点除 ``left``、``right`` 外还有 ``next`` 指针，需要把它设置
为同一层紧邻的右侧节点；每层最右节点的 ``next`` 必须为 ``nullptr``。完成后返回原根节点。

完美二叉树中，每个非叶节点恰有两个孩子，所有叶节点位于同一深度。树中节点总数在
``0..2^12 - 1`` 范围内，节点值在 ``-1000..1000`` 范围内。进阶目标是只使用常量额外空间。

自建示例
--------

* 三层完美树：``root = [10,4,16,2,6,14,18]``，按 ``#`` 表示层尾时，连接结果为
  ``[10,#,4,16,#,2,6,14,18,#]``；
* 跨父连接：上例第三层中 ``6.next`` 必须指向 ``14``，不能只连接同一父节点的两个孩子；
* 单节点：``root = [7]``，``7.next`` 为 ``nullptr``；
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

       Node* connectPerfectTree(Node* root) {
           if (!root) {
               return nullptr;
           }
           root->next = nullptr;
           for (Node* leftmost = root; leftmost->left; leftmost = leftmost->left) {
               for (Node* current = leftmost; current; current = current->next) {
                   current->left->next = current->right;
                   current->right->next = current->next ? current->next->left : nullptr;
               }
           }
           return root;
       }

   public:
       Node* connect(Node* root) {
           return connectPerfectTree(root);
       }
   };

题解
----

队列保存层边界
~~~~~~~~~~~~~~

最直接的正确方法是层序遍历。``connectWithQueue`` 在每轮开始时固定当前层大小，按从左到右顺序弹出节点；
``previous`` 保存本层上一个节点，当前节点到达时令 ``previous->next = node``，层结束后把最后节点连接到空。

队列保证不同深度不会混合，每层相邻节点恰好在连续两次弹出中出现，所以所有 ``next`` 都会设置一次。这个
方案适用于任意二叉树，时间 ``O(n)``，但为了知道当前节点右边是谁，队列最多保存一整层 ``O(w)`` 个节点。

完美树的新信息
~~~~~~~~~~~~~~

完美树让下一层的相邻关系只有两种。对当前层父节点 ``current``：

.. code-block:: text

   同父孩子：current.left.next  = current.right
   跨父孩子：current.right.next = current.next.left

第二条只在 ``current->next`` 存在时成立；当前父节点若是层尾，它的右孩子也是下一层层尾，应连接
``nullptr``。完美树保证每个正在处理的父节点都有左右孩子，也保证右侧相邻父节点必有左孩子，因此不需要
搜索“下一个实际存在的孩子”。

这两类关系覆盖全部相邻对：下一层任意两个相邻节点要么共享父节点，要么分别是两个相邻父节点的右孩子与
左孩子。队列中保存整层的目的可以改由当前层已经建立的 ``next`` 链承担。

逐层复用横向链
~~~~~~~~~~~~~~

``connectPerfectTree`` 处理某层前保持不变量：该层已经通过 ``next`` 从左到右完整连接，层尾指向空。根层
只有一个节点，显式设置 ``root->next = nullptr`` 后满足基础情况。

内层循环从 ``leftmost`` 开始，沿 ``current = current->next`` 访问当前层全部父节点，同时用上面的两条
规则建立下一层。处理完成后，下一层也形成完整横向链；外层令 ``leftmost = leftmost->left``，进入下一层
最左节点。到达叶层时 ``leftmost->left`` 为空，不再尝试访问孩子。

因此算法并非在使用尚未构造的 ``next``：当前层链在上一轮已经完成，当前轮只写下一层。这个先后关系是
常量空间方案成立的核心不变量。

连接走读
~~~~~~~~

对 ``[10,4,16,2,6,14,18]``：

.. list-table::
   :header-rows: 1

   * - 当前父节点
     - 同父连接
     - ``current.next``
     - 跨父或层尾连接
   * - 10
     - ``4 -> 16``
     - 空
     - ``16 -> null``
   * - 4
     - ``2 -> 6``
     - 16
     - ``6 -> 14``
   * - 16
     - ``14 -> 18``
     - 空
     - ``18 -> null``

处理根后，第二层已有 ``4 -> 16 -> null``，于是下一轮可以从 ``4`` 横向走到 ``16``。在 ``4`` 处通过
``4.next.left`` 找到 ``14``，正好完成跨父连接 ``6 -> 14``。

分支与主解选择
~~~~~~~~~~~~~~

代码始终主动写根和每层尾部的空指针，使结果不依赖节点原有 ``next`` 内容。内层两次赋值顺序可以交换，
因为读取的是当前层父节点的 ``next``，写入的是下一层孩子的 ``next``，两者不冲突。

公开入口采用完美树常量空间方案，因为题目保证正好消除了寻找缺失孩子的需求；队列法仍作为从层序定义出发
的通用基线。若树不是完美树，``current->next->left`` 可能为空甚至不存在，当前两条固定规则便不足以覆盖
下一层，不能直接套用。

复杂度分析
~~~~~~~~~~

两种方法都处理每个节点常数次，时间 ``O(n)``。队列法工作空间 ``O(w)``；主解只保存 ``leftmost``、
``current`` 等常数个指针，额外空间 ``O(1)``。所有连接写入原节点，返回值只是原根指针。
