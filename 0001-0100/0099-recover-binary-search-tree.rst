0099. Recover Binary Search Tree
================================

题目信息
--------

:题号: 0099
:难度: Medium
:主题: 二叉搜索树、中序遍历、逆序下降、原地修复
:原题: `LeetCode 0099 <https://leetcode.com/problems/recover-binary-search-tree/>`_
:重点: 恰好两个值被交换、中序顺序异常、不改变树结构、恢复合法 BST

题目重述
--------

一棵原本合法的二叉搜索树中，恰好有两个不同节点的值被交换。请恢复这棵树，使它重新满足 BST 的严格大小关系；必须原地修复，不能改变树的父子结构。题目保证确实存在这两个错误节点。

树的节点数在 ``2..1000`` 范围内，节点值处于 32 位有符号整数范围内。

自建示例
--------

.. code-block:: text

   输入（层序）：[4,6,2,1,3,5,7]
   修改后：[4,2,6,1,3,5,7]

原树由合法 BST 交换值 2 和 6 得到。恢复后，中序遍历从 ``[1,6,3,4,5,2,7]`` 变回严格递增的 ``[1,2,3,4,5,6,7]``。

C++ 实现
--------

.. code-block:: cpp

   #include <algorithm>
   #include <vector>

   class Solution {
   private:
       void collectAndSort(TreeNode* root) {
           std::vector<TreeNode*> nodes, stack;
           TreeNode* current = root;
           while (current || !stack.empty()) {
               while (current) { stack.push_back(current); current = current->left; }
               current = stack.back(); stack.pop_back();
               nodes.push_back(current); current = current->right;
           }
           std::vector<int> values;
           for (TreeNode* node : nodes) values.push_back(node->val);
           std::sort(values.begin(), values.end());
           for (int i = 0; i < static_cast<int>(nodes.size()); ++i) nodes[i]->val = values[i];
       }

       void stackDetection(TreeNode* root) {
           std::vector<TreeNode*> stack;
           TreeNode *previous = nullptr, *first = nullptr, *second = nullptr;
           while (root || !stack.empty()) {
               while (root) { stack.push_back(root); root = root->left; }
               root = stack.back(); stack.pop_back();
               if (previous && previous->val > root->val) {
                   if (!first) first = previous;
                   second = root;
               }
               previous = root;
               root = root->right;
           }
           std::swap(first->val, second->val);
       }

       void morrisDetection(TreeNode* root) {
           TreeNode *current = root, *previous = nullptr;
           TreeNode *first = nullptr, *second = nullptr;
           auto visit = [&](TreeNode* node) {
               if (previous && previous->val > node->val) {
                   if (!first) first = previous;
                   second = node;
               }
               previous = node;
           };
           while (current) {
               if (!current->left) {
                   visit(current); current = current->right;
               } else {
                   TreeNode* predecessor = current->left;
                   while (predecessor->right && predecessor->right != current)
                       predecessor = predecessor->right;
                   if (!predecessor->right) {
                       predecessor->right = current;
                       current = current->left;
                   } else {
                       predecessor->right = nullptr;
                       visit(current);
                       current = current->right;
                   }
               }
           }
           std::swap(first->val, second->val);
       }

   public:
       void recoverTree(TreeNode* root) {
           stackDetection(root);
       }
   };

题解
----

为什么中序序列暴露错误
~~~~~~~~~~~~~~~~~~~~

合法 BST 的中序序列严格递增。树结构未变，只交换了两个值，因此问题等价于在递增序列中交换两个元素后，找出这两个元素并换回。

相邻与非相邻交换产生什么
~~~~~~~~~~~~~~~~~~~~~~~~

设较小错误值为 ``x``，较大错误值为 ``y``：

* 若二者原本相邻，错误局部为 ``...,y,x,...``，只有一次下降；
* 若二者不相邻，``y`` 被移到前方会产生第一次下降，``x`` 被移到后方会产生最后一次下降。

所以统一规则是：第一次下降的左端记为 ``first``，每次下降的右端都更新为 ``second``。

扫描状态如何更新
~~~~~~~~~~~~~~~~

.. code-block:: text

   if previous.val > current.val:
       if first is empty:
           first = previous
       second = current

``previous`` 是当前节点的直接中序前驱。扫描结束后，``first`` 与 ``second`` 同时覆盖一次下降和两次下降两种情况。

状态演化
~~~~~~~~

.. list-table::
   :header-rows: 1

   * - 相邻对
     - 动作
     - 错误节点
   * - ``3,2``
     - 第一次下降
     - ``first=3, second=2``
   * - ``2,1``
     - 再次下降
     - ``first=3, second=1``
   * - ``1,4``
     - 正常递增
     - 保持

为什么只交换值
~~~~~~~~~~~~~~

题目明确错误由两个值互换造成，节点拓扑原本正确。重新连接节点会改变子树归属，可能破坏原树结构；交换 ``first.val`` 与 ``second.val`` 恰好撤销原错误，并保持全部父子边不变。

收集排序方法浪费了什么
~~~~~~~~~~~~~~~~~~~~~~

收集全部中序节点和值、排序后覆盖一定能恢复，但需要 ``O(n)`` 中间数组和 ``O(n log n)`` 排序。错误只有两个节点，单次中序扫描只需三个节点引用即可定位。

Morris 如何达到常数空间
~~~~~~~~~~~~~~~~~~~~~~

