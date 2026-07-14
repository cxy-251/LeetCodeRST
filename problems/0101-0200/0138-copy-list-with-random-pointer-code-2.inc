C++
~~~

.. code-block:: cpp

   #include <unordered_map>

   class Solution {
   public:
       Node* copyRandomList(Node* head) {
           if (head == nullptr) return nullptr;

           std::unordered_map<Node*, Node*> copies;
           for (Node* node = head; node != nullptr; node = node->next) {
               copies[node] = new Node(node->val);
           }
           for (Node* node = head; node != nullptr; node = node->next) {
               Node* copy = copies[node];
               copy->next =
                   node->next == nullptr ? nullptr : copies[node->next];
               copy->random =
                   node->random == nullptr ? nullptr : copies[node->random];
           }
           return copies[head];
       }
   };

Python
~~~~~~

.. code-block:: python

   class Solution:
       def copyRandomList(self, head: "Node | None") -> "Node | None":
           if head is None:
               return None

           copies: dict[Node, Node] = {}
           node = head
           while node is not None:
               copies[node] = Node(node.val)
               node = node.next

           node = head
           while node is not None:
               copy = copies[node]
               copy.next = copies.get(node.next)
               copy.random = copies.get(node.random)
               node = node.next

           return copies[head]
