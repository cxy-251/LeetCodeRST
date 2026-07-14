TypeScript
~~~~~~~~~~

.. code-block:: typescript

   function hasCycle(head: ListNode | null): boolean {
       let slow = head;
       let fast = head;

       while (fast !== null && fast.next !== null) {
           slow = slow!.next;
           fast = fast.next.next;
           if (slow === fast) {
               return true;
           }
       }
       return false;
   }

C#
~~

.. code-block:: csharp

   public class Solution {
       public bool HasCycle(ListNode head) {
           ListNode slow = head;
           ListNode fast = head;

           while (fast != null && fast.next != null) {
               slow = slow.next;
               fast = fast.next.next;
               if (object.ReferenceEquals(slow, fast)) {
                   return true;
               }
           }
           return false;
       }
   }
