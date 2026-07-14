C
~

.. code-block:: c

   static struct ListNode *merge_sorted(
       struct ListNode *left,
       struct ListNode *right
   ) {
       struct ListNode dummy = {0, NULL};
       struct ListNode *tail = &dummy;

       while (left != NULL && right != NULL) {
           if (left->val <= right->val) {
               tail->next = left;
               left = left->next;
           } else {
               tail->next = right;
               right = right->next;
           }
           tail = tail->next;
       }
       tail->next = left != NULL ? left : right;
       return dummy.next;
   }

   struct ListNode *sortList(struct ListNode *head) {
       if (head == NULL || head->next == NULL) {
           return head;
       }

       struct ListNode *slow = head;
       struct ListNode *fast = head->next;
       while (fast != NULL && fast->next != NULL) {
           slow = slow->next;
           fast = fast->next->next;
       }

       struct ListNode *right = slow->next;
       slow->next = NULL;

       struct ListNode *left_sorted = sortList(head);
       struct ListNode *right_sorted = sortList(right);
       return merge_sorted(left_sorted, right_sorted);
   }

C++
~~~

.. code-block:: cpp

   class Solution {
       static ListNode *mergeSorted(
           ListNode *left,
           ListNode *right
       ) {
           ListNode dummy;
           ListNode *tail = &dummy;

           while (left != nullptr && right != nullptr) {
               if (left->val <= right->val) {
                   tail->next = left;
                   left = left->next;
               } else {
                   tail->next = right;
                   right = right->next;
               }
               tail = tail->next;
           }
           tail->next = left != nullptr ? left : right;
           return dummy.next;
       }

   public:
       ListNode *sortList(ListNode *head) {
           if (head == nullptr || head->next == nullptr) {
               return head;
           }

           ListNode *slow = head;
           ListNode *fast = head->next;
           while (fast != nullptr && fast->next != nullptr) {
               slow = slow->next;
               fast = fast->next->next;
           }

           ListNode *right = slow->next;
           slow->next = nullptr;

           return mergeSorted(sortList(head), sortList(right));
       }
   };
