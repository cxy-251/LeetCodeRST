Python
~~~~~~

.. code-block:: python

   class Solution:
       def cloneGraph(self, node: "Node | None") -> "Node | None":
           seen: dict[Node, Node] = {}

           def clone(current: Node | None) -> Node | None:
               if current is None:
                   return None
               if current in seen:
                   return seen[current]

               copy = Node(current.val)
               seen[current] = copy
               copy.neighbors = [
                   clone(neighbor)
                   for neighbor in current.neighbors
               ]
               return copy

           return clone(node)

Java
~~~~

.. code-block:: java

   import java.util.IdentityHashMap;
   import java.util.Map;

   class Solution {
       private final Map<Node, Node> seen =
           new IdentityHashMap<>();

       public Node cloneGraph(Node node) {
           if (node == null) return null;
           if (seen.containsKey(node)) return seen.get(node);

           Node copy = new Node(node.val);
           seen.put(node, copy);
           for (Node neighbor : node.neighbors) {
               copy.neighbors.add(cloneGraph(neighbor));
           }
           return copy;
       }
   }
