0222. Count Complete Tree Nodes
===============================

题目信息
--------

:题号: 0222. 完全二叉树的节点个数
:难度: Easy
:主题: 完全二叉树、递归、二分查找、满二叉树
:原题: `LeetCode 0222 <https://leetcode.com/problems/count-complete-tree-nodes/>`_
:重点: 最后一层左对齐、满子树闭式计数、把线性遍历压到高度平方

题目重述
--------

给定一棵完全二叉树的根节点 ``root``，返回树中的节点个数。完全二叉树除最后一层外每一层都填满；
最后一层的节点全部靠左，层序位置中不会出现空缺后又出现节点。若最后一层编号为 ``h``（根为第 0
层），该层节点数位于 ``[1, 2^h]``。

节点数量位于 ``[0, 5 \times 10^4]``，节点值位于 ``[0, 5 \times 10^4]``。题目保证输入是完全二叉树，
不必再验证结构。统计对象是节点个数，与节点值是否重复无关。空树返回 ``0``；函数只读取指针，
不修改树。进阶要求是设计时间低于 ``O(n)`` 的算法，而不是满足于遍历全部节点。

自建示例
--------

最后一层未填满：

.. code-block:: text

   输入：root = [8, 4, 12, 2, 6]
   输出：5
   解释：层序为根、两个孩子、最后一层两个靠左的节点，共 5 个实际节点。

满二叉树：

.. code-block:: text

   输入：root = [8, 4, 12, 2, 6, 10, 14]
   输出：7
   解释：三层全部填满，节点数为 2^3 - 1 = 7。

单节点与空树：``root = [8]`` 返回 ``1``；``root = []`` 返回 ``0``。

C++ 实现
--------

.. code-block:: cpp

   class Solution {
   public:
       int countNodes(TreeNode* root) {
           return countByPerfectSubtree(root);
       }

   private:
       int countByTraversal(TreeNode* node) {
           if (node == nullptr) return 0;
           return 1 + countByTraversal(node->left) + countByTraversal(node->right);
       }

       int leftHeight(TreeNode* node) {
           int height = 0;
           while (node != nullptr) {
               ++height;
               node = node->left;
           }
           return height;
       }

       int rightHeight(TreeNode* node) {
           int height = 0;
           while (node != nullptr) {
               ++height;
               node = node->right;
           }
           return height;
       }

       int countByPerfectSubtree(TreeNode* node) {
           if (node == nullptr) return 0;
           const int left = leftHeight(node);
           const int right = rightHeight(node);
           if (left == right) {
               return static_cast<int>((1LL << left) - 1);
           }
           return 1 + countByPerfectSubtree(node->left) + countByPerfectSubtree(node->right);
       }

       bool existsAtIndex(TreeNode* root, int index, int height) {
           TreeNode* node = root;
           for (int bit = height - 2; bit >= 0; --bit) {
               if ((index & (1 << bit)) != 0) {
                   node = node->right;
               } else {
                   node = node->left;
               }
               if (node == nullptr) return false;
           }
           return true;
       }

       int countByLastLevelSearch(TreeNode* root) {
           if (root == nullptr) return 0;
           const int height = leftHeight(root);
           int low = static_cast<int>(1LL << (height - 1));
           int high = static_cast<int>((1LL << height) - 1);
           while (low < high) {
               const int mid = low + (high - low + 1) / 2;
               if (existsAtIndex(root, mid, height)) {
                   low = mid;
               } else {
                   high = mid - 1;
               }
           }
           return low;
       }
   };

题解
----

遍历给出原始计数空间
~~~~~~~~~~~~~~~~~~~~

``countByTraversal`` 对每个节点贡献 1，再把左右子树的计数相加。空指针返回 0，因此每个实际节点
恰好被访问一次，空树、单节点和最后一层缺节点都不会漏计或重复计。这是直接执行题意的基线。

节点值不进入计算。真正的代价是访问次数等于 ``n``。完全二叉树的高度只有 ``O(\log n)``，递归栈
也是 ``O(\log n)``，但时间仍随节点数线性增长。进阶要求把这层“看见每个节点”的工作删掉。

完全树只在最后一层不确定
~~~~~~~~~~~~~~~~~~~~~~~~

完全二叉树的前 ``h-1`` 层一定是满的，唯一的未知量是最后一层从左数有多少个节点。满二叉树有闭式：
高度按节点层数计、空树高度为 0 时，高度 ``h`` 的满树节点数为

.. math::

   1 + 2 + \cdots + 2^{h-1} = 2^h - 1

