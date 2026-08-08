0199. Binary Tree Right Side View
================================

题目信息
--------

:题号: 0199. 二叉树的右视图
:难度: Medium
:主题: 二叉树、广度优先搜索、深度优先搜索、遍历顺序
:原题: `LeetCode 0199 <https://leetcode.com/problems/binary-tree-right-side-view/>`_
:重点: 把可见节点定义为每层最右节点，用层边界或右优先的深度首次访问精确提交

题目重述
--------

给定一棵二叉树，从右侧观察，返回从上到下能够看到的节点值。每个非空深度恰好返回一个
值，它属于该层结构位置最靠右的节点；空树返回空数组。

“最靠右”由树中位置决定，不是节点值最大，也不保证总在连续的右孩子链上。

自建示例
--------

.. code-block:: text

          1
        /   \
       2     3
        \     \
         5     4

   每层从左到右：[1]、[2,3]、[5,4]
   输出：[1,3,4]

.. code-block:: text

          1
        /   \
       2     3
      /
     4
    /
   5

   输出：[1,3,4,5]

   右分支提前结束后，更深层的可见节点来自左子树，不能只沿 right 指针向下走。

C++ 实现
--------

.. code-block:: cpp

   #include <cstddef>
   #include <queue>
   #include <vector>

   class Solution {
   private:
       std::vector<int> breadthFirstLevels(TreeNode* root) {
           if (root == nullptr) {
               return {};
           }

           std::queue<TreeNode*> pending;
           std::vector<int> visible;
           pending.push(root);

           while (!pending.empty()) {
               std::size_t level_size = pending.size();
               for (std::size_t index = 0;
                    index < level_size;
                    ++index) {
                   TreeNode* node = pending.front();
                   pending.pop();

                   if (node->left != nullptr) {
                       pending.push(node->left);
                   }
                   if (node->right != nullptr) {
                       pending.push(node->right);
                   }
                   if (index + 1 == level_size) {
                       visible.push_back(node->val);
                   }
               }
           }
           return visible;
       }

       void visitRightFirst(
           TreeNode* node, int depth, std::vector<int>& visible) {
           if (node == nullptr) {
               return;
           }
           if (depth == static_cast<int>(visible.size())) {
               visible.push_back(node->val);
           }

           visitRightFirst(node->right, depth + 1, visible);
           visitRightFirst(node->left, depth + 1, visible);
       }

       std::vector<int> depthFirstLevels(TreeNode* root) {
           std::vector<int> visible;
           visitRightFirst(root, 0, visible);
           return visible;
       }

   public:
       std::vector<int> rightSideView(TreeNode* root) {
           return breadthFirstLevels(root);
       }
   };

题解
----

观察对象是层而不是路径
~~~~~~~~~~~~~~~~~~~~~~

只沿 ``right`` 指针前进，相当于假设每一层最右节点都是上一层最右节点的右孩子。第二棵
示例在深度 2、3 立即反驳了这个假设：右子树没有节点，但左子树仍延伸，节点 4、5 依然能
从右侧看到。

把整棵树序列化并记录所有空位置，也能恢复每层最右非空节点，却保存了题目不需要的完整
结构。真正需要的是对每个深度提交一个最右节点；BFS 直接把搜索空间分成层，DFS 则通过
访问顺序让最右节点成为该深度的第一次访问。

主解：队列如何保持层内次序
~~~~~~~~~~~~~~~~~~~~~~~~~~~~

``breadthFirstLevels`` 的外层每轮开始时，队列恰好以从左到右顺序保存当前层全部非空节点。
根层显然成立。处理当前层时，父节点从左到右出队，每个父节点又先加入左孩子、再加入右
孩子，所以形成的下一层队列仍从左到右。

当前层最后出队的节点因此就是该层最右非空节点。代码只在
``index + 1 == level_size`` 时把其值加入答案，其他同层节点仅用于发现下一层。

层大小为什么必须冻结
~~~~~~~~~~~~~~~~~~~~~~

``level_size = pending.size()`` 是本轮开始时的快照。层内处理会不断把孩子加入队尾，队列
长度随之变化；若循环条件直接追随实时 ``pending.size()``，新孩子会被当成当前层继续处理，
层边界消失，也就无法知道哪个节点是某一深度的最后一个。

只弹出快照中的 ``level_size`` 个节点后，旧层恰好清空，队列只剩下一层。每轮提交一次，
保证输出深度从根到叶递增且不重不漏。

BFS 状态走读
~~~~~~~~~~~~

对第一棵示例树，队列按头到尾书写：

.. code-block:: text

   层  轮开始队列  冻结大小  本层最后节点  轮结束队列
   0   [1]         1         1             [2,3]
   1   [2,3]       2         3             [5,4]
   2   [5,4]       2         4             []

得到 ``[1,3,4]``。节点值大小没有参与选择；即使 5 大于 4，位置更靠右的 4 才可见。

替代方案：右优先 DFS
~~~~~~~~~~~~~~~~~~~~

深度优先搜索不天然按层结束，但可以改变同一深度的到达顺序。先递归右子树、再递归左子树
时，每个深度第一次访问到的节点就是能从右侧优先遇到的节点。

``visible.size()`` 等于已经提交的深度数。到达 ``depth`` 时：

* 若 ``depth == visible.size()``，此前尚未访问该深度，当前节点是右优先顺序中的第一个，
  应提交；
* 若 ``depth < visible.size()``，该深度已有更靠右节点，当前值不能覆盖它。

随后仍必须递归左子树。右子树可能没有足够深，左侧后代会成为某个新深度的第一次访问，
正如第二棵示例中的 4、5。右优先不是“只走右边”，而是定义同层候选的优先级。

两个方案的正确性与取舍
~~~~~~~~~~~~~~~~~~~~~~

BFS 通过层大小不变量证明每轮快照是完整一层，最后节点即最右节点；DFS 通过右先左后的
遍历顺序证明每个深度首次到达者最右，之后同深度节点被忽略。两者都访问每个节点一次，
时间为 ``O(n)``，也都只读树。

BFS 队列峰值为最大层宽 ``O(w)``，层边界与题意直接对应，因此作为主解；DFS 使用
``O(h)`` 递归栈，在窄深树上空间更小，但极深树存在调用栈风险。返回数组本身包含每层一个
值，大小 ``O(h)``，属于必要输出载荷。
