0113. Path Sum II
=================

题目信息
--------

:题号: 0113
:难度: Medium
:主题: 二叉树、深度优先搜索、回溯、路径快照
:原题: `LeetCode 0113 <https://leetcode.com/problems/path-sum-ii/>`_
:访问状态: Available
:教学重点: 根到叶限定、共享路径回溯、结果快照独立性、输出敏感复杂度

题目重述
--------

给定一棵二叉树和整数 ``targetSum``，返回所有从根节点开始、在叶节点结束、
节点值总和恰好等于目标值的路径。
每条路径以节点值数组表示。

路径只能沿父子链接向下。内部节点即使当前前缀和已经等于目标，也不能提前提交；
只有左右孩子都为空的节点才是
合法终点。空树返回空结果。函数只读输入树，不改变节点值或左右链接。

平台允许节点值为负数，因此剩余目标的正负不能用于剪枝。返回路径的语义顺序未要求唯一；本文十语言统一按
“先左子树、后右子树”的深度优先顺序返回，便于测试和阅读。每一行结果必须拥有独立快照，后续回溯不能改变
已经保存的路径。

自建示例
--------

两条合法路径
~~~~~~~~~~~~

.. code-block:: text

             5
           /   \
          4     8
         /     / \
        11    13  4
       /  \      / \
      7    2    5   1

   targetSum = 22
   输出：[[5, 4, 11, 2], [5, 8, 4, 5]]

两条答案共享前缀节点 ``5``，但返回的两行数组必须相互独立。

前缀命中但不是叶节点
~~~~~~~~~~~~~~~~~~~~

.. code-block:: text

       1
      /
     2
    /
   3

   targetSum = 3
   输出：[]

路径 ``1 -> 2`` 的和已经是 3，但节点 ``2`` 仍有孩子，因此不能提交。

包含负数
~~~~~~~~

.. code-block:: text

       1
      / \
    -2  -3
    /
   2

   targetSum = 1
   输出：[[1, -2, 2]]

进入负值节点后剩余目标可能增大，任何按符号剪枝的实现都会漏解。

问题抽象
--------

本题是在 `0112. Path Sum <0112-path-sum.rst>`_ 的布尔状态上增加“恢复全部见证”的要求。

递归状态 ``search(node, remaining, path)`` 表示：

* ``remaining`` 是进入 ``node`` 前仍需要凑出的目标；
* ``path`` 保存从原根到 ``node`` 父节点的当前选择；
* 进入当前节点时把 ``node.val`` 追加到路径，并从剩余目标中扣除；
* 只有当前节点是叶节点且扣除后剩余值为零时，复制路径到答案；
* 离开调用前撤销本层追加，使兄弟子树看到原来的父路径。

共享一个可变路径可以避免每进入一层就复制完整前缀。复制只发生在真正产生答案时。

基础类型约定
------------

沿用 `0094. Binary Tree Inorder Traversal
<../0001-0100/0094-binary-tree-inorder-traversal.rst>`_ 建立的 ``TreeNode`` 引用模型。
输入树只读；结果只包含
整数快照，不保存节点引用。

C 的平台接口返回 ``int **``，并通过 ``returnSize`` 和 ``returnColumnSizes``
返回行数与每行长度。外层数组、
列长度数组和每一行都由函数分配，调用者按平台约定释放。其余语言返回各自的二维动态容器。

解法选择
--------

.. list-table::
   :header-rows: 1

   * - 方法
     - 时间复杂度
     - 工作空间
     - 定位
   * - 共享路径 DFS + 回溯
     - ``O(n + L)``
     - ``O(h)``，另加输出
     - 主解法；只在提交答案时复制
   * - 每层复制完整路径
     - 最坏 ``O(nh + L)``
     - 最坏 ``O(nh)`` 累计分配
     - 控制流简单，但隐藏大量前缀复制
   * - BFS 队列携带完整路径
     - 最坏 ``O(nh + L)``
     - 最坏 ``O(nh)``
     - 可避免递归深度，队列状态更重

这里 ``n`` 是节点数，``h`` 是树高，``L`` 是所有返回路径的元素总数。任何正确算法都至少需要
``Theta(L)`` 时间和空间写出答案。

主解法：共享路径 DFS 与回溯
---------------------------

状态定义与核心不变量
~~~~~~~~~~~~~~~~~~~~

进入 ``search(node, remaining)`` 时保持：

