0114. Flatten Binary Tree to Linked List
=======================================

题目信息
--------

:题号: 0114. 二叉树展开为链表
:难度: Medium
:主题: 二叉树、前序遍历、原地重连、反向递归
:原题: `LeetCode 0114 <https://leetcode.com/problems/flatten-binary-tree-to-linked-list/>`_
:重点: 从保存前序节点序列后重连，推导到反向前序维护后继，再用局部前驱接续实现常量工作空间

题目重述
--------

给定二叉树根节点 ``root``，直接修改原树，把所有节点展开成一条只沿 ``right`` 指针连接的单向链。链中节点
顺序必须与原树的前序遍历“根、左子树、右子树”一致，并且每个节点的 ``left`` 都必须置为 ``nullptr``。

函数不返回新链表，原根仍是展开后链的起点；不能用新建节点替换输入节点。空树无需操作。树中节点总数在
``0..2000`` 范围内，节点值在 ``-100..100`` 范围内。

自建示例
--------

* 左右子树都存在：``root = [8,4,12,2,6,10,null]``，修改后右链为
  ``8 -> 4 -> 2 -> 6 -> 12 -> 10``；
* 左孩子内部仍有左支：``root = [1,2,5,3,null,null,6,4]``，修改后右链为
  ``1 -> 2 -> 3 -> 4 -> 5 -> 6``；
* 单节点：``root = [7]``，节点保持为链首且 ``left == nullptr``；
* 空树：``root = []``，不执行任何重连。

C++ 实现
--------

.. code-block:: cpp

   #include <vector>

   class Solution {
   private:
       void collectPreorder(TreeNode* node, std::vector<TreeNode*>& nodes) {
           if (!node) {
               return;
           }
           nodes.push_back(node);
           collectPreorder(node->left, nodes);
           collectPreorder(node->right, nodes);
       }

       void collectThenRelink(TreeNode* root) {
           std::vector<TreeNode*> nodes;
           collectPreorder(root, nodes);
           for (int index = 0; index < static_cast<int>(nodes.size()); ++index) {
               nodes[index]->left = nullptr;
               nodes[index]->right = index + 1 < static_cast<int>(nodes.size()) ? nodes[index + 1] : nullptr;
           }
       }

       void linkInReversePreorder(TreeNode* node, TreeNode*& next) {
           if (!node) {
               return;
           }
           linkInReversePreorder(node->right, next);
           linkInReversePreorder(node->left, next);
           node->right = next;
           node->left = nullptr;
           next = node;
       }

       void reversePreorderRelink(TreeNode* root) {
           TreeNode* next = nullptr;
           linkInReversePreorder(root, next);
       }

       void predecessorRelink(TreeNode* root) {
           TreeNode* current = root;
           while (current) {
               if (current->left) {
                   TreeNode* predecessor = current->left;
                   while (predecessor->right) {
                       predecessor = predecessor->right;
                   }
                   predecessor->right = current->right;
                   current->right = current->left;
                   current->left = nullptr;
               }
               current = current->right;
           }
       }

   public:
       void flatten(TreeNode* root) {
           predecessorRelink(root);
       }
   };

题解
----

目标序列再重连
~~~~~~~~~~~~~~

最直接的正确方案是先执行前序遍历，把原节点指针依次保存到数组，再按数组顺序重写指针。若数组为
``[p0,p1,...,pk]``，就令每个 ``pi.left = nullptr``、``pi.right = p(i+1)``，最后一个节点右指针为空。

``collectThenRelink`` 将“确定目标顺序”和“修改结构”分成两个阶段。收集期间不改树，所以递归始终能找到
原左右孩子；重连期间只操作已经保存的节点指针，不创建、遗漏或复制节点。这版逻辑清楚，但数组保存了完整
前序序列，使用 ``O(n)`` 工作空间。

原地处理的困难不是前序遍历本身，而是过早覆盖指针会丢失尚未访问的子树。要删除节点数组，必须在修改
``node->right`` 之前，已经有另一种状态能保留它原本应接到的位置。

反向前序后继
~~~~~~~~~~~~

目标链的前序顺序为“根、左、右”。反过来处理就是“右、左、根”。若递归先完成右子树、再完成左子树，
处理当前节点时，变量 ``next`` 已经指向当前节点在最终前序链中的直接后继：有左子树时是左子树根，否则是
右子树根，再否则是此前构造好的更后方节点或空指针。

``linkInReversePreorder`` 因而执行：

.. code-block:: text

   先递归 right
   再递归 left
   node.right = next
   node.left = null
   next = node

右子树先被连成后缀，左子树随后接到这个后缀之前，当前根最后接到最前面。原先需要保存全部节点的数组被
压缩为一个 ``next`` 指针和递归调用栈；调用顺序若改成先左后右，构造出的后继顺序就会颠倒。

局部前驱接续
~~~~~~~~~~~~

还可以不等待递归回溯，而是在当前节点就把局部结构改成前序顺序。若 ``current`` 没有左孩子，它的下一个
前序节点本来就是 ``current->right``，只需沿右链前进。

若左孩子存在，当前节点之后应先访问整棵左子树，原右子树必须排在左子树之后。沿左子树的 ``right`` 指针
找到最右节点 ``predecessor``；它的右指针当前为空，可暂存原右子树入口。三次重连按顺序为：

.. code-block:: text

   predecessor->right = current->right
   current->right = current->left
   current->left = nullptr

第一步必须发生在覆盖 ``current->right`` 之前，否则原右子树入口会丢失。完成后，沿 ``current->right``
首先进入原左子树；该子树以后进行同样重连时，只会把自己的左部分插到已有右后缀之前，不会丢弃后缀，因而
原右子树最终仍位于整个左子树的前序节点之后。

这里的 ``predecessor`` 是当前左子树沿已有右指针能到达的最右节点，不必预先就是左子树最终前序链的末尾。
若它内部还有左支，后续局部重连会把已接上的原右子树继续向后传递。算法依赖的是“空右指针可保存后缀”，
不是错误地假设当前右边界已经完成展平。

重连走读
~~~~~~~~

对 ``[8,4,12,2,6,10,null]``：

.. list-table::
   :header-rows: 1

   * - ``current``
     - 左子树右边界
     - 保存的旧右子树
     - 重连后的局部右链
   * - 8
     - 6
     - 12
     - ``8 -> 4``，且 ``6 -> 12``
   * - 4
     - 2
     - 6
     - ``4 -> 2 -> 6``
   * - 2
     - 无左子树
     - 不变
     - ``2 -> 6``
   * - 6
     - 无左子树
     - 不变
     - ``6 -> 12``
   * - 12
     - 10
     - 空
     - ``12 -> 10``

外层循环每次沿已经形成的 ``right`` 前序链移动。所有左子树都在到达父节点时搬到这条链上，每次搬动后又
清空父节点的 ``left``，所以最终不会跳过节点，也不会留下非空左指针。

主解与复杂度
~~~~~~~~~~~~

公开入口采用前驱接续法，因为它复用原树中的空右指针保存后缀，不需要节点数组或递归栈。输入各子树原本
互不相交，把左子树右边界连接到原右子树不会形成回指祖先的环。

收集后重连时间 ``O(n)``、数组空间 ``O(n)``；反向前序时间 ``O(n)``、递归栈 ``O(h)``。前驱接续中，
外层沿最终右链访问每个节点一次，内层沿右边界的总访问量为线性摊还，时间 ``O(n)``、额外空间 ``O(1)``。
三种方法都只重用原节点，返回结构本身不新增空间。
