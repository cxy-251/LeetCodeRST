C
~

.. code-block:: c

   struct ListNode *detectCycle(struct ListNode *head) {
       struct ListNode *slow = head;
       struct ListNode *fast = head;

       do {
           if (fast == NULL || fast->next == NULL) {
               return NULL;
           }
           slow = slow->next;
           fast = fast->next->next;
       } while (slow != fast);

       struct ListNode *seeker = head;
       while (seeker != slow) {
           seeker = seeker->next;
           slow = slow->next;
       }
       return seeker;
   }

C++
~~~

.. code-block:: cpp

   class Solution {
   public:
       ListNode *detectCycle(ListNode *head) {
           ListNode *slow = head;
           ListNode *fast = head;

           do {
               if (fast == nullptr || fast->next == nullptr) {
                   return nullptr;
               }
               slow = slow->next;
               fast = fast->next->next;
           } while (slow != fast);

           ListNode *seeker = head;
           while (seeker != slow) {
               seeker = seeker->next;
               slow = slow->next;
           }
           return seeker;
       }
   };
