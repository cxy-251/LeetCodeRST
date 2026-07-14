TypeScript
~~~~~~~~~~

.. code-block:: typescript

   class CacheNode {
       constructor(
           public key = 0,
           public value = 0,
           public prev: CacheNode | null = null,
           public next: CacheNode | null = null,
       ) {}
   }

   class LRUCache {
       private readonly nodes = new Map<number, CacheNode>();
       private readonly head = new CacheNode();
       private readonly tail = new CacheNode();

       constructor(private readonly capacity: number) {
           this.head.next = this.tail;
           this.tail.prev = this.head;
       }

       private detach(node: CacheNode): void {
           node.prev!.next = node.next;
           node.next!.prev = node.prev;
       }

       private pushFront(node: CacheNode): void {
           node.next = this.head.next;
           node.prev = this.head;
           this.head.next!.prev = node;
           this.head.next = node;
       }

       get(key: number): number {
           const node = this.nodes.get(key);
           if (node === undefined) return -1;
           this.detach(node);
           this.pushFront(node);
           return node.value;
       }

       put(key: number, value: number): void {
           const known = this.nodes.get(key);
           if (known !== undefined) {
               known.value = value;
               this.detach(known);
               this.pushFront(known);
               return;
           }

           if (this.nodes.size === this.capacity) {
               const victim = this.tail.prev!;
               this.detach(victim);
               this.nodes.delete(victim.key);
           }
           const node = new CacheNode(key, value);
           this.nodes.set(key, node);
           this.pushFront(node);
       }
   }

C#
~~

.. code-block:: csharp

   using System.Collections.Generic;

   public class LRUCache {
       private sealed class Node {
           public int Key;
           public int Value;
           public Node Prev;
           public Node Next;

           public Node(int key = 0, int value = 0) {
               Key = key;
               Value = value;
           }
       }

       private readonly int capacity;
       private readonly Dictionary<int, Node> nodes = new();
       private readonly Node head = new();
       private readonly Node tail = new();

       public LRUCache(int capacity) {
           this.capacity = capacity;
           head.Next = tail;
           tail.Prev = head;
       }

       private void Detach(Node node) {
           node.Prev.Next = node.Next;
           node.Next.Prev = node.Prev;
       }

       private void PushFront(Node node) {
           node.Next = head.Next;
           node.Prev = head;
           head.Next.Prev = node;
           head.Next = node;
       }

       public int Get(int key) {
           if (!nodes.TryGetValue(key, out Node node)) return -1;
           Detach(node);
           PushFront(node);
           return node.Value;
       }

       public void Put(int key, int value) {
           if (nodes.TryGetValue(key, out Node known)) {
               known.Value = value;
               Detach(known);
               PushFront(known);
               return;
           }

           if (nodes.Count == capacity) {
               Node victim = tail.Prev;
               Detach(victim);
               nodes.Remove(victim.Key);
           }
           Node created = new(key, value);
           nodes[key] = created;
           PushFront(created);
       }
   }
