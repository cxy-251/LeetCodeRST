0095. Unique Binary Search Trees II
===================================

题目信息
--------

:题号: 0095
:难度: Medium
:主题: 二叉搜索树、分治、Catalan 结构、深复制
:原题: `LeetCode 0095 <https://leetcode.com/problems/unique-binary-search-trees-ii/>`_
:访问状态: Available
:教学重点: 根值分治、左右区间笛卡尔积、空树占位、结果树独立性

题目重述
--------

给定整数 ``n``，生成所有由 ``1..n`` 组成、结构互不相同的二叉搜索树，并返回每棵树的根节点。
题目保证 ``1 <= n <= 8``。每个值恰好使用一次；对任意节点，左子树值都更小，右子树值都更大。

本教程额外保证返回的不同树不共享可变节点。修改一棵结果树不会改变其他结果。

自建示例
--------

``n = 3`` 时共有五棵树。根可以是 ``1``、``2`` 或 ``3``；根为 ``2`` 时左右区间都只有一种树，
根为 ``1`` 或 ``3`` 时，另一侧区间各有两种树。

问题抽象
--------

对值域闭区间 ``[start, end]`` 选择根值 ``root``：

* 左子树只能由 ``[start, root-1]`` 生成；
* 右子树只能由 ``[root+1, end]`` 生成；
* 任意左树和任意右树都能与当前根组成一棵合法 BST。

空区间必须返回一个 ``null`` 占位，而不是空列表。这样叶节点也能通过“一个空左树乘一个空右树”
自然生成。

解法选择
--------

.. list-table::
   :header-rows: 1

   * - 方法
     - 时间复杂度
     - 返回空间
     - 定位
   * - 区间分治、笛卡尔积并深复制子树
     - ``Theta(n × C_n)``
     - ``Theta(n × C_n)``
     - 主解法；保证结果树之间不共享节点
   * - 记忆化区间模板并直接复用节点
     - 接近输出下界
     - 较小
     - 可能让不同结果共享可变子树
   * - 枚举插入排列再按结构去重
     - 至少 ``Omega(n!)``
     - 很大
     - 重复生成同一结构，没有利用 BST 区间性质

其中 ``C_n`` 是第 ``n`` 个 Catalan 数，也是本题结果数量。

主解法：根值分治与独立深复制
----------------------------

状态定义与核心不变量
~~~~~~~~~~~~~~~~~~~~

``generate(start, end)`` 返回所有恰好使用该连续值域的 BST。每棵返回树满足：

* 中序遍历严格等于 ``start, start+1, ..., end``；
* 同一返回列表中的任意两棵树结构不同；
* 任意两棵树没有共享非空节点；
* ``start > end`` 时返回只含一个空树的列表。

对每个 ``root_value``，先递归得到全部左树和右树，再枚举它们的笛卡尔积。为当前组合新建根节点，
并深复制左右模板后挂接。临时模板完成组合后即可释放或交给垃圾回收。

为什么完整
~~~~~~~~~~

任意合法 BST 的根值唯一。BST 性质决定小于根的全部值只能位于左子树，大于根的全部值只能位于右
子树。因此该树必然属于算法枚举的某个根值分支。按区间长度归纳，左右子树都能由对应递归状态生成，
它们的组合也一定会被提交。

为什么无重复
~~~~~~~~~~~~

不同根值产生的树根不同。根值相同时，若两棵结果不同，则左子树或右子树的结构至少一侧不同；递归
状态本身不产生重复，笛卡尔积中的每对下标也只访问一次，因此不会产生重复结构。

为什么需要深复制
~~~~~~~~~~~~~~~~

某棵左子树模板可能与多个右子树组合。若直接把同一个模板节点挂到多个根下，返回树在结构上正确，
却共享可变节点。深复制让每个组合拥有完整独立的节点集合；代价与必须返回的节点总数同阶。

正确性依据
~~~~~~~~~~

**BST 合法。** 根左侧只使用更小的连续值域，右侧只使用更大的连续值域；递归子树本身合法。

**值集合正确。** 左区间、根值和右区间互不重叠，并恰好覆盖 ``[start,end]``。

**完整且唯一。** 每棵合法树由唯一根值和唯一左右结构对确定，算法逐一枚举这些选择。

