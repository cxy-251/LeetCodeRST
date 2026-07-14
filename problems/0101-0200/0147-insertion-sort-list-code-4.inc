TypeScript
~~~~~~~~~~

.. code-block:: typescript

   function insertionSortList(head: ListNode | null): ListNode | null {
       if (head === null) return null;
       const dummy = new ListNode(0, head);
       let lastSorted = head;

       while (lastSorted.next !== null) {
           const current = lastSorted.next;
           if (lastSorted.val <= current.val) {
               lastSorted = current;
               continue;
           }

           let position = dummy;
           while (position.next!.val <= current.val) {
               position = position.next!;
           }
           lastSorted.next = current.next;
           current.next = position.next;
           position.next = current;
       }
       return dummy.next;
   }

C#
~~

.. code-block:: csharp

   public class Solution {
       public ListNode InsertionSortList(ListNode head) {
           if (head == null) return null;
           ListNode dummy = new(0, head);
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
