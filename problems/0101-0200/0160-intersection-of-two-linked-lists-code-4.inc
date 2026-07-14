TypeScript
~~~~~~~~~~

.. code-block:: typescript

   function getIntersectionNode(
       headA: ListNode | null,
       headB: ListNode | null,
   ): ListNode | null {
       let first = headA;
       let second = headB;

       while (first !== second) {
           first = first === null ? headB : first.next;
           second = second === null ? headA : second.next;
       }
       return first;
   }

C#
~~

.. code-block:: csharp

   public class Solution {
       public ListNode GetIntersectionNode(ListNode headA, ListNode headB) {
           ListNode first = headA;
           ListNode second = headB;

           while (!ReferenceEquals(first, second)) {
               first = first == null ? headB : first.next;
               second = second == null ? headA : second.next;
           }
           return first;
       }
   }
