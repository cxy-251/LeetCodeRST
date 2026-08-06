0099. Recover Binary Search Tree
================================

题目信息
--------

:题号: 0099
:难度: Medium
:主题: 二叉搜索树、中序遍历、显式栈、Morris 遍历
:原题: `LeetCode 0099 <https://leetcode.com/problems/recover-binary-search-tree/>`_
:重点: 从中序逆序对定位两个错误节点，再用 Morris 遍历压缩辅助空间

题目重述
--------

一棵原本合法的二叉搜索树中，恰好有两个不同节点的值被交换。恢复这棵树，使它重新满足二叉搜索树的严格大小关系。

只能交换节点值，不能改变任何父子连接。题目保证输入中确实存在两个被交换的节点。

树的节点数在 ``2..1000`` 范围内，节点值处于 32 位有符号整数范围内。

自建示例
--------

.. code-block:: text

   输入（层序）：[4,6,2,1,3,5,7]
   中序序列：[1,6,3,4,5,2,7]
   恢复后：[4,2,6,1,3,5,7]

交换值 2 和 6 后，中序序列出现 ``6 > 3`` 与 ``5 > 2`` 两次下降。第一次下降的左端是 6，最后一次下降的右端是 2。

.. code-block:: text

   输入（层序）：[3,1,2]
   中序序列：[1,3,2]
   恢复后：[2,1,3]

交换的两个值在正确中序序列中相邻，因此只出现一次下降 ``3 > 2``。

.. code-block:: text

   输入（层序）：[2,3,1]
   中序序列：[3,2,1]
   恢复后：[2,1,3]

扫描到 ``3 > 2`` 时记录第一个错误节点 3，扫描到 ``2 > 1`` 时把第二个错误节点更新为 1。

C++ 实现
--------

.. code-block:: cpp

   #include <algorithm>
   #include <vector>

   class Solution {
   private:
       void collectInorder(TreeNode* node, std::vector<TreeNode*>& nodes) {
           if (!node) return;
           collectInorder(node->left, nodes);
           nodes.push_back(node);
           collectInorder(node->right, nodes);
       }

       void recordInversion(TreeNode* node, TreeNode*& previous,
                            TreeNode*& first, TreeNode*& second) {
           if (previous && previous->val > node->val) {
               if (!first) first = previous;
               second = node;
           }
           previous = node;
       }

       void nodeArray(TreeNode* root) {
           std::vector<TreeNode*> nodes;
           collectInorder(root, nodes);

           TreeNode* first = nullptr;
           TreeNode* second = nullptr;
           for (int index = 1; index < static_cast<int>(nodes.size()); ++index) {
               if (nodes[index - 1]->val > nodes[index]->val) {
                   if (!first) first = nodes[index - 1];
                   second = nodes[index];
               }
           }
           std::swap(first->val, second->val);
       }

       void explicitStack(TreeNode* root) {
           std::vector<TreeNode*> stack;
           TreeNode* current = root;
           TreeNode* previous = nullptr;
           TreeNode* first = nullptr;
           TreeNode* second = nullptr;

           while (current || !stack.empty()) {
               while (current) {
                   stack.push_back(current);
                   current = current->left;
               }
               current = stack.back();
               stack.pop_back();
               recordInversion(current, previous, first, second);
               current = current->right;
           }
           std::swap(first->val, second->val);
       }

       void morrisTraversal(TreeNode* root) {
           TreeNode* current = root;
           TreeNode* previous = nullptr;
           TreeNode* first = nullptr;
           TreeNode* second = nullptr;

           while (current) {
               if (!current->left) {
                   recordInversion(current, previous, first, second);
                   current = current->right;
                   continue;
               }

               TreeNode* predecessor = current->left;
               while (predecessor->right && predecessor->right != current) {
                   predecessor = predecessor->right;
               }

               if (!predecessor->right) {
                   predecessor->right = current;
                   current = current->left;
               } else {
                   predecessor->right = nullptr;
                   recordInversion(current, previous, first, second);
                   current = current->right;
               }
           }
           std::swap(first->val, second->val);
       }

   public:
       void recoverTree(TreeNode* root) {
           morrisTraversal(root);
       }
   };

题解
----

中序序列
~~~~~~~~

合法二叉搜索树的中序序列严格递增。树的结构没有改变，只有两个节点值交换，因此可以把问题转化为：在一个严格递增序列中交换两个元素后，定位这两个元素并换回。

直接收集中序节点后，无需重新排序全部值。只要扫描相邻节点，找到所有满足 ``previous.val > current.val`` 的下降位置即可。

异常端点
~~~~~~~~

设原递增序列中的较小错误值为 ``x``，较大错误值为 ``y``。

当二者相邻时，交换后只有一个下降：

.. code-block:: text

   ..., y, x, ...
        ^  ^
      first second

当二者不相邻时，交换后通常有两个下降：

.. code-block:: text

   ..., y, ..., a, ..., b, ..., x, ...
        ^       ^         ^       ^
      first   第一次下降  最后一次下降 second

统一记录规则如下：

.. code-block:: text

   遇到 previous > current：
       first 只在第一次下降时取 previous
       second 在每次下降时都更新为 current

一次下降时，两个端点就是相邻的错误值。两次下降时，第一次下降的左端是被提前放置的较大值，最后一次下降的右端是被推后的较小值。

数组扫描
~~~~~~~~

最直接的方法先递归收集中序节点，再扫描相邻对。它已经把“排序所有值”的 ``O(n log n)`` 工作缩减为一次 ``O(n)`` 扫描，但仍保存了全部节点，额外空间为 ``O(n)``。

这一步明确了真正需要保留的状态只有三个节点引用：中序前驱 ``previous``、第一个错误节点 ``first`` 和第二个错误节点 ``second``。

流式中序
~~~~~~~~

显式栈能够按中序顺序逐个产生节点。当前节点一旦与 ``previous`` 比较完成，除非它成为新的前驱，否则不再需要保存；因此不必构造完整中序数组。

栈中保存的是左子树尚未访问完的祖先。每个节点入栈、出栈各一次，检测下降的逻辑与数组扫描完全相同，时间 ``O(n)``，辅助空间 ``O(h)``，其中 ``h`` 为树高。

Morris 线索
~~~~~~~~~~

Morris 遍历进一步用临时线索替代显式栈。当前节点有左子树时，找到左子树最右节点 ``predecessor``：

.. code-block:: text

   predecessor.right 为空：建立 predecessor.right = current，进入左子树
   predecessor.right 指向 current：删除线索，访问 current，进入右子树

第一次到达当前节点时建立返回路径，第二次通过线索返回时才按中序访问它。每条临时边都会在离开左子树时恢复为 ``nullptr``，最终树结构与输入完全一致。

节点交换
~~~~~~~~

题目保证错误只来自两个节点值互换，所以扫描结束后只交换 ``first->val`` 与 ``second->val``。父子连接从未改变，修复后的中序序列恢复严格递增，整棵树重新满足二叉搜索树条件。

复杂度
~~~~~~

三种方法都只需一次中序扫描，时间 ``O(n)``。节点数组方法使用 ``O(n)`` 空间，显式栈使用 ``O(h)`` 空间，Morris 方法除输出外使用 ``O(1)`` 额外空间。
