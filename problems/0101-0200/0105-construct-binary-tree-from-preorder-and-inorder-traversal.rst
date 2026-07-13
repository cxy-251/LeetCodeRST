0105. Construct Binary Tree from Preorder and Inorder Traversal
===============================================================

题目信息
--------

:题号: 0105
:难度: Medium
:主题: 二叉树、哈希表、分治
:原题: `LeetCode 0105 <https://leetcode.com/problems/construct-binary-tree-from-preorder-and-inorder-traversal/>`_
:访问状态: Available
:教学重点: 遍历区间、根下标、唯一值

题目重述
--------

给定互不相同节点值的前序和中序遍历，重建唯一二叉树。两个数组长度相等且描述同一棵树。

自建示例
--------

.. code-block:: text

   输入：preorder = [3,9,20,15,7]
   inorder = [9,3,15,20,7]
   输出：对应二叉树 [3,9,20,null,null,15,7]

问题抽象
--------

前序区间首元素是根；其在中序中的位置把节点划分为左、右子树，左子树长度决定前序区间切分。

主解法：哈希定位加区间递归
---------------

思路
~~~~

哈希定位加区间递归。 遍历区间、根下标、唯一值

核心状态与不变量
~~~~~~~~~~~~~~~~

前序区间首元素是根；其在中序中的位置把节点划分为左、右子树，左子树长度决定前序区间切分。

正确性依据
~~~~~~~~~~

根值由前序首元素唯一确定；中序根位置唯一划分左右节点集合。递归区间严格缩小，并按相同规则唯一重建左右子树，因此组合得到唯一原树。

复杂度与语言边界
~~~~~~~~~~~~~~~~

哈希定位版本建立下标表后时间 ``O(n)``，表与递归栈 ``O(n)``；C 适配器为避免引入题外哈希结构，在每个递归区间线性定位根，退化树最坏 ``O(n^2)``。输出树 ``O(n)``。

核心语言实现
------------

C
~

.. code-block:: c

   #include <stdlib.h>
   static struct TreeNode *build(const int *pre, int ps, int pe, const int *in, int is, int ie) {
       if (ps >= pe) return NULL;
       int root_val = pre[ps], k = is;
       while (in[k] != root_val) ++k;
       int left_size = k - is;
       struct TreeNode *root = malloc(sizeof(*root));
       root->val = root_val;
       root->left = build(pre, ps + 1, ps + 1 + left_size, in, is, k);
       root->right = build(pre, ps + 1 + left_size, pe, in, k + 1, ie);
       return root;
   }
   struct TreeNode *buildTree(int *preorder, int preorderSize, int *inorder, int inorderSize) {
       return build(preorder, 0, preorderSize, inorder, 0, inorderSize);
   }
C++
~~~

.. code-block:: cpp

   class Solution {
       unordered_map<int,int> pos;
       TreeNode* build(vector<int>& pre, int ps, int pe, int is, int ie) {
           if (ps >= pe) return nullptr;
           int rootVal = pre[ps], k = pos[rootVal], left = k - is;
           auto* root = new TreeNode(rootVal);
           root->left = build(pre, ps + 1, ps + 1 + left, is, k);
           root->right = build(pre, ps + 1 + left, pe, k + 1, ie);
           return root;
       }
       public: TreeNode* buildTree(vector<int>& preorder, vector<int>& inorder) {
           for (int i = 0; i < (int)inorder.size(); ++i) pos[inorder[i]] = i;
           return build(preorder, 0, preorder.size(), 0, inorder.size());
       }
   };
Python
~~~~~~

.. code-block:: python

   class Solution:

       def buildTree(self, preorder: list[int], inorder: list[int]) -> Optional[TreeNode]:
           pos = {value: i for i, value in enumerate(inorder)}
           pre_i = 0

           def build(left: int, right: int) -> Optional[TreeNode]:
               nonlocal pre_i
               if left >= right:
                   return None
               value = preorder[pre_i]
               pre_i += 1
               root = TreeNode(value)
               mid = pos[value]
               root.left = build(left, mid)
               root.right = build(mid + 1, right)
               return root
           return build(0, len(inorder))
Java
~~~~

.. code-block:: java

   class Solution {
       private int preIndex;
       private Map<Integer,Integer> pos;
       public TreeNode buildTree(int[] preorder, int[] inorder) {
           pos = new HashMap<>();
           for (int i = 0; i < inorder.length; ++i) pos.put(inorder[i], i);
           return build(preorder, 0, inorder.length);
       }
       private TreeNode build(int[] pre, int left, int right) {
           if (left >= right) return null;
           int value = pre[preIndex++], mid = pos.get(value);
           TreeNode root = new TreeNode(value);
           root.left = build(pre, left, mid);
           root.right = build(pre, mid + 1, right);
           return root;
       }
   }
Rust
~~~~

