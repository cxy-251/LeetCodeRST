0094. Binary Tree Inorder Traversal
===================================

题目信息
--------

:题号: 0094
:难度: Easy
:主题: 二叉树、深度优先遍历、显式栈、Morris 遍历
:原题: `LeetCode 0094 <https://leetcode.com/problems/binary-tree-inorder-traversal/>`_
:教学重点: 左链入栈、延迟访问、右子树切换、临时线索恢复

题目重述
--------

给定二叉树根节点，按“左子树、根节点、右子树”的中序顺序返回全部节点值。空树返回空数组。主解法只读输入树；Morris 备用解法会临时修改链接，但必须在结束前完整恢复。

自建示例
--------

.. code-block:: text

       1
        \
         2
        /
       3
   输出：[1,3,2]

C++ 实现
--------

.. code-block:: cpp

   #include <vector>

   class Solution {
   private:
       void recursiveDfs(TreeNode* node, std::vector<int>& result) {
           if (!node) return;
           recursiveDfs(node->left, result);
           result.push_back(node->val);
           recursiveDfs(node->right, result);
       }

       std::vector<int> explicitStack(TreeNode* root) {
           std::vector<int> result;
           std::vector<TreeNode*> stack;
           TreeNode* current = root;
           while (current || !stack.empty()) {
               while (current) {
                   stack.push_back(current);
                   current = current->left;
               }
               current = stack.back();
               stack.pop_back();
               result.push_back(current->val);
               current = current->right;
           }
           return result;
       }

       std::vector<int> morrisTraversal(TreeNode* root) {
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
                       predecessor->right = current;
                       current = current->left;
                   } else {
                       predecessor->right = nullptr;
                       result.push_back(current->val);
                       current = current->right;
                   }
               }
           }
           return result;
       }

   public:
       std::vector<int> inorderTraversal(TreeNode* root) {
           return explicitStack(root);
       }
   };

题解
----

递归栈隐式保存了什么
~~~~~~~~~~~~~~~~~~

递归进入左子树时，运行时栈保存当前节点以及“左调用返回后访问根，再进入右子树”的续点。迭代方法只需把这些尚未访问的祖先显式压栈，就能复现相同控制流。

为什么先压完整左链
~~~~~~~~~~~~~~~~

中序顺序要求当前子树最左节点最先访问。从 ``current`` 开始沿 ``left`` 不断入栈，直到遇到空指针；此时栈顶节点没有尚未处理的左后代，因此它是全局中序序列中的下一个节点。

弹栈后为何转向右子树
~~~~~~~~~~~~~~~~~~~~

弹出并访问节点后，它的左子树和自身都已完成，唯一剩余部分是右子树。令 ``current=node->right``，下一轮又会先展开该右子树的最左路径；右子树为空时，循环继续弹出更高祖先。

状态演化
~~~~~~~~

.. list-table::
   :header-rows: 1

   * - 动作
     - 栈
     - 输出
   * - 压入 1
     - ``[1]``
     - ``[]``
   * - 弹出 1，转向 2
     - ``[]``
     - ``[1]``
   * - 压入 2、3
     - ``[2,3]``
     - ``[1]``
   * - 弹出 3、2
     - ``[]``
     - ``[1,3,2]``

为什么每个节点恰好访问一次
~~~~~~~~~~~~~~~~~~~~~~~~

每个节点只会在首次成为 ``current`` 时入栈一次；只有入栈节点才能被弹出，且弹出后不会再次沿父边返回。输入是树，每个非根节点只有一个父节点，因此不存在第二条路径把同一节点再次压栈。

Morris 线索如何替代栈
~~~~~~~~~~~~~~~~~~~~

若当前节点有左子树，中序前驱是左子树最右节点。第一次找到它时令 ``predecessor->right=current``，建立返回线索并转向左子树；第二次沿线索回到当前节点时，删除线索、访问当前节点并转向右子树。每条临时边都在第二次遇到时恢复，最终树结构与输入一致。

