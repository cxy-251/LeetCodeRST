C
~

.. code-block:: c

   #include <stddef.h>

   struct ListNode *getIntersectionNode(
       struct ListNode *headA,
       struct ListNode *headB
   ) {
       struct ListNode *first = headA;
       struct ListNode *second = headB;

       while (first != second) {
           first = first == NULL ? headB : first->next;
           second = second == NULL ? headA : second->next;
       }
       return first;
   }

C++
~~~

.. code-block:: cpp

   class Solution {
   public:
       ListNode *getIntersectionNode(ListNode *headA, ListNode *headB) {
           ListNode *first = headA;
           ListNode *second = headB;

           while (first != second) {
               first = first == nullptr ? headB : first->next;
               second = second == nullptr ? headA : second->next;
           }
           return first;
       }
   };
