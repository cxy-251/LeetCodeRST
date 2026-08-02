0501. Find Mode in Binary Search Tree
=====================================

题目信息
--------

:题号: 0501
:难度: Easy
:主题: 二叉搜索树、频率统计、并列众数
:原题: `LeetCode 0501 <https://leetcode.com/problems/find-mode-in-binary-search-tree/>`_
:重点: BST 允许重复值、众数按出现次数定义、可能存在多个并列众数、结果顺序不限

题目重述
--------

给定一棵允许出现重复值的二叉搜索树，找出树中出现次数最多的所有节点值。若多个不同值具有相同的最高频率，需要全部返回，排列顺序不限。

树中节点数位于 ``[1, 10^4]``，节点值位于 ``[-10^5, 10^5]``。统计对象是节点值的出现次数，而不是节点引用；同一个值在不同节点中出现时需要累计。

自建示例
--------

存在多个并列众数：

.. code-block:: text

   输入：root = [4,2,6,2,3,5,6]
   输出：[2,6]
   解释：数值 2 和 6 都出现两次，其余数值各出现一次，因此二者都是众数；返回顺序可以交换。

只有一个节点：

.. code-block:: text

   输入：root = [9]
   输出：[9]
   解释：树中唯一的值自然具有最高频率。

利用中序遍历的连续相同值
------------------------

BST 的中序遍历按非递减顺序访问节点，因此同一个值会形成连续的一段。扫描这段序列时维护当前值及其连续出现次数；次数超过历史最大值就清空答案并换成当前值，次数相等则追加当前值。这样无需单独的频率哈希表，也能处理允许重复值的 BST。

代码使用 Morris 中序遍历，把临时线索接到当前节点的前驱上，访问完左子树后立即恢复指针。遍历结束时树的结构与输入相同，且不依赖递归栈。

C++ 实现
--------

.. code-block:: cpp

   class Solution {
   public:
       std::vector<int> findMode(TreeNode* root) {
           std::vector<int> result;
           TreeNode* current = root;
           int previous = 0;
           int run = 0;
           int best = 0;
           bool hasPrevious = false;

           auto visit = [&](int value) {
               if (!hasPrevious || value != previous) {
                   previous = value;
                   run = 1;
                   hasPrevious = true;
               } else {
                   ++run;
               }
               if (run > best) {
                   best = run;
                   result.clear();
                   result.push_back(value);
               } else if (run == best) {
                   result.push_back(value);
               }
           };

           while (current != nullptr) {
               if (current->left == nullptr) {
                   visit(current->val);
                   current = current->right;
                   continue;
               }
               TreeNode* predecessor = current->left;
               while (predecessor->right != nullptr &&
                      predecessor->right != current) {
                   predecessor = predecessor->right;
               }
               if (predecessor->right == nullptr) {
                   predecessor->right = current;
                   current = current->left;
               } else {
                   predecessor->right = nullptr;
                   visit(current->val);
                   current = current->right;
               }
           }
           return result;
       }
   };

代码分析
--------

把问题先从“树上的频率统计”转换成“有序序列中的连续段统计”。BST 的中序遍历会按非递减顺序输出节点值；即使树允许重复值，相同值也一定连续出现。因此，某个值在整棵树中的出现次数，正好就是中序序列中对应连续段的长度，不必为每个值再建立哈希表。

扫描中序序列的前缀时，``previous`` 和 ``run`` 描述当前连续段，``best`` 记录已经见过的最大段长。若当前段长度超过 ``best``，旧答案全部失效；若恰好等于 ``best``，当前值与旧众数并列。一个值在有序序列中只有一个连续段，所以它只会在段长第一次达到当前最高值时加入一次答案；后续相同值只会让 ``run`` 继续增加，若超过最高值则清空并重新建立答案。

代码没有使用递归中序，而是使用 Morris 遍历。当前节点没有左子树时可以立即访问；有左子树时，先找到左子树最右节点作为前驱，第一次遇到当前节点就建立一条临时线索并转入左子树，第二次沿线索返回时删除线索、访问当前节点，再转向右子树。这个过程既保持了中序顺序，也把递归栈省为常量空间。每条线索在离开对应子树时都会恢复，因此函数返回后不会改变原树结构。

以中序序列 ``[2,2,3,4,5,6,6]`` 为例：值 2 的连续段长度为 2，值 6 的连续段后来也达到 2，于是答案保留 ``[2,6]``；如果某个后续段达到 3，就说明此前所有长度 2 的值都不再是众数，答案会先清空，再只保留这个长度 3 的值。

正确性可以分成三点：中序序列中的连续段长度等于对应值的总频率；``run`` 与 ``best`` 的更新规则恰好保留所有且仅保留最高频率值；Morris 遍历恰好访问每个节点一次并恢复所有临时指针。因此最终返回的集合就是整棵树的全部众数。

``visit`` 只负责维护一个连续段和答案，Morris 主循环只负责按中序顺序提供节点值，二者职责分离且与上述不变量一一对应。每个节点至多被建立线索、恢复线索并访问一次，时间复杂度为 ``O(n)``；除返回结果外，临时线索和局部变量占用 ``O(1)`` 额外空间。
