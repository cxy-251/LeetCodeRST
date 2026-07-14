Python
~~~~~~

.. code-block:: python

   class Solution:
       def insertionSortList(
           self,
           head: Optional[ListNode],
       ) -> Optional[ListNode]:
           if head is None:
               return None

           dummy = ListNode(0, head)
           last_sorted = head
           while last_sorted.next is not None:
               current = last_sorted.next
               if last_sorted.val <= current.val:
                   last_sorted = current
                   continue

               position = dummy
               while position.next.val <= current.val:
                   position = position.next
               last_sorted.next = current.next
               current.next = position.next
               position.next = current
           return dummy.next

Java
~~~~

.. code-block:: java

   class Solution {
       public ListNode insertionSortList(ListNode head) {
           if (head == null) return null;
           ListNode dummy = new ListNode(0, head);
           ListNode lastSorted = head;

           while (lastSorted.next != null) {
               ListNode current = lastSorted.next;
               if (lastSorted.val <= current.val) {
                   lastSorted = current;
                   continue;
               }

               ListNode position = dummy;
               while (position.next.val <= current.val) {
                   position = position.next;
               }
               lastSorted.next = current.next;
               current.next = position.next;
               position.next = current;
           }
           return dummy.next;
       }
   }
