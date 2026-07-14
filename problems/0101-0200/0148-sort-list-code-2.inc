Python
~~~~~~

.. code-block:: python

   class Solution:
       def sortList(
           self,
           head: Optional[ListNode],
       ) -> Optional[ListNode]:
           if head is None or head.next is None:
               return head

           slow = head
           fast = head.next
           while fast is not None and fast.next is not None:
               slow = slow.next
               fast = fast.next.next

           right = slow.next
           slow.next = None

           left_sorted = self.sortList(head)
           right_sorted = self.sortList(right)
           return self._merge(left_sorted, right_sorted)

       def _merge(
           self,
           left: Optional[ListNode],
           right: Optional[ListNode],
       ) -> Optional[ListNode]:
           dummy = ListNode()
           tail = dummy

           while left is not None and right is not None:
               if left.val <= right.val:
                   tail.next = left
                   left = left.next
               else:
                   tail.next = right
                   right = right.next
               tail = tail.next

           tail.next = left if left is not None else right
           return dummy.next

Java
~~~~

.. code-block:: java

   class Solution {
       public ListNode sortList(ListNode head) {
           if (head == null || head.next == null) {
               return head;
           }

           ListNode slow = head;
           ListNode fast = head.next;
           while (fast != null && fast.next != null) {
               slow = slow.next;
               fast = fast.next.next;
           }

           ListNode right = slow.next;
           slow.next = null;

           return mergeSorted(sortList(head), sortList(right));
       }

       private ListNode mergeSorted(
           ListNode left,
           ListNode right
       ) {
           ListNode dummy = new ListNode();
           ListNode tail = dummy;

           while (left != null && right != null) {
               if (left.val <= right.val) {
                   tail.next = left;
                   left = left.next;
               } else {
                   tail.next = right;
                   right = right.next;
               }
               tail = tail.next;
           }
           tail.next = left != null ? left : right;
           return dummy.next;
       }
   }
