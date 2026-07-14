Julia
~~~~~

.. code-block:: julia

   function palindrome_partitions(s::String)
       n = ncodeunits(s)
       pal = falses(n, n)
       for start in n:-1:1
           for stop in start:n
               pal[start, stop] = s[start] == s[stop] &&
                   (stop - start < 2 || pal[start + 1, stop - 1])
           end
       end
       answers = Vector{Vector{String}}()
       path = String[]
       function dfs(start::Int)
           if start == n + 1
               push!(answers, copy(path))
               return
           end
           for stop in start:n
               pal[start, stop] || continue
               push!(path, String(SubString(s, start, stop)))
               dfs(stop + 1)
               pop!(path)
           end
       end
       dfs(1)
       answers
   end
