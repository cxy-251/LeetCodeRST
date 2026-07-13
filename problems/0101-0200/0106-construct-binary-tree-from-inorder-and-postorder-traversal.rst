0106. Construct Binary Tree from Inorder and Postorder Traversal
================================================================

题目信息
--------

:题号: 0106
:难度: Medium
:主题: 二叉树、哈希表、分治
:原题: `LeetCode 0106 <https://leetcode.com/problems/construct-binary-tree-from-inorder-and-postorder-traversal/>`_
:访问状态: Available
:教学重点: 后序根与中序区间

题目重述
--------

给定互不相同节点值的中序和后序遍历，重建唯一二叉树。

自建示例
--------

.. code-block:: text

   输入：inorder = [9,3,15,20,7]
   postorder = [9,15,7,20,3]
   输出：对应二叉树 [3,9,20,null,null,15,7]

问题抽象
--------

后序区间末元素是根；中序根位置给出左子树长度，据此切分两个遍历区间。

主解法：哈希定位加区间递归
---------------

思路
~~~~

哈希定位加区间递归。 后序根与中序区间

核心状态与不变量
~~~~~~~~~~~~~~~~

后序区间末元素是根；中序根位置给出左子树长度，据此切分两个遍历区间。

正确性依据
~~~~~~~~~~

后序末值唯一确定根，中序位置唯一确定左右集合，区间对应关系由左子树长度决定。递归严格缩小并唯一重建左右子树。

复杂度与语言边界
~~~~~~~~~~~~~~~~

哈希定位版本时间 ``O(n)``，下标表与递归栈 ``O(n)``；C 适配器在每个中序区间线性定位根，退化树最坏 ``O(n^2)``。输出树 ``O(n)``。

核心语言实现
------------

C
~

.. code-block:: c

   #include <stdlib.h>
   static struct TreeNode *build(const int *in, int is, int ie, const int *post, int ps, int pe) {
       if (ps >= pe) return NULL;
       int root_val = post[pe - 1], k = is;
       while (in[k] != root_val) ++k;
       int left_size = k - is;
       struct TreeNode *root = malloc(sizeof(*root));
       root->val = root_val;
       root->left = build(in, is, k, post, ps, ps + left_size);
       root->right = build(in, k + 1, ie, post, ps + left_size, pe - 1);
       return root;
   }
   struct TreeNode *buildTree(int *inorder, int inorderSize, int *postorder, int postorderSize) {
       return build(inorder, 0, inorderSize, postorder, 0, postorderSize);
   }
C++
~~~

.. code-block:: cpp

   class Solution {
       unordered_map<int,int> pos;
       TreeNode* build(vector<int>& post, int ps, int pe, int is, int ie) {
           if (ps >= pe) return nullptr;
           int value = post[pe - 1], m = pos[value], left = m - is;
           auto* root = new TreeNode(value);
           root->left = build(post, ps, ps + left, is, m);
           root->right = build(post, ps + left, pe - 1, m + 1, ie);
           return root;
       }
       public: TreeNode* buildTree(vector<int>& inorder, vector<int>& postorder) {
           for (int i = 0; i < (int)inorder.size(); ++i) pos[inorder[i]] = i;
           return build(postorder, 0, postorder.size(), 0, inorder.size());
       }
   };
Python
~~~~~~

.. code-block:: python

   class Solution:

       def buildTree(self, inorder: list[int], postorder: list[int]) -> Optional[TreeNode]:
           pos = {value: i for i, value in enumerate(inorder)}
           post_i = len(postorder) - 1

           def build(left: int, right: int) -> Optional[TreeNode]:
               nonlocal post_i
               if left >= right:
                   return None
               value = postorder[post_i]
               post_i -= 1
               root = TreeNode(value)
               mid = pos[value]
               root.right = build(mid + 1, right)
               root.left = build(left, mid)
               return root
           return build(0, len(inorder))
Java
~~~~

