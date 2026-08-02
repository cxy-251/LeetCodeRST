0145. Binary Tree Postorder Traversal
=====================================

题目信息
--------

:题号: 0145
:难度: Easy
:主题: 二叉树、深度优先搜索、显式栈、序列反转
:原题: `LeetCode 0145 <https://leetcode.com/problems/binary-tree-postorder-traversal/>`_
:重点: 左右根顺序、空树结果、节点逐个输出、遍历顺序保持

题目重述
--------

给定二叉树根节点 ``root``，返回这棵树的后序遍历结果。对于每棵非空子树，必须先遍历左子树，再遍历右子树，最后访问根节点。每个节点都按结构位置访问一次，即使多个节点值相同，也要分别出现在结果中；空树返回空数组。

树中节点数在 ``0..100`` 范围内，节点值在 ``-100..100`` 范围内。

自建示例
--------

.. code-block:: text

   输入：root = [6,2,9,null,4,7,null]
   输出：[4,2,7,9,6]
   解释：先完成左子树的后序遍历 4、2，再完成右子树的后序遍历 7、9，最后访问根节点 6。

.. code-block:: text

   输入：root = [5]
   输出：[5]
   解释：单节点树没有左右子树，最后只访问根节点本身。

C++ 实现
--------

.. code-block:: cpp

   #include <algorithm>
   #include <stack>
   #include <utility>
   #include <vector>

   class Solution {
   private:
       void recursive(TreeNode* node, std::vector<int>& result) {
           if (!node) return;
           recursive(node->left, result);
           recursive(node->right, result);
           result.push_back(node->val);
       }

       std::vector<int> reversePreorder(TreeNode* root) {
           std::vector<int> result;
           if (!root) return result;
           std::stack<TreeNode*> pending;
           pending.push(root);
           while (!pending.empty()) {
               TreeNode* node = pending.top(); pending.pop();
               result.push_back(node->val);
               if (node->left) pending.push(node->left);
               if (node->right) pending.push(node->right);
           }
           std::reverse(result.begin(), result.end());
           return result;
       }

       std::vector<int> visitedFlag(TreeNode* root) {
           std::vector<int> result;
           std::stack<std::pair<TreeNode*,bool>> pending;
           if (root) pending.push({root,false});
           while (!pending.empty()) {
               auto [node, visited] = pending.top(); pending.pop();
               if (visited) result.push_back(node->val);
               else {
                   pending.push({node,true});
                   if (node->right) pending.push({node->right,false});
                   if (node->left) pending.push({node->left,false});
               }
           }
           return result;
       }

   public:
       std::vector<int> postorderTraversal(TreeNode* root) {
           return reversePreorder(root);
       }
   };

题解
----

为什么先生成根右左
~~~~~~~~~~~~~~~~~~

后序目标是 ``左 + 右 + 根``。若按“根、右、左”访问整棵树，得到的序列在整体反转后正好是“左、右、根”
的后序序列：根右左顺序中的每个子树块也会在反转时变成对应的左、右、根顺序。因此可以直接构造根右左，
最后整体反转，而不需要在栈中额外记录每个节点的访问阶段。

压栈顺序为何与前序不同
~~~~~~~~~~~~~~~~~~~~~~

要弹出顺序为根、右、左，弹出根后应先压左孩子、再压右孩子。右孩子后入栈，因而先被处理。

单栈状态方法
~~~~~~~~~~~~

把节点第一次入栈记为未访问；弹出未访问节点时，依次压入“已访问的自己”、右孩子、左孩子。孩子都处理完成后，已访问标记的节点才被记录，显式模拟递归返回时机。

为什么不能只反转每层
~~~~~~~~~~~~~~~~~~~~

后序约束是完整左子树必须位于完整右子树之前，不是层序关系。只有整个根右左 DFS 序列反转才能保持子树块的正确次序。

复杂度来源
~~~~~~~~~~

每个节点入栈常数次，时间 ``O(n)``。工作栈最坏 ``O(n)``，返回数组为 ``O(n)``；反转在结果数组内原地完成。

九语言实现
----------

C
~

