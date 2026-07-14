TypeScript
~~~~~~~~~~

.. code-block:: typescript

   function detectCycle(head: ListNode | null): ListNode | null {
       let slow = head;
       let fast = head;

       while (true) {
           if (fast === null || fast.next === null) {
               return null;
           }
           slow = slow!.next;
           fast = fast.next.next;
           if (slow === fast) {
               break;
           }
       }

       let seeker = head;
       while (seeker !== slow) {
           seeker = seeker!.next;
           slow = slow!.next;
       }
       return seeker;
   }

C#
~~

.. code-block:: csharp

   public class Solution {
       public ListNode DetectCycle(ListNode head) {
           ListNode slow = head;
           ListNode fast = head;

           do {
               if (fast == null || fast.next == null) {
                   return null;
               }
               slow = slow.next;
               fast = fast.next.next;
           } while (!object.ReferenceEquals(slow, fast));

           ListNode seeker = head;
           while (!object.ReferenceEquals(seeker, slow)) {
               seeker = seeker.next;
               slow = slow.next;
           }
           return seeker;
       }
   }
