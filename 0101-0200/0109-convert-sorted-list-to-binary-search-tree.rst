0109. Convert Sorted List to Binary Search Tree
===============================================

题目信息
--------

:题号: 0109. 有序链表转换二叉搜索树
:难度: Medium
:主题: 链表、二叉搜索树、分治、中序模拟
:原题: `LeetCode 0109 <https://leetcode.com/problems/convert-sorted-list-to-binary-search-tree/>`_
:重点: 识别链表缺少随机访问这一瓶颈，用中序构造顺序让单向游标恰好在需要根值时到达中点

题目重述
--------

给定一个按非递减顺序排列的单链表 ``head``，构造并返回一棵高度平衡的二叉搜索树。输出树的中序值序列应
与链表值序列一致；高度平衡表示每个节点的左右子树高度差不超过 ``1``。

链表为空时返回空树，满足要求的树结构可能不唯一。节点总数在 ``0..2 * 10^4`` 范围内，节点值在
``-10^5..10^5`` 范围内。算法只读取链表，不修改原有 ``next`` 关系。

自建示例
--------

* 奇数长度：``head = [-6,-1,2,7,13]``，一种合法层序结果为 ``[2,-1,13,-6,null,7]``；
* 偶数长度：``head = [1,3,5,7]``，选择 ``5`` 为根可得到 ``[5,3,7,1]``，选择另一个中点也可合法；
* 单节点：``head = [4]``，返回只含节点 ``4`` 的树；
* 空链表：``head = []``，返回空树。

C++ 实现
--------

.. code-block:: cpp

   #include <vector>

   class Solution {
   private:
       TreeNode* buildFromArray(const std::vector<int>& values, int left, int right) {
           if (left > right) {
               return nullptr;
           }
           const int middle = left + (right - left) / 2;
           TreeNode* root = new TreeNode(values[middle]);
           root->left = buildFromArray(values, left, middle - 1);
           root->right = buildFromArray(values, middle + 1, right);
           return root;
       }

       TreeNode* buildByFindingMiddle(ListNode* begin, ListNode* end) {
           if (begin == end) {
               return nullptr;
           }
           ListNode* slow = begin;
           ListNode* fast = begin;
           while (fast != end && fast->next != end) {
               slow = slow->next;
               fast = fast->next->next;
           }
           TreeNode* root = new TreeNode(slow->val);
           root->left = buildByFindingMiddle(begin, slow);
           root->right = buildByFindingMiddle(slow->next, end);
           return root;
       }

       TreeNode* buildByInorderSimulation(ListNode*& cursor, int count) {
           if (count == 0) {
               return nullptr;
           }
           const int leftCount = count / 2;
           TreeNode* leftRoot = buildByInorderSimulation(cursor, leftCount);
           TreeNode* root = new TreeNode(cursor->val);
           cursor = cursor->next;
           root->left = leftRoot;
           root->right = buildByInorderSimulation(cursor, count - leftCount - 1);
           return root;
       }

   public:
       TreeNode* sortedListToBST(ListNode* head) {
           int count = 0;
           for (ListNode* node = head; node; node = node->next) {
               ++count;
           }
           ListNode* cursor = head;
           return buildByInorderSimulation(cursor, count);
       }
   };

题解
----

数组方法的缺口
~~~~~~~~~~~~~~

对有序数组，选择中点为根、递归处理左右区间，就能同时保持中序顺序和高度平衡。链表值同样有序，根也应取
当前片段的中间值；区别在于单链表只能沿 ``next`` 前进，无法通过下标在常数时间到达中点。

最直接的正确方案是先把全部值复制到数组，再调用中点分治。``buildFromArray`` 的每个状态都能随机访问
``values[middle]``，构造时间为 ``O(n)``；但转换数组额外保存了整份 ``O(n)`` 值，而返回树最终只需要这些
值各出现一次。

重复寻找中点
~~~~~~~~~~~~

若不使用数组，可以把子链表表示为半开区间 ``[begin, end)``，每次用快慢指针找到中点。``fast`` 每次走
两步、``slow`` 每次走一步；快指针抵达边界时，慢指针位于中间节点。根左侧区间为 ``[begin, slow)``，
右侧区间为 ``[slow->next, end)``。

``buildByFindingMiddle`` 不复制值，也不切断链表，因此空间状态很小。然而每层递归都要从当前区间开头重新走
到中点。树被中点划分得近似平衡，每个递归层合计扫描 ``O(n)`` 个链表节点，共 ``O(log n)`` 层，总时间
为 ``O(n log n)``。瓶颈是为获得随机访问效果而重复顺序扫描。

构造顺序转换
~~~~~~~~~~~~

最终树的中序遍历必须按链表顺序出现。与其先找根再构造孩子，可以反过来模拟中序构造过程：先构造左子树，
再用当前链表节点创建根，最后构造右子树。这样链表游标始终只向前走。

定义 ``build(count)`` 为“从 ``cursor`` 指向的位置开始，消费接下来的 ``count`` 个链表节点，构造一棵平衡
子树”。状态按以下顺序执行：

#. 左子树消费 ``leftCount = count / 2`` 个值；
#. 左递归返回后，``cursor`` 指向当前区间中点，用它创建根并前进一步；
#. 右子树消费剩余的 ``count - leftCount - 1`` 个值。

递归调用发生在根节点创建之前并不影响最终父子关系。左递归先返回 ``leftRoot``，根创建后再把这个指针接到
``root->left``；构造时间顺序与树中父节点是否先存在是两回事。

游标不变量
~~~~~~~~~~

进入 ``build(count)`` 时，``cursor`` 指向当前子树中序序列的第一个未消费值；返回时，它恰好前进
``count`` 次，指向下一段序列的开头。左递归按定义消费 ``leftCount`` 个节点，所以返回时游标自然落在根值，
不需要寻找中点。

对 ``[-6,-1,2,7,13]``，构造状态如下：

.. list-table::
   :header-rows: 1

   * - 状态规模
     - 左规模
     - 左递归后根值
     - 右规模
     - 返回后下一个值
   * - 5
     - 2
     - 2
     - 2
     - 链表结束
   * - 左侧 2
     - 1
     - -1
     - 0
     - 2
   * - 左侧 1
     - 0
     - -6
     - 0
     - -1
   * - 右侧 2
     - 1
     - 13
     - 0
     - 链表结束
   * - 右侧的左 1
     - 0
     - 7
     - 0
     - 13

每创建一个树节点只消费一次当前链表节点。先左、根、右的构造顺序也保证输出树的中序值序列与原链表完全
相同；无需复制值，也不会改变任何原链表节点的 ``next``。

平衡与主解
~~~~~~~~~~

每个 ``count`` 被拆成 ``floor(count / 2)`` 个左节点、一个根和余下右节点，两侧规模差最多 ``1``。两侧又
递归执行同样划分，因此构造高度为 ``O(log n)``，每个节点的左右子树高度差不超过 ``1``。偶数规模选择的
中点由 ``leftCount`` 决定，换另一中点也可能得到不同但合法的树。

公开入口采用中序模拟。它先用一次顺序扫描得到节点数，再用第二次顺序消费完成构造，删除了数组副本和每层
快慢指针扫描。

复杂度分析
~~~~~~~~~~

转数组法时间 ``O(n)``、数组工作空间 ``O(n)``；重复找中点法时间 ``O(n log n)``、递归栈 ``O(log n)``；
中序模拟的计数与构造各扫描一次，总时间 ``O(n)``，递归栈 ``O(log n)``。返回树的 ``O(n)`` 节点不计入
工作空间。
