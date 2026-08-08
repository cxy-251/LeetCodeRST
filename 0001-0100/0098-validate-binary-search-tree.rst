0098. Validate Binary Search Tree
=================================

题目信息
--------

:题号: 0098. 验证二叉搜索树
:难度: Medium
:主题: 二叉搜索树、中序遍历、递归边界、显式栈
:原题: `LeetCode 0098 <https://leetcode.com/problems/validate-binary-search-tree/>`_
:重点: 从局部父子比较的缺口，推导到全局边界约束与中序严格递增

题目重述
--------

给定二叉树根节点 ``root``，判断它是否为合法二叉搜索树。

对树中的任意节点：

* 左子树中的所有节点值都必须严格小于当前节点值；
* 右子树中的所有节点值都必须严格大于当前节点值；
* 整棵树中不允许通过相等值满足二叉搜索树关系。

树的节点数在 ``1..10^4`` 范围内，节点值位于 32 位有符号整数范围内。

自建示例
--------

.. code-block:: text

   输入（层序）：[8,3,10,null,null,6,12]
   输出：false

节点 6 虽然小于直接父节点 10，却位于根节点 8 的右子树，因此违反了祖先 8 传下来的下界。

.. code-block:: text

   输入（层序）：[8,3,10,1,6,9,12]
   输出：true

它的中序遍历为 ``1,3,6,8,9,10,12``，序列严格递增。

.. code-block:: text

   输入（层序）：[2,2,3]
   输出：false

左孩子与根节点相等。题目要求严格小于和严格大于，因此重复值非法。

C++ 实现
--------

.. code-block:: cpp

   #include <limits>
   #include <vector>

   class Solution {
   private:
       void collectInorder(TreeNode* node, std::vector<int>& values) {
           if (!node) return;
           collectInorder(node->left, values);
           values.push_back(node->val);
           collectInorder(node->right, values);
       }

       bool inorderArray(TreeNode* root) {
           std::vector<int> values;
           collectInorder(root, values);

           for (int i = 1; i < static_cast<int>(values.size()); ++i) {
               if (values[i] <= values[i - 1]) return false;
           }
           return true;
       }

       bool rangeDfs(TreeNode* node, long long lower, long long upper) {
           if (!node) return true;

           long long value = node->val;
           if (value <= lower || value >= upper) return false;

           return rangeDfs(node->left, lower, value) &&
                  rangeDfs(node->right, value, upper);
       }

       bool boundedRecursion(TreeNode* root) {
           return rangeDfs(
               root,
               std::numeric_limits<long long>::lowest(),
               std::numeric_limits<long long>::max()
           );
       }

       bool inorderStack(TreeNode* root) {
           std::vector<TreeNode*> stack;
           TreeNode* current = root;
           TreeNode* previous = nullptr;

           while (current || !stack.empty()) {
               while (current) {
                   stack.push_back(current);
                   current = current->left;
               }

               current = stack.back();
               stack.pop_back();

               if (previous && current->val <= previous->val) return false;
               previous = current;
               current = current->right;
           }

           return true;
       }

   public:
       bool isValidBST(TreeNode* root) {
           return inorderStack(root);
       }
   };

题解
----

局部比较的缺口
~~~~~~~~~~~~~~

只检查 ``node->left < node < node->right`` 无法验证整棵子树。祖先给出的约束会跨过多层节点继续生效：

.. code-block:: text

          8
         / \
        3  10
          /  \
         6   12

节点 6 与父节点 10 的局部关系正确，但右子树中的所有节点还必须大于祖先 8。没有携带祖先信息的父子比较会漏掉这种错误。

中序序列基线
~~~~~~~~~~~~

二叉搜索树的中序遍历顺序是“左子树、根、右子树”。合法 BST 的中序序列必然严格递增，因此最直接的方法是：

#. 完整收集中序序列；
#. 检查每个元素是否严格大于前一个元素。

使用 ``<=`` 而不是 ``<``，可以同时拒绝下降和重复值。

完整数组便于理解，但保存了所有节点值。实际判断只依赖当前值与中序前驱，因此可以把检查改成边遍历边比较。

边界递归
~~~~~~~~

另一条推导路线是直接保存祖先约束。状态 ``rangeDfs(node, lower, upper)`` 要求当前节点值位于严格开区间
``(lower, upper)``。

进入左子树时，当前值成为新的上界：

.. code-block:: text

   left:  (lower, node.val)

进入右子树时，当前值成为新的下界：

.. code-block:: text

   right: (node.val, upper)

另一侧边界继续保留，因此根节点和所有更早祖先施加的限制都会传到后代。任一节点越界即可立即返回 ``false``。

严格开区间
~~~~~~~~~~

边界必须使用严格不等式。节点值等于下界或上界时，同样违反 BST 定义：

.. code-block:: text

   node.val <= lower  -> 非法
   node.val >= upper  -> 非法

节点值本身可能等于 ``INT_MIN`` 或 ``INT_MAX``。若直接使用 32 位极值作为初始边界，会错误排除合法边界值。实现使用
64 位整数的最小值和最大值包围全部 32 位节点值。

显式栈
~~~~~~

主方法用显式栈模拟递归中序遍历：

#. 沿左指针不断压栈，直到没有更左节点；
#. 弹出栈顶，它是下一个中序节点；
#. 与中序前驱比较；
#. 转向该节点的右子树，再重复同一过程。

栈中保存的是左子树尚未处理完、因此根节点也尚未访问的祖先。弹出节点时，它的左子树已经全部访问，正好符合中序顺序。

前驱状态
~~~~~~~~

``previous`` 保存刚刚访问的中序节点。若当前值不大于前驱值，中序序列便不再严格递增：

.. code-block:: text

   current.val <= previous.val -> false

不能把前驱值初始化为 ``INT_MIN``，因为树中首个节点可能真的等于 ``INT_MIN``。使用空指针表示“尚未访问任何节点”不会与合法数据冲突。

完整性
~~~~~~

合法 BST 的左子树值全部小于根，右子树值全部大于根，递归应用后，中序序列必然严格递增。

反过来，若整棵树的中序序列严格递增，则任意节点左子树中的元素都出现在它之前，因此都更小；右子树中的元素都出现在它之后，因此都更大。于是每个节点都满足全局 BST 约束。

范围递归与中序检查验证的是同一性质：前者显式传播允许值域，后者把全局约束转换为遍历序列的严格单调性。

复杂度
~~~~~~

三种正确方法都访问每个节点一次，时间为 ``O(n)``。

* 完整中序数组使用 ``O(n)`` 数组空间，并有 ``O(h)`` 递归栈；
* 上下界递归使用 ``O(h)`` 调用栈；
* 显式中序栈使用 ``O(h)`` 空间。

其中 ``h`` 为树高，退化树最坏为 ``O(n)``。