.. code-block:: c

   int*postorderTraversal(struct TreeNode*root,int*returnSize){int cap=16,size=0,top=0;int*out=malloc((size_t)cap*sizeof(int));struct TreeNode**stack=malloc((size_t)cap*sizeof(struct TreeNode*));if(root)stack[top++]=root;while(top){struct TreeNode*n=stack[--top];if(size==cap){cap*=2;out=realloc(out,(size_t)cap*sizeof(int));stack=realloc(stack,(size_t)cap*sizeof(struct TreeNode*));}out[size++]=n->val;if(n->left)stack[top++]=n->left;if(n->right)stack[top++]=n->right;}for(int l=0,r=size-1;l<r;l++,r--){int t=out[l];out[l]=out[r];out[r]=t;}free(stack);*returnSize=size;return out;}

Python
~~~~~~

.. code-block:: python

   class Solution:
       def postorderTraversal(self, root):
           out=[]; stack=[root] if root else []
           while stack:
               node=stack.pop();out.append(node.val)
               if node.left: stack.append(node.left)
               if node.right: stack.append(node.right)
           out.reverse();return out

Java
~~~~

.. code-block:: java

   class Solution {public List<Integer> postorderTraversal(TreeNode root){List<Integer>o=new ArrayList<>();Deque<TreeNode>s=new ArrayDeque<>();if(root!=null)s.push(root);while(!s.isEmpty()){TreeNode n=s.pop();o.add(n.val);if(n.left!=null)s.push(n.left);if(n.right!=null)s.push(n.right);}Collections.reverse(o);return o;}}

Rust
~~~~

.. code-block:: rust

   impl Solution {pub fn postorder_traversal(root:Option<std::rc::Rc<std::cell::RefCell<TreeNode>>>)->Vec<i32>{let mut out=vec![];let mut stack=vec![];if let Some(r)=root{stack.push(r)}while let Some(node)=stack.pop(){let n=node.borrow();out.push(n.val);if let Some(l)=n.left.clone(){stack.push(l)}if let Some(r)=n.right.clone(){stack.push(r)}}out.reverse();out}}

Go
~~

.. code-block:: go

   func postorderTraversal(root *TreeNode)[]int{out:=[]int{};stack:=[]*TreeNode{};if root!=nil{stack=append(stack,root)};for len(stack)>0{n:=stack[len(stack)-1];stack=stack[:len(stack)-1];out=append(out,n.Val);if n.Left!=nil{stack=append(stack,n.Left)};if n.Right!=nil{stack=append(stack,n.Right)}};for l,r:=0,len(out)-1;l<r;l,r=l+1,r-1{out[l],out[r]=out[r],out[l]};return out}

TypeScript
~~~~~~~~~~

.. code-block:: typescript

   function postorderTraversal(root:TreeNode|null):number[]{const out:number[]=[],stack:TreeNode[]=[];if(root)stack.push(root);while(stack.length){const n=stack.pop()!;out.push(n.val);if(n.left)stack.push(n.left);if(n.right)stack.push(n.right);}out.reverse();return out;}

C#
~~

.. code-block:: csharp

   public class Solution {public IList<int> PostorderTraversal(TreeNode root){var o=new List<int>();var s=new Stack<TreeNode>();if(root!=null)s.Push(root);while(s.Count>0){var n=s.Pop();o.Add(n.val);if(n.left!=null)s.Push(n.left);if(n.right!=null)s.Push(n.right);}o.Reverse();return o;}}

Julia
~~~~~

.. code-block:: julia

   function postorder_traversal(root)
       out=Int[];stack=Any[];root!==nothing&&push!(stack,root)
       while !isempty(stack);n=pop!(stack);push!(out,n.val);n.left!==nothing&&push!(stack,n.left);n.right!==nothing&&push!(stack,n.right);end
       reverse!(out)
   end

R
~

.. code-block:: r

   postorder_traversal <- function(root){out<-integer();stack<-if(is.null(root))list()else list(root);while(length(stack)){n<-stack[[length(stack)]];stack<-stack[-length(stack)];out<-c(out,n$val);if(!is.null(n$left))stack[[length(stack)+1L]]<-n$left;if(!is.null(n$right))stack[[length(stack)+1L]]<-n$right};rev(out)}