.. code-block:: java

   class Solution {
       private int postIndex;
       private Map<Integer,Integer> pos;
       public TreeNode buildTree(int[] inorder, int[] postorder) {
           pos = new HashMap<>();
           for (int i = 0; i < inorder.length; ++i) pos.put(inorder[i], i);
           postIndex = postorder.length - 1;
           return build(postorder, 0, inorder.length);
       }
       private TreeNode build(int[] post, int left, int right) {
           if (left >= right) return null;
           int value = post[postIndex--], mid = pos.get(value);
           TreeNode root = new TreeNode(value);
           root.right = build(post, mid + 1, right);
           root.left = build(post, left, mid);
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
       pub fn build_tree(inorder: Vec<i32>, postorder: Vec<i32>) -> Option<Rc<RefCell<TreeNode>>> {
           fn build(post: &[i32], pi: &mut isize, l: usize, r: usize, pos: &HashMap<i32, usize>) ->
               Option<Rc<RefCell<TreeNode>>> {
               if l >= r {
                   return None;
               }
               let value = post[*pi as usize];
               *pi -= 1;
               let m = pos[&value];
               let root = Rc::new(RefCell::new(TreeNode::new(value)));
               root.borrow_mut().right = build(post, pi, m + 1, r, pos);
               root.borrow_mut().left = build(post, pi, l, m, pos);
               Some(root)
           }
           let pos = inorder.iter().enumerate().map(|(i,&v)|(v,i)).collect();
           let mut pi = postorder.len() as isize - 1;
           build(&postorder, &mut pi, 0, inorder.len(), &pos)
       }
   }
Go
~~

.. code-block:: go

   func buildTree(inorder []int, postorder []int) *TreeNode {
   	pos := map[int]int{}
   	for i, v := range inorder {
   		pos[v] = i
   	}
   	post := len(postorder) - 1
   	var build func(int, int) *TreeNode
   	build = func(l, r int) *TreeNode {
   		if l >= r {
   			return nil
   		}
   		v := postorder[post]
   		post--
   		m := pos[v]
   		root := &TreeNode{Val: v}
   		root.Right = build(m+1, r)
   		root.Left = build(l, m)
   		return root
   	}
   	return build(0, len(inorder))
   }
TypeScript
~~~~~~~~~~

.. code-block:: typescript

   function buildTree(inorder: number[], postorder: number[]): TreeNode | null {
       const pos = new Map<number, number>();
       inorder.forEach((v, i) => pos.set(v, i));
       let post = postorder.length - 1;
       const build = (l: number, r: number): TreeNode | null => {
           if (l >= r)
               return null;
           const value = postorder[post--], m = pos.get(value)!;
           const root = new TreeNode(value);
           root.right = build(m + 1, r);
           root.left = build(l, m);
           return root;
       };
       return build(0, inorder.length);
   }
C#
~~

.. code-block:: csharp

   public class Solution {
       private int post;
       private Dictionary<int,int> pos;
       public TreeNode BuildTree(int[] inorder, int[] postorder) {
           pos = new Dictionary<int,int>();
           for (int i = 0; i < inorder.Length; ++i) pos[inorder[i]] = i;
           post = postorder.Length - 1;
           return Build(postorder, 0, inorder.Length);
       }
       private TreeNode Build(int[] postorder, int l, int r) {
           if (l >= r) return null;
           int value = postorder[post--], m = pos[value];
           var root = new TreeNode(value);
           root.right = Build(postorder, m + 1, r);
           root.left = Build(postorder, l, m);
           return root;
       }
   }
Julia
~~~~~

.. code-block:: julia

   function build_tree(inorder::Vector{Int}, postorder::Vector{Int})
       pos = Dict(value => i for (i, value) in pairs(inorder))
       post = Ref(length(postorder))
       function build(left::Int, right::Int)
           left > right && return nothing
           value = postorder[post[]]
           post[] -= 1
           mid = pos[value]
           root = TreeNode(value)
           root.right = build(mid + 1, right)
           root.left = build(left, mid - 1)
           root
       end
       build(1, length(inorder))
   end
R
~

.. code-block:: r

   build_tree <- function(inorder, postorder) {
       pos <- setNames(seq_along(inorder), as.character(inorder))
       post <- length(postorder)
       build <- function(left, right) {
           if (left > right) return(NULL)
           value <- postorder[[post]]
           post <<- post - 1L
           mid <- pos[[as.character(value)]]
           root <- new_tree_node(value)
           root$right <- build(mid + 1L, right)
           root$left <- build(left, mid - 1L)
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

* 空区间返回空。
* 所有值必须互异。

易错点
------

* 误把后序首元素当根。
* 右子树区间端点越界。

本题新增知识
------------

* 后序根与中序区间
* 题号 0106 的主解法状态与证明

本题强化知识
------------

* 十语言接口一致性与边界契约
* 递归栈、输出载荷和语言适配器成本分层

关联题目
--------

* `0105. Construct Binary Tree from Preorder and Inorder Traversal <0105-construct-binary-tree-from-preorder-and-inorder-traversal.rst>`_；

最小自检
--------

#. ``哈希定位加区间递归`` 维护的核心状态是什么？
#. 终止条件为什么与题目目标等价？
#. 哪个边界最容易造成跨语言接口差异？
#. 复杂度是否包含递归栈、返回结果和语言适配器？

答案要点
~~~~~~~~

后序末值唯一确定根，中序位置唯一确定左右集合，区间对应关系由左子树长度决定。递归严格缩小并唯一重建左右子树。
