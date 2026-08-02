0257. Binary Tree Paths
=======================

题目信息
--------

:题号: 0257
:难度: Easy
:主题: 二叉树、根到叶路径、深度优先搜索、字符串
:原题: `LeetCode 0257 <https://leetcode.com/problems/binary-tree-paths/>`_
:重点: 只收集根到叶节点的完整路径、使用 ``->`` 连接节点值、结果顺序不限

题目重述
--------

给定一棵非空二叉树的根节点 ``root``，返回树中所有从根节点到叶节点的路径。叶节点是左右子节点都为空的节点；路径必须在叶节点处结束，不能把通往内部节点的前缀当作答案。

每条路径以字符串表示，节点值按访问顺序排列，相邻节点之间使用 ``"->"`` 连接。树中节点数位于 ``[1, 100]``，节点值位于 ``[-100, 100]``。多个路径可以按任意顺序返回，函数不需要修改树的结构或节点值。

自建示例
--------

存在不同深度的叶节点：

.. code-block:: text

   输入：root = [8, 3, 10, 1, 6, null, 14]
   输出：["8->3->1", "8->3->6", "8->10->14"]
   解释：节点 1、6 和 14 的左右子节点都为空，因此三条从根到它们的路径都是答案；输出顺序也可以不同。

只有一个节点：

.. code-block:: text

   输入：root = [-4]
   输出：["-4"]
   解释：根节点本身也是叶节点，所以唯一的根到叶路径只包含它自身。

DFS 只在叶节点收集路径
----------------------

递归参数保存当前节点和从根到当前节点的字符串。进入节点时追加节点值；
若左右孩子都为空，当前字符串才是一条完整答案。若当前节点是内部节点，则分别递归非空孩子，
不能在这里提前收集，否则会把根到内部节点的前缀误当成根到叶路径。

为了避免每次递归复制整条字符串，使用回溯：记住进入前的长度，追加当前节点和连接符，
处理完左右子树后恢复到旧长度。负数通过 ``std::to_string`` 直接格式化，连接符只出现在相邻节点之间。

正确性说明
----------

递归进入一个节点时，路径字符串恰好是根到该节点的唯一路径。若它是叶节点，字符串满足答案定义；
若不是叶节点，所有合法根到叶路径都必须继续进入其左或右非空子树，递归会覆盖这两种选择。
回溯只恢复局部字符串，不改变已经加入结果的副本，因此每条叶路径恰好被收集一次。

C++ 实现
--------

.. code-block:: cpp

   class Solution {
       void collect(TreeNode* node, std::string& path,
                    std::vector<std::string>& answer) {
           const std::size_t old_size = path.size();
           if (!path.empty()) path += "->";
           path += std::to_string(node->val);

           if (node->left == nullptr && node->right == nullptr) {
               answer.push_back(path);
           } else {
               if (node->left != nullptr) collect(node->left, path, answer);
               if (node->right != nullptr) collect(node->right, path, answer);
           }
           path.resize(old_size);
       }

   public:
       std::vector<std::string> binaryTreePaths(TreeNode* root) {
           std::vector<std::string> answer;
           if (root == nullptr) return answer;
           std::string path;
           collect(root, path, answer);
           return answer;
       }
   };

代码分析
--------

每个节点只访问一次；追加路径和复制叶路径的成本与输出字符串长度相关，遍历本身为 ``O(n)``，
总时间可写为 ``O(n + 输出总字符数)``。回溯字符串和递归栈占 ``O(h)``，结果数组的空间属于输出，
树结构和值均不修改。
