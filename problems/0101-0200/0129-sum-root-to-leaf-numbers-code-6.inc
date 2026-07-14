Julia
~~~~~

.. code-block:: julia

   mutable struct TreeNode
       val::Int
       left::Union{Nothing,TreeNode}
       right::Union{Nothing,TreeNode}
   end

   function sum_numbers(root::Union{Nothing,TreeNode})::Int
       function dfs(
           node::Union{Nothing,TreeNode},
           prefix::Int,
       )::Int
           node === nothing && return 0
           current = prefix * 10 + node.val
           if node.left === nothing && node.right === nothing
               return current
           end
           return dfs(node.left, current) +
                  dfs(node.right, current)
       end
       return dfs(root, 0)
   end
