0109. Convert Sorted List to Binary Search Tree
===============================================

题目信息
--------

:题号: 0109
:难度: Medium
:主题: 链表、二叉搜索树、分治
:原题: `LeetCode 0109 <https://leetcode.com/problems/convert-sorted-list-to-binary-search-tree/>`_
:访问状态: Available
:教学重点: 中序模拟、单向游标

题目重述
--------

把升序单链表转换为高度平衡 BST，不要求修改链表。

自建示例
--------

.. code-block:: text

   输入：head = [-10,-3,0,5,9]
   输出：一种合法平衡 BST

问题抽象
--------

先求链表长度。递归先构造左半节点数，再用当前链表游标创建根并前进，最后构造右半。

主解法：中序模拟构树
------------

思路
~~~~

中序模拟构树。 中序模拟、单向游标

核心状态与不变量
~~~~~~~~~~~~~~~~

先求链表长度。递归先构造左半节点数，再用当前链表游标创建根并前进，最后构造右半。

正确性依据
~~~~~~~~~~

递归规模决定中序位置。左子树恰消费前半节点，当前游标值成为根，右子树消费后半节点；链表升序等价于构造树中序升序，且两侧规模至多差 1。

复杂度与语言边界
~~~~~~~~~~~~~~~~

求长和构造总时间 ``O(n)``；递归栈 ``O(log n)``；输出树 ``O(n)``。

核心语言实现
------------

C
~

.. code-block:: c

   #include <stdlib.h>
   static struct ListNode *cursor;
   static struct TreeNode *build(int size) {
       if (size <= 0) return NULL;
       struct TreeNode *left = build(size / 2);
       struct TreeNode *root = malloc(sizeof(*root));
       root->val = cursor->val;
       cursor = cursor->next;
       root->left = left;
       root->right = build(size - size / 2 - 1);
       return root;
   }
   struct TreeNode *sortedListToBST(struct ListNode *head) {
       int n = 0;
       for (struct ListNode *p = head; p; p = p->next) ++n;
       cursor = head;
       return build(n);
   }
C++
~~~

.. code-block:: cpp

   class Solution {
       ListNode* cur;
       TreeNode* build(int n) {
           if (n <= 0) return nullptr;
           TreeNode* left = build(n / 2);
           auto* root = new TreeNode(cur->val);
           cur = cur->next;
           root->left = left;
           root->right = build(n - n / 2 - 1);
           return root;
       }
       public: TreeNode* sortedListToBST(ListNode* head) {
           int n = 0;
           for (auto* p = head; p; p = p->next) ++n;
           cur = head;
           return build(n);
       }
   };
Python
~~~~~~

