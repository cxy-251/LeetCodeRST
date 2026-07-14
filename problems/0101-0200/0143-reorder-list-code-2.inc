Python
~~~~~~

.. code-block:: python

   class Solution:
       def reorderList(self, head: Optional[ListNode]) -> None:
           if head is None or head.next is None:
               return

           slow = head
           fast = head.next
           while fast is not None and fast.next is not None:
               slow = slow.next
               fast = fast.next.next

           second = slow.next
           slow.next = None

           previous = None
           while second is not None:
               following = second.next
               second.next = previous
               previous = second
               second = following

           first = head
           second = previous
           while second is not None:
               first_next = first.next
               second_next = second.next
               first.next = second
               second.next = first_next
               first = first_next
               second = second_next

Java
~~~~

.. code-block:: java

   class Solution {
       public void reorderList(ListNode head) {
           if (head == null || head.next == null) return;

           ListNode slow = head;
           ListNode fast = head.next;
           while (fast != null && fast.next != null) {
               slow = slow.next;
               fast = fast.next.next;
           }

           ListNode second = slow.next;
           slow.next = null;

           ListNode previous = null;
           while (second != null) {
               ListNode next = second.next;
               second.next = previous;
               previous = second;
               second = next;
           }

           ListNode first = head;
           second = previous;
           while (second != null) {
               ListNode firstNext = first.next;
               ListNode secondNext = second.next;
               first.next = second;
               second.next = firstNext;
               first = firstNext;
               second = secondNext;
           }
       }
   }
