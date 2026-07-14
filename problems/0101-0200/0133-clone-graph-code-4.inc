Go
~~

.. code-block:: go

   func cloneGraph(node *Node) *Node {
       seen := make(map[*Node]*Node)

       var clone func(*Node) *Node
       clone = func(current *Node) *Node {
           if current == nil {
               return nil
           }
           if copy, ok := seen[current]; ok {
               return copy
           }

           copy := &Node{Val: current.Val}
           seen[current] = copy
           for _, neighbor := range current.Neighbors {
               copy.Neighbors = append(
                   copy.Neighbors,
                   clone(neighbor),
               )
           }
           return copy
       }

       return clone(node)
   }
