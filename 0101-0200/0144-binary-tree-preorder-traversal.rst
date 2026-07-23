0144. Binary Tree Preorder Traversal
====================================

题目信息
--------

:题号: 0144
:难度: Easy
:主题: 二叉树、深度优先搜索、显式栈、Morris 遍历
:原题: `LeetCode 0144 <https://leetcode.com/problems/binary-tree-preorder-traversal/>`_
:重点: 根左右顺序、空树结果、节点逐个输出、遍历顺序保持

题目重述
--------

给定二叉树根节点 ``root``，返回这棵树的前序遍历结果。对于每棵非空子树，必须先访问根节点，再遍历左子树，最后遍历右子树。每个节点都按结构位置访问一次，即使多个节点值相同，也要分别出现在结果中；空树返回空数组。

树中节点数在 ``0..100`` 范围内，节点值在 ``-100..100`` 范围内。

自建示例
--------

.. code-block:: text

   输入：root = [6,2,9,null,4,7,null]
   输出：[6,2,4,9,7]
   解释：先访问根节点 6，再按前序访问左子树中的 2、4，最后访问右子树中的 9、7。

.. code-block:: text

   输入：root = []
   输出：[]
   解释：树中没有节点，因此前序遍历结果为空数组。

C++ 实现
--------

.. code-block:: cpp

   #include <stack>
   #include <vector>

   class Solution {
   private:
       void recursive(TreeNode* node, std::vector<int>& result) {
           if (!node) return;
           result.push_back(node->val);
           recursive(node->left, result);
           recursive(node->right, result);
       }

       std::vector<int> explicitStack(TreeNode* root) {
           std::vector<int> result;
           if (!root) return result;
           std::stack<TreeNode*> pending;
           pending.push(root);
           while (!pending.empty()) {
               TreeNode* node = pending.top(); pending.pop();
               result.push_back(node->val);
               if (node->right) pending.push(node->right);
               if (node->left) pending.push(node->left);
           }
           return result;
       }

       std::vector<int> morris(TreeNode* root) {
           std::vector<int> result;
           TreeNode* current = root;
           while (current) {
               if (!current->left) {
                   result.push_back(current->val);
                   current = current->right;
               } else {
                   TreeNode* predecessor = current->left;
                   while (predecessor->right && predecessor->right != current)
                       predecessor = predecessor->right;
                   if (!predecessor->right) {
                       result.push_back(current->val);
                       predecessor->right = current;
                       current = current->left;
                   } else {
                       predecessor->right = nullptr;
                       current = current->right;
                   }
               }
           }
           return result;
       }

   public:
       std::vector<int> preorderTraversal(TreeNode* root) {
           return explicitStack(root);
       }
   };

题解
----

显式栈保存什么
~~~~~~~~~~~~~~

栈中保存已经发现、但尚未访问的子树根。弹出节点时立即记录它，正好对应前序中的“根先访问”。

为什么先压右后压左
~~~~~~~~~~~~~~~~~~

栈后进先出。要让左孩子下一次先被弹出，就必须先压右孩子，再压左孩子；否则会得到根、右、左顺序。

递归与迭代为何等价
~~~~~~~~~~~~~~~~~~

递归调用栈隐式保存“左子树完成后还要访问右子树”的续点。显式栈把这些续点直接保存为节点引用，两者访问同一组结构位置。

Morris 方法的边界
~~~~~~~~~~~~~~~~

Morris 用左子树最右节点的空 ``right`` 临时指回当前节点，访问完成后必须恢复。它把核心工作空间降为 ``O(1)``，但会短暂修改树；只读要求严格时优先使用显式栈。

复杂度来源
~~~~~~~~~~

每个节点访问一次，时间 ``O(n)``。递归和显式栈最坏使用 ``O(h)`` 至 ``O(n)`` 空间；返回数组本身需要 ``O(n)``，不计入算法工作空间。

九语言实现
----------

C
~