.. code-block:: python

   class Solution:

       def sortedListToBST(self, head: Optional[ListNode]) -> Optional[TreeNode]:
           n = 0
           node = head
           while node:
               n += 1
               node = node.next
           cur = head

           def build(size: int) -> Optional[TreeNode]:
               nonlocal cur
               if size <= 0:
                   return None
               left = build(size // 2)
               root = TreeNode(cur.val)
               cur = cur.next
               root.left = left
               root.right = build(size - size // 2 - 1)
               return root
           return build(n)
Java
~~~~

.. code-block:: java

   class Solution {
       private ListNode cur;
       public TreeNode sortedListToBST(ListNode head) {
           int n = 0;
           for (ListNode p = head; p != null; p = p.next) ++n;
           cur = head;
           return build(n);
       }
       private TreeNode build(int n) {
           if (n <= 0) return null;
           TreeNode left = build(n / 2);
           TreeNode root = new TreeNode(cur.val);
           cur = cur.next;
           root.left = left;
           root.right = build(n - n / 2 - 1);
           return root;
       }
   }
Rust
~~~~

.. code-block:: rust

   use std::cell::RefCell;
   use std::rc::Rc;
   impl Solution {
       pub fn sorted_list_to_bst(head: Option<Box<ListNode>>) -> Option<Rc<RefCell<TreeNode>>> {
           let mut values = Vec::new();
           let mut p = head.as_ref();
           while let Some(node) = p {
               values.push(node.val);
               p = node.next.as_ref();
           }
           fn build(a: &[i32]) -> Option<Rc<RefCell<TreeNode>>> {
               if a.is_empty() {
                   return None;
               }
               let m = a.len() / 2;
               let root = Rc::new(RefCell::new(TreeNode::new(a[m])));
               root.borrow_mut().left = build(&a[..m]);
               root.borrow_mut().right = build(&a[m + 1..]);
               Some(root)
           }
           build(&values)
       }
   }
Go
~~

.. code-block:: go

   func sortedListToBST(head *ListNode) *TreeNode {
   	n := 0
   	for p := head; p != nil; p = p.Next {
   		n++
   	}
   	cur := head
   	var build func(int) *TreeNode
   	build = func(size int) *TreeNode {
   		if size <= 0 {
   			return nil
   		}
   		left := build(size / 2)
   		root := &TreeNode{Val: cur.Val}
   		cur = cur.Next
   		root.Left = left
   		root.Right = build(size - size/2 - 1)
   		return root
   	}
   	return build(n)
   }
TypeScript
~~~~~~~~~~

.. code-block:: typescript

   function sortedListToBST(head: ListNode | null): TreeNode | null {
       let n = 0;
       for (let p = head; p !== null; p = p.next)
           n++;
       let cur = head;
       const build = (size: number): TreeNode | null => {
           if (size <= 0)
               return null;
           const left = build(Math.floor(size / 2));
           const root = new TreeNode(cur!.val);
           cur = cur!.next;
           root.left = left;
           root.right = build(size - Math.floor(size / 2) - 1);
           return root;
       };
       return build(n);
   }
C#
~~

.. code-block:: csharp

   public class Solution {
       private ListNode cur;
       public TreeNode SortedListToBST(ListNode head) {
           int n = 0;
           for (var p = head; p != null; p = p.next) ++n;
           cur = head;
           return Build(n);
       }
       private TreeNode Build(int n) {
           if (n <= 0) return null;
           var left = Build(n / 2);
           var root = new TreeNode(cur.val);
           cur = cur.next;
           root.left = left;
           root.right = Build(n - n / 2 - 1);
           return root;
       }
   }
Julia
~~~~~

.. code-block:: julia

   function sorted_list_to_bst(head::Union{ListNode, Nothing})
       n = 0
       p = head
       while p !== nothing
           n += 1
           p = p.next
       end
       cursor = Ref(head)
       function build(size::Int)
           size <= 0 && return nothing
           left = build(size ÷ 2)
           node = cursor[]
           root = TreeNode(node.val)
           cursor[] = node.next
           root.left = left
           root.right = build(size - size ÷ 2 - 1)
           root
       end
       build(n)
   end
R
~

.. code-block:: r

   sorted_list_to_bst <- function(head) {
       n <- 0L
       p <- head
       while (!is.null(p)) {
           n <- n + 1L
           p <- p$next
       }
       cursor <- new.env(parent = emptyenv())
       cursor$node <- head
       build <- function(size) {
           if (size <= 0L) return(NULL)
           left <- build(size %/% 2L)
           node <- cursor$node
           root <- new_tree_node(node$val)
           cursor$node <- node$next
           root$left <- left
           root$right <- build(size - size %/% 2L - 1L)
           root
       }
       build(n)
   }
验证计划与证据
--------------

* 固定用例覆盖正常输入、最小输入、退化结构和无解路径；
* 对小规模输入使用独立暴力或枚举基准进行静态对拍设计；
* 检查十语言函数签名、空值、下标、所有权和返回结构；
* 当前批次对 C、C++、Java、Go、TypeScript 执行编译或严格类型检查，对 Python 执行语法解析；Rust、C#、Julia、R 完成接口、括号、作用域和所有权静态检查。

关键边界
--------

* 空链表返回空树。
* 游标必须跨递归共享且只前进。

易错点
------

* 每层用快慢指针找中点导致 ``O(n log n)``。
* R 普通局部绑定不能作为递归共享游标。

本题新增知识
------------

* 中序模拟、单向游标
* 题号 0109 的主解法状态与证明

本题强化知识
------------

* 十语言接口一致性与边界契约
* 递归栈、输出载荷和语言适配器成本分层

关联题目
--------

* `0108. Convert Sorted Array to Binary Search Tree <0108-convert-sorted-array-to-binary-search-tree.rst>`_；

最小自检
--------

#. ``中序模拟构树`` 维护的核心状态是什么？
#. 终止条件为什么与题目目标等价？
#. 哪个边界最容易造成跨语言接口差异？
#. 复杂度是否包含递归栈、返回结果和语言适配器？

答案要点
~~~~~~~~

递归规模决定中序位置。左子树恰消费前半节点，当前游标值成为根，右子树消费后半节点；链表升序等价于构造树中序升序，且两侧规模至多差 1。