**节点独立。** 每个最终根和全部非空子树都由本次组合新建，不复用其他结果中的节点。

**终止性。** 每个非空递归状态把区间拆成两个更短区间，最终到达空区间。

复杂度与边界
~~~~~~~~~~~~

* 结果数量为 ``C_n``，每棵树包含 ``n`` 个节点；仅输出就需要 ``Theta(n × C_n)`` 时间和空间；
* 主实现的递归生成、深复制和临时模板总成本仍由该输出量级主导；
* 递归深度最多为 ``n``；
* ``n <= 8`` 时 ``C_8 = 1430``，最终共有 ``11440`` 个数据节点；
* C 先计算 Catalan 容量并事务式清理部分树；任一分配失败返回 ``NULL`` 和零结果数；
* Rust 的 ``Rc`` 深复制会创建新的 ``Rc<RefCell<TreeNode>>``，不会只增加旧节点引用计数；
* Julia 与 R 使用 `0094` 建立的引用节点模型，克隆时递归创建新节点。

核心语言实现
------------

C
~

.. code-block:: c

   #include <stdbool.h>
   #include <stddef.h>
   #include <stdlib.h>

   struct TreeArray {
       struct TreeNode **items;
       int size;
       bool failed;
   };

   static void free_tree(struct TreeNode *root) {
       if (root == NULL) {
           return;
       }
       free_tree(root->left);
       free_tree(root->right);
       free(root);
   }

   static void free_forest(struct TreeNode **trees, int size) {
       if (trees == NULL) {
           return;
       }
       for (int index = 0; index < size; ++index) {
           free_tree(trees[index]);
       }
       free(trees);
   }

   static struct TreeNode *clone_tree(
       const struct TreeNode *root,
       bool *failed
   ) {
       if (root == NULL || *failed) {
           return NULL;
       }

       struct TreeNode *copy = malloc(sizeof(*copy));
       if (copy == NULL) {
           *failed = true;
           return NULL;
       }
       copy->val = root->val;
       copy->left = clone_tree(root->left, failed);
       copy->right = clone_tree(root->right, failed);

       if (*failed) {
           free_tree(copy);
           return NULL;
       }
       return copy;
   }

   static struct TreeArray generate_range(
       int start,
       int end,
       const int *counts
   ) {
       if (start > end) {
           struct TreeNode **items = malloc(sizeof(*items));
           if (items == NULL) {
               return (struct TreeArray){NULL, 0, true};
           }
           items[0] = NULL;
           return (struct TreeArray){items, 1, false};
       }

       const int node_count = end - start + 1;
       struct TreeNode **items = malloc(
           (size_t)counts[node_count] * sizeof(*items)
       );
       if (items == NULL) {
           return (struct TreeArray){NULL, 0, true};
       }

       int size = 0;
       for (int root_value = start; root_value <= end; ++root_value) {
           struct TreeArray left = generate_range(start, root_value - 1, counts);
           if (left.failed) {
               free_forest(items, size);
               return (struct TreeArray){NULL, 0, true};
           }

           struct TreeArray right = generate_range(root_value + 1, end, counts);
           if (right.failed) {
               free_forest(left.items, left.size);
               free_forest(items, size);
               return (struct TreeArray){NULL, 0, true};
           }

           for (int left_index = 0; left_index < left.size; ++left_index) {
               for (int right_index = 0; right_index < right.size; ++right_index) {
                   bool failed = false;
                   struct TreeNode *root = malloc(sizeof(*root));
                   if (root == NULL) {
                       failed = true;
                   } else {
                       root->val = root_value;
                       root->left = clone_tree(left.items[left_index], &failed);
                       root->right = clone_tree(right.items[right_index], &failed);
                   }

                   if (failed) {
                       free_tree(root);
                       free_forest(left.items, left.size);
                       free_forest(right.items, right.size);
                       free_forest(items, size);
                       return (struct TreeArray){NULL, 0, true};
                   }
                   items[size++] = root;
               }
           }

           free_forest(left.items, left.size);
           free_forest(right.items, right.size);
       }

       return (struct TreeArray){items, size, false};
   }

   struct TreeNode **generateTrees(int n, int *returnSize) {
       *returnSize = 0;
       if (n <= 0) {
           return NULL;
       }

       int counts[9] = {0};
       counts[0] = 1;
       for (int nodes = 1; nodes <= n; ++nodes) {
           for (int left_nodes = 0; left_nodes < nodes; ++left_nodes) {
               counts[nodes] +=
                   counts[left_nodes] * counts[nodes - 1 - left_nodes];
           }
       }

       struct TreeArray result = generate_range(1, n, counts);
       if (result.failed) {
           return NULL;
       }

       *returnSize = result.size;
       return result.items;
   }

