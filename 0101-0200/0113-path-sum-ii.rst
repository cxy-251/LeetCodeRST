0113. Path Sum II
=================

题目信息
--------

:题号: 0113. 路径总和 II
:难度: Medium
:主题: 二叉树、深度优先搜索、回溯、路径快照
:原题: `LeetCode 0113 <https://leetcode.com/problems/path-sum-ii/>`_
:重点: 从逐分支复制完整路径，推导到共享路径缓冲区的追加与撤销，并只在叶节点命中时复制结果

题目重述
--------

给定二叉树根节点 ``root`` 和整数 ``targetSum``，返回所有节点值之和等于目标的根到叶路径。每条答案用
从根到叶依次经过的节点值数组表示；叶节点必须同时没有左右孩子，内部节点处的前缀命中不能提交。

没有合法路径时返回空数组，多条路径在外层结果中的顺序不限。树中节点总数在 ``0..5000`` 范围内，节点值
与 ``targetSum`` 均在 ``-1000..1000`` 范围内，算法不修改树。

自建示例
--------

* 两条答案：``root = [6,2,9,1,4,-3,12]``、``targetSum = 12``，可返回
  ``[[6,2,4],[6,9,-3]]``；
* 前缀命中：``root = [3,1,5]``、``targetSum = 3``，返回 ``[]``，根不是叶节点；
* 负数路径：``root = [1,-2,-3,1,3,-2,null,-1]``、``targetSum = -1``，合法路径包括
  ``[1,-2,1,-1]``；
* 空树：``root = []``，返回 ``[]``。

C++ 实现
--------

.. code-block:: cpp

   #include <vector>

   class Solution {
   private:
       void collectWithCopies(TreeNode* node, int remaining, std::vector<int> path,
                              std::vector<std::vector<int>>& result) {
           if (!node) {
               return;
           }
           path.push_back(node->val);
           const int nextRemaining = remaining - node->val;
           if (!node->left && !node->right) {
               if (nextRemaining == 0) {
                   result.push_back(path);
               }
               return;
           }
           collectWithCopies(node->left, nextRemaining, path, result);
           collectWithCopies(node->right, nextRemaining, path, result);
       }

       void collectWithBacktracking(TreeNode* node, int remaining, std::vector<int>& path,
                                    std::vector<std::vector<int>>& result) {
           if (!node) {
               return;
           }
           path.push_back(node->val);
           const int nextRemaining = remaining - node->val;
           if (!node->left && !node->right) {
               if (nextRemaining == 0) {
                   result.push_back(path);
               }
           } else {
               collectWithBacktracking(node->left, nextRemaining, path, result);
               collectWithBacktracking(node->right, nextRemaining, path, result);
           }
           path.pop_back();
       }

   public:
       std::vector<std::vector<int>> pathSum(TreeNode* root, int targetSum) {
           std::vector<std::vector<int>> result;
           std::vector<int> path;
           collectWithBacktracking(root, targetSum, path, result);
           return result;
       }
   };

题解
----

枚举对象
~~~~~~~~

每个叶节点唯一对应一条根到叶路径，因此原始搜索空间就是树中的全部叶节点。深度优先搜索沿唯一父链到达每个
叶节点，在那里检查路径和；遍历所有叶节点便不会漏掉任何候选，也不会让同一路径被生成两次。

与只判断“是否存在”不同，本题必须返回每条见证路径。状态不能只保留剩余目标，还要知道从根到当前节点的
完整值序列；找到一条答案后也不能逻辑或短路，因为另一子树中可能还有其他合法路径。

逐分支复制
~~~~~~~~~~

``collectWithCopies`` 让 ``path`` 按值传递。每个递归调用获得父路径的独立副本，追加当前值后再进入孩子，
左右分支互不干扰，不需要显式撤销。这是最直接且正确的路径枚举实现。

代价是相同前缀被反复复制。深度为 ``d`` 的节点收到长度约为 ``d`` 的路径副本；即使最终没有答案，这些复制
也已发生。总工作可能达到所有节点深度之和，单侧树最坏为 ``O(n²)``。树结构已经让递归栈保存了当前父链，
没有必要再为每个分支复制同一份前缀。

共享路径回溯
~~~~~~~~~~~~

``collectWithBacktracking`` 在全部递归调用之间共享一个 ``path`` 缓冲区，并维护以下不变量：进入某个非空
节点前，``path`` 恰好保存从根到其父节点的值；追加 ``node->val`` 后，它恰好表示根到当前节点的路径。

每个状态按对称步骤工作：

#. 进入节点时 ``push_back`` 当前值；
#. 扣除当前值，处理叶节点或递归左右孩子；
#. 离开节点前 ``pop_back``，恢复父状态的路径。

撤销必须对所有出口执行，包括叶节点未命中时。代码把 ``pop_back`` 放在叶节点分支和递归分支之后，保证任何
非空调用都恰好追加一次、撤销一次；右兄弟开始时不会看到左兄弟遗留的节点值。

结果快照
~~~~~~~~

叶节点满足 ``nextRemaining == 0`` 时，``result.push_back(path)`` 必须复制当前路径。共享缓冲区随后还会
弹出和追加；若结果只引用同一个可变对象，回溯会篡改已经记录的答案。复制发生在确实产生输出时，是无法删除
的结果构造成本。

内部节点即使剩余值为零也不能保存。路径必须结束于叶节点，后续孩子仍属于完整路径的一部分。节点值允许为
负数，剩余值变为负数或零都不能作为剪枝条件。

状态走读
~~~~~~~~

对第一条答案 ``6 -> 2 -> 4``，共享缓冲区变化如下：

.. list-table::
   :header-rows: 1

   * - 动作
     - ``path``
     - ``nextRemaining``
     - 结果变化
   * - 进入 6
     - ``[6]``
     - 6
     - 无
   * - 进入 2
     - ``[6,2]``
     - 4
     - 无
   * - 进入叶 4
     - ``[6,2,4]``
     - 0
     - 复制 ``[6,2,4]``
   * - 离开 4
     - ``[6,2]``
     - 回到父状态
     - 已保存快照不变
   * - 离开 2
     - ``[6]``
     - 回到父状态
     - 继续搜索根的右子树

根的右分支随后复用 ``[6]``，生成 ``[6,9,-3]``。两条结果拥有独立向量，外层返回顺序虽由 DFS 决定，
但题目不要求特定顺序。

主解与输出复杂度
~~~~~~~~~~~~~~~~

公开入口采用共享缓冲区回溯，因为它只为当前递归路径保存一份可变前缀，并把复制推迟到真实答案产生时。

遍历树本身需要 ``O(n)`` 时间。设所有返回路径长度之和为 ``K``，结果快照必须复制 ``K`` 个值，总时间为
``O(n + K)``。递归栈与工作路径长度均为 ``O(h)``；返回结果占 ``O(K)`` 空间，不计入工作空间。逐分支复制
法除结果外还可能产生 ``O(nh)`` 级别的累计复制工作。
