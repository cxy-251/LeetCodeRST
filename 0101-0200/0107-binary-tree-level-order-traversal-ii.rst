0107. Binary Tree Level Order Traversal II
==========================================

题目信息
--------

:题号: 0107. 二叉树的层序遍历 II
:难度: Medium
:主题: 二叉树、广度优先搜索、层边界、结果变换
:原题: `LeetCode 0107 <https://leetcode.com/problems/binary-tree-level-order-traversal-ii/>`_
:重点: 区分树的访问顺序与结果的层排列，把自底向上重复寻层改为一次 BFS 加外层反转

题目重述
--------

给定二叉树根节点 ``root``，按深度分组返回全部节点值，但结果中的层要自底向上排列：最深层放在最前，根
所在层放在最后。每一层内部仍保持从左到右的顺序，不能随层顺序一起反转。

结果只包含非空节点；空树没有层，返回空数组。树中节点总数在 ``0..2000`` 范围内，节点值在
``-1000..1000`` 范围内，遍历不修改树。

自建示例
--------

* 稀疏树：``root = [8,4,12,null,6,10,14]``，返回 ``[[6,10,14],[4,12],[8]]``；
* 各层单节点：``root = [1,null,2,null,3]``，返回 ``[[3],[2],[1]]``；
* 单节点：``root = [5]``，返回 ``[[5]]``；
* 空树：``root = []``，返回 ``[]``，不能返回 ``[[]]``。

C++ 实现
--------

.. code-block:: cpp

   #include <algorithm>
   #include <queue>
   #include <utility>
   #include <vector>

   class Solution {
   private:
       int treeHeight(TreeNode* node) {
           if (!node) {
               return 0;
           }
           return 1 + std::max(treeHeight(node->left), treeHeight(node->right));
       }

       void collectAtDepth(TreeNode* node, int currentDepth, int targetDepth, std::vector<int>& level) {
           if (!node) {
               return;
           }
           if (currentDepth == targetDepth) {
               level.push_back(node->val);
               return;
           }
           collectAtDepth(node->left, currentDepth + 1, targetDepth, level);
           collectAtDepth(node->right, currentDepth + 1, targetDepth, level);
       }

       std::vector<std::vector<int>> repeatedBottomUpSearch(TreeNode* root) {
           std::vector<std::vector<int>> levels;
           for (int targetDepth = treeHeight(root) - 1; targetDepth >= 0; --targetDepth) {
               std::vector<int> level;
               collectAtDepth(root, 0, targetDepth, level);
               levels.push_back(std::move(level));
           }
           return levels;
       }

       std::vector<std::vector<int>> breadthFirstThenReverse(TreeNode* root) {
           if (!root) {
               return {};
           }
           std::vector<std::vector<int>> levels;
           std::queue<TreeNode*> pending;
           pending.push(root);
           while (!pending.empty()) {
               const int levelSize = static_cast<int>(pending.size());
               std::vector<int> level;
               level.reserve(levelSize);
               for (int count = 0; count < levelSize; ++count) {
                   TreeNode* node = pending.front();
                   pending.pop();
                   level.push_back(node->val);
                   if (node->left) {
                       pending.push(node->left);
                   }
                   if (node->right) {
                       pending.push(node->right);
                   }
               }
               levels.push_back(std::move(level));
           }
           std::reverse(levels.begin(), levels.end());
           return levels;
       }

   public:
       std::vector<std::vector<int>> levelOrderBottom(TreeNode* root) {
           return breadthFirstThenReverse(root);
       }
   };

题解
----

按目标顺序寻层
~~~~~~~~~~~~~~

若把“自底向上输出”直接当作访问要求，最直观的正确做法是先求树高 ``h``，再依次从根寻找深度
``h - 1,h - 2,...,0`` 的节点。``collectAtDepth`` 到达目标深度时记录节点，并始终先递归左孩子，所以
即使层的处理顺序反过来，每一行内部仍是从左到右。

``repeatedBottomUpSearch`` 完整覆盖所有深度，因此不会漏节点；空树高度为 ``0``，初始目标深度为 ``-1``，
循环不会执行，自然返回空结果。

问题在于每取一层都从根重新出发。高层节点会作为通往许多目标层的公共前缀反复访问；单侧链需要走
``n + (n - 1) + ... + 1`` 个节点，最坏时间为 ``O(n²)``。一般写成 ``O(nh)``，其中 ``h`` 是树高。

访问与输出分离
~~~~~~~~~~~~~~

题目只约束最终二维数组中各层的排列，并未要求算法先访问叶节点。树从根提供入口，普通 BFS 能在一次遍历中
最直接地确定层边界和层内从左到右顺序；完成后再调整行对象的位置，就能删除重复寻层。

``breadthFirstThenReverse`` 在每轮开始时保存 ``levelSize``，只弹出当前层节点；父节点按从左到右出队，
孩子按左、右顺序入队，因此生成的是自然的自顶向下层序：

.. code-block:: text

   [[根层], [第二层], ..., [最深层]]

最终只对外层 ``levels`` 调用一次 ``reverse``，得到：

.. code-block:: text

   [[最深层], ..., [第二层], [根层]]

每个内层向量作为一个整体交换位置，内部元素完全不动。若逐行反转，``[4,12]`` 会错误变成 ``[12,4]``；
这说明“层顺序反向”和“层内顺序反向”是两个不同操作。

状态走读
~~~~~~~~

对 ``[8,4,12,null,6,10,14]``，BFS 与最终变换如下：

.. list-table::
   :header-rows: 1

   * - 阶段
     - 当前层队列
     - 新行
     - ``levels``
   * - 第 0 层
     - ``[8]``
     - ``[8]``
     - ``[[8]]``
   * - 第 1 层
     - ``[4,12]``
     - ``[4,12]``
     - ``[[8],[4,12]]``
   * - 第 2 层
     - ``[6,10,14]``
     - ``[6,10,14]``
     - ``[[8],[4,12],[6,10,14]]``
   * - 外层反转
     - 队列已空
     - 不改行内容
     - ``[[6,10,14],[4,12],[8]]``

节点 ``6`` 虽然是左侧父节点 ``4`` 的右孩子，仍在 ``10``、``14`` 之前入队。最终反转只移动它所在的
整行，不改变这一层内由树结构决定的左右顺序。

结果组织选择
~~~~~~~~~~~~

也可以在发现一层时把行插到结果开头。若使用 ``vector`` 头插，每次都要搬移已有行对象，``h`` 层最坏产生
``O(h²)`` 次行对象移动；使用 ``deque`` 可常数时间头插，却还要转换为题目要求的 ``vector``。尾部追加全部
行再做一次外层反转只需 ``O(h)`` 次行交换，容器和状态都更简单，因此作为主解。

先左后右的 DFS 也能按深度聚合自然顺序的行，再反转外层；它与 BFS 的主要差别是用 ``O(h)`` 调用栈保存
路径，而 BFS 用队列直接表示当前层。当前题核心是层边界，公开实现选择 BFS。

复杂度分析
~~~~~~~~~~

重复寻层法时间为 ``O(nh)``，递归栈为 ``O(h)``。主解访问每个节点一次，外层反转只处理 ``h`` 个行对象，
总时间为 ``O(n)``；队列工作空间为 ``O(w)``，其中 ``w`` 是最大层宽。返回结果保存全部 ``n`` 个节点值，
其 ``O(n)`` 空间不计入工作空间。
