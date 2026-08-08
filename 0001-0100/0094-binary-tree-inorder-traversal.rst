0094. Binary Tree Inorder Traversal
===================================

题目信息
--------

:题号: 0094. 二叉树的中序遍历
:难度: Easy
:主题: 二叉树、深度优先遍历、显式栈、Morris 遍历
:原题: `LeetCode 0094 <https://leetcode.com/problems/binary-tree-inorder-traversal/>`_
:重点: 从递归控制流推导显式栈，再用中序前驱线索把辅助空间压缩到常数级

题目重述
--------

给定二叉树根节点 ``root``，按照“左子树、根节点、右子树”的顺序返回所有节点值。
空树返回空数组。

树中节点数在 ``0..100`` 范围内，节点值在 ``-100..100`` 范围内。

自建示例
--------

.. code-block:: text

   输入（层序）：[4,2,6,null,3,5,7]
   输出：[2,3,4,5,6,7]

先访问根节点 4 的左子树 ``2,3``，再访问 4，最后访问右子树 ``5,6,7``。

.. code-block:: text

   输入（层序）：[3,2,null,1]
   输出：[1,2,3]

左斜树需要不断深入左侧，随后按从深到浅的顺序访问祖先。

.. code-block:: text

   输入：[]
   输出：[]

空树没有可访问节点。

C++ 实现
--------

.. code-block:: cpp

   #include <vector>

   class Solution {
   private:
       void inorderDfs(TreeNode* node, std::vector<int>& result) {
           if (!node) {
               return;
           }

           inorderDfs(node->left, result);
           result.push_back(node->val);
           inorderDfs(node->right, result);
       }

       std::vector<int> recursiveTraversal(TreeNode* root) {
           std::vector<int> result;
           inorderDfs(root, result);
           return result;
       }

       std::vector<int> explicitStack(TreeNode* root) {
           std::vector<int> result;
           std::vector<TreeNode*> stack;
           TreeNode* current = root;

           while (current || !stack.empty()) {
               while (current) {
                   stack.push_back(current);
                   current = current->left;
               }

               current = stack.back();
               stack.pop_back();
               result.push_back(current->val);
               current = current->right;
           }

           return result;
       }

       std::vector<int> morrisTraversal(TreeNode* root) {
           std::vector<int> result;
           TreeNode* current = root;

           while (current) {
               if (!current->left) {
                   result.push_back(current->val);
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
                   result.push_back(current->val);
                   current = current->right;
               }
           }

           return result;
       }

   public:
       std::vector<int> inorderTraversal(TreeNode* root) {
           return explicitStack(root);
       }
   };

题解
----

递归定义
~~~~~~~~

中序遍历的定义本身就是一个递归过程：先完成左子树，再访问当前节点，最后完成右子树。
递归调用进入左子树时，运行时栈会保存当前节点和返回后的执行位置。

.. code-block:: text

   inorder(left)
   visit(root)
   inorder(right)

这种写法最接近定义，但最大递归深度等于树高。树退化为链时，调用栈需要 ``O(n)`` 空间。

显式保存祖先
~~~~~~~~~~~~

迭代方法把递归栈中“左子树尚未完成，因此当前节点暂时不能访问”的祖先显式保存到 ``stack``。
从 ``current`` 开始不断沿左指针下降，并把途经节点压栈。

当 ``current`` 变为空时，栈顶节点已经没有未处理的左后代，因此它就是下一个应访问的节点：

.. code-block:: text

   沿左链压栈
   弹出栈顶并访问
   转向该节点的右子树

转入右子树后，循环再次展开它的完整左链，于是同一控制流可以处理任意树形。

栈状态不变量
~~~~~~~~~~~~

每次准备弹栈时，栈中从底到顶保存一条祖先路径。对栈顶节点而言：

* 左子树已经全部处理；
* 当前节点尚未输出；
* 右子树尚未处理。

弹出并输出节点后转向其右子树，正好把状态推进到中序遍历的下一阶段。
每个节点只会在沿左链下降时入栈一次，也只会弹出一次，因此不会重复访问。

示例过程
~~~~~~~~

对 ``[4,2,6,null,3,5,7]``，显式栈的关键状态如下：

.. list-table::
   :header-rows: 1

   * - 操作
     - 栈（右端为栈顶）
     - 输出
   * - 沿左链压入 4、2
     - ``[4,2]``
     - ``[]``
   * - 弹出 2，转向 3
     - ``[4]``
     - ``[2]``
   * - 压入并弹出 3
     - ``[4]``
     - ``[2,3]``
   * - 弹出 4，进入右子树
     - ``[]``
     - ``[2,3,4]``
   * - 处理 6 的左节点 5，再处理 6、7
     - ``[]``
     - ``[2,3,4,5,6,7]``

Morris 线索
~~~~~~~~~~~

显式栈保存的是从左子树返回当前节点的路径。Morris 遍历利用左子树中原本为空的右指针，临时建立同样的返回线索。

当前节点存在左子树时，其中序前驱是左子树最右侧节点 ``predecessor``：

* 第一次找到前驱时，令 ``predecessor->right = current``，再进入左子树；
* 第二次沿线索回到当前节点时，恢复 ``predecessor->right = nullptr``，访问当前节点并进入右子树。

没有左子树的节点可以立即访问，因为它已经不存在更早的左侧节点。

结构恢复
~~~~~~~~

每条临时线索只会经历“空指针改为当前节点”和“恢复为空指针”两个阶段。
只有删除线索后才访问当前节点并进入右子树，因此遍历结束时所有被修改的指针都恢复为原值，树结构保持不变。

前驱搜索虽然会沿右链移动，但每条相关边只会在建立和删除线索时经过常数次。
所以 Morris 遍历仍是 ``O(n)`` 时间，并将除结果数组外的辅助空间降为 ``O(1)``。

方案选择
~~~~~~~~

递归方法最接近定义；显式栈不修改树结构，也避免依赖语言调用栈，是通用主解法。
Morris 遍历适合明确要求常数辅助空间的场景，但它会临时修改输入树，控制流和恢复要求更复杂。

复杂度
~~~~~~

三种方法都访问每个节点常数次，时间为 ``O(n)``。
递归与显式栈使用 ``O(h)`` 空间，``h`` 为树高；Morris 遍历除返回结果外使用 ``O(1)`` 空间。
