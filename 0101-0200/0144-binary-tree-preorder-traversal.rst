0144. Binary Tree Preorder Traversal
====================================

题目信息
--------

:题号: 0144. 二叉树的前序遍历
:难度: Easy
:主题: 二叉树、深度优先搜索、显式栈、Morris 线索化
:原题: `LeetCode 0144 <https://leetcode.com/problems/binary-tree-preorder-traversal/>`_
:重点: 从递归的根左右顺序提取待处理子树状态，再用临时回边进一步消除栈并保证树结构恢复

题目重述
--------

给定二叉树根节点 ``root``，返回前序遍历结果。对每棵非空子树，先访问根节点，再完整遍历左子树，最后完整
遍历右子树；每个结构节点访问一次，即使节点值相同也要分别输出。空树返回空数组。

自建示例
--------

* ``root = [6, 2, 9, null, 4, 7, null]``：访问顺序为 ``6, 2, 4, 9, 7``；
* 只有右链 ``1 -> 2 -> 3``：每个节点没有左子树，结果为 ``[1, 2, 3]``；
* 空树返回 ``[]``，单节点树返回只含根值的数组。

C++ 实现
--------

.. code-block:: cpp

   #include <stack>
   #include <vector>

   class Solution {
   private:
       void recursivePreorder(
           TreeNode* node,
           std::vector<int>& result
       ) {
           if (node == nullptr) {
               return;
           }
           result.push_back(node->val);
           recursivePreorder(node->left, result);
           recursivePreorder(node->right, result);
       }

       std::vector<int> preorderWithStack(TreeNode* root) {
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

               if (node->right != nullptr) {
                   pending.push(node->right);
               }
               if (node->left != nullptr) {
                   pending.push(node->left);
               }
           }
           return result;
       }

       std::vector<int> preorderWithMorrisThreads(TreeNode* root) {
           std::vector<int> result;
           TreeNode* current = root;

           while (current != nullptr) {
               if (current->left == nullptr) {
                   result.push_back(current->val);
                   current = current->right;
                   continue;
               }

               TreeNode* predecessor = current->left;
               while (predecessor->right != nullptr &&
                      predecessor->right != current) {
                   predecessor = predecessor->right;
               }

               if (predecessor->right == nullptr) {
                   result.push_back(current->val);
                   predecessor->right = current;
                   current = current->left;
               } else {
                   predecessor->right = nullptr;
                   current = current->right;
               }
           }
           return result;
       }

   public:
       std::vector<int> preorderTraversal(TreeNode* root) {
           return preorderWithStack(root);
       }
   };

题解
----

递归为什么天然得到前序
~~~~~~~~~~~~~~~~~~~~~~

``recursivePreorder`` 进入非空节点后立即记录根值，随后依次调用左、右孩子。函数调用栈隐式保存了尚未处理
的工作：进入左子树时，当前节点的右子树和返回位置仍留在栈帧中。每个节点只有唯一父路径，因此无需访问
集合；空指针分支只表示没有子树，不产生输出。

这种写法最贴近定义，时间 ``O(n)``，但高度为 ``h`` 的树需要 ``O(h)`` 调用栈。要改成迭代，必须显式保存
相同的“已经发现但尚未访问的子树根”。

显式栈的不变量与压入顺序
~~~~~~~~~~~~~~~~~~~~~~~~

``pending`` 中保存待执行前序遍历的子树根，栈顶是下一棵应处理的子树。弹出 ``node`` 时先输出它，完成
“根”；随后把孩子加入待处理集合。由于栈后进先出，必须先压右孩子、再压左孩子，左孩子才会下一次弹出：

.. code-block:: text

   弹出 root，输出 root
   压入 root.right
   压入 root.left
   下一次弹出 root.left

当左子树继续压入自己的节点时，它们始终位于原右子树之上，所以完整左子树会先完成。若反过来先压左再压
右，得到的是根、右、左，不是前序。

具体走读待处理栈
~~~~~~~~~~~~~~~~

对 ``[6, 2, 9, null, 4, 7, null]``，栈顶写在右侧：

.. list-table::
   :header-rows: 1

   * - 弹出并输出
     - 压栈动作
     - 操作后待处理栈
   * - ``6``
     - 先 ``9``，后 ``2``
     - ``[9, 2]``
   * - ``2``
     - 只有右孩子 ``4``
     - ``[9, 4]``
   * - ``4``
     - 无孩子
     - ``[9]``
   * - ``9``
     - 压左孩子 ``7``
     - ``[7]``
   * - ``7``
     - 无孩子
     - 空

输出恰为 ``6, 2, 4, 9, 7``。这里栈保存的是待访问节点，不是已访问节点，也不需要额外阶段标记，因为前序
在第一次遇到根时就输出。

如何连显式栈也省掉
~~~~~~~~~~~~~~~~~~

处理一个有左子树的节点后，遍历必须在左子树结束时回到当前节点，再进入右子树。递归栈和显式栈都在保存
这个“返回当前节点”的续点。Morris 遍历利用左子树最右节点 ``predecessor`` 原本为空的 ``right``，临时
令它指回 ``current``，把返回地址编码进树的空指针。

第一次找到 ``predecessor->right == nullptr`` 时，说明当前根尚未处理：前序应立刻输出根，建立临时回边，
再进入左孩子。以后沿左子树遍历到最右端，会通过回边重新到达 ``current``；第二次查找发现
``predecessor->right == current``，说明左子树已经完成，此时删除回边并进入原右子树，根不能再次输出。

没有左孩子的节点可直接输出并走右边。这个右指针可能是真实右孩子，也可能是祖先建立的临时线索；两种
情况都代表前序中的正确下一步。

临时修改为何不会破坏树
~~~~~~~~~~~~~~~~~~~~~~

每条 Morris 线索只写入原本为空的 ``predecessor->right``，并且同一当前节点第二次到达时立即恢复为空。
正常遍历结束后所有线索都成对建立和删除，原树结构完全恢复。寻找前驱会沿部分右链两次，但每条相关边只
被常数次经过，总时间仍为 ``O(n)``，不是嵌套循环表面上的 ``O(n^2)``。

主解选择与复杂度
~~~~~~~~~~~~~~~~

公开入口采用显式栈：时间 ``O(n)``，工作空间最坏 ``O(h)`` 至 ``O(n)``，不修改输入树，状态也最易审查。
递归版同为 ``O(h)`` 栈但更简洁；Morris 版将输出数组之外的空间降为 ``O(1)``，代价是遍历期间暂时改变
指针，对只读、并发访问或可能中途异常退出的环境不合适。三种方案分别展示隐式续点、显式续点和树内续点，
具有真实的状态演进。