C++
~~~

.. code-block:: cpp

   #include <vector>

   class Solution {
       static TreeNode* cloneTree(const TreeNode* root) {
           if (root == nullptr) {
               return nullptr;
           }
           return new TreeNode(
               root->val,
               cloneTree(root->left),
               cloneTree(root->right)
           );
       }

       static void destroy(TreeNode* root) {
           if (root == nullptr) {
               return;
           }
           destroy(root->left);
           destroy(root->right);
           delete root;
       }

       static void destroyForest(std::vector<TreeNode*>& trees) {
           for (TreeNode* root : trees) {
               destroy(root);
           }
       }

       static std::vector<TreeNode*> generate(int start, int end) {
           if (start > end) {
               return {nullptr};
           }

           std::vector<TreeNode*> result;
           for (int rootValue = start; rootValue <= end; ++rootValue) {
               std::vector<TreeNode*> leftTrees = generate(start, rootValue - 1);
               std::vector<TreeNode*> rightTrees = generate(rootValue + 1, end);

               for (const TreeNode* left : leftTrees) {
                   for (const TreeNode* right : rightTrees) {
                       result.push_back(new TreeNode(
                           rootValue,
                           cloneTree(left),
                           cloneTree(right)
                       ));
                   }
               }

               destroyForest(leftTrees);
               destroyForest(rightTrees);
           }
           return result;
       }

   public:
       std::vector<TreeNode*> generateTrees(int n) {
           if (n <= 0) {
               return {};
           }
           return generate(1, n);
       }
   };

Python
~~~~~~

.. code-block:: python

   class Solution:
       def generateTrees(self, n: int) -> list[TreeNode | None]:
           def clone(root: TreeNode | None) -> TreeNode | None:
               if root is None:
                   return None
               return TreeNode(root.val, clone(root.left), clone(root.right))

           def generate(start: int, end: int) -> list[TreeNode | None]:
               if start > end:
                   return [None]

               result: list[TreeNode | None] = []
               for root_value in range(start, end + 1):
                   left_trees = generate(start, root_value - 1)
                   right_trees = generate(root_value + 1, end)

                   for left in left_trees:
                       for right in right_trees:
                           result.append(
                               TreeNode(root_value, clone(left), clone(right))
                           )
               return result

           if n <= 0:
               return []
           return generate(1, n)

Java
~~~~

.. code-block:: java

   import java.util.ArrayList;
   import java.util.Collections;
   import java.util.List;

   class Solution {
       public List<TreeNode> generateTrees(int n) {
           if (n <= 0) {
               return new ArrayList<>();
           }
           return generate(1, n);
       }

       private static List<TreeNode> generate(int start, int end) {
           if (start > end) {
               return Collections.singletonList(null);
           }

           List<TreeNode> result = new ArrayList<>();
           for (int rootValue = start; rootValue <= end; ++rootValue) {
               List<TreeNode> leftTrees = generate(start, rootValue - 1);
               List<TreeNode> rightTrees = generate(rootValue + 1, end);

               for (TreeNode left : leftTrees) {
                   for (TreeNode right : rightTrees) {
                       result.add(new TreeNode(
                           rootValue,
                           cloneTree(left),
                           cloneTree(right)
                       ));
                   }
               }
           }
           return result;
       }

       private static TreeNode cloneTree(TreeNode root) {
           if (root == null) {
               return null;
           }
           return new TreeNode(
               root.val,
               cloneTree(root.left),
               cloneTree(root.right)
           );
       }
   }

Rust
~~~~

