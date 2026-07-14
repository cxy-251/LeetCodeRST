TypeScript
~~~~~~~~~~

.. code-block:: typescript

   function reorderList(head: ListNode | null): void {
       if (head === null || head.next === null) return;

       let slow: ListNode = head;
       let fast: ListNode | null = head.next;
       while (fast !== null && fast.next !== null) {
           slow = slow.next!;
           fast = fast.next.next;
       }

       let second = slow.next;
       slow.next = null;

       let previous: ListNode | null = null;
       while (second !== null) {
           const following = second.next;
           second.next = previous;
           previous = second;
           second = following;
       }

       let first: ListNode | null = head;
       second = previous;
       while (second !== null) {
           const firstNext = first!.next;
           const secondNext = second.next;
           first!.next = second;
           second.next = firstNext;
           first = firstNext;
           second = secondNext;
       }
   }

C#
~~

.. code-block:: csharp

   public class Solution {
       public void ReorderList(ListNode head) {
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
               ListNode following = second.next;
               second.next = previous;
               previous = second;
               second = following;
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
