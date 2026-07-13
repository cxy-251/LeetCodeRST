0112. Path Sum
==============

题目信息
--------

:题号: 0112
:难度: Easy
:主题: 二叉树、深度优先搜索、路径状态、短路
:原题: `LeetCode 0112 <https://leetcode.com/problems/path-sum/>`_
:访问状态: Available
:教学重点: 根到叶限定、剩余目标、负数路径、数值宽度

题目重述
--------

给定一棵二叉树和整数 ``targetSum``，判断是否存在一条从根节点开始、在叶节点结束的向下路径，使路径上所有节点
值之和恰好等于目标值。

路径必须沿父子链接向下，不能在中间节点提前结束，也不能从非根节点开始。空树没有合法路径。函数只读树。

自建示例
--------

存在合法路径
~~~~~~~~~~~~

.. code-block:: text

            5
          /   \
         4     8
        /     / \
       11    13  4
      /  \        \
     7    2        1

   targetSum = 22
   路径：5 -> 4 -> 11 -> 2
   输出：true

前缀和等于目标但不是叶节点
~~~~~~~~~~~~~~~~~~~~~~~~~~

.. code-block:: text

       1
      /
     2
    /
   3

   targetSum = 3
   输出：false

路径 ``1 -> 2`` 的和已经是 3，但节点 ``2`` 还有孩子，不能在这里结束。

包含负数
~~~~~~~~

.. code-block:: text

       -2
         \
         -3

   targetSum = -5
   输出：true

问题抽象
--------

沿当前根到节点路径维护“尚需凑出的剩余目标”：

.. code-block:: text

   remaining_after_node = remaining_before_node - node.val

到达叶节点时，若剩余目标恰好等于叶节点值，当前完整根到叶路径满足要求。非叶节点即使前缀和已经等于目标，也
必须继续向下。

递归状态 ``search(node, remaining)`` 只需要当前节点和进入该节点前的剩余目标，不需要保存完整路径数组。

解法选择
--------

.. list-table::
   :header-rows: 1

   * - 方法
     - 时间复杂度
     - 工作空间
     - 定位
   * - DFS 传递剩余目标
     - 最坏 ``O(n)``
     - ``O(h)``
     - 主解法；状态最小并可短路
   * - BFS 保存节点与累计和
     - 最坏 ``O(n)``
     - ``O(w)``
     - 避免递归深度，队列状态更大
   * - 枚举并保存全部根到叶路径
     - ``O(n)`` 加输出复制
     - 最坏 ``O(nh)``
     - 为布尔问题保存过多载荷

主解法：DFS 传递剩余目标
------------------------

状态定义与核心不变量
~~~~~~~~~~~~~~~~~~~~

``search(node, remaining)`` 的含义是：从 ``node`` 出发，是否存在一条到其子树叶节点的路径，其节点值之和等于
``remaining``。

进入调用时：

* ``remaining`` 等于原目标减去当前节点之前所有祖先值；
* 当前节点尚未从剩余目标中扣除；
* 调用只搜索当前节点子树；
* 输入树保持不变。

若当前节点是叶节点，返回 ``remaining == node.val``。否则令：

.. code-block:: text

   next = remaining - node.val

再搜索左、右孩子。逻辑或允许左侧成功后跳过右侧。

为什么必须在叶节点比较
~~~~~~~~~~~~~~~~~~~~~~

题目要求根到叶路径。若在任意内部节点发现 ``remaining == node.val`` 就返回真，会接受尚未到叶节点的前缀。
叶节点检查把“和相等”与“路径终点合法”同时锁定。

负数为什么不需要剪枝
~~~~~~~~~~~~~~~~~~~~

节点值可以为负数，因此 ``remaining`` 变小、变大或改变符号都不能说明后续不可能成功。算法不使用
``remaining < 0`` 等剪枝。只有到叶节点时才能最终判断。

正确性依据
~~~~~~~~~~

对子树结构做归纳。

**基础情况。** 空节点没有从当前状态到叶节点的路径，返回假。叶节点只有一条候选路径，即只包含自身；
``remaining == node.val`` 当且仅当该路径满足目标。

**归纳步骤。** 非叶节点的任意合法路径必须先包含当前节点，然后进入左孩子或右孩子。扣除当前值后，剩余部分
需要在对应孩子子树中凑出 ``remaining - node.val``。按归纳假设，两个递归调用准确判断左右所有候选路径，
逻辑或因此完整且无遗漏。