* 当前可变数组 ``path`` 恰好等于从原根到 ``node`` 父节点的节点值序列；
* ``remaining`` 等于 ``targetSum`` 减去 ``path`` 中全部值；
* 答案中的每一行都已经复制，与 ``path`` 不共享后续会修改的存储；
* 输入树保持原拓扑。

本层执行：

.. code-block:: text

   path.push(node.val)
   next = remaining - node.val

   if node 是叶节点且 next == 0:
       answer.push(copy(path))
   else:
       search(node.left, next)
       search(node.right, next)

   path.pop()

``pop`` 是当前调用的统一恢复点。无论当前节点产生答案、没有答案、只有一个孩子
还是两个孩子，离开前都恢复到进入
调用时的路径长度。

为什么必须复制路径
~~~~~~~~~~~~~~~~~~

``path`` 是整次 DFS 共用的工作缓冲区。若把同一个数组对象直接保存到答案，
后续 ``push`` 和 ``pop`` 会修改
所有历史结果，最终多行可能同时变成空数组或最后一次遍历的内容。

因此提交时需要：

* C 分配新行并复制当前有效前缀；
* C++、Python、Java、Go、TypeScript、C#、Julia 创建容器副本；
* Rust 使用 ``path.clone()``；
* R 从共享环境的工作向量中截取当前深度，生成独立结果向量。

回溯恢复为什么安全
~~~~~~~~~~~~~~~~~~

当前调用只在路径末尾追加一个值。左右子调用各自遵守同一恢复约定，
所以子调用返回时 ``path`` 仍以当前节点
结尾。当前调用最后删除这一项，路径就精确恢复成父调用传入的前缀。不同兄弟分支不会看见彼此的节点值。

正确性依据
~~~~~~~~~~

对当前子树做结构归纳。

**基础情况。** 空节点不产生路径。叶节点只有一条从当前节点到叶节点的候选；追加当前值后，``next == 0``
当且仅当从原根到该叶节点的完整路径和等于目标。提交的是当前路径副本，所以结果稳定。

**归纳步骤。** 非叶节点的任意合法根到叶路径必须包含当前节点，随后进入左孩子或右孩子。
扣除当前值后，左、右
递归分别完整枚举两棵子树中的全部剩余路径。两棵子树的首条边不同，因此结果集合互斥，不会重复。

**合法性。** 只有叶节点执行提交；路径从原根开始，递归每层只沿一条父子边向下，
所以每个结果都是合法根到叶
路径。

**完整性。** 任意满足目标的根到叶路径在每个内部节点都选择其真实孩子，
最终会到达对应叶节点。归纳步骤覆盖
左右两个选择，因此不会遗漏。

**快照独立性。** 每次提交都复制当前有效前缀。后续回溯只修改工作缓冲，不修改历史行。

**终止性。** 每次递归进入严格更小的子树，有限树最终到达空节点或叶节点。

复杂度与语言边界
~~~~~~~~~~~~~~~~

* DFS 对每个节点执行常数次状态更新，基础遍历时间 ``O(n)``；
* 复制所有答案需要 ``Theta(L)``，总时间 ``O(n + L)``；
* 当前路径最多保存 ``h`` 个值，递归栈深度 ``O(h)``；
* 输出载荷为 ``Theta(L)``，不计入算法工作空间；
* C 的工作路径和结果目录按需扩容，峰值为 ``O(h + k + L)``，其中 ``k`` 是答案行数；
* 固定宽语言内部使用 64 位剩余目标，先扩宽节点值再减法；
* Rust 的 ``Rc`` 克隆只增加引用计数，不复制树节点；
* R 使用共享 ``environment`` 保存工作路径与答案，避免依赖递归调用帧之间不会共享的普通局部重绑定。

核心语言实现
------------

C
~