下文高度一律按“从当前根沿路径走到空指针所经节点数”计算，与题面里从 0 起算的层编号不是同一个量。
若能在不遍历全部节点的前提下判断当前子树是不是满的，整块满区域就可以用一次位移代替逐个访问。
若不是满的，完全性保证缺口只出现在最后一层的右侧，左右子树仍然都是完全二叉树，问题规模按高度下降。

满子树的左右边界高度相同
~~~~~~~~~~~~~~~~~~~~~~~~

从一个节点沿左孩子走到空指针，经过的节点数是左边界高度；沿右孩子走是右边界高度。对完全二叉树：

* 两高度相等，最后一层已经在该子树内填满，整棵子树是满的，直接返回 ``2^h - 1``；
* 两高度不等，缺口一定在某棵子树里，根贡献 1，再分别处理左右子树。

完全性排除了“内部空洞”：最左、最右路径一样长时，中间不可能缺节点。高度不等时，较高的一侧仍可能
是满的，另一侧才需要继续分解；至多一棵子树不是满的，所以递归不会同时沿两条非满路径走下去。

对 ``[8, 4, 12, 2, 6]``：

.. list-table::
   :header-rows: 1

   * - 当前根
     - 左高
     - 右高
     - 动作
   * - 8
     - 3
     - 2
     - 非满，进入两侧
   * - 4
     - 2
     - 2
     - 满树，返回 3
   * - 12
     - 1
     - 1
     - 满树，返回 1

根贡献 1，总节点数为 ``1 + 3 + 1 = 5``。节点 2、6 没有被单独访问，它们已经包含在以 4 为根的满树公式里。

最后一层可以按堆下标二分
~~~~~~~~~~~~~~~~~~~~~~~~

同一结构还有另一条实现。把节点按完全二叉树的堆编号：根为 1，左孩子 ``2i``，右孩子 ``2i+1``。
高度 ``h`` 时，节点总数位于 ``[2^{h-1}, 2^h - 1]``。判断编号 ``index`` 是否存在：丢掉二进制最高位
的 1，余下每一位 ``0`` 向左、``1`` 向右，从根走到对应位置，路径长度为 ``h-1``。

``countByLastLevelSearch`` 在这个闭区间上二分最大存在编号。判定函数每次走一条根到叶路径，不保存
整层节点。对上面同一棵树，最后一层候选编号是 4 到 7：4、5 存在，6、7 不存在，二分得到 5，正好是
节点总数。它与满子树公式解决的是同一个未知量，只是把“哪棵子树未满”改写成“最后一个节点的编号”。

代码分析
~~~~~~~~

三个私有计数函数对应三层认识。``countByTraversal`` 保留逐节点相加；``countByPerfectSubtree``
删除满子树内部的访问，只沿左、右脊量高度，高度相等就用 ``(1LL << left) - 1`` 闭合，否则把问题
分给两棵仍完全的子树；``countByLastLevelSearch`` 不再递归分解子树，而是在最后一层的编号区间上
查询存在性。

公共入口调用 ``countByPerfectSubtree``，因为它把完全性直接写成“满则闭式、不满则分解”。位移使用
``1LL``，避免在 ``int`` 中左移后再减一。``existsAtIndex`` 的循环从 ``height-2`` 看到 0：根已经
对应最高位的 1，余下 ``h-1`` 步恰好走到最后一层。二分取上中点 ``low + (high - low + 1) / 2``，
存在则把下界抬到 ``mid``，这样才能收敛到最大存在编号，而不是第一个缺口。

复杂度与边界
~~~~~~~~~~~~

.. list-table::
   :header-rows: 1

   * - 方法
     - 时间复杂度
     - 工作空间
     - 主要代价
   * - 遍历计数
     - ``O(n)``
     - ``O(\log n)`` 递归栈
     - 访问每个节点
   * - 满子树捷径
     - ``O(\log^2 n)``
     - ``O(\log n)`` 递归栈
     - 每层两次高度探测，至多一条非满递归链
   * - 最后一层二分
     - ``O(\log^2 n)``
     - ``O(1)`` 额外空间
     - ``O(\log n)`` 次存在性判定，每次走 ``O(\log n)`` 步

满子树方法中，单次高度探测与当前高度成正比；非满时只有一棵子树继续递归，递归深度为高度，因此
总时间为 ``O(\log^2 n)``。空树在入口直接返回 0。单节点左右高度都是 1，公式给出 1。节点值从不
参与运算。三种实现都不修改树，主解也不分配与 ``n`` 成正比的容器。
