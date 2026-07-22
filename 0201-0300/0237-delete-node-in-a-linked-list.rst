0237. Delete Node in a Linked List
=================================

题目信息
--------

:题号: 0237
:难度: Medium
:主题: 链表、原地修改
:原题: `LeetCode 0237 <https://leetcode.com/problems/delete-node-in-a-linked-list/>`_
:教学重点: 无头指针删除、值搬移、节点身份语义

题目重述
--------

平台只传入待删除节点 ``node``，接口为 ``void deleteNode(ListNode* node)``，不会提供链表头。平台保证 ``node`` 不是尾节点且链表值唯一。调用后，从原头遍历时该值对应元素必须消失；函数无返回值，需要原地修改节点字段与连接关系。

自建示例
--------

.. code-block:: text

   原链表：[4,7,9,2]，传入值为 9 的节点
   修改后：[4,7,2]
   说明：复制后继内容并绕过后继节点。