.. code-block:: c

   #include <stdbool.h>
   #include <stddef.h>
   #include <stdlib.h>
   #include <string.h>

   struct PathResults {
       int **rows;
       int *columns;
       size_t size;
       size_t capacity;
       int *path;
       size_t depth;
       size_t path_capacity;
       bool ok;
   };

   static void clear_results(struct PathResults *results) {
       for (size_t index = 0; index < results->size; ++index) {
           free(results->rows[index]);
       }
       free(results->rows);
       free(results->columns);
       free(results->path);
   }

   static bool reserve_path(struct PathResults *results, size_t needed) {
       if (needed <= results->path_capacity) {
           return true;
       }

       size_t capacity = results->path_capacity == 0
           ? 16
           : results->path_capacity * 2;
       while (capacity < needed) {
           capacity *= 2;
       }

       int *next = realloc(results->path, capacity * sizeof(*next));
       if (next == NULL) {
           return false;
       }
       results->path = next;
       results->path_capacity = capacity;
       return true;
   }

   static bool reserve_rows(struct PathResults *results, size_t needed) {
       if (needed <= results->capacity) {
           return true;
       }

       size_t capacity = results->capacity == 0
           ? 8
           : results->capacity * 2;
       while (capacity < needed) {
           capacity *= 2;
       }

       int **rows = malloc(capacity * sizeof(*rows));
       int *columns = malloc(capacity * sizeof(*columns));
       if (rows == NULL || columns == NULL) {
           free(rows);
           free(columns);
           return false;
       }

       if (results->size > 0) {
           memcpy(rows, results->rows, results->size * sizeof(*rows));
           memcpy(
               columns,
               results->columns,
               results->size * sizeof(*columns)
           );
       }
       free(results->rows);
       free(results->columns);
       results->rows = rows;
       results->columns = columns;
       results->capacity = capacity;
       return true;
   }

   static bool append_path(struct PathResults *results) {
       if (!reserve_rows(results, results->size + 1)) {
           return false;
       }

       int *row = malloc(results->depth * sizeof(*row));
       if (row == NULL) {
           return false;
       }
       memcpy(row, results->path, results->depth * sizeof(*row));

       results->rows[results->size] = row;
       results->columns[results->size] = (int)results->depth;
       ++results->size;
       return true;
   }

   static void collect_paths(
       const struct TreeNode *root,
       long long remaining,
       struct PathResults *results
   ) {
       if (root == NULL || !results->ok) {
           return;
       }
       if (!reserve_path(results, results->depth + 1)) {
           results->ok = false;
           return;
       }

       results->path[results->depth++] = root->val;
       const long long next = remaining - (long long)root->val;
       const bool is_leaf = root->left == NULL && root->right == NULL;

       if (is_leaf && next == 0) {
           results->ok = append_path(results);
       } else {
           collect_paths(root->left, next, results);
           collect_paths(root->right, next, results);
       }

       --results->depth;  /* 统一恢复父路径。 */
   }

   int **pathSum(
       struct TreeNode *root,
       int targetSum,
       int *returnSize,
       int **returnColumnSizes
   ) {
       struct PathResults results = {0};
       results.ok = true;
       *returnSize = 0;
       *returnColumnSizes = NULL;

       collect_paths(root, (long long)targetSum, &results);
       if (!results.ok) {
           clear_results(&results);
           return NULL;
       }

       free(results.path);
       *returnSize = (int)results.size;
       *returnColumnSizes = results.columns;
       return results.rows;
   }

C++
~~~

.. code-block:: cpp

   #include <cstdint>
   #include <vector>

   class Solution {
       std::vector<std::vector<int>> answers_;
       std::vector<int> path_;

       void collect(TreeNode* root, std::int64_t remaining) {
           if (root == nullptr) {
               return;
           }

           path_.push_back(root->val);
           const std::int64_t next = remaining - root->val;
           const bool is_leaf = root->left == nullptr &&
               root->right == nullptr;

           if (is_leaf && next == 0) {
               answers_.push_back(path_);  // 保存独立快照。
           } else {
               collect(root->left, next);
               collect(root->right, next);
           }
           path_.pop_back();
       }

   public:
       std::vector<std::vector<int>> pathSum(
           TreeNode* root,
           int targetSum
       ) {
           answers_.clear();
           path_.clear();
           collect(root, static_cast<std::int64_t>(targetSum));
           return answers_;
       }
   };

Python
~~~~~~

.. code-block:: python

   class Solution:
       def pathSum(
           self,
           root: Optional[TreeNode],
           targetSum: int,
       ) -> list[list[int]]:
           answers: list[list[int]] = []
           path: list[int] = []

           def collect(node: Optional[TreeNode], remaining: int) -> None:
               if node is None:
                   return

               path.append(node.val)
               next_remaining = remaining - node.val
               is_leaf = node.left is None and node.right is None

               if is_leaf and next_remaining == 0:
                   answers.append(path.copy())
               else:
                   collect(node.left, next_remaining)
                   collect(node.right, next_remaining)

               path.pop()  # 两个兄弟分支共享同一工作路径。

           collect(root, targetSum)
           return answers

Java
~~~~

