0105. Construct Binary Tree from Preorder and Inorder Traversal
===============================================================

题目信息
--------

:题号: 0105. 从前序与中序遍历序列构造二叉树
:难度: Medium
:主题: 二叉树、分治、遍历序列、哈希索引
:原题: `LeetCode 0105 <https://leetcode.com/problems/construct-binary-tree-from-preorder-and-inorder-traversal/>`_
:重点: 前序确定子树根，中序确定左右规模，再用区间和前序游标删除重复扫描与切片

题目重述
--------

给定两个长度相同的整数数组 ``preorder`` 和 ``inorder``，它们分别是一棵二叉树的前序遍历与中序遍历结果，
需要重建并返回这棵树。

前序遍历顺序是“根、左子树、右子树”，中序遍历顺序是“左子树、根、右子树”。两个数组包含完全相同的节点
值，所有值互不相同，且输入保证来自同一棵有效二叉树，因此重建结果唯一。数组长度在 ``1..3000`` 范围内，
节点值在 ``-3000..3000`` 范围内。

自建示例
--------

* 左右子树都存在：``preorder = [8,4,2,6,12,10]``、``inorder = [2,4,6,8,10,12]``，返回树的
  层序表示为 ``[8,4,12,2,6,10]``；
* 完全左斜：``preorder = [5,4,3]``、``inorder = [3,4,5]``，返回 ``[5,4,null,3]``。每个根都在
  当前中序区间最右侧；
* 完全右斜：``preorder = [3,4,5]``、``inorder = [3,4,5]``，返回 ``[3,null,4,null,5]``；
* 单节点：``preorder = [7]``、``inorder = [7]``，返回只含根节点 ``7`` 的树。

C++ 实现
--------

.. code-block:: cpp

   #include <unordered_map>
   #include <vector>

   class Solution {
   private:
       TreeNode* buildWithSlices(const std::vector<int>& preorder, const std::vector<int>& inorder) {
           if (preorder.empty()) {
               return nullptr;
           }
           const int rootValue = preorder.front();
           int split = 0;
           while (inorder[split] != rootValue) {
               ++split;
           }
           const std::vector<int> leftPreorder(preorder.begin() + 1, preorder.begin() + 1 + split);
           const std::vector<int> rightPreorder(preorder.begin() + 1 + split, preorder.end());
           const std::vector<int> leftInorder(inorder.begin(), inorder.begin() + split);
           const std::vector<int> rightInorder(inorder.begin() + split + 1, inorder.end());
           TreeNode* root = new TreeNode(rootValue);
           root->left = buildWithSlices(leftPreorder, leftInorder);
           root->right = buildWithSlices(rightPreorder, rightInorder);
           return root;
       }

       TreeNode* buildWithRanges(const std::vector<int>& preorder, int preBegin, int preEnd, int inBegin,
                                 int inEnd, const std::unordered_map<int, int>& inorderIndex) {
           if (preBegin == preEnd) {
               return nullptr;
           }
           const int rootValue = preorder[preBegin];
           const int split = inorderIndex.at(rootValue);
           const int leftSize = split - inBegin;
           TreeNode* root = new TreeNode(rootValue);
           root->left = buildWithRanges(preorder, preBegin + 1, preBegin + 1 + leftSize, inBegin, split,
                                        inorderIndex);
           root->right = buildWithRanges(preorder, preBegin + 1 + leftSize, preEnd, split + 1, inEnd,
                                         inorderIndex);
           return root;
       }

       TreeNode* buildWithCursor(const std::vector<int>& preorder, int& preorderCursor, int inBegin, int inEnd,
                                 const std::unordered_map<int, int>& inorderIndex) {
           if (inBegin == inEnd) {
               return nullptr;
           }
           const int rootValue = preorder[preorderCursor++];
           const int split = inorderIndex.at(rootValue);
           TreeNode* root = new TreeNode(rootValue);
           root->left = buildWithCursor(preorder, preorderCursor, inBegin, split, inorderIndex);
           root->right = buildWithCursor(preorder, preorderCursor, split + 1, inEnd, inorderIndex);
           return root;
       }

   public:
       TreeNode* buildTree(std::vector<int>& preorder, std::vector<int>& inorder) {
           std::unordered_map<int, int> inorderIndex;
           inorderIndex.reserve(inorder.size());
           for (int index = 0; index < static_cast<int>(inorder.size()); ++index) {
               inorderIndex[inorder[index]] = index;
           }
           int preorderCursor = 0;
           return buildWithCursor(preorder, preorderCursor, 0, static_cast<int>(inorder.size()), inorderIndex);
       }
   };

题解
----

两份序列的信息差
~~~~~~~~~~~~~~~~

只看前序序列时，当前第一个值一定是根，却不知道后面多少个值属于左子树；只看中序序列时，根一旦确定就能
划分左右子树，却不知道哪个值应当作为根。两份序列恰好补足彼此缺失的信息。

对任意非空子树，前序片段的首值 ``rootValue`` 是子树根。它在对应中序片段中的位置把片段唯一分成：