.. code-block:: rust

   impl Solution {
       pub fn generate_trees(n: i32) -> Vec<Option<Rc<RefCell<TreeNode>>>> {
           fn clone_tree(
               root: &Option<Rc<RefCell<TreeNode>>>,
           ) -> Option<Rc<RefCell<TreeNode>>> {
               let node = root.as_ref()?;
               let borrowed = node.borrow();
               Some(Rc::new(RefCell::new(TreeNode {
                   val: borrowed.val,
                   left: clone_tree(&borrowed.left),
                   right: clone_tree(&borrowed.right),
               })))
           }

           fn generate(start: i32, end: i32) -> Vec<Option<Rc<RefCell<TreeNode>>>> {
               if start > end {
                   return vec![None];
               }

               let mut result = Vec::new();
               for root_value in start..=end {
                   let left_trees = generate(start, root_value - 1);
                   let right_trees = generate(root_value + 1, end);

                   for left in &left_trees {
                       for right in &right_trees {
                           result.push(Some(Rc::new(RefCell::new(TreeNode {
                               val: root_value,
                               left: clone_tree(left),
                               right: clone_tree(right),
                           }))));
                       }
                   }
               }
               result
           }

           if n <= 0 {
               Vec::new()
           } else {
               generate(1, n)
           }
       }
   }

Go
~~

.. code-block:: go

   func cloneTree(root *TreeNode) *TreeNode {
       if root == nil {
           return nil
       }
       return &TreeNode{
           Val:   root.Val,
           Left:  cloneTree(root.Left),
           Right: cloneTree(root.Right),
       }
   }

   func buildTrees(start int, end int) []*TreeNode {
       if start > end {
           return []*TreeNode{nil}
       }

       result := make([]*TreeNode, 0)
       for rootValue := start; rootValue <= end; rootValue++ {
           leftTrees := buildTrees(start, rootValue-1)
           rightTrees := buildTrees(rootValue+1, end)

           for _, left := range leftTrees {
               for _, right := range rightTrees {
                   result = append(result, &TreeNode{
                       Val:   rootValue,
                       Left:  cloneTree(left),
                       Right: cloneTree(right),
                   })
               }
           }
       }
       return result
   }

   func generateTrees(n int) []*TreeNode {
       if n <= 0 {
           return []*TreeNode{}
       }
       return buildTrees(1, n)
   }

TypeScript
~~~~~~~~~~

.. code-block:: typescript

   function cloneTree(root: TreeNode | null): TreeNode | null {
       if (root === null) {
           return null;
       }
       return new TreeNode(
           root.val,
           cloneTree(root.left),
           cloneTree(root.right)
       );
   }

   function buildTrees(start: number, end: number): Array<TreeNode | null> {
       if (start > end) {
           return [null];
       }

       const result: Array<TreeNode | null> = [];
       for (let rootValue = start; rootValue <= end; rootValue += 1) {
           const leftTrees = buildTrees(start, rootValue - 1);
           const rightTrees = buildTrees(rootValue + 1, end);

           for (const left of leftTrees) {
               for (const right of rightTrees) {
                   result.push(new TreeNode(
                       rootValue,
                       cloneTree(left),
                       cloneTree(right)
                   ));
               }
           }
       }
       return result;
   }

   function generateTrees(n: number): Array<TreeNode | null> {
       if (n <= 0) {
           return [];
       }
       return buildTrees(1, n);
   }

C#
~~

.. code-block:: csharp

   using System.Collections.Generic;

   public class Solution {
       public IList<TreeNode> GenerateTrees(int n) {
           if (n <= 0) {
               return new List<TreeNode>();
           }
           return Generate(1, n);
       }

       private static List<TreeNode> Generate(int start, int end) {
           if (start > end) {
               return new List<TreeNode> { null };
           }

           var result = new List<TreeNode>();
           for (int rootValue = start; rootValue <= end; ++rootValue) {
               List<TreeNode> leftTrees = Generate(start, rootValue - 1);
               List<TreeNode> rightTrees = Generate(rootValue + 1, end);

               foreach (TreeNode left in leftTrees) {
                   foreach (TreeNode right in rightTrees) {
                       result.Add(new TreeNode(
                           rootValue,
                           CloneTree(left),
                           CloneTree(right)
                       ));
                   }
               }
           }
           return result;
       }

       private static TreeNode CloneTree(TreeNode root) {
           if (root == null) {
               return null;
           }
           return new TreeNode(
               root.val,
               CloneTree(root.left),
               CloneTree(root.right)
           );
       }
   }

Julia
~~~~~

