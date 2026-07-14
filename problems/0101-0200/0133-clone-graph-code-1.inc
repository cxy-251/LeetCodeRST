C
~

.. code-block:: c

   #include <stdlib.h>

   struct Node {
       int val;
       int numNeighbors;
       struct Node **neighbors;
   };

   static struct Node *clone_node(
       struct Node *node,
       struct Node *copies[101]
   ) {
       if (node == NULL) return NULL;
       if (copies[node->val] != NULL) return copies[node->val];

       struct Node *copy = malloc(sizeof(*copy));
       copy->val = node->val;
       copy->numNeighbors = node->numNeighbors;
       copy->neighbors = node->numNeighbors == 0
           ? NULL
           : malloc(
               (size_t)node->numNeighbors * sizeof(*copy->neighbors)
           );
       copies[node->val] = copy;

       for (int i = 0; i < node->numNeighbors; ++i) {
           copy->neighbors[i] =
               clone_node(node->neighbors[i], copies);
       }
       return copy;
   }

   struct Node *cloneGraph(struct Node *node) {
       struct Node *copies[101] = {0};
       return clone_node(node, copies);
   }

C++
~~~

.. code-block:: cpp

   #include <unordered_map>

   class Solution {
       std::unordered_map<Node*, Node*> seen;

       Node* clone(Node* node) {
           if (node == nullptr) return nullptr;
           auto known = seen.find(node);
           if (known != seen.end()) return known->second;

           Node* copy = new Node(node->val);
           seen[node] = copy;
           for (Node* neighbor : node->neighbors) {
               copy->neighbors.push_back(clone(neighbor));
           }
           return copy;
       }

   public:
       Node* cloneGraph(Node* node) {
           return clone(node);
       }
   };