.. code-block:: text

   inorder = [左子树节点 | rootValue | 右子树节点]

所有节点值互不相同，因此根在中序序列中只有一个位置，左右节点集合和规模随之确定。随后对两侧片段重复
同一过程，就能把原问题拆成两个更小、互不重叠的重建问题。

切片重建
~~~~~~~~

``buildWithSlices`` 是最接近定义的实现。取 ``preorder[0]`` 作为根，在线性扫描中序数组找到 ``split``；
中序左侧有 ``split`` 个值，所以前序中紧跟根的 ``split`` 个值必然属于左子树，余下值属于右子树。复制出
四个子数组后分别递归，空前序数组对应空子树。

这个方案正确的关键不是两个数组恰好切成相同下标，而是左子树节点数在两种遍历中相同。前序的左右边界由
中序左片段长度推导；若直接按中序的 ``split`` 当作所有递归层的前序绝对下标，子树起点变化后就会错位。

切片方案会重复两类工作：每个子问题都扫描中序片段寻找根，并复制新的前序、中序数组。完全斜树每次只缩短
一个元素，扫描量和复制量形成 ``n + (n - 1) + ... + 1``，最坏达到 ``O(n²)``。

区间替代切片
~~~~~~~~~~~~

数组内容不需要改变，递归只需知道当前片段边界。``buildWithRanges`` 使用半开区间
``[preBegin, preEnd)`` 与 ``[inBegin, inEnd)`` 表示同一子树，空区间由 ``preBegin == preEnd`` 判断。

再预先建立 ``节点值 -> 中序下标`` 的 ``inorderIndex``，根位置由重复线性扫描变为一次查询。设
``split`` 为根的中序下标，则 ``leftSize = split - inBegin``，四个孩子区间为：

.. code-block:: text

   左子树 preorder：[preBegin + 1, preBegin + 1 + leftSize)
   左子树 inorder ：[inBegin, split)

   右子树 preorder：[preBegin + 1 + leftSize, preEnd)
   右子树 inorder ：[split + 1, inEnd)

区间方案删除了所有子数组复制，哈希索引删除了重复找根；代价是每个状态同时维护四个边界，并在代码中计算
左子树规模以对齐两份序列。

前序游标压缩
~~~~~~~~~~~~

前序遍历本身已经规定了节点消费顺序：先根，再完整左子树，最后完整右子树。只要递归严格先构造左侧中序
区间、再构造右侧中序区间，一个全局 ``preorderCursor`` 就会自然依次指向每棵待建子树的根。

``buildWithCursor`` 因此只保留中序半开区间。进入非空区间时读取 ``preorder[preorderCursor]`` 并立即递增；
哈希索引给出左右中序边界，左递归会恰好消费左子树全部前序值，返回后游标自然停在右子树根。显式前序区间、
``leftSize`` 和右侧前序起点都从状态中消失。

左右递归顺序不能交换。读取根之后，游标指向的是前序中的左子树首值；若先传入右侧中序区间，这个左侧值会
被错误地用作右子树根。这里的调用顺序不是排版选择，而是维护“游标始终指向当前子树根”的不变量。

区间与游标走读
~~~~~~~~~~~~~~

对 ``preorder = [8,4,2,6,12,10]``、``inorder = [2,4,6,8,10,12]``：

.. list-table::
   :header-rows: 1

   * - 中序区间
     - 游标读取
     - 根位置
     - 左区间
     - 右区间
   * - ``[0,6)``
     - 8
     - 3
     - ``[0,3)``
     - ``[4,6)``
   * - ``[0,3)``
     - 4
     - 1
     - ``[0,1)``
     - ``[2,3)``
   * - ``[0,1)``
     - 2
     - 0
     - 空
     - 空
   * - ``[2,3)``
     - 6
     - 2
     - 空
     - 空
   * - ``[4,6)``
     - 12
     - 5
     - ``[4,5)``
     - 空
   * - ``[4,5)``
     - 10
     - 4
     - 空
     - 空

左子树返回时，游标已从 ``1`` 前进到 ``4``，正好指向值 ``12``，无需由根区间重新计算右子树前序起点。
单元素中序区间会创建叶节点，它的两个孩子调用都收到空区间并返回 ``nullptr``。

主解与复杂度
~~~~~~~~~~~~

公开入口采用前序游标方案，因为它保留“中序负责边界、前序负责根顺序”两个必要状态，删除了切片、前序边界
和子树规模换算。节点值唯一是哈希索引与唯一重建成立的前提；若存在重复值，单个值无法确定中序位置，当前
状态定义便不足以选择划分点。

切片方案最坏时间和额外复制量为 ``O(n²)``。两个区间方案都创建每个节点一次；在哈希表平均常数查询下，
期望时间为 ``O(n)``，索引工作空间为 ``O(n)``，递归栈为 ``O(h)``。极端哈希冲突下的严格最坏时间取决于
容器实现。返回的新树本身包含 ``n`` 个节点，不计入工作空间。