.. code-block:: julia

   function clone_tree(root::Union{TreeNode, Nothing})
       root === nothing && return nothing
       return TreeNode(
           root.val,
           clone_tree(root.left),
           clone_tree(root.right),
       )
   end

   function build_trees(start::Int, stop::Int)
       start > stop && return Union{TreeNode, Nothing}[nothing]

       result = Union{TreeNode, Nothing}[]
       for root_value in start:stop
           left_trees = build_trees(start, root_value - 1)
           right_trees = build_trees(root_value + 1, stop)

           for left in left_trees, right in right_trees
               push!(
                   result,
                   TreeNode(root_value, clone_tree(left), clone_tree(right)),
               )
           end
       end
       return result
   end

   function generate_trees(n::Int)
       n <= 0 && return Union{TreeNode, Nothing}[]
       return build_trees(1, n)
   end

R
~

.. code-block:: r

   clone_tree <- function(root) {
     if (is.null(root)) {
       return(NULL)
     }
     tree_node(
       root$val,
       clone_tree(root$left),
       clone_tree(root$right)
     )
   }

   build_trees <- function(start, stop) {
     if (start > stop) {
       return(list(NULL))
     }

     result <- list()
     for (root_value in seq.int(start, stop)) {
       left_trees <- build_trees(start, root_value - 1L)
       right_trees <- build_trees(root_value + 1L, stop)

       for (left in left_trees) {
         for (right in right_trees) {
           result[[length(result) + 1L]] <- tree_node(
             root_value,
             clone_tree(left),
             clone_tree(right)
           )
         }
       }
     }
     result
   }

   generate_trees <- function(n) {
     if (n <= 0L) {
       return(list())
     }
     build_trees(1L, n)
   }

验证计划与证据
--------------

* 对 ``n = 1..8`` 检查结果数依次为 ``1,2,5,14,42,132,429,1430``；
* 每棵树中序遍历必须严格等于 ``1..n``；
* 序列化全部树并检查结构字符串互不重复；
* 收集全部节点地址或对象身份，检查不同结果树之间没有共享节点；
* C、C++ 使用严格警告、ASan、UBSan 和泄漏检查；
* Java、Go、TypeScript 完成编译、运行和同样的结构属性检查。

Rust、C#、Julia 和 R 在当前环境缺少运行时，完成接口、所有权、空树占位和深复制语义的静态检查。

易错点
------

* 空区间返回空列表会让叶节点没有可组合的左右选择；
* 直接复用递归返回的子树会让多个结果共享节点；
* 只比较根值或中序遍历无法区分结构，中序遍历对所有结果都相同；
* C 在深复制中途失败时必须释放当前根、已完成结果和临时左右森林；
* 把 ``n = 0`` 当作一道合法输入时，应按接口约定返回空结果，而不是包含空树的外层结果。

本题新增知识
------------

* 连续值域 BST 的根值分治；
* 左右结构列表的笛卡尔积；
* 空树作为组合单位元；
* 返回对象之间的深复制与可变节点独立性。

本题强化知识
------------

* `0094` 的二叉树引用模型；
* 输出规模决定时间和返回空间下界；
* C 的事务式多对象构造与失败清理。

关联题目
--------

* `0094. Binary Tree Inorder Traversal <0094-binary-tree-inorder-traversal.rst>`_：验证每棵结果的 BST 中序序列；
* `0096. Unique Binary Search Trees <0096-unique-binary-search-trees.rst>`_：只统计相同结构集合的数量；
* `0078. Subsets <0078-subsets.rst>`_：同样显式生成指数规模结果并复制独立输出。

最小自检
--------

#. 为什么空区间必须返回 ``[null]``？
#. 为什么任意合法 BST 都能由某个根值分支覆盖？
#. 为什么直接复用左子树模板会产生接口风险？
#. 本题复杂度为什么至少是 ``Theta(n × C_n)``？

答案要点
~~~~~~~~

#. 它表示“唯一一种空子树选择”，使叶节点左右笛卡尔积仍有一个组合。
#. 根值唯一，BST 性质又唯一确定左右值域，递归覆盖全部左右结构。
#. 同一个可变节点可能出现在多棵返回树中，修改一棵会污染其他结果。
#. 必须返回 ``C_n`` 棵树，每棵都含 ``n`` 个独立节点。
