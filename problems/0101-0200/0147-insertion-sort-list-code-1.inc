C
~

.. code-block:: c

   struct ListNode *insertionSortList(struct ListNode *head) {
       struct ListNode dummy = {0, head};
       struct ListNode *last_sorted = head;
       if (head == NULL) return NULL;

       while (last_sorted->next != NULL) {
           struct ListNode *current = last_sorted->next;
           if (last_sorted->val <= current->val) {
               last_sorted = current;
               continue;
           }

           struct ListNode *position = &dummy;
           while (position->next->val <= current->val) {
               position = position->next;
           }
           last_sorted->next = current->next;
           current->next = position->next;
           position->next = current;
       }
       return dummy.next;
   }

C++
~~~

.. code-block:: cpp

   class Solution {
   public:
       ListNode *insertionSortList(ListNode *head) {
           if (head == nullptr) return nullptr;
           ListNode dummy(0, head);
           ListNode *last_sorted = head;

           while (last_sorted->next != nullptr) {
               ListNode *current = last_sorted->next;
               if (last_sorted->val <= current->val) {
                   last_sorted = current;
                   continue;
               }

               ListNode *position = &dummy;
               while (position->next->val <= current->val) {
                   position = position->next;
               }
               last_sorted->next = current->next;
               current->next = position->next;
               position->next = current;
           }
           return dummy.next;
       }
   };