为什么 Morris 仍是线性时间
~~~~~~~~~~~~~~~~~~~~~~~~~~

寻找前驱时看似会重复沿右链，但每条真实右边最多在建立线索和删除线索时经过常数次，总操作数仍为 ``O(n)``。它把额外空间降为 ``O(1)``，代价是临时修改输入和更复杂的恢复证明。

复杂度来源
~~~~~~~~~~

三种方法都访问每个节点常数次，时间 ``O(n)``。递归和显式栈使用 ``O(h)`` 空间，``h`` 为树高；Morris 除结果外使用 ``O(1)`` 空间。

九语言实现
----------

C
~

.. code-block:: c

   int*inorderTraversal(struct TreeNode*root,int*returnSize){int cap=128,size=0;int*out=malloc(cap*sizeof(int));struct TreeNode**st=malloc(cap*sizeof(*st));int top=0;while(root||top){while(root){st[top++]=root;root=root->left;}root=st[--top];out[size++]=root->val;root=root->right;}free(st);*returnSize=size;return out;}

Python
~~~~~~

.. code-block:: python

   class Solution:
       def inorderTraversal(self, root):
           result, stack = [], []
           while root or stack:
               while root: stack.append(root); root = root.left
               root = stack.pop(); result.append(root.val); root = root.right
           return result

Java
~~~~

.. code-block:: java

   class Solution {public List<Integer> inorderTraversal(TreeNode root){List<Integer>o=new ArrayList<>();Deque<TreeNode>s=new ArrayDeque<>();while(root!=null||!s.isEmpty()){while(root!=null){s.push(root);root=root.left;}root=s.pop();o.add(root.val);root=root.right;}return o;}}

Rust
~~~~

.. code-block:: rust

   impl Solution {pub fn inorder_traversal(root:Option<Rc<RefCell<TreeNode>>>)->Vec<i32>{let mut out=vec![];let mut stack=vec![];let mut current=root;while current.is_some()||!stack.is_empty(){while let Some(node)=current{current=node.borrow().left.clone();stack.push(node);}let node=stack.pop().unwrap();out.push(node.borrow().val);current=node.borrow().right.clone();}out}}

Go
~~

.. code-block:: go

   func inorderTraversal(root *TreeNode)[]int{out:=[]int{};stack:=[]*TreeNode{};for root!=nil||len(stack)>0{for root!=nil{stack=append(stack,root);root=root.Left};root=stack[len(stack)-1];stack=stack[:len(stack)-1];out=append(out,root.Val);root=root.Right};return out}

TypeScript
~~~~~~~~~~

.. code-block:: typescript

   function inorderTraversal(root:TreeNode|null):number[]{const out:number[]=[],stack:TreeNode[]=[];while(root||stack.length){while(root){stack.push(root);root=root.left;}root=stack.pop()!;out.push(root.val);root=root.right;}return out;}

C#
~~

.. code-block:: csharp

   public class Solution {public IList<int> InorderTraversal(TreeNode root){var o=new List<int>();var s=new Stack<TreeNode>();while(root!=null||s.Count>0){while(root!=null){s.Push(root);root=root.left;}root=s.Pop();o.Add(root.val);root=root.right;}return o;}}

Julia
~~~~~

.. code-block:: julia

   function inorder_traversal(root)
       out=Int[];stack=Any[]
       while root!==nothing||!isempty(stack)
           while root!==nothing;push!(stack,root);root=root.left;end
           root=pop!(stack);push!(out,root.val);root=root.right
       end
       out
   end

R
~

.. code-block:: r

   inorder_traversal <- function(root){out<-integer();stack<-list();while(!is.null(root)||length(stack)>0L){while(!is.null(root)){stack[[length(stack)+1L]]<-root;root<-root$left};root<-stack[[length(stack)]];stack<-head(stack,-1L);out<-c(out,root$val);root<-root$right};out}
