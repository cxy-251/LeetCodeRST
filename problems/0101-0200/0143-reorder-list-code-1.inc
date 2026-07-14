C
~

.. code-block:: c

   void reorderList(struct ListNode *head) {
       if (head == NULL || head->next == NULL) {
           return;
       }

       struct ListNode *slow = head;
       struct ListNode *fast = head->next;
       while (fast != NULL && fast->next != NULL) {
           slow = slow->next;
           fast = fast->next->next;
       }

       struct ListNode *second = slow->next;
       slow->next = NULL;

       struct ListNode *previous = NULL;
       while (second != NULL) {
           struct ListNode *next = second->next;
           second->next = previous;
           previous = second;
           second = next;
       }

       struct ListNode *first = head;
       second = previous;
       while (second != NULL) {
           struct ListNode *first_next = first->next;
           struct ListNode *second_next = second->next;
           first->next = second;
           second->next = first_next;
           first = first_next;
           second = second_next;
       }
   }

C++
~~~

.. code-block:: cpp

   class Solution {
   public:
       void reorderList(ListNode *head) {
           if (head == nullptr || head->next == nullptr) {
               return;
           }

           ListNode *slow = head;
           ListNode *fast = head->next;
           while (fast != nullptr && fast->next != nullptr) {
               slow = slow->next;
               fast = fast->next->next;
           }

           ListNode *second = slow->next;
           slow->next = nullptr;

           ListNode *previous = nullptr;
           while (second != nullptr) {
               ListNode *next = second->next;
               second->next = previous;
               previous = second;
               second = next;
           }

           ListNode *first = head;
           second = previous;
           while (second != nullptr) {
               ListNode *firstNext = first->next;
               ListNode *secondNext = second->next;
               first->next = second;
               second->next = firstNext;
               first = firstNext;
               second = secondNext;
           }
       }
   };
