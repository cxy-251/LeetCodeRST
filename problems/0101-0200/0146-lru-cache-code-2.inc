Python
~~~~~~

.. code-block:: python

   class _Node:
       def __init__(self, key: int = 0, value: int = 0) -> None:
           self.key = key
           self.value = value
           self.prev: _Node | None = None
           self.next: _Node | None = None

   class LRUCache:
       def __init__(self, capacity: int):
           self.capacity = capacity
           self.nodes: dict[int, _Node] = {}
           self.head = _Node()
           self.tail = _Node()
           self.head.next = self.tail
           self.tail.prev = self.head

       def _detach(self, node: _Node) -> None:
           node.prev.next = node.next
           node.next.prev = node.prev

       def _push_front(self, node: _Node) -> None:
           node.next = self.head.next
           node.prev = self.head
           self.head.next.prev = node
           self.head.next = node

       def get(self, key: int) -> int:
           node = self.nodes.get(key)
           if node is None:
               return -1
           self._detach(node)
           self._push_front(node)
           return node.value

       def put(self, key: int, value: int) -> None:
           node = self.nodes.get(key)
           if node is not None:
               node.value = value
               self._detach(node)
               self._push_front(node)
               return

           if len(self.nodes) == self.capacity:
               victim = self.tail.prev
               self._detach(victim)
               del self.nodes[victim.key]

           node = _Node(key, value)
           self.nodes[key] = node
           self._push_front(node)

Java
~~~~

.. code-block:: java

   import java.util.HashMap;
   import java.util.Map;

   class LRUCache {
       private static class Node {
           int key;
           int value;
           Node prev;
           Node next;

           Node(int key, int value) {
               this.key = key;
               this.value = value;
           }
       }

       private final int capacity;
       private final Map<Integer, Node> nodes = new HashMap<>();
       private final Node head = new Node(0, 0);
       private final Node tail = new Node(0, 0);

       public LRUCache(int capacity) {
           this.capacity = capacity;
           head.next = tail;
           tail.prev = head;
       }

       private void detach(Node node) {
           node.prev.next = node.next;
           node.next.prev = node.prev;
       }

       private void pushFront(Node node) {
           node.next = head.next;
           node.prev = head;
           head.next.prev = node;
           head.next = node;
       }

       public int get(int key) {
           Node node = nodes.get(key);
           if (node == null) return -1;
           detach(node);
           pushFront(node);
           return node.value;
       }

       public void put(int key, int value) {
           Node node = nodes.get(key);
           if (node != null) {
               node.value = value;
               detach(node);
               pushFront(node);
               return;
           }

           if (nodes.size() == capacity) {
               Node victim = tail.prev;
               detach(victim);
               nodes.remove(victim.key);
           }
           Node created = new Node(key, value);
           nodes.put(key, created);
           pushFront(created);
       }
   }
