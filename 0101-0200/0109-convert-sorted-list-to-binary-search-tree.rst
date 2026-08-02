0109. Convert Sorted List to Binary Search Tree
===============================================

题目信息
--------

:题号: 0109
:难度: Medium
:主题: 链表、二叉搜索树、分治、中序模拟
:原题: `LeetCode 0109 <https://leetcode.com/problems/convert-sorted-list-to-binary-search-tree/>`_
:重点: 非递减链表、高度平衡、中序顺序、多个合法结果

题目重述
--------

给定一个按非递减顺序排列的单链表 ``head``，构造并返回一棵高度平衡的二叉搜索树。树的中序遍历必须与链表中的值序列一致；高度平衡表示任意节点的左右子树高度差不超过 ``1``。链表为空时返回空树，满足条件的树可能不唯一。

链表节点数在 ``0..2 × 10^4`` 范围内，节点值在 ``-10^5..10^5`` 范围内。

自建示例
--------

.. code-block:: text

   输入：head = [-6,-1,2,7,13]
   输出（层序，合法答案之一）：[2,-1,13,-6,null,7]
   解释：输出树的中序遍历为 [-6,-1,2,7,13]，并且每个节点的左右子树高度差不超过 1。

.. code-block:: text

   输入：head = []
   输出：[]
   解释：空链表对应空树。

C++ 实现
--------

.. code-block:: cpp

   #include <vector>

   class Solution {
   private:
       TreeNode* arrayBuild(const std::vector<int>& values, int left, int right) {
           if (left > right) return nullptr;
           int middle = left + (right - left) / 2;
           return new TreeNode(values[middle],arrayBuild(values,left,middle-1),
                               arrayBuild(values,middle+1,right));
       }

       TreeNode* splitByMiddle(ListNode* head, ListNode* end) {
           if (head == end) return nullptr;
           ListNode *slow = head, *fast = head;
           while (fast != end && fast->next != end) {
               slow = slow->next; fast = fast->next->next;
           }
           TreeNode* root = new TreeNode(slow->val);
           root->left = splitByMiddle(head,slow);
           root->right = splitByMiddle(slow->next,end);
           return root;
       }

       TreeNode* inorderSimulation(ListNode*& cursor, int count) {
           if (count <= 0) return nullptr;
           int left_count = count / 2;
           TreeNode* left = inorderSimulation(cursor,left_count);
           TreeNode* root = new TreeNode(cursor->val);
           cursor = cursor->next;
           root->left = left;
           root->right = inorderSimulation(cursor,count-left_count-1);
           return root;
       }

   public:
       TreeNode* sortedListToBST(ListNode* head) {
           int count = 0;
           for (ListNode* node = head; node; node = node->next) ++count;
           return inorderSimulation(head,count);
       }
   };

题解
----

为什么不能直接复用数组中点
~~~~~~~~~~~~~~~~~~~~~~~~

链表没有常数时间随机访问。对每个子链表重新使用快慢指针寻找中点虽然正确，但各层会重复扫描节点，总时间 ``O(n log n)``。

中序构造如何避开随机访问
~~~~~~~~~~~~~~~~~~~~~~~~

BST 的中序遍历应按链表顺序消费值。先统计节点总数，再令递归状态 ``build(count)`` 构造接下来 ``count`` 个值形成的平衡树：

#. 构造前 ``count/2`` 个值的左子树；
#. 当前链表游标指向根值，创建根并前进一步；
#. 用剩余值构造右子树。

为什么左子树完成后游标恰好指向根
~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

左递归严格消费 ``left_count`` 个链表节点。进入状态时游标位于区间首值，因此返回后它恰好移动到该区间的第 ``left_count+1`` 个值，也就是选择的中点根。

.. list-table::
   :header-rows: 1

   * - 构造规模
     - 左规模
     - 根值
     - 右规模
   * - 5
     - 2
     - 0
     - 2
   * - 左侧规模 2
     - 1
     - -1
     - 0
   * - 右侧规模 2
     - 1
     - 13
     - 0

为什么树保持平衡
~~~~~~~~~~~~~~~

每个状态将 ``count`` 拆为 ``floor(count/2)`` 和 ``count-floor(count/2)-1``，两侧规模差最多 1。按规模归纳，子树平衡且高度差不超过 1，因此当前节点也平衡。

为什么中序序列不变
~~~~~~~~~~~~~~~~~~

构造顺序正是左子树、根、右子树；链表游标只向前移动，并且每创建一个树节点消费一个链表值。因此树的中序遍历与原链表值序列完全相同。

三种方法的取舍
~~~~~~~~~~~~~

转数组后调用第 108 题需要 ``O(n)`` 数组空间；快慢指针不需要数组，但重复扫描；中序模拟仅使用递归栈和一个顺序游标，达到线性时间。

