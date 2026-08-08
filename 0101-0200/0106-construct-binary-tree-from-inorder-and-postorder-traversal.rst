0106. Construct Binary Tree from Inorder and Postorder Traversal
================================================================

题目信息
--------

:题号: 0106. 从中序与后序遍历序列构造二叉树
:难度: Medium
:主题: 二叉树、分治、遍历序列、哈希索引
:原题: `LeetCode 0106 <https://leetcode.com/problems/construct-binary-tree-from-inorder-and-postorder-traversal/>`_
:重点: 后序末端确定根，中序确定左右规模，再用反向游标按“根、右、左”消费节点

题目重述
--------

给定长度相同的整数数组 ``inorder`` 和 ``postorder``，它们分别是一棵二叉树的中序遍历与后序遍历结果，
需要重建并返回原树。

中序顺序是“左子树、根、右子树”，后序顺序是“左子树、右子树、根”。两个数组包含相同且互不重复的节点
值，并保证来自同一棵有效二叉树，所以根位置和最终树都能唯一确定。数组长度在 ``1..3000`` 范围内，节点值
在 ``-3000..3000`` 范围内。

自建示例
--------

* 左右子树都存在：``inorder = [2,4,6,8,10,12]``、``postorder = [2,6,4,10,12,8]``，返回树的
  层序表示为 ``[8,4,12,2,6,10]``；
* 完全右斜：``inorder = [3,4,5]``、``postorder = [5,4,3]``，返回 ``[3,null,4,null,5]``；
* 完全左斜：``inorder = [3,4,5]``、``postorder = [3,4,5]``，返回 ``[5,4,null,3]``；
* 单节点：``inorder = [7]``、``postorder = [7]``，返回只含节点 ``7`` 的树。

C++ 实现
--------

.. code-block:: cpp

   #include <unordered_map>
   #include <vector>

   class Solution {
   private:
       TreeNode* buildWithSlices(const std::vector<int>& inorder, const std::vector<int>& postorder) {
           if (inorder.empty()) {
               return nullptr;
           }
           const int rootValue = postorder.back();
           int split = 0;
           while (inorder[split] != rootValue) {
               ++split;
           }
           const std::vector<int> leftInorder(inorder.begin(), inorder.begin() + split);
           const std::vector<int> rightInorder(inorder.begin() + split + 1, inorder.end());
           const std::vector<int> leftPostorder(postorder.begin(), postorder.begin() + split);
           const std::vector<int> rightPostorder(postorder.begin() + split, postorder.end() - 1);
           TreeNode* root = new TreeNode(rootValue);
           root->left = buildWithSlices(leftInorder, leftPostorder);
           root->right = buildWithSlices(rightInorder, rightPostorder);
           return root;
       }

       TreeNode* buildWithRanges(const std::vector<int>& postorder, int postBegin, int postEnd, int inBegin,
                                 int inEnd, const std::unordered_map<int, int>& inorderIndex) {
           if (postBegin == postEnd) {
               return nullptr;
           }
           const int rootValue = postorder[postEnd - 1];
           const int split = inorderIndex.at(rootValue);
           const int leftSize = split - inBegin;
           TreeNode* root = new TreeNode(rootValue);
           root->left = buildWithRanges(postorder, postBegin, postBegin + leftSize, inBegin, split,
                                        inorderIndex);
           root->right = buildWithRanges(postorder, postBegin + leftSize, postEnd - 1, split + 1, inEnd,
                                         inorderIndex);
           return root;
       }

       TreeNode* buildWithReverseCursor(const std::vector<int>& postorder, int& postorderCursor, int inBegin,
                                        int inEnd, const std::unordered_map<int, int>& inorderIndex) {
           if (inBegin == inEnd) {
               return nullptr;
           }
           const int rootValue = postorder[postorderCursor--];
           const int split = inorderIndex.at(rootValue);
           TreeNode* root = new TreeNode(rootValue);
           root->right = buildWithReverseCursor(postorder, postorderCursor, split + 1, inEnd, inorderIndex);
           root->left = buildWithReverseCursor(postorder, postorderCursor, inBegin, split, inorderIndex);
           return root;
       }

   public:
       TreeNode* buildTree(std::vector<int>& inorder, std::vector<int>& postorder) {
           std::unordered_map<int, int> inorderIndex;
           inorderIndex.reserve(inorder.size());
           for (int index = 0; index < static_cast<int>(inorder.size()); ++index) {
               inorderIndex[inorder[index]] = index;
           }
           int postorderCursor = static_cast<int>(postorder.size()) - 1;
           return buildWithReverseCursor(postorder, postorderCursor, 0, static_cast<int>(inorder.size()),
                                         inorderIndex);
       }
   };

题解
----

根与左右边界
~~~~~~~~~~~~

