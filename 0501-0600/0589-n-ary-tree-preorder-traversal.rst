0589. N-ary Tree Preorder Traversal
==================================

题目信息
--------

:题号: 0589
:难度: Easy
:主题: N 叉树、前序遍历、孩子顺序、值序列
:原题: `LeetCode 0589 <https://leetcode.com/problems/n-ary-tree-preorder-traversal/>`_
:重点: 先访问当前节点、再按 children 从左到右递归访问各子树、空树返回空数组

题目重述
--------

给定一棵 N 叉树的根节点 ``root``，返回它的前序遍历节点值序列。

前序遍历先访问当前节点，再按照节点 ``children`` 数组中的既定顺序，从左到右遍历每棵子树。不能任意调整兄弟节点顺序；若树为空，返回空数组。

自建示例
--------

节点拥有不同数量的孩子：

.. code-block:: text

   输入：根 1 的孩子为 [2,3,4]，3 的孩子为 [5,6]
   输出：[1,2,3,5,6,4]
   解释：先访问根 1，再依次遍历 2 的子树、3 的子树和 4 的子树。

空树：

.. code-block:: text

   输入：root = null
   输出：[]
   解释：没有可访问节点。

栈模拟从左到右的前序顺序
------------------------

栈顶是下一次访问节点；弹出当前节点后，将其孩子从右到左压栈，最左孩子就会先出栈。节点值在压入子树之前记录，符合“根、左孩子、右孩子”的前序定义。

C++ 实现
--------

.. code-block:: cpp

   class Solution {
   public:
       std::vector<int> preorder(Node* root) {
           if (root == nullptr) return {};
           std::vector<int> result;
           std::stack<Node*> stack;
           stack.push(root);
           while (!stack.empty()) {
               Node* node = stack.top();
               stack.pop();
               result.push_back(node->val);
               for (auto it = node->children.rbegin();
                    it != node->children.rend(); ++it) {
                   stack.push(*it);
               }
           }
           return result;
       }
   };

代码分析
--------

反向压入孩子使出栈顺序与原 children 顺序一致，每个节点只弹出一次。时间复杂度为 ``O(n)``，栈空间为 ``O(h)`` 到 ``O(n)``。
