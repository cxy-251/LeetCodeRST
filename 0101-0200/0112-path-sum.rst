0112. Path Sum
==============

题目信息
--------

:题号: 0112. 路径总和
:难度: Easy
:主题: 二叉树、根到叶路径、深度优先搜索、剩余目标
:原题: `LeetCode 0112 <https://leetcode.com/problems/path-sum/>`_
:重点: 从保存完整路径压缩为剩余目标，严格限定叶节点成功条件，并利用存在性目标短路搜索

题目重述
--------

给定二叉树根节点 ``root`` 和整数 ``targetSum``，判断是否存在一条从根开始、在叶节点结束的向下路径，使
路径中所有节点值之和恰好等于 ``targetSum``。

叶节点必须同时没有左孩子和右孩子；内部节点处的前缀和即使等于目标，也不能提前算作成功。空树没有根到叶
路径，返回 ``false``。树中节点总数在 ``0..5000`` 范围内，节点值与 ``targetSum`` 均在
``-1000..1000`` 范围内，算法不修改树。

自建示例
--------

* 存在目标路径：``root = [6,2,9,1,4,-3,12]``、``targetSum = 12``，返回 ``true``，路径为
  ``6 -> 2 -> 4``；
* 前缀命中但未到叶：``root = [6,2,null,4]``、``targetSum = 8``，返回 ``false``。``6 -> 2`` 的和
  是 ``8``，但节点 ``2`` 还有孩子；
* 负数抵消：``root = [2,-3,4]``、``targetSum = -1``，返回 ``true``，不能按剩余值正负剪枝；
* 空树：``root = []``，返回 ``false``。

C++ 实现
--------

.. code-block:: cpp

   #include <stack>
   #include <utility>

   class Solution {
   private:
       bool recursiveRemaining(TreeNode* node, int remaining) {
           if (!node) {
               return false;
           }
           const int nextRemaining = remaining - node->val;
           if (!node->left && !node->right) {
               return nextRemaining == 0;
           }
           return recursiveRemaining(node->left, nextRemaining) ||
                  recursiveRemaining(node->right, nextRemaining);
       }

       bool iterativeRemaining(TreeNode* root, int targetSum) {
           if (!root) {
               return false;
           }
           std::stack<std::pair<TreeNode*, int>> pending;
           pending.push({root, targetSum});
           while (!pending.empty()) {
               const auto [node, remaining] = pending.top();
               pending.pop();
               const int nextRemaining = remaining - node->val;
               if (!node->left && !node->right && nextRemaining == 0) {
                   return true;
               }
               if (node->right) {
                   pending.push({node->right, nextRemaining});
               }
               if (node->left) {
                   pending.push({node->left, nextRemaining});
               }
           }
           return false;
       }

   public:
       bool hasPathSum(TreeNode* root, int targetSum) {
           return recursiveRemaining(root, targetSum);
       }
   };

题解
----

原始路径枚举
~~~~~~~~~~~~

答案存在于某一条根到叶路径，最直接的正确方案是深度优先枚举全部路径：进入节点时把值加入当前路径，到叶
节点时求和并与 ``targetSum`` 比较，回到父节点时撤销当前节点。所有合法终点都会被检查，因此不会漏解。

但后续分支并不关心祖先节点分别是什么，只关心它们的和。保存节点数组、在叶节点重新累加、回溯删除路径尾
三项工作都超过了布尔判断所需的信息。沿树向下时，路径和只需一个整数状态。

剩余目标
~~~~~~~~

可以携带当前前缀和，也可以把等式移项后维护剩余目标。进入节点前令 ``remaining`` 表示当前路径尚需提供的
总和；选择 ``node`` 后，传给孩子的状态为：

.. code-block:: text

   nextRemaining = remaining - node.value

完整路径命中等价于在叶节点得到 ``nextRemaining == 0``。``recursiveRemaining`` 因而不再保存路径，也不在
每个叶节点重新求和；每个递归分支只复制一个独立的整数。

叶节点边界
~~~~~~~~~~

目标相等只能在叶节点判断成功。第二个示例进入节点 ``2`` 后剩余值变成 ``0``，但该节点还有孩子，路径尚未
完成；继续进入 ``4`` 后剩余值变成 ``-4``，最终返回假。

空指针也不是叶节点。递归到空孩子返回 ``false``，避免把只有一个孩子的内部节点通过空分支误判为完整路径。
代码先计算当前节点后的剩余值，再以“左右孩子都空”确认合法终点。

节点值允许为负数，不能根据 ``nextRemaining`` 的正负或是否已经为零剪枝。剩余值为负时，后续负节点仍可能
精确满足目标；剩余值为零时，后续正负值也可能抵消。安全的提前结束只有叶节点命中，或某个分支已经返回真。

状态走读
~~~~~~~~

对 ``targetSum = 12`` 的第一个示例，目标路径状态如下：

.. list-table::
   :header-rows: 1

   * - 当前节点
     - 进入前 ``remaining``
     - 扣除节点后
     - 分支含义
   * - 6
     - 12
     - 6
     - 还需子路径和为 6
   * - 2
     - 6
     - 4
     - 还需子路径和为 4
   * - 4
     - 4
     - 0
     - 叶节点精确命中

逻辑或先搜索左子树。左侧一旦找到上述路径，存在性结论已经确定，右子树无需访问；本题只问是否存在，不需要
比较路径优劣，所以短路不会丢失必要答案。

显式栈替代
~~~~~~~~~~

递归调用栈实际保存的是尚待处理的 ``(node, remaining)`` 状态。``iterativeRemaining`` 把同一状态放入显式
栈：弹出节点后扣除当前值，再把孩子与新的剩余值一起压入。树没有回边，每个节点只有唯一父路径，因此不需要
访问集合。

代码先压右孩子、再压左孩子，只是让后进先出的栈优先模拟递归的左分支；交换顺序不影响正确性。公开入口采用
递归版，因为它最直接表达“当前路径满足或左、右任一分支满足”的状态定义；显式栈适合避免深递归的场景。

复杂度分析
~~~~~~~~~~

最坏访问全部 ``n`` 个节点，时间 ``O(n)``；提前命中时会短路。递归栈或显式 DFS 栈最多保存 ``O(h)`` 个
路径状态，其中 ``h`` 是树高。路径数组已被删除，返回值只占常数空间。按题目范围，路径和在 32 位整数内。