.. code-block:: c

   int*preorderTraversal(struct TreeNode*root,int*returnSize){int cap=16,size=0;int*out=malloc((size_t)cap*sizeof(int));struct TreeNode**stack=malloc((size_t)cap*sizeof(struct TreeNode*));int top=0;if(root)stack[top++]=root;while(top){struct TreeNode*n=stack[--top];if(size==cap){cap*=2;out=realloc(out,(size_t)cap*sizeof(int));stack=realloc(stack,(size_t)cap*sizeof(struct TreeNode*));}out[size++]=n->val;if(n->right)stack[top++]=n->right;if(n->left)stack[top++]=n->left;}free(stack);*returnSize=size;return out;}

Python
~~~~~~

.. code-block:: python

   class Solution:
       def preorderTraversal(self, root):
           out=[]; stack=[root] if root else []
           while stack:
               node=stack.pop();out.append(node.val)
               if node.right: stack.append(node.right)
               if node.left: stack.append(node.left)
           return out

Java
~~~~

.. code-block:: java

   class Solution {public List<Integer> preorderTraversal(TreeNode root){List<Integer>out=new ArrayList<>();Deque<TreeNode>s=new ArrayDeque<>();if(root!=null)s.push(root);while(!s.isEmpty()){TreeNode n=s.pop();out.add(n.val);if(n.right!=null)s.push(n.right);if(n.left!=null)s.push(n.left);}return out;}}

Rust
~~~~

.. code-block:: rust

   impl Solution {pub fn preorder_traversal(root:Option<std::rc::Rc<std::cell::RefCell<TreeNode>>>)->Vec<i32>{let mut out=vec![];let mut stack=vec![];if let Some(r)=root{stack.push(r)}while let Some(node)=stack.pop(){let n=node.borrow();out.push(n.val);if let Some(r)=n.right.clone(){stack.push(r)}if let Some(l)=n.left.clone(){stack.push(l)}}out}}

Go
~~

.. code-block:: go

   func preorderTraversal(root *TreeNode)[]int{out:=[]int{};stack:=[]*TreeNode{};if root!=nil{stack=append(stack,root)};for len(stack)>0{n:=stack[len(stack)-1];stack=stack[:len(stack)-1];out=append(out,n.Val);if n.Right!=nil{stack=append(stack,n.Right)};if n.Left!=nil{stack=append(stack,n.Left)}};return out}

TypeScript
~~~~~~~~~~

.. code-block:: typescript

   function preorderTraversal(root:TreeNode|null):number[]{const out:number[]=[],stack:TreeNode[]=[];if(root)stack.push(root);while(stack.length){const n=stack.pop()!;out.push(n.val);if(n.right)stack.push(n.right);if(n.left)stack.push(n.left);}return out;}

C#
~~

.. code-block:: csharp

   public class Solution {public IList<int> PreorderTraversal(TreeNode root){var o=new List<int>();var s=new Stack<TreeNode>();if(root!=null)s.Push(root);while(s.Count>0){var n=s.Pop();o.Add(n.val);if(n.right!=null)s.Push(n.right);if(n.left!=null)s.Push(n.left);}return o;}}

Julia
~~~~~

.. code-block:: julia

   function preorder_traversal(root)
       out=Int[];stack=Any[];root!==nothing&&push!(stack,root)
       while !isempty(stack);n=pop!(stack);push!(out,n.val);n.right!==nothing&&push!(stack,n.right);n.left!==nothing&&push!(stack,n.left);end
       out
   end

R
~

.. code-block:: r

   preorder_traversal <- function(root){out<-integer();stack<-if(is.null(root))list()else list(root);while(length(stack)){n<-stack[[length(stack)]];stack<-stack[-length(stack)];out<-c(out,n$val);if(!is.null(n$right))stack[[length(stack)+1L]]<-n$right;if(!is.null(n$left))stack[[length(stack)+1L]]<-n$left};out}