.. code-block:: java

   import java.util.ArrayList;
   import java.util.List;

   class Solution {
       private final List<List<Integer>> answers = new ArrayList<>();
       private final List<Integer> path = new ArrayList<>();

       public List<List<Integer>> pathSum(TreeNode root, int targetSum) {
           answers.clear();
           path.clear();
           collect(root, (long) targetSum);
           return answers;
       }

       private void collect(TreeNode root, long remaining) {
           if (root == null) {
               return;
           }

           path.add(root.val);
           long next = remaining - (long) root.val;
           boolean isLeaf = root.left == null && root.right == null;

           if (isLeaf && next == 0L) {
               answers.add(new ArrayList<>(path));
           } else {
               collect(root.left, next);
               collect(root.right, next);
           }
           path.remove(path.size() - 1);
       }
   }

Rust
~~~~

.. code-block:: rust

   use std::cell::RefCell;
   use std::rc::Rc;

   impl Solution {
       pub fn path_sum(
           root: Option<Rc<RefCell<TreeNode>>>,
           target_sum: i32,
       ) -> Vec<Vec<i32>> {
           fn collect(
               root: Option<Rc<RefCell<TreeNode>>>,
               remaining: i64,
               path: &mut Vec<i32>,
               answers: &mut Vec<Vec<i32>>,
           ) {
               let Some(node) = root else {
                   return;
               };

               let node_ref = node.borrow();
               let value = node_ref.val;
               let left = node_ref.left.clone();
               let right = node_ref.right.clone();
               let is_leaf = left.is_none() && right.is_none();
               drop(node_ref);

               path.push(value);
               let next = remaining - i64::from(value);
               if is_leaf && next == 0 {
                   answers.push(path.clone());
               } else {
                   collect(left, next, path, answers);
                   collect(right, next, path, answers);
               }
               path.pop();
           }

           let mut answers = Vec::new();
           let mut path = Vec::new();
           collect(
               root,
               i64::from(target_sum),
               &mut path,
               &mut answers,
           );
           answers
       }
   }

Go
~~

.. code-block:: go

   func pathSum(root *TreeNode, targetSum int) [][]int {
       answers := make([][]int, 0)
       path := make([]int, 0)

       var collect func(*TreeNode, int64)
       collect = func(node *TreeNode, remaining int64) {
           if node == nil {
               return
           }

           path = append(path, node.Val)
           next := remaining - int64(node.Val)
           isLeaf := node.Left == nil && node.Right == nil

           if isLeaf && next == 0 {
               snapshot := append([]int(nil), path...)
               answers = append(answers, snapshot)
           } else {
               collect(node.Left, next)
               collect(node.Right, next)
           }
           path = path[:len(path)-1]
       }

       collect(root, int64(targetSum))
       return answers
   }

TypeScript
~~~~~~~~~~

.. code-block:: typescript

   function pathSum(root: TreeNode | null, targetSum: number): number[][] {
       const answers: number[][] = [];
       const path: number[] = [];

       function collect(node: TreeNode | null, remaining: number): void {
           if (node === null) {
               return;
           }

           path.push(node.val);
           const next = remaining - node.val;
           const isLeaf = node.left === null && node.right === null;

           if (isLeaf && next === 0) {
               answers.push([...path]);
           } else {
               collect(node.left, next);
               collect(node.right, next);
           }
           path.pop();
       }

       collect(root, targetSum);
       return answers;
   }

C#
~~

.. code-block:: csharp

   using System.Collections.Generic;

   public class Solution {
       private readonly List<IList<int>> answers = new();
       private readonly List<int> path = new();

       public IList<IList<int>> PathSum(TreeNode root, int targetSum) {
           answers.Clear();
           path.Clear();
           Collect(root, (long)targetSum);
           return answers;
       }

       private void Collect(TreeNode root, long remaining) {
           if (root == null) {
               return;
           }

           path.Add(root.val);
           long next = remaining - (long)root.val;
           bool isLeaf = root.left == null && root.right == null;

           if (isLeaf && next == 0L) {
               answers.Add(new List<int>(path));
           } else {
               Collect(root.left, next);
               Collect(root.right, next);
           }
           path.RemoveAt(path.Count - 1);
       }
   }

Julia
~~~~~

.. code-block:: julia

   function path_sum(
       root::Union{TreeNode, Nothing},
       target_sum::Int,
   )::Vector{Vector{Int}}
       answers = Vector{Vector{Int}}()
       path = Int[]

       function collect(
           node::Union{TreeNode, Nothing},
           remaining::Int64,
       )::Nothing
           node === nothing && return nothing

           push!(path, node.val)
           next = remaining - Int64(node.val)
           is_leaf = node.left === nothing && node.right === nothing

           if is_leaf && next == 0
               push!(answers, copy(path))
           else
               collect(node.left, next)
               collect(node.right, next)
           end
           pop!(path)
           return nothing
       end

       collect(root, Int64(target_sum))
       return answers
   end

