TypeScript
~~~~~~~~~~

.. code-block:: typescript

   function sortList(head: ListNode | null): ListNode | null {
       if (head === null || head.next === null) {
           return head;
       }

       let slow: ListNode = head;
       let fast: ListNode | null = head.next;
       while (fast !== null && fast.next !== null) {
           slow = slow.next!;
           fast = fast.next.next;
       }

       const right = slow.next;
       slow.next = null;
       return mergeSorted(sortList(head), sortList(right));
   }

   function mergeSorted(
       left: ListNode | null,
       right: ListNode | null,
   ): ListNode | null {
       const dummy = new ListNode();
       let tail = dummy;

       while (left !== null && right !== null) {
           if (left.val <= right.val) {
               tail.next = left;
               left = left.next;
           } else {
               tail.next = right;
               right = right.next;
           }
           tail = tail.next;
       }
       tail.next = left !== null ? left : right;
       return dummy.next;
   }

C#
~~

.. code-block:: csharp

   public class Solution {
       public ListNode SortList(ListNode head) {
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
           return MergeSorted(SortList(head), SortList(right));
       }

       private static ListNode MergeSorted(
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
           tail.next = left ?? right;
           return dummy.next;
       }
   }
