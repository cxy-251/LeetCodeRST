0156. Binary Tree Upside Down
=============================

题目信息
--------

:题号: 0156. 上下翻转二叉树
:难度: Medium
:主题: 二叉树、指针重连、递归返回、迭代状态压缩
:原题: `LeetCode 0156 <https://leetcode.com/problems/binary-tree-upside-down/>`_
:重点: 沿最左链确定新主干，把原右兄弟与原父节点分别接为新左右孩子，并在重连前保存未处理方向

题目重述
--------

给定一棵满足特殊结构的二叉树：每个非空右孩子都是叶节点，并且一定有同父的左兄弟。把树上下翻转，使
原树最左侧叶节点成为新根；对原左链上的每组关系，原节点的右孩子变成其左孩子的新左孩子，原节点本身
变成其左孩子的新右孩子。返回翻转后的根节点。

允许原地修改节点指针。空树返回空，只有一个节点时返回该节点。

自建示例
--------

.. code-block:: text

       1                  4
      / \                / \
     2   3      ->       5   2
    / \                    / \
   4   5                  3   1

层序输入 ``[1,2,3,4,5]`` 翻转后可表示为 ``[4,5,2,null,null,3,1]``。原最左叶 ``4`` 成为根；对原节点
``2``，它的右孩子 ``5`` 成为 ``4`` 的左孩子，``2`` 成为 ``4`` 的右孩子。

C++ 实现
--------

.. code-block:: cpp

   class Solution {
   private:
       TreeNode* flipAfterReachingLeftmost(TreeNode* root) {
           if (root == nullptr || root->left == nullptr) {
               return root;
           }

           TreeNode* newRoot = flipAfterReachingLeftmost(root->left);
           TreeNode* originalLeft = root->left;
           originalLeft->left = root->right;
           originalLeft->right = root;
           root->left = nullptr;
           root->right = nullptr;
           return newRoot;
       }

       TreeNode* flipAlongLeftSpine(TreeNode* root) {
           TreeNode* current = root;
           TreeNode* originalParent = nullptr;
           TreeNode* originalRightSibling = nullptr;

           while (current != nullptr) {
               TreeNode* nextLeft = current->left;
               TreeNode* nextRight = current->right;

               current->left = originalRightSibling;
               current->right = originalParent;

               originalParent = current;
               originalRightSibling = nextRight;
               current = nextLeft;
           }
           return originalParent;
       }

   public:
       TreeNode* upsideDownBinaryTree(TreeNode* root) {
           return flipAlongLeftSpine(root);
       }
   };

题解
----

先确定翻转真正作用在哪条路径
~~~~~~~~~~~~~~~~~~~~~~~~~~~~

新根不是任意叶节点，而是从原根连续走 ``left`` 到达的最左节点。原左链
``root -> left -> left -> ...`` 会反向成为新树的右主干。对左链上的每条父子边，原父节点还有一个受结构
约束的右孩子；翻转后这两个旧关系固定映射为：

.. code-block:: text

   originalLeft.left  = originalParent.right
   originalLeft.right = originalParent

题目的右孩子限制很重要：右侧是与左孩子成对的叶节点，可以作为这一层整体搬到新左边；不存在任意右子树
还要递归翻转或选择落点的问题。原始搜索空间因此不是对所有边决定方向，而是沿唯一左链逐层执行固定重连。

为什么应先到达最左节点再回接
~~~~~~~~~~~~~~~~~~~~~~~~~~~~

递归方案 ``flipAfterReachingLeftmost`` 先处理 ``root->left``。终止条件是空树或没有左孩子；根据题目结构，
没有左孩子时也不会独自存在右孩子，所以该节点就是新根。

递归返回时，左侧更深部分已经翻转完，但当前 ``root`` 与原左孩子的引用仍可取得。此时把当前原右孩子接到
``originalLeft->left``，把当前原父节点接到 ``originalLeft->right``。每一层都返回同一个最左叶
``newRoot``，最终公开调用取得新根。

旧父节点的两条边为何必须清空
~~~~~~~~~~~~~~~~~~~~~~~~~~~~

重连后 ``originalLeft->right = root`` 已建立从新主干向旧父节点的边。若仍保留 ``root->left`` 指向
``originalLeft``，两个节点会互相指向形成环；原 ``root->right`` 又已经迁移成新左孩子，保留它会让同一
节点有两个父引用。代码因此把旧父节点的 ``left``、``right`` 都设为空，表示这一层原边已经消费完。

具体递归走读
~~~~~~~~~~~~

对示例 ``1``、``2``、``4`` 组成的左链：

.. list-table::
   :header-rows: 1

   * - 返回层
     - 新连接
     - 清除旧连接
   * - 到达 ``4``
     - ``4`` 暂作新根
     - 无需改动
   * - 返回原父 ``2``
     - ``4.left=5``、``4.right=2``
     - ``2.left=null``、``2.right=null``
   * - 返回原父 ``1``
     - ``2.left=3``、``2.right=1``
     - ``1.left=null``、``1.right=null``

注意第二次使用的是节点对象 ``2``：上一层已把它的旧孩子清空，所以现在可以安全承载来自原父 ``1`` 的
新左右关系。

如何把递归帧压缩成三个滚动指针
~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

递归返回时一层需要知道“当前节点的原父节点”和“原父节点的右孩子”。迭代法从根沿左链向下时直接携带：

* ``current``：这一轮将成为新主干节点；
* ``originalParent``：``current`` 的原父节点，将成为它的新右孩子；
* ``originalRightSibling``：原父节点的右孩子，将成为它的新左孩子。

在覆盖 ``current->left``、``current->right`` 前，必须先保存 ``nextLeft``、``nextRight``。``nextLeft`` 是
尚未处理的下一主干节点；``nextRight`` 会在下一轮成为它的 ``originalRightSibling``。若直接改写后再读，
原树后续路径或右兄弟就会丢失。

.. list-table::
   :header-rows: 1

   * - ``current``
     - 进入时携带
     - 改写后
   * - ``1``
     - 父、右兄弟均为空
     - ``1.left=null``、``1.right=null``；保存 ``2``、``3``
   * - ``2``
     - ``originalParent=1``、``originalRightSibling=3``
     - ``2.left=3``、``2.right=1``；保存 ``4``、``5``
   * - ``4``
     - ``originalParent=2``、``originalRightSibling=5``
     - ``4.left=5``、``4.right=2``；下一左节点为空

循环结束时，``originalParent`` 正是最后处理的最左节点 ``4``，也就是新根。

正确性、主解选择与复杂度
~~~~~~~~~~~~~~~~~~~~~~~~

每轮对左链一层执行题目规定的唯一映射：原右兄弟成为新左孩子，原父成为新右孩子；保存的下一左指针保证
所有层都会处理，清除/覆盖旧边保证节点不会重复或成环。右孩子本来都是叶子，作为整体只迁移一次；所以
节点集合不变，最终结构与定义一致。

递归与迭代都只沿树高 ``h`` 的左链处理一次，时间 ``O(h)``，在该结构下也不超过 ``O(n)``。递归使用
``O(h)`` 调用栈，状态含义最接近自底向上回接；公开入口选择迭代版本，将这些帧压缩为三个滚动指针，工作
空间 ``O(1)``，但对赋值顺序的要求更严格。
