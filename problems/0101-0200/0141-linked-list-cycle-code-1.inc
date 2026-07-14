C
~

.. code-block:: c

   #include <stdbool.h>

   bool hasCycle(struct ListNode *head) {
       struct ListNode *slow = head;
       struct ListNode *fast = head;

       while (fast != NULL && fast->next != NULL) {
           slow = slow->next;
           fast = fast->next->next;
           if (slow == fast) {
               return true;
           }
       }
       return false;
   }

C++
~~~

.. code-block:: cpp

   class Solution {
   public:
       bool hasCycle(ListNode *head) {
           ListNode *slow = head;
           ListNode *fast = head;

           while (fast != nullptr && fast->next != nullptr) {
               slow = slow->next;
               fast = fast->next->next;
               if (slow == fast) {
                   return true;
               }
           }
           return false;
       }
   };