.. code-block:: rust

   use std::cell::RefCell;
   use std::collections::HashMap;
   use std::rc::Rc;
   impl Solution {
       pub fn build_tree(preorder: Vec<i32>, inorder: Vec<i32>) -> Option<Rc<RefCell<TreeNode>>> {
           fn build(pre: &[i32], pi: &mut usize, l: usize, r: usize, pos: &HashMap<i32, usize>) ->
               Option<Rc<RefCell<TreeNode>>> {
               if l >= r {
                   return None;
               }
               let value = pre[*pi];
               *pi += 1;
               let m = pos[&value];
               let root = Rc::new(RefCell::new(TreeNode::new(value)));
               root.borrow_mut().left = build(pre, pi, l, m, pos);
               root.borrow_mut().right = build(pre, pi, m + 1, r, pos);
               Some(root)
           }
           let pos = inorder.iter().enumerate().map(|(i,&v)|(v,i)).collect();
           build(&preorder, &mut 0, 0, inorder.len(), &pos)
       }
   }
Go
~~

.. code-block:: go

   func buildTree(preorder []int, inorder []int) *TreeNode {
   	pos := map[int]int{}
   	for i, v := range inorder {
   		pos[v] = i
   	}
   	pre := 0
   	var build func(int, int) *TreeNode
   	build = func(l, r int) *TreeNode {
   		if l >= r {
   			return nil
   		}
   		v := preorder[pre]
   		pre++
   		m := pos[v]
   		root := &TreeNode{Val: v}
   		root.Left = build(l, m)
   		root.Right = build(m+1, r)
   		return root
   	}
   	return build(0, len(inorder))
   }
TypeScript
~~~~~~~~~~

.. code-block:: typescript

   function buildTree(preorder: number[], inorder: number[]): TreeNode | null {
       const pos = new Map<number, number>();
       inorder.forEach((v, i) => pos.set(v, i));
       let pre = 0;
       const build = (l: number, r: number): TreeNode | null => {
           if (l >= r)
               return null;
           const value = preorder[pre++], m = pos.get(value)!;
           const root = new TreeNode(value);
           root.left = build(l, m);
           root.right = build(m + 1, r);
           return root;
       };
       return build(0, inorder.length);
   }
C#
~~

.. code-block:: csharp

   public class Solution {
       private int pre;
       private Dictionary<int,int> pos;
       public TreeNode BuildTree(int[] preorder, int[] inorder) {
           pos = new Dictionary<int,int>();
           for (int i = 0; i < inorder.Length; ++i) pos[inorder[i]] = i;
           pre = 0;
           return Build(preorder, 0, inorder.Length);
       }
       private TreeNode Build(int[] preorder, int l, int r) {
           if (l >= r) return null;
           int value = preorder[pre++], m = pos[value];
           var root = new TreeNode(value);
           root.left = Build(preorder, l, m);
           root.right = Build(preorder, m + 1, r);
           return root;
       }
   }
Julia
~~~~~

.. code-block:: julia

   function build_tree(preorder::Vector{Int}, inorder::Vector{Int})
       pos = Dict(value => i for (i, value) in pairs(inorder))
       pre = Ref(1)
       function build(left::Int, right::Int)
           left > right && return nothing
           value = preorder[pre[]]
           pre[] += 1
           mid = pos[value]
           root = TreeNode(value)
           root.left = build(left, mid - 1)
           root.right = build(mid + 1, right)
           root
       end
       build(1, length(inorder))
   end
R
~

.. code-block:: r

   build_tree <- function(preorder, inorder) {
       pos <- setNames(seq_along(inorder), as.character(inorder))
       pre <- 1L
       build <- function(left, right) {
           if (left > right) return(NULL)
           value <- preorder[[pre]]
           pre <<- pre + 1L
           mid <- pos[[as.character(value)]]
           root <- new_tree_node(value)
           root$left <- build(left, mid - 1L)
           root$right <- build(mid + 1L, right)
           root
       }
       build(1L, length(inorder))
   }
验证计划与证据
--------------

* 固定用例覆盖正常输入、最小输入、退化结构和无解路径；
* 对小规模输入使用独立暴力或枚举基准进行静态对拍设计；
* 检查十语言函数签名、空值、下标、所有权和返回结构；
* 当前批次对 C、C++、Java、Go、TypeScript 执行编译或严格类型检查，对 Python 执行语法解析；Rust、C#、Julia、R 完成接口、括号、作用域和所有权静态检查。

关键边界
--------

* 空区间返回空节点。
* 题意要求值互异，否则单个下标不足以确定结构。

易错点
------

* 每次线性搜索中序根位置导致 ``O(n^2)``。
* 左右子树长度计算偏一。

本题新增知识
------------

* 遍历区间、根下标、唯一值
* 题号 0105 的主解法状态与证明

本题强化知识
------------

* 十语言接口一致性与边界契约
* 递归栈、输出载荷和语言适配器成本分层

关联题目
--------

* `0106. Construct Binary Tree from Inorder and Postorder Traversal <0106-construct-binary-tree-from-inorder-and-postorder-traversal.rst>`_；
* `0108. Convert Sorted Array to Binary Search Tree <0108-convert-sorted-array-to-binary-search-tree.rst>`_；

最小自检
--------

#. ``哈希定位加区间递归`` 维护的核心状态是什么？
#. 终止条件为什么与题目目标等价？
#. 哪个边界最容易造成跨语言接口差异？
#. 复杂度是否包含递归栈、返回结果和语言适配器？

答案要点
~~~~~~~~

根值由前序首元素唯一确定；中序根位置唯一划分左右节点集合。递归区间严格缩小，并按相同规则唯一重建左右子树，因此组合得到唯一原树。