复杂度来源
~~~~~~~~~~

长度统计和构造各扫描一次，时间 ``O(n)``。递归深度 ``O(log n)``，不计返回树时额外空间 ``O(log n)``。C++ 主实现只读取链表值并前移游标，不修改输入链表链接。

九语言实现
----------

C
~

.. code-block:: c

   static struct TreeNode*build(struct ListNode**cursor,int count){if(count<=0)return NULL;int left=count/2;struct TreeNode*l=build(cursor,left);struct TreeNode*x=malloc(sizeof(*x));x->val=(*cursor)->val;*cursor=(*cursor)->next;x->left=l;x->right=build(cursor,count-left-1);return x;}struct TreeNode*sortedListToBST(struct ListNode*head){int n=0;for(struct ListNode*x=head;x;x=x->next)n++;return build(&head,n);}

Python
~~~~~~

.. code-block:: python

   class Solution:
       def sortedListToBST(self, head):
           count, node = 0, head
           while node: count += 1; node = node.next
           cursor = head
           def build(size):
               nonlocal cursor
               if size <= 0: return None
               left = build(size // 2)
               root = TreeNode(cursor.val); cursor = cursor.next; root.left = left
               root.right = build(size - size//2 - 1); return root
           return build(count)

Java
~~~~

.. code-block:: java

   class Solution {ListNode cursor;TreeNode build(int n){if(n<=0)return null;TreeNode left=build(n/2);TreeNode x=new TreeNode(cursor.val);cursor=cursor.next;x.left=left;x.right=build(n-n/2-1);return x;}public TreeNode sortedListToBST(ListNode head){int n=0;for(ListNode x=head;x!=null;x=x.next)n++;cursor=head;return build(n);}}

Rust
~~~~

.. code-block:: rust

   impl Solution {pub fn sorted_list_to_bst(mut head:Option<Box<ListNode>>)->Option<Rc<RefCell<TreeNode>>>{fn length(mut x:&Option<Box<ListNode>>)->usize{let mut n=0;while let Some(node)=x{n+=1;x=&node.next}n}fn build(cursor:&mut Option<Box<ListNode>>,size:usize)->Option<Rc<RefCell<TreeNode>>>{if size==0{return None}let left=build(cursor,size/2);let mut list_node=cursor.take().unwrap();let value=list_node.val;*cursor=list_node.next.take();let mut root=TreeNode::new(value);root.left=left;root.right=build(cursor,size-size/2-1);Some(Rc::new(RefCell::new(root)))}let n=length(&head);build(&mut head,n)}}

Go
~~

.. code-block:: go

   func sortedListToBST(head *ListNode)*TreeNode{n:=0;for x:=head;x!=nil;x=x.Next{n++};cursor:=head;var build func(int)*TreeNode;build=func(size int)*TreeNode{if size<=0{return nil};left:=build(size/2);x:=&TreeNode{Val:cursor.Val};cursor=cursor.Next;x.Left=left;x.Right=build(size-size/2-1);return x};return build(n)}

TypeScript
~~~~~~~~~~

.. code-block:: typescript

   function sortedListToBST(head:ListNode|null):TreeNode|null{let n=0,cursor=head;for(let x=head;x;x=x.next)n++;const build=(size:number):TreeNode|null=>{if(size<=0)return null;const left=build(Math.floor(size/2));const x=new TreeNode(cursor!.val);cursor=cursor!.next;x.left=left;x.right=build(size-Math.floor(size/2)-1);return x;};return build(n);}

C#
~~

.. code-block:: csharp

   public class Solution {ListNode cursor;TreeNode Build(int n){if(n<=0)return null;TreeNode left=Build(n/2);var x=new TreeNode(cursor.val);cursor=cursor.next;x.left=left;x.right=Build(n-n/2-1);return x;}public TreeNode SortedListToBST(ListNode head){int n=0;for(var x=head;x!=null;x=x.next)n++;cursor=head;return Build(n);}}

Julia
~~~~~

.. code-block:: julia

   function sorted_list_to_bst(head)
       n=0;x=head;while x!==nothing;n+=1;x=x.next;end;cursor=Ref(head)
       function build(size);size<=0&&return nothing;left=build(size÷2);x=TreeNode(cursor[].val);cursor[]=cursor[].next;x.left=left;x.right=build(size-size÷2-1);x;end
       build(n)
   end

R
~

.. code-block:: r

   sorted_list_to_bst <- function(head){n<-0L;x<-head;while(!is.null(x)){n<-n+1L;x<-x$next};cursor<-head;build<-function(size){if(size<=0L)return(NULL);left<-build(size%/%2L);x<-new.env();x$val<-cursor$val;cursor<<-cursor$next;x$left<-left;x$right<-build(size-size%/%2L-1L);x};build(n)}