Morris 遍历用左子树最右节点建立临时返回线索，第二次回到当前节点时删除线索并访问。访问逻辑与显式栈完全相同；每条临时边都恢复后，树结构不变，额外空间 ``O(1)``。

为什么修复后一定合法
~~~~~~~~~~~~~~~~~~~~

除两个错误值外，中序序列其他元素和值位置均未改变。端点规则定位的正是被交换的 ``y`` 与 ``x``；换回后恢复原严格递增中序序列。树结构原本是 BST 拓扑，因此中序严格递增足以恢复合法 BST。

复杂度来源
~~~~~~~~~~

显式栈和 Morris 都访问每个节点常数次，时间 ``O(n)``。显式栈使用 ``O(h)`` 空间；Morris 使用 ``O(1)``。收集排序方法时间 ``O(n log n)``、空间 ``O(n)``。

九语言实现
----------

C
~

.. code-block:: c

   void recoverTree(struct TreeNode*root){struct TreeNode**st=malloc(10001*sizeof(*st)),*prev=NULL,*first=NULL,*second=NULL;int top=0;while(root||top){while(root){st[top++]=root;root=root->left;}root=st[--top];if(prev&&prev->val>root->val){if(!first)first=prev;second=root;}prev=root;root=root->right;}int tmp=first->val;first->val=second->val;second->val=tmp;free(st);}

Python
~~~~~~

.. code-block:: python

   class Solution:
       def recoverTree(self, root) -> None:
           stack=[];previous=first=second=None
           while root or stack:
               while root:stack.append(root);root=root.left
               root=stack.pop()
               if previous and previous.val>root.val:
                   if first is None:first=previous
                   second=root
               previous=root;root=root.right
           first.val,second.val=second.val,first.val

Java
~~~~

.. code-block:: java

   class Solution {public void recoverTree(TreeNode root){Deque<TreeNode>s=new ArrayDeque<>();TreeNode prev=null,first=null,second=null;while(root!=null||!s.isEmpty()){while(root!=null){s.push(root);root=root.left;}root=s.pop();if(prev!=null&&prev.val>root.val){if(first==null)first=prev;second=root;}prev=root;root=root.right;}int x=first.val;first.val=second.val;second.val=x;}}

Rust
~~~~

.. code-block:: rust

   impl Solution {pub fn recover_tree(root:&mut Option<Rc<RefCell<TreeNode>>>){let mut stack=vec![];let mut cur=root.clone();let(mut prev,mut first,mut second)=(None,None,None);while cur.is_some()||!stack.is_empty(){while let Some(node)=cur{cur=node.borrow().left.clone();stack.push(node);}let node=stack.pop().unwrap();if let Some(p)=&prev{if p.borrow().val>node.borrow().val{if first.is_none(){first=Some(p.clone())}second=Some(node.clone())}}prev=Some(node.clone());cur=node.borrow().right.clone();}let a=first.unwrap();let b=second.unwrap();let temp=a.borrow().val;a.borrow_mut().val=b.borrow().val;b.borrow_mut().val=temp;}}

Go
~~

.. code-block:: go

   func recoverTree(root *TreeNode){stack:=[]*TreeNode{};var prev,first,second *TreeNode;for root!=nil||len(stack)>0{for root!=nil{stack=append(stack,root);root=root.Left};root=stack[len(stack)-1];stack=stack[:len(stack)-1];if prev!=nil&&prev.Val>root.Val{if first==nil{first=prev};second=root};prev=root;root=root.Right};first.Val,second.Val=second.Val,first.Val}

TypeScript
~~~~~~~~~~

.. code-block:: typescript

   function recoverTree(root:TreeNode|null):void{const stack:TreeNode[]=[];let previous:TreeNode|null=null,first:TreeNode|null=null,second:TreeNode|null=null;while(root||stack.length){while(root){stack.push(root);root=root.left;}root=stack.pop()!;if(previous&&previous.val>root.val){if(!first)first=previous;second=root;}previous=root;root=root.right;}[first!.val,second!.val]=[second!.val,first!.val];}

C#
~~

.. code-block:: csharp

   public class Solution {public void RecoverTree(TreeNode root){var s=new Stack<TreeNode>();TreeNode prev=null,first=null,second=null;while(root!=null||s.Count>0){while(root!=null){s.Push(root);root=root.left;}root=s.Pop();if(prev!=null&&prev.val>root.val){if(first==null)first=prev;second=root;}prev=root;root=root.right;}int x=first.val;first.val=second.val;second.val=x;}}

Julia
~~~~~

.. code-block:: julia

   function recover_tree!(root)
       stack=Any[];previous=nothing;first=nothing;second=nothing
       while root!==nothing||!isempty(stack)
           while root!==nothing;push!(stack,root);root=root.left;end
           root=pop!(stack);if previous!==nothing&&previous.val>root.val;first===nothing&&(first=previous);second=root;end;previous=root;root=root.right
       end
       first.val,second.val=second.val,first.val;nothing
   end

R
~

.. code-block:: r

   recover_tree <- function(root){stack<-list();previous<-first<-second<-NULL;while(!is.null(root)||length(stack)>0L){while(!is.null(root)){stack[[length(stack)+1L]]<-root;root<-root$left};root<-stack[[length(stack)]];stack<-head(stack,-1L);if(!is.null(previous)&&previous$val>root$val){if(is.null(first))first<-previous;second<-root};previous<-root;root<-root$right};tmp<-first$val;first$val<-second$val;second$val<-tmp;invisible(NULL)}
