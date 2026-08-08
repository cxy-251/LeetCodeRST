0110. Balanced Binary Tree
==========================

题目信息
--------

:题号: 0110. 平衡二叉树
:难度: Easy
:主题: 二叉树、后序遍历、树高、失败哨兵
:原题: `LeetCode 0110 <https://leetcode.com/problems/balanced-binary-tree/>`_
:重点: 从逐节点重复求高度，推导到一次后序遍历同时返回平衡状态与高度，并用哨兵压缩状态

题目重述
--------

给定二叉树根节点 ``root``，判断整棵树是否高度平衡。对树中的每个节点，其左子树高度与右子树高度之差的
绝对值都必须不超过 ``1``；只检查根节点不够，任一后代失衡都会使整棵树不平衡。空树视为平衡。

树中节点总数在 ``0..5000`` 范围内，节点值在 ``-10^4..10^4`` 范围内。节点值不参与判断，算法不修改树。

自建示例
--------

* 全部节点平衡：``root = [7,3,11,1,5,null,13]``，返回 ``true``；
* 根平衡但后代失衡：``root = [7,3,11,1,null,null,13,0]``，返回 ``false``。根的左右高度差为 ``1``，
  但节点 ``3`` 的左右高度分别为 ``2``、``0``；
* 单侧两层：``root = [1,2]``，返回 ``true``，根的高度差正好为 ``1``；
* 空树：``root = []``，返回 ``true``。

C++ 实现
--------

.. code-block:: cpp

   #include <algorithm>
   #include <cmath>
   #include <utility>

   class Solution {
   private:
       int subtreeHeight(TreeNode* node) {
           if (!node) {
               return 0;
           }
           return 1 + std::max(subtreeHeight(node->left), subtreeHeight(node->right));
       }

       bool balancedTopDown(TreeNode* node) {
           if (!node) {
               return true;
           }
           const int leftHeight = subtreeHeight(node->left);
           const int rightHeight = subtreeHeight(node->right);
           return std::abs(leftHeight - rightHeight) <= 1 && balancedTopDown(node->left) &&
                  balancedTopDown(node->right);
       }

       std::pair<bool, int> balanceAndHeight(TreeNode* node) {
           if (!node) {
               return {true, 0};
           }
           const auto [leftBalanced, leftHeight] = balanceAndHeight(node->left);
           if (!leftBalanced) {
               return {false, 0};
           }
           const auto [rightBalanced, rightHeight] = balanceAndHeight(node->right);
           if (!rightBalanced || std::abs(leftHeight - rightHeight) > 1) {
               return {false, 0};
           }
           return {true, 1 + std::max(leftHeight, rightHeight)};
       }

       int heightOrFailure(TreeNode* node) {
           if (!node) {
               return 0;
           }
           const int leftHeight = heightOrFailure(node->left);
           if (leftHeight == -1) {
               return -1;
           }
           const int rightHeight = heightOrFailure(node->right);
           if (rightHeight == -1 || std::abs(leftHeight - rightHeight) > 1) {
               return -1;
           }
           return 1 + std::max(leftHeight, rightHeight);
       }

   public:
       bool isBalanced(TreeNode* root) {
           return heightOrFailure(root) != -1;
       }
   };

题解
----

定义的直接检查
~~~~~~~~~~~~~~

平衡条件属于每个节点。最直接的正确实现是：在当前节点分别计算左右子树高度，检查差值，再递归确认左右子树
内部也平衡。``balancedTopDown`` 正好对应这个逻辑；三个条件通过逻辑与连接，任一个失败都足以返回假。

只比较根的左右高度会遗漏深层问题。第二个示例中根 ``7`` 的左、右子树高度为 ``3``、``2``，根自身满足
差值限制；但左侧节点 ``3`` 的高度差为 ``2``，全树仍然不平衡。“每个节点”决定了搜索必须覆盖后代。

重复高度计算
~~~~~~~~~~~~

自顶向下方法把“求高度”和“检查平衡”分开。根调用 ``subtreeHeight`` 已经遍历左右子树，随后
``balancedTopDown`` 进入孩子时，又从孩子处重新计算相同子树的高度。

在单侧链中，根求高访问 ``n`` 个节点，下一节点求高访问 ``n - 1`` 个，累计为 ``O(n²)``。每个节点的
平衡结论确实需要左右高度，但这些高度应当在子树第一次完成时保存并交给父节点，而不是由每个祖先重新询问。

后序复合状态
~~~~~~~~~~~~

父节点要决定两件事：孩子子树是否平衡，以及若平衡时它的高度。因此后序状态可以返回二元组
``(balanced, height)``。``balanceAndHeight`` 先取得左侧结果，再取得右侧结果；任一侧不平衡便向上返回失败，
两侧都平衡时才比较高度差并计算当前高度。

每个节点只在一个递归状态中计算一次。子树高度从孩子返回，原先独立的 ``subtreeHeight`` 调用全部消失，
时间由最坏平方级降为线性。

失败哨兵压缩
~~~~~~~~~~~~

二元组中的高度只有在 ``balanced == true`` 时才有意义。合法高度总是非负：空树为 ``0``，非空树至少为
``1``；因此可以用不可能成为真实高度的 ``-1`` 同时表示“当前子树已经失衡”。

``heightOrFailure`` 的返回语义为：

* 非负数：当前子树平衡，该数值就是真实高度；
* ``-1``：当前节点或某个后代失衡。

父节点先检查左结果。若为 ``-1``，整棵当前子树已经无法满足“每个节点平衡”，无需再计算右侧；左侧成功后
再处理右侧，最后比较高度差。结构化二元组被压缩为一个整数，但判断信息没有丢失。

状态走读
~~~~~~~~

对不平衡示例 ``[7,3,11,1,null,null,13,0]``，部分后序返回如下：

.. list-table::
   :header-rows: 1

   * - 节点
     - 左结果
     - 右结果
     - 当前返回
   * - 0
     - 0
     - 0
     - 1
   * - 1
     - 1
     - 0
     - 2
   * - 3
     - 2
     - 0
     - ``-1``
   * - 7
     - ``-1``
     - 未计算
     - ``-1``

节点 ``3`` 发现差值 ``2`` 后不再返回一个可供祖先使用的伪高度，而是返回失败。根收到左侧 ``-1`` 就能
短路；右子树是否平衡无法修复左侧已经违反的全称条件，所以跳过它不会改变答案。

主解与复杂度
~~~~~~~~~~~~

公开入口采用失败哨兵方案，因为它保留后序复合状态的全部语义，同时省去二元组对象和无效高度。若更重视
类型显式性，``balanceAndHeight`` 同样是线性且正确的实现。

主解和二元组法都访问每个实际执行到的节点至多一次，最坏时间 ``O(n)``；发现失衡时可能提前结束。递归栈
为 ``O(h)``，单侧树最坏为 ``O(n)``。自顶向下基线最坏时间 ``O(n²)``。所有方法只读取树，返回值空间为
常数。
