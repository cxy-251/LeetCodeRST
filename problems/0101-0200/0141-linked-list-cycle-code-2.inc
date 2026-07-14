Python
~~~~~~

.. code-block:: python

   class Solution:
       def hasCycle(self, head: Optional[ListNode]) -> bool:
           slow = head
           fast = head

           while fast is not None and fast.next is not None:
               slow = slow.next
               fast = fast.next.next
               if slow is fast:
                   return True
           return False

Java
~~~~

.. code-block:: java

   public class Solution {
       public boolean hasCycle(ListNode head) {
           ListNode slow = head;
           ListNode fast = head;

           while (fast != null && fast.next != null) {
               slow = slow.next;
               fast = fast.next.next;
               if (slow == fast) {
                   return true;
               }
           }
           return false;
       }
   }