后序遍历会先完成左右子树，最后访问根，因此任意非空子树对应的后序片段末值一定是根。确定根值后，它在
中序片段中的位置又把节点集合分为左右两侧：

.. code-block:: text

   inorder   = [左子树节点 | rootValue | 右子树节点]
   postorder = [左子树节点 | 右子树节点 | rootValue]

节点值互不相同，使根在中序中只有一个位置。中序左侧节点数决定后序片段中左、右子树的分界；对两个更小
片段重复相同操作，最终能唯一恢复全部父子关系。

切片直觉法
~~~~~~~~~~

``buildWithSlices`` 直接取 ``postorder.back()`` 作为根，再扫描 ``inorder`` 找到 ``split``。当前切片中，
中序左侧有 ``split`` 个节点，所以后序开头的 ``split`` 个值属于左子树，根之前的余下值属于右子树。
分别复制四个子数组并递归，空数组返回空指针。

这种做法与定义一一对应，但会在每层重新寻找根并复制片段。完全斜树每次只去掉一个根，累计扫描和复制量为
``n + (n - 1) + ... + 1``，最坏达到 ``O(n²)``。要优化的不是分治结构，而是同一数组区间被反复查找和
搬运的工作。

索引与半开区间
~~~~~~~~~~~~~~

``buildWithRanges`` 以半开区间 ``[postBegin, postEnd)``、``[inBegin, inEnd)`` 描述同一子树，数组本身
不再复制。预先建立 ``节点值 -> 中序下标`` 的 ``inorderIndex`` 后，根位置 ``split`` 也不必线性扫描。

令 ``leftSize = split - inBegin``，根位于后序下标 ``postEnd - 1``，孩子区间为：

.. code-block:: text

   左子树 postorder：[postBegin, postBegin + leftSize)
   左子树 inorder  ：[inBegin, split)

   右子树 postorder：[postBegin + leftSize, postEnd - 1)
   右子树 inorder  ：[split + 1, inEnd)

空半开区间满足起点等于终点，直接返回 ``nullptr``。区间方法消除了切片与找根扫描，但每个状态仍维护四个
边界，并依靠左子树规模计算右后序区间。

反向游标
~~~~~~~~

从后序数组末端向前读取，顺序不再是“左、右、根”，而是“根、右、左”。因此读取当前根后，紧邻的下一个
未消费值属于右子树；只要先递归右侧中序区间，再递归左侧中序区间，全局 ``postorderCursor`` 就会自然
消费当前子树对应的连续后序片段。

``buildWithReverseCursor`` 只保留中序半开区间。进入非空区间时读取游标值并递减，根据哈希索引划分左右，
然后严格按照右、左顺序构造。显式后序边界、``leftSize`` 以及两个后序孩子区间全部从状态中消失。

递归顺序不能按通常书写习惯改成先左后右。根读取后游标正指向右子树最后访问的节点；若先把它交给左侧
中序区间，就会用右侧节点充当左子树根，后续划分即使索引正确也无法补救。

游标走读
~~~~~~~~

对 ``inorder = [2,4,6,8,10,12]``、``postorder = [2,6,4,10,12,8]``，游标从下标 ``5`` 开始：

.. list-table::
   :header-rows: 1

   * - 中序区间
     - 游标读取
     - 根位置
     - 下一次非空递归
   * - ``[0,6)``
     - 8
     - 3
     - 右区间 ``[4,6)``
   * - ``[4,6)``
     - 12
     - 5
     - 右为空，再进入左 ``[4,5)``
   * - ``[4,5)``
     - 10
     - 4
     - 两侧为空
   * - ``[0,3)``
     - 4
     - 1
     - 右区间 ``[2,3)``
   * - ``[2,3)``
     - 6
     - 2
     - 两侧为空
   * - ``[0,1)``
     - 2
     - 0
     - 两侧为空

右子树完成后，游标从值 ``12`` 一路消费到值 ``10``，随后自然停在左子树根 ``4``。单元素区间创建叶节点，
它的两个空区间不会继续读取游标。

主解与复杂度
~~~~~~~~~~~~

公开入口采用反向游标方案，因为它让中序序列只负责结构边界、后序游标只负责根的出现次序。节点值唯一是
索引无歧义和树唯一重建的必要前提；若允许重复值，单个 ``value -> index`` 映射无法决定当前根位置。

切片法最坏时间与额外复制量为 ``O(n²)``。区间法和反向游标法各创建每个节点一次；哈希表平均查询为
``O(1)`` 时，期望时间为 ``O(n)``，索引工作空间为 ``O(n)``，递归栈为 ``O(h)``。哈希极端冲突下的
严格最坏时间取决于容器实现；返回树的 ``n`` 个新节点不计入工作空间。