**无伪阳性。** 只有叶节点比较成功，返回真的路径必然从原根开始、沿父子边向下并在叶节点结束。

**终止性。** 每次递归进入严格更小的子树，有限树最终到空节点或叶节点。

复杂度与数值边界
~~~~~~~~~~~~~~~~

* 最坏访问全部 ``n`` 个节点，时间 ``O(n)``；
* 找到一条路径后通过短路停止，实际访问量可能更少；
* 调用栈 ``O(h)``，退化树最坏 ``O(n)``；
* 返回布尔量，没有路径结果容器；
* 固定宽语言内部使用 64 位剩余目标，先扩宽 ``targetSum`` 和节点值再减法；
* TypeScript ``number`` 在题目路径和范围内保持安全整数；
* R 数值默认双精度，当前整数范围可精确表示。

核心语言实现
------------

C
~

.. code-block:: c

   #include <stdbool.h>

   static bool search_path(
       const struct TreeNode *root,
       long long remaining
   ) {
       if (root == NULL) {
           return false;
       }

       if (root->left == NULL && root->right == NULL) {
           return remaining == (long long)root->val;
       }

       const long long next = remaining - (long long)root->val;
       return search_path(root->left, next) ||
           search_path(root->right, next);
   }

   bool hasPathSum(struct TreeNode *root, int targetSum) {
       return search_path(root, (long long)targetSum);
   }

C++
~~~

.. code-block:: cpp

   class Solution {
       bool search(TreeNode* root, long long remaining) {
           if (root == nullptr) {
               return false;
           }
           if (root->left == nullptr && root->right == nullptr) {
               return remaining == static_cast<long long>(root->val);
           }

           const long long next = remaining - root->val;
           return search(root->left, next) || search(root->right, next);
       }

   public:
       bool hasPathSum(TreeNode* root, int targetSum) {
           return search(root, static_cast<long long>(targetSum));
       }
   };

Python
~~~~~~

.. code-block:: python

   class Solution:
       def hasPathSum(
           self,
           root: Optional[TreeNode],
           targetSum: int,
       ) -> bool:
           if root is None:
               return False

           if root.left is None and root.right is None:
               return targetSum == root.val

           remaining = targetSum - root.val
           return self.hasPathSum(root.left, remaining) or self.hasPathSum(
               root.right,
               remaining,
           )

Java
~~~~

.. code-block:: java

   class Solution {
       public boolean hasPathSum(TreeNode root, int targetSum) {
           return search(root, (long) targetSum);
       }

       private boolean search(TreeNode root, long remaining) {
           if (root == null) {
               return false;
           }
           if (root.left == null && root.right == null) {
               return remaining == root.val;
           }

           long next = remaining - (long) root.val;
           return search(root.left, next) || search(root.right, next);
       }
   }

Rust
~~~~

.. code-block:: rust

   use std::cell::RefCell;
   use std::rc::Rc;

   impl Solution {
       pub fn has_path_sum(
           root: Option<Rc<RefCell<TreeNode>>>,
           target_sum: i32,
       ) -> bool {
           fn search(
               root: Option<Rc<RefCell<TreeNode>>>,
               remaining: i64,
           ) -> bool {
               let Some(node) = root else {
                   return false;
               };

               let node_ref = node.borrow();
               let value = i64::from(node_ref.val);
               let is_leaf = node_ref.left.is_none() && node_ref.right.is_none();
               let left = node_ref.left.clone();
               let right = node_ref.right.clone();
               drop(node_ref);

               if is_leaf {
                   return remaining == value;
               }
               let next = remaining - value;
               search(left, next) || search(right, next)
           }

           search(root, i64::from(target_sum))
       }
   }

Go
~~

.. code-block:: go

   func hasPathSum(root *TreeNode, targetSum int) bool {
       var search func(*TreeNode, int64) bool
       search = func(node *TreeNode, remaining int64) bool {
           if node == nil {
               return false
           }
           if node.Left == nil && node.Right == nil {
               return remaining == int64(node.Val)
           }

           next := remaining - int64(node.Val)
           return search(node.Left, next) || search(node.Right, next)
       }

       return search(root, int64(targetSum))
   }

TypeScript
~~~~~~~~~~

