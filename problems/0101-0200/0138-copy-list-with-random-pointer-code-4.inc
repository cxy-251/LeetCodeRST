Go
~~

.. code-block:: go

   func copyRandomList(head *Node) *Node {
       if head == nil {
           return nil
       }

       copies := make(map[*Node]*Node)
       for node := head; node != nil; node = node.Next {
           copies[node] = &Node{Val: node.Val}
       }
       for node := head; node != nil; node = node.Next {
           copy := copies[node]
           copy.Next = copies[node.Next]
           copy.Random = copies[node.Random]
       }
       return copies[head]
   }

TypeScript
~~~~~~~~~~

.. code-block:: typescript

   function copyRandomList(head: Node | null): Node | null {
       if (head === null) return null;

       const copies = new Map<Node, Node>();
       for (let node: Node | null = head; node !== null; node = node.next) {
           copies.set(node, new Node(node.val));
       }
       for (let node: Node | null = head; node !== null; node = node.next) {
           const copy = copies.get(node) as Node;
           copy.next = node.next === null
               ? null
               : copies.get(node.next) as Node;
           copy.random = node.random === null
               ? null
               : copies.get(node.random) as Node;
       }
       return copies.get(head) as Node;
   }
