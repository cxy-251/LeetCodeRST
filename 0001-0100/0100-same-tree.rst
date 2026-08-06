0100. Same Tree
===============

题目信息
--------

:题号: 0100
:难度: Easy
:主题: 二叉树、递归、广度优先搜索、深度优先搜索
:原题: `LeetCode 0100 <https://leetcode.com/problems/same-tree/>`_
:重点: 从带空标记的完整表示，推导到直接同步比较对应节点

题目重述
--------

给定两棵二叉树 ``p`` 和 ``q``，判断它们是否完全相同。

完全相同需要同时满足：

* 两棵树在每个对应位置都同时为空或同时存在节点；
* 每一对对应非空节点的值相等；
* 左孩子只能与左孩子对应，右孩子只能与右孩子对应。

两棵树的节点数都在 ``0..100`` 范围内，节点值在 ``-10^4..10^4`` 范围内。

自建示例
--------

.. code-block:: text

   输入：
   p（层序）= [7,3,9,null,5]
   q（层序）= [7,3,9,5]

   输出：false

两棵树包含相同的节点值，但值 5 在 ``p`` 中是节点 3 的右孩子，在 ``q`` 中是左孩子，
对应位置的空节点不同。

.. code-block:: text

   输入：
   p（层序）= [4,2,6]
   q（层序）= [4,2,6]

   输出：true

每个对应位置的结构和节点值都相同。

.. code-block:: text

   输入：p = []，q = []
   输出：true

两个根节点都为空时，两棵空树完全相同。

C++ 实现
--------

.. code-block:: cpp

   #include <queue>
   #include <stack>
   #include <string>
   #include <utility>

   class Solution {
   private:
       void serialize(TreeNode* node, std::string& output) {
           if (!node) {
               output += "#,";
               return;
           }

           output += std::to_string(node->val) + ",";
           serialize(node->left, output);
           serialize(node->right, output);
       }

       bool serializedComparison(TreeNode* first, TreeNode* second) {
           std::string first_tree;
           std::string second_tree;
           serialize(first, first_tree);
           serialize(second, second_tree);
           return first_tree == second_tree;
       }

       bool recursivePair(TreeNode* first, TreeNode* second) {
           if (!first || !second) {
               return first == second;
           }
           if (first->val != second->val) {
               return false;
           }

           return recursivePair(first->left, second->left) &&
                  recursivePair(first->right, second->right);
       }

       bool breadthFirstPairs(TreeNode* first, TreeNode* second) {
           std::queue<std::pair<TreeNode*, TreeNode*>> pending;
           pending.push({first, second});

           while (!pending.empty()) {
               auto [left_tree, right_tree] = pending.front();
               pending.pop();

               if (!left_tree || !right_tree) {
                   if (left_tree != right_tree) {
                       return false;
                   }
                   continue;
               }
               if (left_tree->val != right_tree->val) {
                   return false;
               }

               pending.push({left_tree->left, right_tree->left});
               pending.push({left_tree->right, right_tree->right});
           }
           return true;
       }

       bool depthFirstPairs(TreeNode* first, TreeNode* second) {
           std::stack<std::pair<TreeNode*, TreeNode*>> pending;
           pending.push({first, second});

           while (!pending.empty()) {
               auto [left_tree, right_tree] = pending.top();
               pending.pop();

               if (!left_tree || !right_tree) {
                   if (left_tree != right_tree) {
                       return false;
                   }
                   continue;
               }
               if (left_tree->val != right_tree->val) {
                   return false;
               }

               pending.push({left_tree->right, right_tree->right});
               pending.push({left_tree->left, right_tree->left});
           }
           return true;
       }

   public:
       bool isSameTree(TreeNode* p, TreeNode* q) {
           return recursivePair(p, q);
       }
   };

题解
----

遍历值不足
~~~~~~~~~~

只记录非空节点的遍历值会丢失结构。例如下面两棵树的前序值都为 ``1,2``：

.. code-block:: text

       1          1
      /            \
     2              2

因此完整序列化必须同时写入空节点标记。前序序列化中的 ``#,`` 表示一个确定的空位置，
逗号则避免 ``1,23`` 与 ``12,3`` 一类拼接歧义。两份完整表示相同，树的值和结构才都相同。

成对状态
~~~~~~~~

序列化分别构造两棵树的完整表示，但真正需要检查的是每一对对应位置。
定义 ``same(first, second)`` 为两棵对应子树是否完全相同，每次只有三种情况：

#. 两者都为空，当前位置相同；
#. 只有一者为空，结构已经不同；
#. 两者都非空，先比较值，再比较左右同方向子树。

.. code-block:: text

   same(first, second) =
       first.value == second.value
       AND same(first.left,  second.left)
       AND same(first.right, second.right)

空节点配对
~~~~~~~~~~

条件 ``if (!first || !second) return first == second`` 同时处理两个空节点分支：

* 两者都是 ``nullptr``，指针相等，返回 ``true``；
* 只有一个是 ``nullptr``，指针不等，返回 ``false``。

空节点不是可以忽略的数据缺失，而是树形的一部分。示例中左孩子与右孩子互换，
正是在某个对应位置形成 ``(nullptr, node)``，因此立即失败。

方向保持
~~~~~~~~

本题比较的是相同树，不是镜像树。递归必须固定比较：

.. code-block:: text

   first.left  对 second.left
   first.right 对 second.right

若交叉比较左右孩子，判断的将是镜像关系，无法保证对应位置一致。

递归完整性
~~~~~~~~~~

根节点对检查完成后，问题被拆成左右两个互不重叠的子树对。每个节点只有唯一父节点，
所以每个对应位置最多访问一次。任意值差异会在非空节点比较时发现，任意结构差异会在
空节点配对时发现；全部递归分支都返回真时，两棵树的所有对应位置均相同。

显式容器
~~~~~~~~

递归调用栈保存尚待比较的节点对。也可以把这些状态放入显式容器：

* 队列按层比较，先发现靠近根部的差异；
* 栈按深度比较，与递归控制流接近；
* 两者弹出节点对后，都执行相同的空节点和值检查。

队列和栈只改变状态处理顺序，不改变判断规则。发现首个差异时都可以立即返回 ``false``。

复杂度
~~~~~~

设两棵树较小节点数为 ``n``，完全相同时需要比较全部对应节点，时间为 ``O(n)``。
递归和显式栈最多保存 ``O(h)`` 个沿深度方向的状态，``h`` 为树高；队列最坏保存
``O(n)`` 个同层节点对。序列化方法还需要 ``O(n)`` 中间字符串空间。
