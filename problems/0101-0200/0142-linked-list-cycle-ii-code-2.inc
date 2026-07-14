Python
~~~~~~

.. code-block:: python

   class Solution:
       def detectCycle(
           self,
           head: Optional[ListNode],
       ) -> Optional[ListNode]:
           slow = head
           fast = head

           while True:
               if fast is None or fast.next is None:
                   return None
               slow = slow.next
               fast = fast.next.next
               if slow is fast:
                   break

           seeker = head
           while seeker is not slow:
               seeker = seeker.next
               slow = slow.next
           return seeker

Java
~~~~

.. code-block:: java

   public class Solution {
       public ListNode detectCycle(ListNode head) {
           ListNode slow = head;
           ListNode fast = head;

           do {
               if (fast == null || fast.next == null) {
                   return null;
               }
               slow = slow.next;
               fast = fast.next.next;
           } while (slow != fast);

           ListNode seeker = head;
           while (seeker != slow) {
               seeker = seeker.next;
               slow = slow.next;
           }
           return seeker;
       }
   }