R
~

.. code-block:: r

   path_sum <- function(root, target_sum) {
     state <- new.env(parent = emptyenv())
     state$path <- integer(0)
     state$answers <- list()

     collect <- function(node, remaining, depth) {
       if (is.null(node)) {
         return(invisible(NULL))
       }

       state$path[depth] <- node$val
       next_remaining <- remaining - node$val
       is_leaf <- is.null(node$left) && is.null(node$right)

       if (is_leaf && next_remaining == 0) {
         state$answers[[length(state$answers) + 1L]] <-
           state$path[seq_len(depth)]
       } else {
         collect(node$left, next_remaining, depth + 1L)
         collect(node$right, next_remaining, depth + 1L)
       }
       invisible(NULL)
     }

     collect(root, target_sum, 1L)
     state$answers
   }

R 的工作路径存放在显式环境中，因此所有递归层修改同一个向量。
``depth`` 限定当前有效前缀；兄弟分支会覆盖
更深槽位，但已经保存到结果列表中的向量是独立快照。

验证计划与证据
--------------

* 固定用例覆盖空树、单节点成功与失败、多答案、无答案、前缀命中但不是叶节点、负值和零值；
* 随机生成树与目标值，用独立的根到叶枚举器计算全部路径并对拍；
* 对每一行重新沿树匹配，确认起点为根、终点为叶节点、路径和正确；
* 修改返回结果中的一行，确认其他行不变，检查跨结果快照独立性；
* 调用前后序列化树并记录节点身份，确认输入未修改；
* C/C++ 使用严格警告、ASan 和 UBSan；有运行时的语言执行固定与随机用例；
* Rust、C#、Julia、R 缺少运行时时记录借用、环境共享、快照和宽类型静态检查。

关键边界
--------

* 空树返回空结果；
* 只有左右孩子都为空的节点才能提交路径；
* 节点值允许为负，不能按剩余目标符号剪枝；
* 同一个工作路径只能在提交时复制，不能直接保存引用；
* 退出每个递归调用前必须恢复本层追加；
* 固定宽语言在减法前扩宽目标和节点值。

易错点
------

* 把内部节点前缀和命中当成完整答案；
* 忘记 ``pop``，导致右子树路径混入左子树节点；
* 把同一个可变数组对象重复放入答案；
* 每层都复制路径，把本可为 ``O(n + L)`` 的遍历放大到最坏 ``O(nh + L)``；
* C 扩容一半成功、一半失败后丢失旧指针或泄漏已保存行；
* R 依赖普通父调用帧中的局部向量重绑定共享递归状态。

本题新增知识
------------

* 用共享路径缓冲区和统一恢复点枚举根到叶见证；
* 结果快照必须与后续回溯修改隔离；
* 复杂度需要显式加入所有输出路径元素总数 ``L``。

本题强化知识
------------

* `0112. Path Sum <0112-path-sum.rst>`_ 的剩余目标与叶节点终点；
* 树递归的 ``O(h)`` 调用栈；
* C 二维动态结果的整体成功或整体清理；
* R 使用显式 ``environment`` 表达跨递归共享状态。

关联题目
--------

* `0112. Path Sum <0112-path-sum.rst>`_：只判断是否存在路径，不需要恢复见证；
* `0094. Binary Tree Inorder Traversal
  <../0001-0100/0094-binary-tree-inorder-traversal.rst>`_：统一树节点引用模型。

最小自检
--------

#. ``path`` 在进入和离开递归调用时分别表示什么？
#. 为什么保存答案时必须复制当前路径？
#. 总时间为什么写成 ``O(n + L)``，而不是只写 ``O(n)``？
#. 节点值允许为负时，为什么不能按剩余目标的符号剪枝？
#. R 实现为什么使用显式环境保存工作路径？

答案要点
~~~~~~~~

DFS 共享一个当前路径数组。进入节点时追加值并更新剩余目标，
只在叶节点且剩余为零时复制当前路径；离开调用前
删除本层值。该恢复不变量完整覆盖左右子树且隔离兄弟分支，时间 ``O(n + L)``，工作路径和递归栈均为
``O(h)``，输出载荷为 ``Theta(L)``。