.. code-block:: typescript

   function hasPathSum(root: TreeNode | null, targetSum: number): boolean {
       if (root === null) {
           return false;
       }
       if (root.left === null && root.right === null) {
           return targetSum === root.val;
       }

       const remaining = targetSum - root.val;
       return hasPathSum(root.left, remaining) ||
           hasPathSum(root.right, remaining);
   }

C#
~~

.. code-block:: csharp

   public class Solution {
       public bool HasPathSum(TreeNode root, int targetSum) {
           return Search(root, (long)targetSum);
       }

       private bool Search(TreeNode root, long remaining) {
           if (root == null) {
               return false;
           }
           if (root.left == null && root.right == null) {
               return remaining == root.val;
           }

           long next = remaining - (long)root.val;
           return Search(root.left, next) || Search(root.right, next);
       }
   }

Julia
~~~~~

.. code-block:: julia

   function has_path_sum(
       root::Union{TreeNode, Nothing},
       target_sum::Int,
   )::Bool
       root === nothing && return false

       if root.left === nothing && root.right === nothing
           return target_sum == root.val
       end

       remaining = target_sum - root.val
       return has_path_sum(root.left, remaining) ||
           has_path_sum(root.right, remaining)
   end

R
~

.. code-block:: r

   has_path_sum <- function(root, target_sum) {
     if (is.null(root)) {
       return(FALSE)
     }
     if (is.null(root$left) && is.null(root$right)) {
       return(target_sum == root$val)
     }

     remaining <- target_sum - root$val
     has_path_sum(root$left, remaining) ||
       has_path_sum(root$right, remaining)
   }

验证计划与证据
--------------

* 固定用例覆盖空树、单节点成功与失败、普通成功路径、前缀和命中但不是叶节点、负值和零值；
* 随机生成树与目标值，枚举全部根到叶路径和后与主算法对拍；
* 对返回真用例恢复至少一条真实路径，确认起点是根、终点是叶节点；
* 调用前后序列化树，确认输入未修改；
* 固定宽语言加入接近路径和上界的测试，确认内部扩宽发生在减法前；
* C/C++ 使用严格警告、ASan 和 UBSan；有运行时的语言执行固定与随机用例；
* Rust、C#、Julia、R 缺少运行时时记录借用、宽类型、空值和短路静态检查。

关键边界
--------

* 空树没有合法路径，即使 ``targetSum == 0`` 也返回假；
* 只有叶节点可以结束路径；
* 节点值允许为负，不能按剩余目标符号剪枝；
* 内部使用 64 位剩余目标，避免窄类型中间减法风险；
* 逻辑或短路只影响访问数量，不改变完整性。

易错点
------

* 在内部节点前缀和等于目标时提前返回；
* 把任意父子路径或从非根节点开始的路径算入；
* 对负数使用 ``remaining < 0`` 剪枝；
* 先在 ``int`` 中减法，再把已经溢出的结果赋给宽类型；
* 保存完整路径数组处理布尔问题，增加不必要复制。

本题新增知识
------------

* 用剩余目标压缩根到当前节点的路径和状态；
* 叶节点条件与和相等条件必须同时成立；
* 负数输入使基于单调性的符号剪枝失效。

本题强化知识
------------

* 树递归的 ``O(h)`` 调用栈；
* 固定宽语言危险算术先扩宽操作数；
* 短路布尔搜索与输入只读语义。

关联题目
--------

* `0111. Minimum Depth of Binary Tree <0111-minimum-depth-of-binary-tree.rst>`_：叶节点终点定义；
* `0104. Maximum Depth of Binary Tree <0104-maximum-depth-of-binary-tree.rst>`_：根到叶递归结构。

最小自检
--------

#. 为什么内部节点的前缀和命中目标仍不能返回真？
#. ``search(node, remaining)`` 中的 ``remaining`` 精确表示什么？
#. 节点值允许为负时，哪些常见剪枝不再安全？
#. 固定宽语言为什么要在减法前扩宽？

答案要点
~~~~~~~~

递归状态表示当前节点开始还需要凑出的剩余目标。到叶节点时比较 ``remaining == node.val``；非叶节点先扣除当前值，
再搜索左右孩子。该状态覆盖全部根到叶路径且不会接受内部前缀，最坏时间 ``O(n)``，调用栈 ``O(h)``。
