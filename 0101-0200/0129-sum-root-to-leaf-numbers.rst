0129. Sum Root to Leaf Numbers
==============================

题目信息
--------

:题号: 0129. 求根节点到叶节点数字之和
:难度: Medium
:主题: 二叉树、深度优先搜索、路径状态、十进制前缀
:原题: `LeetCode 0129 <https://leetcode.com/problems/sum-root-to-leaf-numbers/>`_
:重点: 将完整路径压缩为十进制前缀，只在真正叶节点结算，并理解递归参数与显式栈元素的对应关系

题目重述
--------

给定一棵二叉树，每个节点保存 ``0..9`` 的一个数字。每条从根节点到叶节点的路径，按访问顺序组成一个
十进制整数；返回所有这些整数之和。只有左右孩子都为空的节点才是叶节点，路径中的前导零按普通整数规则
处理。题目保证最终答案可用 32 位有符号整数表示。

自建示例
--------

* ``root = [3, 1, 7, 0, 4]``：三条路径表示 ``310``、``314``、``37``，返回 ``661``；
* ``root = [0, null, 6, null, 2]``：唯一数字是 ``062``，数值为 ``62``；
* ``root = [5, 2, null, 9]``：节点 ``2`` 仍有左孩子，不是叶子；唯一完整路径为 ``5 -> 2 -> 9``，
  返回 ``529``。

C++ 实现
--------

.. code-block:: cpp

   #include <stack>
   #include <utility>
   #include <vector>

   class Solution {
   private:
       void collectCompletePath(
           TreeNode* node,
           std::vector<int>& digits,
           long long& total
       ) {
           if (node == nullptr) {
               return;
           }
           digits.push_back(node->val);
           if (node->left == nullptr && node->right == nullptr) {
               long long number = 0;
               for (int digit : digits) {
                   number = number * 10 + digit;
               }
               total += number;
           } else {
               collectCompletePath(node->left, digits, total);
               collectCompletePath(node->right, digits, total);
           }
           digits.pop_back();
       }

       long long sumWithPrefix(TreeNode* node, long long parentPrefix) {
           if (node == nullptr) {
               return 0;
           }
           const long long current = parentPrefix * 10 + node->val;
           if (node->left == nullptr && node->right == nullptr) {
               return current;
           }
           return sumWithPrefix(node->left, current) +
                  sumWithPrefix(node->right, current);
       }

       long long sumWithExplicitStack(TreeNode* root) {
           if (root == nullptr) {
               return 0;
           }
           std::stack<std::pair<TreeNode*, long long>> pending;
           pending.push({root, 0});
           long long total = 0;

           while (!pending.empty()) {
               auto [node, parentPrefix] = pending.top();
               pending.pop();
               const long long current = parentPrefix * 10 + node->val;
               if (node->left == nullptr && node->right == nullptr) {
                   total += current;
                   continue;
               }
               if (node->right != nullptr) {
                   pending.push({node->right, current});
               }
               if (node->left != nullptr) {
                   pending.push({node->left, current});
               }
           }
           return total;
       }

   public:
       int sumNumbers(TreeNode* root) {
           return static_cast<int>(sumWithPrefix(root, 0));
       }
   };

题解
----

原始做法：先保存路径，再在叶子解释它
~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

从根到叶的选择空间天然是一棵树：到达节点后，下一步可能进入左孩子或右孩子。最直接的 DFS 用
``digits`` 保存当前路径；进入节点时追加一位，退出时弹出一位。到达叶子后再从头扫描整个数组，按十进制
规则还原数字并加入总和。

``collectCompletePath`` 的回溯状态是正确的：递归进入某节点时，``digits`` 恰好包含根到该节点的路径；
返回父节点前弹出当前位，左右分支不会互相污染。可是多个叶子共享长前缀时，每个叶子都会再次遍历相同的
前缀。保存每一位也超过了后续计算真正需要的信息。

结构信息：追加一位只依赖已有数值
~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

若父路径已经表示整数 ``prefix``，在末尾追加当前数字 ``digit`` 的结果固定为：

.. code-block:: text

   current = prefix * 10 + digit

后续无论再追加哪一位，都只需要 ``current``，不需要知道此前各位分别是什么。于是完整路径数组可以压缩为
一个十进制前缀：递归参数携带父节点之前的值，进入当前节点时更新一次，再把同一个 ``current`` 分别交给
左右子树。

这个状态也自然处理前导零。例如 ``0 -> 6 -> 2`` 依次得到 ``0``、``6``、``62``，无需构造字符串、删除
零或单独解析。

叶节点是唯一结算点
~~~~~~~~~~~~~~~~~~

路径必须从根结束于叶子。只有 ``left == nullptr && right == nullptr`` 同时成立，``current`` 才代表一条
完整答案。只判断“至少一个孩子为空”会把单孩子树中的内部节点提前结算；例如 ``5 -> 2 -> 9`` 中节点
``2`` 的右孩子为空，但 ``52`` 并不是合法根到叶数字。

空指针分支返回零，表示这侧没有叶子、对总和没有贡献。非叶节点的所有完整路径要么进入左子树，要么进入
右子树，两组叶子互不重叠，因此两次递归的返回值可直接相加。

具体走读
~~~~~~~~

对 ``[3, 1, 7, 0, 4]``，递归状态按路径演进如下：

.. list-table::
   :header-rows: 1

   * - 当前节点
     - 父前缀
     - 更新后 ``current``
     - 动作
   * - ``3``
     - ``0``
     - ``3``
     - 非叶，传给两个孩子
   * - ``1``
     - ``3``
     - ``31``
     - 非叶，继续进入 ``0`` 与 ``4``
   * - ``0``
     - ``31``
     - ``310``
     - 叶子，返回 ``310``
   * - ``4``
     - ``31``
     - ``314``
     - 叶子，返回 ``314``
   * - ``7``
     - ``3``
     - ``37``
     - 叶子，返回 ``37``

节点 ``1`` 返回 ``310 + 314``，根节点再加右侧 ``37``。前缀 ``31`` 只计算一次并传给两个分支，没有在
两个叶子处重新扫描 ``3, 1``。

递归与显式栈的状态对应
~~~~~~~~~~~~~~~~~~~~~~

``sumWithPrefix`` 的一次函数调用隐含保存 ``(node, parentPrefix)``。``sumWithExplicitStack`` 把这对状态
直接放进 ``pending``，弹出后执行完全相同的前缀更新和叶子判断。先压右孩子再压左孩子只是让左侧先处理，
不影响加法结果；树中节点有唯一父路径，也不需要访问集合。

显式栈不是更优的渐进算法，而是在树很深、希望避免递归调用栈时的实现替代。主解选择递归前缀，因为状态
转移和子树返回值的含义最直接；路径数组法保留为演进起点，显式栈则展示递归帧究竟保存了什么。

正确性与复杂度
~~~~~~~~~~~~~~

每个叶节点在树中只有一条根路径。DFS 恰好访问该叶子一次，并通过逐位递推得到这条路径的十进制值，所以
每个合法数字加入一次；内部节点从不结算，因此没有额外数字。每个节点只做常数工作，主解时间 ``O(n)``、
递归空间 ``O(h)``，其中 ``h`` 为树高。显式栈最坏占 ``O(n)``；完整路径基线还会在每个叶子重新扫描路径，
最坏时间可达 ``O(nh)``。代码使用 ``long long`` 保存中间前缀与部分和，再按题目保证转换为 ``int``。
