0145. Binary Tree Postorder Traversal
=====================================

题目信息
--------

:题号: 0145. 二叉树的后序遍历
:难度: Easy
:主题: 二叉树、深度优先搜索、访问阶段、序列反转
:原题: `LeetCode 0145 <https://leetcode.com/problems/binary-tree-postorder-traversal/>`_
:重点: 识别根节点必须等待两个子树完成的状态，再用根右左序列的整体反转消除显式阶段标记

题目重述
--------

给定二叉树根节点 ``root``，返回后序遍历结果。对每棵非空子树，先完整遍历左子树，再完整遍历右子树，
最后访问根节点。每个结构节点都要输出一次；空树返回空数组。

自建示例
--------

* ``root = [6, 2, 9, null, 4, 7, null]``：结果为 ``[4, 2, 7, 9, 6]``；
* 单节点树 ``[5]``：左右子树都为空，最后输出根，得到 ``[5]``；
* 只有左链 ``3 -> 2 -> 1``：最深节点先返回，结果为 ``[1, 2, 3]``。

C++ 实现
--------

.. code-block:: cpp

   #include <algorithm>
   #include <stack>
   #include <utility>
   #include <vector>

   class Solution {
   private:
       void recursivePostorder(
           TreeNode* node,
           std::vector<int>& result
       ) {
           if (node == nullptr) {
               return;
           }
           recursivePostorder(node->left, result);
           recursivePostorder(node->right, result);
           result.push_back(node->val);
       }

       std::vector<int> postorderWithExpandedFlag(TreeNode* root) {
           std::vector<int> result;
           std::stack<std::pair<TreeNode*, bool>> pending;
           if (root != nullptr) {
               pending.push({root, false});
           }

           while (!pending.empty()) {
               auto [node, childrenExpanded] = pending.top();
               pending.pop();
               if (childrenExpanded) {
                   result.push_back(node->val);
                   continue;
               }

               pending.push({node, true});
               if (node->right != nullptr) {
                   pending.push({node->right, false});
               }
               if (node->left != nullptr) {
                   pending.push({node->left, false});
               }
           }
           return result;
       }

       std::vector<int> reverseRootRightLeft(TreeNode* root) {
           std::vector<int> result;
           if (root == nullptr) {
               return result;
           }

           std::stack<TreeNode*> pending;
           pending.push(root);
           while (!pending.empty()) {
               TreeNode* node = pending.top();
               pending.pop();
               result.push_back(node->val);

               if (node->left != nullptr) {
                   pending.push(node->left);
               }
               if (node->right != nullptr) {
                   pending.push(node->right);
               }
           }
           std::reverse(result.begin(), result.end());
           return result;
       }

   public:
       std::vector<int> postorderTraversal(TreeNode* root) {
           return reverseRootRightLeft(root);
       }
   };

题解
----

后序与前序的关键差异是输出时机
~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

前序第一次遇到节点就能输出；后序必须等左、右子树都完成后才输出根。``recursivePostorder`` 的函数调用栈
不仅保存节点，还隐含当前执行到哪个阶段：左调用返回后还要进右子树，右调用返回后才记录根值。

若迭代时只把节点地址放栈并在弹出时立刻输出，会得到某种根优先顺序，不可能直接满足左右根。显式实现
首先要回答：同一个节点这次出栈，是准备展开孩子，还是孩子已经处理完、可以输出？

方案一：为栈帧增加访问阶段
~~~~~~~~~~~~~~~~~~~~~~~~~~~~

``postorderWithExpandedFlag`` 的栈元素为 ``(node, childrenExpanded)``。首次弹出 ``false`` 状态时不输出，
而是按以下顺序压栈：

.. code-block:: text

   (node, true)
   (node.right, false)
   (node.left, false)

由于后进先出，左子树先处理，右子树随后处理，最后才重新弹出 ``(node, true)`` 并输出根。这正是递归帧
“调用孩子前”与“两个调用都返回后”的显式表示。每个节点入栈两次，但每个阶段只做常数工作。

具体走读根节点的等待状态
~~~~~~~~~~~~~~~~~~~~~~~~

对根 ``6`` 及左右孩子 ``2``、``9``，栈顶写在右侧：

.. list-table::
   :header-rows: 1

   * - 弹出状态
     - 动作
     - 根何时输出
   * - ``(6, false)``
     - 压 ``(6, true)``、``(9, false)``、``(2, false)``
     - 暂不输出
   * - ``(2, false)``
     - 完成其左、右子树后输出 ``2``
     - 根仍在栈底等待
   * - ``(9, false)``
     - 完成其左、右子树后输出 ``9``
     - 根仍未输出
   * - ``(6, true)``
     - 两侧已完成
     - 此时输出 ``6``

这套状态与递归最接近，也能扩展到需要进入/退出事件的树算法。

结构变换：后序是根右左的反序
~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

目标后序为 ``左子树 + 右子树 + 根``。将整个序列反转会得到
``根 + reverse(右子树后序) + reverse(左子树后序)``；递归地看，这恰好是先根、再右子树、最后左子树的
遍历。因此可以先生成 ``根、右、左`` 序列，再原地整体反转，不再为每个节点保存访问阶段。

要让栈弹出顺序是根、右、左，弹出根后必须先压左孩子、再压右孩子；右孩子后入先出。这个压栈顺序与普通
前序的根、左、右正好相反。

为什么必须整体反转而不是只交换孩子
~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

只把前序中的左右顺序交换，会得到根右左，根仍在子树之前。整体反转同时把根移动到最后，并把每棵子树块
内部的根右左递归转换为左右根。它不是层序反转，也不是只反转每层；后序要求完整左子树块位于完整右子树块
之前，只有深度优先序列的整体反转保持这种嵌套关系。

以示例为例，栈先生成：

.. code-block:: text

   根右左：6, 9, 7, 2, 4
   整体反转：4, 2, 7, 9, 6

反转后的每个子树都满足左、右、根。

正确性与主解选择
~~~~~~~~~~~~~~~~

阶段标记法严格模拟递归返回顺序，所以每个节点在两侧完成后输出一次。反序法生成的根右左序列与后序在
整棵树及每个递归子树上互为反序，因此整体反转后同样不重不漏。空树在压栈前直接返回空结果。

公开入口采用根右左加反转：每个节点只压栈一次，代码状态较少；代价是在最终结果上多做一次 ``O(n)``
原地反转。阶段标记法不需要反转，却让每个节点以两种状态入栈，适合不能延迟输出的场景。两者时间均为
``O(n)``、工作栈最坏 ``O(h)`` 至 ``O(n)``；返回数组 ``O(n)`` 不计入工作空间。递归版使用 ``O(h)``
调用栈，作为遍历定义的直接起点保留。
