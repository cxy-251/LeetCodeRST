TypeScript
~~~~~~~~~~

.. code-block:: typescript

   function cloneGraph(node: Node | null): Node | null {
       const seen = new Map<Node, Node>();

       const clone = (current: Node | null): Node | null => {
           if (current === null) return null;
           const known = seen.get(current);
           if (known !== undefined) return known;

           const copy = new Node(current.val);
           seen.set(current, copy);
           copy.neighbors = current.neighbors.map(
               (neighbor) => clone(neighbor) as Node,
           );
           return copy;
       };

       return clone(node);
   }

C#
~~

.. code-block:: csharp

   using System.Collections.Generic;

   public class Solution {
       private readonly Dictionary<Node, Node> seen = new();

       public Node CloneGraph(Node node) {
           if (node == null) return null;
           if (seen.TryGetValue(node, out Node known)) {
               return known;
           }

           Node copy = new Node(node.val);
           seen[node] = copy;
           foreach (Node neighbor in node.neighbors) {
               copy.neighbors.Add(CloneGraph(neighbor));
           }
           return copy;
       }
   }
